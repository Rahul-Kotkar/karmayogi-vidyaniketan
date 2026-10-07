import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pagesService, uploadService } from '../../services/endpoints.js'
import { NEWS as DEFAULT_NEWS } from '../../data/collegeData.js'
import { resolveMediaUrl } from '../../utils/mediaUrl.js'

export default function AdminNews() {
  const [newsList, setNewsList] = useState([])
  const [sectionConfig, setSectionConfig] = useState({
    news_eyebrow: '— NEWS & EVENTS',
    news_title: 'College News',
    news_subtitle: 'Stay informed about the latest happenings, initiatives and milestones at our college.',
    news_view_all_link: '/news'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    title: '',
    tag: 'ACCREDITATION',
    date: new Date().toISOString().split('T')[0],
    desc: '',
    image: '',
    link: '/about'
  })

  // Load existing home page configuration
  useEffect(() => {
    async function load() {
      try {
        const page = await pagesService.getBySlug('home')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (parsed.news_list && Array.isArray(parsed.news_list) && parsed.news_list.length > 0) {
              setNewsList(parsed.news_list)
            } else {
              setNewsList(DEFAULT_NEWS)
            }
            setSectionConfig({
              news_eyebrow: parsed.news_eyebrow || '— NEWS & EVENTS',
              news_title: parsed.news_title || 'College News',
              news_subtitle: parsed.news_subtitle || 'Stay informed about the latest happenings, initiatives and milestones at our college.',
              news_view_all_link: parsed.news_view_all_link || '/news'
            })
          } catch {
            setNewsList(DEFAULT_NEWS)
          }
        } else {
          setNewsList(DEFAULT_NEWS)
        }
      } catch (err) {
        console.error('Error loading news:', err)
        setNewsList(DEFAULT_NEWS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Open modal for add or edit
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setForm({
        title: item.title || '',
        tag: item.tag || 'ACCREDITATION',
        date: item.date || new Date().toISOString().split('T')[0],
        desc: item.desc || '',
        image: item.image || '',
        link: item.link || '/about'
      })
    } else {
      setEditingItem(null)
      setForm({
        title: '',
        tag: 'ACCREDITATION',
        date: new Date().toISOString().split('T')[0],
        desc: '',
        image: '',
        link: '/about'
      })
    }
    setModalOpen(true)
  }

  // Upload thumbnail photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'news')
      setForm(prev => ({ ...prev, image: url }))
      setMsg({ text: 'Thumbnail photo uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  // Save single news item modal
  const handleSaveModal = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      alert('Please enter a headline title.')
      return
    }

    if (editingItem) {
      setNewsList(prev => prev.map(item => (item.id === editingItem.id ? { ...item, ...form } : item)))
      setMsg({ text: 'News item updated in draft! Click "Save All Changes" to publish.', type: 'success' })
    } else {
      const newItem = {
        id: Date.now(),
        ...form
      }
      setNewsList(prev => [newItem, ...prev])
      setMsg({ text: 'New news item added to draft! Click "Save All Changes" to publish.', type: 'success' })
    }
    setModalOpen(false)
  }

  // Delete news item
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return
    setNewsList(prev => prev.filter(item => item.id !== id))
    setMsg({ text: 'News item removed from draft! Click "Save All Changes" to publish.', type: 'success' })
  }

  // Reorder news items
  const handleMove = (index, dir) => {
    const targetIdx = index + dir
    if (targetIdx < 0 || targetIdx >= newsList.length) return
    const updated = [...newsList]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    setNewsList(updated)
  }

  // Save everything to database
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      // Fetch latest home page data first to merge
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
        news_list: newsList
      }

      await pagesService.save({
        slug: 'home',
        title: 'Homepage All Elements & Slider',
        content_html: JSON.stringify(updatedHomeData)
      })

      setMsg({ text: 'College News saved successfully! Changes are immediately live on the homepage.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Error saving College News', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Top Header Bar */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Campus Press &amp; Announcements</span>
          <h1>College News Management</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Manage the featured news banner, side thumbnail feed, dates, tags, and articles displayed on the homepage.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/home" className="admin-btn admin-btn-secondary">
            Homepage Settings
          </Link>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
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
          <h3>News Section Header &amp; Subtitle</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>Controls the typography at the top of the news section</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Eyebrow Tag Text</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.news_eyebrow}
                onChange={e => setSectionConfig({ ...sectionConfig, news_eyebrow: e.target.value })}
                placeholder="— NEWS & EVENTS"
              />
            </div>
            <div className="admin-form-group">
              <label>Main Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.news_title}
                onChange={e => setSectionConfig({ ...sectionConfig, news_title: e.target.value })}
                placeholder="College News"
              />
            </div>
            <div className="admin-form-group">
              <label>"View All" Target Link</label>
              <input
                type="text"
                className="admin-input"
                value={sectionConfig.news_view_all_link}
                onChange={e => setSectionConfig({ ...sectionConfig, news_view_all_link: e.target.value })}
                placeholder="/notices"
              />
            </div>
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label>Subtitle / Description</label>
            <input
              type="text"
              className="admin-input"
              value={sectionConfig.news_subtitle}
              onChange={e => setSectionConfig({ ...sectionConfig, news_subtitle: e.target.value })}
              placeholder="Stay informed about the latest happenings, initiatives and milestones at our college."
            />
          </div>
        </div>
      </div>

      {/* News Items List Card */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Articles &amp; Announcements ({newsList.length})</h3>
            <span style={{ fontSize: 12, color: '#5c6672' }}>
              Item #1 is displayed as the <strong>Large Featured Split Card</strong> with building photo and dark background. Items #2, #3, #4 appear on the right side stack.
            </span>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => handleOpenModal()}
            style={{ fontSize: 13 }}
          >
            + Add News Item
          </button>
        </div>

        <div className="admin-card-body">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>Loading news articles...</p>
          ) : newsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <p style={{ fontSize: 16, margin: '0 0 10px' }}>No news articles added yet.</p>
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
                Add First News Article
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {newsList.map((item, index) => {
                const isFeatured = index === 0
                return (
                  <div
                    key={item.id || index}
                    style={{
                      border: isFeatured ? '1.5px solid #0b63e5' : '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 16,
                      background: isFeatured ? '#f8fafc' : '#ffffff',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Thumbnail Image Preview */}
                    <div
                      style={{
                        width: 90,
                        height: 65,
                        borderRadius: 6,
                        overflow: 'hidden',
                        background: '#e2e8f0',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.image ? (
                        <img
                          src={resolveMediaUrl(item.image)}
                          alt={item.title}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: 10, color: '#64748b', textAlign: 'center' }}>Campus Photo</span>
                      )}
                    </div>

                    {/* News Details */}
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        {isFeatured && (
                          <span style={{ fontSize: 11, background: '#0b63e5', color: '#ffffff', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                            FEATURED
                          </span>
                        )}
                        <span style={{ fontSize: 11, background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                          {item.tag || 'GENERAL'}
                        </span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{item.date}</span>
                      </div>

                      <h4 style={{ margin: '0 0 4px', fontSize: 15, color: '#0f172a' }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.desc}
                      </p>
                      {item.link && (
                        <span style={{ fontSize: 11.5, color: '#0b63e5', display: 'inline-block', marginTop: 4 }}>
                          Link: {item.link}
                        </span>
                      )}
                    </div>

                    {/* Order & Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        title="Move Up (Make Featured)"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === newsList.length - 1}
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                      >
                        Delete
                      </button>
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Edit / Create News Item Modal */}
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
              maxWidth: 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>
                {editingItem ? 'Edit News Article' : 'Create New News Article'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="admin-form-group">
                  <label>Category / Tag *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                    placeholder="e.g. ACCREDITATION, INFRASTRUCTURE"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Publication Date *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. SEP 10, 2026 or 2026-09-10"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Headline Title *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. College secures NAAC Grade 'A' (CGPA 3.02)"
                />
              </div>

              <div className="admin-form-group">
                <label>Article Summary / Description *</label>
                <textarea
                  rows="3"
                  required
                  className="admin-textarea"
                  value={form.desc}
                  onChange={e => setForm({ ...form, desc: e.target.value })}
                  placeholder="The college has been accredited with NAAC Grade 'A' with a CGPA of 3.02..."
                />
              </div>

              <div className="admin-form-group">
                <label>Article / Action Link Target</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="/about or /notices or https://..."
                />
              </div>

              {/* Photo Upload Strip */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  Article Thumbnail Photo
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 80,
                      height: 55,
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: '#cbd5e1',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {form.image ? (
                      <img
                        src={resolveMediaUrl(form.image)}
                        alt="Preview"
                        onError={(e) => {
                          e.target.onerror = null
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: 10, color: '#64748b' }}>No photo</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
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
                    {uploading && <p style={{ fontSize: 11, color: '#0284c7', margin: '4px 0 0' }}>Uploading photo...</p>}
                    <input
                      type="text"
                      className="admin-input"
                      style={{ fontSize: 12, marginTop: 6 }}
                      value={form.image}
                      onChange={e => setForm({ ...form, image: e.target.value })}
                      placeholder="Or paste image URL (https://...)"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingItem ? 'Update News Article' : 'Add News Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
