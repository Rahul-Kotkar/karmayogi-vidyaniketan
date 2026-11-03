import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { clubsService, uploadService, setCachedClubsData, getCachedClubsData } from '../../services/endpoints.js'
import { DEFAULT_CLUBS_DATA } from '../../data/collegeData.js'
import { resolveMediaUrl } from '../../utils/mediaUrl.js'

export default function AdminClubs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [clubs, setClubs] = useState(() => {
    const cached = getCachedClubsData()
    return Array.isArray(cached) && cached.length > 0 ? cached : []
  })
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // State for adding a new club
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClubName, setNewClubName] = useState('')
  const [newClubSubtitle, setNewClubSubtitle] = useState('')

  // State for adding a member
  const [newMember, setNewMember] = useState({ name: '', designation: 'Member' })
  const [showAddMember, setShowAddMember] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // Load existing clubs from DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await clubsService.getAll()
        if (Array.isArray(data) && data.length > 0) {
          setClubs(data)
        } else {
          setClubs(DEFAULT_CLUBS_DATA)
        }
      } catch (err) {
        console.error('Failed to load clubs:', err)
        setClubs(prev => prev.length > 0 ? prev : DEFAULT_CLUBS_DATA)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Sync tab param from URL
  useEffect(() => {
    if (clubs && clubs.length > 0) {
      const tabParam = searchParams.get('tab')
      if (tabParam) {
        const cleanTab = tabParam.toLowerCase().trim()
        const idx = clubs.findIndex(c => (c.id || '').toLowerCase() === cleanTab || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanTab)
        if (idx !== -1) {
          setSelectedIdx(idx)
        }
      }
    }
  }, [searchParams, clubs])

  // Current active club
  const currentClub = clubs[selectedIdx] || clubs[0] || null

  const handleSelectClub = (idx) => {
    setSelectedIdx(idx)
    const c = clubs[idx]
    if (c?.id) {
      setSearchParams({ tab: c.id })
    }
  }

  // Edit fields of selected club
  const handleCurrentFieldChange = (field, val) => {
    setClubs(prev => {
      const updated = [...prev]
      if (updated[selectedIdx]) {
        updated[selectedIdx] = { ...updated[selectedIdx], [field]: val }
      }
      return updated
    })
  }

  // Create new club
  const handleCreateClub = () => {
    if (!newClubName.trim()) return
    const id = newClubName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const created = {
      id,
      name: newClubName.trim(),
      subtitle: newClubSubtitle.trim() || 'Co-Curricular Student Committee',
      photo_url: '/assets/about_students.png',
      photo_caption: `${newClubName.trim()} Executive Committee & Student Members`,
      info: `The ${newClubName.trim()} of Karmayogi Vidyaniketan fosters student engagement, skills development, and collaborative excellence through organized workshops, events, and campus activities.`,
      members: [
        { srno: 1, name: 'Faculty In-Charge', designation: 'Faculty Coordinator' },
        { srno: 2, name: 'Student Lead', designation: 'Student President' },
        { srno: 3, name: 'Student Member', designation: 'Secretary' }
      ]
    }
    const updated = [...clubs, created]
    setClubs(updated)
    const newIdx = updated.length - 1
    setSelectedIdx(newIdx)
    setSearchParams({ tab: id })
    setNewClubName('')
    setNewClubSubtitle('')
    setShowAddModal(false)
  }

  // Delete current club
  const handleDeleteClub = (idxToDelete) => {
    const target = clubs[idxToDelete]
    if (!window.confirm(`Are you sure you want to delete "${target?.name || 'this club'}"?`)) return
    const updated = clubs.filter((_, i) => i !== idxToDelete)
    setClubs(updated)
    const nextIdx = Math.max(0, idxToDelete - 1)
    setSelectedIdx(nextIdx)
    if (updated[nextIdx]?.id) {
      setSearchParams({ tab: updated[nextIdx].id })
    } else {
      setSearchParams({})
    }
  }

  // Reorder clubs
  const handleMoveClub = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= clubs.length) return
    const updated = [...clubs]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    setClubs(updated)
    setSelectedIdx(targetIdx)
    if (updated[targetIdx]?.id) {
      setSearchParams({ tab: updated[targetIdx].id })
    }
  }

  // Photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const url = await uploadService.uploadFile(file, 'clubs')
      if (url) {
        handleCurrentFieldChange('photo_url', url)
      }
    } catch (err) {
      alert('Failed to upload image. Please check file format and size (max 10MB).')
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Member management
  const handleMemberChange = (mIdx, field, val) => {
    setClubs(prev => {
      const updated = [...prev]
      const club = { ...updated[selectedIdx] }
      const members = [...(club.members || [])]
      members[mIdx] = { ...members[mIdx], [field]: val }
      club.members = members
      updated[selectedIdx] = club
      return updated
    })
  }

  const handleAddMember = () => {
    if (!newMember.name.trim()) return
    setClubs(prev => {
      const updated = [...prev]
      const club = { ...updated[selectedIdx] }
      const members = [...(club.members || [])]
      const nextSr = members.length + 1
      members.push({
        srno: nextSr,
        name: newMember.name.trim(),
        designation: newMember.designation.trim() || 'Member'
      })
      club.members = members
      updated[selectedIdx] = club
      return updated
    })
    setNewMember({ name: '', designation: 'Member' })
    setShowAddMember(false)
  }

  const handleDeleteMember = (mIdx) => {
    setClubs(prev => {
      const updated = [...prev]
      const club = { ...updated[selectedIdx] }
      const members = (club.members || []).filter((_, i) => i !== mIdx).map((m, idx) => ({
        ...m,
        srno: idx + 1
      }))
      club.members = members
      updated[selectedIdx] = club
      return updated
    })
  }

  const handleMoveMember = (mIdx, direction) => {
    setClubs(prev => {
      const updated = [...prev]
      const club = { ...updated[selectedIdx] }
      const members = [...(club.members || [])]
      const targetIdx = mIdx + direction
      if (targetIdx < 0 || targetIdx >= members.length) return prev
      const temp = members[mIdx]
      members[mIdx] = members[targetIdx]
      members[targetIdx] = temp
      // Renumber srno
      club.members = members.map((m, idx) => ({ ...m, srno: idx + 1 }))
      updated[selectedIdx] = club
      return updated
    })
  }

  // Save All
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await clubsService.save(clubs)
      setCachedClubsData(clubs)
      setMsg({ text: 'All Clubs and Committees saved successfully!', type: 'success' })
    } catch (err) {
      console.error('Failed to save clubs:', err)
      setMsg({ text: 'Failed to save clubs. Please check network/login session.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span className="badge badge-primary" style={{ background: '#0284c7', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
              ROW 2 NAVIGATION
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>Editable Public Content</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            Clubs & Committees Management
          </h1>
          <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>
            Manage school clubs, lab committees, technical bodies, centered group photos, info descriptions, and member rosters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {currentClub && (
            <Link
              to={`/clubs/${currentClub.id}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                fontSize: 13,
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <span>View Public Page ↗</span>
            </Link>
          )}

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
            }}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" style={{ width: 14, height: 14 }} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Feedback Alert */}
      {msg.text && (
        <div
          className={`admin-alert ${msg.type === 'error' ? 'alert-danger' : 'alert-success'}`}
          style={{
            padding: '12px 18px',
            borderRadius: 8,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: msg.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: msg.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}
        >
          <span>{msg.text}</span>
          <button
            onClick={() => setMsg({ text: '', type: '' })}
            style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p>Loading clubs and committees...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          
          {/* ========================================================
              LEFT COLUMN: CLUBS LIST & SELECTOR
              ======================================================== */}
          <div style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Clubs ({clubs.length})
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Add Club
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {clubs.map((c, idx) => {
                const isSelected = idx === selectedIdx
                const memberCount = Array.isArray(c.members) ? c.members.length : 0
                return (
                  <div
                    key={c.id || idx}
                    onClick={() => handleSelectClub(idx)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #0284c7' : '1px solid transparent',
                      background: isSelected ? '#f0f9ff' : 'transparent',
                      transition: 'all 0.15s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                      <div style={{
                        fontSize: 13.5,
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#0369a1' : '#1e293b'
                      }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                        {memberCount} Members
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => handleMoveClub(idx, -1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === 0 ? '#cbd5e1' : '#64748b',
                          cursor: idx === 0 ? 'default' : 'pointer',
                          padding: '2px 4px',
                          fontSize: 11
                        }}
                      >
                        ▲
                      </button>
                      <button
                        title="Move Down"
                        disabled={idx === clubs.length - 1}
                        onClick={() => handleMoveClub(idx, 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: idx === clubs.length - 1 ? '#cbd5e1' : '#64748b',
                          cursor: idx === clubs.length - 1 ? 'default' : 'pointer',
                          padding: '2px 4px',
                          fontSize: 11
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: SELECTED CLUB EDITOR
              ======================================================== */}
          {currentClub ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Card 1: Committee / Club Overview */}
              <div style={{
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                padding: '22px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    1. Committee Details
                  </h3>
                  <button
                    onClick={() => handleDeleteClub(selectedIdx)}
                    style={{
                      background: '#fff1f2',
                      color: '#be123c',
                      border: '1px solid #fecdd3',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Delete Club
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      Committee Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentClub.name || ''}
                      onChange={(e) => handleCurrentFieldChange('name', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                      placeholder="e.g. Cultural Club, Computer Lab Committee"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentClub.id || ''}
                      onChange={(e) => handleCurrentFieldChange('id', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                      placeholder="e.g. cultural-club"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentClub.subtitle || ''}
                    onChange={(e) => handleCurrentFieldChange('subtitle', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                    placeholder="e.g. Fostering Creative Arts, Music, Drama & Heritage Celebrations"
                  />
                </div>
              </div>

              {/* Card 2: One Group Photo Center Whole */}
              <div style={{
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                padding: '22px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                  2. One Group Photo (Centered Whole)
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
                  Upload or link the official group photograph of the committee members and faculty in-charge.
                </p>

                {/* Photo Preview Container */}
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'center',
                  marginBottom: 16
                }}>
                  {currentClub.photo_url ? (
                    <div>
                      <div style={{
                        maxWidth: 720,
                        margin: '0 auto',
                        maxHeight: 340,
                        overflow: 'hidden',
                        borderRadius: 8,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                      }}>
                        <img
                          src={resolveMediaUrl(currentClub.photo_url)}
                          alt="Group Photo Preview"
                          style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleCurrentFieldChange('photo_url', '')}
                          style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '24px 0', color: '#64748b' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 500 }}>No group photo uploaded yet</p>
                      <p style={{ margin: 0, fontSize: 12 }}>Upload a JPG, PNG, or WEBP file (max 10MB)</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      Upload New Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      style={{ fontSize: 13 }}
                    />
                    {uploadingPhoto && <span style={{ fontSize: 12, color: '#0284c7', display: 'block', marginTop: 4 }}>Uploading image...</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      Or Image URL / Path
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentClub.photo_url || ''}
                      onChange={(e) => handleCurrentFieldChange('photo_url', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                      placeholder="/assets/about_students.png or https://..."
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                    Group Photo Caption
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentClub.photo_caption || ''}
                    onChange={(e) => handleCurrentFieldChange('photo_caption', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                    placeholder="e.g. Cultural Club Committee Members & Faculty In-Charge (Academic Year 2026-27)"
                  />
                </div>
              </div>

              {/* Card 3: The Info */}
              <div style={{
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                padding: '22px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                  3. Committee Information & Objectives
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>
                  Write the detailed description, scope of work, key responsibilities, and upcoming initiatives for this committee.
                </p>
                <textarea
                  rows={5}
                  className="form-control"
                  value={currentClub.info || ''}
                  onChange={(e) => handleCurrentFieldChange('info', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}
                  placeholder="Describe the committee's mandate, activities, goals, and achievements..."
                />
              </div>

              {/* Card 4: Table with fields (srno, commiittee memeber name, designation) */}
              <div style={{
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                padding: '22px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      4. Committee Members Table
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0' }}>
                      Fields: <strong>Sr. No.</strong>, <strong>Committee Member Name</strong>, <strong>Designation</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddMember(true)}
                    style={{
                      background: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Member
                  </button>
                </div>

                {/* Add Member Form Modal / Sub-Card */}
                {showAddMember && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16
                  }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700, color: '#1e293b' }}>
                      Add New Committee Member
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          Committee Member Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Mrs. Sunita Deshmukh or Aditya Patil"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          Designation <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={newMember.designation}
                          onChange={(e) => setNewMember(prev => ({ ...prev, designation: e.target.value }))}
                          placeholder="e.g. Faculty In-Charge, Student President, Secretary"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                        />
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: '#64748b' }}>Quick Designation:</span>
                      {['Faculty In-Charge', 'Student President', 'Vice President', 'Secretary', 'Coordinator', 'Member'].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNewMember(prev => ({ ...prev, designation: preset }))}
                          style={{
                            background: '#e2e8f0',
                            border: 'none',
                            borderRadius: 4,
                            padding: '2px 8px',
                            fontSize: 11,
                            cursor: 'pointer',
                            color: '#334155'
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={handleAddMember}
                        style={{
                          background: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Add to Table
                      </button>
                      <button
                        onClick={() => setShowAddMember(false)}
                        style={{
                          background: '#e2e8f0',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12.5,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Members Table */}
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 14px', width: '10%', fontWeight: 700, color: '#475569' }}>Sr. No.</th>
                        <th style={{ padding: '10px 14px', width: '45%', fontWeight: 700, color: '#475569' }}>Committee Member Name</th>
                        <th style={{ padding: '10px 14px', width: '30%', fontWeight: 700, color: '#475569' }}>Designation</th>
                        <th style={{ padding: '10px 14px', width: '15%', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(currentClub.members) && currentClub.members.length > 0 ? (
                        currentClub.members.map((m, mIdx) => (
                          <tr key={mIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 14px', fontWeight: 600, color: '#64748b' }}>
                              <input
                                type="number"
                                value={m.srno !== undefined ? m.srno : mIdx + 1}
                                onChange={(e) => handleMemberChange(mIdx, 'srno', parseInt(e.target.value) || mIdx + 1)}
                                style={{ width: 50, padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12.5, textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="text"
                                value={m.name || ''}
                                onChange={(e) => handleMemberChange(mIdx, 'name', e.target.value)}
                                style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13 }}
                                placeholder="Member Name"
                              />
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="text"
                                value={m.designation || ''}
                                onChange={(e) => handleMemberChange(mIdx, 'designation', e.target.value)}
                                style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 13 }}
                                placeholder="Designation"
                              />
                            </td>
                            <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', gap: 4 }}>
                                <button
                                  type="button"
                                  title="Move Up"
                                  disabled={mIdx === 0}
                                  onClick={() => handleMoveMember(mIdx, -1)}
                                  style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: 4,
                                    padding: '3px 6px',
                                    cursor: mIdx === 0 ? 'default' : 'pointer',
                                    opacity: mIdx === 0 ? 0.4 : 1,
                                    fontSize: 11
                                  }}
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  title="Move Down"
                                  disabled={mIdx === currentClub.members.length - 1}
                                  onClick={() => handleMoveMember(mIdx, 1)}
                                  style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: 4,
                                    padding: '3px 6px',
                                    cursor: mIdx === currentClub.members.length - 1 ? 'default' : 'pointer',
                                    opacity: mIdx === currentClub.members.length - 1 ? 0.4 : 1,
                                    fontSize: 11
                                  }}
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  title="Delete Member"
                                  onClick={() => handleDeleteMember(mIdx)}
                                  style={{
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    border: '1px solid #fecaca',
                                    borderRadius: 4,
                                    padding: '3px 6px',
                                    cursor: 'pointer',
                                    fontSize: 12
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                            No members added yet. Click "+ Add Member" to add records to this committee table.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', color: '#64748b' }}>
              Select a club from the left menu or click "+ Add Club" to get started.
            </div>
          )}

        </div>
      )}

      {/* Add New Club Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Add New Club / Committee
            </h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Committee Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder="e.g. Science Club or Robotics Committee"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Subtitle / Focus Area
              </label>
              <input
                type="text"
                value={newClubSubtitle}
                onChange={(e) => setNewClubSubtitle(e.target.value)}
                placeholder="e.g. Hands-On Experiments & Science Exhibitions"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateClub}
                disabled={!newClubName.trim()}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: newClubName.trim() ? 'pointer' : 'not-allowed',
                  color: '#ffffff',
                  opacity: newClubName.trim() ? 1 : 0.6
                }}
              >
                Create Club
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

