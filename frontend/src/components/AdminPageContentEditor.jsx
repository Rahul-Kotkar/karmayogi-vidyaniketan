import React, { useState, useEffect } from 'react'
import { pagesService, uploadService } from '../services/endpoints.js'

export default function AdminPageContentEditor({
  slug,
  defaultTitle,
  defaultContent,
  subtitle,
  children
}) {
  const [page, setPage] = useState({
    slug,
    title: defaultTitle || '',
    banner_url: '',
    excerpt: '',
    content_html: defaultContent || '',
    meta_title: '',
    meta_description: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [activeTab, setActiveTab] = useState('edit') // 'edit' or 'preview'

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await pagesService.getBySlug(slug)
        if (data && data.title) {
          setPage(data)
        } else {
          setPage({
            slug,
            title: defaultTitle || '',
            banner_url: '',
            excerpt: '',
            content_html: defaultContent || '',
            meta_title: `${defaultTitle} | Karmayogi College of Physiotherapy`,
            meta_description: `Learn about ${defaultTitle} at Karmayogi College of Physiotherapy, Shelve, Pandharpur.`
          })
        }
      } catch {
        // Fallback to defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, defaultTitle, defaultContent])

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'banners')
      setPage(prev => ({ ...prev, banner_url: url }))
      setMsg({ text: 'Banner image uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Banner upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })

    try {
      await pagesService.save(page)
      setMsg({ text: `Page "${page.title}" updated successfully! Changes are live on website.`, type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save page changes', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const insertTag = (open, close) => {
    const textarea = document.getElementById(`editor-${slug}`)
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = page.content_html.substring(start, end)
    const replacement = `${open}${selected || 'Text here'}${close}`
    const updated = page.content_html.substring(0, start) + replacement + page.content_html.substring(end)
    setPage({ ...page, content_html: updated })
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{page.title || defaultTitle}</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            {subtitle || `Manage published content, guidelines, and documents for the /${slug} page.`}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save Page Changes'}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      {/* Extra sub-module components if provided (e.g. lists, cards) */}
      {children}

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <h3>Page Content & Structure</h3>
            <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', padding: 2, borderRadius: 6 }}>
              <button
                type="button"
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  background: activeTab === 'edit' ? '#fff' : 'transparent',
                  color: activeTab === 'edit' ? '#0f2d59' : '#64748b',
                  cursor: 'pointer',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
                onClick={() => setActiveTab('edit')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editor
              </button>
              <button
                type="button"
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  background: activeTab === 'preview' ? '#fff' : 'transparent',
                  color: activeTab === 'preview' ? '#0f2d59' : '#64748b',
                  cursor: 'pointer',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
                onClick={() => setActiveTab('preview')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Live Preview
              </button>
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#5c6672' }}>URL: /{slug}</span>
        </div>

        <form onSubmit={handleSave} className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Page Title (Appears in Banner & Navigation) *</label>
              <input
                type="text"
                required
                className="admin-input"
                value={page.title}
                onChange={e => setPage({ ...page, title: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Brief Excerpt / Subheading</label>
              <input
                type="text"
                className="admin-input"
                value={page.excerpt || ''}
                onChange={e => setPage({ ...page, excerpt: e.target.value })}
                placeholder="Short 1-line description..."
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Top Banner Background Image</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                className="admin-input"
                style={{ flex: 1 }}
                value={page.banner_url || ''}
                onChange={e => setPage({ ...page, banner_url: e.target.value })}
                placeholder="https://... or upload below"
              />
              <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Upload Banner
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {uploading && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading banner...</div>}
            {page.banner_url && (
              <div style={{ marginTop: 8 }}>
                <img src={page.banner_url} alt="Banner preview" style={{ height: 60, width: '100%', objectFit: 'cover', borderRadius: 4 }} />
              </div>
            )}
          </div>

          {activeTab === 'edit' ? (
            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ margin: 0 }}>Page Body HTML Content *</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => insertTag('<h3>', '</h3>')}>+ Heading 3</button>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => insertTag('<p>', '</p>')}>+ Paragraph</button>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}>+ Bullet List</button>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => insertTag('<b>', '</b>')}>+ Bold</button>
                </div>
              </div>
              <textarea
                id={`editor-${slug}`}
                rows="14"
                required
                className="admin-textarea"
                style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}
                value={page.content_html}
                onChange={e => setPage({ ...page, content_html: e.target.value })}
              />
              <span style={{ fontSize: 11, color: '#5c6672' }}>
                Supports standard HTML elements: headings (&lt;h3&gt;), paragraphs (&lt;p&gt;), lists (&lt;ul&gt;, &lt;li&gt;), bold (&lt;b&gt;), links (&lt;a href="..."&gt;), and tables (&lt;table&gt;).
              </span>
            </div>
          ) : (
            <div className="admin-form-group">
              <label>Live Preview</label>
              <div style={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: 24,
                minHeight: 250,
                maxHeight: 450,
                overflowY: 'auto'
              }} className="prose" dangerouslySetInnerHTML={{ __html: page.content_html }} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 10 }}>
            <div className="admin-form-group">
              <label>SEO Meta Title</label>
              <input
                type="text"
                className="admin-input"
                value={page.meta_title || ''}
                onChange={e => setPage({ ...page, meta_title: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>SEO Meta Description</label>
              <input
                type="text"
                className="admin-input"
                value={page.meta_description || ''}
                onChange={e => setPage({ ...page, meta_description: e.target.value })}
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
              <span>{saving ? 'Saving...' : 'Save Page Content'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
