import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { pagesService, uploadService, setCachedAdmissionsData } from '../../services/endpoints.js'
import { DEFAULT_ADMISSIONS_DATA } from '../../data/collegeData.js'

export default function AdminAdmissions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [data, setData] = useState(DEFAULT_ADMISSIONS_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Modal / Editor States
  const [modalType, setModalType] = useState(null) // 'step', 'eligibility', 'docCategory', 'feeRow', 'faq'
  const [editingIndex, setEditingIndex] = useState(null)
  const [formValues, setFormValues] = useState({})

  // Keep active tab in sync with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'process', 'eligibility', 'documents', 'fees', 'faqs', 'helpdesk'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey })
  }

  // Load existing admissions page data from backend
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('admissions')
        if (page?.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...DEFAULT_ADMISSIONS_DATA,
              ...prev,
              ...parsed,
              process_steps: Array.isArray(parsed.process_steps) && parsed.process_steps.length > 0 ? parsed.process_steps : (prev.process_steps || DEFAULT_ADMISSIONS_DATA.process_steps),
              eligibility_programs: Array.isArray(parsed.eligibility_programs) && parsed.eligibility_programs.length > 0 ? parsed.eligibility_programs : (prev.eligibility_programs || DEFAULT_ADMISSIONS_DATA.eligibility_programs),
              documents_categories: Array.isArray(parsed.documents_categories) && parsed.documents_categories.length > 0 ? parsed.documents_categories : (prev.documents_categories || DEFAULT_ADMISSIONS_DATA.documents_categories),
              fees_table: Array.isArray(parsed.fees_table) && parsed.fees_table.length > 0 ? parsed.fees_table : (prev.fees_table || DEFAULT_ADMISSIONS_DATA.fees_table),
              faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : (prev.faqs || DEFAULT_ADMISSIONS_DATA.faqs),
              payment_modes: Array.isArray(parsed.payment_modes) && parsed.payment_modes.length > 0 ? parsed.payment_modes : (prev.payment_modes || DEFAULT_ADMISSIONS_DATA.payment_modes),
              installment_facilities: parsed.installment_facilities || prev.installment_facilities || DEFAULT_ADMISSIONS_DATA.installment_facilities,
              admission_pillars: Array.isArray(parsed.admission_pillars) && parsed.admission_pillars.length > 0 ? parsed.admission_pillars : (prev.admission_pillars || DEFAULT_ADMISSIONS_DATA.admission_pillars)
            }))
          } catch {
            setData(DEFAULT_ADMISSIONS_DATA)
          }
        } else {
          setData(DEFAULT_ADMISSIONS_DATA)
        }
      } catch {
        setData(DEFAULT_ADMISSIONS_DATA)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field, val) => {
    setData(prev => ({ ...prev, [field]: val }))
  }

  // Pillar management helpers
  const handlePillarChange = (index, field, value) => {
    setData(prev => {
      const current = Array.isArray(prev.admission_pillars) && prev.admission_pillars.length > 0
        ? [...prev.admission_pillars]
        : [...(DEFAULT_ADMISSIONS_DATA.admission_pillars || [])]
      current[index] = { ...current[index], [field]: value }
      return { ...prev, admission_pillars: current }
    })
  }

  const handleAddPillar = () => {
    setData(prev => {
      const current = Array.isArray(prev.admission_pillars) && prev.admission_pillars.length > 0
        ? [...prev.admission_pillars]
        : [...(DEFAULT_ADMISSIONS_DATA.admission_pillars || [])]
      return {
        ...prev,
        admission_pillars: [...current, { title: "New Highlight", desc: "Brief description of this admission pillar..." }]
      }
    })
  }

  const handleRemovePillar = (index) => {
    setData(prev => {
      const current = Array.isArray(prev.admission_pillars) && prev.admission_pillars.length > 0
        ? [...prev.admission_pillars]
        : [...(DEFAULT_ADMISSIONS_DATA.admission_pillars || [])]
      return {
        ...prev,
        admission_pillars: current.filter((_, i) => i !== index)
      }
    })
  }

  // Save changes to backend
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      const payload = {
        slug: 'admissions',
        title: data.intro_title || 'Admissions',
        content_html: JSON.stringify(data),
        meta_title: `${data.intro_title || 'Admissions 2026–27'} | Karmayogi Vidyaniketan`,
        meta_description: data.intro_lead || 'Admissions Guide, Fees, Documents & Process'
      }
      await pagesService.save(payload)
      setCachedAdmissionsData(data)
      window.dispatchEvent(new CustomEvent('page_admissions_updated', { detail: payload }))
      setMsg({ text: 'Admissions content and fee structure updated successfully! Public website has been refreshed.', type: 'success' })
      setTimeout(() => setMsg({ text: '', type: '' }), 5000)
    } catch (err) {
      setMsg({ text: 'Save failed: ' + (err.message || 'Unknown error'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // Modal helpers
  const openModal = (type, index = null, initial = {}) => {
    setModalType(type)
    setEditingIndex(index)
    setFormValues(initial)
  }

  const closeModal = () => {
    setModalType(null)
    setEditingIndex(null)
    setFormValues({})
  }

  const handleSaveModal = (e) => {
    e.preventDefault()

    if (modalType === 'step') {
      const updated = [...(data.process_steps || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        const nextNum = `Step ${updated.length + 1}`
        updated.push({ num: nextNum, ...formValues })
      }
      setData(prev => ({ ...prev, process_steps: updated }))
    }

    if (modalType === 'eligibility') {
      const updated = [...(data.eligibility_programs || [])]
      const pointsArray = typeof formValues.points === 'string'
        ? formValues.points.split('\n').map(s => s.trim()).filter(Boolean)
        : (formValues.points || [])

      const item = { ...formValues, points: pointsArray }
      if (editingIndex !== null) {
        updated[editingIndex] = item
      } else {
        updated.push(item)
      }
      setData(prev => ({ ...prev, eligibility_programs: updated }))
    }

    if (modalType === 'docCategory') {
      const updated = [...(data.documents_categories || [])]
      const itemsArray = typeof formValues.items === 'string'
        ? formValues.items.split('\n').map(s => s.trim()).filter(Boolean)
        : (formValues.items || [])

      const item = { ...formValues, items: itemsArray }
      if (editingIndex !== null) {
        updated[editingIndex] = item
      } else {
        updated.push(item)
      }
      setData(prev => ({ ...prev, documents_categories: updated }))
    }

    if (modalType === 'feeRow') {
      const updated = [...(data.fees_table || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ ...formValues })
      }
      setData(prev => ({ ...prev, fees_table: updated }))
    }

    if (modalType === 'faq') {
      const updated = [...(data.faqs || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ ...formValues })
      }
      setData(prev => ({ ...prev, faqs: updated }))
    }

    closeModal()
  }

  const deleteItem = (key, idx, name = 'item') => {
    if (window.confirm(`Are you sure you want to delete this ${name}?`)) {
      setData(prev => ({
        ...prev,
        [key]: (prev[key] || []).filter((_, i) => i !== idx)
      }))
    }
  }

  const moveItem = (key, idx, direction) => {
    setData(prev => {
      const list = [...(prev[key] || [])]
      const targetIdx = idx + direction
      if (targetIdx < 0 || targetIdx >= list.length) return prev
      const temp = list[idx]
      list[idx] = list[targetIdx]
      list[targetIdx] = temp
      return { ...prev, [key]: list }
    })
  }

  // File Upload Helper for Prospectus / Admission Form PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'admissions')
      setData(prev => ({ ...prev, app_form_download_url: url }))
      setMsg({ text: 'Prospectus / Application Form uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Upload failed: ' + (err.message || 'Error'), type: 'error' })
    } finally {
      setUploadingPdf(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading Admissions Page Settings...</div>
  }

  return (
    <div className="admin-page-container">
      {/* Top Header Bar */}
      <div className="admin-page-header">
        <div>
          <h1>
            Admissions Content Management
            <span className="admin-page-badge">Admissions Desk</span>
          </h1>
          <p>
            Overview, 5-step admission procedure, eligibility criteria, required documents, fee structure, admission FAQs, and helpdesk.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link
            to="/admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Preview Public Page
          </Link>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type === 'error' ? 'danger' : msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs - Exactly matching user-side Admissions page structure */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {[
          { id: 'overview', label: '1. Overview & Welcome' },
          { id: 'process', label: `2. 5-Step Process (${data.process_steps?.length || 0})` },
          { id: 'eligibility', label: `3. Eligibility Criteria (${data.eligibility_programs?.length || 0})` },
          { id: 'documents', label: `4. Required Documents (${data.documents_categories?.length || 0})` },
          { id: 'fees', label: `5. Fee Structure (${data.fees_table?.length || 0})` },
          { id: 'faqs', label: `6. Admission FAQs (${data.faqs?.length || 0})` },
          { id: 'helpdesk', label: '7. Helpdesk & Contact' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW & WELCOME */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
            Section 1: Admission Overview &amp; Welcome
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: -10, marginBottom: 20 }}>
            Configures the topmost hero card on the user-side Admissions page.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Academic Year Badge
            </label>
            <input
              type="text"
              value={data.academic_year || 'ACADEMIC YEAR 2026–27'}
              onChange={e => handleChange('academic_year', e.target.value)}
              style={{ width: '100%', maxWidth: 400, padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="e.g. ACADEMIC YEAR 2026–27"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Main Heading
            </label>
            <input
              type="text"
              value={data.intro_title || 'Welcoming Every Learner into the Karmayogi Family'}
              onChange={e => handleChange('intro_title', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="e.g. Welcoming Every Learner into the Karmayogi Family"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Introductory Lead Paragraph
            </label>
            <textarea
              rows={4}
              value={data.intro_lead || ''}
              onChange={e => handleChange('intro_lead', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, resize: 'vertical' }}
              placeholder="Give your child an environment where learning, character and confidence grow together..."
            />
          </div>

          {/* Prospectus / Application Form PDF Upload */}
          <div style={{ background: '#f8fafc', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 15, color: '#0b2545' }}>
              School Prospectus / Application Form Document
            </h4>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>
              Upload an official PDF for prospective parents to download from the admissions portal.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={data.app_form_download_url || ''}
                onChange={e => handleChange('app_form_download_url', e.target.value)}
                placeholder="https://... or upload PDF using the button on the right"
                style={{ flex: 1, minWidth: 260, padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
              <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                {uploadingPdf ? 'Uploading PDF...' : 'Upload PDF Document'}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingPdf}
                />
              </label>
              {data.app_form_download_url && (
                <a
                  href={data.app_form_download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  View PDF &rarr;
                </a>
              )}
            </div>
          </div>

          {/* 4 Feature Highlights Banner on User-Side (Editable) */}
          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, color: '#0b2545', fontWeight: 700 }}>
                  Admission Pillars (User-Side Highlights)
                </h4>
                <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                  Directly edit the 4 distinctive highlight cards displayed on the user-facing Admissions page:
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPillar}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: 13, padding: '6px 14px' }}
              >
                + Add Card
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {(Array.isArray(data.admission_pillars) && data.admission_pillars.length > 0
                ? data.admission_pillars
                : (DEFAULT_ADMISSIONS_DATA.admission_pillars || [])
              ).map((pillar, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: 14, borderRadius: 8, border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Card {idx + 1}
                    </span>
                    {(data.admission_pillars || DEFAULT_ADMISSIONS_DATA.admission_pillars || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}
                        title="Remove Card"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={pillar.title || ''}
                      onChange={e => handlePillarChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Strict Zero-Donation"
                      style={{ width: '100%', padding: '8px 10px', fontSize: 13, border: '1px solid #cbd5e1', borderRadius: 6, fontWeight: 600, color: '#002855' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={pillar.desc || ''}
                      onChange={e => handlePillarChange(idx, 'desc', e.target.value)}
                      placeholder="Card description..."
                      style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569', resize: 'vertical', lineHeight: 1.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: 5-STEP PROCESS */}
      {/* ===================================================================== */}
      {activeTab === 'process' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Section 2: Step-by-Step Admission Procedure
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Configure the sequential steps shown in the "5-Step Admission Journey" on the website.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('step', null, { title: '', desc: '' })}
            >
              + Add Step
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Process Section Intro Paragraph
            </label>
            <textarea
              rows={2}
              value={data.process_intro || ''}
              onChange={e => handleChange('process_intro', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="We follow a transparent, child-friendly 5-step admission process..."
            />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {(data.process_steps || []).map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#002855',
                    color: '#fff',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#002855' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                    {step.desc}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                    disabled={idx === 0}
                    onClick={() => moveItem('process_steps', idx, -1)}
                    title="Move up"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: 12 }}
                    disabled={idx === (data.process_steps.length - 1)}
                    onClick={() => moveItem('process_steps', idx, 1)}
                    title="Move down"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '5px 12px', fontSize: 13 }}
                    onClick={() => openModal('step', idx, step)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '5px 12px', fontSize: 13 }}
                    onClick={() => deleteItem('process_steps', idx, 'Step')}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {(data.process_steps || []).length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                No admission steps added yet. Click "+ Add Step" above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ELIGIBILITY CRITERIA */}
      {/* ===================================================================== */}
      {activeTab === 'eligibility' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Section 3: Eligibility Criteria Across School Levels
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Manage age rules, academic readiness, and entry norms for Pre-Primary, Primary, and Secondary stages.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('eligibility', null, { degree: '', duration: '', points: [] })}
            >
              + Add Level
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Eligibility Section Intro Paragraph
            </label>
            <textarea
              rows={2}
              value={data.eligibility_intro || ''}
              onChange={e => handleChange('eligibility_intro', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="Age and academic criteria for admission across school levels as per educational guidelines:"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {(data.eligibility_programs || []).map((prog, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderTop: '4px solid #002855',
                  borderRadius: 8,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {prog.duration}
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 16, color: '#0b2545' }}>
                      {prog.degree}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: 12 }}
                      onClick={() => openModal('eligibility', idx, { ...prog, points: (prog.points || []).join('\n') })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '3px 8px', fontSize: 12 }}
                      onClick={() => deleteItem('eligibility_programs', idx, 'Level')}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.6, flex: 1 }}>
                  {(prog.points || []).map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: REQUIRED DOCUMENTS */}
      {/* ===================================================================== */}
      {activeTab === 'documents' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Section 4: Verification Checklist (Documents Required)
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Manage document verification categories (Student Birth &amp; Identity, Parent Proofs, Medical &amp; Transport).
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('docCategory', null, { title: '', items: [] })}
            >
              + Add Category
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Documents Section Intro Paragraph
            </label>
            <textarea
              rows={2}
              value={data.documents_intro || ''}
              onChange={e => handleChange('documents_intro', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="Please bring original certificates for verification along with self-attested photocopies:"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {(data.documents_categories || []).map((cat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 15, color: '#0b2545', fontWeight: 700 }}>
                    {cat.title}
                  </h4>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: 12 }}
                      onClick={() => openModal('docCategory', idx, { ...cat, items: (cat.items || []).join('\n') })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '3px 8px', fontSize: 12 }}
                      onClick={() => deleteItem('documents_categories', idx, 'Category')}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.65, flex: 1 }}>
                  {(cat.items || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: FEE STRUCTURE */}
      {/* ===================================================================== */}
      {activeTab === 'fees' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Section 5: Fee Structure &amp; Installment Guidelines
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Manage fee breakdown across classes, acceptable payment modes, and installment policies.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('feeRow', null, { category: '', admission_fee: '₹ 2,000 (One-Time)', tuition_fee: '₹ 18,000 / Year', term_fee: '₹ 4,000 (Sports & Labs)', total_fee: '₹ 24,000 / Year', payable: '2 Terms (June & Nov)' })}
            >
              + Add Fee Row
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Fee Section Intro
            </label>
            <textarea
              rows={2}
              value={data.fees_intro || ''}
              onChange={e => handleChange('fees_intro', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="Karmayogi Vidyaniketan maintains an affordable, transparent school fee structure approved by school management..."
            />
          </div>

          {/* Fee Table */}
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#002855', color: '#ffffff' }}>
                  <th style={{ padding: '12px 14px' }}>Class / Standard</th>
                  <th style={{ padding: '12px 14px' }}>Admission Fee (One-Time)</th>
                  <th style={{ padding: '12px 14px' }}>Tuition Fee (Annual)</th>
                  <th style={{ padding: '12px 14px' }}>Term &amp; Activity Fee</th>
                  <th style={{ padding: '12px 14px' }}>Total Annual Fee</th>
                  <th style={{ padding: '12px 14px' }}>Payment Schedule</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.fees_table || []).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#002855' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {row.admission_fee || '₹ 2,000 (New)'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {row.tuition_fee}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {row.term_fee || row.dev_fee || 'Included'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#002855', fontWeight: 700 }}>
                      {row.total_fee || 'As per Prospectus'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#166534', fontWeight: 600 }}>
                      {row.payable}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 12, marginRight: 6 }}
                        onClick={() => openModal('feeRow', idx, row)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => deleteItem('fees_table', idx, 'Fee Row')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(data.fees_table || []).length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No fee rows configured. Click "+ Add Fee Row" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
              Fee Policies &amp; Installments Footnote
            </label>
            <textarea
              rows={3}
              value={data.fees_notes || ''}
              onChange={e => handleChange('fees_notes', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              placeholder="Fees are payable via Net Banking, UPI, Demand Draft, or at the school cash counter..."
            />
          </div>

          {/* Payment Modes & Installment Facilities Editor */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 16px', color: '#0b2545', fontSize: 16 }}>
              Payment Facilities &amp; Installments Rules (User-Side Cards)
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Card 1: Accepted Payment Modes */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: 13.5, color: '#002855', marginBottom: 6 }}>
                  💳 Accepted Payment Modes (One per line)
                </label>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                  List the accepted payment methods shown on the website:
                </p>
                <textarea
                  rows={6}
                  value={
                    Array.isArray(data.payment_modes)
                      ? data.payment_modes.join('\n')
                      : (DEFAULT_ADMISSIONS_DATA.payment_modes || []).join('\n')
                  }
                  onChange={e => {
                    const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                    handleChange('payment_modes', lines)
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}
                  placeholder="Net Banking / NEFT / RTGS to official school bank account&#10;UPI (Google Pay, PhonePe, Paytm, BHIM)&#10;Demand Draft (DD)..."
                />
              </div>

              {/* Card 2: Installment Facilities */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: 13.5, color: '#002855', marginBottom: 6 }}>
                  📅 Installment Facilities &amp; Terms
                </label>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                  Introduction text for term installments:
                </p>
                <input
                  type="text"
                  value={data.installment_facilities?.intro ?? (DEFAULT_ADMISSIONS_DATA.installment_facilities?.intro || '')}
                  onChange={e => {
                    const intro = e.target.value
                    setData(prev => ({
                      ...prev,
                      installment_facilities: {
                        ...(prev.installment_facilities || DEFAULT_ADMISSIONS_DATA.installment_facilities),
                        intro
                      }
                    }))
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, marginBottom: 12 }}
                  placeholder="To avoid financial burden on parents, fees can be deposited in convenient term installments:"
                />

                <label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, color: '#334155', marginBottom: 6 }}>
                  Installment Terms (Format: <code>Term Name | Description</code>):
                </label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(data.installment_facilities?.terms)
                      ? data.installment_facilities.terms.map(t => `${t.name} | ${t.desc}`).join('\n')
                      : (DEFAULT_ADMISSIONS_DATA.installment_facilities?.terms || []).map(t => `${t.name} | ${t.desc}`).join('\n')
                  }
                  onChange={e => {
                    const raw = e.target.value
                    const parsedTerms = raw.split('\n').filter(Boolean).map(line => {
                      const parts = line.split('|')
                      return {
                        name: (parts[0] || '').trim(),
                        desc: (parts.slice(1).join('|') || '').trim()
                      }
                    })
                    setData(prev => ({
                      ...prev,
                      installment_facilities: {
                        ...(prev.installment_facilities || DEFAULT_ADMISSIONS_DATA.installment_facilities),
                        terms: parsedTerms
                      }
                    }))
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}
                  placeholder="Term 1 | At the time of enrollment / academic session commencement&#10;Term 2 | Mid-term installment following the Diwali vacation"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: ADMISSION FAQS */}
      {/* ===================================================================== */}
      {activeTab === 'faqs' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
                Section 6: Admission FAQs (Frequently Asked Questions)
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Manage common parent questions, donations policy, transport queries, and age guidelines.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('faq', null, { q: '', a: '' })}
            >
              + Add FAQ
            </button>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {(data.faqs || []).map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 18
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#002855' }}>
                      Q: {faq.q}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#475569', marginTop: 6, lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => openModal('faq', idx, faq)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => deleteItem('faqs', idx, 'FAQ')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(data.faqs || []).length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                No FAQs added yet. Click "+ Add FAQ" above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: HELPDESK & CONTACT */}
      {/* ===================================================================== */}
      {activeTab === 'helpdesk' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--navy-header, #0b2545)', fontSize: 18 }}>
            Section 7: Admission Helpdesk &amp; In-Person Inquiry Desk
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: -10, marginBottom: 20 }}>
            Configures the counseling card shown at the bottom of the public Admissions page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Helpdesk Phone Numbers
              </label>
              <input
                type="text"
                value={data.helpdesk_phone || ''}
                onChange={e => handleChange('helpdesk_phone', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="+91-8459863477, +91-9527632033"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Helpdesk Email Address
              </label>
              <input
                type="email"
                value={data.helpdesk_email || ''}
                onChange={e => handleChange('helpdesk_email', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="vijaymadane3@gmail.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Office Working Hours
              </label>
              <input
                type="text"
                value={data.helpdesk_hours || 'Monday to Saturday: 8:00 AM – 2:00 PM (Sunday Closed)'}
                onChange={e => handleChange('helpdesk_hours', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="Monday to Saturday: 8:00 AM – 2:00 PM"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                Campus Locations
              </label>
              <input
                type="text"
                value={data.helpdesk_address || 'Isbavi Campus (Link Road) & Shelve Campus, Pandharpur, Maharashtra.'}
                onChange={e => handleChange('helpdesk_address', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                placeholder="Isbavi Campus & Shelve Campus, Pandharpur"
              />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, color: '#475569' }}>
              💡 <strong>Online Enquiries:</strong> Online admission form submissions are received instantly in the{' '}
              <Link to="/admin/messages?filter=admission" style={{ color: '#002855', fontWeight: 700 }}>
                Messages &amp; Enquiries
              </Link>{' '}
              inbox.
            </span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIFIED MODAL DIALOG */}
      {/* ===================================================================== */}
      {modalType && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: 17, color: '#0b2545' }}>
                {editingIndex !== null ? 'Edit' : 'Add'} {
                  modalType === 'step' ? 'Admission Step' :
                  modalType === 'eligibility' ? 'Eligibility Program' :
                  modalType === 'docCategory' ? 'Document Category' :
                  modalType === 'feeRow' ? 'Fee Row' :
                  modalType === 'faq' ? 'FAQ' : 'Item'
                }
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="admin-modal-body" style={{ padding: '20px 24px', display: 'grid', gap: 14 }}>
                {/* 1. Step Form */}
                {modalType === 'step' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Step Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Submit Enquiry"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Description *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formValues.desc || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="Fill in the simple online enquiry form..."
                      />
                    </div>
                  </>
                )}

                {/* 2. Eligibility Form */}
                {modalType === 'eligibility' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Division / Wing Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.degree || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, degree: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Primary School (Grades 1 to 5)"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Grade Span / Badge *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.duration || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, duration: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Grades 1 to 5"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Criteria Points (One per line) *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formValues.points || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, points: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="Grade 1: Minimum 6 years of age completed&#10;Transfer Certificate from previous school&#10;Progress report card"
                      />
                    </div>
                  </>
                )}

                {/* 3. Document Category Form */}
                {modalType === 'docCategory' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Category Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Student Identification & Birth Records"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Document Checklist (One per line) *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formValues.items || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, items: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="Original Birth Certificate&#10;Student Aadhaar Card copy&#10;School Leaving Certificate (TC)&#10;5 recent passport-size photos"
                      />
                    </div>
                  </>
                )}

                {/* 4. Fee Row Form */}
                {modalType === 'feeRow' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Class / Standard *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.category || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, category: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Primary School (Grades 1 to 5)"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                          Admission Fee (One-Time)
                        </label>
                        <input
                          type="text"
                          value={formValues.admission_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, admission_fee: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                          placeholder="e.g. ₹ 2,000 (One-Time)"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                          Tuition Fee (Annual) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formValues.tuition_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, tuition_fee: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                          placeholder="e.g. ₹ 18,000 / Year"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                          Term &amp; Activity Fee (Sports/Labs)
                        </label>
                        <input
                          type="text"
                          value={formValues.term_fee || formValues.dev_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, term_fee: e.target.value, dev_fee: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                          placeholder="e.g. ₹ 4,000 (STEM & Sports)"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                          Total Annual Fee
                        </label>
                        <input
                          type="text"
                          value={formValues.total_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, total_fee: e.target.value }))}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                          placeholder="e.g. ₹ 24,000 / Year"
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Payment Schedule / Installment Mode
                      </label>
                      <input
                        type="text"
                        value={formValues.payable || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, payable: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. 2 Terms (June & Nov)"
                      />
                    </div>
                  </>
                )}

                {/* 5. FAQ Form */}
                {modalType === 'faq' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Question *
                      </label>
                      <input
                        type="text"
                        required
                        value={formValues.q || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, q: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="e.g. Is there any donation or capitation fee for admission?"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#334155' }}>
                        Answer *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formValues.a || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, a: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                        placeholder="Clear answer for prospective parents..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="admin-modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingIndex !== null ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
