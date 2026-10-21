import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { pagesService, uploadService } from '../../services/endpoints.js'
import {
  DEFAULT_STUDENT_CORNER_DATA,
  DEFAULT_CULTURAL_EVENTS,
  DEFAULT_CULTURAL_META,
  DEFAULT_STUDENT_CLUBS,
  DEFAULT_CLUBS_META,
  DEFAULT_FIELD_TRIPS,
  DEFAULT_FIELD_TRIPS_META,
  DEFAULT_COMPETITIONS,
  DEFAULT_COMPETITIONS_META,
  DEFAULT_STUDENT_ACHIEVEMENTS,
  DEFAULT_ACHIEVEMENTS_META,
  DEFAULT_STUDENT_HOUSES,
  DEFAULT_STUDENT_COUNCIL,
  DEFAULT_HOUSES_COUNCIL_META,
  DEFAULT_SPORTS_TEAMS,
  DEFAULT_SPORTS_META
} from '../../data/studentCornerData.js'
import {
  TheaterIcon,
  MicroscopeIcon,
  BusIcon,
  TrophyIcon,
  StarIcon,
  ShieldIcon,
  SportsIcon,
  MapPinIcon
} from '../../components/Icons.jsx'

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
              cultural_meta: parsed.cultural_meta ? { ...DEFAULT_CULTURAL_META, ...parsed.cultural_meta } : (prev.cultural_meta || DEFAULT_CULTURAL_META),
              clubs: Array.isArray(parsed.clubs) && parsed.clubs.length > 0 ? parsed.clubs : prev.clubs,
              clubs_meta: parsed.clubs_meta ? { ...DEFAULT_CLUBS_META, ...parsed.clubs_meta } : (prev.clubs_meta || DEFAULT_CLUBS_META),
              fieldTrips: Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0 ? parsed.fieldTrips : prev.fieldTrips,
              field_trips_meta: parsed.field_trips_meta ? { ...DEFAULT_FIELD_TRIPS_META, ...parsed.field_trips_meta } : (prev.field_trips_meta || DEFAULT_FIELD_TRIPS_META),
              competitions: Array.isArray(parsed.competitions) && parsed.competitions.length > 0 ? parsed.competitions : prev.competitions,
              competitions_meta: parsed.competitions_meta ? { ...DEFAULT_COMPETITIONS_META, ...parsed.competitions_meta } : (prev.competitions_meta || DEFAULT_COMPETITIONS_META),
              achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements,
              achievements_meta: parsed.achievements_meta ? { ...DEFAULT_ACHIEVEMENTS_META, ...parsed.achievements_meta } : (prev.achievements_meta || DEFAULT_ACHIEVEMENTS_META),
              houses: Array.isArray(parsed.houses) && parsed.houses.length > 0 ? parsed.houses : prev.houses,
              council: Array.isArray(parsed.council) && parsed.council.length > 0 ? parsed.council : prev.council,
              houses_council_meta: parsed.houses_council_meta ? { ...DEFAULT_HOUSES_COUNCIL_META, ...parsed.houses_council_meta } : (prev.houses_council_meta || DEFAULT_HOUSES_COUNCIL_META),
              sportsTeams: Array.isArray(parsed.sportsTeams) && parsed.sportsTeams.length > 0 ? parsed.sportsTeams : (prev.sportsTeams || DEFAULT_SPORTS_TEAMS),
              sports_meta: parsed.sports_meta ? { ...DEFAULT_SPORTS_META, ...parsed.sports_meta } : (prev.sports_meta || DEFAULT_SPORTS_META)
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
      window.dispatchEvent(new CustomEvent('page_student_corner_updated', { detail: { content_html: JSON.stringify(data) } }))
      setMsg({ text: 'Student Life changes saved successfully and synced with the public website.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save changes', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Generic metadata helpers
  const handleMetaFieldChange = (sectionMetaKey, field, val, defaultMeta) => {
    setData(prev => ({
      ...prev,
      [sectionMetaKey]: {
        ...(prev[sectionMetaKey] || defaultMeta),
        [field]: val
      }
    }))
  }

  const handlePillarFieldChange = (sectionMetaKey, idx, field, val, defaultMeta) => {
    setData(prev => {
      const currentPillars = [...(prev[sectionMetaKey]?.pillars || defaultMeta.pillars)]
      currentPillars[idx] = { ...currentPillars[idx], [field]: val }
      return {
        ...prev,
        [sectionMetaKey]: {
          ...(prev[sectionMetaKey] || defaultMeta),
          pillars: currentPillars
        }
      }
    })
  }

  const handleSectionImageUpload = async (sectionMetaKey, file, folder = 'student_corner') => {
    if (!file) return
    try {
      setMsg({ text: 'Uploading image...', type: 'info' })
      const url = await uploadService.uploadFile(file, folder)
      if (url) {
        setData(prev => ({
          ...prev,
          [sectionMetaKey]: {
            ...prev[sectionMetaKey],
            image: url
          }
        }))
        setMsg({ text: 'Image uploaded successfully!', type: 'success' })
      }
    } catch (err) {
      setMsg({ text: 'Failed to upload image: ' + err.message, type: 'danger' })
    }
  }

  // Clubs metadata helpers
  const handleClubsMetaChange = (field, val) => handleMetaFieldChange('clubs_meta', field, val, DEFAULT_CLUBS_META)
  const handleClubsPillarChange = (idx, field, val) => handlePillarFieldChange('clubs_meta', idx, field, val, DEFAULT_CLUBS_META)
  const handleClubsImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) handleSectionImageUpload('clubs_meta', file, 'clubs')
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

    if (modalType === 'sportsTeam') {
      const updated = [...(data.sportsTeams || DEFAULT_SPORTS_TEAMS)]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ id: `team-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, sportsTeams: updated }))
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
            <span className="admin-page-badge" style={{ marginLeft: 10, verticalAlign: 'middle' }}>Campus Services</span>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <TheaterIcon size={15} /> 1. Cultural Activities
          </span>
          <span className="admin-tab-count">{data.cultural?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => handleTabChange('clubs')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <MicroscopeIcon size={15} /> 2. Clubs &amp; Activities
          </span>
          <span className="admin-tab-count">{data.clubs?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'field-trips' ? 'active' : ''}`}
          onClick={() => handleTabChange('field-trips')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <BusIcon size={15} /> 3. Field Trips &amp; Excursions
          </span>
          <span className="admin-tab-count">{data.fieldTrips?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'competitions' ? 'active' : ''}`}
          onClick={() => handleTabChange('competitions')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <TrophyIcon size={15} /> 4. Competitions &amp; Olympiads
          </span>
          <span className="admin-tab-count">{data.competitions?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => handleTabChange('achievements')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <StarIcon size={15} /> 5. Student Achievements
          </span>
          <span className="admin-tab-count">{data.achievements?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'houses-council' ? 'active' : ''}`}
          onClick={() => handleTabChange('houses-council')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldIcon size={15} /> 6. Houses &amp; Council
          </span>
          <span className="admin-tab-count">{(data.houses?.length || 0) + (data.council?.length || 0)}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'sports' ? 'active' : ''}`}
          onClick={() => handleTabChange('sports')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <SportsIcon size={15} /> 7. Sports &amp; Athletics
          </span>
          <span className="admin-tab-count">{(data.sportsTeams || DEFAULT_SPORTS_TEAMS).length}</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: CULTURAL ACTIVITIES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'cultural' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner Settings */}
          <HeroBannerEditor
            title="Cultural Activities Hero Banner & Header"
            subtitle="Configure top introduction, buttons, and featured cultural showcase hero image."
            meta={data.cultural_meta || DEFAULT_CULTURAL_META}
            defaultMeta={DEFAULT_CULTURAL_META}
            onChange={(f, v) => handleMetaFieldChange('cultural_meta', f, v, DEFAULT_CULTURAL_META)}
            onImageUpload={(file) => handleSectionImageUpload('cultural_meta', file, 'cultural')}
            onReset={() => handleMetaFieldChange('cultural_meta', null, null, DEFAULT_CULTURAL_META)}
          />

          {/* Section 2: 3 Operational Pillars */}
          <PillarsEditor
            title="Three Pillars of Cultural Expression"
            subtitle="Stage Drama, Music Ensembles, Folk Dance & Dindi highlight cards."
            pillars={data.cultural_meta?.pillars || DEFAULT_CULTURAL_META.pillars}
            onChange={(idx, f, v) => handlePillarFieldChange('cultural_meta', idx, f, v, DEFAULT_CULTURAL_META)}
            hasTag={true}
            cardLabel="Cultural Pillar"
          />

          {/* Section 3: Section Header */}
          <SectionHeaderEditor
            badge={data.cultural_meta?.section_badge || ''}
            title={data.cultural_meta?.section_title || ''}
            onChangeBadge={(v) => handleMetaFieldChange('cultural_meta', 'section_badge', v, DEFAULT_CULTURAL_META)}
            onChangeTitle={(v) => handleMetaFieldChange('cultural_meta', 'section_title', v, DEFAULT_CULTURAL_META)}
            badgeLabel="Events Section Eyebrow Badge"
            titleLabel="Events Section Main Heading"
          />

          {/* Section 4: Cultural Activities & Gathering List */}
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
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: CLUBS & ACTIVITIES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'clubs' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner Settings */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Hero Banner &amp; Header Settings</h3>
                <p>Configure the top introduction, action buttons, and feature hero image on the Clubs page.</p>
              </div>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    clubs_meta: { ...DEFAULT_CLUBS_META }
                  }))
                }}
              >
                Reset Header to Default
              </button>
            </div>
            <div className="admin-card-body" style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Eyebrow Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.clubs_meta?.badge || ''}
                    onChange={e => handleClubsMetaChange('badge', e.target.value)}
                    placeholder="e.g. CO-CURRICULAR EXPLORATION"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Main Page Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.clubs_meta?.title || ''}
                    onChange={e => handleClubsMetaChange('title', e.target.value)}
                    placeholder="e.g. Discovering Passions, Building Future Skills"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Lead Introduction Paragraph</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={data.clubs_meta?.lead || ''}
                  onChange={e => handleClubsMetaChange('lead', e.target.value)}
                  placeholder="Summary paragraph describing regular class pause, club schedule, and student exploration..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Call to action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Primary Action Button</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.clubs_meta?.explore_btn_text || ''}
                        onChange={e => handleClubsMetaChange('explore_btn_text', e.target.value)}
                        placeholder="Explore Science & STEM Labs"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Destination Link</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.clubs_meta?.explore_btn_link || ''}
                        onChange={e => handleClubsMetaChange('explore_btn_link', e.target.value)}
                        placeholder="/labs"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Secondary Action Button</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.clubs_meta?.inquire_btn_text || ''}
                        onChange={e => handleClubsMetaChange('inquire_btn_text', e.target.value)}
                        placeholder="Inquire About Club Programs"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Destination Link</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.clubs_meta?.inquire_btn_link || ''}
                        onChange={e => handleClubsMetaChange('inquire_btn_link', e.target.value)}
                        placeholder="/contact"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image Section */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Hero Split Image &amp; Floating Overlay</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'center' }}>
                  <div style={{ maxWidth: 220, height: 130, borderRadius: 8, overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                    {data.clubs_meta?.image ? (
                      <img src={data.clubs_meta.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>No Image Preview</span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Image URL</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.clubs_meta?.image || ''}
                        onChange={e => handleClubsMetaChange('image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Or Upload Image File:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleClubsImageUpload}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Floating Overlay Subtitle</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.clubs_meta?.image_sub || ''}
                      onChange={e => handleClubsMetaChange('image_sub', e.target.value)}
                      placeholder="e.g. Hands-On Learning"
                      style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Floating Overlay Main Heading</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.clubs_meta?.image_tag || ''}
                      onChange={e => handleClubsMetaChange('image_tag', e.target.value)}
                      placeholder="e.g. STEM & Robotics Tinkering Hub"
                      style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 3 Operational Pillars */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Schedule &amp; Operational Pillars (3 Highlight Boxes)</h3>
              <p>Edit the 3 feature highlight cards shown below the hero (Weekly Hours, Faculty Mentors, Exhibitions).</p>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {(data.clubs_meta?.pillars || DEFAULT_CLUBS_META.pillars).map((pillar, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'grid', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                      Pillar Card #{idx + 1}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Card Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={pillar.title || ''}
                        onChange={e => handleClubsPillarChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Dedicated Weekly Hours"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Description</label>
                      <textarea
                        rows={3}
                        className="admin-input"
                        value={pillar.desc || ''}
                        onChange={e => handleClubsPillarChange(idx, 'desc', e.target.value)}
                        placeholder="Card details..."
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Clubs Section Titles & Bottom CTA */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Section Headings &amp; Facilities Banner</h3>
              <p>Configure section titles and the bottom equipped labs banner.</p>
            </div>
            <div className="admin-card-body" style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Clubs Section Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.clubs_meta?.section_badge || ''}
                    onChange={e => handleClubsMetaChange('section_badge', e.target.value)}
                    placeholder="ACTIVE SOCIETIES"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Clubs Section Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.clubs_meta?.section_title || ''}
                    onChange={e => handleClubsMetaChange('section_title', e.target.value)}
                    placeholder="Explore Our Student Clubs"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'grid', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Bottom Facilities CTA Banner</div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Banner Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.clubs_meta?.cta_title || ''}
                    onChange={e => handleClubsMetaChange('cta_title', e.target.value)}
                    placeholder="Equipped Labs Supporting Club Innovations"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Banner Description</label>
                  <textarea
                    rows={2}
                    className="admin-input"
                    value={data.clubs_meta?.cta_desc || ''}
                    onChange={e => handleClubsMetaChange('cta_desc', e.target.value)}
                    placeholder="From our fully air-conditioned computer center..."
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.clubs_meta?.cta_btn_text || ''}
                      onChange={e => handleClubsMetaChange('cta_btn_text', e.target.value)}
                      placeholder="Visit Science & STEM Labs"
                      style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Destination Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.clubs_meta?.cta_btn_link || ''}
                      onChange={e => handleClubsMetaChange('cta_btn_link', e.target.value)}
                      placeholder="/labs"
                      style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Hobby Clubs & Societies List */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Active Student Clubs ({data.clubs?.length || 0})</h3>
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
                  onClick={() => openModal('club', null, { title: '', description: '', activities: '', icon: 'Sparkles' })}
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 style={{ fontSize: 16, margin: 0, color: '#0f172a' }}>{club.title}</h4>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>{club.icon || 'Sparkles'}</span>
                      </div>
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
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: FIELD TRIPS & EXCURSIONS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'field-trips' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner Settings */}
          <HeroBannerEditor
            title="Field Trips & Excursions Hero Banner & Header"
            subtitle="Configure top introduction, buttons, and excursion feature hero image."
            meta={data.field_trips_meta || DEFAULT_FIELD_TRIPS_META}
            defaultMeta={DEFAULT_FIELD_TRIPS_META}
            onChange={(f, v) => handleMetaFieldChange('field_trips_meta', f, v, DEFAULT_FIELD_TRIPS_META)}
            onImageUpload={(file) => handleSectionImageUpload('field_trips_meta', file, 'field_trips')}
            onReset={() => handleMetaFieldChange('field_trips_meta', null, null, DEFAULT_FIELD_TRIPS_META)}
          />

          {/* Section 2: 4 Pillars of Safety */}
          <PillarsEditor
            title="Four Pillars of Tour Safety & Care"
            subtitle="Edit the 4 safety and experiential learning highlight cards shown below the hero."
            pillars={data.field_trips_meta?.pillars || DEFAULT_FIELD_TRIPS_META.pillars}
            onChange={(idx, f, v) => handlePillarFieldChange('field_trips_meta', idx, f, v, DEFAULT_FIELD_TRIPS_META)}
            hasTag={true}
            cardLabel="Safety Pillar"
          />

          {/* Section 3: Section Header */}
          <SectionHeaderEditor
            badge={data.field_trips_meta?.section_badge || ''}
            title={data.field_trips_meta?.section_title || ''}
            onChangeBadge={(v) => handleMetaFieldChange('field_trips_meta', 'section_badge', v, DEFAULT_FIELD_TRIPS_META)}
            onChangeTitle={(v) => handleMetaFieldChange('field_trips_meta', 'section_title', v, DEFAULT_FIELD_TRIPS_META)}
            badgeLabel="Trips Section Eyebrow Badge"
            titleLabel="Trips Section Main Heading"
          />

          {/* Section 4: Field Trips List */}
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
                        <span style={{ fontSize: 11.5, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <MapPinIcon size={12} color="#64748b" /> {trip.destination}
                        </span>
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
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: COMPETITIONS & OLYMPIADS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'competitions' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner Settings */}
          <HeroBannerEditor
            title="Competitions & Olympiads Hero Banner & Header"
            subtitle="Configure top introduction, buttons, and Olympiad mentorship hero image."
            meta={data.competitions_meta || DEFAULT_COMPETITIONS_META}
            defaultMeta={DEFAULT_COMPETITIONS_META}
            onChange={(f, v) => handleMetaFieldChange('competitions_meta', f, v, DEFAULT_COMPETITIONS_META)}
            onImageUpload={(file) => handleSectionImageUpload('competitions_meta', file, 'competitions')}
            onReset={() => handleMetaFieldChange('competitions_meta', null, null, DEFAULT_COMPETITIONS_META)}
          />

          {/* Section 2: 3-Step Mentoring Framework */}
          <PillarsEditor
            title="Three-Step Mentoring Framework"
            subtitle="Early Talent Identification, Weekly Mock Tests, Personal Mentoring cards."
            pillars={data.competitions_meta?.pillars || DEFAULT_COMPETITIONS_META.pillars}
            onChange={(idx, f, v) => handlePillarFieldChange('competitions_meta', idx, f, v, DEFAULT_COMPETITIONS_META)}
            hasTag={false}
            cardLabel="Step"
          />

          {/* Section 3: Section Header */}
          <SectionHeaderEditor
            badge={data.competitions_meta?.section_badge || ''}
            title={data.competitions_meta?.section_title || ''}
            onChangeBadge={(v) => handleMetaFieldChange('competitions_meta', 'section_badge', v, DEFAULT_COMPETITIONS_META)}
            onChangeTitle={(v) => handleMetaFieldChange('competitions_meta', 'section_title', v, DEFAULT_COMPETITIONS_META)}
            badgeLabel="Competitions Section Eyebrow Badge"
            titleLabel="Competitions Section Main Heading"
          />

          {/* Section 4: Competitions List */}
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
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: STUDENT ACHIEVEMENTS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'achievements' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner Settings */}
          <HeroBannerEditor
            title="Student Achievements Hero Banner & Header"
            subtitle="Configure top introduction, buttons, and honors showcase hero image."
            meta={data.achievements_meta || DEFAULT_ACHIEVEMENTS_META}
            defaultMeta={DEFAULT_ACHIEVEMENTS_META}
            onChange={(f, v) => handleMetaFieldChange('achievements_meta', f, v, DEFAULT_ACHIEVEMENTS_META)}
            onImageUpload={(file) => handleSectionImageUpload('achievements_meta', file, 'achievements')}
            onReset={() => handleMetaFieldChange('achievements_meta', null, null, DEFAULT_ACHIEVEMENTS_META)}
          />

          {/* Section 2: Section Header */}
          <SectionHeaderEditor
            badge={data.achievements_meta?.section_badge || ''}
            title={data.achievements_meta?.section_title || ''}
            onChangeBadge={(v) => handleMetaFieldChange('achievements_meta', 'section_badge', v, DEFAULT_ACHIEVEMENTS_META)}
            onChangeTitle={(v) => handleMetaFieldChange('achievements_meta', 'section_title', v, DEFAULT_ACHIEVEMENTS_META)}
            badgeLabel="Stats Section Eyebrow Badge"
            titleLabel="Stats Section Main Heading"
          />

          {/* Section 3: Achievements List */}
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
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: HOUSES & STUDENT COUNCIL */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'houses-council' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Hero Banner */}
          <HeroBannerEditor
            title="Houses & Student Council Hero Banner"
            subtitle="Configure top introduction, and explore buttons for the Houses & Council page."
            meta={data.houses_council_meta || DEFAULT_HOUSES_COUNCIL_META}
            defaultMeta={DEFAULT_HOUSES_COUNCIL_META}
            onChange={(f, v) => handleMetaFieldChange('houses_council_meta', f, v, DEFAULT_HOUSES_COUNCIL_META)}
            onReset={() => handleMetaFieldChange('houses_council_meta', null, null, DEFAULT_HOUSES_COUNCIL_META)}
            hasImage={false}
          />

          {/* Section 2: Championship Banner Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Annual Rolling Championship Trophy Banner</h3>
              <p>Customize the right-hand side banner explaining the inter-house shield competitions.</p>
            </div>
            <div className="admin-card-body" style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Banner Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.houses_council_meta?.banner_heading || ''}
                  onChange={e => handleMetaFieldChange('houses_council_meta', 'banner_heading', e.target.value, DEFAULT_HOUSES_COUNCIL_META)}
                  placeholder="Annual Inter-House Championship"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Banner Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={data.houses_council_meta?.banner_desc || ''}
                  onChange={e => handleMetaFieldChange('houses_council_meta', 'banner_desc', e.target.value, DEFAULT_HOUSES_COUNCIL_META)}
                  placeholder="Throughout the academic year, houses compete for the prestigious Cock-House Championship Shield..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>
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
      {/* TAB 7: SPORTS & ATHLETICS SQUADS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'sports' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Section 1: Bridge Callout Banner */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Bridge Callout Banner (Facilities Cross-Link)</h3>
              <p>Top callout distinguishing student competitive squads from campus physical grounds.</p>
            </div>
            <div className="admin-card-body" style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Banner Eyebrow</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.bridge_badge || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'bridge_badge', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="CAMPUS INFRASTRUCTURE VS STUDENT ATHLETICS"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Callout Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.bridge_text || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'bridge_text', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="Looking for physical playground specifications..."
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.bridge_btn_text || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'bridge_btn_text', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="Explore Sports Facilities"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Button Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.bridge_btn_link || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'bridge_btn_link', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="/sports-facilities"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Sports Philosophy & Ethos */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Sports Philosophy &amp; Ethos</h3>
              <p>Introduction heading, badge, and philosophy statement for the athletics section.</p>
            </div>
            <div className="admin-card-body" style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Eyebrow Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.badge || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'badge', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="PHYSICAL EDUCATION & WELLNESS"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Main Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sports_meta?.title || ''}
                    onChange={e => handleMetaFieldChange('sports_meta', 'title', e.target.value, DEFAULT_SPORTS_META)}
                    placeholder="Building Champions on Field and in Character"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Philosophy Lead Paragraph</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={data.sports_meta?.lead || ''}
                  onChange={e => handleMetaFieldChange('sports_meta', 'lead', e.target.value, DEFAULT_SPORTS_META)}
                  placeholder="Sports at Karmayogi Vidyaniketan go far beyond fitness..."
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: 3 Athletic Pillars */}
          <PillarsEditor
            title="Athletic Pillars & Training Focus"
            subtitle="Daily Physical Literacy, Competitive Training & NIS Mentorship, Sportsmanship cards."
            pillars={data.sports_meta?.pillars || DEFAULT_SPORTS_META.pillars}
            onChange={(idx, f, v) => handlePillarFieldChange('sports_meta', idx, f, v, DEFAULT_SPORTS_META)}
            hasTag={false}
            cardLabel="Athletic Pillar"
          />

          {/* Section 4: Official School Sports Teams */}
          <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3>Student Sports Squads, Coaching &amp; Athletic Competitions</h3>
              <p>Configure competitive school sports teams, assigned coaches, practice hours, and tournament medals.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => resetSection('sportsTeams', DEFAULT_SPORTS_TEAMS, 'Sports Teams')}
              >
                Reset to Presets
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => openModal('sportsTeam', null, { title: '', sport: 'Cricket', badge: 'School Squad', coach: '', practice: '', desc: '', achievements: '' })}
              >
                + Add Sports Squad
              </button>
            </div>
          </div>

          <div style={{ background: '#eff6ff', padding: '12px 18px', borderBottom: '1px solid #bfdbfe', fontSize: 13, color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span>
              ℹ️ <strong>Infrastructure Note:</strong> Physical playgrounds, turf cricket nets, mud Kabaddi courts, and indoor arenas are managed separately under <Link to="/admin/facilities?tab=sports" style={{ color: '#1d4ed8', fontWeight: 700 }}>School Infrastructure &amp; Facilities &rarr;</Link>
            </span>
          </div>

          <div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.sportsTeams || DEFAULT_SPORTS_TEAMS).map((item, idx) => (
                <div key={item.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8' }}>
                        {item.badge || item.sport}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{item.sport}</span>
                    </div>
                    <h4 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>{item.desc}</p>
                    <div style={{ fontSize: 12, color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 8 }}>
                      <div><strong>Coach:</strong> {item.coach}</div>
                      <div><strong>Timings:</strong> {item.practice}</div>
                      {item.achievements && (
                        <div style={{ color: '#854d0e', marginTop: 4 }}><strong>Honors:</strong> {item.achievements}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      onClick={() => openModal('sportsTeam', idx, item)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteItem('sportsTeams', idx, item.title)}
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
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <h3>
                {editingIndex !== null ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="admin-modal-body" style={{ display: 'grid', gap: 14 }}>
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
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Club Icon</label>
                    <select
                      className="admin-input"
                      value={formValues.icon || 'Sparkles'}
                      onChange={e => setFormValues(prev => ({ ...prev, icon: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    >
                      <option value="Sparkles">Sparkles (STEM / Science / Tinkering)</option>
                      <option value="BookOpen">BookOpen (Literary / Debating / Writing)</option>
                      <option value="Music">Music (Drama / Performing Arts / Vocals)</option>
                      <option value="Palette">Palette (Fine Arts / Craft / Painting)</option>
                      <option value="Compass">Compass (Eco Club / Heritage / Nature)</option>
                      <option value="Users">Users (Social Service / Red Cross / Community)</option>
                    </select>
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

              {/* SPORTS TEAM FORM */}
              {modalType === 'sportsTeam' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Squad Title *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. School Cricket XI (U-14 & U-16)"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Sport Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={formValues.sport || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, sport: e.target.value }))}
                        placeholder="e.g. Cricket"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Badge Tag</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.badge || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="e.g. District Champions"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Coach / Mentor</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.coach || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, coach: e.target.value }))}
                        placeholder="e.g. Coach Sachin Patil"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Practice Schedule &amp; Timings</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formValues.practice || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, practice: e.target.value }))}
                      placeholder="e.g. Mon, Wed, Fri (6:45 AM – 8:00 AM & 3:15 PM – 4:45 PM)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description &amp; Training Focus *</label>
                    <textarea
                      rows={3}
                      className="admin-input"
                      required
                      value={formValues.desc || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Details on squad training, match drills, and participation..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Tournament Honors &amp; Medals</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formValues.achievements || ''}
                      onChange={e => setFormValues(prev => ({ ...prev, achievements: e.target.value }))}
                      placeholder="e.g. Gold medalists in Solapur DSO Taluka Meet 2025-26"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
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

function HeroBannerEditor({ 
  title = "Hero Banner & Header Settings", 
  subtitle = "Configure the top introduction, action buttons, and feature hero image.", 
  meta = {}, 
  defaultMeta = {}, 
  onChange, 
  onImageUpload, 
  onReset,
  hasImage = true
}) {
  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {onReset && (
          <button className="admin-btn admin-btn-secondary" onClick={onReset}>
            Reset Header to Default
          </button>
        )}
      </div>
      <div className="admin-card-body" style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Eyebrow Badge</label>
            <input
              type="text"
              className="admin-input"
              value={meta?.badge || ''}
              onChange={e => onChange('badge', e.target.value)}
              placeholder="e.g. FEATURE BADGE"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Main Page Heading</label>
            <input
              type="text"
              className="admin-input"
              value={meta?.title || ''}
              onChange={e => onChange('title', e.target.value)}
              placeholder="Page Heading..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Lead Introduction Paragraph</label>
          <textarea
            rows={3}
            className="admin-input"
            value={meta?.lead || ''}
            onChange={e => onChange('lead', e.target.value)}
            placeholder="Introduction text..."
            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Primary Action Button</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.explore_btn_text || ''}
                  onChange={e => onChange('explore_btn_text', e.target.value)}
                  placeholder="Button Label"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Destination Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.explore_btn_link || ''}
                  onChange={e => onChange('explore_btn_link', e.target.value)}
                  placeholder="/destination"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Secondary Action Button</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Button Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.inquire_btn_text || ''}
                  onChange={e => onChange('inquire_btn_text', e.target.value)}
                  placeholder="Button Label"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Destination Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.inquire_btn_link || ''}
                  onChange={e => onChange('inquire_btn_link', e.target.value)}
                  placeholder="/contact"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        {hasImage && (
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Hero Split Image &amp; Floating Overlay</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'center' }}>
              <div style={{ maxWidth: 220, height: 130, borderRadius: 8, overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                {meta?.image ? (
                  <img src={meta.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>No Image Preview</span>
                )}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Image URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={meta?.image || ''}
                    onChange={e => onChange('image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Or Upload Image File:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => onImageUpload && onImageUpload(e.target.files?.[0])}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Floating Overlay Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.image_sub || ''}
                  onChange={e => onChange('image_sub', e.target.value)}
                  placeholder="e.g. Subtitle Tag"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Floating Overlay Main Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={meta?.image_tag || ''}
                  onChange={e => onChange('image_tag', e.target.value)}
                  placeholder="e.g. Main Image Title"
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PillarsEditor({
  title = "Pillars & Key Highlights",
  subtitle = "Edit the highlight cards shown on this page.",
  pillars = [],
  onChange,
  hasTag = false,
  cardLabel = "Highlight Card"
}) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="admin-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {pillars.map((pillar, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                {cardLabel} #{idx + 1}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pillar.title || ''}
                  onChange={e => onChange(idx, 'title', e.target.value)}
                  placeholder="Title..."
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={pillar.desc || ''}
                  onChange={e => onChange(idx, 'desc', e.target.value)}
                  placeholder="Description..."
                  style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              {hasTag && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Bottom Subtext / Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pillar.tag || ''}
                    onChange={e => onChange(idx, 'tag', e.target.value)}
                    placeholder="e.g. 100% Student Reach"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeaderEditor({
  badge = '',
  title = '',
  onChangeBadge,
  onChangeTitle,
  badgeLabel = "Section Eyebrow Badge",
  titleLabel = "Section Main Heading"
}) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Section Header &amp; Subtitle</h3>
        <p>Customise the title and badge preceding the items list.</p>
      </div>
      <div className="admin-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{badgeLabel}</label>
            <input
              type="text"
              className="admin-input"
              value={badge}
              onChange={e => onChangeBadge(e.target.value)}
              placeholder="e.g. FEATURED ITEMS"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{titleLabel}</label>
            <input
              type="text"
              className="admin-input"
              value={title}
              onChange={e => onChangeTitle(e.target.value)}
              placeholder="Section Heading..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
