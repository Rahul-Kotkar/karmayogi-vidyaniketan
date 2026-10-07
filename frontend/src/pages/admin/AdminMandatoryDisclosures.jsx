import React, { useState, useEffect } from 'react'
import { pagesService, uploadService, getCachedDisclosuresData, setCachedDisclosuresData } from '../../services/endpoints.js'
import { DEFAULT_MANDATORY_DISCLOSURES } from '../../data/collegeData.js'

function getInitialData() {
  const cached = getCachedDisclosuresData()
  if (cached && typeof cached === 'object') {
    return {
      ...DEFAULT_MANDATORY_DISCLOSURES,
      ...cached,
      muhs: Array.isArray(cached.muhs) && cached.muhs.length > 0 ? cached.muhs : DEFAULT_MANDATORY_DISCLOSURES.muhs,
      policies: Array.isArray(cached.policies) && cached.policies.length > 0 ? cached.policies : DEFAULT_MANDATORY_DISCLOSURES.policies,
      approvals: Array.isArray(cached.approvals) && cached.approvals.length > 0 ? cached.approvals : DEFAULT_MANDATORY_DISCLOSURES.approvals,
      reports: Array.isArray(cached.reports) && cached.reports.length > 0 ? cached.reports : DEFAULT_MANDATORY_DISCLOSURES.reports
    }
  }
  return DEFAULT_MANDATORY_DISCLOSURES
}

