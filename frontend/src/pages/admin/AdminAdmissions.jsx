import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { pagesService, uploadService, setCachedAdmissionsData } from '../../services/endpoints.js'
import { DEFAULT_ADMISSIONS_DATA } from '../../data/collegeData.js'
import {
  FilePdfIcon,
  CheckCircleIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  CloseIcon,
  ArrowRightIcon
} from '../../components/Icons.jsx'

export default function AdminAdmissions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'fees'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [data, setData] = useState(DEFAULT_ADMISSIONS_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Modal / Editor States
  const [modalType, setModalType] = useState(null) // 'feeRow', 'step', 'eligibility', 'docCategory', 'date', 'faq'
  const [editingIndex, setEditingIndex] = useState(null)
  const [formValues, setFormValues] = useState({})

  // Sync tab with query param
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['fees', 'process', 'eligibility', 'documents', 'overview', 'dates', 'faqs'].includes(tabParam)) {
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
              ...parsed
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

  // Save changes to backend
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      const payload = {
        slug: 'admissions',
        title: 'Admissions',
        content_html: JSON.stringify(data)
      }
      await pagesService.save(payload)
      setCachedAdmissionsData(data)
      window.dispatchEvent(new CustomEvent('page_admissions_updated', { detail: payload }))
      setMsg({ text: 'Admissions details and fee structure saved successfully!', type: 'success' })
      setTimeout(() => setMsg({ text: '', type: '' }), 4000)
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save admissions data', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Reset to default presets
  const handleResetPresets = () => {
    if (window.confirm('Reset all admission content, fee table, and eligibility criteria to default school presets?')) {
      setData(DEFAULT_ADMISSIONS_DATA)
      setMsg({ text: 'Reset to default school presets. Click "Save All Changes" to persist.', type: 'info' })
    }
  }

  // Modal open / close helpers
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

  // Save Modal Draft
  const handleSaveModal = (e) => {
    e.preventDefault()

    if (modalType === 'feeRow') {
      const updated = [...(data.fees_table || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ ...formValues })
      }
      setData(prev => ({ ...prev, fees_table: updated }))
    }

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

    if (modalType === 'date') {
      const updated = [...(data.dates_list || [])]
      if (editingIndex !== null) {
        updated[editingIndex] = { ...updated[editingIndex], ...formValues }
      } else {
        updated.push({ ...formValues })
      }
      setData(prev => ({ ...prev, dates_list: updated }))
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

  // Deletion helper
  const deleteItem = (key, idx, name = 'item') => {
    if (window.confirm(`Are you sure you want to delete this ${name}?`)) {
      setData(prev => ({
        ...prev,
        [key]: (prev[key] || []).filter((_, i) => i !== idx)
      }))
    }
  }

  // File Upload Helper (e.g. Admission Form PDF or Prospectus)
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'admissions')
      setData(prev => ({ ...prev, app_form_download_url: url }))
      setMsg({ text: 'Application form document uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'File upload failed', type: 'danger' })
    } finally {
      setUploadingPdf(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontSize: '15px' }}>Loading Admissions &amp; Fee Data...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Admissions &amp; Fee Management
            <span className="admin-page-badge" style={{ marginLeft: 10, verticalAlign: 'middle' }}>Nursery to Grade 10</span>
          </h1>
          <p>
            Configure school admission guidelines, fee structure table, age criteria, required documents checklist, and FAQs.
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
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Preview Public Page
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleResetPresets}
          >
            Reset to Presets
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {msg.text && (
        <div className={`admin-alert admin-alert-${msg.type}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="admin-tabs" style={{ marginBottom: 24, overflowX: 'auto', flexWrap: 'nowrap' }}>
        <button
          className={`admin-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => handleTabChange('fees')}
        >
          <span>💳 1. Fee Structure</span>
          <span className="admin-tab-count">{data.fees_table?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'process' ? 'active' : ''}`}
          onClick={() => handleTabChange('process')}
        >
          <span>📋 2. 5-Step Process</span>
          <span className="admin-tab-count">{data.process_steps?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
          onClick={() => handleTabChange('eligibility')}
        >
          <span>🎓 3. Eligibility Criteria</span>
          <span className="admin-tab-count">{data.eligibility_programs?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => handleTabChange('documents')}
        >
          <span>📄 4. Required Documents</span>
          <span className="admin-tab-count">{data.documents_categories?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <span>🏛️ 5. Overview &amp; Welcome</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'dates' ? 'active' : ''}`}
          onClick={() => handleTabChange('dates')}
        >
          <span>📅 6. Key Dates &amp; Office</span>
          <span className="admin-tab-count">{data.dates_list?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => handleTabChange('faqs')}
        >
          <span>❓ 7. FAQs</span>
          <span className="admin-tab-count">{data.faqs?.length || 0}</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: FEE STRUCTURE TABLE */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'fees' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Fee Structure &amp; Installment Guidelines</h3>
              <p>Manage tuition and development fees across school divisions (Pre-Primary, Primary, Secondary, Transport).</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('feeRow', null, { category: '', tuition_fee: 'Affordable', dev_fee: 'Included', total_fee: 'As per Prospectus', scholarship: 'Available for eligible wards', payable: 'Term-wise installments' })}
            >
              + Add Fee Row
            </button>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label>Fee Section Introductory Text</label>
              <textarea
                rows={2}
                value={data.fees_intro || ''}
                onChange={e => setData(prev => ({ ...prev, fees_intro: e.target.value }))}
                placeholder="Introductory fee guidance..."
              />
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 24 }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13 }}>Division / Class</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13 }}>Tuition Component</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13 }}>Activity &amp; Sports</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13 }}>Total / Prospectus</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13 }}>Payment Mode</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 13 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.fees_table || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12, fontWeight: 700, color: '#0f172a' }}>{row.category}</td>
                      <td style={{ padding: 12, color: '#334155' }}>{row.tuition_fee}</td>
                      <td style={{ padding: 12, color: '#334155' }}>{row.dev_fee}</td>
                      <td style={{ padding: 12, color: '#0284c7', fontWeight: 600 }}>{row.total_fee || 'As per Prospectus'}</td>
                      <td style={{ padding: 12, color: '#16a34a', fontWeight: 600 }}>{row.payable}</td>
                      <td style={{ padding: 12, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="admin-btn-link"
                          style={{ marginRight: 10, color: '#0284c7' }}
                          onClick={() => openModal('feeRow', idx, row)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn-link"
                          style={{ color: '#dc2626' }}
                          onClick={() => deleteItem('fees_table', idx, 'fee row')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data.fees_table || []).length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                        No fee entries configured yet. Click "+ Add Fee Row" above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-form-group">
              <label>Fee Policy Notes &amp; Payment Options</label>
              <textarea
                rows={2}
                value={data.fees_notes || ''}
                onChange={e => setData(prev => ({ ...prev, fees_notes: e.target.value }))}
                placeholder="Payment modes, term installments, banking details..."
              />
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: 5-STEP ADMISSION PROCESS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'process' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>5-Step Admission Journey</h3>
              <p>Step-by-step guidance for prospective parents from enquiry to enrollment confirmation.</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('step', null, { num: `Step ${(data.process_steps?.length || 0) + 1}`, title: '', desc: '' })}
            >
              + Add Step
            </button>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label>Process Overview Text</label>
              <textarea
                rows={2}
                value={data.process_intro || ''}
                onChange={e => setData(prev => ({ ...prev, process_intro: e.target.value }))}
                placeholder="We follow a transparent, child-friendly 5-step admission process..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.process_steps || []).map((step, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '3px 10px', borderRadius: 12 }}>
                      {step.num || `Step ${idx + 1}`}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#0284c7', fontSize: 13 }}
                        onClick={() => openModal('step', idx, step)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#dc2626', fontSize: 13 }}
                        onClick={() => deleteItem('process_steps', idx, 'step')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 16, color: '#0f172a', margin: '4px 0 8px' }}>{step.title}</h4>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: ELIGIBILITY CRITERIA */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'eligibility' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Eligibility Criteria Across School Levels</h3>
              <p>Configure age criteria and academic guidelines for Pre-Primary, Primary, and Secondary school.</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('eligibility', null, { degree: '', duration: '', points: '' })}
            >
              + Add School Level
            </button>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label>Eligibility Section Lead</label>
              <textarea
                rows={2}
                value={data.eligibility_intro || ''}
                onChange={e => setData(prev => ({ ...prev, eligibility_intro: e.target.value }))}
                placeholder="Age and academic criteria for admission across school levels..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {(data.eligibility_programs || []).map((prog, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', borderTop: '4px solid #002855' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                        {prog.duration}
                      </span>
                      <h4 style={{ fontSize: 16.5, color: '#0f172a', margin: '4px 0 0' }}>{prog.degree}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#0284c7', fontSize: 13 }}
                        onClick={() => openModal('eligibility', idx, { ...prog, points: (prog.points || []).join('\n') })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#dc2626', fontSize: 13 }}
                        onClick={() => deleteItem('eligibility_programs', idx, 'level')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <ul style={{ margin: '12px 0 0', paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                    {(prog.points || []).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: REQUIRED DOCUMENTS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'documents' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Required Documents Checklist</h3>
              <p>Configure document requirements categorized by student ID, parents/address verification, and medical/transport forms.</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('docCategory', null, { title: '', items: '' })}
            >
              + Add Document Category
            </button>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label>Documents Checklist Lead Text</label>
              <textarea
                rows={2}
                value={data.documents_intro || ''}
                onChange={e => setData(prev => ({ ...prev, documents_intro: e.target.value }))}
                placeholder="Parents are requested to submit the following documents..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {(data.documents_categories || []).map((cat, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 16, color: '#0f172a', margin: 0 }}>{cat.title}</h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#0284c7', fontSize: 13 }}
                        onClick={() => openModal('docCategory', idx, { ...cat, items: (cat.items || []).join('\n') })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#dc2626', fontSize: 13 }}
                        onClick={() => deleteItem('documents_categories', idx, 'category')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                    {(cat.items || []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: OVERVIEW & WELCOME */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Admissions Overview &amp; Welcome Message</h3>
            <p>Introductory headline, mission statement, zero-donation declaration, and downloadable application prospectus.</p>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 18 }}>
              <label>Admissions Headline Title</label>
              <input
                type="text"
                value={data.intro_title || ''}
                onChange={e => setData(prev => ({ ...prev, intro_title: e.target.value }))}
                placeholder="Admissions Open 2026–27"
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: 24 }}>
              <label>Welcome Lead Paragraph</label>
              <textarea
                rows={4}
                value={data.intro_lead || ''}
                onChange={e => setData(prev => ({ ...prev, intro_lead: e.target.value }))}
                placeholder="Give your child an environment where learning, character and confidence grow together..."
              />
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: 15, color: '#0f172a', marginBottom: 8 }}>
                Downloadable Application Form / School Prospectus (PDF)
              </h4>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
                Upload an official PDF admission form or brochure so parents can download and fill it offline:
              </p>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  style={{ fontSize: 13 }}
                />
                {uploadingPdf && <span style={{ fontSize: 13, color: '#0284c7' }}>Uploading PDF...</span>}
              </div>

              {data.app_form_download_url && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <FilePdfIcon size={16} color="#dc2626" />
                  <a
                    href={data.app_form_download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0284c7', fontWeight: 600 }}
                  >
                    View Uploaded Application Form
                  </a>
                  <button
                    type="button"
                    className="admin-btn-link"
                    style={{ color: '#dc2626', marginLeft: 12, fontSize: 12 }}
                    onClick={() => setData(prev => ({ ...prev, app_form_download_url: '' }))}
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: KEY DATES & TIMELINE */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'dates' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Key Admission Dates &amp; Desk Information</h3>
              <p>Configure important timelines for application submissions, interactions, and term start.</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('date', null, { title: '', date: '', desc: '' })}
            >
              + Add Date Milestone
            </button>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label>Timeline Introduction Text</label>
              <textarea
                rows={2}
                value={data.dates_intro || ''}
                onChange={e => setData(prev => ({ ...prev, dates_intro: e.target.value }))}
                placeholder="Important admission schedule for Academic Session 2026–27..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {(data.dates_list || []).map((milestone, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: 6 }}>
                      {milestone.date || 'TBA'}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#0284c7', fontSize: 13 }}
                        onClick={() => openModal('date', idx, milestone)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#dc2626', fontSize: 13 }}
                        onClick={() => deleteItem('dates_list', idx, 'milestone')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 15.5, color: '#0f172a', margin: '4px 0 6px' }}>{milestone.title}</h4>
                  <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 7: ADMISSION FAQS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'faqs' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Frequently Asked Questions (FAQs)</h3>
              <p>Common questions from parents regarding zero-donation, school buses, installment payment, and age norms.</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => openModal('faq', null, { q: '', a: '' })}
            >
              + Add FAQ
            </button>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'grid', gap: 14 }}>
              {(data.faqs || []).map((faq, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 15.5, color: '#0f172a', margin: 0 }}>
                      Q: {faq.q}
                    </h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#0284c7', fontSize: 13 }}
                        onClick={() => openModal('faq', idx, faq)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-link"
                        style={{ color: '#dc2626', fontSize: 13 }}
                        onClick={() => deleteItem('faqs', idx, 'FAQ')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '8px 0 0' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GENERIC EDIT MODAL */}
      {/* ===================================================================== */}
      {modalType && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {editingIndex !== null ? 'Edit' : 'Add'}{' '}
                {modalType === 'feeRow' && 'Fee Structure Entry'}
                {modalType === 'step' && 'Admission Process Step'}
                {modalType === 'eligibility' && 'School Level Eligibility'}
                {modalType === 'docCategory' && 'Required Document Category'}
                {modalType === 'date' && 'Admission Milestone'}
                {modalType === 'faq' && 'Admission FAQ'}
              </h3>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="admin-modal-body">
                {/* 1. Fee Row Form */}
                {modalType === 'feeRow' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Class / Division Name *</label>
                      <input
                        type="text"
                        required
                        value={formValues.category || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. Primary School (Grades 1 to 5)"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="admin-form-group">
                        <label>Tuition Fee</label>
                        <input
                          type="text"
                          value={formValues.tuition_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, tuition_fee: e.target.value }))}
                          placeholder="Affordable"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Activity &amp; Sports</label>
                        <input
                          type="text"
                          value={formValues.dev_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, dev_fee: e.target.value }))}
                          placeholder="Included"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="admin-form-group">
                        <label>Total / Prospectus</label>
                        <input
                          type="text"
                          value={formValues.total_fee || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, total_fee: e.target.value }))}
                          placeholder="As per Prospectus"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Payment Mode / Installments</label>
                        <input
                          type="text"
                          value={formValues.payable || ''}
                          onChange={e => setFormValues(prev => ({ ...prev, payable: e.target.value }))}
                          placeholder="Term-wise installments"
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Concession / Scholarship</label>
                      <input
                        type="text"
                        value={formValues.scholarship || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, scholarship: e.target.value }))}
                        placeholder="Available for eligible wards"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Process Step Form */}
                {modalType === 'step' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Step Number / Badge</label>
                      <input
                        type="text"
                        value={formValues.num || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, num: e.target.value }))}
                        placeholder="e.g. Step 1"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Step Title *</label>
                      <input
                        type="text"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Submit Enquiry"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Step Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={formValues.desc || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                        placeholder="Detailed guidance for parents..."
                      />
                    </div>
                  </div>
                )}

                {/* 3. Eligibility Form */}
                {modalType === 'eligibility' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>School Level / Wing Title *</label>
                      <input
                        type="text"
                        required
                        value={formValues.degree || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="e.g. Primary School (Grades 1 to 5)"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Grade Span / Badge</label>
                      <input
                        type="text"
                        value={formValues.duration || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. Grades 1 to 5"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Eligibility Criteria Points (One per line) *</label>
                      <textarea
                        rows={5}
                        required
                        value={formValues.points || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, points: e.target.value }))}
                        placeholder="Minimum 6 years of age completed as of 31st December&#10;Transfer certificate from recognized school&#10;Progress report card of previous year"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Document Category Form */}
                {modalType === 'docCategory' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Category Title *</label>
                      <input
                        type="text"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Student Identification & Birth Records"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Documents Checklist (One document per line) *</label>
                      <textarea
                        rows={5}
                        required
                        value={formValues.items || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, items: e.target.value }))}
                        placeholder="Original Birth Certificate&#10;Student Aadhaar Card copy&#10;School Leaving Certificate (TC)&#10;5 recent passport size photos"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Date Milestone Form */}
                {modalType === 'date' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Date / Timeframe *</label>
                      <input
                        type="text"
                        required
                        value={formValues.date || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. 1st February 2026 onwards"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Milestone Title *</label>
                      <input
                        type="text"
                        required
                        value={formValues.title || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Prospectus & Online Enquiry Opens"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={formValues.desc || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, desc: e.target.value }))}
                        placeholder="Details or venue..."
                      />
                    </div>
                  </div>
                )}

                {/* 6. FAQ Form */}
                {modalType === 'faq' && (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Question *</label>
                      <input
                        type="text"
                        required
                        value={formValues.q || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, q: e.target.value }))}
                        placeholder="e.g. Is there any donation or capitation fee for admission?"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Answer *</label>
                      <textarea
                        rows={4}
                        required
                        value={formValues.a || ''}
                        onChange={e => setFormValues(prev => ({ ...prev, a: e.target.value }))}
                        placeholder="Clear answer for prospective parents..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
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
