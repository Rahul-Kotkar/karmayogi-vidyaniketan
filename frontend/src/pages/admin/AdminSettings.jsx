import React, { useState, useEffect } from 'react'
import { settingsService, uploadService } from '../../services/endpoints.js'
import defaultCollegeLogo from '../../assets/college_logo.png'
import defaultFounderImg from '../../assets/founder.png'

function formatFounderCaption(name) {
  if (!name) return "स्व. सुधाकरपंत परिचारक"
  let clean = String(name).trim()
  clean = clean.replace(/श्रध्येय/g, 'श्रद्धेय')
  clean = clean.replace(/श्रद्धेय\./g, 'श्रद्धेय')
  return clean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    college_name: 'Karmayogi Vidyaniketan',
    school_subname: 'Karmayogi Public School',
    foundation_name: "Shri Pandurang Pratishthan, Pandharpur's",
    college_logo_url: '',
    founder_photo_url: '',
    founder_top_label: 'Karmayogi',
    founder_name: 'स्व. सुधाकरपंत परिचारक',
    college_address: 'Primary Campus: Behind MSEDCL Division Office, Link Road, Isbavi | High School Campus: Shelve, Pandharpur - 413304',
    college_phone: '+91-8459863477',
    college_email: 'vijaymadane3@gmail.com',
    college_website: 'www.karmayogividyaniketan.com'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState({ college: false, founder: false })
  const [msg, setMsg] = useState({ text: '', type: '' })

  const handleLogoUpload = async (e, key) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingLogo(prev => ({ ...prev, [key]: true }))
    try {
      const url = await uploadService.uploadFile(file, 'logos')
      if (key === 'founder') {
        setSettings(prev => ({ ...prev, founder_photo_url: url }))
      } else {
        setSettings(prev => ({ ...prev, [`${key}_logo_url`]: url }))
      }
      setMsg({
        text: `${key === 'founder' ? 'Founder portrait' : 'School emblem logo'} uploaded successfully! Remember to save settings below.`,
        type: 'success'
      })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploadingLogo(prev => ({ ...prev, [key]: false }))
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.get()
        if (data && typeof data === 'object') {
          setSettings(prev => ({ ...prev, ...data }))
        }
      } catch {
        setMsg({ text: 'Error loading settings', type: 'danger' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsService.update(settings)
      // Broadcast settings update to Header across tabs / components
      window.dispatchEvent(new CustomEvent('settings_updated', { detail: settings }))
      setMsg({ text: 'Institutional settings & logos updated successfully! Changes are live across the website header and all pages.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save settings', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">School Identity &amp; Profile</span>
          <h1>Institutional &amp; Website Settings</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Manage header branding, school identity, physical campus address, contact info, and logos.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      {/* Live Preview of Header Institutional Banner */}
      <div className="admin-card" style={{ overflow: 'hidden', border: '1.5px solid #cbd5e1', marginBottom: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
        <div className="admin-card-header" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }}></span>
              Live Website Header Banner Preview
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Pixel-perfect preview of your public header banner and top utility bar</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: 999, border: '1px solid #bae6fd' }}>
            Live Sync
          </span>
        </div>

        {/* 1. Dark Navy Blue Top Utility Bar Preview */}
        <div style={{
          background: '#0b2347',
          color: '#e2e8f0',
          fontSize: '11.5px',
          padding: '6px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>📍 {settings.college_address || 'Primary Campus: Link Road, Isbavi | High School Campus: Shelve, Pandharpur'}</span>
            <span>📞 {settings.college_phone || '+91-8459863477'}</span>
            <span>✉️ {settings.college_email || 'vijaymadane3@gmail.com'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
            <span>Facebook</span> • <span>Instagram</span> • <span>YouTube</span>
          </div>
        </div>

        {/* 2. Royal Blue Institutional Branding Banner Preview */}
        <div style={{ background: '#134A98', padding: '18px 24px' }}>
          <div style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(36px, 4.5vw, 72px)',
            textAlign: 'center'
          }}>
            {/* Left: Emblem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ maxHeight: 80, maxWidth: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={settings.college_logo_url || defaultCollegeLogo}
                  alt="School Emblem Logo"
                  style={{ maxHeight: 72, maxWidth: 84, objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Center: Institutional Text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0, flex: '0 1 auto' }}>
              <div style={{
                color: '#ffffff',
                fontFamily: "Arial, 'Helvetica Neue', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.8px',
                marginBottom: 3
              }}>
                {String(settings.foundation_name || "Shri Pandurang Pratishthan's")}
              </div>
              {(() => {
                const parts = (settings.college_name || 'Karmayogi Vidyaniketan').trim().split(/\s+/)
                if (parts.length >= 2) {
                  return (
                    <div className="brand-lockup-wrap" style={{ margin: '1px 0 3px' }}>
                      <span className="brand-title-top">{parts[0].toUpperCase()}</span>
                      <span className="brand-title-divider" aria-hidden="true" />
                      <span className="brand-title-bottom">{parts.slice(1).join(' ').toUpperCase()}</span>
                    </div>
                  )
                }
                return (
                  <h2 className="brand-title-top" style={{ margin: '1px 0 3px' }}>
                    {(settings.college_name || 'Karmayogi Vidyaniketan').toUpperCase()}
                  </h2>
                )
              })()}
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#ffffff',
                fontFamily: "'Gotham-Book', 'Gotham', sans-serif",
                letterSpacing: '0.4px',
                marginTop: '3px',
                opacity: 0.98
              }}>
                {settings.school_subname || 'Pre-Primary, Primary & Secondary School'}
              </div>
            </div>

            {/* Right: Founder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <span style={{
                display: 'block',
                fontFamily: "Arial, 'Helvetica Neue', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.3px',
                marginBottom: 3,
                textAlign: 'center'
              }}>
                {settings.founder_top_label || 'Karmayogi'}
              </span>
              <div style={{
                width: 60,
                height: 72,
                borderRadius: 7,
                background: '#ffffff',
                padding: 2.5,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={settings.founder_photo_url || defaultFounderImg}
                  alt="Founder"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', borderRadius: 5 }}
                />
              </div>
              <div style={{
                marginTop: 5,
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: "'Mukta', 'Noto Sans Devanagari', Arial, 'Helvetica Neue', sans-serif",
                textAlign: 'center',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                letterSpacing: '0.2px'
              }}>
                {formatFounderCaption(settings.founder_name)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Logos & Founder Portrait Section */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>Header Logos &amp; Founder Identity</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>Upload official crest and founder portrait images</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* School Crest Logo */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>1. School Emblem Crest (Left)</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Appears on the blue institutional header to the left of the school name.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 85, height: 85, border: '1px solid #cbd5e1', borderRadius: 6, background: '#134A98', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={settings.college_logo_url || defaultCollegeLogo}
                    alt="School Logo Preview"
                    style={{ maxHeight: 72, maxWidth: 72, objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choose Logo Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleLogoUpload(e, 'college')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadingLogo.college && <div style={{ fontSize: 11, color: '#134A98', marginTop: 4 }}>Uploading logo...</div>}
                </div>
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 12 }}>Or Direct Logo Image URL</label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ fontSize: 12 }}
                  placeholder="https://... or upload above"
                  value={settings.college_logo_url || ''}
                  onChange={e => setSettings({ ...settings, college_logo_url: e.target.value })}
                />
              </div>
            </div>

            {/* Founder / Patron Portrait & Identity */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>2. Founder Portrait &amp; Identity (Right)</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Portrait card and captions placed to the right of header identity banner.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 72, height: 86, borderRadius: 8, background: '#134A98', padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <img
                    src={settings.founder_photo_url || defaultFounderImg}
                    alt="Founder Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', borderRadius: 6, background: '#fff' }}
                  />
                </div>
                <div>
                  <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choose Portrait Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleLogoUpload(e, 'founder')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadingLogo.founder && <div style={{ fontSize: 11, color: '#134A98', marginTop: 4 }}>Uploading portrait...</div>}
                </div>
              </div>
              <div className="admin-form-group" style={{ margin: '0 0 10px' }}>
                <label style={{ fontSize: 12 }}>Founder Portrait Photo URL</label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ fontSize: 12 }}
                  placeholder="https://... or upload above"
                  value={settings.founder_photo_url || ''}
                  onChange={e => setSettings({ ...settings, founder_photo_url: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12 }}>Founder Top Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontSize: 12 }}
                    placeholder="Karmayogi"
                    value={settings.founder_top_label || ''}
                    onChange={e => setSettings({ ...settings, founder_top_label: e.target.value })}
                  />
                </div>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12 }}>Founder Caption Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontSize: 12 }}
                    placeholder="स्व. सुधाकरपंत परिचारक"
                    value={settings.founder_name || ''}
                    onChange={e => setSettings({ ...settings, founder_name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Identity & Contact Details Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>School Identity &amp; Contact Information</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>All fields are editable and synchronize in real-time</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="admin-form-group">
              <label>Foundation Name (Trust)</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Shri Pandurang Pratishthan, Pandharpur's"
                value={settings.foundation_name || ''}
                onChange={e => setSettings({ ...settings, foundation_name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>School Name (Main Heading - Single Line)</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Karmayogi Vidyaniketan"
                value={settings.college_name || ''}
                onChange={e => setSettings({ ...settings, college_name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>School Subtitle / Branch</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Karmayogi Public School"
                value={settings.school_subname || ''}
                onChange={e => setSettings({ ...settings, school_subname: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Official Phone Number</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="+91-8459863477"
                value={settings.college_phone || ''}
                onChange={e => setSettings({ ...settings, college_phone: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Official Email</label>
              <input
                type="email"
                required
                className="admin-input"
                placeholder="vijaymadane3@gmail.com"
                value={settings.college_email || ''}
                onChange={e => setSettings({ ...settings, college_email: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Website URL</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="www.karmayogividyaniketan.edu.in"
                value={settings.college_website || ''}
                onChange={e => setSettings({ ...settings, college_website: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>School Campus Physical Address (Displayed in Green Top Bar)</label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="Primary Campus: Behind MSEDCL Division Office, Link Road, Isbavi | High School Campus: Shelve, Pandharpur - 413304"
              value={settings.college_address || ''}
              onChange={e => setSettings({ ...settings, college_address: e.target.value })}
            />
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
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
