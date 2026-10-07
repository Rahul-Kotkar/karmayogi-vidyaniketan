import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, setCachedResearchData } from '../../services/endpoints.js'
import { DEFAULT_RESEARCH_DATA } from '../../data/collegeData.js'

export default function AdminResearch() {
  const [searchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') || 'overview').replace(/-/g, '_')
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam.replace(/-/g, '_'))
    }
  }, [searchParams])
  const [data, setData] = useState(DEFAULT_RESEARCH_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Draft states for adding new items
  const [newCenter, setNewCenter] = useState({ name: '', scope: '', lead_faculty: '', equipment: '' })
  const [showAddCenter, setShowAddCenter] = useState(false)

  const [newProject, setNewProject] = useState({ title: '', investigators: '', dept: '', duration: '', status: 'Ongoing', summary: '' })
  const [showAddProject, setShowAddProject] = useState(false)

  const [newPublication, setNewPublication] = useState({ title: '', authors: '', journal: '', year: '', volume: '', indexing: '', doi: '' })
  const [showAddPublication, setShowAddPublication] = useState(false)

  const [newPatent, setNewPatent] = useState({ title: '', app_no: '', status: 'Published', filing_date: '', inventors: '', authority: 'Indian Patent Office (IPO)', category: '' })
  const [showAddPatent, setShowAddPatent] = useState(false)

  const [newScholar, setNewScholar] = useState({ name: '', guide: '', topic: '', dept: '', reg_year: '', status: 'Ph.D. Scholar (Pursuing)' })
  const [showAddScholar, setShowAddScholar] = useState(false)

  const [newFundedProject, setNewFundedProject] = useState({ title: '', agency: '', pi: '', amount: '', tenure: '', status: 'Ongoing' })
  const [showAddFundedProject, setShowAddFundedProject] = useState(false)

  const [newConference, setNewConference] = useState({ title: '', paper_title: '', presenter: '', date: '', venue: '', type: 'Oral Presentation' })
  const [showAddConference, setShowAddConference] = useState(false)

  const [newAchievement, setNewAchievement] = useState({ title: '', awardee: '', event: '', year: '', details: '' })
  const [showAddAchievement, setShowAddAchievement] = useState(false)

  const [newThrustArea, setNewThrustArea] = useState('')
  const [newEditorialMember, setNewEditorialMember] = useState({ role: '', name: '' })
  const [showAddEditorialMember, setShowAddEditorialMember] = useState(false)

  // Load existing data from DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('research')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              overview: { ...prev.overview, ...(parsed.overview || {}) },
              centers: Array.isArray(parsed.centers) && parsed.centers.length > 0 ? parsed.centers : prev.centers,
              projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : prev.projects,
              publications: Array.isArray(parsed.publications) && parsed.publications.length > 0 ? parsed.publications : prev.publications,
              patents: Array.isArray(parsed.patents) && parsed.patents.length > 0 ? parsed.patents : prev.patents,
              scholars: Array.isArray(parsed.scholars) && parsed.scholars.length > 0 ? parsed.scholars : prev.scholars,
              funded_projects: Array.isArray(parsed.funded_projects) && parsed.funded_projects.length > 0 ? parsed.funded_projects : prev.funded_projects,
              conferences: Array.isArray(parsed.conferences) && parsed.conferences.length > 0 ? parsed.conferences : prev.conferences,
              journals: { ...prev.journals, ...(parsed.journals || {}) },
              achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements
            }))
          } catch {
            // Keep default structured data
          }
        }
      } catch {
        // Fallback to DEFAULT_RESEARCH_DATA
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Overview change handler
  const handleOverviewChange = (field, val) => {
    setData(prev => ({
      ...prev,
      overview: { ...prev.overview, [field]: val }
    }))
  }

  // Stat handlers
  const handleStatChange = (index, field, val) => {
    setData(prev => {
      const stats = [...(prev.overview?.stats || [])]
      stats[index] = { ...stats[index], [field]: val }
      return { ...prev, overview: { ...prev.overview, stats } }
    })
  }

  // Thrust Areas handlers
  const handleAddThrustArea = () => {
    if (!newThrustArea.trim()) return
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        thrust_areas: [...(prev.overview?.thrust_areas || []), newThrustArea.trim()]
      }
    }))
    setNewThrustArea('')
  }

  const handleDeleteThrustArea = (idx) => {
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        thrust_areas: prev.overview?.thrust_areas.filter((_, i) => i !== idx)
      }
    }))
  }

  // Generic List item handlers
  const handleListFieldChange = (listKey, index, field, val) => {
    setData(prev => {
      const updated = [...prev[listKey]]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, [listKey]: updated }
    })
  }

  const handleDeleteListItem = (listKey, index) => {
    if (!window.confirm('Are you sure you want to remove this entry?')) return
    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index)
    }))
  }

  // Centers
  const handleAddCenter = () => {
    if (!newCenter.name.trim()) return
    setData(prev => ({
      ...prev,
      centers: [...prev.centers, { ...newCenter, id: Date.now() }]
    }))
    setNewCenter({ name: '', scope: '', lead_faculty: '', equipment: '' })
    setShowAddCenter(false)
  }

  // Projects
  const handleAddProject = () => {
    if (!newProject.title.trim()) return
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...newProject, id: Date.now() }]
    }))
    setNewProject({ title: '', investigators: '', dept: '', duration: '', status: 'Ongoing', summary: '' })
    setShowAddProject(false)
  }

  // Publications
  const handleAddPublication = () => {
    if (!newPublication.title.trim()) return
    setData(prev => ({
      ...prev,
      publications: [...prev.publications, { ...newPublication, id: Date.now() }]
    }))
    setNewPublication({ title: '', authors: '', journal: '', year: '', volume: '', indexing: '', doi: '' })
    setShowAddPublication(false)
  }

  // Patents
  const handleAddPatent = () => {
    if (!newPatent.title.trim()) return
    setData(prev => ({
      ...prev,
      patents: [...prev.patents, { ...newPatent, id: Date.now() }]
    }))
    setNewPatent({ title: '', app_no: '', status: 'Published', filing_date: '', inventors: '', authority: 'Indian Patent Office (IPO)', category: '' })
    setShowAddPatent(false)
  }

  // Scholars
  const handleAddScholar = () => {
    if (!newScholar.name.trim()) return
    setData(prev => ({
      ...prev,
      scholars: [...prev.scholars, { ...newScholar, id: Date.now() }]
    }))
    setNewScholar({ name: '', guide: '', topic: '', dept: '', reg_year: '', status: 'Ph.D. Scholar (Pursuing)' })
    setShowAddScholar(false)
  }

  // Funded Projects
  const handleAddFundedProject = () => {
    if (!newFundedProject.title.trim()) return
    setData(prev => ({
      ...prev,
      funded_projects: [...prev.funded_projects, { ...newFundedProject, id: Date.now() }]
    }))
    setNewFundedProject({ title: '', agency: '', pi: '', amount: '', tenure: '', status: 'Ongoing' })
    setShowAddFundedProject(false)
  }

  // Conferences
  const handleAddConference = () => {
    if (!newConference.title.trim()) return
    setData(prev => ({
      ...prev,
      conferences: [...prev.conferences, { ...newConference, id: Date.now() }]
    }))
    setNewConference({ title: '', paper_title: '', presenter: '', date: '', venue: '', type: 'Oral Presentation' })
    setShowAddConference(false)
  }

  // Journals
  const handleJournalChange = (field, val) => {
    setData(prev => ({
      ...prev,
      journals: { ...prev.journals, [field]: val }
    }))
  }

  const handleEditorialBoardChange = (index, field, val) => {
    setData(prev => {
      const edBoard = [...(prev.journals?.editorial_board || [])]
      edBoard[index] = { ...edBoard[index], [field]: val }
      return { ...prev, journals: { ...prev.journals, editorial_board: edBoard } }
    })
  }

  const handleAddEditorialMember = () => {
    if (!newEditorialMember.name.trim()) return
    setData(prev => ({
      ...prev,
      journals: {
        ...prev.journals,
        editorial_board: [...(prev.journals?.editorial_board || []), newEditorialMember]
      }
    }))
    setNewEditorialMember({ role: '', name: '' })
    setShowAddEditorialMember(false)
  }

  const handleDeleteEditorialMember = (idx) => {
    setData(prev => ({
      ...prev,
      journals: {
        ...prev.journals,
        editorial_board: prev.journals?.editorial_board.filter((_, i) => i !== idx)
      }
    }))
  }

  // Achievements
  const handleAddAchievement = () => {
    if (!newAchievement.title.trim()) return
    setData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { ...newAchievement, id: Date.now() }]
    }))
    setNewAchievement({ title: '', awardee: '', event: '', year: '', details: '' })
    setShowAddAchievement(false)
  }

  // Global Save
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'research',
        title: data.overview?.intro_title || 'Research & Development',
        content_html: JSON.stringify(data),
        excerpt: (data.overview?.intro_lead || 'Research & Development').slice(0, 160)
      })

      // Update client-side prehydration cache
      setCachedResearchData(data)

      setMsg({ text: 'All Research content updated and saved successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save research content: ' + (err.message || 'Unknown error'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Research & Development Management
            <span className="admin-page-badge">R&D Cell & Scientific Inquiries</span>
          </h1>
          <p>
            Manage the 10 research submenus: overview, research centers, projects, publications, patents, scholars, funded projects, conferences, journals, and achievements.
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
            {saving ? 'Saving Research...' : 'Save All Research Changes'}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 16 }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading research data...
        </div>
      ) : (
        <div>
          {/* Sub Navigation Tabs */}
          <div className="admin-tabs" style={{ marginBottom: 20 }}>
            <button
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              1. Research Overview
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'centers' ? 'active' : ''}`}
              onClick={() => setActiveTab('centers')}
            >
              2. Research Centers
              <span className="admin-tab-count">{data.centers?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              3. Research Projects
              <span className="admin-tab-count">{data.projects?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'publications' ? 'active' : ''}`}
              onClick={() => setActiveTab('publications')}
            >
              4. Publications
              <span className="admin-tab-count">{data.publications?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'patents' ? 'active' : ''}`}
              onClick={() => setActiveTab('patents')}
            >
              5. Patents
              <span className="admin-tab-count">{data.patents?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'scholars' ? 'active' : ''}`}
              onClick={() => setActiveTab('scholars')}
            >
              6. Scholars
              <span className="admin-tab-count">{data.scholars?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'funded_projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('funded_projects')}
            >
              7. Funded Projects
              <span className="admin-tab-count">{data.funded_projects?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'conferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('conferences')}
            >
              8. Conferences
              <span className="admin-tab-count">{data.conferences?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'journals' ? 'active' : ''}`}
              onClick={() => setActiveTab('journals')}
            >
              9. Journals
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              10. Achievements
              <span className="admin-tab-count">{data.achievements?.length || 0}</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: RESEARCH OVERVIEW
              ======================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-card">
              <h2 style={{ fontSize: 18, margin: '0 0 16px', color: 'var(--navy-header)' }}>
                Research Overview & Institutional Parameters
              </h2>
              
              <div className="admin-form-group">
                <label className="admin-label">Page Main Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.overview?.intro_title || ''}
                  onChange={(e) => handleOverviewChange('intro_title', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Introductory Lead Statement</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={data.overview?.intro_lead || ''}
                  onChange={(e) => handleOverviewChange('intro_lead', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Research Vision</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={data.overview?.vision || ''}
                    onChange={(e) => handleOverviewChange('vision', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Research Mission</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={data.overview?.mission || ''}
                    onChange={(e) => handleOverviewChange('mission', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Institutional Ethics Committee (IEC) Statement</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={data.overview?.iec_statement || ''}
                  onChange={(e) => handleOverviewChange('iec_statement', e.target.value)}
                />
              </div>

              {/* Research Metrics / Stats */}
              <div style={{ marginTop: 24 }}>
                <label className="admin-label">Key Research Metrics (Numbers / Counts)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {data.overview?.stats?.map((st, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: 10 }}>
                      <input
                        type="text"
                        placeholder="Value (e.g. 18+)"
                        className="admin-input"
                        style={{ fontWeight: 700, marginBottom: 6 }}
                        value={st.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        className="admin-input"
                        style={{ fontSize: 12 }}
                        value={st.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Thrust Areas */}
              <div style={{ marginTop: 24 }}>
                <label className="admin-label">Priority Thrust Areas</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Enter research thrust area..."
                    value={newThrustArea}
                    onChange={(e) => setNewThrustArea(e.target.value)}
                  />
                  <button className="admin-btn admin-btn-secondary" onClick={handleAddThrustArea}>
                    Add Area
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {data.overview?.thrust_areas?.map((area, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 13,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleDeleteThrustArea(idx)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', padding: 2 }}
                        title="Remove area"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: RESEARCH CENTERS
              ======================================================== */}
          {activeTab === 'centers' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Research Centers & Specialized Laboratories
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddCenter(!showAddCenter)}
                >
                  {showAddCenter ? 'Cancel' : '+ Add New Research Center'}
                </button>
              </div>

              {showAddCenter && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Research Center Details</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Center Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Center for Biomechanics & Motion Analysis"
                      value={newCenter.name}
                      onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Investigation Scope & Research Focus</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      placeholder="Describe scientific studies and scope..."
                      value={newCenter.scope}
                      onChange={(e) => setNewCenter({ ...newCenter, scope: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Faculty In-Charge</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Dr. P. Deshmukh"
                        value={newCenter.lead_faculty}
                        onChange={(e) => setNewCenter({ ...newCenter, lead_faculty: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Key Equipment & Instruments</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="3D Motion Tracking, Force Plates, sEMG..."
                        value={newCenter.equipment}
                        onChange={(e) => setNewCenter({ ...newCenter, equipment: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddCenter}>
                    Save Center
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 14 }}>
                {data.centers?.map((ctr, idx) => (
                  <div key={ctr.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, fontSize: 15, maxWidth: '80%' }}
                        value={ctr.name}
                        onChange={(e) => handleListFieldChange('centers', idx, 'name', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('centers', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 8 }}>
                      <label className="admin-label" style={{ fontSize: 12 }}>Scope & Focus</label>
                      <textarea
                        className="admin-input"
                        rows={2}
                        value={ctr.scope}
                        onChange={(e) => handleListFieldChange('centers', idx, 'scope', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label className="admin-label" style={{ fontSize: 12 }}>Faculty In-Charge</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={ctr.lead_faculty}
                          onChange={(e) => handleListFieldChange('centers', idx, 'lead_faculty', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="admin-label" style={{ fontSize: 12 }}>Key Equipment</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={ctr.equipment}
                          onChange={(e) => handleListFieldChange('centers', idx, 'equipment', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: RESEARCH PROJECTS
              ======================================================== */}
          {activeTab === 'projects' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Research Projects
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddProject(!showAddProject)}
                >
                  {showAddProject ? 'Cancel' : '+ Add New Project'}
                </button>
              </div>

              {showAddProject && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Project Information</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Project Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Investigators (PI & Co-PI)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newProject.investigators}
                        onChange={(e) => setNewProject({ ...newProject, investigators: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Department</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newProject.dept}
                        onChange={(e) => setNewProject({ ...newProject, dept: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Duration</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="2023 - 2025"
                        value={newProject.duration}
                        onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Status</label>
                      <select
                        className="admin-input"
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Proposed">Proposed</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Summary / Abstract</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={newProject.summary}
                      onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                    />
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddProject}>
                    Save Project
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 14 }}>
                {data.projects?.map((proj, idx) => (
                  <div key={proj.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '80%' }}
                        value={proj.title}
                        onChange={(e) => handleListFieldChange('projects', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('projects', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Investigators"
                        className="admin-input"
                        value={proj.investigators}
                        onChange={(e) => handleListFieldChange('projects', idx, 'investigators', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        className="admin-input"
                        value={proj.dept}
                        onChange={(e) => handleListFieldChange('projects', idx, 'dept', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        className="admin-input"
                        value={proj.duration}
                        onChange={(e) => handleListFieldChange('projects', idx, 'duration', e.target.value)}
                      />
                      <select
                        className="admin-input"
                        value={proj.status}
                        onChange={(e) => handleListFieldChange('projects', idx, 'status', e.target.value)}
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Summary..."
                      className="admin-input"
                      rows={2}
                      value={proj.summary}
                      onChange={(e) => handleListFieldChange('projects', idx, 'summary', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: PUBLICATIONS
              ======================================================== */}
          {activeTab === 'publications' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Publications & Research Papers
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddPublication(!showAddPublication)}
                >
                  {showAddPublication ? 'Cancel' : '+ Add New Publication'}
                </button>
              </div>

              {showAddPublication && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Publication Details</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Paper Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newPublication.title}
                      onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Authors</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Deshmukh P., Shinde M., Kulkarni A."
                      value={newPublication.authors}
                      onChange={(e) => setNewPublication({ ...newPublication, authors: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Journal Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newPublication.journal}
                        onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Volume & Issue</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Vol. 13, Issue 2"
                        value={newPublication.volume}
                        onChange={(e) => setNewPublication({ ...newPublication, volume: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Year</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="2024"
                        value={newPublication.year}
                        onChange={(e) => setNewPublication({ ...newPublication, year: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Indexing (Scopus / PubMed / UGC-CARE)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Scopus / UGC CARE"
                        value={newPublication.indexing}
                        onChange={(e) => setNewPublication({ ...newPublication, indexing: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">DOI / URL</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="10.15520/ijhrs.v13i2.812"
                        value={newPublication.doi}
                        onChange={(e) => setNewPublication({ ...newPublication, doi: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddPublication}>
                    Save Publication
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.publications?.map((pub, idx) => (
                  <div key={pub.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '85%' }}
                        value={pub.title}
                        onChange={(e) => handleListFieldChange('publications', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('publications', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Authors"
                        className="admin-input"
                        value={pub.authors}
                        onChange={(e) => handleListFieldChange('publications', idx, 'authors', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Journal"
                        className="admin-input"
                        value={pub.journal}
                        onChange={(e) => handleListFieldChange('publications', idx, 'journal', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        className="admin-input"
                        value={pub.year}
                        onChange={(e) => handleListFieldChange('publications', idx, 'year', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Volume / Issue"
                        className="admin-input"
                        value={pub.volume}
                        onChange={(e) => handleListFieldChange('publications', idx, 'volume', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Indexing (e.g. Scopus / PubMed)"
                        className="admin-input"
                        value={pub.indexing}
                        onChange={(e) => handleListFieldChange('publications', idx, 'indexing', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="DOI"
                        className="admin-input"
                        value={pub.doi}
                        onChange={(e) => handleListFieldChange('publications', idx, 'doi', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: PATENTS
              ======================================================== */}
          {activeTab === 'patents' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Patents & Innovations
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddPatent(!showAddPatent)}
                >
                  {showAddPatent ? 'Cancel' : '+ Add New Patent'}
                </button>
              </div>

              {showAddPatent && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Patent Entry</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Invention Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newPatent.title}
                      onChange={(e) => setNewPatent({ ...newPatent, title: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Application / Design No.</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newPatent.app_no}
                        onChange={(e) => setNewPatent({ ...newPatent, app_no: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Status</label>
                      <select
                        className="admin-input"
                        value={newPatent.status}
                        onChange={(e) => setNewPatent({ ...newPatent, status: e.target.value })}
                      >
                        <option value="Published">Published</option>
                        <option value="Registered / Granted">Registered / Granted</option>
                        <option value="Filed">Filed</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Filing Date</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="DD/MM/YYYY"
                        value={newPatent.filing_date}
                        onChange={(e) => setNewPatent({ ...newPatent, filing_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Inventors</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newPatent.inventors}
                        onChange={(e) => setNewPatent({ ...newPatent, inventors: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Patent Authority</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newPatent.authority}
                        onChange={(e) => setNewPatent({ ...newPatent, authority: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddPatent}>
                    Save Patent
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.patents?.map((pat, idx) => (
                  <div key={pat.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '85%' }}
                        value={pat.title}
                        onChange={(e) => handleListFieldChange('patents', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('patents', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Application No."
                        className="admin-input"
                        value={pat.app_no}
                        onChange={(e) => handleListFieldChange('patents', idx, 'app_no', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Inventors"
                        className="admin-input"
                        value={pat.inventors}
                        onChange={(e) => handleListFieldChange('patents', idx, 'inventors', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Filing Date"
                        className="admin-input"
                        value={pat.filing_date}
                        onChange={(e) => handleListFieldChange('patents', idx, 'filing_date', e.target.value)}
                      />
                      <select
                        className="admin-input"
                        value={pat.status}
                        onChange={(e) => handleListFieldChange('patents', idx, 'status', e.target.value)}
                      >
                        <option value="Published">Published</option>
                        <option value="Registered / Granted">Registered / Granted</option>
                        <option value="Filed">Filed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: RESEARCH SCHOLARS
              ======================================================== */}
          {activeTab === 'scholars' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Research Scholars & Fellows
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddScholar(!showAddScholar)}
                >
                  {showAddScholar ? 'Cancel' : '+ Add New Scholar'}
                </button>
              </div>

              {showAddScholar && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Scholar Entry</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Scholar Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newScholar.name}
                        onChange={(e) => setNewScholar({ ...newScholar, name: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Approved Research Guide</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newScholar.guide}
                        onChange={(e) => setNewScholar({ ...newScholar, guide: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Research Topic / Thesis Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newScholar.topic}
                      onChange={(e) => setNewScholar({ ...newScholar, topic: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Department</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newScholar.dept}
                        onChange={(e) => setNewScholar({ ...newScholar, dept: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Registration Year</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newScholar.reg_year}
                        onChange={(e) => setNewScholar({ ...newScholar, reg_year: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Current Status</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newScholar.status}
                        onChange={(e) => setNewScholar({ ...newScholar, status: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddScholar}>
                    Save Scholar
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.scholars?.map((sch, idx) => (
                  <div key={sch.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '40%' }}
                        value={sch.name}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'name', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('scholars', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Guide"
                        className="admin-input"
                        value={sch.guide}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'guide', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Thesis Topic"
                        className="admin-input"
                        value={sch.topic}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'topic', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Department"
                        className="admin-input"
                        value={sch.dept}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'dept', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Reg Year"
                        className="admin-input"
                        value={sch.reg_year}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'reg_year', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Status"
                        className="admin-input"
                        value={sch.status}
                        onChange={(e) => handleListFieldChange('scholars', idx, 'status', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: FUNDED PROJECTS
              ======================================================== */}
          {activeTab === 'funded_projects' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Funded Projects & Extramural Grants
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddFundedProject(!showAddFundedProject)}
                >
                  {showAddFundedProject ? 'Cancel' : '+ Add Funded Project'}
                </button>
              </div>

              {showAddFundedProject && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Funded Project</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Project Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newFundedProject.title}
                      onChange={(e) => setNewFundedProject({ ...newFundedProject, title: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Funding / Sponsoring Agency</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="MUHS / ICMR / Trust Fund"
                        value={newFundedProject.agency}
                        onChange={(e) => setNewFundedProject({ ...newFundedProject, agency: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Principal Investigator</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newFundedProject.pi}
                        onChange={(e) => setNewFundedProject({ ...newFundedProject, pi: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Sanctioned Amount</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="₹ 8,50,000"
                        value={newFundedProject.amount}
                        onChange={(e) => setNewFundedProject({ ...newFundedProject, amount: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Tenure</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="2023 - 2025"
                        value={newFundedProject.tenure}
                        onChange={(e) => setNewFundedProject({ ...newFundedProject, tenure: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Status</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Ongoing / Completed"
                        value={newFundedProject.status}
                        onChange={(e) => setNewFundedProject({ ...newFundedProject, status: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddFundedProject}>
                    Save Funded Project
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.funded_projects?.map((fp, idx) => (
                  <div key={fp.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '85%' }}
                        value={fp.title}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('funded_projects', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Agency"
                        className="admin-input"
                        value={fp.agency}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'agency', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="PI"
                        className="admin-input"
                        value={fp.pi}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'pi', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Amount"
                        className="admin-input"
                        value={fp.amount}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'amount', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Tenure"
                        className="admin-input"
                        value={fp.tenure}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'tenure', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Status"
                        className="admin-input"
                        value={fp.status}
                        onChange={(e) => handleListFieldChange('funded_projects', idx, 'status', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 8: CONFERENCES
              ======================================================== */}
          {activeTab === 'conferences' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Conferences & Scientific Presentations
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddConference(!showAddConference)}
                >
                  {showAddConference ? 'Cancel' : '+ Add Conference Entry'}
                </button>
              </div>

              {showAddConference && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Conference Presentation</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Conference Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newConference.title}
                      onChange={(e) => setNewConference({ ...newConference, title: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Paper / Presentation Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newConference.paper_title}
                      onChange={(e) => setNewConference({ ...newConference, paper_title: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Presenter</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newConference.presenter}
                        onChange={(e) => setNewConference({ ...newConference, presenter: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Date</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Jan 2024"
                        value={newConference.date}
                        onChange={(e) => setNewConference({ ...newConference, date: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Venue</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="City, State"
                        value={newConference.venue}
                        onChange={(e) => setNewConference({ ...newConference, venue: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Type</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Oral / Poster"
                        value={newConference.type}
                        onChange={(e) => setNewConference({ ...newConference, type: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddConference}>
                    Save Conference
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.conferences?.map((conf, idx) => (
                  <div key={conf.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '85%' }}
                        value={conf.title}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('conferences', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Paper Title"
                        className="admin-input"
                        value={conf.paper_title}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'paper_title', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Presenter"
                        className="admin-input"
                        value={conf.presenter}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'presenter', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        className="admin-input"
                        value={conf.date}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'date', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Venue"
                        className="admin-input"
                        value={conf.venue}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'venue', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Type (Oral / Poster)"
                        className="admin-input"
                        value={conf.type}
                        onChange={(e) => handleListFieldChange('conferences', idx, 'type', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 9: JOURNALS
              ======================================================== */}
          {activeTab === 'journals' && (
            <div className="admin-card">
              <h2 style={{ fontSize: 18, margin: '0 0 16px', color: 'var(--navy-header)' }}>
                Journals & Editorial Office
              </h2>

              <div className="admin-form-group">
                <label className="admin-label">Journal Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.journals?.name || ''}
                  onChange={(e) => handleJournalChange('name', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label className="admin-label">ISSN Reference</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.journals?.issn || ''}
                    onChange={(e) => handleJournalChange('issn', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Publication Frequency</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.journals?.frequency || ''}
                    onChange={(e) => handleJournalChange('frequency', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Peer-Review Model</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.journals?.peer_review || ''}
                    onChange={(e) => handleJournalChange('peer_review', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Journal Scope & Topics</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={data.journals?.scope || ''}
                  onChange={(e) => handleJournalChange('scope', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Author Submission Guidelines</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={data.journals?.guidelines || ''}
                  onChange={(e) => handleJournalChange('guidelines', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Submission Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  value={data.journals?.submission_email || ''}
                  onChange={(e) => handleJournalChange('submission_email', e.target.value)}
                />
              </div>

              {/* Editorial Board */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="admin-label" style={{ margin: 0 }}>Editorial Board Members</label>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: 12, padding: '4px 10px' }}
                    onClick={() => setShowAddEditorialMember(!showAddEditorialMember)}
                  >
                    {showAddEditorialMember ? 'Cancel' : '+ Add Board Member'}
                  </button>
                </div>

                {showAddEditorialMember && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 4, padding: 12, marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Role (e.g. Editor-in-Chief)"
                        className="admin-input"
                        value={newEditorialMember.role}
                        onChange={(e) => setNewEditorialMember({ ...newEditorialMember, role: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Name & Designation"
                        className="admin-input"
                        value={newEditorialMember.name}
                        onChange={(e) => setNewEditorialMember({ ...newEditorialMember, name: e.target.value })}
                      />
                    </div>
                    <button className="admin-btn admin-btn-primary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleAddEditorialMember}>
                      Add Member
                    </button>
                  </div>
                )}

                <div style={{ display: 'grid', gap: 8 }}>
                  {data.journals?.editorial_board?.map((member, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        style={{ width: '30%' }}
                        className="admin-input"
                        value={member.role}
                        onChange={(e) => handleEditorialBoardChange(idx, 'role', e.target.value)}
                      />
                      <input
                        type="text"
                        style={{ width: '65%' }}
                        className="admin-input"
                        value={member.name}
                        onChange={(e) => handleEditorialBoardChange(idx, 'name', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteEditorialMember(idx)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', padding: 4 }}
                        title="Remove member"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 10: RESEARCH ACHIEVEMENTS
              ======================================================== */}
          {activeTab === 'achievements' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  Research Achievements & Accolades
                </h2>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddAchievement(!showAddAchievement)}
                >
                  {showAddAchievement ? 'Cancel' : '+ Add Achievement'}
                </button>
              </div>

              {showAddAchievement && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 12px', color: 'var(--navy-header)' }}>New Research Achievement</h3>
                  <div className="admin-form-group">
                    <label className="admin-label">Award / Achievement Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Awardee / Recipient</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newAchievement.awardee}
                        onChange={(e) => setNewAchievement({ ...newAchievement, awardee: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Conferring Organization / Event</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newAchievement.event}
                        onChange={(e) => setNewAchievement({ ...newAchievement, event: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Year</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="2023"
                        value={newAchievement.year}
                        onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Details / Citation</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={newAchievement.details}
                      onChange={(e) => setNewAchievement({ ...newAchievement, details: e.target.value })}
                    />
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={handleAddAchievement}>
                    Save Achievement
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 12 }}>
                {data.achievements?.map((ach, idx) => (
                  <div key={ach.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '85%' }}
                        value={ach.title}
                        onChange={(e) => handleListFieldChange('achievements', idx, 'title', e.target.value)}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleDeleteListItem('achievements', idx)}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        placeholder="Recipient"
                        className="admin-input"
                        value={ach.awardee}
                        onChange={(e) => handleListFieldChange('achievements', idx, 'awardee', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Event / Conferred by"
                        className="admin-input"
                        value={ach.event}
                        onChange={(e) => handleListFieldChange('achievements', idx, 'event', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        className="admin-input"
                        value={ach.year}
                        onChange={(e) => handleListFieldChange('achievements', idx, 'year', e.target.value)}
                      />
                    </div>
                    <textarea
                      placeholder="Citation details..."
                      className="admin-input"
                      rows={2}
                      value={ach.details}
                      onChange={(e) => handleListFieldChange('achievements', idx, 'details', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
