import React, { useState, useEffect } from 'react'
import { settingsService, uploadService } from '../../services/endpoints.js'
import defaultCollegeLogo from '../../assets/college_logo.png'
import defaultFounderImg from '../../assets/founder.png'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    college_name: 'KARMAYOGI COLLEGE OF PHYSIOTHERAPY',
    foundation_name: "Shri Pandurang Pratishthan's",
    college_logo_url: '',
    founder_photo_url: '',
    founder_name: 'स्व. सुधाकरपंत परिचारक',
    college_address: 'Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS), India - 413304',
    college_phone: '+91 2186 216 000',
    college_email: 'kcop@karmayogi.org.in',
    college_website: 'www.karmayogiphysio.org.in',
    affiliation_line_1: 'Affiliated to Maharashtra University of Health Sciences, Nashik, Approved by Govt. of Maharashtra',
    affiliation_line_2: 'Approved by Directorate of Medical Education and Research (DMER), Mumbai',
    affiliation_line_3: 'Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS) - 413304.',
    affiliation_line_4: '',
    affiliation_line_5: ''
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
      setMsg({ text: 'Institutional settings & logos updated successfully! Changes are live in header.', type: 'success' })
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
          <span className="admin-page-badge">System &amp; College Profile</span>
          <h1>Institutional &amp; Website Settings</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Update institutional identity, header logos, contact details, and accreditation statements.
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

      {/* Header Logos Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Header Logos</h3>
          <span style={{ fontSize: 12, color: '#5c6672' }}>Displayed in the header brand section of every page</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* College Logo */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 8px', color: '#0f172a' }}>1. College Logo (Emblem Crest)</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Appears as the primary crest emblem in the header brand section.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 80, height: 80, border: '1px solid #cbd5e1', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={settings.college_logo_url || defaultCollegeLogo}
                    alt="College Logo Preview"
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
              <h4 style={{ margin: '0 0 8px', color: '#0f172a' }}>2. Founder / Patron Photo &amp; Name</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                Circular portrait and name placed to the right of header identity text.
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
                <label style={{ fontSize: 12 }}>Founder / Patron Photo URL</label>
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
          <h3>College Identity &amp; Contact Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Foundation Name</label>
              <input
                type="text"
                required
                className="admin-input"
                value={settings.foundation_name || ''}
                onChange={e => setSettings({ ...settings, foundation_name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>College Name</label>
              <input
                type="text"
                required
                className="admin-input"
                value={settings.college_name || ''}
                onChange={e => setSettings({ ...settings, college_name: e.target.value })}
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
                value={settings.college_website || ''}
                onChange={e => setSettings({ ...settings, college_website: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>College Campus Physical Address</label>
            <input
              type="text"
              required
              className="admin-input"
              value={settings.college_address || ''}
              onChange={e => setSettings({ ...settings, college_address: e.target.value })}
            />
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 12, color: '#071d3a', borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
            Header Affiliation & Accreditation Statements
          </h4>

          <div className="admin-form-group">
            <label>Affiliation Line 1 (University & Govt Approval)</label>
            <input
              type="text"
              className="admin-input"
              value={settings.affiliation_line_1 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_1: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Affiliation Line 2 (State Council)</label>
            <input
              type="text"
              className="admin-input"
              value={settings.affiliation_line_2 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_2: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Affiliation Line 3 (National Association)</label>
            <input
              type="text"
              className="admin-input"
              value={settings.affiliation_line_3 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_3: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Affiliation Line 4 (NAAC Grade & UGC Recognition)</label>
            <input
              type="text"
              className="admin-input"
              value={settings.affiliation_line_4 || ''}
              onChange={e => setSettings({ ...settings, affiliation_line_4: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Affiliation Line 5 (Location & Pincode)</label>
            <input
              type="text"
              className="admin-input"
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
