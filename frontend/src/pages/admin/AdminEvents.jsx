import React, { useState, useEffect } from 'react'
import { eventsService, uploadService } from '../../services/endpoints.js'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    title: '',
    event_type: 'Conference',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 04:00 PM',
    venue: 'College Auditorium',
    description: '',
    image_url: '',
    is_published: 1
  })

  const loadEvents = async () => {
    setLoading(true)
    try {
      const data = await eventsService.getAll(true)
      setEvents(data)
    } catch {
      setMsg({ text: 'Failed to load events', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleOpenModal = (evt = null) => {
    if (evt) {
      setEditingEvent(evt)
      setForm({
        title: evt.title || '',
        event_type: evt.event_type || evt.type || 'Event',
        date: evt.date || '',
        time: evt.time || '',
        venue: evt.venue || '',
        description: evt.description || evt.desc || '',
        image_url: evt.image_url || '',
        is_published: evt.is_published !== undefined ? evt.is_published : 1
      })
    } else {
      setEditingEvent(null)
      setForm({
        title: '',
        event_type: 'Conference',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM - 04:00 PM',
        venue: 'College Auditorium',
        description: '',
        image_url: '',
        is_published: 1
      })
    }
    setModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'events')
      setForm(prev => ({ ...prev, image_url: url }))
      setMsg({ text: 'Event poster uploaded successfully', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEvent?.id) {
        await eventsService.update(editingEvent.id, form)
        setMsg({ text: 'Event updated successfully', type: 'success' })
      } else {
        await eventsService.create(form)
        setMsg({ text: 'Event created successfully', type: 'success' })
      }
      setModalOpen(false)
      loadEvents()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving event', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event permanently?')) return
    try {
      await eventsService.delete(id)
      setMsg({ text: 'Event deleted successfully', type: 'success' })
      loadEvents()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete event', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            College Events & Workshops
            <span className="admin-page-badge">Campus Activities</span>
          </h1>
          <p>
            Manage academic conferences, clinical workshops, sports meets, and institutional ceremonies.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Add New Event
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
          <h3>Event Schedule</h3>
          <span style={{ fontSize: 13, color: '#5c6672' }}>Total: {events.length}</span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading events...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Date</th>
                  <th>Title & Description</th>
                  <th>Type</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td style={{ color: '#5c6672', whiteSpace: 'nowrap' }}>{e.date}</td>
                    <td>
                      <strong style={{ color: '#071d3a' }}>{e.title}</strong>
                      <div style={{ fontSize: 12, color: '#5c6672', marginTop: 2 }}>
                        {e.description || e.desc}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge badge-info">{e.event_type || e.type || 'Event'}</span>
                    </td>
                    <td>{e.venue || 'Campus'}</td>
                    <td>
                      <span className={`admin-badge ${e.is_published !== 0 ? 'badge-success' : 'badge-warning'}`}>
                        {e.is_published !== 0 ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenModal(e)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(e.id)}
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

      {/* Event Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={() => setModalOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Event Type</label>
                    <select
                      className="admin-select"
                      value={form.event_type}
                      onChange={e => setForm({ ...form, event_type: e.target.value })}
                    >
                      <option value="Conference">Conference</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Guest Lecture">Guest Lecture</option>
                      <option value="Competition">Competition</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Event">General Event</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      required
                      className="admin-input"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Timing</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 04:00 PM"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Venue Location *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={form.venue}
                      onChange={e => setForm({ ...form, venue: e.target.value })}
                      placeholder="e.g. College Auditorium"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Event Description</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 600 }}>Event Image / Poster</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1, minWidth: 200 }}
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      placeholder="Paste image URL (https://...) or choose file"
                    />
                    <label
                      className="admin-btn admin-btn-secondary"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0, height: 38 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {form.image_url && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                        onClick={() => setForm({ ...form, image_url: '' })}
                        title="Clear image"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {uploading && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading poster...</div>}
                  {form.image_url && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={form.image_url} alt="Event Preview" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Poster set</span>
                    </div>
                  )}
                </div>

                <div>
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
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
