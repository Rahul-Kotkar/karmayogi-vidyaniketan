import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService, getCachedIQACData, setCachedIQACData } from '../../services/endpoints.js'
import { DEFAULT_IQAC_DATA } from '../../data/iqacData.js'

export default function AdminIQAC() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'iqac'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [data, setData] = useState(() => getCachedIQACData() || DEFAULT_IQAC_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Inline input state for quick addition of objectives and functions
  const [newObjective, setNewObjective] = useState('')
  const [newFunction, setNewFunction] = useState('')

  // Modal state for minutes, initiatives, and AQAR reports
  const [modalType, setModalType] = useState(null) // 'minute', 'initiative', 'aqar'
  const [editingIndex, setEditingIndex] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [uploading, setUploading] = useState(false)

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['iqac', 'naac', 'minutes', 'initiatives', 'aqar'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey })
  }

  // Load saved IQAC data from backend
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('iqac-naac')
        if (page?.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => {
              const merged = {
                ...prev,
                ...parsed,
                overview: { ...prev.overview, ...(parsed.overview || {}) },
                iqac: {
                  ...prev.iqac,
                  ...(parsed.iqac || {}),
                  objectives: Array.isArray(parsed.iqac?.objectives) && parsed.iqac.objectives.length > 0 ? parsed.iqac.objectives : prev.iqac.objectives,
                  functions: Array.isArray(parsed.iqac?.functions) && parsed.iqac.functions.length > 0 ? parsed.iqac.functions : prev.iqac.functions
                },
                naac: { ...prev.naac, ...(parsed.naac || {}) },
                minutes: Array.isArray(parsed.minutes) && parsed.minutes.length > 0 ? parsed.minutes : prev.minutes,
                initiatives: Array.isArray(parsed.initiatives) && parsed.initiatives.length > 0 ? parsed.initiatives : prev.initiatives,
                aqar: Array.isArray(parsed.aqar) && parsed.aqar.length > 0 ? parsed.aqar : prev.aqar
              }
              setCachedIQACData(merged)
              return merged
            })
          } catch {
            // Keep default data if content_html is legacy raw HTML
          }
        }
      } catch {
        // Fallback to current default data
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save all changes to the database
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'iqac-naac',
        title: 'IQAC & NAAC Accreditation',
        content_html: JSON.stringify(data)
      })
      setCachedIQACData(data)
      setMsg({ text: 'IQAC & NAAC details saved and published successfully.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save changes. Please try again.', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------------------------------
  // Tab 1: Objectives & Functions Inline Helpers
  // --------------------------------------------------------------------------
  const addObjective = (e) => {
    e.preventDefault()
    const val = newObjective.trim()
    if (!val) return
    setData(prev => ({
      ...prev,
      iqac: {
        ...prev.iqac,
        objectives: [...(prev.iqac?.objectives || []), val]
      }
    }))
    setNewObjective('')
  }

  const deleteObjective = (idx) => {
    setData(prev => ({
      ...prev,
      iqac: {
        ...prev.iqac,
        objectives: prev.iqac.objectives.filter((_, i) => i !== idx)
      }
    }))
  }

  const addFunction = (e) => {
    e.preventDefault()
    const val = newFunction.trim()
    if (!val) return
    setData(prev => ({
      ...prev,
      iqac: {
        ...prev.iqac,
        functions: [...(prev.iqac?.functions || []), val]
      }
    }))
    setNewFunction('')
  }

  const deleteFunction = (idx) => {
    setData(prev => ({
      ...prev,
      iqac: {
        ...prev.iqac,
        functions: prev.iqac.functions.filter((_, i) => i !== idx)
      }
    }))
  }

  // --------------------------------------------------------------------------
  // Modal Helpers
  // --------------------------------------------------------------------------
  const openModal = (type, index = null, initial = {}) => {
    setModalType(type)
    setEditingIndex(index)
    setFormValues(initial)
  }

  const closeModal = () => {
    setModalType(null)
    setEditingIndex(null)
    setFormValues({})
    setUploading(false)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'iqac')
      setFormValues(prev => ({ ...prev, file_url: url }))
    } catch (err) {
      alert('Upload failed: ' + (err.message || 'Network error'))
    } finally {
      setUploading(false)
    }
  }

  const handleModalSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'minute') {
      const list = [...(data.minutes || [])]
      if (editingIndex !== null) {
        list[editingIndex] = { ...list[editingIndex], ...formValues }
      } else {
        list.push({ id: `min-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, minutes: list }))
    }

    if (modalType === 'initiative') {
      const list = [...(data.initiatives || [])]
      if (editingIndex !== null) {
        list[editingIndex] = { ...list[editingIndex], ...formValues }
      } else {
        list.push({ id: `init-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, initiatives: list }))
    }

    if (modalType === 'aqar') {
      const list = [...(data.aqar || [])]
      if (editingIndex !== null) {
        list[editingIndex] = { ...list[editingIndex], ...formValues }
      } else {
        list.push({ id: `aqar-${Date.now()}`, ...formValues })
      }
      setData(prev => ({ ...prev, aqar: list }))
    }

    closeModal()
  }

  const deleteMinute = (idx) => {
    if (!window.confirm('Delete this IQAC meeting record?')) return
    setData(prev => ({
      ...prev,
      minutes: prev.minutes.filter((_, i) => i !== idx)
    }))
  }

  const deleteInitiative = (idx) => {
    if (!window.confirm('Delete this quality initiative?')) return
    setData(prev => ({
      ...prev,
      initiatives: prev.initiatives.filter((_, i) => i !== idx)
    }))
  }

  const deleteAQAR = (idx) => {
    if (!window.confirm('Delete this AQAR report record?')) return
    setData(prev => ({
      ...prev,
      aqar: prev.aqar.filter((_, i) => i !== idx)
    }))
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            IQAC & NAAC Quality Framework
            <span className="admin-page-badge">Accreditation & Benchmarking</span>
          </h1>
          <p>
            Manage IQAC objectives, NAAC accreditation criteria, meeting minutes, quality initiatives, and AQAR documentation.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
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

      {/* Alert Notification */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {/* Tabs Navigation Matching the 5 Submenus */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'iqac' ? 'active' : ''}`}
          onClick={() => handleTabChange('iqac')}
        >
          <span>1. IQAC Cell</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'naac' ? 'active' : ''}`}
          onClick={() => handleTabChange('naac')}
        >
          <span>2. NAAC Accreditation</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'minutes' ? 'active' : ''}`}
          onClick={() => handleTabChange('minutes')}
        >
          <span>3. Minutes of IQAC</span>
          <span className="admin-tab-count">{data.minutes?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'initiatives' ? 'active' : ''}`}
          onClick={() => handleTabChange('initiatives')}
        >
          <span>4. Quality Initiatives</span>
          <span className="admin-tab-count">{data.initiatives?.length || 0}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'aqar' ? 'active' : ''}`}
          onClick={() => handleTabChange('aqar')}
        >
          <span>5. AQAR Reports</span>
          <span className="admin-tab-count">{data.aqar?.length || 0}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading IQAC & NAAC details...
        </div>
      ) : (
        <>
          {/* ========================================================
              TAB 1: IQAC CELL
              ======================================================== */}
          {activeTab === 'iqac' && (
            <div>
              {/* Introduction Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>IQAC Cell Overview & Statement</h3>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group">
                    <label>Submenu Section Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.iqac?.title || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        iqac: { ...prev.iqac, title: e.target.value }
                      }))}
                      placeholder="e.g. Internal Quality Assurance Cell (IQAC)"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Establishment & Institutional Statement</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={data.iqac?.intro || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        iqac: { ...prev.iqac, intro: e.target.value }
                      }))}
                      placeholder="The IQAC was formally established in accordance with NAAC guidelines..."
                    />
                  </div>
                </div>
              </div>

              {/* Core Objectives Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>Core Objectives of IQAC</h3>
                    <span style={{ fontSize: 13, color: '#5c6672' }}>
                      Total: {data.iqac?.objectives?.length || 0} objectives
                    </span>
                  </div>
                </div>
                <div className="admin-card-body">
                  <form onSubmit={addObjective} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={newObjective}
                      onChange={e => setNewObjective(e.target.value)}
                      placeholder="Type a new objective and click Add..."
                    />
                    <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" style={{ whiteSpace: 'nowrap' }}>
                      + Add Objective
                    </button>
                  </form>

                  {(!data.iqac?.objectives || data.iqac.objectives.length === 0) ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
                      No objectives listed yet.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>#</th>
                          <th>Objective Description</th>
                          <th style={{ width: 100, textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.iqac.objectives.map((obj, i) => (
                          <tr key={i}>
                            <td><span className="admin-badge badge-info">{i + 1}</span></td>
                            <td>
                              <input
                                type="text"
                                className="admin-input"
                                value={obj}
                                onChange={e => {
                                  const updated = [...data.iqac.objectives]
                                  updated[i] = e.target.value
                                  setData(prev => ({ ...prev, iqac: { ...prev.iqac, objectives: updated } }))
                                }}
                              />
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => deleteObjective(i)}
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

              {/* Core Functions Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3>IQAC Core Functions</h3>
                    <span style={{ fontSize: 13, color: '#5c6672' }}>
                      Total: {data.iqac?.functions?.length || 0} functions
                    </span>
                  </div>
                </div>
                <div className="admin-card-body">
                  <form onSubmit={addFunction} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={newFunction}
                      onChange={e => setNewFunction(e.target.value)}
                      placeholder="Type a new function and click Add..."
                    />
                    <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" style={{ whiteSpace: 'nowrap' }}>
                      + Add Function
                    </button>
                  </form>

                  {(!data.iqac?.functions || data.iqac.functions.length === 0) ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
                      No functions listed yet.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>#</th>
                          <th>Function Description</th>
                          <th style={{ width: 100, textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.iqac.functions.map((fn, i) => (
                          <tr key={i}>
                            <td><span className="admin-badge badge-info">{i + 1}</span></td>
                            <td>
                              <input
                                type="text"
                                className="admin-input"
                                value={fn}
                                onChange={e => {
                                  const updated = [...data.iqac.functions]
                                  updated[i] = e.target.value
                                  setData(prev => ({ ...prev, iqac: { ...prev.iqac, functions: updated } }))
                                }}
                              />
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => deleteFunction(i)}
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
            </div>
          )}

          {/* ========================================================
              TAB 2: NAAC ACCREDITATION
              ======================================================== */}
          {activeTab === 'naac' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>NAAC Accreditation Metrics & Details</h3>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label>Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.naac?.title || ''}
                    onChange={e => setData(prev => ({
                      ...prev,
                      naac: { ...prev.naac, title: e.target.value }
                    }))}
                    placeholder="e.g. National Assessment and Accreditation Council (NAAC)"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Accreditation Overview Statement</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={data.naac?.intro || ''}
                    onChange={e => setData(prev => ({
                      ...prev,
                      naac: { ...prev.naac, intro: e.target.value }
                    }))}
                    placeholder="The college has been accredited with Grade 'A' (CGPA 3.02)..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label>NAAC Rating / Grade *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.naac?.grade || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        naac: { ...prev.naac, grade: e.target.value }
                      }))}
                      placeholder="e.g. Grade 'A'"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Cumulative GPA (CGPA) *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.naac?.cgpa || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        naac: { ...prev.naac, cgpa: e.target.value }
                      }))}
                      placeholder="e.g. 3.02"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Accreditation Cycle *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.naac?.cycle || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        naac: { ...prev.naac, cycle: e.target.value }
                      }))}
                      placeholder="e.g. Cycle 1"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>UGC Act Recognition *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.naac?.recognition || ''}
                      onChange={e => setData(prev => ({
                        ...prev,
                        naac: { ...prev.naac, recognition: e.target.value }
                      }))}
                      placeholder="e.g. Sec 2(f)"
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>NAAC Peer Team Commendations & Highlights</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={data.naac?.commendations || ''}
                    onChange={e => setData(prev => ({
                      ...prev,
                      naac: { ...prev.naac, commendations: e.target.value }
                    }))}
                    placeholder="Enter peer team observations and commendations..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: MINUTES OF IQAC
              ======================================================== */}
          {activeTab === 'minutes' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Minutes of IQAC Meetings & Action Taken Reports</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.minutes?.length || 0} meetings documented
                  </span>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => openModal('minute', null, {
                    date: '',
                    agenda: '',
                    status: 'Implemented',
                    file_url: ''
                  })}
                >
                  + Add Meeting Minutes
                </button>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {(!data.minutes || data.minutes.length === 0) ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No meeting minutes recorded yet. Click "+ Add Meeting Minutes" to add one.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 140 }}>Meeting Date</th>
                        <th>Agenda & Deliberations</th>
                        <th style={{ width: 140 }}>ATR Status</th>
                        <th style={{ width: 120 }}>Document</th>
                        <th style={{ width: 130, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.minutes.map((m, i) => (
                        <tr key={m.id || i}>
                          <td><span className="admin-badge badge-info">{i + 1}</span></td>
                          <td><strong>{m.date}</strong></td>
                          <td>
                            <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                              {m.agenda}
                            </div>
                          </td>
                          <td>
                            <span className="admin-badge badge-info">{m.status || 'Resolved'}</span>
                          </td>
                          <td>
                            {m.file_url ? (
                              <a
                                href={m.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 12.5, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                              >
                                View PDF ↗
                              </a>
                            ) : (
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>No file</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('minute', i, { ...m })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteMinute(i)}
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
          )}

          {/* ========================================================
              TAB 4: QUALITY INITIATIVES
              ======================================================== */}
          {activeTab === 'initiatives' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Institutional Quality Initiatives</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.initiatives?.length || 0} initiatives
                  </span>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => openModal('initiative', null, {
                    title: '',
                    description: ''
                  })}
                >
                  + Add Initiative
                </button>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {(!data.initiatives || data.initiatives.length === 0) ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No initiatives listed yet. Click "+ Add Initiative" to add one.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 260 }}>Initiative Title</th>
                        <th>Scope & Description</th>
                        <th style={{ width: 130, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.initiatives.map((init, i) => (
                        <tr key={init.id || i}>
                          <td><span className="admin-badge badge-info">{i + 1}</span></td>
                          <td>
                            <strong style={{ color: '#0f172a', fontSize: 13.5 }}>{init.title}</strong>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.55 }}>
                              {init.description}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('initiative', i, { ...init })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteInitiative(i)}
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
          )}

          {/* ========================================================
              TAB 5: AQAR REPORTS
              ======================================================== */}
          {activeTab === 'aqar' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Annual Quality Assurance Reports (AQAR)</h3>
                  <span style={{ fontSize: 13, color: '#5c6672' }}>
                    Total: {data.aqar?.length || 0} annual reports
                  </span>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => openModal('aqar', null, {
                    year: '',
                    focus: '',
                    status: 'Approved by NAAC',
                    file_url: ''
                  })}
                >
                  + Add AQAR Report
                </button>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {(!data.aqar || data.aqar.length === 0) ? (
                  <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                    No AQAR reports recorded yet. Click "+ Add AQAR Report" to add one.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 140 }}>Academic Year</th>
                        <th>Report Focus & Highlights</th>
                        <th style={{ width: 160 }}>Submission Status</th>
                        <th style={{ width: 120 }}>Document</th>
                        <th style={{ width: 130, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.aqar.map((a, i) => (
                        <tr key={a.id || i}>
                          <td><span className="admin-badge badge-info">{i + 1}</span></td>
                          <td><strong>{a.year}</strong></td>
                          <td>
                            <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                              {a.focus}
                            </div>
                          </td>
                          <td>
                            <span className="admin-badge badge-info">{a.status || 'Submitted'}</span>
                          </td>
                          <td>
                            {a.file_url ? (
                              <a
                                href={a.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 12.5, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                              >
                                View PDF ↗
                              </a>
                            ) : (
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>No file</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => openModal('aqar', i, { ...a })}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => deleteAQAR(i)}
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
          )}
        </>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT DIALOG
          ======================================================== */}
      {modalType && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 540 }}>
            <div className="admin-modal-header">
              <h3>
                {modalType === 'minute' && (editingIndex !== null ? 'Edit Meeting Minutes' : 'Add IQAC Meeting Minutes')}
                {modalType === 'initiative' && (editingIndex !== null ? 'Edit Quality Initiative' : 'Add Quality Initiative')}
                {modalType === 'aqar' && (editingIndex !== null ? 'Edit AQAR Report' : 'Add AQAR Report')}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="admin-modal-body">
                {/* 1. Minute Fields */}
                {modalType === 'minute' && (
                  <>
                    <div className="admin-form-group">
                      <label>Meeting Date *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.date || ''}
                        onChange={e => setFormValues({ ...formValues, date: e.target.value })}
                        placeholder="e.g. 18-Jul-2026 or 2026-07-18"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Key Agenda & Deliberations *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.agenda || ''}
                        onChange={e => setFormValues({ ...formValues, agenda: e.target.value })}
                        placeholder="Summary of matters discussed and resolutions passed..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Action Taken Status *</label>
                      <select
                        className="admin-select"
                        value={formValues.status || 'Implemented'}
                        onChange={e => setFormValues({ ...formValues, status: e.target.value })}
                      >
                        <option value="Implemented">Implemented</option>
                        <option value="Completed">Completed</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Action Taken">Action Taken</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Minutes Document (PDF / Document Link)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.file_url || ''}
                        onChange={e => setFormValues({ ...formValues, file_url: e.target.value })}
                        placeholder="e.g. /documents/iqac-minutes-2026.pdf"
                        style={{ marginBottom: 6 }}
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="admin-input"
                      />
                      {uploading && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>Uploading document...</div>}
                    </div>
                  </>
                )}

                {/* 2. Initiative Fields */}
                {modalType === 'initiative' && (
                  <>
                    <div className="admin-form-group">
                      <label>Initiative Title *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.title || ''}
                        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
                        placeholder="e.g. Faculty Development Programs (FDP)"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Scope & Description *</label>
                      <textarea
                        rows={4}
                        required
                        className="admin-textarea"
                        value={formValues.description || ''}
                        onChange={e => setFormValues({ ...formValues, description: e.target.value })}
                        placeholder="Detailed objectives, pedagogical scope, and frequency..."
                      />
                    </div>
                  </>
                )}

                {/* 3. AQAR Fields */}
                {modalType === 'aqar' && (
                  <>
                    <div className="admin-form-group">
                      <label>Academic Year *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={formValues.year || ''}
                        onChange={e => setFormValues({ ...formValues, year: e.target.value })}
                        placeholder="e.g. 2025–26"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Report Focus & Highlights *</label>
                      <textarea
                        rows={3}
                        required
                        className="admin-textarea"
                        value={formValues.focus || ''}
                        onChange={e => setFormValues({ ...formValues, focus: e.target.value })}
                        placeholder="Criterion highlights, progress in academics, infrastructure..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Submission / Approval Status *</label>
                      <select
                        className="admin-select"
                        value={formValues.status || 'Approved by NAAC'}
                        onChange={e => setFormValues({ ...formValues, status: e.target.value })}
                      >
                        <option value="Approved by NAAC">Approved by NAAC</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>AQAR Report File (PDF / Link)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={formValues.file_url || ''}
                        onChange={e => setFormValues({ ...formValues, file_url: e.target.value })}
                        placeholder="e.g. /documents/aqar-report-2025-26.pdf"
                        style={{ marginBottom: 6 }}
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="admin-input"
                      />
                      {uploading && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>Uploading document...</div>}
                    </div>
                  </>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingIndex !== null ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
