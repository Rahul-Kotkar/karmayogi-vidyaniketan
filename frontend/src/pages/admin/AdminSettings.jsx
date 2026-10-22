import React, { useState, useEffect } from 'react'
import { settingsService, uploadService } from '../../services/endpoints.js'
import defaultCollegeLogo from '../../assets/college_logo.png'
import defaultFounderImg from '../../assets/founder.png'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    college_name: 'Karmayogi Vidyaniketan',
    school_subname: '',
    foundation_name: 'Shri Pandurang Pratishthan, Pandharpur',
    college_logo_url: '',
    founder_photo_url: '',
    founder_name: 'स्व. सुधाकरपंत परिचारक',
    college_address: 'Primary Campus: Behind MSEDCL Division Office, Link Road, Isbavi | High School Campus: Shelve, Pandharpur - 413304',
    college_phone: '+91-8459863477',
    college_email: 'vijaymadane3@gmail.com',
    college_website: 'www.karmayogividyaniketan.com',
    affiliation_line_1: 'Managed by Shri Pandurang Pratishthan, Pandharpur',
    affiliation_line_2: 'English Medium | Co-Educational | Nursery to Grade 10',
    affiliation_line_3: 'CBSE & Maharashtra State Board Curriculum Tracks',
    affiliation_line_4: 'Safe GPS-Monitored School Bus Fleet Covering Pandharpur & Environs',
    affiliation_line_5: 'Office Hours: Mon–Sat 8:00 AM – 2:00 PM (Sunday Closed)'
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
        text: `${key === 'founder' ? 'Founder portrait' : (key === 'trust' ? 'Left Trust' : 'Right College') + ' logo'} uploaded successfully! Remember to save settings below.`,
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
      setMsg({ text: 'Institutional settings & logos updated successfully! Changes are live across header and all pages.', type: 'success' })
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
            Update institutional identity, header branding, contact details, affiliation lines, and founder details.
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
      <div className="admin-card" style={{ overflow: 'hidden', border: '1.5px solid #cbd5e1', marginBottom: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
        <div className="admin-card-header" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }}></span>
              Live Website Header Banner Preview
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Rendered across public pages and identical to website branding</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: 999, border: '1px solid #bae6fd' }}>
            Live Sync
          </span>
        </div>
        <div style={{ background: '#ffffff', padding: '24px 20px' }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 3.5vw, 48px)',
            flexWrap: 'wrap',
            textAlign: 'center'
          }}>
            {/* Left: Emblem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={settings.college_logo_url || defaultCollegeLogo}
                  alt="School Emblem Logo"
                  style={{ maxHeight: 85, maxWidth: 85, objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#002855', letterSpacing: '1.5px', marginTop: 4 }}>
                KARMAYOGI
              </span>
            </div>

            {/* Center: Institutional Text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 280, maxWidth: 680 }}>
              <div style={{ color: '#c2410c', fontSize: 14, fontWeight: 600, letterSpacing: '0.4px', marginBottom: 2 }}>
                {settings.foundation_name || 'Shri Pandurang Pratishthan, Pandharpur'}
              </div>
              <h2 style={{
                margin: '1px 0 2px',
                fontFamily: 'serif',
                color: '#002855',
                fontSize: 'clamp(22px, 2.6vw, 32px)',
                fontWeight: 900,
                letterSpacing: '0.3px',
                lineHeight: 1.15
              }}>
                {settings.college_name || 'Karmayogi Vidyaniketan'}
              </h2>
              {settings.school_subname && (
                <div style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#c9a227',
                  letterSpacing: '0.6px',
                  marginTop: '1px',
                  marginBottom: '4px'
                }}>
                  {settings.school_subname}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                {[
                  settings.affiliation_line_1,
                  settings.affiliation_line_2,
                  settings.affiliation_line_3,
                  settings.affiliation_line_4,
                  settings.affiliation_line_5
                ].filter(Boolean).map((line, idx) => (
                  <p key={idx} style={{
                    margin: 0,
                    fontSize: '12.5px',
                    lineHeight: 1.45,
                    color: '#4b5563',
                    textAlign: 'center'
                  }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Founder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                border: '3.5px solid #dbeafe',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,40,85,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff'
              }}>
                <img
                  src={settings.founder_photo_url || defaultFounderImg}
                  alt="Founder"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                marginTop: 6,
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#002855',
                textAlign: 'center',
                lineHeight: 1.3
              }}>
                {settings.founder_name || 'स्व. सुधाकरपंत परिचारक'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Logos Section */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3>Header Logos &amp; Founder Portrait</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>Displayed in the header brand section of every page</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* School Crest Logo */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 8px', color: '#0f172a' }}>1. School Emblem Crest (Left)</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Appears as the primary crest emblem in the institutional header.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 80, height: 80, border: '1px solid #cbd5e1', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleLogoUpload(e, 'college')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadingLogo.college && <div style={{ fontSize: 11, color: '#0284c7', marginTop: 4 }}>Uploading logo...</div>}
                </div>
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 12 }}>Or Image URL</label>
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

            {/* Founder / Patron Portrait & Caption */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 8px', color: '#0f172a' }}>2. Founder Portrait &amp; Caption (Right)</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Circular portrait and founder name placed to the right of header identity text.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 78, height: 78, borderRadius: '50%', border: '3px solid #dbeafe', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                  <img
                    src={settings.founder_photo_url || defaultFounderImg}
                    alt="Founder Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleLogoUpload(e, 'founder')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadingLogo.founder && <div style={{ fontSize: 11, color: '#0284c7', marginTop: 4 }}>Uploading portrait...</div>}
                </div>
              </div>
              <div className="admin-form-group" style={{ margin: '0 0 8px' }}>
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

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>School Identity &amp; Contact Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="admin-form-group">
              <label>Foundation Name (Trust)</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Shri Pandurang Pratishthan, Pandharpur"
                value={settings.foundation_name || ''}
                onChange={e => setSettings({ ...settings, foundation_name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>School Name (Main Heading)</label>
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
              <label>School Subname / Branch (Gold Subheading)</label>
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
                placeholder="www.karmayogividyaniketan.com"
                value={settings.college_website || ''}
                onChange={e => setSettings({ ...settings, college_website: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>School Campus Physical Address</label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="Primary Campus: Behind MSEDCL Division Office, Link Road, Isbavi | High School Campus: Shelve, Pandharpur - 413304"
              value={settings.college_address || ''}
              onChange={e => setSettings({ ...settings, college_address: e.target.value })}
            />
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 12, color: '#071d3a', borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
            Header Affiliation &amp; Operations Details (5 Lines)
          </h4>

          <div className="admin-form-group">
            <label>Header Line 1: Management Body</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Managed by Shri Pandurang Pratishthan, Pandharpur"
              value={settings.affiliation_line_1 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_1: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Header Line 2: Medium &amp; Grade Track</label>
            <input
              type="text"
              className="admin-input"
              placeholder="English Medium | Co-Educational | Nursery to Grade 10"
              value={settings.affiliation_line_2 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_2: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Header Line 3: Curriculum Boards</label>
            <input
              type="text"
              className="admin-input"
              placeholder="CBSE & Maharashtra State Board Curriculum Tracks"
              value={settings.affiliation_line_3 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_3: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Header Line 4: Transport &amp; Fleet Operations</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Safe GPS-Monitored School Bus Fleet Covering Pandharpur & Environs"
              value={settings.affiliation_line_4 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_4: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Header Line 5: Office Hours &amp; Working Timings</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Office Hours: Mon–Sat 8:00 AM – 2:00 PM (Sunday Closed)"
              value={settings.affiliation_line_5 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_5: e.target.value })}
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
