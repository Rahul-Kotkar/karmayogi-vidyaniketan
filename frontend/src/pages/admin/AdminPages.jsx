import React, { useState, useEffect } from 'react'
import { pagesService, uploadService } from '../../services/endpoints.js'

export default function AdminPages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState('about')
  const [currentPage, setCurrentPage] = useState({
    slug: 'about',
    title: '',
    banner_url: '',
    excerpt: '',
    content_html: '',
    meta_title: '',
    meta_description: ''
  })
  const [saving, setSaving] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const pagePresets = [
    { slug: 'about', label: 'About College' },
    { slug: 'academics', label: 'Academics & Curriculum' },
    { slug: 'research', label: 'Research & Development' },
    { slug: 'student-corner', label: 'Student Corner' },
    { slug: 'training-placement', label: 'Training & Placement' },
    { slug: 'iqac-naac', label: 'IQAC & NAAC' },
    { slug: 'hospital', label: 'Hospital & Clinical Services' },
    { slug: 'mandatory-disclosures', label: 'Mandatory Disclosures' }
  ]

  const loadPage = async (slug) => {
    setSelectedSlug(slug)
    try {
      const data = await pagesService.getBySlug(slug)
      if (data) {
        setCurrentPage(data)
      } else {
        const preset = pagePresets.find(p => p.slug === slug)
        setCurrentPage({
          slug,
          title: preset?.label || slug,
          banner_url: '',
          excerpt: '',
          content_html: `<p>Content for ${preset?.label || slug}...</p>`,
          meta_title: '',
          meta_description: ''
        })
      }
    } catch {
      setMsg({ text: 'Error fetching page data', type: 'danger' })
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true)
      await loadPage('about')
      setLoading(false)
    }
    init()
  }, [])

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingBanner(true)
    try {
      const url = await uploadService.uploadFile(file, 'banners')
      setCurrentPage(prev => ({ ...prev, banner_url: url }))
      setMsg({ text: 'Header banner image uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Banner upload failed', type: 'danger' })
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await pagesService.save(currentPage)
      setMsg({ text: `Page "${currentPage.title}" updated successfully!`, type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save page', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Static CMS &amp; Legal</span>
          <h1>Website CMS Pages</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Manage rich text contents, accreditation details, and institutional disclosures.
          </p>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Page Selector Sidebar */}
        <div className="admin-card" style={{ height: 'fit-content' }}>
          <div className="admin-card-header">
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>Institutional Pages</h3>
          </div>
          <div style={{ padding: '8px 0' }}>
            {pagePresets.map(p => (
              <button
                key={p.slug}
                onClick={() => loadPage(p.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 16px',
                  background: selectedSlug === p.slug ? '#f1f5f9' : 'transparent',
                  color: selectedSlug === p.slug ? '#0f2d59' : '#475569',
                  border: 'none',
                  borderLeft: selectedSlug === p.slug ? '4px solid #0f2d59' : '4px solid transparent',
                  fontWeight: selectedSlug === p.slug ? 700 : 500,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{p.label}</span>
                <span style={{ fontSize: 11, color: selectedSlug === p.slug ? '#0f2d59' : '#94a3b8' }}>/{p.slug}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Page Editor Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Editing: {currentPage.title || selectedSlug}</h3>
            <span style={{ fontSize: 12, color: '#5c6672' }}>Slug: /{selectedSlug}</span>
          </div>

          <form onSubmit={handleSave} className="admin-card-body">
            <div className="admin-form-group">
              <label>Page Title *</label>
              <input
                type="text"
                required
                className="admin-input"
                value={currentPage.title}
                onChange={e => setCurrentPage({ ...currentPage, title: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label style={{ fontWeight: 600 }}>Header Banner Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, minWidth: 200 }}
                  value={currentPage.banner_url || ''}
                  onChange={e => setCurrentPage({ ...currentPage, banner_url: e.target.value })}
                  placeholder="Paste image URL (https://...) or choose file"
                />
                <label
                  className="admin-btn admin-btn-secondary"
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {uploadingBanner ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                    style={{ display: 'none' }}
                  />
                </label>
                {currentPage.banner_url && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                    onClick={() => setCurrentPage({ ...currentPage, banner_url: '' })}
                    title="Clear banner"
                  >
                    Clear
                  </button>
                )}
              </div>
              {uploadingBanner && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading banner image...</div>}
              {currentPage.banner_url && (
                <div style={{ marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden', maxHeight: 110, position: 'relative' }}>
                  <img
                    src={currentPage.banner_url}
                    alt="Banner preview"
                    style={{ height: 100, width: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 4, right: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>
                    Banner Preview
                  </div>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label>Brief Excerpt / Sub-heading</label>
              <input
                type="text"
                className="admin-input"
                value={currentPage.excerpt || ''}
                onChange={e => setCurrentPage({ ...currentPage, excerpt: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Page Content (HTML supported) *</label>
              <textarea
                rows="12"
                required
                className="admin-textarea"
                style={{ fontFamily: 'monospace', fontSize: 13 }}
                value={currentPage.content_html}
                onChange={e => setCurrentPage({ ...currentPage, content_html: e.target.value })}
              />
              <span style={{ fontSize: 11, color: '#5c6672' }}>
                Standard HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;table&gt; are supported.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>SEO Meta Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentPage.meta_title || ''}
                  onChange={e => setCurrentPage({ ...currentPage, meta_title: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>SEO Meta Description</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentPage.meta_description || ''}
                  onChange={e => setCurrentPage({ ...currentPage, meta_description: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ minWidth: 160, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 7 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>{saving ? 'Saving Changes...' : 'Save Page Content'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
