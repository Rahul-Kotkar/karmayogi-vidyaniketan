import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService } from '../../services/endpoints.js'
import {
  DEFAULT_STUDENT_CORNER_DATA,
  DEFAULT_CAMPUS_ACTIVITIES,
  DEFAULT_BEYOND_CLASSROOM_SPACES
} from '../../data/studentCornerData.js'

export default function AdminStudentCorner() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'activities'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [data, setData] = useState(DEFAULT_STUDENT_CORNER_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['activities', 'spaces', 'support', 'achievements', 'scholarships', 'council'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey })
  }

  // Load existing data from pages table
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('student-corner')
        if (page?.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              activities: Array.isArray(parsed.activities) && parsed.activities.length > 0 ? parsed.activities : prev.activities,
              spaces: Array.isArray(parsed.spaces) && parsed.spaces.length > 0 ? parsed.spaces : prev.spaces,
              support: {
                ...prev.support,
                ...(parsed.support || {}),
                items: Array.isArray(parsed.support?.items) && parsed.support.items.length > 0 ? parsed.support.items : prev.support.items
              },
              achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements,
              scholarships: {
                ...prev.scholarships,
                ...(parsed.scholarships || {}),
                items: Array.isArray(parsed.scholarships?.items) && parsed.scholarships.items.length > 0 ? parsed.scholarships.items : prev.scholarships.items
              },
              council: {
                ...prev.council,
                ...(parsed.council || {}),
                items: Array.isArray(parsed.council?.items) && parsed.council.items.length > 0 ? parsed.council.items : prev.council.items
              }
            }))
          } catch {
            // Keep default structured data
          }
        }
      } catch {
        // Fallback to default
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Save all changes
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await pagesService.save({
        slug: 'student-corner',
        title: 'Student Corner & Campus Life',
        content_html: JSON.stringify(data)
      })
      setMsg({ text: 'Student Corner changes saved successfully and synced with the public website.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save changes', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Photo Upload Handler for Activities
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const url = await uploadService.uploadFile(file, 'activities')
      if (url) {
        setFormValues(prev => ({ ...prev, image: url }))
        setMsg({ text: 'Photo uploaded successfully!', type: 'success' })
      }
    } catch (err) {
      setMsg({ text: err.message || 'Failed to upload photo', type: 'danger' })
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  // Reorder helpers
  const moveActivity = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= (data.activities?.length || 0)) return
    const updated = [...data.activities]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    setData(prev => ({ ...prev, activities: updated }))
  }

  const moveSpace = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= (data.spaces?.length || 0)) return
    const updated = [...(data.spaces || [])]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    setData(prev => ({ ...prev, spaces: updated }))
  }

  // Reset to default presets
  const resetActivitiesToDefault = () => {
    if (window.confirm('Reset activities to the 8 curated photography presets? Any unsaved edits will be replaced.')) {
      setData(prev => ({ ...prev, activities: DEFAULT_CAMPUS_ACTIVITIES }))
      setMsg({ text: 'Reset to 8 default activities with photography. Click "Save All Changes" to persist.', type: 'info' })
    }
  }

  const resetSpacesToDefault = () => {
    if (window.confirm('Reset spaces to the 7 default Beyond-the-Classroom spaces? Any unsaved edits will be replaced.')) {
      setData(prev => ({ ...prev, spaces: DEFAULT_BEYOND_CLASSROOM_SPACES }))
      setMsg({ text: 'Reset to 7 default spaces. Click "Save All Changes" to persist.', type: 'info' })
    }
  }

  // --------------------------------------------------------------------------
  // MODAL STATES FOR CLEAN INLINE EDITING
  // --------------------------------------------------------------------------
  const [modalType, setModalType] = useState(null) // 'activity', 'space', 'supportItem', 'achievement', 'scholarship', 'council'
  const [editingIndex, setEditingIndex] = useState(null)
  const [formValues, setFormValues] = useState({})

  const openModal = (type, index = null, initial = {}) => {
    setModalType(type)
    setEditingIndex(index)
    setFormValues(initial)
  }

  const closeModal = () => {
    setModalType(null)
    setEditingIndex(null)
    setFormValues({})
  }

  // Modal Submit Handlers
  const handleModalSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'activity') {
      const updated = [...(data.activities || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `act-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, activities: updated }))
    }

    if (modalType === 'space') {
      const updated = [...(data.spaces || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `space-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, spaces: updated }))
    }

    if (modalType === 'supportItem') {
      const updated = [...(data.support?.items || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `sup-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, support: { ...prev.support, items: updated } }))
    }

    if (modalType === 'achievement') {
      const updated = [...(data.achievements || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `ach-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, achievements: updated }))
    }

    if (modalType === 'scholarship') {
      const updated = [...(data.scholarships?.items || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `sch-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, scholarships: { ...prev.scholarships, items: updated } }))
    }

    if (modalType === 'council') {
      const updated = [...(data.council?.items || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `cou-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, council: { ...prev.council, items: updated } }))
    }

    closeModal()
  }

  // Delete helpers
  const deleteActivity = (idx) => {
    if (!window.confirm('Remove this activity from the list?')) return
    setData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== idx)
    }))
  }

  const deleteSpace = (idx) => {
    if (!window.confirm('Remove this campus space from the list?')) return
    setData(prev => ({
      ...prev,
      spaces: (prev.spaces || []).filter((_, i) => i !== idx)
    }))
  }

  const deleteSupportItem = (idx) => {
    if (!window.confirm('Remove this support service?')) return
    setData(prev => ({
      ...prev,
      support: {
        ...prev.support,
        items: prev.support.items.filter((_, i) => i !== idx)
      }
    }))
  }

  const deleteAchievement = (idx) => {
    if (!window.confirm('Remove this achievement?')) return
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== idx)
    }))
  }

  const deleteScholarship = (idx) => {
    if (!window.confirm('Remove this scholarship scheme?')) return
    setData(prev => ({
      ...prev,
      scholarships: {
        ...prev.scholarships,
        items: prev.scholarships.items.filter((_, i) => i !== idx)
      }
    }))
  }

  const deleteCouncilItem = (idx) => {
    if (!window.confirm('Remove this council leadership role?')) return
    setData(prev => ({
      ...prev,
      council: {
        ...prev.council,
        items: prev.council.items.filter((_, i) => i !== idx)
      }
    }))
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Student Affairs & Campus Life
            <span className="admin-page-badge">Campus Services</span>
          </h1>
          <p>
            Configure student activities, mentorship support, achievements, scholarships, and student council leadership.
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
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      {/* Clean Navigation Tabs Matching the 6 User-Side Areas */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => handleTabChange('activities')}
        >
          <span>1. Activities & Gallery</span>
          <span className="admin-tab-count">{data.activities?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'spaces' ? 'active' : ''}`}
          onClick={() => handleTabChange('spaces')}
        >
          <span>2. Campus Spaces (Beyond Classroom)</span>
          <span className="admin-tab-count">{data.spaces?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => handleTabChange('support')}
        >
          <span>3. Support & Mentorship</span>
          <span className="admin-tab-count">{data.support?.items?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => handleTabChange('achievements')}
        >
          <span>4. Achievements</span>
          <span className="admin-tab-count">{data.achievements?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
          onClick={() => handleTabChange('scholarships')}
        >
          <span>5. Scholarships</span>
          <span className="admin-tab-count">{data.scholarships?.items?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'council' ? 'active' : ''}`}
          onClick={() => handleTabChange('council')}
        >
          <span>6. Student Council</span>
          <span className="admin-tab-count">{data.council?.items?.length || 0}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading student corner data...
        </div>
      ) : (
        <>
          {/* ========================================================
              TAB 1: STUDENT ACTIVITIES & CAMPUS PHOTO GALLERY
              ======================================================== */}
          {activeTab === 'activities' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Student Activities & Campus Photo Gallery</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.activities?.length || 0} event cards with photography, blue ribbons & category badges
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={resetActivitiesToDefault}
                    title="Restore original 8 activities with curated photos"
                  >
                    Reset to 8 Defaults
                  </button>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => openModal('activity', null, { title: '', shortTitle: '', category: 'Cultural', badge: 'Cultural Extravaganza', image: '', desc: '' })}
                  >
                    + Add Activity
                  </button>
                </div>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {data.activities?.length === 0 ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No activities listed yet. Click "+ Add Activity" or "Reset to 8 Defaults".
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 85 }}>Photo</th>
                        <th style={{ width: 170 }}>Badge & Category</th>
                        <th>Activity Title & Ribbon Caption</th>
                        <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.activities.map((act, i) => (
                        <tr key={act.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            {act.image ? (
                              <img
                                src={act.image}
                                alt={act.title}
                                style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1', display: 'block' }}
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                              />
                            ) : (
                              <div style={{ width: 72, height: 48, background: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                                No Photo
                              </div>
                            )}
                          </td>
                          <td>
                            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#00458b', background: '#eff6ff', padding: '3px 8px', borderRadius: 4, border: '1px solid #bfdbfe', marginBottom: 4 }}>
                              {act.badge || act.category || 'Activity'}
                            </span>
                            <div style={{ fontSize: 11.5, color: '#64748b' }}>
                              {act.category || 'General'}
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', display: 'block', fontSize: 14, marginBottom: 4 }}>{act.title}</strong>
                            {(act.shortTitle || act.ribbon_title) && (
                              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#fff', background: '#00458b', padding: '2px 8px', borderRadius: 3, marginBottom: 6 }}>
                                Ribbon: {act.shortTitle || act.ribbon_title}
                              </div>
                            )}
                            <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>
                              {act.desc}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 4, padding: '4px 7px' }}
                              onClick={() => moveActivity(i, -1)}
                              disabled={i === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6, padding: '4px 7px' }}
                              onClick={() => moveActivity(i, 1)}
                              disabled={i === data.activities.length - 1}
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('activity', i, { ...act })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteActivity(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: CAMPUS SPACES & EXPERIENCES (BEYOND THE CLASSROOM)
              ======================================================== */}
          {activeTab === 'spaces' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Campus Spaces & Experiences (Beyond the Classroom)</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.spaces?.length || 0} spaces and facilities (Laboratories, Library, Sports, Transport, etc.)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={resetSpacesToDefault}
                    title="Restore original 7 Beyond-the-Classroom spaces"
                  >
                    Reset to 7 Defaults
                  </button>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => openModal('space', null, { title: '', icon: 'flask', desc: '' })}
                  >
                    + Add Campus Space
                  </button>
                </div>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {(!data.spaces || data.spaces.length === 0) ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No campus spaces listed. Click "+ Add Campus Space" or "Reset to 7 Defaults".
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 100 }}>Icon</th>
                        <th style={{ width: 200 }}>Space Name</th>
                        <th>Description & Details</th>
                        <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.spaces.map((sp, i) => (
                        <tr key={sp.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            <div className="campus-space-icon-box" style={{ width: 40, height: 40, margin: 0 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#00458b', textTransform: 'capitalize' }}>
                                {sp.icon || 'icon'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', fontSize: 14 }}>{sp.title}</strong>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                              {sp.desc}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 4, padding: '4px 7px' }}
                              onClick={() => moveSpace(i, -1)}
                              disabled={i === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6, padding: '4px 7px' }}
                              onClick={() => moveSpace(i, 1)}
                              disabled={i === data.spaces.length - 1}
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('space', i, { ...sp })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteSpace(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: STUDENT SUPPORT & MENTORSHIP
              ======================================================== */}
          {activeTab === 'support' && (
            <div>
              {/* Guardian Faculty Scheme Notice / Policy Box */}
              <div className="admin-card" style={{ marginBottom: 20 }}>
                <div className="admin-card-header">
                  <h3>Guardian Faculty Scheme (Teacher-Guardian)</h3>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 600 }}>Scheme Policy & Cohort Guidelines</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={data.support?.guardianScheme || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        support: { ...prev.support, guardianScheme: e.target.value }
                      }))}
                      placeholder="e.g. Each faculty member is assigned a cohort of 15–20 students..."
                    />
                  </div>
                </div>
              </div>

              {/* Support Services Directory */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>Support Cells & Counseling Services</h3>
                    <span style={{ fontSize: 13, color: '#5c6672' }}>
                      Total: {data.support?.items?.length || 0} cells
                    </span>
                  </div>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => openModal('supportItem', null, { title: '', desc: '' })}
                  >
                    + Add Support Service
                  </button>
                </div>

                <div className="admin-card-body" style={{ padding: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 260 }}>Service / Cell Name</th>
                        <th>Mandate & Operational Scope</th>
                        <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.support?.items?.map((item, i) => (
                        <tr key={item.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', fontSize: 13.5 }}>{item.title}</strong>
                          </td>
                          <td>
                            <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                              {item.desc}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('supportItem', i, { ...item })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteSupportItem(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: STUDENT ACHIEVEMENTS
              ======================================================== */}
          {activeTab === 'achievements' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Student Achievements & Honors</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.achievements?.length || 0} achievements
                  </span>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => openModal('achievement', null, { title: '', detail: '' })}
                >
                  + Add Achievement
                </button>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {data.achievements?.length === 0 ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No achievements entered yet. Click "+ Add Achievement" to add one.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 280 }}>Achievement Title</th>
                        <th>Details & Recognition</th>
                        <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.achievements.map((ach, i) => (
                        <tr key={ach.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', fontSize: 13.5 }}>{ach.title}</strong>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                              {ach.detail}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('achievement', i, { ...ach })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteAchievement(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: SCHOLARSHIPS & FREESHIPS
              ======================================================== */}
          {activeTab === 'scholarships' && (
            <div>
              {/* Portal Guidance Link */}
              <div className="admin-card" style={{ marginBottom: 20 }}>
                <div className="admin-card-header">
                  <h3>MahaDBT Portal Guidance & Student Desk</h3>
                </div>
                <div className="admin-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label style={{ fontWeight: 600 }}>Scholarship Desk Note</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.scholarships?.portalNote || ''}
                        onChange={e => setData(prev => ({
                          ...prev,
                          scholarships: { ...prev.scholarships, portalNote: e.target.value }
                        }))}
                        placeholder="e.g. Students are assisted by our dedicated College Scholarship Desk..."
                      />
                    </div>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label style={{ fontWeight: 600 }}>Official MahaDBT URL</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.scholarships?.portalUrl || ''}
                        onChange={e => setData(prev => ({
                          ...prev,
                          scholarships: { ...prev.scholarships, portalUrl: e.target.value }
                        }))}
                        placeholder="https://mahadbt.maharashtra.gov.in"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship Schemes Table */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>Statutory Scholarships & Tuition Concessions</h3>
                    <span style={{ fontSize: 13, color: '#5c6672' }}>
                      Total: {data.scholarships?.items?.length || 0} schemes
                    </span>
                  </div>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => openModal('scholarship', null, { authority: 'Govt of Maharashtra', title: '', details: '' })}
                  >
                    + Add Scholarship Scheme
                  </button>
                </div>

                <div className="admin-card-body" style={{ padding: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 170 }}>Department / Authority</th>
                        <th>Scheme Title & Concession Scope</th>
                        <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.scholarships?.items?.map((sch, i) => (
                        <tr key={sch.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', fontSize: 12.5 }}>{sch.authority}</strong>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', display: 'block', fontSize: 13.5 }}>{sch.title}</strong>
                            <div style={{ fontSize: 12.5, color: '#475569', marginTop: 3, lineHeight: 1.5 }}>
                              {sch.details}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('scholarship', i, { ...sch })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteScholarship(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: STUDENT COUNCIL
              ======================================================== */}
          {activeTab === 'council' && (
            <div>
              {/* Council Constitution Preamble */}
              <div className="admin-card" style={{ marginBottom: 20 }}>
                <div className="admin-card-header">
                  <h3>Student Council Constitution Preamble</h3>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 600 }}>Statutory Mandate (Section 40 Maharashtra Public Universities Act, 2016)</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={data.council?.preamble || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        council: { ...prev.council, preamble: e.target.value }
                      }))}
                      placeholder="The College Student Council is constituted under Section 40..."
                    />
                  </div>
                </div>
              </div>

              {/* Council Positions Table */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>Student Council Leadership Roles</h3>
                    <span style={{ fontSize: 13, color: '#5c6672' }}>
                      Total: {data.council?.items?.length || 0} roles
                    </span>
                  </div>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => openModal('council', null, { title: '', details: '' })}
                  >
                    + Add Council Role
                  </button>
                </div>

                <div className="admin-card-body" style={{ padding: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th style={{ width: 260 }}>Leadership Position</th>
                        <th>Mandate & Responsibilities</th>
                        <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.council?.items?.map((item, i) => (
                        <tr key={item.id || i}>
                          <td>
                            <span className="admin-badge badge-info">{i + 1}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#071d3a', fontSize: 13.5 }}>{item.title}</strong>
                          </td>
                          <td>
                            <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                              {item.details}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('council', i, { ...item })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteCouncilItem(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================
          CLEAN REUSABLE FORM MODAL
          ======================================================== */}
      {modalType && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <h3>
                {editingIndex !== null ? 'Edit ' : 'Add '}
                {modalType === 'activity' && 'Student Activity & Gallery Photo'}
                {modalType === 'space' && 'Campus Space (Beyond the Classroom)'}
                {modalType === 'supportItem' && 'Support Service / Cell'}
                {modalType === 'achievement' && 'Student Achievement'}
                {modalType === 'scholarship' && 'Scholarship Scheme'}
                {modalType === 'council' && 'Student Council Position'}
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={closeModal}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="admin-modal-body">
                {modalType === 'activity' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Activity Title *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Annual Cultural Fest — 'Pharma Fiesta' or 'Karmotsav'"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="admin-form-group">
                        <label style={{ fontWeight: 600 }}>
                          Bottom Blue Ribbon Caption
                          <span style={{ fontWeight: 400, color: '#64748b', fontSize: 11.5 }}> (on photo)</span>
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={formValues.shortTitle || formValues.ribbon_title || ''}
                          onChange={e => setFormValues({ ...formValues, shortTitle: e.target.value, ribbon_title: e.target.value })}
                          placeholder="e.g. Cultural Extravaganza / Dance"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label style={{ fontWeight: 600 }}>Badge / Pill Label</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={formValues.badge || ''}
                          onChange={e => setFormValues({ ...formValues, badge: e.target.value })}
                          placeholder="e.g. Cultural Extravaganza, Global Celebration..."
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Category</label>
                      <select
                        className="admin-input"
                        value={formValues.category || 'Cultural'}
                        onChange={e => setFormValues({ ...formValues, category: e.target.value })}
                      >
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Annual Professional Event">Annual Professional Event</option>
                        <option value="Global Celebration">Global Celebration</option>
                        <option value="Healthcare Outreach">Healthcare Outreach</option>
                        <option value="Community & Social Responsibility">Community & Social Responsibility</option>
                        <option value="Experiential Learning">Experiential Learning</option>
                        <option value="Research & Creativity">Research & Creativity</option>
                        <option value="Public Healthcare">Public Healthcare</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Photograph / Image URL *</span>
                        {uploadingPhoto && <span style={{ color: '#0b63e5', fontSize: 12 }}>Uploading photo...</span>}
                      </label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                        <input
                          type="url"
                          className="admin-input"
                          style={{ flex: 1 }}
                          value={formValues.image || ''}
                          onChange={e => setFormValues({ ...formValues, image: e.target.value })}
                          placeholder="Paste image URL (https://...) or choose file"
                        />
                        <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>{uploadingPhoto ? 'Uploading...' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                          />
                        </label>
                      </div>

                      {/* Interactive Live Card Preview matching Reference */}
                      {formValues.image && (
                        <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            Live Website Card Preview:
                          </div>
                          <div style={{ position: 'relative', width: 280, height: 160, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <img
                              src={formValues.image}
                              alt="Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                            {formValues.badge && (
                              <span style={{ position: 'absolute', top: 8, left: 8, background: '#fff', color: '#00458b', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {formValues.badge}
                              </span>
                            )}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#00458b', color: '#fff', padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>
                              {formValues.shortTitle || formValues.ribbon_title || formValues.title || 'Ribbon Caption'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Description & Details *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.desc || ''}
                        onChange={e => setFormValues({ ...formValues, desc: e.target.value })}
                        placeholder="Details of the event, activities, participants..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'space' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Campus Space / Facility Name *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Laboratories, Central Library, Sports Arena..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Icon</label>
                      <select
                        className="admin-input"
                        value={formValues.icon || 'flask'}
                        onChange={e => setFormValues({ ...formValues, icon: e.target.value })}
                      >
                        <option value="flask">🧪 Laboratories (Science & Robotics)</option>
                        <option value="book">📖 Central Library (Book / Study Spaces)</option>
                        <option value="home">🏫 Campus Courtyard & Activity Spaces</option>
                        <option value="sports">🎮 Sports (Playgrounds & Fitness)</option>
                        <option value="music">🎵 Cultural Activities (Music & Auditorium)</option>
                        <option value="users">👥 Student Clubs (Clubs & Committees)</option>
                        <option value="bus">🚌 Transportation (Buses & Transit)</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Description & Facilities Info *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.desc || ''}
                        onChange={e => setFormValues({ ...formValues, desc: e.target.value })}
                        placeholder="e.g. Practical spaces for discipline-specific learning and experimentation."
                      />
                    </div>

                    {/* Live Space Card Preview matching Image 1 */}
                    <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                        Live Card Preview (matching Beyond the Classroom strip):
                      </div>
                      <div className="campus-space-card" style={{ maxWidth: 300, background: '#fff' }}>
                        <div className="campus-space-icon-box">
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#00458b', textTransform: 'capitalize' }}>
                            {formValues.icon || 'icon'}
                          </span>
                        </div>
                        <h4 className="campus-space-card-title">{formValues.title || 'Space Name'}</h4>
                        <p className="campus-space-card-desc">{formValues.desc || 'Space description details...'}</p>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'supportItem' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Service / Cell Name *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Academic Remedial Coaching"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Mandate & Scope *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.desc || ''}
                        onChange={e => setFormValues({ ...formValues, desc: e.target.value })}
                        placeholder="Operational scope, scheduling, faculty supervisors..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'achievement' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Achievement Title *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. State Physiotherapy Conference Quiz"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Details & Recognition *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.detail || ''}
                        onChange={e => setFormValues({ ...formValues, detail: e.target.value })}
                        placeholder="Awarded to, recognition received, university or association name..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'scholarship' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Authority / Dept *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.authority || ''}
                        onChange={e => setFormValues({ ...formValues, authority: e.target.value })}
                        placeholder="e.g. Govt of Maharashtra, Social Justice Dept"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Scheme Title *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Concession Details & Eligibility *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.details || ''}
                        onChange={e => setFormValues({ ...formValues, details: e.target.value })}
                        placeholder="Percentage of fee concession, eligible categories, income criteria..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'council' && (
                  <>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Leadership Position *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Student Council President"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 600 }}>Mandate & Responsibilities *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.details || ''}
                        onChange={e => setFormValues({ ...formValues, details: e.target.value })}
                        placeholder="Key responsibilities, student body representation..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingIndex !== null ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
