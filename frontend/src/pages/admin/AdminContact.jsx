import React, { useState, useEffect } from 'react'
import AdminMessages from './AdminMessages.jsx'
import { settingsService } from '../../services/endpoints.js'
import { COLLEGE } from '../../data/collegeData.js'

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'details'
  const [settings, setSettings] = useState({
    college_address: COLLEGE.main_campus?.address || '',
    primary_campus_address: COLLEGE.primary_campus?.address || '',
    college_phone: COLLEGE.phone || '',
    college_additional_phone: '+91-9527632033, +91-8788642412',
    college_email: COLLEGE.email || '',
    office_hours: 'Mon – Sat: 8:00 AM – 2:00 PM',
    college_location: 'Pandharpur, Solapur, Maharashtra',
    college_website: COLLEGE.website || ''
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          primary_campus_address: data.primary_campus_address || prev.primary_campus_address,
          college_additional_phone: data.college_additional_phone || prev.college_additional_phone,
          office_hours: data.office_hours || prev.office_hours,
          college_location: data.college_location || prev.college_location
        }))
      }
    }).catch(() => {})
  }, [])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await settingsService.update(settings)
      setMsg({ text: 'Contact details and school desk coordinates updated successfully! Footer and contact page have been refreshed.', type: 'success' })
      setTimeout(() => setMsg({ text: '', type: '' }), 4000)
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update contact details', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1>
            Contact &amp; Inquiries Management
            <span className="admin-page-badge">Helpdesk &amp; Communications</span>
          </h1>
          <p>
            Manage public inquiries, incoming admission messages, and published school contact coordinates across the website and footer.
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
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {activeTab === 'messages' ? (
        <AdminMessages />
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Published Contact &amp; Desk Information
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                Synchronized across <strong>/contact</strong> page and the <strong>website footer</strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings}>
            {/* Phone & Helplines */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Official Phone / Main Helpline *
                </label>
                <input
                  type="text"
                  required
                  value={settings.college_phone || ''}
                  onChange={e => setSettings({ ...settings, college_phone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="+91-8459863477"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Additional Contact Numbers
                </label>
                <input
                  type="text"
                  value={settings.college_additional_phone || ''}
                  onChange={e => setSettings({ ...settings, college_additional_phone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="+91-9527632033, +91-8788642412"
                />
              </div>
            </div>

            {/* Email & Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={settings.college_email || ''}
                  onChange={e => setSettings({ ...settings, college_email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="vijaymadane3@gmail.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Office Working Hours *
                </label>
                <input
                  type="text"
                  required
                  value={settings.office_hours || ''}
                  onChange={e => setSettings({ ...settings, office_hours: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="Mon – Sat: 8:00 AM – 2:00 PM"
                />
              </div>
            </div>

            {/* Campuses Addresses */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Primary / Foundation Campus Physical Address
              </label>
              <textarea
                rows={2}
                value={settings.primary_campus_address || ''}
                onChange={e => setSettings({ ...settings, primary_campus_address: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="Behind MSEDCL Division Office, Link Road, Isbavi, Pandharpur - 413304"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Main High School Campus Physical Address *
              </label>
              <textarea
                rows={2}
                required
                value={settings.college_address || ''}
                onChange={e => setSettings({ ...settings, college_address: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="Shelve, Pandharpur, Dist. Solapur, Maharashtra - 413304"
              />
            </div>

            {/* Location & Website */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Town / Region (Footer Tagline)
                </label>
                <input
                  type="text"
                  value={settings.college_location || ''}
                  onChange={e => setSettings({ ...settings, college_location: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="Pandharpur, Solapur, Maharashtra"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                  Official Website Domain
                </label>
                <input
                  type="text"
                  value={settings.college_website || ''}
                  onChange={e => setSettings({ ...settings, college_website: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  placeholder="www.karmayogividyaniketan.edu.in"
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ minWidth: 180, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                {saving ? 'Saving...' : 'Save Contact Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
