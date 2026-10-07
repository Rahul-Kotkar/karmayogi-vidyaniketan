import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService, setCachedPlacementData } from '../../services/endpoints.js'
import { DEFAULT_PLACEMENT_DATA } from '../../data/collegeData.js'
import { resolveMediaUrl } from '../../utils/mediaUrl.js'
import defaultTpoPhoto from '../../assets/tpo_officer.jpg'

export default function AdminTrainingPlacement() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = (searchParams.get('tab') || 'highlights').replace(/-/g, '_').toLowerCase()

  // Map legacy tab keys to unified 7 sections
  const tabMapping = {
    cell_info: 'highlights',
    overview: 'highlights',
    highlights: 'highlights',
    logos: 'recruiters',
    recruiters: 'recruiters',
    recruiter_network: 'recruiters',
    statistics: 'yearly',
    stats: 'yearly',
    yearly: 'yearly',
    internships: 'yearly',
    outcomes: 'outcomes',
    process: 'prep',
    activities: 'prep',
    prep: 'prep',
    contact: 'officer',
    desk: 'officer',
    officer: 'officer',
    tpos_desk: 'officer',
    testimonials: 'testimonials'
  }

  const [activeTab, setActiveTab] = useState(tabMapping[rawTab] || 'highlights')

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams({ tab: newTab })
  }

  useEffect(() => {
    const param = searchParams.get('tab')
    if (param) {
      const mapped = tabMapping[param.replace(/-/g, '_').toLowerCase()]
      if (mapped && mapped !== activeTab) setActiveTab(mapped)
    }
  }, [searchParams])

  const [data, setData] = useState(() => DEFAULT_PLACEMENT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Draft & Modal states
  const [uploadingOfficerPhoto, setUploadingOfficerPhoto] = useState(false)

  // Recruiter modal state
  const [showRecruiterModal, setShowRecruiterModal] = useState(false)
  const [editingRecruiterIdx, setEditingRecruiterIdx] = useState(null)
  const [recruiterForm, setRecruiterForm] = useState({ name: '', category: '', initials: '' })
  const [recruiterFilter, setRecruiterFilter] = useState('')

  // Yearly Placements modal state
  const [showYearModal, setShowYearModal] = useState(false)
  const [editingYearIdx, setEditingYearIdx] = useState(null)
  const [yearForm, setYearForm] = useState({
    year: '',
    eligible: 60,
    placed: 50,
    ratio: '83.3%',
    highest: '₹ 8.40 LPA',
    average: '₹ 4.20 LPA',
    partners: ''
  })

  // Prep Step modal state
  const [showPrepModal, setShowPrepModal] = useState(false)
  const [editingPrepIdx, setEditingPrepIdx] = useState(null)
  const [prepForm, setPrepForm] = useState({ step: '', title: '', desc: '' })

  // Testimonial modal state
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState(null)
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    program: 'B.P.T',
    batch: '',
    packageAmt: '',
    company: '',
    designation: '',
    location: ''
  })
  const [testimonialFilter, setTestimonialFilter] = useState('all')

  // Load existing placement data from DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('training-placement')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              cell_info: {
                ...prev.cell_info,
                ...(parsed.cell_info || {}),
                top_stats: Array.isArray(parsed.cell_info?.top_stats) && parsed.cell_info.top_stats.length > 0
                  ? parsed.cell_info.top_stats
                  : prev.cell_info.top_stats
              },
              officer: { ...prev.officer, ...(parsed.officer || {}) },
              recruiter_network: Array.isArray(parsed.recruiter_network) && parsed.recruiter_network.length > 0
                ? parsed.recruiter_network
                : prev.recruiter_network,
              yearly_placements: Array.isArray(parsed.yearly_placements) && parsed.yearly_placements.length > 0
                ? parsed.yearly_placements
                : prev.yearly_placements,
              coursewise_outcomes: {
                ...prev.coursewise_outcomes,
                ...(parsed.coursewise_outcomes || {})
              },
              prep_program: Array.isArray(parsed.prep_program) && parsed.prep_program.length > 0
                ? parsed.prep_program
                : prev.prep_program,
              testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0
                ? parsed.testimonials
                : prev.testimonials
            }))
          } catch {}
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto-dismiss alert after 4s
  useEffect(() => {
    if (msg.text) {
      const t = setTimeout(() => setMsg({ text: '', type: '' }), 4000)
      return () => clearTimeout(t)
    }
  }, [msg])

  // Cell Info & Top Stats handlers
  const handleCellInfoChange = (field, val) => {
    setData(prev => ({
      ...prev,
      cell_info: { ...prev.cell_info, [field]: val }
    }))
  }

  const handleTopStatChange = (idx, field, val) => {
    setData(prev => {
      const list = [...(prev.cell_info?.top_stats || DEFAULT_PLACEMENT_DATA.cell_info.top_stats)]
      list[idx] = { ...list[idx], [field]: val }
      return {
        ...prev,
        cell_info: { ...prev.cell_info, top_stats: list }
      }
    })
  }

  // Officer change handler
  const handleOfficerChange = (field, val) => {
    setData(prev => ({
      ...prev,
      officer: { ...prev.officer, [field]: val }
    }))
  }

  // Officer Photo Upload
  const handleOfficerPhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingOfficerPhoto(true)
    try {
      const url = await uploadService.uploadFile(file, 'faculty')
      if (url) {
        handleOfficerChange('photo_url', url)
        setMsg({ text: 'Officer photo uploaded successfully!', type: 'success' })
      }
    } catch {
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploadingOfficerPhoto(false)
    }
  }

  // Recruiter Network Handlers
  const handleOpenAddRecruiter = () => {
    setEditingRecruiterIdx(null)
    setRecruiterForm({ name: '', category: 'Multi-Specialty Network', initials: '' })
    setShowRecruiterModal(true)
  }

  const handleOpenEditRecruiter = (idx) => {
    const item = (data.recruiter_network || [])[idx]
    if (!item) return
    setEditingRecruiterIdx(idx)
    setRecruiterForm({
      name: item.name || '',
      category: item.category || 'Multi-Specialty Network',
      initials: item.initials || ''
    })
    setShowRecruiterModal(true)
  }

  const handleSaveRecruiter = () => {
    if (!recruiterForm.name.trim()) {
      alert('Recruiter name is required')
      return
    }
    const computedInitials = recruiterForm.initials.trim() || recruiterForm.name
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase()

    const itemToSave = {
      name: recruiterForm.name.trim(),
      category: recruiterForm.category.trim() || 'Multi-Specialty Network',
      initials: computedInitials
    }

    setData(prev => {
      const list = [...(prev.recruiter_network || DEFAULT_PLACEMENT_DATA.recruiter_network)]
      if (editingRecruiterIdx !== null) {
        list[editingRecruiterIdx] = itemToSave
      } else {
        list.push(itemToSave)
      }
      return { ...prev, recruiter_network: list }
    })
    setShowRecruiterModal(false)
  }

  const handleDeleteRecruiter = (idx) => {
    if (!window.confirm('Are you sure you want to delete this recruiter partner?')) return
    setData(prev => {
      const list = [...(prev.recruiter_network || DEFAULT_PLACEMENT_DATA.recruiter_network)]
      list.splice(idx, 1)
      return { ...prev, recruiter_network: list }
    })
  }

  // Yearly Placements Handlers
  const handleOpenAddYear = () => {
    setEditingYearIdx(null)
    setYearForm({
      year: '',
      eligible: 60,
      placed: 50,
      ratio: '83.3%',
      highest: '₹ 8.40 LPA',
      average: '₹ 4.20 LPA',
      partners: ''
    })
    setShowYearModal(true)
  }

  const handleOpenEditYear = (idx) => {
    const item = (data.yearly_placements || [])[idx]
    if (!item) return
    setEditingYearIdx(idx)
    setYearForm({
      year: item.year || '',
      eligible: item.eligible || 60,
      placed: item.placed || 0,
      ratio: item.ratio || '',
      highest: item.highest || '',
      average: item.average || '',
      partners: Array.isArray(item.partners) ? item.partners.join(', ') : (item.partners || '')
    })
    setShowYearModal(true)
  }

  const handleSaveYear = () => {
    if (!yearForm.year.trim()) {
      alert('Academic Year (e.g. 2024-25) is required')
      return
    }
    const eligibleNum = parseInt(yearForm.eligible, 10) || 1
    const placedNum = parseInt(yearForm.placed, 10) || 0
    const calcRatio = eligibleNum > 0 ? `${((placedNum / eligibleNum) * 100).toFixed(1)}%` : '0%'
    const ratioNum = eligibleNum > 0 ? parseFloat(((placedNum / eligibleNum) * 100).toFixed(1)) : 0

    const partnersArr = yearForm.partners
      ? yearForm.partners.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const rowToSave = {
      year: yearForm.year.trim(),
      eligible: eligibleNum,
      placed: placedNum,
      ratio: yearForm.ratio.trim() || calcRatio,
      ratioNum: ratioNum,
      highest: yearForm.highest.trim() || '₹ 8.40 LPA',
      average: yearForm.average.trim() || '₹ 4.20 LPA',
      partners: partnersArr
    }

    setData(prev => {
      const list = [...(prev.yearly_placements || DEFAULT_PLACEMENT_DATA.yearly_placements)]
      if (editingYearIdx !== null) {
        list[editingYearIdx] = rowToSave
      } else {
        list.push(rowToSave)
      }
      return { ...prev, yearly_placements: list }
    })
    setShowYearModal(false)
  }

  const handleDeleteYear = (idx) => {
    if (!window.confirm('Delete this academic year placement record?')) return
    setData(prev => {
      const list = [...(prev.yearly_placements || DEFAULT_PLACEMENT_DATA.yearly_placements)]
      list.splice(idx, 1)
      return { ...prev, yearly_placements: list }
    })
  }

  // Course-wise outcomes handlers
  const handleOutcomeChange = (course, field, val) => {
    setData(prev => ({
      ...prev,
      coursewise_outcomes: {
        ...prev.coursewise_outcomes,
        [course]: {
          ...(prev.coursewise_outcomes?.[course] || DEFAULT_PLACEMENT_DATA.coursewise_outcomes[course]),
          [field]: val
        }
      }
    }))
  }

  // Prep Program Handlers
  const handleOpenAddPrep = () => {
    setEditingPrepIdx(null)
    const currentLen = (data.prep_program || []).length
    setPrepForm({
      step: `0${currentLen + 1}`,
      title: '',
      desc: ''
    })
    setShowPrepModal(true)
  }

  const handleOpenEditPrep = (idx) => {
    const item = (data.prep_program || [])[idx]
    if (!item) return
    setEditingPrepIdx(idx)
    setPrepForm({
      step: item.step || '',
      title: item.title || '',
      desc: item.desc || ''
    })
    setShowPrepModal(true)
  }

  const handleSavePrep = () => {
    if (!prepForm.title.trim()) {
      alert('Stage title is required')
      return
    }
    const itemToSave = {
      step: prepForm.step.trim() || '01',
      title: prepForm.title.trim(),
      desc: prepForm.desc.trim()
    }
    setData(prev => {
      const list = [...(prev.prep_program || DEFAULT_PLACEMENT_DATA.prep_program)]
      if (editingPrepIdx !== null) {
        list[editingPrepIdx] = itemToSave
      } else {
        list.push(itemToSave)
      }
      return { ...prev, prep_program: list }
    })
    setShowPrepModal(false)
  }

  const handleDeletePrep = (idx) => {
    if (!window.confirm('Delete this preparation stage?')) return
    setData(prev => {
      const list = [...(prev.prep_program || DEFAULT_PLACEMENT_DATA.prep_program)]
      list.splice(idx, 1)
      return { ...prev, prep_program: list }
    })
  }

  // Testimonial Handlers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonialIdx(null)
    setTestimonialForm({
      name: '',
      program: 'B.P.T',
      batch: 'Batch 2023-24',
      packageAmt: '₹ 8.40 LPA',
      company: '',
      designation: '',
      location: ''
    })
    setShowTestimonialModal(true)
  }

  const handleOpenEditTestimonial = (idx) => {
    const item = (data.testimonials || [])[idx]
    if (!item) return
    setEditingTestimonialIdx(idx)
    setTestimonialForm({
      name: item.name || '',
      program: item.program || 'B.P.T',
      batch: item.batch || '',
      packageAmt: item.packageAmt || '',
      company: item.company || '',
      designation: item.designation || '',
      location: item.location || ''
    })
    setShowTestimonialModal(true)
  }

  const handleSaveTestimonial = () => {
    if (!testimonialForm.name.trim()) {
      alert('Student / Alum name is required')
      return
    }
    const itemToSave = {
      name: testimonialForm.name.trim(),
      program: testimonialForm.program || 'B.P.T',
      batch: testimonialForm.batch.trim() || 'Batch 2023-24',
      packageAmt: testimonialForm.packageAmt.trim() || '₹ 4.20 LPA',
      company: testimonialForm.company.trim(),
      designation: testimonialForm.designation.trim(),
      location: testimonialForm.location.trim()
    }
    setData(prev => {
      const list = [...(prev.testimonials || DEFAULT_PLACEMENT_DATA.testimonials)]
      if (editingTestimonialIdx !== null) {
        list[editingTestimonialIdx] = itemToSave
      } else {
        list.push(itemToSave)
      }
      return { ...prev, testimonials: list }
    })
    setShowTestimonialModal(false)
  }

  const handleDeleteTestimonial = (idx) => {
    if (!window.confirm('Delete this testimonial record?')) return
    setData(prev => {
      const list = [...(prev.testimonials || DEFAULT_PLACEMENT_DATA.testimonials)]
      list.splice(idx, 1)
      return { ...prev, testimonials: list }
    })
  }

  // Global Save Handler
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'training-placement',
        title: data.cell_info?.intro_title || 'Training & Placement Cell',
        content_html: JSON.stringify(data),
        excerpt: (data.cell_info?.intro_lead || 'Training and Placement Cell').slice(0, 160)
      })

      // Update client-side prehydration cache
      setCachedPlacementData(data)

      setMsg({ text: 'All Training & Placement content saved successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save: ' + (err.message || 'Error occurred'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Filtered lists
  const filteredRecruiters = (data.recruiter_network || DEFAULT_PLACEMENT_DATA.recruiter_network).filter(item => {
    if (!recruiterFilter) return true
    const q = recruiterFilter.toLowerCase()
    return (item.name || '').toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q)
  })

  const filteredTestimonialsList = (data.testimonials || DEFAULT_PLACEMENT_DATA.testimonials).filter(item => {
    if (testimonialFilter === 'all') return true
    return (item.program || '').toLowerCase() === testimonialFilter.toLowerCase()
  })

  return (
    <div>
      {/* Standard Admin Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Training & Placement Management
            <span className="admin-page-badge">Satthacop Single-Page Sync</span>
          </h1>
          <p>
            Configure top highlights, recruiter network wall, academic year placement statistics, course outcomes, preparation stages, TPO desk, and alumni testimonials.
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
            {saving ? 'Saving Changes...' : 'Save All Placement Changes'}
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
          Loading placement data...
        </div>
      ) : (
        <div>
          {/* Sub Navigation Tabs */}
          <div className="admin-tabs" style={{ marginBottom: 20 }}>
            <button
              className={`admin-tab-btn ${activeTab === 'highlights' ? 'active' : ''}`}
              onClick={() => handleTabChange('highlights')}
            >
              1. Highlights & Top Stats
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'recruiters' ? 'active' : ''}`}
              onClick={() => handleTabChange('recruiters')}
            >
              2. Recruiter Network
              <span className="admin-tab-count">{(data.recruiter_network || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'yearly' ? 'active' : ''}`}
              onClick={() => handleTabChange('yearly')}
            >
              3. Year-Wise Placements
              <span className="admin-tab-count">{(data.yearly_placements || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'outcomes' ? 'active' : ''}`}
              onClick={() => handleTabChange('outcomes')}
            >
              4. Course-Wise Outcomes
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'prep' ? 'active' : ''}`}
              onClick={() => handleTabChange('prep')}
            >
              5. Prep Program (Stages)
              <span className="admin-tab-count">{(data.prep_program || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'officer' ? 'active' : ''}`}
              onClick={() => handleTabChange('officer')}
            >
              6. TPO's Desk
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => handleTabChange('testimonials')}
            >
              7. Student Success Stories
              <span className="admin-tab-count">{(data.testimonials || []).length}</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: HIGHLIGHTS & TOP STATS
              ======================================================== */}
          {activeTab === 'highlights' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Section 1: Placement Highlights & Top 4 Stats</h3>
                  <p className="admin-card-subtitle">Configure the headline title, introduction paragraph, and top 4 statistic metrics.</p>
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div className="admin-form-grid" style={{ marginBottom: 20 }}>
                  <div className="admin-form-group full-width">
                    <label>Section Header Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.cell_info?.intro_title || ''}
                      onChange={(e) => handleCellInfoChange('intro_title', e.target.value)}
                      placeholder="Connecting Talent with Healthcare Leaders"
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Section Description / Subtitle</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={data.cell_info?.intro_lead || ''}
                      onChange={(e) => handleCellInfoChange('intro_lead', e.target.value)}
                      placeholder="Our active Training and Placement Cell conducts mock clinical interviews..."
                    />
                  </div>
                </div>

                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0b2545', margin: '20px 0 12px' }}>
                  Top 4 Placement Key Metric Cards
                </h4>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
                  These 4 values appear directly below the main title on the website (e.g. ₹ 8.40 LPA, ₹ 4.20 LPA, 45+, 100%).
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {(data.cell_info?.top_stats || DEFAULT_PLACEMENT_DATA.cell_info.top_stats).map((stat, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 14,
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#00458b', textTransform: 'uppercase', marginBottom: 8 }}>
                        Metric #{idx + 1}
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 12 }}>Value / Number</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={stat.value || ''}
                          onChange={(e) => handleTopStatChange(idx, 'value', e.target.value)}
                          placeholder="e.g. ₹ 8.40 LPA"
                          style={{ fontWeight: 700 }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: 12 }}>Label Text</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={stat.label || ''}
                          onChange={(e) => handleTopStatChange(idx, 'label', e.target.value)}
                          placeholder="e.g. Highest Package"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: RECRUITER NETWORK
              ======================================================== */}
          {activeTab === 'recruiters' && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="admin-card-title">Section 2: Premier Recruiter Network</h3>
                  <p className="admin-card-subtitle">Manage hospital and recruiter partner cards displayed on the interactive brick wall.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAddRecruiter}
                >
                  + Add Recruiter Partner
                </button>
              </div>

              <div style={{ padding: 20 }}>
                {/* Filter Bar */}
                <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Search recruiter by hospital name or specialty..."
                    value={recruiterFilter}
                    onChange={(e) => setRecruiterFilter(e.target.value)}
                    style={{ maxWidth: 360 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {filteredRecruiters.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: 14,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: '#eff6ff',
                            color: '#073b73',
                            fontWeight: 800,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{item.name}</div>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>{item.category}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="admin-btn admin-btn-outline admin-btn-xs"
                          onClick={() => handleOpenEditRecruiter(idx)}
                          title="Edit Partner"
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteRecruiter(idx)}
                          title="Delete Partner"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: YEAR-WISE PLACEMENTS
              ======================================================== */}
          {activeTab === 'yearly' && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="admin-card-title">Section 3: Students Placed per Academic Year</h3>
                  <p className="admin-card-subtitle">Annual placement breakdown shown in desktop table and mobile expandable accordion cards.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAddYear}
                >
                  + Add Academic Year
                </button>
              </div>

              <div style={{ padding: 20 }}>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Academic Year</th>
                        <th style={{ textAlign: 'center' }}>Eligible</th>
                        <th style={{ textAlign: 'center' }}>Placed</th>
                        <th style={{ textAlign: 'center' }}>Success Rate</th>
                        <th>Highest CTC</th>
                        <th>Average CTC</th>
                        <th>Key Hiring Partners</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.yearly_placements || DEFAULT_PLACEMENT_DATA.yearly_placements).map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, color: '#073b73' }}>{row.year}</td>
                          <td style={{ textAlign: 'center' }}>{row.eligible}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontSize: 12 }}>
                              {row.placed}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.ratio}</td>
                          <td style={{ fontWeight: 700, color: '#073b73' }}>{row.highest}</td>
                          <td style={{ fontWeight: 600 }}>{row.average}</td>
                          <td style={{ fontSize: 12, color: '#475569', maxWidth: 220 }}>
                            {Array.isArray(row.partners) ? row.partners.join(', ') : row.partners}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="admin-btn admin-btn-outline admin-btn-xs"
                              onClick={() => handleOpenEditYear(idx)}
                              style={{ marginRight: 6 }}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-xs"
                              onClick={() => handleDeleteYear(idx)}
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
            </div>
          )}

          {/* ========================================================
              TAB 4: COURSE-WISE OUTCOMES
              ======================================================== */}
          {activeTab === 'outcomes' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Section 4: Course-Wise Graduate Outcomes</h3>
                  <p className="admin-card-subtitle">Set career outcome percentages and descriptions for undergraduate BPT and postgraduate MPT.</p>
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
                  {/* B.P.T Card */}
                  <div style={{ border: '1px solid #bfdbfe', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#1d4ed8', background: '#eff6ff', padding: '3px 8px', borderRadius: 999, border: '1px solid #bfdbfe' }}>
                        Undergraduate
                      </span>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#05162e' }}>B.P.T (Bachelor of Physiotherapy)</h4>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Duration / Program Lead</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.coursewise_outcomes?.bpt?.duration || ''}
                        onChange={(e) => handleOutcomeChange('bpt', 'duration', e.target.value)}
                        placeholder="4.5 Years Degree (Incl. 6 Months Internship)"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Campus & Hospital Placed (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.bpt?.placed_pct ?? 76}
                        onChange={(e) => handleOutcomeChange('bpt', 'placed_pct', parseInt(e.target.value, 10))}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Higher Studies (MPT / Fellowships) (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.bpt?.higher_studies_pct ?? 18}
                        onChange={(e) => handleOutcomeChange('bpt', 'higher_studies_pct', parseInt(e.target.value, 10))}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Clinical Private Practice & Rehab (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.bpt?.private_practice_pct ?? 6}
                        onChange={(e) => handleOutcomeChange('bpt', 'private_practice_pct', parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>

                  {/* M.P.T Card */}
                  <div style={{ border: '1px solid #ddd6fe', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed', background: '#f5f3ff', padding: '3px 8px', borderRadius: 999, border: '1px solid #ddd6fe' }}>
                        Postgraduate
                      </span>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#05162e' }}>M.P.T (Master of Physiotherapy)</h4>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Duration / Program Lead</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={data.coursewise_outcomes?.mpt?.duration || ''}
                        onChange={(e) => handleOutcomeChange('mpt', 'duration', e.target.value)}
                        placeholder="2 Years Specialized Clinical Masters"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Super-Specialty Hospital Placed (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.mpt?.placed_pct ?? 82}
                        onChange={(e) => handleOutcomeChange('mpt', 'placed_pct', parseInt(e.target.value, 10))}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Clinical Academia & Doctoral (Ph.D) (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.mpt?.higher_studies_pct ?? 12}
                        onChange={(e) => handleOutcomeChange('mpt', 'higher_studies_pct', parseInt(e.target.value, 10))}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label>Specialized Consultancies & Clinics (%)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={data.coursewise_outcomes?.mpt?.private_practice_pct ?? 6}
                        onChange={(e) => handleOutcomeChange('mpt', 'private_practice_pct', parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: PREP PROGRAM (STAGES)
              ======================================================== */}
          {activeTab === 'prep' && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="admin-card-title">Section 5: Placement Preparation Program</h3>
                  <p className="admin-card-subtitle">Manage preparation steps / stages (e.g. 01 Clinical Assessment, 02 Specialized Workshops, etc.).</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAddPrep}
                >
                  + Add Preparation Stage
                </button>
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  {(data.prep_program || DEFAULT_PLACEMENT_DATA.prep_program).map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: 16,
                        background: '#ffffff',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 900,
                            color: '#073b73',
                            background: '#eff6ff',
                            padding: '4px 10px',
                            borderRadius: 8,
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {step.step}
                        </span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="admin-btn admin-btn-outline admin-btn-xs"
                            onClick={() => handleOpenEditPrep(idx)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-xs"
                            onClick={() => handleDeletePrep(idx)}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <h4 style={{ margin: '12px 0 6px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        {step.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: TPO'S DESK
              ======================================================== */}
          {activeTab === 'officer' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Section 6: TPO's Desk</h3>
                  <p className="admin-card-subtitle">Manage portrait photo, name, badge title, message paragraphs, quote, and contact info.</p>
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div className="admin-form-grid">
                  {/* Photo Upload Card */}
                  <div className="admin-form-group full-width" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, background: '#f8fafc' }}>
                    <label style={{ fontSize: 14, fontWeight: 700 }}>Officer Portrait Photo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
                      <div style={{ width: 80, height: 100, borderRadius: 8, overflow: 'hidden', border: '2px solid #cbd5e1', background: '#05162e', flexShrink: 0 }}>
                        <img
                          src={data.officer?.photo_url ? resolveMediaUrl(data.officer.photo_url) : defaultTpoPhoto}
                          alt="TPO Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = defaultTpoPhoto
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleOfficerPhotoUpload}
                          disabled={uploadingOfficerPhoto}
                          style={{ marginBottom: 8 }}
                        />
                        {uploadingOfficerPhoto && <div style={{ fontSize: 12, color: '#0284c7' }}>Uploading photo...</div>}
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Or enter direct photo URL..."
                          value={data.officer?.photo_url || ''}
                          onChange={(e) => handleOfficerChange('photo_url', e.target.value)}
                          style={{ fontSize: 13 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Officer Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.name || ''}
                      onChange={(e) => handleOfficerChange('name', e.target.value)}
                      placeholder="Dr. Nitin More"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Short Role Badge (Portrait Card Overlay)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.designation_short || ''}
                      onChange={(e) => handleOfficerChange('designation_short', e.target.value)}
                      placeholder="Training and Placement Officer (Ph.D)"
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Full Academic Designation & Qualification</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.designation || ''}
                      onChange={(e) => handleOfficerChange('designation', e.target.value)}
                      placeholder="Training & Placement Officer (TPO) & Associate Professor"
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>TPO's Full Message (Separate paragraphs with double newlines)</label>
                    <textarea
                      rows={8}
                      className="admin-textarea"
                      value={data.officer?.message || ''}
                      onChange={(e) => handleOfficerChange('message', e.target.value)}
                      placeholder="Write the message from the placement officer..."
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Highlight Motivational Quote</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.quote || ''}
                      onChange={(e) => handleOfficerChange('quote', e.target.value)}
                      placeholder="Empowering Healthcare Leaders Today for a Successful Physiotherapy Career Tomorrow."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={data.officer?.email || ''}
                      onChange={(e) => handleOfficerChange('email', e.target.value)}
                      placeholder="placement@karmayogi.org.in"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.phone || ''}
                      onChange={(e) => handleOfficerChange('phone', e.target.value)}
                      placeholder="+91 02186 272347 / +91 98600 11223"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Office Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.office || ''}
                      onChange={(e) => handleOfficerChange('office', e.target.value)}
                      placeholder="T&P Cell, Room No. 104, Administrative Wing"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>LinkedIn Profile Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.officer?.linkedin || ''}
                      onChange={(e) => handleOfficerChange('linkedin', e.target.value)}
                      placeholder="https://www.linkedin.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: STUDENT SUCCESS STORIES
              ======================================================== */}
          {activeTab === 'testimonials' && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="admin-card-title">Section 7: Student Placement Testimonials</h3>
                  <p className="admin-card-subtitle">Manage alumni placement stories, salary packages, hospital roles, and locations.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAddTestimonial}
                >
                  + Add Success Story
                </button>
              </div>

              <div style={{ padding: 20 }}>
                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {['all', 'B.P.T', 'M.P.T'].map(prog => (
                    <button
                      key={prog}
                      className={`admin-btn ${testimonialFilter === prog ? 'admin-btn-primary' : 'admin-btn-outline'} admin-btn-xs`}
                      onClick={() => setTestimonialFilter(prog)}
                    >
                      {prog === 'all' ? `All (${(data.testimonials || []).length})` : prog}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                  {filteredTestimonialsList.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: 16,
                        background: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{t.name}</h4>
                          <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', gap: 6 }}>
                            <span style={{ fontWeight: 700, color: t.program === 'M.P.T' ? '#7c3aed' : '#2563eb' }}>{t.program}</span>
                            <span>•</span>
                            <span>{t.batch}</span>
                          </div>
                        </div>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#073b73',
                            border: '1px solid #a7f3d0',
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontWeight: 800,
                            fontSize: 12
                          }}
                        >
                          {t.packageAmt}
                        </span>
                      </div>

                      <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.5, color: '#334155' }}>
                        <div><strong>Hospital:</strong> {t.company}</div>
                        <div><strong>Role:</strong> <span style={{ color: '#00458b', fontWeight: 600 }}>{t.designation}</span></div>
                        <div><strong>Location:</strong> {t.location}</div>
                      </div>

                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          className="admin-btn admin-btn-outline admin-btn-xs"
                          onClick={() => handleOpenEditTestimonial(idx)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteTestimonial(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT RECRUITER PARTNER
          ======================================================== */}
      {showRecruiterModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 460 }}>
            <div className="admin-modal-header">
              <h3>{editingRecruiterIdx !== null ? 'Edit Recruiter Partner' : 'Add Recruiter Partner'}</h3>
              <button className="admin-modal-close" onClick={() => setShowRecruiterModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Hospital / Healthcare Recruiter Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={recruiterForm.name}
                  onChange={(e) => setRecruiterForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Apollo Hospitals"
                  autoFocus
                />
              </div>
              <div className="admin-form-group">
                <label>Category / Specialization Tag</label>
                <input
                  type="text"
                  className="admin-input"
                  value={recruiterForm.category}
                  onChange={(e) => setRecruiterForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. Multi-Specialty Network"
                />
              </div>
              <div className="admin-form-group">
                <label>Initials Badge (e.g. AH) - Optional</label>
                <input
                  type="text"
                  className="admin-input"
                  maxLength={4}
                  value={recruiterForm.initials}
                  onChange={(e) => setRecruiterForm(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                  placeholder="Auto-generated if left blank"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setShowRecruiterModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSaveRecruiter}>Save Partner</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT ACADEMIC YEAR
          ======================================================== */}
      {showYearModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <h3>{editingYearIdx !== null ? 'Edit Academic Year Placement' : 'Add Academic Year Placement'}</h3>
              <button className="admin-modal-close" onClick={() => setShowYearModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Academic Year (e.g. 2024-25) *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={yearForm.year}
                  onChange={(e) => setYearForm(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2024-25"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Eligible Students</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={yearForm.eligible}
                    onChange={(e) => setYearForm(prev => ({ ...prev, eligible: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Students Placed</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={yearForm.placed}
                    onChange={(e) => setYearForm(prev => ({ ...prev, placed: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Highest CTC</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={yearForm.highest}
                    onChange={(e) => setYearForm(prev => ({ ...prev, highest: e.target.value }))}
                    placeholder="₹ 8.40 LPA"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Average CTC</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={yearForm.average}
                    onChange={(e) => setYearForm(prev => ({ ...prev, average: e.target.value }))}
                    placeholder="₹ 4.20 LPA"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Placement Ratio (Leave blank to calculate)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={yearForm.ratio}
                  onChange={(e) => setYearForm(prev => ({ ...prev, ratio: e.target.value }))}
                  placeholder="e.g. 88.3%"
                />
              </div>
              <div className="admin-form-group">
                <label>Key Hiring Partners (Comma Separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={yearForm.partners}
                  onChange={(e) => setYearForm(prev => ({ ...prev, partners: e.target.value }))}
                  placeholder="Apollo Hospitals, Fortis, Sancheti, Ruby Hall Clinic"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setShowYearModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSaveYear}>Save Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT PREP STEP
          ======================================================== */}
      {showPrepModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 460 }}>
            <div className="admin-modal-header">
              <h3>{editingPrepIdx !== null ? 'Edit Preparation Stage' : 'Add Preparation Stage'}</h3>
              <button className="admin-modal-close" onClick={() => setShowPrepModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Stage Step (e.g. 01, 02)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={prepForm.step}
                  onChange={(e) => setPrepForm(prev => ({ ...prev, step: e.target.value }))}
                  placeholder="01"
                />
              </div>
              <div className="admin-form-group">
                <label>Stage Title *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={prepForm.title}
                  onChange={(e) => setPrepForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Clinical Assessment"
                />
              </div>
              <div className="admin-form-group">
                <label>Stage Description</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={prepForm.desc}
                  onChange={(e) => setPrepForm(prev => ({ ...prev, desc: e.target.value }))}
                  placeholder="Evaluating clinical acumen and bedside foundations..."
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setShowPrepModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSavePrep}>Save Stage</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT STUDENT TESTIMONIAL
          ======================================================== */}
      {showTestimonialModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3>{editingTestimonialIdx !== null ? 'Edit Testimonial' : 'Add Student Testimonial'}</h3>
              <button className="admin-modal-close" onClick={() => setShowTestimonialModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Student / Alum Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dr. Priya Deshmukh"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Program</label>
                  <select
                    className="admin-select"
                    value={testimonialForm.program}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, program: e.target.value }))}
                  >
                    <option value="B.P.T">B.P.T</option>
                    <option value="M.P.T">M.P.T</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={testimonialForm.batch}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, batch: e.target.value }))}
                    placeholder="Batch 2023-24"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Package CTC Offered</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testimonialForm.packageAmt}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, packageAmt: e.target.value }))}
                  placeholder="e.g. ₹ 8.40 LPA"
                />
              </div>
              <div className="admin-form-group">
                <label>Hospital / Healthcare Organization</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Apollo Super-Specialty Hospitals"
                />
              </div>
              <div className="admin-form-group">
                <label>Designation / Role</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testimonialForm.designation}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Clinical Musculoskeletal Specialist"
                />
              </div>
              <div className="admin-form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="admin-input"
                  value={testimonialForm.location}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Pune, Maharashtra"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setShowTestimonialModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSaveTestimonial}>Save Story</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
