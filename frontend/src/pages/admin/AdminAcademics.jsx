import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService, setCachedAcademicsData } from '../../services/endpoints.js'
import { DEFAULT_ACADEMICS_DATA } from '../../data/collegeData.js'

const YEAR_OPTIONS = [
  { key: 'year-1', label: 'First Year BPT' },
  { key: 'year-2', label: 'Second Year BPT' },
  { key: 'year-3', label: 'Third Year BPT' },
  { key: 'year-4', label: 'Final Year BPT' }
]

const DEPARTMENT_OPTIONS = [
  'Department of Foundational Medical Sciences',
  'Department of Kinesiotherapy & Physical Diagnosis',
  'Department of Electrotherapy & Electrodiagnosis',
  'Department of Musculoskeletal Physiotherapy',
  'Department of Neuro Physiotherapy',
  'Department of Cardiovascular & Respiratory Physiotherapy',
  'Department of Community Physiotherapy',
  'Department of Pediatric Physiotherapy',
  'Department of Sports Physiotherapy'
]

export default function AdminAcademics() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'subjects'
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])
  const [data, setData] = useState(DEFAULT_ACADEMICS_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Subjects Management States
  const [subjectYearFilter, setSubjectYearFilter] = useState('all')
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showYearDescEditor, setShowYearDescEditor] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    abbr: '',
    yearKey: 'year-1',
    yearLabel: 'First Year BPT',
    order: 1,
    departmentName: '',
    description: '',
    keyTopics: '',
    clinicalRelevance: ''
  })

  // Draft states for adding new items
  const [newEvent, setNewEvent] = useState({ date: '', activity: '', batch: '', category: '' })
  const [showAddEvent, setShowAddEvent] = useState(false)

  const [newNotice, setNewNotice] = useState({ title: '', date: '', batch: '', file_url: '' })
  const [showAddNotice, setShowAddNotice] = useState(false)
  const [uploadingNoticeDoc, setUploadingNoticeDoc] = useState(false)

  const [newResultRecord, setNewResultRecord] = useState({ year: '', exam_session: '', appeared: '', passed: '', distinction: '', first_class: '', pass_percentage: '' })
  const [showAddResult, setShowAddResult] = useState(false)

  const [newPolicy, setNewPolicy] = useState({ title: '', category: '', summary: '', pdf_url: '' })
  const [showAddPolicy, setShowAddPolicy] = useState(false)
  const [uploadingPolicyDoc, setUploadingPolicyDoc] = useState(false)

  const [newChapter, setNewChapter] = useState({ num: '', title: '', desc: '' })
  const [showAddChapter, setShowAddChapter] = useState(false)

  // Upload loading flags
  const [uploadingCalendarPdf, setUploadingCalendarPdf] = useState(false)
  const [uploadingHandbookPdf, setUploadingHandbookPdf] = useState(false)
  const [uploadingYearPdf, setUploadingYearPdf] = useState(null)

  // Load existing data from DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const page = await pagesService.getBySlug('academics')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              overview: { ...prev.overview, ...(parsed.overview || {}) },
              subjects: {
                ...prev.subjects,
                ...(parsed.subjects || {}),
                years: Array.isArray(parsed.subjects?.years) && parsed.subjects.years.length > 0 ? parsed.subjects.years : prev.subjects?.years,
                list: Array.isArray(parsed.subjects?.list) && parsed.subjects.list.length > 0 ? parsed.subjects.list : prev.subjects?.list
              },
              calendar: {
                ...prev.calendar,
                ...(parsed.calendar || {}),
                events: Array.isArray(parsed.calendar?.events) && parsed.calendar.events.length > 0 ? parsed.calendar.events : prev.calendar.events
              },
              timetable: {
                ...prev.timetable,
                ...(parsed.timetable || {}),
                years: Array.isArray(parsed.timetable?.years) && parsed.timetable.years.length > 0 ? parsed.timetable.years : prev.timetable.years,
                schedule_rows: Array.isArray(parsed.timetable?.schedule_rows) && parsed.timetable.schedule_rows.length > 0 ? parsed.timetable.schedule_rows : prev.timetable.schedule_rows
              },
              examination: {
                ...prev.examination,
                ...(parsed.examination || {}),
                attendance_rules: { ...prev.examination.attendance_rules, ...(parsed.examination?.attendance_rules || {}) },
                weightage: Array.isArray(parsed.examination?.weightage) && parsed.examination.weightage.length > 0 ? parsed.examination.weightage : prev.examination.weightage,
                notices: Array.isArray(parsed.examination?.notices) && parsed.examination.notices.length > 0 ? parsed.examination.notices : prev.examination.notices
              },
              results: {
                ...prev.results,
                ...(parsed.results || {}),
                records: Array.isArray(parsed.results?.records) && parsed.results.records.length > 0 ? parsed.results.records : prev.results.records
              },
              policies: {
                ...prev.policies,
                ...(parsed.policies || {}),
                items: Array.isArray(parsed.policies?.items) && parsed.policies.items.length > 0 ? parsed.policies.items : prev.policies.items
              },
              handbook: {
                ...prev.handbook,
                ...(parsed.handbook || {}),
                chapters: Array.isArray(parsed.handbook?.chapters) && parsed.handbook.chapters.length > 0 ? parsed.handbook.chapters : prev.handbook.chapters,
                contact_support: { ...prev.handbook.contact_support, ...(parsed.handbook?.contact_support || {}) }
              }
            }))
          } catch {
            // Keep default structured data
          }
        }
      } catch {
        // Fallback to default
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Nested property handlers
  const handleOverviewChange = (field, val) => {
    setData(prev => ({ ...prev, overview: { ...prev.overview, [field]: val } }))
  }

  const handleSubjectsChange = (field, val) => {
    setData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [field]: val
      }
    }))
  }

  const handleYearDescChange = (yearKey, newDesc) => {
    setData(prev => {
      const years = [...(prev.subjects?.years || [])]
      const idx = years.findIndex(y => y.key === yearKey)
      if (idx !== -1) {
        years[idx] = { ...years[idx], description: newDesc }
      }
      return {
        ...prev,
        subjects: {
          ...prev.subjects,
          years
        }
      }
    })
  }

  const handleOpenAddSubject = () => {
    const currentList = data.subjects?.list || []
    const targetYear = subjectYearFilter !== 'all' ? subjectYearFilter : 'year-1'
    const subjectsInTargetYear = currentList.filter(s => s.yearKey === targetYear)
    const maxOrder = subjectsInTargetYear.reduce((max, s) => Math.max(max, Number(s.order) || 0), 0)

    setEditingSubjectId(null)
    setSubjectForm({
      name: '',
      abbr: '',
      yearKey: targetYear,
      yearLabel: YEAR_OPTIONS.find(y => y.key === targetYear)?.label || 'First Year BPT',
      order: maxOrder + 1,
      departmentName: 'Department of Foundational Medical Sciences',
      description: '',
      keyTopics: '',
      clinicalRelevance: ''
    })
    setShowSubjectModal(true)
  }

  const handleOpenEditSubject = (subj) => {
    setEditingSubjectId(subj.id)
    const topicsArr = Array.isArray(subj.keyTopics) ? subj.keyTopics : (Array.isArray(subj.topics) ? subj.topics : [])
    setSubjectForm({
      name: subj.name || '',
      abbr: subj.abbr || '',
      yearKey: subj.yearKey || 'year-1',
      yearLabel: subj.yearLabel || (YEAR_OPTIONS.find(y => y.key === subj.yearKey)?.label || 'First Year BPT'),
      order: subj.order || 1,
      departmentName: subj.departmentName || subj.department || '',
      description: subj.description || subj.desc || '',
      keyTopics: topicsArr.join('\n'),
      clinicalRelevance: subj.clinicalRelevance || ''
    })
    setShowSubjectModal(true)
  }

  const handleSaveSubject = () => {
    if (!subjectForm.name.trim()) {
      alert('Please enter Subject Name.')
      return
    }
    const topicsArray = subjectForm.keyTopics
      .split(/[\n,]+/)
      .map(t => t.trim())
      .filter(Boolean)

    const subjectPayload = {
      id: editingSubjectId || `subj_${Date.now()}`,
      order: Number(subjectForm.order) || 1,
      name: subjectForm.name.trim(),
      abbr: subjectForm.abbr.trim().toUpperCase() || 'BPT',
      yearKey: subjectForm.yearKey,
      yearLabel: YEAR_OPTIONS.find(y => y.key === subjectForm.yearKey)?.label || subjectForm.yearKey,
      departmentName: subjectForm.departmentName.trim(),
      description: subjectForm.description.trim(),
      desc: subjectForm.description.trim(),
      keyTopics: topicsArray,
      topics: topicsArray,
      clinicalRelevance: subjectForm.clinicalRelevance.trim()
    }

    setData(prev => {
      const list = [...(prev.subjects?.list || [])]
      if (editingSubjectId) {
        const idx = list.findIndex(s => s.id === editingSubjectId)
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...subjectPayload }
        } else {
          list.push(subjectPayload)
        }
      } else {
        list.push(subjectPayload)
      }
      return {
        ...prev,
        subjects: {
          ...prev.subjects,
          list
        }
      }
    })

    setShowSubjectModal(false)
    setEditingSubjectId(null)
  }

  const handleDeleteSubject = (subjId, subjName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjName}"?`)) return
    setData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        list: (prev.subjects?.list || []).filter(s => s.id !== subjId)
      }
    }))
  }

  const handleCalendarChange = (field, val) => {
    setData(prev => ({ ...prev, calendar: { ...prev.calendar, [field]: val } }))
  }

  const handleTimetableChange = (field, val) => {
    setData(prev => ({ ...prev, timetable: { ...prev.timetable, [field]: val } }))
  }

  const handleExaminationChange = (field, val) => {
    setData(prev => ({ ...prev, examination: { ...prev.examination, [field]: val } }))
  }

  const handleExamAttendanceChange = (field, val) => {
    setData(prev => ({
      ...prev,
      examination: {
        ...prev.examination,
        attendance_rules: { ...prev.examination.attendance_rules, [field]: val }
      }
    }))
  }

  const handleResultsChange = (field, val) => {
    setData(prev => ({ ...prev, results: { ...prev.results, [field]: val } }))
  }

  const handlePoliciesChange = (field, val) => {
    setData(prev => ({ ...prev, policies: { ...prev.policies, [field]: val } }))
  }

  const handleHandbookChange = (field, val) => {
    setData(prev => ({ ...prev, handbook: { ...prev.handbook, [field]: val } }))
  }

  const handleHandbookContactChange = (field, val) => {
    setData(prev => ({
      ...prev,
      handbook: {
        ...prev.handbook,
        contact_support: { ...prev.handbook.contact_support, [field]: val }
      }
    }))
  }

  // Upload Calendar PDF
  const handleUploadCalendarPdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCalendarPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'documents')
      if (url) {
        handleCalendarChange('pdf_url', url)
      }
    } catch {
      alert('Calendar PDF upload failed. Please try again.')
    } finally {
      setUploadingCalendarPdf(false)
    }
  }

  // Upload Handbook PDF
  const handleUploadHandbookPdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHandbookPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'documents')
      if (url) {
        handleHandbookChange('pdf_url', url)
      }
    } catch {
      alert('Handbook PDF upload failed. Please try again.')
    } finally {
      setUploadingHandbookPdf(false)
    }
  }

  // Upload Timetable Year PDF
  const handleUploadYearPdf = async (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingYearPdf(idx)
    try {
      const url = await uploadService.uploadFile(file, 'documents')
      if (url) {
        const updated = [...data.timetable.years]
        updated[idx] = { ...updated[idx], pdf_url: url }
        setData(prev => ({ ...prev, timetable: { ...prev.timetable, years: updated } }))
      }
    } catch {
      alert('Timetable PDF upload failed. Please try again.')
    } finally {
      setUploadingYearPdf(null)
    }
  }

  // Generic List item changer & remover
  const handleListChange = (section, key, idx, field, val) => {
    setData(prev => {
      const list = [...prev[section][key]]
      list[idx] = { ...list[idx], [field]: val }
      return { ...prev, [section]: { ...prev[section], [key]: list } }
    })
  }

  const handleDeleteListItem = (section, key, idx) => {
    if (!window.confirm('Are you sure you want to remove this entry?')) return
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: prev[section][key].filter((_, i) => i !== idx)
      }
    }))
  }

  // Add Calendar Event
  const handleAddEvent = () => {
    if (!newEvent.date.trim() || !newEvent.activity.trim()) return
    setData(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: [...(prev.calendar.events || []), { ...newEvent }]
      }
    }))
    setNewEvent({ date: '', activity: '', batch: '', category: '' })
    setShowAddEvent(false)
  }

  // Add Exam Notice
  const handleAddNotice = () => {
    if (!newNotice.title.trim()) return
    setData(prev => ({
      ...prev,
      examination: {
        ...prev.examination,
        notices: [...(prev.examination.notices || []), { ...newNotice }]
      }
    }))
    setNewNotice({ title: '', date: '', batch: '', file_url: '' })
    setShowAddNotice(false)
  }

  // Add Result Record
  const handleAddResult = () => {
    if (!newResultRecord.year.trim()) return
    setData(prev => ({
      ...prev,
      results: {
        ...prev.results,
        records: [...(prev.results.records || []), { ...newResultRecord }]
      }
    }))
    setNewResultRecord({ year: '', exam_session: '', appeared: '', passed: '', distinction: '', first_class: '', pass_percentage: '' })
    setShowAddResult(false)
  }

  // Add Policy
  const handleAddPolicy = () => {
    if (!newPolicy.title.trim()) return
    setData(prev => ({
      ...prev,
      policies: {
        ...prev.policies,
        items: [...(prev.policies.items || []), { ...newPolicy }]
      }
    }))
    setNewPolicy({ title: '', category: '', summary: '', pdf_url: '' })
    setShowAddPolicy(false)
  }

  // Add Handbook Chapter
  const handleAddChapter = () => {
    if (!newChapter.title.trim()) return
    setData(prev => ({
      ...prev,
      handbook: {
        ...prev.handbook,
        chapters: [...(prev.handbook.chapters || []), { ...newChapter, num: newChapter.num || `0${(prev.handbook.chapters?.length || 0) + 1}` }]
      }
    }))
    setNewChapter({ num: '', title: '', desc: '' })
    setShowAddChapter(false)
  }

  // Global Save
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'academics',
        title: data.overview?.title || 'Academics',
        content_html: JSON.stringify(data),
        excerpt: (data.overview?.lead || 'Academic programs and administration').slice(0, 160)
      })

      // Update client-side prehydration cache
      setCachedAcademicsData(data)

      setMsg({ text: 'All Academics content updated and saved successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save: ' + (err.message || 'Error'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const allSubjects = data.subjects?.list || []
  const filteredSubjects = allSubjects.filter(subj => {
    const matchesYear = subjectYearFilter === 'all' || subj.yearKey === subjectYearFilter
    const q = subjectSearch.trim().toLowerCase()
    const matchesSearch = !q ||
      (subj.name && subj.name.toLowerCase().includes(q)) ||
      (subj.abbr && subj.abbr.toLowerCase().includes(q)) ||
      ((subj.departmentName || subj.department) && (subj.departmentName || subj.department).toLowerCase().includes(q))
    return matchesYear && matchesSearch
  }).sort((a, b) => {
    if (a.yearKey !== b.yearKey) {
      return a.yearKey.localeCompare(b.yearKey)
    }
    return (Number(a.order) || 0) - (Number(b.order) || 0)
  })

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>Academics Administration</h1>
            <span className="admin-badge badge-info" style={{ fontSize: 11, padding: '3px 8px' }}>Curriculum & Regulations</span>
          </div>
          <p style={{ color: '#64748b', margin: '5px 0 0', fontSize: 13.5 }}>
            Configure all 7 academic submenus: Subjects catalogue, Academic Calendar, Teaching Timetables, Examination Cell, MUHS Results, Policies, and Student Handbook.
          </p>
        </div>
        <div>
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
            style={{ padding: '9px 18px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {saving ? 'Saving Changes...' : 'Save All Academic Changes'}
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
          Loading academics data...
        </div>
      ) : (
        <div>
          {/* Sub Navigation Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              Subjects <span className="admin-tab-count">{allSubjects.length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Academic Calendar <span className="admin-tab-count">{data.calendar?.events?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              Timetable & Rosters <span className="admin-tab-count">{data.timetable?.years?.length || 0} Yrs</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'examination' ? 'active' : ''}`}
              onClick={() => setActiveTab('examination')}
            >
              Examination & Notices <span className="admin-tab-count">{data.examination?.notices?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Results & Records <span className="admin-tab-count">{data.results?.records?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              Academic Policies <span className="admin-tab-count">{data.policies?.items?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'handbook' ? 'active' : ''}`}
              onClick={() => setActiveTab('handbook')}
            >
              Student Handbook <span className="admin-tab-count">{data.handbook?.chapters?.length || 0} Ch</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: SUBJECTS (CURRICULUM)
              ======================================================== */}
          {activeTab === 'subjects' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    BPT Curriculum &amp; Subjects Catalogue
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure 34 BPT curriculum subjects across all 4 years, supervising departments, syllabus topics, and clinical competencies.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setShowYearDescEditor(!showYearDescEditor)}
                  >
                    {showYearDescEditor ? 'Hide Year Descriptions' : 'Edit Year Intros'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={handleOpenAddSubject}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New Subject
                  </button>
                </div>
              </div>

              <div className="admin-card-body">
                {/* Title & Lead statement inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Curriculum Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.subjects?.title || ''}
                    onChange={(e) => handleSubjectsChange('title', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Curriculum Lead Statement</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.subjects?.lead || ''}
                    onChange={(e) => handleSubjectsChange('lead', e.target.value)}
                  />
                </div>
              </div>

              {/* Collapsible Year Descriptions Editor */}
              {showYearDescEditor && (
                <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, margin: '0 0 10px', color: 'var(--navy-header)' }}>
                    Year-Wise Section Introductory Descriptions
                  </h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {YEAR_OPTIONS.map(yr => {
                      const yearObj = (data.subjects?.years || []).find(y => y.key === yr.key) || {}
                      return (
                        <div key={yr.key} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#334155' }}>{yr.label}:</span>
                          <textarea
                            className="admin-input"
                            rows={2}
                            value={yearObj.description || ''}
                            placeholder={`Enter introductory summary for ${yr.label}...`}
                            onChange={(e) => handleYearDescChange(yr.key, e.target.value)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16, padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                {/* Year Filter Buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`admin-btn ${subjectYearFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    style={{ padding: '5px 12px', fontSize: 13 }}
                    onClick={() => setSubjectYearFilter('all')}
                  >
                    All Years ({allSubjects.length})
                  </button>
                  {YEAR_OPTIONS.map(yr => {
                    const count = allSubjects.filter(s => s.yearKey === yr.key).length
                    return (
                      <button
                        key={yr.key}
                        type="button"
                        className={`admin-btn ${subjectYearFilter === yr.key ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                        style={{ padding: '5px 12px', fontSize: 13 }}
                        onClick={() => setSubjectYearFilter(yr.key)}
                      >
                        {yr.label.replace(' BPT', '')} ({count})
                      </button>
                    )
                  })}
                </div>

                {/* Search Input */}
                <div style={{ minWidth: 260 }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Search by name, code (HA, HP), dept..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    style={{ fontSize: 13, padding: '6px 12px' }}
                  />
                </div>
              </div>

              {/* Subjects List Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', width: 45 }}>#</th>
                      <th style={{ padding: '10px 12px', width: 75 }}>Code</th>
                      <th style={{ padding: '10px 12px' }}>Subject Name</th>
                      <th style={{ padding: '10px 12px', width: 140 }}>Academic Year</th>
                      <th style={{ padding: '10px 12px' }}>Supervising Department</th>
                      <th style={{ padding: '10px 12px', width: 90 }}>Topics</th>
                      <th style={{ padding: '10px 12px', width: 130, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          No subjects found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredSubjects.map((subj, idx) => {
                        const topicsCount = Array.isArray(subj.keyTopics)
                          ? subj.keyTopics.length
                          : (Array.isArray(subj.topics) ? subj.topics.length : 0)

                        return (
                          <tr key={subj.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#64748b' }}>
                              {subj.order || idx + 1}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                display: 'inline-block',
                                background: '#003366',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: 11,
                                padding: '2px 7px',
                                borderRadius: 4,
                                letterSpacing: '0.5px'
                              }}>
                                {subj.abbr || 'BPT'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{subj.name}</strong>
                              <span style={{ fontSize: 12, color: '#64748b' }}>
                                {(subj.description || subj.desc || '').slice(0, 80)}...
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                display: 'inline-block',
                                background: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 600,
                                fontSize: 11.5,
                                padding: '3px 8px',
                                borderRadius: 12
                              }}>
                                {subj.yearLabel || (YEAR_OPTIONS.find(y => y.key === subj.yearKey)?.label || subj.yearKey)}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', color: '#334155' }}>
                              {subj.departmentName || subj.department || '—'}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                display: 'inline-block',
                                background: '#f1f5f9',
                                color: '#475569',
                                fontWeight: 600,
                                fontSize: 11.5,
                                padding: '2px 8px',
                                borderRadius: 4
                              }}>
                                {topicsCount} topics
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: 12, marginRight: 6 }}
                                onClick={() => handleOpenEditSubject(subj)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '4px 8px', fontSize: 12 }}
                                onClick={() => handleDeleteSubject(subj.id, subj.name)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add / Edit Subject Modal */}
              {showSubjectModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: 20
                }}>
                  <div style={{
                    background: '#ffffff',
                    borderRadius: 8,
                    width: '100%',
                    maxWidth: 720,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    padding: 24
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 18 }}>
                      <h3 style={{ margin: 0, fontSize: 18, color: 'var(--navy-header)' }}>
                        {editingSubjectId ? 'Edit BPT Subject' : 'Add New BPT Subject'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowSubjectModal(false)}
                        style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Subject Name *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Human Anatomy"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Subject Code / Abbreviation *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. HA"
                          value={subjectForm.abbr}
                          onChange={(e) => setSubjectForm({ ...subjectForm, abbr: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Curriculum Academic Year *</label>
                        <select
                          className="admin-input"
                          value={subjectForm.yearKey}
                          onChange={(e) => setSubjectForm({
                            ...subjectForm,
                            yearKey: e.target.value,
                            yearLabel: YEAR_OPTIONS.find(y => y.key === e.target.value)?.label || e.target.value
                          })}
                        >
                          {YEAR_OPTIONS.map(yr => (
                            <option key={yr.key} value={yr.key}>{yr.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Display Order (#)</label>
                        <input
                          type="number"
                          className="admin-input"
                          value={subjectForm.order}
                          onChange={(e) => setSubjectForm({ ...subjectForm, order: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label className="admin-label">Supervising Academic Department</label>
                      <input
                        type="text"
                        list="dept-options-list"
                        className="admin-input"
                        placeholder="e.g. Department of Foundational Medical Sciences"
                        value={subjectForm.departmentName}
                        onChange={(e) => setSubjectForm({ ...subjectForm, departmentName: e.target.value })}
                      />
                      <datalist id="dept-options-list">
                        {DEPARTMENT_OPTIONS.map((d, i) => (
                          <option key={i} value={d} />
                        ))}
                      </datalist>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label className="admin-label">Subject Overview &amp; Curriculum Objectives</label>
                      <textarea
                        className="admin-input"
                        rows={3}
                        placeholder="Detailed subject description, curriculum objectives, and didactic expectations..."
                        value={subjectForm.description}
                        onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 14 }}>
                      <label className="admin-label">Core Syllabus Topics (Separate by commas or new lines)</label>
                      <textarea
                        className="admin-input"
                        rows={3}
                        placeholder="Skeletal system&#10;Muscular system&#10;Joints&#10;Organs"
                        value={subjectForm.keyTopics}
                        onChange={(e) => setSubjectForm({ ...subjectForm, keyTopics: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 20 }}>
                      <label className="admin-label">Clinical Relevance in Physiotherapy Practice</label>
                      <textarea
                        className="admin-input"
                        rows={2}
                        placeholder="Explain how this subject directly relates to bedside patient care and physiotherapy diagnosis..."
                        value={subjectForm.clinicalRelevance}
                        onChange={(e) => setSubjectForm({ ...subjectForm, clinicalRelevance: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setShowSubjectModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={handleSaveSubject}
                      >
                        {editingSubjectId ? 'Update Subject' : 'Add Subject'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: ACADEMIC CALENDAR
              ======================================================== */}
          {activeTab === 'calendar' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Academic Calendar &amp; Scheduled Term Dates
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure term dates, examinations, recesses, and upload the official Academic Calendar PDF.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showAddEvent ? 'Cancel' : 'Add Calendar Event'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Academic Session Year</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Academic Session 2026 - 2027"
                      value={data.calendar?.current_year || ''}
                      onChange={(e) => handleCalendarChange('current_year', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Official Calendar PDF Document</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="/uploads/documents/... or file URL"
                        value={data.calendar?.pdf_url || ''}
                        onChange={(e) => handleCalendarChange('pdf_url', e.target.value)}
                      />
                      <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        {uploadingCalendarPdf ? 'Uploading...' : 'Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleUploadCalendarPdf}
                          disabled={uploadingCalendarPdf}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: 14 }}>
                  <label className="admin-label">Calendar Lead Statement</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    placeholder="Enter introductory summary for the academic calendar..."
                    value={data.calendar?.lead || ''}
                    onChange={(e) => handleCalendarChange('lead', e.target.value)}
                  />
                </div>

                {/* Add New Event Form */}
                {showAddEvent && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18, marginBottom: 20, marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: '#0f172a' }}>Add New Calendar Event</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Fill in event parameters and click Save</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr', gap: 10 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Date / Range</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. 01 Aug 2026"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Activity Description</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Commencement of Academic Term"
                          value={newEvent.activity}
                          onChange={(e) => setNewEvent({ ...newEvent, activity: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Target Batch</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. All Batches"
                          value={newEvent.batch}
                          onChange={(e) => setNewEvent({ ...newEvent, batch: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Category</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Term Start / Exam"
                          value={newEvent.category}
                          onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddEvent(false)}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddEvent}>
                        Save Event
                      </button>
                    </div>
                  </div>
                )}

                {/* Events Table Editor with Structured Column Headers */}
                <div className="admin-grid-table">
                  <div
                    className="admin-grid-header"
                    style={{ gridTemplateColumns: '40px 1.4fr 2.5fr 1fr 1fr 44px', gap: 10 }}
                  >
                    <span>#</span>
                    <span>Date / Duration</span>
                    <span>Activity / Event Name</span>
                    <span>Target Batches</span>
                    <span>Category</span>
                    <span style={{ textAlign: 'center' }}>Del</span>
                  </div>

                  {data.calendar?.events?.map((ev, idx) => (
                    <div
                      key={idx}
                      className="admin-grid-row"
                      style={{ gridTemplateColumns: '40px 1.4fr 2.5fr 1fr 1fr 44px', gap: 10 }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>#{idx + 1}</span>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Date"
                        value={ev.date}
                        onChange={(e) => handleListChange('calendar', 'events', idx, 'date', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Event Description"
                        value={ev.activity}
                        onChange={(e) => handleListChange('calendar', 'events', idx, 'activity', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Batches"
                        value={ev.batch}
                        onChange={(e) => handleListChange('calendar', 'events', idx, 'batch', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Category"
                        value={ev.category}
                        onChange={(e) => handleListChange('calendar', 'events', idx, 'category', e.target.value)}
                      />
                      <div style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteListItem('calendar', 'events', idx)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '6px', minWidth: 32, display: 'inline-flex', justifyContent: 'center' }}
                          title="Delete Event"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: TIMETABLE & ROSTERS
              ======================================================== */}
          {activeTab === 'timetable' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Timetables, Teaching Schedules &amp; Clinical Rosters
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure 4-year BPT master academic timetables, daily clinical batches, and upload official PDF schedules.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Timetable Introductory Lead</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={data.timetable?.lead || ''}
                      onChange={(e) => handleTimetableChange('lead', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Clinical Protocol &amp; Attire Notice</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={data.timetable?.note || ''}
                      onChange={(e) => handleTimetableChange('note', e.target.value)}
                    />
                  </div>
                </div>

                {/* Year-by-Year BPT Schedules */}
                <h3 style={{ fontSize: 14, margin: '22px 0 12px', fontWeight: 700, color: '#0f172a' }}>
                  Year-Wise Schedules &amp; Downloadable Timetable PDFs
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {data.timetable?.years?.map((yr, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.6fr', gap: 12, marginBottom: 10 }}>
                        <div>
                          <label className="admin-label">Academic Year</label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontWeight: 700 }}
                            value={yr.year_name}
                            onChange={(e) => handleListChange('timetable', 'years', idx, 'year_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="admin-label">Daily Hours / Timings</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={yr.timing}
                            onChange={(e) => handleListChange('timetable', 'years', idx, 'timing', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="admin-label">Timetable PDF Link / Upload</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              type="text"
                              className="admin-input"
                              placeholder="URL to PDF"
                              value={yr.pdf_url || ''}
                              onChange={(e) => handleListChange('timetable', 'years', idx, 'pdf_url', e.target.value)}
                            />
                            <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                              </svg>
                              {uploadingYearPdf === idx ? 'Uploading...' : 'Upload'}
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                style={{ display: 'none' }}
                                onChange={(e) => handleUploadYearPdf(idx, e)}
                                disabled={uploadingYearPdf === idx}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label className="admin-label">Theory Core Subjects</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={yr.theory_subjects}
                            onChange={(e) => handleListChange('timetable', 'years', idx, 'theory_subjects', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="admin-label">Clinical Postings &amp; Practical Labs</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={yr.clinical_focus}
                            onChange={(e) => handleListChange('timetable', 'years', idx, 'clinical_focus', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Master Weekly Flow Schedule Grid */}
                <h3 style={{ fontSize: 14, margin: '24px 0 12px', fontWeight: 700, color: '#0f172a' }}>
                  Master Weekly Teaching &amp; Posting Schedule
                </h3>
                <div className="admin-grid-table">
                  <div
                    className="admin-grid-header"
                    style={{ gridTemplateColumns: '120px 1.5fr 1.5fr 1.5fr', gap: 10 }}
                  >
                    <span>Day / Session</span>
                    <span>09:00 AM – 11:00 AM (Theory)</span>
                    <span>11:15 AM – 01:15 PM (Practical / Lab)</span>
                    <span>02:00 PM – 04:30 PM (Clinical OPD)</span>
                  </div>

                  {data.timetable?.schedule_rows?.map((row, idx) => (
                    <div
                      key={idx}
                      className="admin-grid-row"
                      style={{ gridTemplateColumns: '120px 1.5fr 1.5fr 1.5fr', gap: 10 }}
                    >
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        value={row.day}
                        onChange={(e) => handleListChange('timetable', 'schedule_rows', idx, 'day', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={row.slot1}
                        onChange={(e) => handleListChange('timetable', 'schedule_rows', idx, 'slot1', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={row.slot2}
                        onChange={(e) => handleListChange('timetable', 'schedule_rows', idx, 'slot2', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={row.slot3}
                        onChange={(e) => handleListChange('timetable', 'schedule_rows', idx, 'slot3', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: EXAMINATION & NOTICES
              ======================================================== */}
          {activeTab === 'examination' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Examination Cell &amp; Evaluation Framework
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure MUHS attendance criteria, evaluation weightages, and publish examination circulars.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddNotice(!showAddNotice)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showAddNotice ? 'Cancel' : 'Add Exam Notice'}
                </button>
              </div>

              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Examination Cell Overview Lead</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={data.examination?.lead || ''}
                    onChange={(e) => handleExaminationChange('lead', e.target.value)}
                  />
                </div>

                {/* Attendance Rules */}
                <h3 style={{ fontSize: 14, margin: '20px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Mandatory Attendance Requirements (%)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Theory Minimum</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.examination?.attendance_rules?.theory_min || ''}
                      onChange={(e) => handleExamAttendanceChange('theory_min', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Practical Lab Minimum</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.examination?.attendance_rules?.practical_min || ''}
                      onChange={(e) => handleExamAttendanceChange('practical_min', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Clinical Posting Minimum</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.examination?.attendance_rules?.clinical_min || ''}
                      onChange={(e) => handleExamAttendanceChange('clinical_min', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Statutory Ordinance Note</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={data.examination?.attendance_rules?.note || ''}
                      onChange={(e) => handleExamAttendanceChange('note', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Standard of Passing Criteria</label>
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={data.examination?.passing_criteria || ''}
                      onChange={(e) => handleExaminationChange('passing_criteria', e.target.value)}
                    />
                  </div>
                </div>

                {/* Add Exam Notice Form */}
                {showAddNotice && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18, marginBottom: 20, marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: '#0f172a' }}>Publish New Exam Circular</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Enter notice details and attach PDF</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Circular Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Schedule for Second Internal Sessional Exams"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Notice Date</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. 15 Oct 2026"
                          value={newNotice.date}
                          onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Batch</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. All Batches"
                          value={newNotice.batch}
                          onChange={(e) => setNewNotice({ ...newNotice, batch: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                      <label className="admin-label">Notice Document (PDF)</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="/uploads/documents/... or URL"
                          value={newNotice.file_url}
                          onChange={(e) => setNewNotice({ ...newNotice, file_url: e.target.value })}
                        />
                        <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          {uploadingNoticeDoc ? 'Uploading...' : 'Upload PDF'}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setUploadingNoticeDoc(true)
                              try {
                                const url = await uploadService.uploadFile(file, 'documents')
                                if (url) setNewNotice(prev => ({ ...prev, file_url: url }))
                              } catch {
                                alert('Upload failed')
                              } finally {
                                setUploadingNoticeDoc(false)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddNotice(false)}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddNotice}>
                        Save Notice
                      </button>
                    </div>
                  </div>
                )}

                {/* Examination Notices Table Editor */}
                <h3 style={{ fontSize: 14, margin: '22px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Published Notices &amp; Circulars
                </h3>
                <div className="admin-grid-table">
                  <div
                    className="admin-grid-header"
                    style={{ gridTemplateColumns: '40px 2.5fr 1fr 1fr 1.6fr 44px', gap: 10 }}
                  >
                    <span>#</span>
                    <span>Circular Title</span>
                    <span>Date</span>
                    <span>Batch</span>
                    <span>Document PDF</span>
                    <span style={{ textAlign: 'center' }}>Del</span>
                  </div>

                  {data.examination?.notices?.map((n, idx) => (
                    <div
                      key={idx}
                      className="admin-grid-row"
                      style={{ gridTemplateColumns: '40px 2.5fr 1fr 1fr 1.6fr 44px', gap: 10 }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>#{idx + 1}</span>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Notice Title"
                        value={n.title}
                        onChange={(e) => handleListChange('examination', 'notices', idx, 'title', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Date"
                        value={n.date}
                        onChange={(e) => handleListChange('examination', 'notices', idx, 'date', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Batch"
                        value={n.batch}
                        onChange={(e) => handleListChange('examination', 'notices', idx, 'batch', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="PDF URL"
                        value={n.file_url || ''}
                        onChange={(e) => handleListChange('examination', 'notices', idx, 'file_url', e.target.value)}
                      />
                      <div style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteListItem('examination', 'notices', idx)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '6px', minWidth: 32, display: 'inline-flex', justifyContent: 'center' }}
                          title="Delete Notice"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: RESULTS & RECORDS
              ======================================================== */}
          {activeTab === 'results' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    University Examination Results &amp; Pass Records
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Publish MUHS university examination results, pass percentages, and revaluation rules.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddResult(!showAddResult)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showAddResult ? 'Cancel' : 'Add Result Record'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 14 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Official MUHS Results Portal URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.results?.portal_url || ''}
                      onChange={(e) => handleResultsChange('portal_url', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Verification Guidelines Note</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.results?.portal_notice || ''}
                      onChange={(e) => handleResultsChange('portal_notice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Revaluation &amp; Verification Procedure</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={data.results?.revaluation_rules || ''}
                    onChange={(e) => handleResultsChange('revaluation_rules', e.target.value)}
                  />
                </div>

                {/* Add Result Record Form */}
                {showAddResult && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: '#0f172a' }}>New Result Performance Entry</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Enter cohort pass stats</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Academic Year</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="2023 - 2024"
                          value={newResultRecord.year}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, year: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Exam Session</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Summer 2024 (Final BPT)"
                          value={newResultRecord.exam_session}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, exam_session: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Appeared Count</label>
                        <input
                          type="number"
                          className="admin-input"
                          placeholder="60"
                          value={newResultRecord.appeared}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, appeared: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Passed Count</label>
                        <input
                          type="number"
                          className="admin-input"
                          placeholder="58"
                          value={newResultRecord.passed}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, passed: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Distinction Count</label>
                        <input
                          type="number"
                          className="admin-input"
                          placeholder="10"
                          value={newResultRecord.distinction}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, distinction: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">First Class Count</label>
                        <input
                          type="number"
                          className="admin-input"
                          placeholder="40"
                          value={newResultRecord.first_class}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, first_class: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Pass Percentage</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="96.55%"
                          value={newResultRecord.pass_percentage}
                          onChange={(e) => setNewResultRecord({ ...newResultRecord, pass_percentage: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddResult(false)}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddResult}>
                        Save Result Entry
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Records List */}
                <h3 style={{ fontSize: 14, margin: '22px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Recorded Examination Batches &amp; Performance
                </h3>
                <div className="admin-grid-table">
                  <div
                    className="admin-grid-header"
                    style={{ gridTemplateColumns: '1.2fr 2fr 85px 85px 85px 85px 95px 44px', gap: 10 }}
                  >
                    <span>Academic Year</span>
                    <span>Exam Session</span>
                    <span>Appeared</span>
                    <span>Passed</span>
                    <span>Distinction</span>
                    <span>1st Class</span>
                    <span>Pass %</span>
                    <span style={{ textAlign: 'center' }}>Del</span>
                  </div>

                  {data.results?.records?.map((r, idx) => (
                    <div
                      key={idx}
                      className="admin-grid-row"
                      style={{ gridTemplateColumns: '1.2fr 2fr 85px 85px 85px 85px 95px 44px', gap: 10 }}
                    >
                      <input
                        type="text"
                        className="admin-input"
                        value={r.year}
                        onChange={(e) => handleListChange('results', 'records', idx, 'year', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={r.exam_session}
                        onChange={(e) => handleListChange('results', 'records', idx, 'exam_session', e.target.value)}
                      />
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Appeared"
                        value={r.appeared}
                        onChange={(e) => handleListChange('results', 'records', idx, 'appeared', e.target.value)}
                      />
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Passed"
                        value={r.passed}
                        onChange={(e) => handleListChange('results', 'records', idx, 'passed', e.target.value)}
                      />
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Dist"
                        value={r.distinction}
                        onChange={(e) => handleListChange('results', 'records', idx, 'distinction', e.target.value)}
                      />
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="1st Cl"
                        value={r.first_class}
                        onChange={(e) => handleListChange('results', 'records', idx, 'first_class', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        placeholder="Pass %"
                        value={r.pass_percentage}
                        onChange={(e) => handleListChange('results', 'records', idx, 'pass_percentage', e.target.value)}
                      />
                      <div style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteListItem('results', 'records', idx)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '6px', minWidth: 32, display: 'inline-flex', justifyContent: 'center' }}
                          title="Delete Record"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: ACADEMIC POLICIES
              ======================================================== */}
          {activeTab === 'policies' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Institutional Academic Policies &amp; Regulations
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Publish and update academic policies, codes of conduct, internship regulations, and upload signed PDF documents.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddPolicy(!showAddPolicy)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showAddPolicy ? 'Cancel' : 'Add Policy'}
                </button>
              </div>

              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Policies Overview Lead</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={data.policies?.lead || ''}
                    onChange={(e) => handlePoliciesChange('lead', e.target.value)}
                  />
                </div>

                {/* Add Policy Form */}
                {showAddPolicy && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: '#0f172a' }}>New Academic Policy</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Define regulatory policy details</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Policy Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Continuous Internal Assessment (CIA) Policy"
                          value={newPolicy.title}
                          onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Category</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Evaluation"
                          value={newPolicy.category}
                          onChange={(e) => setNewPolicy({ ...newPolicy, category: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: 12 }}>
                      <label className="admin-label">Summary / Regulatory Clause</label>
                      <textarea
                        className="admin-input"
                        rows={2}
                        placeholder="Outline key mandates, compliance rules, and authority..."
                        value={newPolicy.summary}
                        onChange={(e) => setNewPolicy({ ...newPolicy, summary: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Policy Document (PDF)</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="/uploads/documents/... or URL"
                          value={newPolicy.pdf_url}
                          onChange={(e) => setNewPolicy({ ...newPolicy, pdf_url: e.target.value })}
                        />
                        <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          {uploadingPolicyDoc ? 'Uploading...' : 'Upload PDF'}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setUploadingPolicyDoc(true)
                              try {
                                const url = await uploadService.uploadFile(file, 'documents')
                                if (url) setNewPolicy(prev => ({ ...prev, pdf_url: url }))
                              } catch {
                                alert('Upload failed')
                              } finally {
                                setUploadingPolicyDoc(false)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddPolicy(false)}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddPolicy}>
                        Save Policy
                      </button>
                    </div>
                  </div>
                )}

                {/* Policies List */}
                <h3 style={{ fontSize: 14, margin: '22px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Institutional Policies List ({data.policies?.items?.length || 0})
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {data.policies?.items?.map((pol, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12 }}>
                        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontWeight: 700, flex: 2 }}
                            value={pol.title}
                            placeholder="Policy Title"
                            onChange={(e) => handleListChange('policies', 'items', idx, 'title', e.target.value)}
                          />
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1 }}
                            placeholder="Category"
                            value={pol.category}
                            onChange={(e) => handleListChange('policies', 'items', idx, 'category', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '6px', minWidth: 32, display: 'inline-flex', justifyContent: 'center' }}
                          title="Delete Policy"
                          onClick={() => handleDeleteListItem('policies', 'items', idx)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      <textarea
                        className="admin-input"
                        rows={2}
                        style={{ marginBottom: 10 }}
                        placeholder="Policy Summary / Abstract"
                        value={pol.summary}
                        onChange={(e) => handleListChange('policies', 'items', idx, 'summary', e.target.value)}
                      />

                      <div>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Policy PDF URL (e.g. /uploads/documents/...)"
                          value={pol.pdf_url || ''}
                          onChange={(e) => handleListChange('policies', 'items', idx, 'pdf_url', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: STUDENT HANDBOOK
              ======================================================== */}
          {activeTab === 'handbook' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Student Handbook &amp; Institutional Code of Conduct
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Manage handbook chapters, upload complete student handbook PDF, and configure student support contacts.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowAddChapter(!showAddChapter)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showAddChapter ? 'Cancel' : 'Add Chapter'}
                </button>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Handbook Edition Text</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.handbook?.current_edition || ''}
                      onChange={(e) => handleHandbookChange('current_edition', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Complete Student Handbook PDF</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="/uploads/documents/... or file URL"
                        value={data.handbook?.pdf_url || ''}
                        onChange={(e) => handleHandbookChange('pdf_url', e.target.value)}
                      />
                      <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        {uploadingHandbookPdf ? 'Uploading...' : 'Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleUploadHandbookPdf}
                          disabled={uploadingHandbookPdf}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: 14 }}>
                  <label className="admin-label">Handbook Overview Lead</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={data.handbook?.lead || ''}
                    onChange={(e) => handleHandbookChange('lead', e.target.value)}
                  />
                </div>

                {/* Add Chapter Form */}
                {showAddChapter && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, margin: 0, fontWeight: 700, color: '#0f172a' }}>New Handbook Chapter</h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Define chapter number and outline</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Ch #</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="07"
                          value={newChapter.num}
                          onChange={(e) => setNewChapter({ ...newChapter, num: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Chapter Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Library & Learning Resource Center Regulations"
                          value={newChapter.title}
                          onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginTop: 12 }}>
                      <label className="admin-label">Chapter Description</label>
                      <textarea
                        className="admin-input"
                        rows={2}
                        placeholder="Outline subjects covered in this handbook chapter..."
                        value={newChapter.desc}
                        onChange={(e) => setNewChapter({ ...newChapter, desc: e.target.value })}
                      />
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setShowAddChapter(false)}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddChapter}>
                        Save Chapter
                      </button>
                    </div>
                  </div>
                )}

                {/* Chapters List */}
                <h3 style={{ fontSize: 14, margin: '22px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Handbook Chapters Outline
                </h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {data.handbook?.chapters?.map((ch, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ width: 64, fontWeight: 800, textAlign: 'center' }}
                            value={ch.num}
                            onChange={(e) => handleListChange('handbook', 'chapters', idx, 'num', e.target.value)}
                          />
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontWeight: 700, flex: 1 }}
                            value={ch.title}
                            onChange={(e) => handleListChange('handbook', 'chapters', idx, 'title', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '6px', minWidth: 32, display: 'inline-flex', justifyContent: 'center' }}
                          title="Delete Chapter"
                          onClick={() => handleDeleteListItem('handbook', 'chapters', idx)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <textarea
                        className="admin-input"
                        rows={2}
                        value={ch.desc}
                        onChange={(e) => handleListChange('handbook', 'chapters', idx, 'desc', e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* Support Contacts */}
                <h3 style={{ fontSize: 14, margin: '24px 0 10px', fontWeight: 700, color: '#0f172a' }}>
                  Student Affairs &amp; Academic Support Contacts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Dean / Principal Desk</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.handbook?.contact_support?.dean_office || ''}
                      onChange={(e) => handleHandbookContactChange('dean_office', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Examination Cell Email</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.handbook?.contact_support?.exam_cell || ''}
                      onChange={(e) => handleHandbookContactChange('exam_cell', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Student Welfare Officer Email</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.handbook?.contact_support?.student_welfare || ''}
                      onChange={(e) => handleHandbookContactChange('student_welfare', e.target.value)}
                    />
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
