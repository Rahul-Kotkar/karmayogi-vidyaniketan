import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pagesService, uploadService } from '../../services/endpoints.js'
import { DEFAULT_ABOUT_DATA } from '../../data/collegeData.js'

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState('institute')
  const [data, setData] = useState(DEFAULT_ABOUT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // State for new item drafts
  const [newMissionPoint, setNewMissionPoint] = useState('')
  const [newLeader, setNewLeader] = useState({ name: '', role: '', message: '' })
  const [showAddLeader, setShowAddLeader] = useState(false)
  const [newMember, setNewMember] = useState({ sr_no: '', name: '', designation: '', representation: '' })
  const [showAddMember, setShowAddMember] = useState(false)
  const [newApproval, setNewApproval] = useState({ badge: '', title: '', description: '' })
  const [showAddApproval, setShowAddApproval] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('about')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              mission_points: Array.isArray(parsed.mission_points) && parsed.mission_points.length > 0 ? parsed.mission_points : prev.mission_points,
              leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders : prev.leaders,
              council_members: Array.isArray(parsed.council_members) && parsed.council_members.length > 0 ? parsed.council_members : prev.council_members,
              approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals
            }))
          } catch {
            // content_html was plain HTML in legacy seed
          }
        }
      } catch {
        // Fallback to DEFAULT_ABOUT_DATA
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field, val) => {
    setData(prev => ({ ...prev, [field]: val }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'about')
      setData(prev => ({ ...prev, institute_photo_url: url }))
      setMsg({ text: 'Institute photo uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Upload failed: ' + (err.message || 'Error'), type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'about',
        title: data.institute_title || 'About Karmayogi Institute of Physiotherapy',
        content_html: JSON.stringify(data),
        meta_title: `${data.institute_title || 'About Us'} | Karmayogi College of Physiotherapy`,
        meta_description: data.institute_subtitle || 'About Karmayogi Institute of Physiotherapy, Pandharpur'
      })
      setMsg({ text: 'About page updated successfully! Live website has been refreshed.', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Save failed: ' + (err.message || 'Unknown error'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // --- Dynamic Mission Points Helpers ---
  const handleAddMissionPoint = () => {
    if (!newMissionPoint.trim()) return
    setData(prev => ({ ...prev, mission_points: [...prev.mission_points, newMissionPoint.trim()] }))
    setNewMissionPoint('')
  }
  const handleRemoveMissionPoint = (idx) => {
    setData(prev => ({ ...prev, mission_points: prev.mission_points.filter((_, i) => i !== idx) }))
  }
  const handleMissionPointChange = (idx, val) => {
    setData(prev => {
      const updated = [...prev.mission_points]
      updated[idx] = val
      return { ...prev, mission_points: updated }
    })
  }

  // --- Dynamic Leaders Helpers ---
  const handleAddLeader = () => {
    if (!newLeader.name.trim() || !newLeader.role.trim()) return
    setData(prev => ({ ...prev, leaders: [...prev.leaders, { ...newLeader }] }))
    setNewLeader({ name: '', role: '', message: '' })
    setShowAddLeader(false)
  }
  const handleRemoveLeader = (idx) => {
    setData(prev => ({ ...prev, leaders: prev.leaders.filter((_, i) => i !== idx) }))
  }
  const handleLeaderChange = (idx, field, val) => {
    setData(prev => {
      const updated = [...prev.leaders]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, leaders: updated }
    })
  }

  // --- Dynamic Council Members Helpers ---
  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.designation.trim()) return
    setData(prev => ({
      ...prev,
      council_members: [
        ...prev.council_members,
        {
          ...newMember,
          sr_no: newMember.sr_no || String(prev.council_members.length + 1)
        }
      ]
    }))
    setNewMember({ sr_no: '', name: '', designation: '', representation: '' })
    setShowAddMember(false)
  }
  const handleRemoveMember = (idx) => {
    setData(prev => ({ ...prev, council_members: prev.council_members.filter((_, i) => i !== idx) }))
  }
  const handleMemberChange = (idx, field, val) => {
    setData(prev => {
      const updated = [...prev.council_members]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, council_members: updated }
    })
  }

  // --- Dynamic Approvals Helpers ---
  const handleAddApproval = () => {
    if (!newApproval.title.trim()) return
    setData(prev => ({ ...prev, approvals: [...prev.approvals, { ...newApproval }] }))
    setNewApproval({ badge: '', title: '', description: '' })
    setShowAddApproval(false)
  }
  const handleRemoveApproval = (idx) => {
    setData(prev => ({ ...prev, approvals: prev.approvals.filter((_, i) => i !== idx) }))
  }
  const handleApprovalChange = (idx, field, val) => {
    setData(prev => {
      const updated = [...prev.approvals]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, approvals: updated }
    })
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading About Page Settings...</div>
  }

  return (
    <div className="admin-page-container">
      {/* Top Header Bar */}
      <div className="admin-page-header">
        <div>
          <h1>
            About Us Content Management
            <span className="admin-page-badge">Institutional Profile</span>
          </h1>
          <p>
            Institutional history, profile overview, vision & mission, quality policy, leadership messages, governing council, and statutory approvals.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type === 'error' ? 'danger' : msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {[
          { id: 'institute', label: '1. Institute Overview' },
          { id: 'vision', label: '2. Vision & Mission' },
          { id: 'quality', label: '3. Quality Policy' },
          { id: 'leadership', label: '4. Leadership Desks' },
          { id: 'council', label: '5. Governing Council' },
          { id: 'approvals', label: '6. Affiliations & Approvals' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INSTITUTE OVERVIEW */}
      {activeTab === 'institute' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 1: Institute Overview</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Trust / Foundation Tag</label>
              <input
                type="text"
                value={data.institute_tag || ''}
                onChange={e => handleChange('institute_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="e.g. Shri Pandurang Pratishthan"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Main Institute Heading</label>
              <input
                type="text"
                value={data.institute_title || ''}
                onChange={e => handleChange('institute_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="e.g. About Karmayogi Institute of Physiotherapy"
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              Address &amp; Affiliation Subtitle Line (Left side under heading)
            </label>
            <input
              type="text"
              value={data.institute_subtitle || ''}
              onChange={e => handleChange('institute_subtitle', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="e.g. Shelve, Pandharpur, Dist: Solapur (MS) — 413304 | Approved by Govt..."
            />
          </div>

          {/* Campus Photo Settings */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 18, marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 13.5, marginBottom: 8, color: 'var(--navy-header)' }}>
              Campus / Institute Photo (Displayed on left of text)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  Photo URL (leave blank to use default campus building):
                </label>
                <input
                  type="text"
                  value={data.institute_photo_url || ''}
                  onChange={e => handleChange('institute_photo_url', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                  placeholder="https://... or upload below"
                />
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    Photo Caption:
                  </label>
                  <input
                    type="text"
                    value={data.institute_photo_caption || ''}
                    onChange={e => handleChange('institute_photo_caption', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                    placeholder="e.g. Campus & Teaching Hospital Building, Pandharpur"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Upload New Photo:</label>
                <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>{uploading ? 'Uploading...' : 'Choose Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
                {uploading && <div style={{ fontSize: 12, color: '#0b63e5', marginTop: 4 }}>Uploading photo...</div>}
              </div>
            </div>
          </div>

          {/* Paragraphs */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              Overview Paragraph 1 (Establishment &amp; Philanthropic Ethos)
            </label>
            <textarea
              rows={4}
              value={data.institute_p1 || ''}
              onChange={e => handleChange('institute_p1', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, lineHeight: 1.6 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              Overview Paragraph 2 (BPT Program, Labs &amp; Hospital Clinical Postings)
            </label>
            <textarea
              rows={4}
              value={data.institute_p2 || ''}
              onChange={e => handleChange('institute_p2', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, lineHeight: 1.6 }}
            />
          </div>
        </div>
      )}

      {/* TAB 2: VISION & MISSION */}
      {activeTab === 'vision' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 2: Vision &amp; Mission</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Tag</label>
              <input
                type="text"
                value={data.vm_tag || ''}
                onChange={e => handleChange('vm_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Title</label>
              <input
                type="text"
                value={data.vm_title || ''}
                onChange={e => handleChange('vm_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Subtitle</label>
            <input
              type="text"
              value={data.vm_subtitle || ''}
              onChange={e => handleChange('vm_subtitle', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          {/* Vision Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 18, marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--navy-header)' }}>
              Vision Heading &amp; Statement
            </label>
            <input
              type="text"
              value={data.vision_title || ''}
              onChange={e => handleChange('vision_title', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 10, fontWeight: 600 }}
              placeholder="e.g. Our Vision"
            />
            <textarea
              rows={3}
              value={data.vision_text || ''}
              onChange={e => handleChange('vision_text', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, lineHeight: 1.6 }}
              placeholder="Excellence and Innovation in Medical Education..."
            />
          </div>

          {/* Mission Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 18 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--navy-header)' }}>
              Mission Heading &amp; Bullet Points (Displayed vertically one below the other)
            </label>
            <input
              type="text"
              value={data.mission_title || ''}
              onChange={e => handleChange('mission_title', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 14, fontWeight: 600 }}
              placeholder="e.g. Our Mission"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.mission_points || []).map((pt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy-header)', width: 24, textAlign: 'center' }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={pt}
                    onChange={e => handleMissionPointChange(idx, e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMissionPoint(idx)}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', color: '#dc2626', borderColor: '#fca5a5' }}
                    title="Remove point"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <input
                type="text"
                value={newMissionPoint}
                onChange={e => setNewMissionPoint(e.target.value)}
                placeholder="Enter new mission statement point..."
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13.5 }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMissionPoint(); } }}
              />
              <button
                type="button"
                onClick={handleAddMissionPoint}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                + Add Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUALITY POLICY */}
      {activeTab === 'quality' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 3: Quality Policy</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Tag</label>
              <input
                type="text"
                value={data.qp_tag || ''}
                onChange={e => handleChange('qp_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Title</label>
              <input
                type="text"
                value={data.qp_title || ''}
                onChange={e => handleChange('qp_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Quality Policy Text</label>
            <textarea
              rows={4}
              value={data.qp_text || ''}
              onChange={e => handleChange('qp_text', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, lineHeight: 1.7 }}
            />
          </div>
        </div>
      )}

      {/* TAB 4: LEADERSHIP DESKS */}
      {activeTab === 'leadership' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 4: Leadership &amp; Institutional Desks</h3>
            <button
              type="button"
              onClick={() => setShowAddLeader(!showAddLeader)}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              {showAddLeader ? 'Cancel' : '+ Add Leader Card'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Tag</label>
              <input
                type="text"
                value={data.leadership_tag || ''}
                onChange={e => handleChange('leadership_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Title</label>
              <input
                type="text"
                value={data.leadership_title || ''}
                onChange={e => handleChange('leadership_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Subtitle</label>
            <input
              type="text"
              value={data.leadership_subtitle || ''}
              onChange={e => handleChange('leadership_subtitle', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          {/* Add Leader Form Modal/Box */}
          {showAddLeader && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: 18, marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 12px', color: '#1e3a8a' }}>New Leader Card</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Leader Name (e.g. Dr. Jane Doe)"
                  value={newLeader.name}
                  onChange={e => setNewLeader({ ...newLeader, name: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
                <input
                  type="text"
                  placeholder="Designation / Role (e.g. Dean of Academics)"
                  value={newLeader.role}
                  onChange={e => setNewLeader({ ...newLeader, role: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
              <textarea
                rows={3}
                placeholder="Institutional message or biography..."
                value={newLeader.message}
                onChange={e => setNewLeader({ ...newLeader, message: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 12 }}
              />
              <button type="button" onClick={handleAddLeader} className="btn btn-primary" style={{ fontSize: 13 }}>
                Save Leader Card
              </button>
            </div>
          )}

          {/* List of Leaders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(data.leaders || []).map((ldr, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy-header)' }}>Leader #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeader(idx)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: 12, color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Name</label>
                    <input
                      type="text"
                      value={ldr.name || ''}
                      onChange={e => handleLeaderChange(idx, 'name', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Role / Title</label>
                    <input
                      type="text"
                      value={ldr.role || ''}
                      onChange={e => handleLeaderChange(idx, 'role', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Message / Overview</label>
                  <textarea
                    rows={2}
                    value={ldr.message || ''}
                    onChange={e => handleLeaderChange(idx, 'message', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNING COUNCIL */}
      {activeTab === 'council' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 5: Governing Council &amp; Advisory Board</h3>
            <button
              type="button"
              onClick={() => setShowAddMember(!showAddMember)}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              {showAddMember ? 'Cancel' : '+ Add Council Member'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Tag</label>
              <input
                type="text"
                value={data.council_tag || ''}
                onChange={e => handleChange('council_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Title</label>
              <input
                type="text"
                value={data.council_title || ''}
                onChange={e => handleChange('council_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Subtitle</label>
            <input
              type="text"
              value={data.council_subtitle || ''}
              onChange={e => handleChange('council_subtitle', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Council Regulatory Description</label>
            <textarea
              rows={2}
              value={data.council_description || ''}
              onChange={e => handleChange('council_description', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 }}
            />
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: 18, marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 12px', color: '#1e3a8a' }}>New Council Member Row</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1.2fr 1.2fr', gap: 10, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Sr #"
                  value={newMember.sr_no}
                  onChange={e => setNewMember({ ...newMember, sr_no: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
                <input
                  type="text"
                  placeholder="Member Name"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={newMember.designation}
                  onChange={e => setNewMember({ ...newMember, designation: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
                <input
                  type="text"
                  placeholder="Representation"
                  value={newMember.representation}
                  onChange={e => setNewMember({ ...newMember, representation: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
              <button type="button" onClick={handleAddMember} className="btn btn-primary" style={{ fontSize: 13 }}>
                Add Member Row
              </button>
            </div>
          )}

          {/* Table of Members */}
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--navy-header)', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', width: '8%' }}>Sr. No.</th>
                  <th style={{ padding: '10px 12px', width: '32%' }}>Member Name</th>
                  <th style={{ padding: '10px 12px', width: '28%' }}>Designation</th>
                  <th style={{ padding: '10px 12px', width: '24%' }}>Representation</th>
                  <th style={{ padding: '10px 12px', width: '8%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(data.council_members || []).map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        value={m.sr_no || ''}
                        onChange={e => handleMemberChange(idx, 'sr_no', e.target.value)}
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 700 }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        value={m.name || ''}
                        onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 600 }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        value={m.designation || ''}
                        onChange={e => handleMemberChange(idx, 'designation', e.target.value)}
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="text"
                        value={m.representation || ''}
                        onChange={e => handleMemberChange(idx, 'representation', e.target.value)}
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: 11, color: '#dc2626', borderColor: '#fca5a5' }}
                        title="Delete member"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AFFILIATIONS & APPROVALS */}
      {activeTab === 'approvals' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>Section 6: Affiliations &amp; Government Approvals Cards</h3>
            <button
              type="button"
              onClick={() => setShowAddApproval(!showAddApproval)}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              {showAddApproval ? 'Cancel' : '+ Add Approval Card'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Tag</label>
              <input
                type="text"
                value={data.approvals_tag || ''}
                onChange={e => handleChange('approvals_tag', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Title</label>
              <input
                type="text"
                value={data.approvals_title || ''}
                onChange={e => handleChange('approvals_title', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Section Subtitle</label>
            <input
              type="text"
              value={data.approvals_subtitle || ''}
              onChange={e => handleChange('approvals_subtitle', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          {/* Add Approval Form */}
          {showAddApproval && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: 18, marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 12px', color: '#1e3a8a' }}>New Recognition / Approval Card</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Badge Tag (e.g. Affiliating University)"
                  value={newApproval.badge}
                  onChange={e => setNewApproval({ ...newApproval, badge: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
                <input
                  type="text"
                  placeholder="Authority / Approval Name"
                  value={newApproval.title}
                  onChange={e => setNewApproval({ ...newApproval, title: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
              <textarea
                rows={2}
                placeholder="Statutory description..."
                value={newApproval.description}
                onChange={e => setNewApproval({ ...newApproval, description: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 12 }}
              />
              <button type="button" onClick={handleAddApproval} className="btn btn-primary" style={{ fontSize: 13 }}>
                Save Approval Card
              </button>
            </div>
          )}

          {/* List of Approval Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {(data.approvals || []).map((appr, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy-header)' }}>Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveApproval(idx)}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: 11, color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 2 }}>Badge Tag</label>
                  <input
                    type="text"
                    value={appr.badge || ''}
                    onChange={e => handleApprovalChange(idx, 'badge', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 2 }}>Title</label>
                  <input
                    type="text"
                    value={appr.title || ''}
                    onChange={e => handleApprovalChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontWeight: 700, fontSize: 13.5 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 2 }}>Description</label>
                  <textarea
                    rows={3}
                    value={appr.description || ''}
                    onChange={e => handleApprovalChange(idx, 'description', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating / Bottom Save Bar */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ fontSize: 13.5, color: '#64748b' }}>
          Remember to click <strong>Save All Changes</strong> to update the live public website.
        </div>
        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ fontSize: 13.5, padding: '9px 24px', fontWeight: 600 }}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
