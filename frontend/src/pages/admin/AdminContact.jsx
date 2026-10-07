import React, { useState, useEffect } from 'react'
import AdminMessages from './AdminMessages.jsx'
import { settingsService } from '../../services/endpoints.js'

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'details'
  const [settings, setSettings] = useState({
    college_address: '',
    college_phone: '',
    college_email: '',
    college_website: ''
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) setSettings(prev => ({ ...prev, ...data }))
    }).catch(() => {})
  }, [])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsService.update(settings)
      setMsg({ text: 'Contact page details updated successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update contact details', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            Contact &amp; Inquiries Management
            <span className="admin-page-badge">Helpdesk & Communications</span>
          </h1>
          <p>
            Manage public inquiries, incoming admission correspondence, and published college contact coordinates.
          </p>
        </div>
        <div className="admin-page-actions">
          <div className="admin-tabs" style={{ margin: 0 }}>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              1. Inquiries &amp; Messages
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              2. Contact Details &amp; Address
            </button>
          </div>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      {activeTab === 'messages' ? (
        <AdminMessages />
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Published Contact Information</h3>
            <span style={{ fontSize: 12, color: '#5c6672' }}>Displayed on /contact & website footer</span>
          </div>

          <form onSubmit={handleSaveSettings} className="admin-card-body">
            <div className="admin-form-group">
              <label>College Campus Physical Address *</label>
              <textarea
                rows="3"
                required
                className="admin-textarea"
                value={settings.college_address || ''}
                onChange={e => setSettings({ ...settings, college_address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label>Official Phone Number *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={settings.college_phone || ''}
                  onChange={e => setSettings({ ...settings, college_phone: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Official Email *</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  value={settings.college_email || ''}
                  onChange={e => setSettings({ ...settings, college_email: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Official Website Domain</label>
              <input
                type="text"
                className="admin-input"
                value={settings.college_website || ''}
                onChange={e => setSettings({ ...settings, college_website: e.target.value })}
              />
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ minWidth: 160, justifyContent: 'center' }}
              >
                {saving ? 'Saving...' : 'Save Contact Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
