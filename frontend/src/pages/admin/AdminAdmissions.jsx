import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { admissionsService, pagesService, coursesService, uploadService } from '../../services/endpoints.js'
import {
  DEFAULT_ADMISSIONS_DATA,
  COURSES as FALLBACK_COURSES,
  createDefaultCourseAdmission,
  getCourseAdmissionData
} from '../../data/collegeData.js'

export default function AdminAdmissions() {
  const [activeTab, setActiveTab] = useState('fees')
  const [data, setData] = useState(DEFAULT_ADMISSIONS_DATA)
  const [courses, setCourses] = useState([])
  const [activeCourses, setActiveCourses] = useState([])
  const [selectedCourseKey, setSelectedCourseKey] = useState('bpt')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // State for new fee row draft
  const [newFeeRow, setNewFeeRow] = useState({
    category: '',
    tuition_fee: '',
    dev_fee: '',
    total_fee: '',
    scholarship: '',
    payable: ''
  })
  const [showAddFeeRow, setShowAddFeeRow] = useState(false)

  // State for new step draft
  const [newStep, setNewStep] = useState({ title: '', desc: '' })
  const [showAddStep, setShowAddStep] = useState(false)

  // State for new scholarship draft
  const [newScholarship, setNewScholarship] = useState({ title: '', desc: '' })
  const [showAddScholarship, setShowAddScholarship] = useState(false)

  // State for new date draft
  const [newDate, setNewDate] = useState({ title: '', desc: '' })
  const [showAddDate, setShowAddDate] = useState(false)

  // State for new eligibility point draft
  const [newEligPoint, setNewEligPoint] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // 1. Fetch live courses
        let loadedCourses = []
        try {
          const cRes = await coursesService.getAll()
          if (Array.isArray(cRes) && cRes.length > 0) {
            loadedCourses = cRes
          } else {
            loadedCourses = FALLBACK_COURSES
          }
        } catch {
          loadedCourses = FALLBACK_COURSES
        }
        setCourses(loadedCourses)

        const active = loadedCourses.filter(c => c.status !== 'Inactive')
        const effectiveActive = active.length > 0 ? active : FALLBACK_COURSES
        setActiveCourses(effectiveActive)

        const firstKey = (effectiveActive[0].code || effectiveActive[0].id || 'bpt').toLowerCase()
        setSelectedCourseKey(firstKey)

        // 2. Fetch CMS page admissions
        const page = await pagesService.getBySlug('admissions')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            const initialMap = parsed.courses_admissions || {}
            const populatedMap = { ...initialMap }

            effectiveActive.forEach(c => {
              const cKey = (c.code || c.id || '').toLowerCase()
              if (!populatedMap[cKey]) {
                populatedMap[cKey] = getCourseAdmissionData(parsed, c)
              }
            })

            setData(prev => ({
              ...prev,
              ...parsed,
              courses_admissions: populatedMap,
              documents_categories:
                Array.isArray(parsed.documents_categories) && parsed.documents_categories.length > 0
                  ? parsed.documents_categories
                  : prev.documents_categories
            }))
          } catch {
            const populatedMap = {}
            effectiveActive.forEach(c => {
              const cKey = (c.code || c.id || '').toLowerCase()
              populatedMap[cKey] = createDefaultCourseAdmission(c)
            })
            setData(prev => ({ ...prev, courses_admissions: populatedMap }))
          }
        } else {
          const populatedMap = {}
          effectiveActive.forEach(c => {
            const cKey = (c.code || c.id || '').toLowerCase()
            populatedMap[cKey] = createDefaultCourseAdmission(c)
          })
          setData(prev => ({ ...prev, courses_admissions: populatedMap }))
        }
      } catch {
        // Retain initial defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Resolve current active course and its specific admission data
  const currentCourse =
    activeCourses.find(c => (c.code || c.id || '').toLowerCase() === selectedCourseKey) ||
    activeCourses[0] || { id: 'bpt', code: 'BPT', name: 'Bachelor of Physiotherapy (BPT)' }

  const currentCourseData =
    data.courses_admissions?.[selectedCourseKey] || createDefaultCourseAdmission(currentCourse)

  // Update current course admission data and mirror primary to legacy keys
  const updateCurrentCourseData = (updater) => {
    setData(prev => {
      const prevCourse = prev.courses_admissions?.[selectedCourseKey] || createDefaultCourseAdmission(currentCourse)
      const updated = typeof updater === 'function' ? updater(prevCourse) : { ...prevCourse, ...updater }
      const newCoursesMap = {
        ...(prev.courses_admissions || {}),
        [selectedCourseKey]: updated
      }

      const isPrimary = (activeCourses[0]?.code || activeCourses[0]?.id || '').toLowerCase() === selectedCourseKey
      return {
        ...prev,
        courses_admissions: newCoursesMap,
        ...(isPrimary
          ? {
              fees_table: updated.fees_table,
              fees_intro: updated.fees_intro,
              fees_notes: updated.fees_notes,
              process_steps: updated.process_steps,
              process_intro: updated.process_intro,
              app_form_intro: updated.app_form_intro,
              app_cap_title: updated.app_cap_title,
              app_cap_points: updated.app_cap_points,
              app_college_title: updated.app_college_title,
              app_college_points: updated.app_college_points,
              scholarships_intro: updated.scholarships_intro,
              scholarships_list: updated.scholarships_list,
              dates_intro: updated.dates_intro,
              dates_list: updated.dates_list,
              eligibility_intro: updated.eligibility_intro,
              eligibility_programs: activeCourses.map(c => {
                const cd = newCoursesMap[(c.code || c.id || '').toLowerCase()] || createDefaultCourseAdmission(c)
                return {
                  degree: cd.course_name,
                  duration: cd.duration,
                  points: cd.eligibility_points
                }
              })
            }
          : {})
      }
    })
  }

  const handleGeneralChange = (field, val) => {
    setData(prev => ({ ...prev, [field]: val }))
  }

  // --- Fee Table Handlers ---
  const handleFeeRowChange = (index, field, val) => {
    updateCurrentCourseData(c => {
      const rows = [...(c.fees_table || [])]
      rows[index] = { ...rows[index], [field]: val }
      return { ...c, fees_table: rows }
    })
  }

  const handleAddFeeRow = () => {
    if (!newFeeRow.category.trim()) return
    updateCurrentCourseData(c => ({
      ...c,
      fees_table: [...(c.fees_table || []), newFeeRow]
    }))
    setNewFeeRow({ category: '', tuition_fee: '', dev_fee: '', total_fee: '', scholarship: '', payable: '' })
    setShowAddFeeRow(false)
  }

  const handleDeleteFeeRow = (index) => {
    updateCurrentCourseData(c => ({
      ...c,
      fees_table: (c.fees_table || []).filter((_, i) => i !== index)
    }))
  }

  const handleAppFormUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'admissions')
      updateCurrentCourseData({ app_form_download_url: url })
      setMsg({ text: 'Application form document uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Upload failed', type: 'danger' })
    } finally {
      setUploadingPdf(false)
    }
  }

  // --- Process Steps Handlers ---
  const handleStepChange = (index, field, val) => {
    updateCurrentCourseData(c => {
      const steps = [...(c.process_steps || [])]
      steps[index] = { ...steps[index], [field]: val }
      return { ...c, process_steps: steps }
    })
  }

  const handleAddStep = () => {
    if (!newStep.title.trim()) return
    updateCurrentCourseData(c => {
      const steps = c.process_steps || []
      const nextNum = `Step ${steps.length + 1}`
      return {
        ...c,
        process_steps: [...steps, { num: nextNum, title: newStep.title, desc: newStep.desc }]
      }
    })
    setNewStep({ title: '', desc: '' })
    setShowAddStep(false)
  }

  const handleDeleteStep = (index) => {
    updateCurrentCourseData(c => ({
      ...c,
      process_steps: (c.process_steps || []).filter((_, i) => i !== index)
    }))
  }

  // --- Eligibility Handlers ---
  const handleEligibilityPointChange = (index, val) => {
    updateCurrentCourseData(c => {
      const pts = [...(c.eligibility_points || [])]
      pts[index] = val
      return { ...c, eligibility_points: pts }
    })
  }

  const handleAddEligibilityPoint = () => {
    if (!newEligPoint.trim()) return
    updateCurrentCourseData(c => ({
      ...c,
      eligibility_points: [...(c.eligibility_points || []), newEligPoint.trim()]
    }))
    setNewEligPoint('')
  }

  const handleDeleteEligibilityPoint = (index) => {
    updateCurrentCourseData(c => ({
      ...c,
      eligibility_points: (c.eligibility_points || []).filter((_, i) => i !== index)
    }))
  }

  // --- Scholarship Handlers ---
  const handleScholarshipChange = (index, field, val) => {
    updateCurrentCourseData(c => {
      const list = [...(c.scholarships_list || [])]
      list[index] = { ...list[index], [field]: val }
      return { ...c, scholarships_list: list }
    })
  }

  const handleAddScholarship = () => {
    if (!newScholarship.title.trim()) return
    updateCurrentCourseData(c => ({
      ...c,
      scholarships_list: [...(c.scholarships_list || []), newScholarship]
    }))
    setNewScholarship({ title: '', desc: '' })
    setShowAddScholarship(false)
  }

  const handleDeleteScholarship = (index) => {
    updateCurrentCourseData(c => ({
      ...c,
      scholarships_list: (c.scholarships_list || []).filter((_, i) => i !== index)
    }))
  }

  // --- Dates Handlers ---
  const handleDateChange = (index, field, val) => {
    updateCurrentCourseData(c => {
      const list = [...(c.dates_list || [])]
      list[index] = { ...list[index], [field]: val }
      return { ...c, dates_list: list }
    })
  }

  const handleAddDate = () => {
    if (!newDate.title.trim()) return
    updateCurrentCourseData(c => ({
      ...c,
      dates_list: [...(c.dates_list || []), newDate]
    }))
    setNewDate({ title: '', desc: '' })
    setShowAddDate(false)
  }

  const handleDeleteDate = (index) => {
    updateCurrentCourseData(c => ({
      ...c,
      dates_list: (c.dates_list || []).filter((_, i) => i !== index)
    }))
  }

  // --- Global Save ---
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      // 1. Ensure all active courses are completely indexed in courses_admissions
      const completeMap = { ...(data.courses_admissions || {}) }
      activeCourses.forEach(c => {
        const cKey = (c.code || c.id || '').toLowerCase()
        if (!completeMap[cKey]) {
          completeMap[cKey] = createDefaultCourseAdmission(c)
        }
      })
      const fullData = { ...data, courses_admissions: completeMap }

      // Save full JSON to pages table
      await pagesService.save({
        slug: 'admissions',
        title: fullData.intro_title || 'Admissions',
        content_html: JSON.stringify(fullData),
        excerpt: fullData.intro_lead ? fullData.intro_lead.slice(0, 160) : 'Admissions information'
      })
      setData(fullData)

      // 2. Sync legacy admissions table keys for compatibility
      try {
        const primary = currentCourseData
        await admissionsService.save({
          section_key: 'process',
          title: 'Admission Process',
          content: primary.process_intro || ''
        })
        await admissionsService.save({
          section_key: 'eligibility',
          title: 'Eligibility Criteria',
          content: primary.eligibility_intro || ''
        })
        await admissionsService.save({
          section_key: 'fees',
          title: 'Fee Structure',
          content: primary.fees_intro || ''
        })
        await admissionsService.save({
          section_key: 'dates',
          title: 'Important Dates',
          content: primary.dates_intro || ''
        })
      } catch {
        // Continue even if legacy sync is partial
      }

      setMsg({ text: 'All course-structured admissions content saved successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save admissions: ' + (err.message || 'Error'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Admissions Management
            <span className="admin-page-badge">Program Enrollment</span>
          </h1>
          <p>
            Dynamic admission guidelines, fee structures, eligibility criteria, and procedures structured around your active courses.
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
            {saving ? 'Saving Admissions...' : 'Save All Admissions Changes'}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading admissions content and course catalog...
        </div>
      ) : (
        <div>
          {/* COURSE STRUCTURE CONTEXT BAR */}
          <div
            className="admin-card"
            style={{
              padding: '16px 20px',
              marginBottom: 20,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    COURSE-STRUCTURED ADMISSIONS
                  </span>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                    {activeCourses.length === 1
                      ? 'Single Active Course Mode (1 course currently offered)'
                      : `Multi-Course Mode (${activeCourses.length} active courses offered)`}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 3 }}>
                  {activeCourses.length === 1
                    ? `Because the college currently offers 1 course (${currentCourse.name}), all fees, process steps, eligibility rules, application forms, scholarships, and helpdesk below are directly bound to this course.`
                    : 'Select a course below to manage its specific fee structure, eligibility criteria, admission process, application forms, and helpdesk:'}
                </div>
              </div>

              {activeCourses.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Active Course:</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e3a8a' }}>
                    {currentCourse.name}
                  </span>
                </div>
              )}
            </div>

            {/* If MULTIPLE courses, show Course Selector Pills */}
            {activeCourses.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px dashed #cbd5e1' }}>
                {activeCourses.map(c => {
                  const cKey = (c.code || c.id || '').toLowerCase()
                  const isSelected = selectedCourseKey === cKey
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setSelectedCourseKey(cKey)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1d4ed8' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: isSelected ? '0 1px 3px rgba(37,99,235,0.2)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <span>{c.name}</span>
                      <code style={{ fontSize: 11, background: isSelected ? '#dbeafe' : '#f1f5f9', padding: '1px 5px', borderRadius: 3 }}>
                        {c.code || c.id}
                      </code>
                    </button>
                  )
                })}
              </div>
            )}

            {/* If SINGLE course, show prominent Course Status Box */}
            {activeCourses.length === 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#ffffff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a8a' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ color: '#1e3a8a', fontSize: 14.5 }}>{currentCourse.name}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Program Code: <code>{currentCourse.code || 'BPT'}</code> | Duration: {currentCourse.duration || '4.5 Years'} | Approved Intake: {currentCourse.intake || '60 Seats'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  Active Program
                </div>
              </div>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="admin-tabs" style={{ marginBottom: 20 }}>
            <button
              className={`admin-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              1. Fee Structure Table
              <span className="admin-tab-count">{(currentCourseData.fees_table || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'process' ? 'active' : ''}`}
              onClick={() => setActiveTab('process')}
            >
              2. Admission Process
              <span className="admin-tab-count">{(currentCourseData.process_steps || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('eligibility')}
            >
              3. Eligibility Criteria
              <span className="admin-tab-count">{(currentCourseData.eligibility_points || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'application' ? 'active' : ''}`}
              onClick={() => setActiveTab('application')}
            >
              4. Application Form
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
              onClick={() => setActiveTab('scholarships')}
            >
              5. Scholarships (MahaDBT)
              <span className="admin-tab-count">{(currentCourseData.scholarships_list || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'dates' ? 'active' : ''}`}
              onClick={() => setActiveTab('dates')}
            >
              6. Important Dates
              <span className="admin-tab-count">{(currentCourseData.dates_list || []).length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'intake_helpdesk' ? 'active' : ''}`}
              onClick={() => setActiveTab('intake_helpdesk')}
            >
              7. Intake &amp; Helpdesk
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              8. General Intro &amp; Documents
            </button>
          </div>

          {/* TAB 1: FEE STRUCTURE TABLE */}
          {activeTab === 'fees' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Fee Structure Table for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure the category-wise FRA tuition, development, and payable fee breakdown for this program.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddFeeRow(!showAddFeeRow)}
                >
                  {showAddFeeRow ? 'Cancel' : '+ Add Quota / Category Fee Row'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Fee Structure Introductory Note:</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={currentCourseData.fees_intro || ''}
                    onChange={e => updateCurrentCourseData({ fees_intro: e.target.value })}
                    placeholder="Fee Regulating Authority (FRA) guidelines, quota notifications, etc."
                  />
                </div>

                {/* Add Fee Row Drawer/Form */}
                {showAddFeeRow && (
                  <div style={{ border: '1px dashed #2563eb', borderRadius: 8, padding: 16, background: '#eff6ff', marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e40af' }}>Add New Fee Category Row</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                      <div>
                        <label className="admin-label">Category / Quota Name:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Open / General Category"
                          value={newFeeRow.category}
                          onChange={e => setNewFeeRow({ ...newFeeRow, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Tuition Fee:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. ₹ 80,000"
                          value={newFeeRow.tuition_fee}
                          onChange={e => setNewFeeRow({ ...newFeeRow, tuition_fee: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Development Fee:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. ₹ 8,000"
                          value={newFeeRow.dev_fee}
                          onChange={e => setNewFeeRow({ ...newFeeRow, dev_fee: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Total Fee:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. ₹ 88,000"
                          value={newFeeRow.total_fee}
                          onChange={e => setNewFeeRow({ ...newFeeRow, total_fee: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Scholarship / Concession:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. 50% Concession"
                          value={newFeeRow.scholarship}
                          onChange={e => setNewFeeRow({ ...newFeeRow, scholarship: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Payable Amount:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. ₹ 48,000"
                          value={newFeeRow.payable}
                          onChange={e => setNewFeeRow({ ...newFeeRow, payable: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddFeeRow}>
                        Confirm Add Row
                      </button>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddFeeRow(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Fees Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Quota / Category</th>
                        <th>Tuition Fee</th>
                        <th>Dev Fee</th>
                        <th>Total Fee</th>
                        <th>Scholarship / Concession</th>
                        <th>Payable by Student</th>
                        <th style={{ width: 80 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentCourseData.fees_table || []).map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.category}
                              onChange={e => handleFeeRowChange(idx, 'category', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.tuition_fee}
                              onChange={e => handleFeeRowChange(idx, 'tuition_fee', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.dev_fee}
                              onChange={e => handleFeeRowChange(idx, 'dev_fee', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.total_fee}
                              onChange={e => handleFeeRowChange(idx, 'total_fee', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.scholarship}
                              onChange={e => handleFeeRowChange(idx, 'scholarship', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input admin-input-sm"
                              value={row.payable}
                              onChange={e => handleFeeRowChange(idx, 'payable', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-xs"
                              onClick={() => handleDeleteFeeRow(idx)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="admin-label">Payment Advisory / Demand Draft Notes:</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={currentCourseData.fees_notes || ''}
                    onChange={e => updateCurrentCourseData({ fees_notes: e.target.value })}
                    placeholder="Instructions on Demand Draft payee details, RTGS/NEFT accounts, caution money..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSION PROCESS */}
          {activeTab === 'process' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Admission Process Steps for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Define sequential steps (e.g. Entrance Examination, Registration, Verification, Allotment, Reporting).
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddStep(!showAddStep)}
                >
                  {showAddStep ? 'Cancel' : '+ Add Process Step'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Admission Process Overview Note:</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={currentCourseData.process_intro || ''}
                    onChange={e => updateCurrentCourseData({ process_intro: e.target.value })}
                    placeholder="Centralized Admission Process (CAP) overview..."
                  />
                </div>

                {/* Add Step Drawer */}
                {showAddStep && (
                  <div style={{ border: '1px dashed #2563eb', borderRadius: 8, padding: 16, background: '#eff6ff', marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e40af' }}>Add Process Step</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                      <div>
                        <label className="admin-label">Step Title:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. State CET Cell Online Registration"
                          value={newStep.title}
                          onChange={e => setNewStep({ ...newStep, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Step Description:</label>
                        <textarea
                          rows="3"
                          className="admin-textarea"
                          placeholder="Provide details on procedure, portal link, or requirements..."
                          value={newStep.desc}
                          onChange={e => setNewStep({ ...newStep, desc: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddStep}>
                        Confirm Add Step
                      </button>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddStep(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Steps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(currentCourseData.process_steps || []).map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 16,
                        background: '#f8fafc',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span
                          style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '3px 10px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {step.num || `Step ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteStep(idx)}
                        >
                          Delete Step
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                        <div>
                          <label className="admin-label">Step Title:</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={step.title}
                            onChange={e => handleStepChange(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="admin-label">Step Description:</label>
                          <textarea
                            rows="2"
                            className="admin-textarea"
                            value={step.desc}
                            onChange={e => handleStepChange(idx, 'desc', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ELIGIBILITY CRITERIA */}
          {activeTab === 'eligibility' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Eligibility Criteria for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Eligibility norms strictly configured for this course (10+2 marks, qualifying exams, age, domicile).
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                {/* Course Metadata header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
                  <div>
                    <label className="admin-label">Degree / Program Name:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.course_name || ''}
                      onChange={e => updateCurrentCourseData({ course_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Program Duration:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.duration || ''}
                      onChange={e => updateCurrentCourseData({ duration: e.target.value })}
                      placeholder="e.g. 4.5 Years (including 6-month compulsory internship)"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Approved Intake:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.intake || ''}
                      onChange={e => updateCurrentCourseData({ intake: e.target.value })}
                      placeholder="e.g. 60 Seats"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Eligibility Overview Note:</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={currentCourseData.eligibility_intro || ''}
                    onChange={e => updateCurrentCourseData({ eligibility_intro: e.target.value })}
                    placeholder="Candidates seeking admission to this course must fulfill statutory eligibility norms..."
                  />
                </div>

                {/* Eligibility Norms Checklist */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label className="admin-label" style={{ margin: 0 }}>
                      Eligibility Rules &amp; Norms ({currentCourseData.eligibility_points?.length || 0} rules defined):
                    </label>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(currentCourseData.eligibility_points || []).map((pt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', width: 24, textAlign: 'right' }}>
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          className="admin-input"
                          value={pt}
                          onChange={e => handleEligibilityPointChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteEligibilityPoint(idx)}
                          title="Remove rule"
                          style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Rule Input */}
                  <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Type a new eligibility requirement point (e.g. Completed 17 years of age on or before 31st December)..."
                      value={newEligPoint}
                      onChange={e => setNewEligPoint(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddEligibilityPoint(); } }}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={handleAddEligibilityPoint}
                      style={{ whiteSpace: 'nowrap', fontSize: 13 }}
                    >
                      + Add Rule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATION FORM */}
          {activeTab === 'application' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Application Form &amp; Submission for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Provide instructions for online CAP counseling and offline institutional round application forms.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Application Form Overview:</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={currentCourseData.app_form_intro || ''}
                    onChange={e => updateCurrentCourseData({ app_form_intro: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, background: '#f8fafc' }}>
                    <label className="admin-label">Centralized CAP Block Title:</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginBottom: 12 }}
                      value={currentCourseData.app_cap_title || ''}
                      onChange={e => updateCurrentCourseData({ app_cap_title: e.target.value })}
                    />
                    <label className="admin-label">CAP Guidelines (one per line):</label>
                    <textarea
                      rows="6"
                      className="admin-textarea"
                      value={currentCourseData.app_cap_points ? currentCourseData.app_cap_points.join('\n') : ''}
                      onChange={e =>
                        updateCurrentCourseData({
                          app_cap_points: e.target.value.split('\n').filter(p => p.trim())
                        })
                      }
                    />
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, background: '#f8fafc' }}>
                    <label className="admin-label">College Institutional Round Block Title:</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginBottom: 12 }}
                      value={currentCourseData.app_college_title || ''}
                      onChange={e => updateCurrentCourseData({ app_college_title: e.target.value })}
                    />
                    <label className="admin-label">College Guidelines (one per line):</label>
                    <textarea
                      rows="6"
                      className="admin-textarea"
                      value={currentCourseData.app_college_points ? currentCourseData.app_college_points.join('\n') : ''}
                      onChange={e =>
                        updateCurrentCourseData({
                          app_college_points: e.target.value.split('\n').filter(p => p.trim())
                        })
                      }
                    />
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="admin-label">Direct Application Form (PDF / Document):</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1, minWidth: 200 }}
                      placeholder="Paste PDF link (https://...) or choose file"
                      value={currentCourseData.app_form_download_url || ''}
                      onChange={e => updateCurrentCourseData({ app_form_download_url: e.target.value })}
                    />
                    <label
                      className="admin-btn admin-btn-secondary"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0, height: 38 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleAppFormUpload}
                        disabled={uploadingPdf}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {currentCourseData.app_form_download_url && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                        onClick={() => updateCurrentCourseData({ app_form_download_url: '' })}
                        title="Clear application form link"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {uploadingPdf && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading application document...</div>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCHOLARSHIPS (MahaDBT) */}
          {activeTab === 'scholarships' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>MahaDBT Scholarships for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Manage state and central scholarship schemes and fee concession criteria.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddScholarship(!showAddScholarship)}
                >
                  {showAddScholarship ? 'Cancel' : '+ Add Scholarship Scheme'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Scholarships Section Overview:</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={currentCourseData.scholarships_intro || ''}
                    onChange={e => updateCurrentCourseData({ scholarships_intro: e.target.value })}
                  />
                </div>

                {showAddScholarship && (
                  <div style={{ border: '1px dashed #2563eb', borderRadius: 8, padding: 16, background: '#eff6ff', marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e40af' }}>Add Scholarship Scheme</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                      <div>
                        <label className="admin-label">Scheme Title:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna"
                          value={newScholarship.title}
                          onChange={e => setNewScholarship({ ...newScholarship, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Scheme Description &amp; Eligibility:</label>
                        <textarea
                          rows="3"
                          className="admin-textarea"
                          placeholder="Details on fee waiver percentage, income ceiling, required documents..."
                          value={newScholarship.desc}
                          onChange={e => setNewScholarship({ ...newScholarship, desc: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddScholarship}>
                        Confirm Add Scheme
                      </button>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddScholarship(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(currentCourseData.scholarships_list || []).map((sch, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 16,
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a8a' }}>
                          Scheme #{idx + 1}
                        </span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteScholarship(idx)}
                        >
                          Delete Scheme
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                        <div>
                          <label className="admin-label">Scheme Title:</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={sch.title}
                            onChange={e => handleScholarshipChange(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="admin-label">Description &amp; Concessions:</label>
                          <textarea
                            rows="2"
                            className="admin-textarea"
                            value={sch.desc}
                            onChange={e => handleScholarshipChange(idx, 'desc', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: IMPORTANT DATES */}
          {activeTab === 'dates' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Important Dates &amp; Schedule for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Publish timeline milestones for CAP counseling, merit lists, and reporting.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddDate(!showAddDate)}
                >
                  {showAddDate ? 'Cancel' : '+ Add Date Item'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Schedule Introductory Note:</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={currentCourseData.dates_intro || ''}
                    onChange={e => updateCurrentCourseData({ dates_intro: e.target.value })}
                  />
                </div>

                {showAddDate && (
                  <div style={{ border: '1px dashed #2563eb', borderRadius: 8, padding: 16, background: '#eff6ff', marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e40af' }}>Add Schedule Milestone</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label className="admin-label">Event Milestone Title:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. CAP Round 1 Allotment & Reporting"
                          value={newDate.title}
                          onChange={e => setNewDate({ ...newDate, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Date or Schedule Notice:</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. 15th October – 20th October 2026"
                          value={newDate.desc}
                          onChange={e => setNewDate({ ...newDate, desc: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddDate}>
                        Confirm Add Milestone
                      </button>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddDate(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(currentCourseData.dates_list || []).map((d, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto',
                        gap: 12,
                        alignItems: 'center',
                        padding: 12,
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        background: '#f8fafc'
                      }}
                    >
                      <div>
                        <label className="admin-label" style={{ fontSize: 11 }}>Milestone Title:</label>
                        <input
                          type="text"
                          className="admin-input admin-input-sm"
                          value={d.title}
                          onChange={e => handleDateChange(idx, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="admin-label" style={{ fontSize: 11 }}>Date / Schedule:</label>
                        <input
                          type="text"
                          className="admin-input admin-input-sm"
                          value={d.desc}
                          onChange={e => handleDateChange(idx, 'desc', e.target.value)}
                        />
                      </div>
                      <div style={{ alignSelf: 'flex-end' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDeleteDate(idx)}
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

          {/* TAB 7: INTAKE & HELPDESK */}
          {activeTab === 'intake_helpdesk' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Approved Intake &amp; Admission Helpdesk for {currentCourseData.course_name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Sanctioned seats, regulatory approval information, and dedicated admission contact desk.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 18 }}>
                  <div>
                    <label className="admin-label">Sanctioned Intake Capacity:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.intake_approved || ''}
                      onChange={e => updateCurrentCourseData({ intake_approved: e.target.value })}
                      placeholder="e.g. 60 Seats"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Helpdesk Title:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.helpdesk_title || ''}
                      onChange={e => updateCurrentCourseData({ helpdesk_title: e.target.value })}
                      placeholder="e.g. BPT Admission Counseling Desk"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Helpdesk Telephone / Helpline:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.helpdesk_phone || ''}
                      onChange={e => updateCurrentCourseData({ helpdesk_phone: e.target.value })}
                      placeholder="+91 02186 272345, +91 94235 34567"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Helpdesk Email Address:</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={currentCourseData.helpdesk_email || ''}
                      onChange={e => updateCurrentCourseData({ helpdesk_email: e.target.value })}
                      placeholder="admissions@karmayogiphysiotherapy.edu.in"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label">Regulatory Approvals &amp; University Affiliation Note:</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={currentCourseData.intake_description || ''}
                    onChange={e => updateCurrentCourseData({ intake_description: e.target.value })}
                    placeholder="Approved by Government of Maharashtra, DMER Mumbai, affiliated with MUHS Nashik..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="admin-label">Office &amp; Helpdesk Working Hours:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.helpdesk_hours || ''}
                      onChange={e => updateCurrentCourseData({ helpdesk_hours: e.target.value })}
                      placeholder="Monday – Saturday: 9:00 AM to 5:00 PM"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Campus Physical Address:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={currentCourseData.helpdesk_address || ''}
                      onChange={e => updateCurrentCourseData({ helpdesk_address: e.target.value })}
                      placeholder="Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: GENERAL INTRO & DOCUMENTS */}
          {activeTab === 'general' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>Admissions General Page Settings &amp; Mandatory Documents</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Page preamble header, intro text, and universal documents checklist.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label className="admin-label">Page Main Heading:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.intro_title || ''}
                      onChange={e => handleGeneralChange('intro_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Page Lead Paragraph:</label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={data.intro_lead || ''}
                      onChange={e => handleGeneralChange('intro_lead', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                  <label className="admin-label">Mandatory Documents Checklist Section Overview:</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={data.documents_intro || ''}
                    onChange={e => handleGeneralChange('documents_intro', e.target.value)}
                  />
                </div>

                <div style={{ marginTop: 18 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e3a8a' }}>Required Document Categories &amp; Items</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    {(data.documents_categories || []).map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: 16,
                          background: '#f8fafc'
                        }}
                      >
                        <label className="admin-label">Category Title:</label>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ marginBottom: 10 }}
                          value={cat.title}
                          onChange={e => {
                            const updated = [...data.documents_categories]
                            updated[catIdx] = { ...updated[catIdx], title: e.target.value }
                            handleGeneralChange('documents_categories', updated)
                          }}
                        />

                        <label className="admin-label">Required Items (one per line):</label>
                        <textarea
                          rows="6"
                          className="admin-textarea"
                          value={cat.items ? cat.items.join('\n') : ''}
                          onChange={e => {
                            const updated = [...data.documents_categories]
                            updated[catIdx] = {
                              ...updated[catIdx],
                              items: e.target.value.split('\n').filter(i => i.trim())
                            }
                            handleGeneralChange('documents_categories', updated)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
