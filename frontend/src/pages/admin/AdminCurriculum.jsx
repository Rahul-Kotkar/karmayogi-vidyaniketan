import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pagesService, cacheAcademicsData, getCachedAcademicsData } from '../../services/endpoints.js'
import { SCHOOL_LEVELS, SCHOOL_SUBJECTS } from '../../data/subjectsData.js'

const SCHOOL_LEVEL_OPTIONS = [
  { key: 'pre-primary', label: 'Pre-Primary Wing (Nursery, Jr/Sr KG)' },
  { key: 'primary', label: 'Primary School (Grades 1–5)' },
  { key: 'middle', label: 'Middle School (Grades 6–8)' },
  { key: 'secondary', label: 'Secondary School (Grades 9 & 10)' }
]

const DEPARTMENT_OPTIONS = [
  'Department of Foundational & Early Childhood Education',
  'Department of English Language & Linguistics',
  'Department of Regional & National Languages (Marathi & Hindi)',
  'Department of Mathematics & Computational Logic',
  'Department of Physical, Chemical & Biological Sciences',
  'Department of Social Sciences, History & Civics',
  'Department of Computer Science & Information Technology',
  'Department of STEM, AI & Robotics',
  'Department of Visual, Performing Arts & Culture',
  'Department of Physical Education, Yoga & Sports Science',
  'General School Academics'
]

const DEFAULT_INTRO = {
  title: 'Comprehensive Curriculum Structure',
  lead: 'At Karmayogi Vidyaniketan / Karmayogi Public School, the curriculum is structured to ensure a natural, progressive development of intellect, language, numerical fluency, scientific inquiry, and ethical sensitivity. We offer both CBSE and Maharashtra State Board tracks, allowing students to pursue national competitive benchmarks or state-focused academic pathways.'
}

const DEFAULT_COSCHOLASTIC = [
  { title: 'Physical & Health Education', desc: 'Daily athletics, team sports, yoga, fitness testing, and nutritional wellness.' },
  { title: 'Visual & Performing Arts', desc: 'Fine arts, drawing, clay modeling, vocal music, tabla, and folk dance.' },
  { title: 'AI, STEM & Robotics', desc: 'Hands-on engineering kits, electronic circuit prototyping, and coding.' },
  { title: 'Value Education & Ethics', desc: 'Indian cultural values, civic duty, empathy, environmental consciousness, and character.' }
]

