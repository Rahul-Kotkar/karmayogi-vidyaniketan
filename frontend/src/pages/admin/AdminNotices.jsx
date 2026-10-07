import React, { useState, useEffect } from 'react'
import { noticesService, uploadService } from '../../services/endpoints.js'

export default function AdminNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    title: '',
    category: 'General',
    body: '',
    file_url: '',
    notice_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    is_published: 1,
    is_featured: 0
  })

  const loadNotices = async () => {
    setLoading(true)
    try {
      const data = await noticesService.getAll(true)
      setNotices(data)
    } catch {
      setMsg({ text: 'Failed to load notices', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice)
      setForm({
        title: notice.title || '',
        category: notice.category || 'General',
        body: notice.body || '',
        file_url: notice.file_url || '',
        notice_date: notice.notice_date || notice.date || '',
        expiry_date: notice.expiry_date || '',
        is_published: notice.is_published !== undefined ? notice.is_published : 1,
        is_featured: notice.is_featured ? 1 : 0
      })
    } else {
      setEditingNotice(null)
      setForm({
        title: '',
        category: 'General',
        body: '',
        file_url: '',
        notice_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        is_published: 1,
        is_featured: 0
      })
    }
    setModalOpen(true)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'notices')
      setForm(prev => ({ ...prev, file_url: url }))
      setMsg({ text: 'Attachment uploaded successfully', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'File upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingNotice?.id) {
        await noticesService.update(editingNotice.id, form)
        setMsg({ text: 'Notice updated successfully', type: 'success' })
      } else {
        await noticesService.create(form)
        setMsg({ text: 'Notice published successfully', type: 'success' })
      }
      setModalOpen(false)
      loadNotices()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving notice', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this notice?')) return
    try {
      await noticesService.delete(id)
      setMsg({ text: 'Notice deleted successfully', type: 'success' })
      loadNotices()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete notice', type: 'danger' })
    }
  }

  const filteredNotices = notices.filter(n =>
    (n.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (n.category?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Notices &amp; Circulars</span>
          <h1>Notice Management</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Publish official college circulars, student announcements, and admission circulars.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Create New Notice
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <input
            type="text"
            className="admin-input"
            style={{ maxWidth: 300 }}
            placeholder="Search notices by title or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span style={{ fontSize: 13, color: '#5c6672' }}>
            Showing {filteredNotices.length} notices
          </span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading notices...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Date</th>
                  <th>Title & Description</th>
                  <th style={{ width: 120 }}>Category</th>
                  <th style={{ width: 100 }}>Attachment</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 30, color: '#5c6672' }}>
                      No notices found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredNotices.map(n => (
                    <tr key={n.id}>
                      <td style={{ color: '#5c6672', whiteSpace: 'nowrap' }}>
                        {n.notice_date || n.date}
                      </td>
                      <td>
                        <strong style={{ color: '#071d3a' }}>{n.title}</strong>
                        {n.body && (
                          <div style={{ fontSize: 12, color: '#5c6672', marginTop: 4, maxHeight: 38, overflow: 'hidden' }}>
                            {n.body}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="admin-badge badge-info">{n.category}</span>
                      </td>
                      <td>
                        {n.file_url ? (
                          <a href={n.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            View File
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>None</span>
                        )}
                      </td>
                      <td>
                        <span className={`admin-badge ${n.is_published ? 'badge-success' : 'badge-warning'}`}>
                          {n.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          style={{ marginRight: 6 }}
                          onClick={() => handleOpenModal(n)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(n.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Notice Edit/Create Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h3>
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

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Notice Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Admission Notification – BPT A.Y. 2026–27"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      className="admin-select"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Admission">Admission</option>
                      <option value="Academic">Academic</option>
                      <option value="Examination">Examination</option>
                      <option value="University">University</option>
                      <option value="Student">Student</option>
                      <option value="Announcement">Announcement</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Notice Date *</label>
                    <input
                      type="date"
                      required
                      className="admin-input"
                      value={form.notice_date}
                      onChange={e => setForm({ ...form, notice_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={form.expiry_date}
                    onChange={e => setForm({ ...form, expiry_date: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Detailed Notice Body / Content</label>
                  <textarea
                    rows="4"
                    className="admin-textarea"
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    placeholder="Enter full announcement text..."
                  />
                </div>

                <div className="admin-form-group">
                  <label>Attachment Document (PDF / Image)</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {uploading && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading file...</div>}
                  {form.file_url && (
                    <div style={{ fontSize: 12, color: '#15803d', marginTop: 4 }}>
                      Current file: <a href={form.file_url} target="_blank" rel="noopener noreferrer">{form.file_url}</a>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!form.is_published}
                      onChange={e => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })}
                    />
                    <b>Publish immediately on public website</b>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingNotice ? 'Save Changes' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
