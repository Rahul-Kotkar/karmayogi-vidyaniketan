import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { pagesService, uploadService } from '../../services/endpoints.js'
import {
  DEFAULT_STUDENT_CORNER_DATA,
  DEFAULT_CULTURAL_EVENTS,
  DEFAULT_STUDENT_CLUBS,
  DEFAULT_FIELD_TRIPS,
  DEFAULT_COMPETITIONS,
  DEFAULT_STUDENT_ACHIEVEMENTS,
  DEFAULT_STUDENT_HOUSES,
  DEFAULT_STUDENT_COUNCIL
} from '../../data/studentCornerData.js'

export default function AdminStudentCorner() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'cultural'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [data, setData] = useState(DEFAULT_STUDENT_CORNER_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Modal edit states
  const [modalType, setModalType] = useState(null) // 'cultural', 'club', 'trip', 'competition', 'achievement', 'house', 'council'
  const [editingIndex, setEditingIndex] = useState(null)
  const [formValues, setFormValues] = useState({})

  // Sync tab with query param
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['cultural', 'clubs', 'field-trips', 'competitions', 'achievements', 'houses-council', 'sports'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey })
  }

  // Load existing data from backend pages table
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
              cultural: Array.isArray(parsed.cultural) && parsed.cultural.length > 0 ? parsed.cultural : prev.cultural,
              clubs: Array.isArray(parsed.clubs) && parsed.clubs.length > 0 ? parsed.clubs : prev.clubs,
              fieldTrips: Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0 ? parsed.fieldTrips : prev.fieldTrips,
              competitions: Array.isArray(parsed.competitions) && parsed.competitions.length > 0 ? parsed.competitions : prev.competitions,
              achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements,
              houses: Array.isArray(parsed.houses) && parsed.houses.length > 0 ? parsed.houses : prev.houses,
              council: Array.isArray(parsed.council) && parsed.council.length > 0 ? parsed.council : prev.council
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

  // Save changes to backend
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await pagesService.save({
        slug: 'student-corner',
        title: 'Student Life, Activities & Achievements',
        content_html: JSON.stringify(data)
      })
      setMsg({ text: 'Student Life changes saved successfully and synced with the public website.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save changes', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Modal helpers
  const openModal = (type, index = null, initial = {}) => {
    setModalType(type)
    setEditingIndex(index)
    setFormValues({ ...initial })
  }

  const closeModal = () => {
    setModalType(null)
    setEditingIndex(null)
    setFormValues({})
  }

  const handleModalSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'cultural') {
      const updated = [...(data.cultural || [])]
      const highlightsArray = typeof formValues.highlights === 'string'
        ? formValues.highlights.split('\n').map(s => s.trim()).filter(Boolean)
        : (formValues.highlights || [])

      const item = { ...formValues, highlights: highlightsArray }
      if (editingIndex !== null) {
        updated[editingIndex] = item
      } else {
        updated.push({ id: `cult-${Date.now()}`, ...item })
      }
      setData(prev => ({ ...prev, cultural: updated }))
    }

    if (modalType === 'club') {
      const updated = [...(data.clubs || [])]
      const activitiesArray = typeof formValues.activities === 'string'
        ? formValues.activities.split('\n').map(s => s.trim()).filter(Boolean)
        : (formValues.activities || [])

      const item = { ...formValues, activities: activitiesArray }
      if (editingIndex !== null) {
        updated[editingIndex] = item
      } else {
        updated.push({ id: `club-${Date.now()}`, ...item })
      }
      setData(prev => ({ ...prev, clubs: updated }))
    }

    if (modalType === 'trip') {
      const updated = [...(data.fieldTrips || [])]
      const highlightsArray = typeof formValues.highlights === 'string'
        ? formValues.highlights.split('\n').map(s => s.trim()).filter(Boolean)
        : (formValues.highlights || [])

      const item = { ...formValues, highlights: highlightsArray }
      if (editingIndex !== null) {
        updated[editingIndex] = item
      } else {
        updated.push({ id: `trip-${Date.now()}`, ...item })
      }
      setData(prev => ({ ...prev, fieldTrips: updated }))
    }

    if (modalType === 'competition') {
      const updated = [...(data.competitions || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `comp-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, competitions: updated }))
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

    if (modalType === 'house') {
      const updated = [...(data.houses || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `house-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, houses: updated }))
    }

    if (modalType === 'council') {
      const updated = [...(data.council || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `role-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, council: updated }))
    }

    closeModal()
  }

  // Deletion helpers
  const deleteItem = (key, idx, name = 'item') => {
    if (!window.confirm(`Are you sure you want to remove this ${name}?`)) return
    setData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx)
    }))
  }

  // Reset helpers
  const resetSection = (key, defaultArr, title) => {
    if (window.confirm(`Reset ${title} to default presets? Any unsaved edits in this section will be replaced.`)) {
      setData(prev => ({ ...prev, [key]: defaultArr }))
      setMsg({ text: `Reset ${title} to defaults. Click "Save All Changes" to persist.`, type: 'info' })
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Student Life &amp; Activities Management
            <span className="admin-page-badge">Campus Services</span>
          </h1>
          <p>
            Configure cultural events, clubs, field trips, olympiad competitions, achievements, houses, and student council.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link
            to="/student-life"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Preview Public Page</span>
          </Link>
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

      {/* Clean Navigation Tabs Matching the 6 Student Life Dropdown Items */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'cultural' ? 'active' : ''}`}
          onClick={() => handleTabChange('cultural')}
        >
          <span>🎭 1. Cultural Activities</span>
          <span className="admin-tab-count">{data.cultural?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => handleTabChange('clubs')}
        >
          <span>🔬 2. Clubs &amp; Activities</span>
          <span className="admin-tab-count">{data.clubs?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'field-trips' ? 'active' : ''}`}
          onClick={() => handleTabChange('field-trips')}
        >
          <span>🚌 3. Field Trips &amp; Excursions</span>
          <span className="admin-tab-count">{data.fieldTrips?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'competitions' ? 'active' : ''}`}
          onClick={() => handleTabChange('competitions')}
        >
          <span>🏆 4. Competitions &amp; Olympiads</span>
          <span className="admin-tab-count">{data.competitions?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => handleTabChange('achievements')}
        >
          <span>🌟 5. Student Achievements</span>
          <span className="admin-tab-count">{data.achievements?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'houses-council' ? 'active' : ''}`}
          onClick={() => handleTabChange('houses-council')}
        >
          <span>🛡️ 6. Houses &amp; Council</span>
          <span className="admin-tab-count">{(data.houses?.length || 0) + (data.council?.length || 0)}</span>
        </button>
        <Link
          to="/admin/facilities?tab=sports"
          className="admin-tab-btn"
          style={{ textDecoration: 'none', background: '#eff6ff', color: '#1d4ed8' }}
        >
          <span>⚽ Sports &amp; Athletics →</span>
        </Link>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: CULTURAL ACTIVITIES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'cultural' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Cultural Activities &amp; Annual Gathering (Karmotsav)</h3>
              <p>Manage theatrical stage showcases, classical dance, music ensembles, and cultural festival celebrations.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('cultural', DEFAULT_CULTURAL_EVENTS, 'Cultural Activities')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('cultural', null, { title: '', badge: 'Cultural Event', tag: 'Stage Arts', desc: '', highlights: '' })}
              >
                + Add Cultural Event
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.cultural || []).map((item, idx) => (
                <div key={item.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#f3e8ff', color: '#7e22ce' }}>
                        {item.badge}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>{item.tag}</span>
                    </div>
                    <h4 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>{item.desc}</p>
                    {item.highlights && item.highlights.length > 0 && (
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                        <strong>Highlights:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                          {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('cultural', idx, { ...item, highlights: (item.highlights || []).join('\n') })}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('cultural', idx, 'cultural event')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: CLUBS & ACTIVITIES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'clubs' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Hobby Clubs &amp; Enrichment Societies</h3>
              <p>Configure weekly extracurricular clubs (STEM, Literary, Fine Arts, Eco Club, Performing Arts).</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('clubs', DEFAULT_STUDENT_CLUBS, 'Clubs & Activities')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('club', null, { title: '', description: '', activities: '' })}
              >
                + Add Hobby Club
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.clubs || []).map((club, idx) => (
                <div key={club.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{club.title}</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>{club.description}</p>
                    {club.activities && club.activities.length > 0 && (
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                        <strong>Activities:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                          {club.activities.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('club', idx, { ...club, activities: (club.activities || []).join('\n') })}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('clubs', idx, 'hobby club')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: FIELD TRIPS & EXCURSIONS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'field-trips' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Field Trips &amp; Educational Excursions</h3>
              <p>Manage outdoor excursions connecting classroom lessons with history, science centres, and agricultural reserves.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('fieldTrips', DEFAULT_FIELD_TRIPS, 'Field Trips')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('trip', null, { title: '', destination: '', category: 'History & Heritage', desc: '', highlights: '' })}
              >
                + Add Field Trip
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.fieldTrips || []).map((trip, idx) => (
                <div key={trip.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e' }}>
                        {trip.category}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>📍 {trip.destination}</span>
                    </div>
                    <h4 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{trip.title}</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>{trip.desc}</p>
                    {trip.highlights && trip.highlights.length > 0 && (
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                        <strong>Highlights:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                          {trip.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('trip', idx, { ...trip, highlights: (trip.highlights || []).join('\n') })}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('fieldTrips', idx, 'field trip')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: COMPETITIONS & OLYMPIADS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'competitions' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Competitions &amp; Olympiad Mentorship</h3>
              <p>Configure Science &amp; Math Olympiads, State Talent Search exams, drawing exams, and debating fixtures.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('competitions', DEFAULT_COMPETITIONS, 'Competitions & Olympiads')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('competition', null, { name: '', org: '', subjects: '', badge: 'National Level', desc: '' })}
              >
                + Add Competition
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.competitions || []).map((comp, idx) => (
                <div key={comp.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#dcfce7', color: '#166534' }}>
                        {comp.badge}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>{comp.org}</span>
                    </div>
                    <h4 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{comp.name}</h4>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 8 }}>
                      Subjects: {comp.subjects}
                    </div>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>{comp.desc}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('competition', idx, comp)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('competitions', idx, 'competition')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: STUDENT ACHIEVEMENTS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'achievements' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Student Achievements &amp; Laurels</h3>
              <p>Configure board toppers, Olympiad medals, district sports trophies, and outstanding school records.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('achievements', DEFAULT_STUDENT_ACHIEVEMENTS, 'Achievements')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('achievement', null, { stat: '100%', title: '', desc: '' })}
              >
                + Add Achievement Stat
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {(data.achievements || []).map((item, idx) => (
                <div key={item.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: '#d97706', marginBottom: 4 }}>
                      {item.stat}
                    </div>
                    <h4 style={{ fontSize: 15, margin: '0 0 6px', color: '#0f172a' }}>{item.title}</h4>
                    <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, margin: '0 0 12px' }}>{item.desc}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('achievement', idx, item)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('achievements', idx, 'achievement stat')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: HOUSES & STUDENT COUNCIL */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'houses-council' && (
        <div style={{ display: 'grid', gap: 20 }}>
          {/* House System Card */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>The 4 School Houses</h3>
                <p>Prithvi, Agni, Jal, and Vayu house definitions, mottos, and leadership mottos.</p>
              </div>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('houses', DEFAULT_STUDENT_HOUSES, 'Houses')}
              >
                Reset Houses
              </button>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {(data.houses || []).map((house, idx) => (
                  <div key={house.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: 16, margin: '0 0 4px', color: '#0f172a' }}>{house.name}</h4>
                      <div style={{ fontSize: 12, fontStyle: 'italic', color: '#64748b', marginBottom: 8 }}>"{house.motto}"</div>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>{house.description}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 12 }}>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => openModal('house', idx, house)}
                      >
                        Edit House
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Council Card */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Student Council Leadership Roles</h3>
                <p>Roles such as Head Boy &amp; Head Girl, Sports &amp; Cultural Prefects, and House Captains.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => resetSection('council', DEFAULT_STUDENT_COUNCIL, 'Student Council')}
                >
                  Reset Council
                </button>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => openModal('council', null, { role: '', badge: 'Leadership', desc: '' })}
                >
                  + Add Council Role
                </button>
              </div>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {(data.council || []).map((item, idx) => (
                  <div key={item.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', display: 'inline-block', marginBottom: 6 }}>
                        {item.badge}
                      </span>
                      <h4 style={{ fontSize: 15, margin: '0 0 6px', color: '#0f172a' }}>{item.role}</h4>
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 12 }}>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => openModal('council', idx, item)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteItem('council', idx, 'council role')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* EDIT MODAL DIALOG */}
      {/* --------------------------------------------------------------------- */}
      {modalType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>
                {editingIndex !== null ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleModalSubmit} style={{ display: 'grid', gap: 14 }}>
              {/* CULTURAL FORM */}
              {modalType === 'cultural' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Event / Festival Title *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.title || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Karmotsav - Annual Gathering"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Badge Tag</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.badge || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="e.g. Flagship Event"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Category</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.tag || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, tag: e.target.value }))}
                        placeholder="e.g. Stage Arts"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Description of the cultural activities and student participation..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Key Highlights (One per line)</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      value={formValues.highlights || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, highlights: e.target.value }))}
                      placeholder="2,000+ Audience Capacity&#10;100% Student Participation Encouraged&#10;Live Stage Performances"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* CLUB FORM */}
              {modalType === 'club' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Club Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.title || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. STEM & Robotics Club"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.description || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Students tinker with circuits, coding, and models..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Key Activities (One per line)</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      value={formValues.activities || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, activities: e.target.value }))}
                      placeholder="Arduino prototyping&#10;Block coding fundamentals&#10;Science Olympiad prep"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* TRIP FORM */}
              {modalType === 'trip' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Field Trip Title *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.title || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Historical Forts & Heritage Excursions"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Destination *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={formValues.destination || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, destination: e.target.value }))}
                        placeholder="e.g. Solapur Bhuikot Fort"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Category</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.category || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. History & Heritage"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="On-site study of architecture and history..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Key Highlights (One per line)</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      value={formValues.highlights || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, highlights: e.target.value }))}
                      placeholder="Guided architecture study&#10;Historical role-play&#10;Safety-first transport"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* COMPETITION FORM */}
              {modalType === 'competition' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Competition / Exam Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.name || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. SOF National Science Olympiad"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Organizing Body</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.org || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, org: e.target.value }))}
                        placeholder="e.g. Science Olympiad Foundation"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Badge Tag</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.badge || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="e.g. International Level"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Subjects / Focus Areas</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formValues.subjects || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, subjects: e.target.value }))}
                      placeholder="e.g. NSO (Science), IMO (Math), IEO (English)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Preparatory coaching and test series details..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* ACHIEVEMENT FORM */}
              {modalType === 'achievement' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Stat Figure *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={formValues.stat || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, stat: e.target.value }))}
                        placeholder="e.g. 100% or 45+"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Achievement Title *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Class 10 Board Pass Record"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Details on distinction holders, merit awards, or championships..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* HOUSE FORM */}
              {modalType === 'house' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>House Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.name || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Prithvi House"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>House Motto *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.motto || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, motto: e.target.value }))}
                      placeholder="e.g. Strength, Endurance & Humility"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.description || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Philosophy and virtues represented by this house..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              {/* COUNCIL FORM */}
              {modalType === 'council' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Council Role Title *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      value={formValues.role || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Head Boy & Head Girl"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Badge Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formValues.badge || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="e.g. Student Leadership"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Duties & Responsibilities *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Serve as prime ambassadors of the student body, anchor assemblies..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