export default function AdminMandatoryDisclosures() {
  const [data, setData] = useState(getInitialData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [activeTab, setActiveTab] = useState('muhs')

  // MUHS Academic Year State
  const sortedYears = [...(data.muhs || [])].sort((a, b) => {
    const valA = parseInt(String(a.year).match(/\d{4}/)?.[0] || '0', 10)
    const valB = parseInt(String(b.year).match(/\d{4}/)?.[0] || '0', 10)
    return valB - valA
  })

  const [selectedYear, setSelectedYear] = useState(() => sortedYears[0]?.year || '2026–27')

  // Ensure selectedYear is always valid when sortedYears change
  useEffect(() => {
    if (sortedYears.length > 0 && !sortedYears.some(y => y.year === selectedYear)) {
      setSelectedYear(sortedYears[0].year)
    }
  }, [data.muhs])

  // Mandate Document Modal State
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [docForm, setDocForm] = useState({
    title: '',
    file_url: '',
    year: ''
  })
  const [uploadingPdf, setUploadingPdf] = useState(false)

  // Add Academic Year Modal State
  const [yearModalOpen, setYearModalOpen] = useState(false)
  const [newYearInput, setNewYearInput] = useState('')

  // Sub-items for other tabs
  const [policyModalOpen, setPolicyModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [policyForm, setPolicyForm] = useState({ title: '', desc: '', file_url: '' })
  const [uploadingPolicyPdf, setUploadingPolicyPdf] = useState(false)

  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [editingApproval, setEditingApproval] = useState(null)
  const [approvalForm, setApprovalForm] = useState({ authority: '', title: '', file_url: '' })
  const [uploadingApprovalPdf, setUploadingApprovalPdf] = useState(false)

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [reportForm, setReportForm] = useState({ year: '', title: '', status: 'Audited', file_url: '' })
  const [uploadingReportPdf, setUploadingReportPdf] = useState(false)

  // Load from backend on mount
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('mandatory-disclosures')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (parsed && typeof parsed === 'object') {
              setData(prev => {
                const merged = {
                  ...prev,
                  ...parsed,
                  muhs: Array.isArray(parsed.muhs) && parsed.muhs.length > 0 ? parsed.muhs : prev.muhs,
                  policies: Array.isArray(parsed.policies) && parsed.policies.length > 0 ? parsed.policies : prev.policies,
                  approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals,
                  reports: Array.isArray(parsed.reports) && parsed.reports.length > 0 ? parsed.reports : prev.reports
                }
                setCachedDisclosuresData(merged)
                return merged
              })
            }
          } catch {}
        }
      } catch (err) {
        console.error("Failed to load disclosures data", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Save All Changes to database
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'mandatory-disclosures',
        title: 'Mandatory Disclosures & Approvals',
        content_html: JSON.stringify(data),
        excerpt: 'Statutory approvals, MUHS university affiliation mandates, institutional policies, and financial audit reports.'
      })
      setCachedDisclosuresData(data)
      setMsg({ text: 'All Mandatory Disclosures updated and saved successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save disclosures: ' + (err.message || 'Error occurred'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Active Year Group
  const activeYearGroup = sortedYears.find(y => y.year === selectedYear) || { year: selectedYear, documents: [] }
  const activeDocs = Array.isArray(activeYearGroup.documents) ? activeYearGroup.documents : []

  // Add Academic Year
  const handleCreateYear = (e) => {
    e.preventDefault()
    const trimmed = newYearInput.trim()
    if (!trimmed) return

    if (data.muhs.some(y => y.year.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Academic Year "${trimmed}" already exists.`)
      return
    }

    const updatedMuhs = [
      ...data.muhs,
      { year: trimmed, documents: [] }
    ]

    setData(prev => ({ ...prev, muhs: updatedMuhs }))
    setSelectedYear(trimmed)
    setNewYearInput('')
    setYearModalOpen(false)
    setMsg({ text: `Academic Year "${trimmed}" added. Remember to click "Save All Changes" to persist.`, type: 'info' })
  }

  // Delete Academic Year
  const handleDeleteYear = (yearToDelete) => {
    if (!window.confirm(`Are you sure you want to delete Academic Year "${yearToDelete}" and all its documents?`)) {
      return
    }

    const updatedMuhs = data.muhs.filter(y => y.year !== yearToDelete)
    setData(prev => ({ ...prev, muhs: updatedMuhs }))
    if (selectedYear === yearToDelete) {
      const remaining = updatedMuhs.sort((a, b) => {
        const valA = parseInt(String(a.year).match(/\d{4}/)?.[0] || '0', 10)
        const valB = parseInt(String(b.year).match(/\d{4}/)?.[0] || '0', 10)
        return valB - valA
      })
      setSelectedYear(remaining[0]?.year || '')
    }
    setMsg({ text: `Academic Year "${yearToDelete}" removed.`, type: 'info' })
  }

  // Open Document Modal for Add
  const handleOpenAddDoc = () => {
    setEditingDoc(null)
    setDocForm({
      title: '',
      file_url: '',
      year: selectedYear
    })
    setDocModalOpen(true)
  }

  // Open Document Modal for Edit
  const handleOpenEditDoc = (doc) => {
    setEditingDoc(doc)
    setDocForm({
      title: doc.title || '',
      file_url: doc.file_url || '',
      year: selectedYear
    })
    setDocModalOpen(true)
  }

  // Upload PDF for Mandate
  const handleUploadMandatePdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'muhs')
      if (url) {
        setDocForm(prev => ({ ...prev, file_url: url }))
      }
    } catch (err) {
      alert('Failed to upload PDF: ' + (err.message || 'Network error'))
    } finally {
      setUploadingPdf(false)
    }
  }

  // Save Mandate Document (Add / Edit)
  const handleSaveDoc = (e) => {
    e.preventDefault()
    if (!docForm.title.trim()) {
      alert('Please enter a mandate document title.')
      return
    }

    const targetYear = docForm.year || selectedYear

    const updatedMuhs = data.muhs.map(yg => {
      if (yg.year === targetYear) {
        const docs = Array.isArray(yg.documents) ? [...yg.documents] : []
        if (editingDoc) {
          return {
            ...yg,
            documents: docs.map(d => d.id === editingDoc.id ? { ...d, title: docForm.title.trim(), file_url: docForm.file_url } : d)
          }
        } else {
          return {
            ...yg,
            documents: [
              ...docs,
              {
                id: Date.now(),
                title: docForm.title.trim(),
                file_url: docForm.file_url
              }
            ]
          }
        }
      }
      return yg
    })

    // If target year didn't exist in data.muhs, create it
    if (!updatedMuhs.some(yg => yg.year === targetYear)) {
      updatedMuhs.push({
        year: targetYear,
        documents: [{
          id: Date.now(),
          title: docForm.title.trim(),
          file_url: docForm.file_url
        }]
      })
    }

    setData(prev => ({ ...prev, muhs: updatedMuhs }))
    setDocModalOpen(false)
    setMsg({ text: `Document "${docForm.title.trim()}" saved. Click "Save All Changes" to persist.`, type: 'info' })
  }

  // Delete Mandate Document
  const handleDeleteDoc = (docId) => {
    if (!window.confirm('Are you sure you want to delete this mandate document?')) return

    const updatedMuhs = data.muhs.map(yg => {
      if (yg.year === selectedYear) {
        return {
          ...yg,
          documents: (yg.documents || []).filter(d => d.id !== docId)
        }
      }
      return yg
    })

    setData(prev => ({ ...prev, muhs: updatedMuhs }))
  }

  // Move Document Up / Down
  const handleMoveDoc = (index, direction) => {
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= activeDocs.length) return

    const updatedDocs = [...activeDocs]
    const temp = updatedDocs[index]
    updatedDocs[index] = updatedDocs[targetIdx]
    updatedDocs[targetIdx] = temp

    const updatedMuhs = data.muhs.map(yg => {
      if (yg.year === selectedYear) {
        return { ...yg, documents: updatedDocs }
      }
      return yg
    })

    setData(prev => ({ ...prev, muhs: updatedMuhs }))
  }

  // Handlers for Policies
  const handleSavePolicy = (e) => {
    e.preventDefault()
    if (!policyForm.title.trim()) return
    const updated = editingPolicy
      ? data.policies.map(p => p.id === editingPolicy.id ? { ...p, ...policyForm } : p)
      : [...(data.policies || []), { id: Date.now(), ...policyForm }]
    setData(prev => ({ ...prev, policies: updated }))
    setPolicyModalOpen(false)
  }

  const handleDeletePolicy = (id) => {
    if (!window.confirm('Delete this institutional policy?')) return
    setData(prev => ({ ...prev, policies: (prev.policies || []).filter(p => p.id !== id) }))
  }

  // Handlers for Approvals
  const handleSaveApproval = (e) => {
    e.preventDefault()
    if (!approvalForm.title.trim() || !approvalForm.authority.trim()) return
    const updated = editingApproval
      ? data.approvals.map(a => a.id === editingApproval.id ? { ...a, ...approvalForm } : a)
      : [...(data.approvals || []), { id: Date.now(), ...approvalForm }]
    setData(prev => ({ ...prev, approvals: updated }))
    setApprovalModalOpen(false)
  }

  const handleDeleteApproval = (id) => {
    if (!window.confirm('Delete this government approval?')) return
    setData(prev => ({ ...prev, approvals: (prev.approvals || []).filter(a => a.id !== id) }))
  }

  // Handlers for Reports
  const handleSaveReport = (e) => {
    e.preventDefault()
    if (!reportForm.title.trim() || !reportForm.year.trim()) return
    const updated = editingReport
      ? data.reports.map(r => r.id === editingReport.id ? { ...r, ...reportForm } : r)
      : [...(data.reports || []), { id: Date.now(), ...reportForm }]
    setData(prev => ({ ...prev, reports: updated }))
    setReportModalOpen(false)
  }

  const handleDeleteReport = (id) => {
    if (!window.confirm('Delete this audit report?')) return
    setData(prev => ({ ...prev, reports: (prev.reports || []).filter(r => r.id !== id) }))
  }

  return (
    <div>
      {/* Executive Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Regulatory &amp; Statutory Compliance</span>
          <h1>Mandatory Disclosures Administration</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Manage year-wise MUHS mandated disclosure documents, institutional policies, government approvals, and audit reports.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13.5 }}
          >
            {saving ? (
              <>
                <svg className="admin-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"></circle>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 16 }}>
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setActiveTab('muhs')}
          className={`admin-tab-btn ${activeTab === 'muhs' ? 'active' : ''}`}
        >
          <span>MUHS Mandates (Year-wise)</span>
          <span className="admin-tab-count">
            {sortedYears.reduce((sum, y) => sum + (y.documents?.length || 0), 0)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`admin-tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
        >
          <span>Institutional Policies</span>
          <span className="admin-tab-count">{data.policies?.length || 0}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`admin-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
        >
          <span>Government Approvals</span>
          <span className="admin-tab-count">{data.approvals?.length || 0}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
        >
          <span>Financial Audits</span>
          <span className="admin-tab-count">{data.reports?.length || 0}</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: MUHS MANDATES (YEAR-WISE SORTED)
          ======================================================== */}
      {activeTab === 'muhs' && (
        <div>
          {/* Year Management Strip */}
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-body" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Select Academic Year:
                </span>
                {sortedYears.map(yg => {
                  const isSelected = yg.year === selectedYear
                  return (
                    <button
                      key={yg.year}
                      type="button"
                      onClick={() => setSelectedYear(yg.year)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#2563eb' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>A.Y. {yg.year}</span>
                      <span
                        style={{
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#64748b',
                          fontSize: 11,
                          padding: '1px 6px',
                          borderRadius: 999
                        }}
                      >
                        {yg.documents?.length || 0}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setNewYearInput('')
                    setYearModalOpen(true)
                  }}
                  style={{ fontSize: 12.5 }}
                >
                  + Add New Academic Year
                </button>

                {sortedYears.length > 1 && (
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontSize: 12.5 }}
                    onClick={() => handleDeleteYear(selectedYear)}
                    title={`Delete Academic Year ${selectedYear}`}
                  >
                    Delete Year ({selectedYear})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Academic Year Documents Section */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  MUHS Mandate Documents for Academic Year: <span style={{ color: '#2563eb' }}>{selectedYear}</span>
                </h2>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>
                  These documents render on the public site under MUHS Mandated Disclosures for this year.
                </span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenAddDoc}
                style={{ fontSize: 13 }}
              >
                + Upload New Mandate Document
              </button>
            </div>

            <div className="admin-card-body" style={{ padding: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%', textAlign: 'center' }}>Sr. No.</th>
                    <th style={{ width: '50%' }}>Document Title</th>
                    <th style={{ width: '22%' }}>Attached PDF</th>
                    <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDocs.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
                        No mandate documents added for Academic Year <strong>{selectedYear}</strong> yet.
                        <div style={{ marginTop: 8 }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={handleOpenAddDoc}
                            style={{ fontSize: 12 }}
                          >
                            + Add First Mandate Document
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activeDocs.map((doc, idx) => (
                      <tr key={doc.id || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                          {idx + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                            {doc.title}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>
                            Academic Year: {selectedYear}
                          </div>
                        </td>
                        <td>
                          {doc.file_url ? (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                color: '#2563eb',
                                fontWeight: 600,
                                fontSize: 12.5,
                                textDecoration: 'none'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                              View PDF File ↗
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>
                              No PDF attached
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              disabled={idx === 0}
                              onClick={() => handleMoveDoc(idx, -1)}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              disabled={idx === activeDocs.length - 1}
                              onClick={() => handleMoveDoc(idx, 1)}
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '4px 10px', fontSize: 12 }}
                              onClick={() => handleOpenEditDoc(doc)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn"
                              style={{ padding: '4px 10px', fontSize: 12, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                              onClick={() => handleDeleteDoc(doc.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: POLICIES
          ======================================================== */}
      {activeTab === 'policies' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Institutional Policies & Bylaws</h2>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => {
                setEditingPolicy(null)
                setPolicyForm({ title: '', desc: '', file_url: '' })
                setPolicyModalOpen(true)
              }}
            >
              + Add Policy
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Sr.</th>
                  <th style={{ width: '32%' }}>Policy Title</th>
                  <th style={{ width: '40%' }}>Summary / Description</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.policies || []).map((pol, idx) => (
                  <tr key={pol.id || idx}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                    <td><strong>{pol.title}</strong></td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{pol.desc}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 12, marginRight: 6 }}
                        onClick={() => {
                          setEditingPolicy(pol)
                          setPolicyForm({ title: pol.title, desc: pol.desc, file_url: pol.file_url || '' })
                          setPolicyModalOpen(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ padding: '4px 10px', fontSize: 12, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                        onClick={() => handleDeletePolicy(pol.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: GOVERNMENT APPROVALS
          ======================================================== */}
      {activeTab === 'approvals' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Government Approvals & Regulatory Orders</h2>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => {
                setEditingApproval(null)
                setApprovalForm({ authority: '', title: '', file_url: '' })
                setApprovalModalOpen(true)
              }}
            >
              + Add Approval
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Sr.</th>
                  <th style={{ width: '30%' }}>Approving Authority</th>
                  <th style={{ width: '42%' }}>Notification / Order Details</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.approvals || []).map((appr, idx) => (
                  <tr key={appr.id || idx}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                    <td><strong>{appr.authority}</strong></td>
                    <td>{appr.title}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 12, marginRight: 6 }}
                        onClick={() => {
                          setEditingApproval(appr)
                          setApprovalForm({ authority: appr.authority, title: appr.title, file_url: appr.file_url || '' })
                          setApprovalModalOpen(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ padding: '4px 10px', fontSize: 12, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                        onClick={() => handleDeleteApproval(appr.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: FINANCIAL AUDITS & REPORTS
          ======================================================== */}
      {activeTab === 'reports' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Financial Audits & Annual Reports</h2>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => {
                setEditingReport(null)
                setReportForm({ year: '', title: '', status: 'Audited', file_url: '' })
                setReportModalOpen(true)
              }}
            >
              + Add Audit Report
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Financial Year</th>
                  <th style={{ width: '45%' }}>Financial Statement / Report</th>
                  <th style={{ width: '20%' }}>Audit Status</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.reports || []).map((rep, idx) => (
                  <tr key={rep.id || idx}>
                    <td><strong>{rep.year}</strong></td>
                    <td>{rep.title}</td>
                    <td>
                      <span className="admin-badge badge-info">{rep.status || 'Audited'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 12, marginRight: 6 }}
                        onClick={() => {
                          setEditingReport(rep)
                          setReportForm({ year: rep.year, title: rep.title, status: rep.status, file_url: rep.file_url || '' })
                          setReportModalOpen(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ padding: '4px 10px', fontSize: 12, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                        onClick={() => handleDeleteReport(rep.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD / EDIT MANDATE DOCUMENT
          ======================================================== */}
      {docModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-header">
              <h3>{editingDoc ? 'Edit Mandate Document' : 'Upload New Mandate Document'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setDocModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveDoc}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Academic Year *
                  </label>
                  <select
                    className="admin-select"
                    value={docForm.year}
                    onChange={e => setDocForm({ ...docForm, year: e.target.value })}
                    required
                  >
                    {sortedYears.map(yg => (
                      <option key={yg.year} value={yg.year}>
                        Academic Year {yg.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={docForm.title}
                    onChange={e => setDocForm({ ...docForm, title: e.target.value })}
                    placeholder="e.g. MUHS Continuation of Affiliation Order 2026–27"
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Upload Mandate PDF Document
                  </label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleUploadMandatePdf}
                      disabled={uploadingPdf}
                      style={{ fontSize: 13 }}
                    />
                    {uploadingPdf && (
                      <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                        Uploading...
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Or Enter Document File URL / Path
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={docForm.file_url}
                    onChange={e => setDocForm({ ...docForm, file_url: e.target.value })}
                    placeholder="https://... or /uploads/muhs/order.pdf"
                  />
                  {docForm.file_url && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#16a34a' }}>
                      ✓ File attached: <a href={docForm.file_url} target="_blank" rel="noopener noreferrer">Preview PDF</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setDocModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={uploadingPdf}
                >
                  {editingDoc ? 'Update Document' : 'Add Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD NEW ACADEMIC YEAR
          ======================================================== */}
      {yearModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 420 }}>
            <div className="admin-modal-header">
              <h3>Add Academic Year</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setYearModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateYear}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Academic Year Format (e.g. 2027–28) *
                  </label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newYearInput}
                    onChange={e => setNewYearInput(e.target.value)}
                    placeholder="e.g. 2027–28"
                    autoFocus
                  />
                  <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
                    Years are automatically sorted chronologically with the latest year appearing first.
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setYearModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Create Academic Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD / EDIT POLICY
          ======================================================== */}
      {policyModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3>{editingPolicy ? 'Edit Institutional Policy' : 'Add Institutional Policy'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setPolicyModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSavePolicy}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Policy Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={policyForm.title}
                    onChange={e => setPolicyForm({ ...policyForm, title: e.target.value })}
                    placeholder="e.g. Anti-Ragging Regulatory Policy"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Policy Description / Scope</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={policyForm.desc}
                    onChange={e => setPolicyForm({ ...policyForm, desc: e.target.value })}
                    placeholder="Summary of guidelines, disciplinary ordinances and statutory bylaws."
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>PDF File URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={policyForm.file_url}
                    onChange={e => setPolicyForm({ ...policyForm, file_url: e.target.value })}
                    placeholder="https://... or /uploads/policies/doc.pdf"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPolicyModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: ADD / EDIT APPROVAL
          ======================================================== */}
      {approvalModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3>{editingApproval ? 'Edit Government Approval' : 'Add Government Approval'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setApprovalModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveApproval}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Approving Authority *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={approvalForm.authority}
                    onChange={e => setApprovalForm({ ...approvalForm, authority: e.target.value })}
                    placeholder="e.g. Government of Maharashtra / DMER / UGC"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Notification / Order Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={approvalForm.title}
                    onChange={e => setApprovalForm({ ...approvalForm, title: e.target.value })}
                    placeholder="e.g. Medical Education & Drugs Department Gazette Sanction"
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Document PDF URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={approvalForm.file_url}
                    onChange={e => setApprovalForm({ ...approvalForm, file_url: e.target.value })}
                    placeholder="https://... or /uploads/approvals/order.pdf"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setApprovalModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ADD / EDIT REPORT
          ======================================================== */}
      {reportModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3>{editingReport ? 'Edit Financial Audit Report' : 'Add Financial Audit Report'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setReportModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveReport}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Financial Year *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={reportForm.year}
                    onChange={e => setReportForm({ ...reportForm, year: e.target.value })}
                    placeholder="e.g. F.Y. 2025–26"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Report Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={reportForm.title}
                    onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
                    placeholder="e.g. Audited Balance Sheet & Income-Expenditure Account"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Audit Status</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reportForm.status}
                    onChange={e => setReportForm({ ...reportForm, status: e.target.value })}
                    placeholder="e.g. Audited / Approved by FRA"
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Report PDF URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reportForm.file_url}
                    onChange={e => setReportForm({ ...reportForm, file_url: e.target.value })}
                    placeholder="https://... or /uploads/reports/balance-sheet.pdf"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setReportModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
