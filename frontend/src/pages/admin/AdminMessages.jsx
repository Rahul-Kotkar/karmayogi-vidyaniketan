import React, { useState, useEffect } from 'react'
import { contactService } from '../../services/endpoints.js'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyNotes, setReplyNotes] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  const loadMessages = async () => {
    setLoading(true)
    try {
      const data = await contactService.getAll()
      setMessages(data)
    } catch {
      setMsg({ text: 'Failed to load messages', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleOpenDetail = (m) => {
    setSelectedMessage(m)
    setReplyNotes(m.admin_notes || '')
    // Auto mark as read if unread
    if (m.status === 'unread') {
      contactService.updateStatus(m.id, 'read')
      setMessages(prev => prev.map(item => item.id === m.id ? { ...item, status: 'read' } : item))
    }
  }

  const handleUpdateStatus = async (status) => {
    if (!selectedMessage) return
    try {
      await contactService.updateStatus(selectedMessage.id, status, replyNotes)
      setMsg({ text: `Message marked as ${status}`, type: 'success' })
      setSelectedMessage(prev => ({ ...prev, status, admin_notes: replyNotes }))
      loadMessages()
    } catch (err) {
      setMsg({ text: err.message || 'Status update failed', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return
    try {
      await contactService.delete(id)
      setMsg({ text: 'Message deleted', type: 'success' })
      if (selectedMessage?.id === id) setSelectedMessage(null)
      loadMessages()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete message', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Correspondence &amp; Inquiries</span>
          <h1>Contact Enquiries &amp; Messages</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Public enquiries, admission requests, and correspondence submitted via the website contact form.
          </p>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Messages List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Enquiry Inbox</h3>
            <span style={{ fontSize: 13, color: '#5c6672' }}>Total: {messages.length}</span>
          </div>

          <div className="admin-card-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 30, textAlign: 'center' }}>Loading enquiries...</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5c6672' }}>
                No enquiries received yet.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ width: 80, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(m => (
                    <tr
                      key={m.id}
                      style={{
                        background: selectedMessage?.id === m.id ? '#f0fdf4' : 'inherit',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenDetail(m)}
                    >
                      <td>
                        <strong>{m.name}</strong><br />
                        <span style={{ fontSize: 11, color: '#5c6672' }}>{m.email}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: m.status === 'unread' ? 700 : 400 }}>
                          {m.subject || 'Enquiry'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#5c6672', whiteSpace: 'nowrap' }}>
                        {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td>
                        <span className={`admin-badge ${
                          m.status === 'unread' ? 'badge-danger' :
                          m.status === 'replied' ? 'badge-success' : 'badge-info'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(m.id)}
                          title="Delete enquiry"
                          style={{ padding: '4px 8px' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Message Details */}
        {selectedMessage && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Enquiry Details</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedMessage(null)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="admin-card-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#5c6672', textTransform: 'uppercase' }}>From</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#071d3a' }}>{selectedMessage.name}</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  <b>Email:</b> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a> | <b>Phone:</b> {selectedMessage.phone || 'Not provided'}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#5c6672', textTransform: 'uppercase' }}>Subject</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedMessage.subject || 'General Enquiry'}</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: '#5c6672', textTransform: 'uppercase' }}>Message Body</div>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  padding: 14,
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  marginTop: 6
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Administrative Notes / Follow-up Details</label>
                <textarea
                  rows="3"
                  className="admin-textarea"
                  value={replyNotes}
                  onChange={e => setReplyNotes(e.target.value)}
                  placeholder="Record phone follow-up notes or response status..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => handleUpdateStatus('replied')}
                >
                  Mark as Replied
                </button>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => handleUpdateStatus('read')}
                >
                  Mark as Read
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Enquiry')}`}
                  className="admin-btn admin-btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
