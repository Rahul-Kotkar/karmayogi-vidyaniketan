import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService, setCachedCommitteesData } from '../../services/endpoints.js'
import { DEFAULT_COMMITTEES_DATA } from '../../data/collegeData.js'
import { resolveMediaUrl } from '../../utils/mediaUrl.js'

export default function AdminCommittees() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [committees, setCommittees] = useState(DEFAULT_COMMITTEES_DATA)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // State for adding a new committee
  const [showAddCommitteeModal, setShowAddCommitteeModal] = useState(false)
  const [newCommitteeName, setNewCommitteeName] = useState('')
  const [newCommitteeDesignation, setNewCommitteeDesignation] = useState('')

  // State for adding a member to selected committee
  const [newMember, setNewMember] = useState({ name: '', designation: '', role: '', contact: '' })
  const [showAddMember, setShowAddMember] = useState(false)

  // State for adding a document to selected committee
  const [newDoc, setNewDoc] = useState({ title: '', url: '', date: '', type: 'Office Order' })
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [showAddDoc, setShowAddDoc] = useState(false)

  // Helper to match URL tab param with a committee index
  const findCommitteeIdx = (tab, list) => {
    if (!tab || !list || list.length === 0) return 0
    const cleanTab = tab.toLowerCase().trim()

    // 1. Exact match on id
    let idx = list.findIndex(c => (c.id || '').toLowerCase() === cleanTab)
    if (idx !== -1) return idx

    // 2. Known alias / keywords match for standard sidebar items
    if (cleanTab === 'anti-ragging') {
      idx = list.findIndex(c => (c.id || '').includes('anti-ragging') || (c.name || '').toLowerCase().includes('anti-ragging'))
    } else if (cleanTab === 'icc') {
      idx = list.findIndex(c => (c.id || '').includes('icc') || (c.name || '').toLowerCase().includes('internal complaints') || (c.name || '').toLowerCase().includes('icc'))
    } else if (cleanTab === 'college-council') {
      idx = list.findIndex(c => (c.id || '').includes('council') || (c.name || '').toLowerCase().includes('council'))
    } else if (cleanTab === 'grievance') {
      idx = list.findIndex(c => (c.id || '').includes('grievance') || (c.name || '').toLowerCase().includes('grievance'))
    } else if (cleanTab === 'ethics') {
      idx = list.findIndex(c => (c.id || '').includes('ethics') || (c.name || '').toLowerCase().includes('ethics'))
    } else if (cleanTab === 'student-welfare') {
      idx = list.findIndex(c => (c.id || '').includes('welfare') || (c.name || '').toLowerCase().includes('welfare'))
    } else if (cleanTab === 'library') {
      idx = list.findIndex(c => (c.id || '').includes('library') || (c.name || '').toLowerCase().includes('library'))
    }
    if (idx !== -1) return idx

    // 3. Fallback slug match on committee name
    idx = list.findIndex(c => (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanTab))
    return idx !== -1 ? idx : 0
  }

  // Load existing committees from DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('committees')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCommittees(parsed)
            }
          } catch {
            // Keep default structured data
          }
        }
      } catch {
        // Fallback to DEFAULT_COMMITTEES_DATA
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Synchronize active tab from searchParams whenever searchParams or committees changes
  useEffect(() => {
    if (committees && committees.length > 0) {
      const tabParam = searchParams.get('tab')
      if (tabParam) {
        const matchedIdx = findCommitteeIdx(tabParam, committees)
        setSelectedIdx(matchedIdx)
      } else {
        setSelectedIdx(0)
      }
    }
  }, [searchParams, committees])

  const currentCommittee = committees[selectedIdx] || committees[0] || null

  const handleSelectCommittee = (idx) => {
    setSelectedIdx(idx)
    const com = committees[idx]
    if (com?.id) {
      setSearchParams({ tab: com.id })
    } else if (com?.name) {
      const slug = com.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      setSearchParams({ tab: slug })
    }
  }

  // Change top-level fields of current committee
  const handleCurrentFieldChange = (field, val) => {
    setCommittees(prev => {
      const updated = [...prev]
      if (updated[selectedIdx]) {
        updated[selectedIdx] = { ...updated[selectedIdx], [field]: val }
      }
      return updated
    })
  }

  // Create new committee
  const handleCreateCommittee = () => {
    if (!newCommitteeName.trim()) return
    const id = newCommitteeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const created = {
      id,
      name: newCommitteeName.trim(),
      designation: newCommitteeDesignation.trim() || 'Institutional Standing Committee',
      responsibilities: '1. Outline the mandate and core responsibilities of this committee.\n2. Add specific duties assigned to faculty and student members.',
      contact_details: 'Convenor: Office of Principal | Phone: +91 02186 272345 | Email: info@karmayogi.org.in | Office: College Administrative Wing',
      members: [
        { name: 'Dr. P. Deshmukh', designation: 'Principal & Professor', role: 'Chairperson', contact: 'principal@karmayogi.org.in' }
      ],
      documents: []
    }
    const updated = [...committees, created]
    setCommittees(updated)
    const newIdx = updated.length - 1
    setSelectedIdx(newIdx)
    setSearchParams({ tab: id })
    setNewCommitteeName('')
    setNewCommitteeDesignation('')
    setShowAddCommitteeModal(false)
  }

  // Delete current committee
  const handleDeleteCommittee = (idxToDelete) => {
    const target = committees[idxToDelete]
    if (!window.confirm(`Are you sure you want to delete "${target?.name || 'this committee'}"?`)) return
    const updated = committees.filter((_, i) => i !== idxToDelete)
    setCommittees(updated)
    const nextIdx = Math.max(0, idxToDelete - 1)
    setSelectedIdx(nextIdx)
    if (updated[nextIdx]?.id) {
      setSearchParams({ tab: updated[nextIdx].id })
    } else {
      setSearchParams({})
    }
  }

  // Member management for current committee
  const handleMemberChange = (mIdx, field, val) => {
    setCommittees(prev => {
      const updated = [...prev]
      const committee = { ...updated[selectedIdx] }
      const members = [...(committee.members || [])]
      members[mIdx] = { ...members[mIdx], [field]: val }
      committee.members = members
      updated[selectedIdx] = committee
      return updated
    })
  }

  const handleAddMember = () => {
    if (!newMember.name.trim()) return
    setCommittees(prev => {
      const updated = [...prev]
      const committee = { ...updated[selectedIdx] }
      committee.members = [...(committee.members || []), { ...newMember }]
      updated[selectedIdx] = committee
      return updated
    })
    setNewMember({ name: '', designation: '', role: '', contact: '' })
    setShowAddMember(false)
  }

  const handleDeleteMember = (mIdx) => {
    setCommittees(prev => {
      const updated = [...prev]
      const committee = { ...updated[selectedIdx] }
      committee.members = (committee.members || []).filter((_, i) => i !== mIdx)
      updated[selectedIdx] = committee
      return updated
    })
  }

  // Document file upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingDoc(true)
    try {
      const url = await uploadService.uploadFile(file, 'committees')
      if (url) {
        setNewDoc(prev => ({ ...prev, url }))
      }
    } catch {
      alert('Failed to upload file. Please check file format and try again.')
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleAddDocument = () => {
    if (!newDoc.title.trim()) return
    setCommittees(prev => {
      const updated = [...prev]
      const committee = { ...updated[selectedIdx] }
      committee.documents = [...(committee.documents || []), { ...newDoc }]
      updated[selectedIdx] = committee
      return updated
    })
    setNewDoc({ title: '', url: '', date: '', type: 'Office Order' })
    setShowAddDoc(false)
  }

  const handleDeleteDocument = (dIdx) => {
    setCommittees(prev => {
      const updated = [...prev]
      const committee = { ...updated[selectedIdx] }
      committee.documents = (committee.documents || []).filter((_, i) => i !== dIdx)
      updated[selectedIdx] = committee
      return updated
    })
  }

  // Global Save
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'committees',
        title: 'Institutional Committees',
        content_html: JSON.stringify(committees),
        excerpt: 'Institutional and statutory committees of Karmayogi Institute of Physiotherapy.'
      })

      // Update prehydration client cache
      setCachedCommitteesData(committees)

      setMsg({ text: 'All Committees data saved and updated successfully!', type: 'success' })
      setTimeout(() => setMsg({ text: '', type: '' }), 5000)
    } catch (err) {
      setMsg({ text: 'Failed to save committees: ' + (err.message || 'Error'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Institutional Committees Management
            <span className="admin-page-badge">Statutory & Institutional Cells</span>
          </h1>
          <p>
            Configure college committees, member compositions, responsibilities, contact details, and official circulars.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? 'Saving Committees...' : 'Save All Committees Changes'}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 16 }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
          Loading committees...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

          {/* Left Column: Committee List & Add Button */}
          <div>
            <div className="admin-card" style={{ padding: '16px 14px', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navy-header)' }}>
                    Committees ({committees.length})
                  </h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Select to edit details</span>
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => setShowAddCommitteeModal(true)}
                >
                  + Add
                </button>
              </div>

              {/* Committee Navigation Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
                {committees.map((com, idx) => {
                  const isSelected = selectedIdx === idx
                  return (
                    <button
                      key={com.id || idx}
                      type="button"
                      onClick={() => handleSelectCommittee(idx)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#1d4ed8' : '#334155',
                        background: isSelected ? '#eff6ff' : '#f8fafc',
                        border: isSelected ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          background: isSelected ? '#2563eb' : '#e2e8f0',
                          color: isSelected ? '#ffffff' : '#475569'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {com.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: isSelected ? '#3b82f6' : '#64748b', paddingLeft: 26 }}>
                        <span>{com.members?.length || 0} members</span>
                        <span>{com.documents?.length || 0} docs</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Committee Editor */}
          <div>
            {currentCommittee ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* 1. Committee Header & Basic Info */}
                <div className="admin-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                          Committee #{selectedIdx + 1}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          ID: <code style={{ color: '#0f172a' }}>{currentCommittee.id || 'unassigned'}</code>
                        </span>
                      </div>
                      <h2 style={{ fontSize: 22, margin: 0, color: 'var(--navy-header)' }}>
                        {currentCommittee.name}
                      </h2>
                    </div>
                    <div>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ fontSize: 12, padding: '6px 14px' }}
                        onClick={() => handleDeleteCommittee(selectedIdx)}
                      >
                        Delete Committee
                      </button>
                    </div>
                  </div>

                  {/* Form: Committee Name & Designation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Committee Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={currentCommittee.name}
                        onChange={(e) => handleCurrentFieldChange('name', e.target.value)}
                        placeholder="e.g. Anti-Ragging Committee & Squad"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Designation / Mandatory Category</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Statutory Mandatory Body (UGC & MUHS Mandated)"
                        value={currentCommittee.designation || ''}
                        onChange={(e) => handleCurrentFieldChange('designation', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Form: Responsibilities */}
                  <div className="admin-form-group">
                    <label className="admin-label">Responsibilities & Key Mandates</label>
                    <textarea
                      className="admin-input"
                      rows={4}
                      placeholder="Enter key objectives, rules, and duties of this committee (one per line)..."
                      value={currentCommittee.responsibilities || ''}
                      onChange={(e) => handleCurrentFieldChange('responsibilities', e.target.value)}
                      style={{ lineHeight: 1.5 }}
                    />
                  </div>

                  {/* Form: Contact Details */}
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Contact Details & Redressal Information</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      placeholder="Convenor name, contact phone, official email, and campus office location..."
                      value={currentCommittee.contact_details || ''}
                      onChange={(e) => handleCurrentFieldChange('contact_details', e.target.value)}
                      style={{ lineHeight: 1.5 }}
                    />
                  </div>
                </div>

                {/* 2. Committee Members Management */}
                <div className="admin-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 17, margin: 0, color: 'var(--navy-header)' }}>
                        Committee Members ({currentCommittee.members?.length || 0})
                      </h3>
                      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                        Manage committee composition with clear names, academic designations, roles, and contacts.
                      </p>
                    </div>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 12, padding: '6px 14px' }}
                      onClick={() => setShowAddMember(!showAddMember)}
                    >
                      {showAddMember ? 'Close Form' : '+ Add Member'}
                    </button>
                  </div>

                  {/* Add Member Card */}
                  {showAddMember && (
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                      <h4 style={{ fontSize: 14, margin: '0 0 12px', color: 'var(--navy-header)' }}>
                        Add New Committee Member
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.3fr 1.1fr 1.2fr', gap: 10, marginBottom: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Full Name *</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. Dr. P. Deshmukh"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Designation & Dept</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. Principal & Professor"
                            value={newMember.designation}
                            onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Role in Committee</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. Chairperson"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Contact / Email</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. principal@karmayogi.org.in"
                            value={newMember.contact}
                            onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="admin-btn admin-btn-primary" style={{ fontSize: 12, padding: '6px 16px' }} onClick={handleAddMember}>
                          Add to Committee
                        </button>
                        <button className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setShowAddMember(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Members Table */}
                  {currentCommittee.members && currentCommittee.members.length > 0 ? (
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                      {/* Table Column Headers */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1.4fr 1.3fr 1.1fr 1.2fr 44px',
                        gap: 8,
                        padding: '10px 12px',
                        background: '#f1f5f9',
                        borderBottom: '1px solid #cbd5e1',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#475569',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        <span style={{ textAlign: 'center' }}>#</span>
                        <span>Full Name</span>
                        <span>Designation & Dept</span>
                        <span>Role in Committee</span>
                        <span>Email / Contact</span>
                        <span style={{ textAlign: 'center' }}>Del</span>
                      </div>

                      {/* Member Rows */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {currentCommittee.members.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '40px 1.4fr 1.3fr 1.1fr 1.2fr 44px',
                              gap: 8,
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: mIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                              borderBottom: mIdx === currentCommittee.members.length - 1 ? 'none' : '1px solid #e2e8f0'
                            }}
                          >
                            <span style={{ fontWeight: 700, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                              {mIdx + 1}
                            </span>
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontSize: 13, padding: '7px 10px', height: 36 }}
                              placeholder="Name"
                              value={m.name || ''}
                              onChange={(e) => handleMemberChange(mIdx, 'name', e.target.value)}
                            />
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontSize: 13, padding: '7px 10px', height: 36 }}
                              placeholder="Designation"
                              value={m.designation || ''}
                              onChange={(e) => handleMemberChange(mIdx, 'designation', e.target.value)}
                            />
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontSize: 13, padding: '7px 10px', height: 36 }}
                              placeholder="Role"
                              value={m.role || ''}
                              onChange={(e) => handleMemberChange(mIdx, 'role', e.target.value)}
                            />
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontSize: 13, padding: '7px 10px', height: 36 }}
                              placeholder="Contact"
                              value={m.contact || ''}
                              onChange={(e) => handleMemberChange(mIdx, 'contact', e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(mIdx)}
                              title="Remove member"
                              style={{
                                border: '1px solid #fecaca',
                                background: '#fef2f2',
                                color: '#dc2626',
                                borderRadius: 4,
                                padding: '6px 0',
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                                textAlign: 'center',
                                lineHeight: 1
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '28px', color: '#64748b', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6 }}>
                      No members added yet. Click <strong>+ Add Member</strong> above to add members.
                    </div>
                  )}
                </div>

                {/* 3. Official Documents Management */}
                <div className="admin-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 17, margin: 0, color: 'var(--navy-header)' }}>
                        Official Documents & Notifications ({currentCommittee.documents?.length || 0})
                      </h3>
                      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                        Upload or link committee formation orders, meeting minutes, and regulatory guidelines.
                      </p>
                    </div>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 12, padding: '6px 14px' }}
                      onClick={() => setShowAddDoc(!showAddDoc)}
                    >
                      {showAddDoc ? 'Close Form' : '+ Add Document'}
                    </button>
                  </div>

                  {/* Add Document Form */}
                  {showAddDoc && (
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                      <h4 style={{ fontSize: 14, margin: '0 0 12px', color: 'var(--navy-header)' }}>
                        Add New Official Document
                      </h4>
                      <div className="admin-form-group">
                        <label className="admin-label">Document Title *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Committee Constitution Order 2024-25"
                          value={newDoc.title}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Document Type</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="Office Order / Minutes / Guidelines"
                            value={newDoc.type}
                            onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Date / Academic Year</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. July 2024 or 2024-25"
                            value={newDoc.date}
                            onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">PDF File Attachment or Web Link</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="/uploads/committees/... or document URL"
                            value={newDoc.url}
                            onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                          />
                          <label className="admin-btn admin-btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <span>{uploadingDoc ? 'Uploading...' : 'Choose PDF'}</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
                              disabled={uploadingDoc}
                            />
                          </label>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="admin-btn admin-btn-primary" style={{ fontSize: 12, padding: '6px 16px' }} onClick={handleAddDocument}>
                          Save Document
                        </button>
                        <button className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setShowAddDoc(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Documents List */}
                  {currentCommittee.documents && currentCommittee.documents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {currentCommittee.documents.map((doc, dIdx) => (
                        <div
                          key={dIdx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--navy-header)', fontSize: 14 }}>
                              {doc.title}
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                              <span style={{ fontWeight: 600, color: '#475569' }}>{doc.type}</span> &bull; {doc.date || 'Current'} &bull;{' '}
                              {doc.url && doc.url !== '#' ? (
                                <a
                                  href={resolveMediaUrl(doc.url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                                >
                                  View Attached File
                                </a>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>No file attached</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(dIdx)}
                              className="admin-btn admin-btn-danger"
                              style={{ fontSize: 12, padding: '4px 10px' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '28px', color: '#64748b', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6 }}>
                      No documents added yet. Click <strong>+ Add Document</strong> above to attach notifications or orders.
                    </div>
                  )}
                </div>

                {/* Bottom Save Reminder */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6 }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>
                    Finished making changes to <strong>{currentCommittee.name}</strong>? Don't forget to save.
                  </span>
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={handleSaveAll}
                    disabled={saving}
                    style={{ fontWeight: 600, padding: '8px 18px', fontSize: 13 }}
                  >
                    {saving ? 'Saving Changes...' : 'Save All Committees Changes'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="admin-card" style={{ textAlign: 'center', padding: 50, color: '#64748b' }}>
                No committee selected. Click "+ Add" to create one.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: Add New Committee */}
      {showAddCommitteeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: 8, padding: 24, maxWidth: 520, width: '92%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, margin: '0 0 14px', color: 'var(--navy-header)' }}>
              Add New Institutional Committee
            </h3>
            <div className="admin-form-group">
              <label className="admin-label">Committee Name *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Infection Control & Hospital Safety Committee"
                value={newCommitteeName}
                onChange={(e) => setNewCommitteeName(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Designation / Statutory Category</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Clinical Safety & Infection Prevention Cell"
                value={newCommitteeDesignation}
                onChange={(e) => setNewCommitteeDesignation(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowAddCommitteeModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleCreateCommittee}
              >
                Create Committee
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
