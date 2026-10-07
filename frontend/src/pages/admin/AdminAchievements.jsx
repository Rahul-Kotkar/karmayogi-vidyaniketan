import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pagesService } from '../../services/endpoints.js'
import { ACHIEVEMENTS as DEFAULT_ACHIEVEMENTS } from '../../data/collegeData.js'

const AVAILABLE_ICONS = [
  { id: 'trophy', label: 'Trophy / Competition Award' },
  { id: 'document', label: 'Academic Paper / Research Publication' },
  { id: 'people', label: 'Team / 100% Placement / Student Body' },
  { id: 'chart', label: 'University Ranks / Merit Performance' },
  { id: 'medal', label: 'Gold Medal / Outstanding Distinction' },
  { id: 'star', label: 'Star Excellence / Special Milestone' }
]

export default function AdminAchievements() {
  const [achList, setAchList] = useState([])
  const [sectionConfig, setSectionConfig] = useState({
    achievements_eyebrow: '— PROUD MOMENTS',
    achievements_title: 'Student Achievements',
    achievements_subtitle: 'Recognising the talent, dedication and success of our students.',
    achievements_quote: '“Our students make the difference”',
    achievements_view_all_link: '/events'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    num: '01',
    tag: 'COMPETITIONS',
    iconType: 'trophy',
    title: '',
    detail: '',
    link: '/events',
    linkText: 'Know More'
  })

  useEffect(() => {
    async function load() {
      try {
        const page = await pagesService.getBySlug('home')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (parsed.achievements_list && Array.isArray(parsed.achievements_list) && parsed.achievements_list.length > 0) {
              setAchList(parsed.achievements_list)
            } else {
              setAchList(DEFAULT_ACHIEVEMENTS)
            }
            setSectionConfig({
              achievements_eyebrow: parsed.achievements_eyebrow || '— PROUD MOMENTS',
              achievements_title: parsed.achievements_title || 'Student Achievements',
              achievements_subtitle: parsed.achievements_subtitle || 'Recognising the talent, dedication and success of our students.',
              achievements_quote: parsed.achievements_quote || '“Our students make the difference”',
              achievements_view_all_link: parsed.achievements_view_all_link || '/events'
            })
          } catch {
            setAchList(DEFAULT_ACHIEVEMENTS)
          }
        } else {
          setAchList(DEFAULT_ACHIEVEMENTS)
        }
      } catch (err) {
        console.error('Error loading achievements:', err)
        setAchList(DEFAULT_ACHIEVEMENTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setForm({
        num: item.num || '01',
        tag: item.tag || 'COMPETITIONS',
        iconType: item.iconType || (item.color === 'blue' ? 'document' : item.color === 'green' ? 'people' : item.color === 'purple' ? 'chart' : 'trophy'),
        title: item.title || '',
        detail: item.detail || item.desc || '',
        link: item.link || '/events',
        linkText: item.linkText || 'Know More'
      })
    } else {
      setEditingItem(null)
      const nextNum = String(achList.length + 1).padStart(2, '0')
      setForm({
        num: nextNum,
        tag: 'ACADEMIC EXCELLENCE',
        iconType: 'trophy',
        title: '',
        detail: '',
        link: '/events',
        linkText: 'Know More'
      })
    }
    setModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      alert('Please enter an achievement title.')
      return
    }

    if (editingItem) {
      setAchList(prev => prev.map(item => (item.id === editingItem.id ? { ...item, ...form } : item)))
      setMsg({ text: 'Achievement updated in draft! Click "Save All Changes" to publish.', type: 'success' })
    } else {
      const newItem = {
        id: Date.now(),
        ...form
      }
      setAchList(prev => [...prev, newItem])
      setMsg({ text: 'New achievement added to draft! Click "Save All Changes" to publish.', type: 'success' })
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement card?')) return
    setAchList(prev => prev.filter(item => item.id !== id))
    setMsg({ text: 'Achievement card removed from draft! Click "Save All Changes" to publish.', type: 'success' })
  }

  const handleMove = (index, dir) => {
    const targetIdx = index + dir
    if (targetIdx < 0 || targetIdx >= achList.length) return
    const updated = [...achList]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    setAchList(updated)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      let homeObj = {}
      try {
        const page = await pagesService.getBySlug('home')
        if (page && page.content_html) {
          homeObj = JSON.parse(page.content_html)
        }
      } catch {
        // use empty
      }

      const updatedHomeData = {
        ...homeObj,
        ...sectionConfig,
        achievements_list: achList
      }

      await pagesService.save({
        slug: 'home',
        title: 'Homepage All Elements & Slider',
        content_html: JSON.stringify(updatedHomeData)
      })

      setMsg({ text: 'Student Achievements saved successfully! Changes are immediately live on the homepage in unified single color.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Error saving Student Achievements', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Top Header Bar */}
      <div className="admin-page-header">
        <div>
          <h1>
            Student Achievements Management
            <span className="admin-page-badge">Honors & Accolades</span>
          </h1>
          <p>
            Customize the prestigious highlight cards, numbering, icons, and action links in the showcase on the homepage.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/home" className="admin-btn admin-btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Homepage Settings
          </Link>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      {/* Section Headings Control Card */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>Achievements Section Header &amp; Quote</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>Controls the titles, quote styling, and view all link</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Eyebrow Tag Text</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.achievements_eyebrow}
                onChange={e => setSectionConfig({ ...sectionConfig, achievements_eyebrow: e.target.value })}
                placeholder="— PROUD MOMENTS"
              />
            </div>
            <div className="admin-form-group">
              <label>Main Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.achievements_title}
                onChange={e => setSectionConfig({ ...sectionConfig, achievements_title: e.target.value })}
                placeholder="Student Achievements"
              />
            </div>
            <div className="admin-form-group">
              <label>"View All" Target Link</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.achievements_view_all_link}
                onChange={e => setSectionConfig({ ...sectionConfig, achievements_view_all_link: e.target.value })}
                placeholder="/events"
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: 0 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label>Subtitle / Description</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.achievements_subtitle}
                onChange={e => setSectionConfig({ ...sectionConfig, achievements_subtitle: e.target.value })}
                placeholder="Recognising the talent, dedication and success of our students."
              />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label>Inspirational Stylized Quote</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.achievements_quote}
                onChange={e => setSectionConfig({ ...sectionConfig, achievements_quote: e.target.value })}
                placeholder='“Our students make the difference”'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Cards List Card */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Showcase Cards ({achList.length})</h3>
            <span style={{ fontSize: 12, color: '#5c6672' }}>
              Displayed in a premium 4-column row with single cohesive brand blue styling, elevated circular badge, and action arrow link.
            </span>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => handleOpenModal()}
            style={{ fontSize: 13 }}
          >
            + Add Achievement Card
          </button>
        </div>

        <div className="admin-card-body">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>Loading achievements...</p>
          ) : achList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <p style={{ fontSize: 16, margin: '0 0 10px' }}>No achievements added yet.</p>
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
                Add First Achievement Card
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {achList.map((item, index) => {
                const iconMatch = AVAILABLE_ICONS.find(i => i.id === item.iconType)
                return (
                  <div
                    key={item.id || index}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderBottom: '3.5px solid #1d4ed8',
                      borderRadius: 8,
                      padding: 18,
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div>
                      {/* Top Bar with Number & Icon */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14
                          }}
                        >
                          {item.iconType === 'document' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                          ) : item.iconType === 'people' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          ) : item.iconType === 'chart' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                          ) : item.iconType === 'medal' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                          ) : item.iconType === 'star' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                          )}
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#1d4ed8', fontFamily: 'serif' }}>
                          {item.num || String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                        {item.tag || 'ACHIEVEMENT'}
                      </span>

                      <h4 style={{ margin: '0 0 8px', fontSize: 15, color: '#0f172a', lineHeight: 1.35 }}>
                        {item.title}
                      </h4>

                      <p style={{ margin: '0 0 14px', fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                        {item.detail || item.desc}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600, marginBottom: 12 }}>
                        Link: {item.link || '/events'}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            type="button"
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="admin-btn admin-btn-outline"
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            title="Move Left / Earlier"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, 1)}
                            disabled={index === achList.length - 1}
                            className="admin-btn admin-btn-outline"
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            title="Move Right / Later"
                          >
                            ▶
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenModal(item)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: 11.5 }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            style={{ border: 'none', background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11.5, fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, marginBottom: 40 }}>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ minWidth: 200, padding: '12px 24px', fontSize: 15, justifyContent: 'center' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Edit / Create Achievement Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>
                {editingItem ? 'Edit Achievement Card' : 'Create New Achievement Card'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                <div className="admin-form-group">
                  <label>Display Number *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.num}
                    onChange={e => setForm({ ...form, num: e.target.value })}
                    placeholder="e.g. 01, 02"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category Tag *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                    placeholder="e.g. COMPETITIONS, ACADEMIC EXCELLENCE"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Badge Icon Symbol</label>
                <select
                  className="admin-input"
                  value={form.iconType}
                  onChange={e => setForm({ ...form, iconType: e.target.value })}
                >
                  {AVAILABLE_ICONS.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Achievement Title *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. First Prize – State Physiotherapy Quiz 2026"
                />
              </div>

              <div className="admin-form-group">
                <label>Description / Narrative *</label>
                <textarea
                  rows="3"
                  required
                  className="admin-textarea"
                  value={form.detail}
                  onChange={e => setForm({ ...form, detail: e.target.value })}
                  placeholder="Team of three BPT students won the state-level quiz organized by IAP Maharashtra branch."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <div className="admin-form-group">
                  <label>Target Page Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    placeholder="/events, /research, /academics"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Button Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.linkText}
                    onChange={e => setForm({ ...form, linkText: e.target.value })}
                    placeholder="Know More"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingItem ? 'Update Card' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