export default function AdminCurriculum() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Full academics state container (so we preserve calendar, overview, methodologies, etc.)
  const [fullAcademics, setFullAcademics] = useState(null)

  // Curriculum specific fields
  const [curriculumIntro, setCurriculumIntro] = useState(DEFAULT_INTRO)
  const [subjectsList, setSubjectsList] = useState(SCHOOL_SUBJECTS)
  const [coscholastic, setCoscholastic] = useState(DEFAULT_COSCHOLASTIC)

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal State
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    abbr: '',
    yearKey: 'pre-primary',
    yearLabel: 'Pre-Primary Wing',
    order: 1,
    departmentName: DEPARTMENT_OPTIONS[0],
    description: '',
    keyTopics: ''
  })

  // Load live academics data
  useEffect(() => {
    async function fetchAcademics() {
      setLoading(true)
      try {
        const cached = getCachedAcademicsData()
        let parsed = cached

        if (!parsed) {
          const res = await pagesService.getBySlug('academics')
          if (res && res.content_html) {
            try {
              parsed = JSON.parse(res.content_html)
            } catch (err) {
              console.warn('Could not parse academics content_html JSON:', err)
            }
          }
        }

        if (parsed) {
          setFullAcademics(parsed)
          if (Array.isArray(parsed.subjects?.list) && parsed.subjects.list.length > 0) {
            setSubjectsList(parsed.subjects.list)
          }
          if (parsed.curriculum_intro) {
            setCurriculumIntro({
              title: parsed.curriculum_intro.title || DEFAULT_INTRO.title,
              lead: parsed.curriculum_intro.lead || DEFAULT_INTRO.lead
            })
          } else if (parsed.subjects?.title || parsed.subjects?.lead) {
            setCurriculumIntro({
              title: parsed.subjects.title || DEFAULT_INTRO.title,
              lead: parsed.subjects.lead || DEFAULT_INTRO.lead
            })
          }
          if (Array.isArray(parsed.curriculum_coscholastic) && parsed.curriculum_coscholastic.length > 0) {
            setCoscholastic(parsed.curriculum_coscholastic)
          }
        }
      } catch (err) {
        console.error('Failed to load curriculum data:', err)
        setMsg({ text: 'Notice: Using local defaults. Connect to database to persist changes.', type: 'info' })
      } finally {
        setLoading(false)
      }
    }

    fetchAcademics()

    const onAcademicsUpdated = (e) => {
      if (e?.detail) {
        setFullAcademics(e.detail)
        if (Array.isArray(e.detail.subjects?.list)) {
          setSubjectsList(e.detail.subjects.list)
        }
      }
    }
    window.addEventListener('academics_updated', onAcademicsUpdated)
    return () => window.removeEventListener('academics_updated', onAcademicsUpdated)
  }, [])

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingSubjectId(null)
    const nextOrder = subjectsList.length > 0
      ? Math.max(...subjectsList.map(s => Number(s.order) || 0)) + 1
      : 1

    setSubjectForm({
      name: '',
      abbr: '',
      yearKey: selectedLevel !== 'all' ? selectedLevel : 'pre-primary',
      yearLabel: (SCHOOL_LEVEL_OPTIONS.find(y => y.key === (selectedLevel !== 'all' ? selectedLevel : 'pre-primary'))?.label) || 'Pre-Primary Wing',
      order: nextOrder,
      departmentName: DEPARTMENT_OPTIONS[0],
      description: '',
      keyTopics: ''
    })
    setShowSubjectModal(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (subject) => {
    setEditingSubjectId(subject.id)
    const rawTopics = Array.isArray(subject.keyTopics)
      ? subject.keyTopics.join('\n')
      : (Array.isArray(subject.topics) ? subject.topics.join('\n') : (subject.keyTopics || ''))

    setSubjectForm({
      name: subject.name || '',
      abbr: subject.abbr || '',
      yearKey: subject.yearKey || 'pre-primary',
      yearLabel: subject.yearLabel || subject.yearKey || 'Pre-Primary Wing',
      order: subject.order || 1,
      departmentName: subject.departmentName || subject.department || DEPARTMENT_OPTIONS[0],
      description: subject.description || '',
      keyTopics: rawTopics
    })
    setShowSubjectModal(true)
  }

  // Save Subject modal form
  const handleSaveSubject = () => {
    if (!subjectForm.name.trim()) {
      alert('Please enter the Subject Name.')
      return
    }

    const topicsArray = subjectForm.keyTopics
      .split(/[\n,]+/)
      .map(t => t.trim())
      .filter(Boolean)

    const levelOpt = SCHOOL_LEVEL_OPTIONS.find(l => l.key === subjectForm.yearKey)

    const newSubject = {
      id: editingSubjectId || `subj_${Date.now()}`,
      order: Number(subjectForm.order) || 1,
      name: subjectForm.name.trim(),
      abbr: subjectForm.abbr.trim().toUpperCase() || 'SCH',
      yearKey: subjectForm.yearKey,
      yearLabel: levelOpt?.label || subjectForm.yearKey,
      departmentName: subjectForm.departmentName.trim(),
      description: subjectForm.description.trim(),
      keyTopics: topicsArray
    }

    let updatedList = [...subjectsList]
    if (editingSubjectId) {
      const idx = updatedList.findIndex(s => s.id === editingSubjectId)
      if (idx !== -1) {
        updatedList[idx] = { ...updatedList[idx], ...newSubject }
      } else {
        updatedList.push(newSubject)
      }
    } else {
      updatedList.push(newSubject)
    }

    setSubjectsList(updatedList)
    setShowSubjectModal(false)
    setEditingSubjectId(null)
    setMsg({ text: 'Subject updated in working draft. Remember to click "Save All Curriculum Changes" above to publish live!', type: 'info' })
  }

  // Delete subject
  const handleDeleteSubject = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the curriculum subject "${name}"?`)) {
      setSubjectsList(prev => prev.filter(s => s.id !== id))
      setMsg({ text: `Deleted "${name}" from working draft. Click "Save All Curriculum Changes" to publish.`, type: 'info' })
    }
  }

  // Save All Changes to Server
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })

    try {
      const payload = {
        ...(fullAcademics || {}),
        curriculum_intro: { ...curriculumIntro },
        curriculum_coscholastic: [...coscholastic],
        subjects: {
          title: curriculumIntro.title,
          lead: curriculumIntro.lead,
          list: subjectsList
        }
      }

      await pagesService.save({
        slug: 'academics',
        title: fullAcademics?.overview?.title || 'Academic Programs & Curriculum',
        content_html: JSON.stringify(payload),
        excerpt: (curriculumIntro.lead || 'Karmayogi Vidyaniketan School Curriculum').slice(0, 160)
      })

      cacheAcademicsData(payload)
      setFullAcademics(payload)

      // Notify public pages in real time
      window.dispatchEvent(new CustomEvent('academics_updated', { detail: payload }))

      setMsg({
        text: 'Curriculum & Subjects successfully saved! Live website updated instantly.',
        type: 'success'
      })
    } catch (err) {
      setMsg({
        text: 'Failed to save curriculum: ' + (err.message || 'Error occurred'),
        type: 'danger'
      })
    } finally {
      setSaving(false)
    }
  }

  // Filtered subjects
  const filteredSubjects = subjectsList
    .filter(sub => {
      const matchLevel = selectedLevel === 'all' || sub.yearKey === selectedLevel
      const q = searchTerm.trim().toLowerCase()
      const matchSearch = !q ||
        (sub.name && sub.name.toLowerCase().includes(q)) ||
        (sub.abbr && sub.abbr.toLowerCase().includes(q)) ||
        (sub.departmentName && sub.departmentName.toLowerCase().includes(q)) ||
        ((sub.keyTopics || []).some(t => t.toLowerCase().includes(q)))

      return matchLevel && matchSearch
    })
    .sort((a, b) => {
      if (a.yearKey !== b.yearKey) return a.yearKey.localeCompare(b.yearKey)
      return (Number(a.order) || 0) - (Number(b.order) || 0)
    })

  // Dynamic counts
  const countAll = subjectsList.length
  const countPre = subjectsList.filter(s => s.yearKey === 'pre-primary').length
  const countPri = subjectsList.filter(s => s.yearKey === 'primary').length
  const countMid = subjectsList.filter(s => s.yearKey === 'middle').length
  const countSec = subjectsList.filter(s => s.yearKey === 'secondary').length

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>School Curriculum &amp; Academic Framework</h1>
            <span className="admin-badge badge-info" style={{ fontSize: 11, padding: '3px 8px' }}>
              CBSE &amp; State Board • Nursery to Grade 10
            </span>
          </div>
          <p style={{ color: '#64748b', margin: '5px 0 0', fontSize: 13.5 }}>
            Configure the public Curriculum &amp; Academic Framework page (<code>/curriculum</code>): syllabus structure, integrated co-scholastic modules, and all grade-level subjects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            to="/curriculum"
            target="_blank"
            className="admin-btn admin-btn-secondary"
            style={{ padding: '9px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span>View Public Page</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Link>

          <button
            type="button"
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
            {saving ? 'Publishing Changes...' : 'Save All Curriculum Changes'}
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
          Loading curriculum framework...
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>

          {/* SECTION 1: TOP INTRO CARD */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                  1. Comprehensive Curriculum Structure (Top Banner)
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                  The introductory headline and pedagogical philosophy statement displayed at the very top of <code>/curriculum</code>.
                </p>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label className="admin-label">Curriculum Headline Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={curriculumIntro.title}
                  onChange={(e) => setCurriculumIntro({ ...curriculumIntro, title: e.target.value })}
                  placeholder="e.g. Comprehensive Curriculum Structure"
                />
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Framework Philosophy &amp; Dual Board Lead Statement</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={curriculumIntro.lead}
                  onChange={(e) => setCurriculumIntro({ ...curriculumIntro, lead: e.target.value })}
                  placeholder="Outline the CBSE and Maharashtra State Board dual pathways, natural progressive development, and cognitive milestones..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SUBJECTS DIRECTORY */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                  2. Curriculum Subjects Directory ({subjectsList.length} Subjects Configured)
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                  Manage subjects taught across Pre-Primary, Primary, Middle, and Secondary Wings matching the card grid on <code>/curriculum</code>.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAdd}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Add New Subject</span>
                </button>
              </div>
            </div>

            <div className="admin-card-body">
              {/* Filter Tabs & Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`admin-btn ${selectedLevel === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setSelectedLevel('all')}
                  >
                    All Levels ({countAll})
                  </button>
                  <button
                    type="button"
                    className={`admin-btn ${selectedLevel === 'pre-primary' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setSelectedLevel('pre-primary')}
                  >
                    Pre-Primary ({countPre})
                  </button>
                  <button
                    type="button"
                    className={`admin-btn ${selectedLevel === 'primary' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setSelectedLevel('primary')}
                  >
                    Primary 1–5 ({countPri})
                  </button>
                  <button
                    type="button"
                    className={`admin-btn ${selectedLevel === 'middle' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setSelectedLevel('middle')}
                  >
                    Middle 6–8 ({countMid})
                  </button>
                  <button
                    type="button"
                    className={`admin-btn ${selectedLevel === 'secondary' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                    onClick={() => setSelectedLevel('secondary')}
                  >
                    Secondary 9–10 ({countSec})
                  </button>
                </div>

                <div style={{ minWidth: 260 }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Search subjects, code, or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Subjects Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: 85 }}>Code</th>
                      <th>Subject Name</th>
                      <th>School Wing / Level</th>
                      <th>Supervising Department</th>
                      <th>Key Syllabus Topics</th>
                      <th style={{ width: 140, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748b' }}>
                          No curriculum subjects found matching the filter or search term.
                        </td>
                      </tr>
                    ) : (
                      filteredSubjects.map(sub => {
                        const topics = Array.isArray(sub.keyTopics) ? sub.keyTopics : (Array.isArray(sub.topics) ? sub.topics : [])
                        return (
                          <tr key={sub.id}>
                            <td>
                              <span className="admin-badge badge-info" style={{ fontWeight: 800 }}>
                                {sub.abbr || 'SCH'}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--navy-header)' }}>{sub.name}</strong>
                              {sub.description && (
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {sub.description}
                                </div>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
                                {sub.yearLabel || sub.yearKey}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, color: '#64748b' }}>
                                {sub.departmentName || sub.department || 'General Academics'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>
                                {topics.length} Key Topics
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-secondary admin-btn-sm"
                                  style={{ padding: '3px 8px', fontSize: 11.5 }}
                                  onClick={() => handleOpenEdit(sub)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-danger admin-btn-sm"
                                  style={{ padding: '3px 8px', fontSize: 11.5 }}
                                  onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 3: INTEGRATED CO-SCHOLASTIC CURRICULUM */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                  3. Integrated Co-Scholastic &amp; Value Education
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                  The 4 co-scholastic holistic development pillars shown at the bottom of the public <code>/curriculum</code> page.
                </p>
              </div>
            </div>

            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {coscholastic.map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div className="admin-form-group" style={{ marginBottom: 8 }}>
                      <label className="admin-label">Pillar #{idx + 1} Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...coscholastic]
                          updated[idx] = { ...updated[idx], title: e.target.value }
                          setCoscholastic(updated)
                        }}
                      />
                    </div>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label className="admin-label">Focus Activities Description</label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={item.desc}
                        onChange={(e) => {
                          const updated = [...coscholastic]
                          updated[idx] = { ...updated[idx], desc: e.target.value }
                          setCoscholastic(updated)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: ADD / EDIT SUBJECT */}
      {showSubjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 640 }}>
            <div className="admin-modal-header">
              <h3>{editingSubjectId ? 'Edit Curriculum Subject' : 'Add New Curriculum Subject'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowSubjectModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Subject Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Foundational Mathematics & Logic"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Code / Abbr *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. MATH-P1"
                    value={subjectForm.abbr}
                    onChange={(e) => setSubjectForm({ ...subjectForm, abbr: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="admin-form-group">
                  <label className="admin-label">School Wing / Grade Level *</label>
                  <select
                    className="admin-input"
                    value={subjectForm.yearKey}
                    onChange={(e) => setSubjectForm({
                      ...subjectForm,
                      yearKey: e.target.value,
                      yearLabel: SCHOOL_LEVEL_OPTIONS.find(y => y.key === e.target.value)?.label || e.target.value
                    })}
                  >
                    {SCHOOL_LEVEL_OPTIONS.map(lvl => (
                      <option key={lvl.key} value={lvl.key}>{lvl.label}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Display Sequence Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={subjectForm.order}
                    onChange={(e) => setSubjectForm({ ...subjectForm, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label className="admin-label">Supervising Discipline / Department</label>
                <select
                  className="admin-input"
                  value={subjectForm.departmentName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, departmentName: e.target.value })}
                >
                  {DEPARTMENT_OPTIONS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label className="admin-label">Subject Description &amp; Educational Purpose</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  placeholder="Outline how this subject is taught, pedagogical focus, and expected student outcomes..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                />
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Key Focus Topics (one per line)</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3..."
                  value={subjectForm.keyTopics}
                  onChange={(e) => setSubjectForm({ ...subjectForm, keyTopics: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
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
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
