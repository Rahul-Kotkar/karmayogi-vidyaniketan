import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pagesService, uploadService, setCachedAcademicsData } from '../../services/endpoints.js'
import { SCHOOL_SUBJECTS } from '../../data/subjectsData.js'

export const SCHOOL_LEVEL_OPTIONS = [
  { key: 'pre-primary', label: 'Pre-Primary Wing (Nursery, Jr/Sr KG)' },
  { key: 'primary', label: 'Primary School (Grades 1 to 5)' },
  { key: 'middle', label: 'Middle School (Grades 6 to 8)' },
  { key: 'secondary', label: 'Secondary School (Grades 9 & 10)' }
]

export const SCHOOL_DEPARTMENT_OPTIONS = [
  'Department of Foundational & Early Childhood Education',
  'Department of Languages & Literature (English, Marathi, Hindi)',
  'Department of Mathematics & Vedic Math',
  'Department of Science & STEM Investigations',
  'Department of Social Sciences & Environmental Studies',
  'Department of Computer Science, AI & Robotics',
  'Department of Physical Education, Yoga & Sports',
  'Department of Visual Arts, Music & Cultural Expression'
]

const DEFAULT_SCHOOL_ACADEMICS = {
  overview: {
    badge: 'ACADEMIC EXCELLENCE • SHAPING YOUNG MINDS',
    title: 'A Balanced Journey of Knowledge, Character & Life Skills',
    lead: 'Karmayogi Vidyaniketan provides a structured and stimulating academic curriculum designed to develop foundational literacy, scientific inquiry, computational thinking, mathematical problem solving, and multilingual communication.',
    description: 'From our activity-based Pre-Primary classes through Grade 10 secondary board tracks, each stage of education is tailored to child development milestones.',
    stats: [
      { label: 'Grade Span', value: 'Nursery to Grade 10' },
      { label: 'Medium', value: 'English Medium' },
      { label: 'Curriculum Tracks', value: 'CBSE & Maharashtra State Board' },
      { label: 'Campus Atmosphere', value: 'Safe, Co-Educational' }
    ]
  },
  pre_primary: {
    badge: 'Ages 3 to 6 • Foundational Stage',
    title: 'Pre-Primary Wing (Nursery, Junior KG & Senior KG)',
    hero_image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    lead: 'At Karmayogi Vidyaniketan, our Pre-Primary wing comprises Nursery, Junior KG and Senior KG. We believe early childhood should be filled with laughter, sensory exploration, curiosity, and warmth. Our child-centric play-way curriculum lays a solid foundation in language, numbers, motor coordination, and social empathy.',
    campus_location: 'Isbavi, behind MSEDCL Division Office, Link Road, Pandharpur',
    classes: [
      { key: 'nursery', name: 'Nursery (Age 3+)', desc: 'Gentle introduction to social interaction, sensory sand/water play, finger painting, nursery rhymes, motor coordination, and daily routines.' },
      { key: 'jr_kg', name: 'Junior KG (Age 4+)', desc: 'Early phonics letter recognition, pre-writing patterns, counting 1 to 20, color & shape classification, storytelling, and structured games.' },
      { key: 'sr_kg', name: 'Senior KG (Age 5+)', desc: 'Phonic blending, sight word reading, simple sentence writing, addition basics, environmental curiosity, and smooth readiness for Grade 1.' }
    ],
    highlights: [
      { title: 'Safe & Ergonomic Environment', desc: 'Child-safe furniture, rounded corners, rubberized play mats, and sanitized classrooms.' },
      { title: 'Dedicated Outdoor Play Zone', desc: 'Slides, swings, sandpit, and mini athletics track designed for early gross-motor development.' },
      { title: 'Jolly Phonics Reading Program', desc: 'Multi-sensory synthetic phonics teaching kids to read independently through stories and actions.' },
      { title: 'Montessori Manipulative Kits', desc: 'Hands-on counting beads, wooden block towers, sorting trays, and tactile learning puzzles.' },
      { title: 'Kid Yoga & Music Circles', desc: 'Daily morning stretches, action songs, and percussion rhythm activities to build calm and poise.' },
      { title: 'Loving & Qualified Educators', desc: 'ECCE-certified teachers and caring support staff attending to every child\'s safety and well-being.' }
    ]
  },
  primary: {
    badge: 'Grades 1 to 5 • Preparatory Stage',
    title: 'Primary School Wing (Grades 1 to 5)',
    hero_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    lead: 'In the Primary School years at Karmayogi Vidyaniketan, children transition from foundational play into structured academic inquiry. Our curriculum focuses on solid reading and writing fundamentals across English, Marathi, and Hindi, mental math agility, scientific curiosity through environmental studies, and creative expression.',
    pillars: [
      { title: '1. Strong Language & Literacy', desc: 'Fluent reading, expressive creative writing, correct grammar, vocabulary enrichment, and public speaking in English, state language Marathi, and national language Hindi.' },
      { title: '2. Conceptual Math & Mental Agility', desc: 'Arithmetic operations, fractions, geometry, word problem solving, and mental calculation tricks that demystify numbers and cultivate computational confidence.' },
      { title: '3. Environmental & Scientific Discovery', desc: 'Observation of plant and animal life, weather patterns, natural resources, water conservation, and community health through engaging practical projects.' },
      { title: '4. Arts, Digital Skills & Athletics', desc: 'Junior computer laboratory classes, block coding, watercolor painting, clay sculpture, daily yoga, kabaddi, kho-kho, and athletic track races.' }
    ],
    highlights: [
      { title: 'Smart Interactive Classrooms', desc: 'Digital modules visualize complex ideas into interactive animations.' },
      { title: 'Individualized Remedial Support', desc: 'No child left behind; personalized teacher attention for reading and math.' },
      { title: 'Reading Circles & Library Time', desc: 'Weekly scheduled library hours fostering a lifelong habit of book reading.' },
      { title: 'Continuous Formative Assessment', desc: 'Assessment through observation and quizzes rather than exam stress.' },
      { title: 'Value Education & Morning Assembly', desc: 'Daily moral reflections, thought for the day, and national pledge.' },
      { title: 'Field Excursions & Nature Walks', desc: 'Regular educational tours connecting textbook topics with living nature.' }
    ]
  },
  secondary: {
    badge: 'Grades 6 to 10 • Middle & Secondary Stage',
    title: 'Secondary School Wing (Grades 6 to 10)',
    hero_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    lead: 'Structured academic learning with preparation for higher education under CBSE & State Board tracks. Intensive science labs, advanced mathematics, AI & Robotics, and mock exams.',
    campus_location: 'Main High School Campus, Shelve, Pandharpur',
    tracks: [
      { title: 'CBSE Curriculum Track', desc: 'National curriculum framework focusing on conceptual mastery in Science, Mathematics, English, and Social Sciences.' },
      { title: 'Maharashtra State Board Track', desc: 'State board curriculum with strong cultural grounding and proven academic scoring track record.' }
    ],
    highlights: [
      { title: 'Specialized Science Labs', desc: 'Dedicated practical sessions in Physics, Chemistry, Biology, and STEM laboratories.' },
      { title: 'AI, Coding & Robotics Hub', desc: 'Python programming, Scratch, micro-controller circuits, and robotic prototypes.' },
      { title: 'Board Prelim Mock Series', desc: 'Three full-length preliminary test series replicating actual board examination timing and assessment.' },
      { title: 'Olympiad & Scholarship Mentorship', desc: 'Coaching for NTSE, MTSE, Science & Math Olympiads, and Homi Bhabha Balvaidyanik exams.' },
      { title: 'Career & Stream Counseling', desc: 'Guidance on Stream Selection (Science, Commerce, Arts) and prestigious diploma/degree entries.' },
      { title: 'Sports & Personality Grooming', desc: 'Competitive inter-school tournaments, NCC/Scouts, public speaking, and leadership forums.' }
    ]
  },
  methodologies: [
    { title: 'Activity-Based Learning', desc: 'Hands-on projects, games, Montessori manipulatives, and tactile learning kits make abstract ideas tangible.' },
    { title: 'Smart Classroom Learning', desc: 'Interactive digital displays, 3D animated video modules, and audio-visual tools enhance retention.' },
    { title: 'Experiential Learning', desc: 'Real-world scientific observation, nature trails, museum visits, and agricultural field excursions.' },
    { title: 'STEM Education', desc: 'Cross-disciplinary science, technology, engineering, and mathematics projects solving real challenges.' },
    { title: 'Digital Learning', desc: 'Dedicated computer laboratory sessions, coding in Scratch & Python, and digital assignments.' },
    { title: 'Project-Based Learning', desc: 'Collaborative research and annual science exhibitions encouraging self-directed inquiry.' },
    { title: 'Collaborative Learning', desc: 'Peer study circles, team presentations, group problem solving, and respectful debate.' }
  ],
  examination: {
    title: 'Examination & Continuous Assessment System',
    lead: 'At Karmayogi Vidyaniketan, assessment is a tool for constructive learning and encouragement rather than anxiety. We follow Continuous and Comprehensive Evaluation (CCE) in harmony with CBSE and State Board directives.',
    components: [
      { title: 'Formative Assessments (FA)', desc: 'Continuous classroom observation, project portfolios, lab practical viva, quizzes, speaking skills (ASL), and creative assignments.' },
      { title: 'Summative Evaluations (SA)', desc: 'Term-end written examinations testing conceptual depth, mathematical application, problem solving, and analytical clarity.' },
      { title: 'Board Prelim Mock Series', desc: 'Rigorous full-length prelim examinations for Grade 10 students replicating exact board conditions with personalized feedback.' },
      { title: 'Parent Progress Conferences', desc: 'Quarterly Open House sessions where teachers and parents review student progress cards and design individualized support plans.' }
    ],
    notices: []
  },
  calendar: {
    academic_year: '2026–2027',
    calendar_pdf_url: null,
    events: [
      { date: '2026-06-15', activity: 'Academic Session 2026–27 Reopens (Grades 1 to 10)', category: 'Academic' },
      { date: '2026-06-22', activity: 'Pre-Primary Wing Joyful Welcoming & Orientation', category: 'Pre-Primary' },
      { date: '2026-08-15', activity: 'Independence Day Flag Hoisting & Patriotic Cultural Events', category: 'Celebration' },
      { date: '2026-09-05', activity: 'Teachers Day Celebrations & Student Leadership Role-play', category: 'School Event' },
      { date: '2026-10-10', activity: 'Term 1 / Mid-Term Summative Assessments (Grades 1–10)', category: 'Examination' },
      { date: '2026-11-14', activity: 'Children\'s Day Fair & Fun Carnival', category: 'Celebration' },
      { date: '2026-12-18', activity: 'Annual Science, STEM & Robotics Project Exhibition', category: 'Exhibition' },
      { date: '2027-01-08', activity: 'Annual Sports Meet & Athletics Championship Finals', category: 'Sports' },
      { date: '2027-01-26', activity: 'Republic Day Parade & Gymnastics Display', category: 'Celebration' },
      { date: '2027-02-15', activity: 'Grade 10 Board Prelim Mock Exam Series Phase 1', category: 'Examination' },
      { date: '2027-03-20', activity: 'Annual Day \'Karmotsav\' Cultural Evening', category: 'Annual Day' },
      { date: '2027-04-10', activity: 'Final Annual Examinations (Grades 1 to 9)', category: 'Examination' }
    ]
  },
  subjects: {
    title: 'Curriculum Subjects Directory',
    lead: 'Explore subjects taught across all developmental levels under CBSE & State Board tracks.',
    list: SCHOOL_SUBJECTS
  }
}

export default function AdminAcademics() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey })
  }

  const [data, setData] = useState(DEFAULT_SCHOOL_ACADEMICS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Subjects Management State
  const [subjectYearFilter, setSubjectYearFilter] = useState('all')
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    abbr: '',
    yearKey: 'pre-primary',
    yearLabel: 'Pre-Primary Wing (Nursery, Jr/Sr KG)',
    order: 1,
    departmentName: '',
    description: '',
    keyTopics: ''
  })

  // Calendar & Notice additions
  const [newEvent, setNewEvent] = useState({ date: '', activity: '', category: 'Academic' })
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newNotice, setNewNotice] = useState({ title: '', date: '', batch: '', file_url: '' })
  const [showAddNotice, setShowAddNotice] = useState(false)
  const [uploadingCalendarPdf, setUploadingCalendarPdf] = useState(false)
  const [uploadingImageKey, setUploadingImageKey] = useState(null)

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
              ...DEFAULT_SCHOOL_ACADEMICS,
              ...parsed,
              overview: { ...DEFAULT_SCHOOL_ACADEMICS.overview, ...(parsed.overview || {}) },
              pre_primary: {
                ...DEFAULT_SCHOOL_ACADEMICS.pre_primary,
                ...(parsed.pre_primary || {}),
                classes: Array.isArray(parsed.pre_primary?.classes) && parsed.pre_primary.classes.length > 0 ? parsed.pre_primary.classes : DEFAULT_SCHOOL_ACADEMICS.pre_primary.classes,
                highlights: Array.isArray(parsed.pre_primary?.highlights) && parsed.pre_primary.highlights.length > 0 ? parsed.pre_primary.highlights : DEFAULT_SCHOOL_ACADEMICS.pre_primary.highlights
              },
              primary: {
                ...DEFAULT_SCHOOL_ACADEMICS.primary,
                ...(parsed.primary || {}),
                pillars: Array.isArray(parsed.primary?.pillars) && parsed.primary.pillars.length > 0 ? parsed.primary.pillars : DEFAULT_SCHOOL_ACADEMICS.primary.pillars,
                highlights: Array.isArray(parsed.primary?.highlights) && parsed.primary.highlights.length > 0 ? parsed.primary.highlights : DEFAULT_SCHOOL_ACADEMICS.primary.highlights
              },
              secondary: {
                ...DEFAULT_SCHOOL_ACADEMICS.secondary,
                ...(parsed.secondary || {}),
                tracks: Array.isArray(parsed.secondary?.tracks) && parsed.secondary.tracks.length > 0 ? parsed.secondary.tracks : DEFAULT_SCHOOL_ACADEMICS.secondary.tracks,
                highlights: Array.isArray(parsed.secondary?.highlights) && parsed.secondary.highlights.length > 0 ? parsed.secondary.highlights : DEFAULT_SCHOOL_ACADEMICS.secondary.highlights
              },
              methodologies: Array.isArray(parsed.methodologies) && parsed.methodologies.length > 0 ? parsed.methodologies : DEFAULT_SCHOOL_ACADEMICS.methodologies,
              examination: {
                ...DEFAULT_SCHOOL_ACADEMICS.examination,
                ...(parsed.examination || {}),
                components: Array.isArray(parsed.examination?.components) && parsed.examination.components.length > 0 ? parsed.examination.components : DEFAULT_SCHOOL_ACADEMICS.examination.components,
                notices: Array.isArray(parsed.examination?.notices) ? parsed.examination.notices : []
              },
              calendar: {
                ...DEFAULT_SCHOOL_ACADEMICS.calendar,
                ...(parsed.calendar || {}),
                events: Array.isArray(parsed.calendar?.events) && parsed.calendar.events.length > 0 ? parsed.calendar.events : DEFAULT_SCHOOL_ACADEMICS.calendar.events
              },
              subjects: {
                ...DEFAULT_SCHOOL_ACADEMICS.subjects,
                ...(parsed.subjects || {}),
                list: Array.isArray(parsed.subjects?.list) && parsed.subjects.list.length > 0 ? parsed.subjects.list : DEFAULT_SCHOOL_ACADEMICS.subjects.list
              }
            }))
          } catch {
            // Keep default structured school data
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

  // Universal Section Handlers
  const handleSectionField = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Image Uploader Helper
  const handleUploadImage = async (section, field, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImageKey(`${section}_${field}`)
    try {
      const url = await uploadService.uploadFile(file, 'images')
      if (url) {
        handleSectionField(section, field, url)
      }
    } catch {
      alert('Image upload failed. Please try again.')
    } finally {
      setUploadingImageKey(null)
    }
  }

  // Upload Calendar PDF
  const handleUploadCalendarPdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCalendarPdf(true)
    try {
      const url = await uploadService.uploadFile(file, 'documents')
      if (url) {
        handleSectionField('calendar', 'calendar_pdf_url', url)
      }
    } catch {
      alert('Calendar PDF upload failed.')
    } finally {
      setUploadingCalendarPdf(false)
    }
  }

  // Subjects Management Handlers
  const handleOpenAddSubject = () => {
    const targetYear = subjectYearFilter !== 'all' ? subjectYearFilter : 'pre-primary'
    const currentList = data.subjects?.list || []
    const subjectsInTargetYear = currentList.filter(s => s.yearKey === targetYear)
    const maxOrder = subjectsInTargetYear.reduce((max, s) => Math.max(max, Number(s.order) || 0), 0)

    setEditingSubjectId(null)
    setSubjectForm({
      name: '',
      abbr: '',
      yearKey: targetYear,
      yearLabel: SCHOOL_LEVEL_OPTIONS.find(y => y.key === targetYear)?.label || targetYear,
      order: maxOrder + 1,
      departmentName: SCHOOL_DEPARTMENT_OPTIONS[0],
      description: '',
      keyTopics: ''
    })
    setShowSubjectModal(true)
  }

  const handleOpenEditSubject = (subj) => {
    setEditingSubjectId(subj.id)
    const topicsArr = Array.isArray(subj.keyTopics) ? subj.keyTopics : (Array.isArray(subj.topics) ? subj.topics : [])
    setSubjectForm({
      name: subj.name || '',
      abbr: subj.abbr || '',
      yearKey: subj.yearKey || 'pre-primary',
      yearLabel: subj.yearLabel || (SCHOOL_LEVEL_OPTIONS.find(y => y.key === subj.yearKey)?.label || 'Pre-Primary Wing'),
      order: subj.order || 1,
      departmentName: subj.departmentName || subj.department || '',
      description: subj.description || subj.desc || '',
      keyTopics: topicsArr.join('\n')
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
      abbr: subjectForm.abbr.trim().toUpperCase() || 'SCH',
      yearKey: subjectForm.yearKey,
      yearLabel: SCHOOL_LEVEL_OPTIONS.find(y => y.key === subjectForm.yearKey)?.label || subjectForm.yearKey,
      departmentName: subjectForm.departmentName.trim(),
      description: subjectForm.description.trim(),
      keyTopics: topicsArray
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

  // Calendar Event Handlers
  const handleAddEvent = () => {
    if (!newEvent.date.trim() || !newEvent.activity.trim()) return
    setData(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: [...(prev.calendar.events || []), { ...newEvent }]
      }
    }))
    setNewEvent({ date: '', activity: '', category: 'Academic' })
    setShowAddEvent(false)
  }

  const handleDeleteEvent = (idx) => {
    setData(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: prev.calendar.events.filter((_, i) => i !== idx)
      }
    }))
  }

  // Examination Notice Handlers
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

  const handleDeleteNotice = (idx) => {
    setData(prev => ({
      ...prev,
      examination: {
        ...prev.examination,
        notices: prev.examination.notices.filter((_, i) => i !== idx)
      }
    }))
  }

  // Methodology Handlers
  const handleMethodologyChange = (idx, field, value) => {
    setData(prev => {
      const list = [...(prev.methodologies || [])]
      list[idx] = { ...list[idx], [field]: value }
      return { ...prev, methodologies: list }
    })
  }

  const handleAddMethodology = () => {
    setData(prev => ({
      ...prev,
      methodologies: [
        ...(prev.methodologies || []),
        { title: 'New Teaching Methodology', desc: 'Description of teaching and pedagogical approach.' }
      ]
    }))
  }

  const handleDeleteMethodology = (idx) => {
    setData(prev => ({
      ...prev,
      methodologies: prev.methodologies.filter((_, i) => i !== idx)
    }))
  }

  // Global Save
  const handleSaveAll = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'academics',
        title: data.overview?.title || 'Academic Programs & Curriculum',
        content_html: JSON.stringify(data),
        excerpt: (data.overview?.lead || 'Karmayogi Vidyaniketan School Academics').slice(0, 160)
      })

      setCachedAcademicsData(data)
      window.dispatchEvent(new CustomEvent('academics_updated', { detail: data }))
      setMsg({ text: 'All Academics changes saved successfully! Live website updated.', type: 'success' })
    } catch (err) {
      setMsg({ text: 'Failed to save: ' + (err.message || 'Error occurred'), type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // Filtered Subjects
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
    if (a.yearKey !== b.yearKey) return a.yearKey.localeCompare(b.yearKey)
    return (Number(a.order) || 0) - (Number(b.order) || 0)
  })

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>Academics Administration</h1>
            <span className="admin-badge badge-info" style={{ fontSize: 11, padding: '3px 8px' }}>
              Nursery to Grade 10 • CBSE &amp; State Board
            </span>
          </div>
          <p style={{ color: '#64748b', margin: '5px 0 0', fontSize: 13.5 }}>
            Configure all 8 academic subdivisions: Academic Overview, Pre-Primary Wing, Primary School, Secondary School, Teaching Methodology, Examination Cell, Subjects Directory, and School Calendar.
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
          Loading school academics data...
        </div>
      ) : (
        <div>
          {/* Sub Navigation Tabs Matching User Dropdown 1-to-1 */}
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Academic Overview
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'pre-primary' ? 'active' : ''}`}
              onClick={() => handleTabChange('pre-primary')}
            >
              Pre-Primary (Nursery, Jr/Sr KG)
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'primary' ? 'active' : ''}`}
              onClick={() => handleTabChange('primary')}
            >
              Primary School (Grades 1–5)
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'secondary' ? 'active' : ''}`}
              onClick={() => handleTabChange('secondary')}
            >
              Secondary School (Grades 6–10)
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'methodology' ? 'active' : ''}`}
              onClick={() => handleTabChange('methodology')}
            >
              Teaching Methodology <span className="admin-tab-count">{data.methodologies?.length || 0}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'examination' ? 'active' : ''}`}
              onClick={() => handleTabChange('examination')}
            >
              Examination &amp; Assessment
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => handleTabChange('subjects')}
            >
              Curriculum Subjects <span className="admin-tab-count">{allSubjects.length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => handleTabChange('calendar')}
            >
              Academic Calendar <span className="admin-tab-count">{data.calendar?.events?.length || 0}</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: ACADEMIC OVERVIEW
              ======================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Academic Philosophy &amp; Institutional Overview
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Main academic heading, pedagogical philosophy statement, and institutional facts displayed on the Academic Overview page.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Top Banner Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.overview?.badge || ''}
                      onChange={(e) => handleSectionField('overview', 'badge', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Main Academic Headline</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.overview?.title || ''}
                      onChange={(e) => handleSectionField('overview', 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-label">Introductory Lead Statement</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={data.overview?.lead || ''}
                    onChange={(e) => handleSectionField('overview', 'lead', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 20 }}>
                  <label className="admin-label">Detailed Academic Philosophy</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={data.overview?.description || ''}
                    onChange={(e) => handleSectionField('overview', 'description', e.target.value)}
                  />
                </div>

                <h3 style={{ fontSize: 14.5, margin: '24px 0 12px', color: 'var(--navy-header)' }}>
                  Institutional Snapshot Stats &amp; Highlights
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  {(data.overview?.stats || []).map((st, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label" style={{ fontSize: 11 }}>Metric Label</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={st.label}
                          onChange={(e) => {
                            const updated = [...data.overview.stats]
                            updated[i] = { ...updated[i], label: e.target.value }
                            handleSectionField('overview', 'stats', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: 11 }}>Value</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={st.value}
                          onChange={(e) => {
                            const updated = [...data.overview.stats]
                            updated[i] = { ...updated[i], value: e.target.value }
                            handleSectionField('overview', 'stats', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: PRE-PRIMARY WING
              ======================================================== */}
          {activeTab === 'pre-primary' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Pre-Primary Wing (Nursery, Junior KG &amp; Senior KG)
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure the Foundational Stage (Ages 3–6), Montessori curriculum, sensory learning kits, and class details.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Stage &amp; Age Group Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.pre_primary?.badge || ''}
                      onChange={(e) => handleSectionField('pre_primary', 'badge', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Wing Headline Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.pre_primary?.title || ''}
                      onChange={(e) => handleSectionField('pre_primary', 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Hero Cover Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.pre_primary?.hero_image || ''}
                      onChange={(e) => handleSectionField('pre_primary', 'hero_image', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-input"
                      disabled={uploadingImageKey === 'pre_primary_hero_image'}
                      onChange={(e) => handleUploadImage('pre_primary', 'hero_image', e)}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-label">Campus Location Mention</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.pre_primary?.campus_location || ''}
                    onChange={(e) => handleSectionField('pre_primary', 'campus_location', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 20 }}>
                  <label className="admin-label">Foundational Learning Overview Text</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={data.pre_primary?.lead || ''}
                    onChange={(e) => handleSectionField('pre_primary', 'lead', e.target.value)}
                  />
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  The 3 Foundational Classes
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {(data.pre_primary?.classes || []).map((cls, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Class Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={cls.name}
                          onChange={(e) => {
                            const updated = [...data.pre_primary.classes]
                            updated[idx] = { ...updated[idx], name: e.target.value }
                            handleSectionField('pre_primary', 'classes', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Key Focus &amp; Curriculum</label>
                        <textarea
                          rows={3}
                          className="admin-textarea"
                          value={cls.desc}
                          onChange={(e) => {
                            const updated = [...data.pre_primary.classes]
                            updated[idx] = { ...updated[idx], desc: e.target.value }
                            handleSectionField('pre_primary', 'classes', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Pre-Primary Highlights &amp; Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                  {(data.pre_primary?.highlights || []).map((h, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Highlight Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={h.title}
                          onChange={(e) => {
                            const updated = [...data.pre_primary.highlights]
                            updated[i] = { ...updated[i], title: e.target.value }
                            handleSectionField('pre_primary', 'highlights', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Description</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={h.desc}
                          onChange={(e) => {
                            const updated = [...data.pre_primary.highlights]
                            updated[i] = { ...updated[i], desc: e.target.value }
                            handleSectionField('pre_primary', 'highlights', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: PRIMARY SCHOOL WING
              ======================================================== */}
          {activeTab === 'primary' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Primary School Wing (Grades 1 to 5)
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Preparatory Stage curriculum focusing on English, Marathi, Hindi literacy, mental math, science discovery, and creative arts.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Stage Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.primary?.badge || ''}
                      onChange={(e) => handleSectionField('primary', 'badge', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Wing Headline Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.primary?.title || ''}
                      onChange={(e) => handleSectionField('primary', 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Hero Cover Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.primary?.hero_image || ''}
                      onChange={(e) => handleSectionField('primary', 'hero_image', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-input"
                      disabled={uploadingImageKey === 'primary_hero_image'}
                      onChange={(e) => handleUploadImage('primary', 'hero_image', e)}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 20 }}>
                  <label className="admin-label">Primary Education Overview Text</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={data.primary?.lead || ''}
                    onChange={(e) => handleSectionField('primary', 'lead', e.target.value)}
                  />
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  4 Core Pillars of the Preparatory Stage
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {(data.primary?.pillars || []).map((pil, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Pillar Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={pil.title}
                          onChange={(e) => {
                            const updated = [...data.primary.pillars]
                            updated[idx] = { ...updated[idx], title: e.target.value }
                            handleSectionField('primary', 'pillars', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Focus Details</label>
                        <textarea
                          rows={3}
                          className="admin-textarea"
                          value={pil.desc}
                          onChange={(e) => {
                            const updated = [...data.primary.pillars]
                            updated[idx] = { ...updated[idx], desc: e.target.value }
                            handleSectionField('primary', 'pillars', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Primary Pedagogical Highlights
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                  {(data.primary?.highlights || []).map((h, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Feature Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={h.title}
                          onChange={(e) => {
                            const updated = [...data.primary.highlights]
                            updated[i] = { ...updated[i], title: e.target.value }
                            handleSectionField('primary', 'highlights', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Description</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={h.desc}
                          onChange={(e) => {
                            const updated = [...data.primary.highlights]
                            updated[i] = { ...updated[i], desc: e.target.value }
                            handleSectionField('primary', 'highlights', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: SECONDARY SCHOOL WING
              ======================================================== */}
          {activeTab === 'secondary' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Secondary School Wing (Grades 6 to 10)
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Middle &amp; Secondary stages under CBSE and Maharashtra State Board tracks, science practicals, advanced math, robotics, and board exam series.
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Stage Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.secondary?.badge || ''}
                      onChange={(e) => handleSectionField('secondary', 'badge', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Wing Headline Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.secondary?.title || ''}
                      onChange={(e) => handleSectionField('secondary', 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Hero Cover Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.secondary?.hero_image || ''}
                      onChange={(e) => handleSectionField('secondary', 'hero_image', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-input"
                      disabled={uploadingImageKey === 'secondary_hero_image'}
                      onChange={(e) => handleUploadImage('secondary', 'hero_image', e)}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-label">Secondary High School Campus Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.secondary?.campus_location || ''}
                    onChange={(e) => handleSectionField('secondary', 'campus_location', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 20 }}>
                  <label className="admin-label">Secondary Stage Lead Overview Text</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={data.secondary?.lead || ''}
                    onChange={(e) => handleSectionField('secondary', 'lead', e.target.value)}
                  />
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Affiliated Curriculum Board Tracks
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  {(data.secondary?.tracks || []).map((tr, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Track Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={tr.title}
                          onChange={(e) => {
                            const updated = [...data.secondary.tracks]
                            updated[idx] = { ...updated[idx], title: e.target.value }
                            handleSectionField('secondary', 'tracks', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Curriculum Description</label>
                        <textarea
                          rows={3}
                          className="admin-textarea"
                          value={tr.desc}
                          onChange={(e) => {
                            const updated = [...data.secondary.tracks]
                            updated[idx] = { ...updated[idx], desc: e.target.value }
                            handleSectionField('secondary', 'tracks', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Secondary Wing Highlights &amp; Facilities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                  {(data.secondary?.highlights || []).map((h, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Feature Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={h.title}
                          onChange={(e) => {
                            const updated = [...data.secondary.highlights]
                            updated[i] = { ...updated[i], title: e.target.value }
                            handleSectionField('secondary', 'highlights', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Description</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={h.desc}
                          onChange={(e) => {
                            const updated = [...data.secondary.highlights]
                            updated[i] = { ...updated[i], desc: e.target.value }
                            handleSectionField('secondary', 'highlights', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: TEACHING METHODOLOGY
              ======================================================== */}
          {activeTab === 'methodology' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Teaching Methodologies &amp; Modern Pedagogy
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure the 7 learner-centric teaching strategies: Activity-Based, Smart Classrooms, Experiential, STEM, Digital, Project-Based, and Collaborative Learning.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={handleAddMethodology}
                  >
                    + Add New Methodology
                  </button>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {(data.methodologies || []).map((m, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7' }}>
                          METHOD {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: '2px 8px', fontSize: 11 }}
                          onClick={() => handleDeleteMethodology(idx)}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Methodology Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={m.title}
                          onChange={(e) => handleMethodologyChange(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Methodology Description</label>
                        <textarea
                          rows={3}
                          className="admin-textarea"
                          value={m.desc}
                          onChange={(e) => handleMethodologyChange(idx, 'desc', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: EXAMINATION & ASSESSMENT
              ======================================================== */}
          {activeTab === 'examination' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Examination &amp; Continuous Assessment System
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Continuous and Comprehensive Evaluation (CCE) framework, Formative Assessments (FA), Summative Evaluations (SA), Prelim mock series, and examination circulars.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => setShowAddNotice(true)}
                  >
                    + Add Exam Notice / Circular
                  </button>
                </div>
              </div>

              <div className="admin-card-body">
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-label">Assessment Framework Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.examination?.title || ''}
                    onChange={(e) => handleSectionField('examination', 'title', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 24 }}>
                  <label className="admin-label">Assessment Lead Philosophy</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={data.examination?.lead || ''}
                    onChange={(e) => handleSectionField('examination', 'lead', e.target.value)}
                  />
                </div>

                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Continuous Evaluation Components
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {(data.examination?.components || []).map((cmp, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div className="admin-form-group" style={{ marginBottom: 8 }}>
                        <label className="admin-label">Component Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={cmp.title}
                          onChange={(e) => {
                            const updated = [...data.examination.components]
                            updated[idx] = { ...updated[idx], title: e.target.value }
                            handleSectionField('examination', 'components', updated)
                          }}
                        />
                      </div>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label">Evaluation Guidelines</label>
                        <textarea
                          rows={3}
                          className="admin-textarea"
                          value={cmp.desc}
                          onChange={(e) => {
                            const updated = [...data.examination.components]
                            updated[idx] = { ...updated[idx], desc: e.target.value }
                            handleSectionField('examination', 'components', updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exam Notices / Circulars */}
                <h3 style={{ fontSize: 14.5, margin: '20px 0 12px', color: 'var(--navy-header)' }}>
                  Official Examination Notices &amp; Schedules ({data.examination?.notices?.length || 0})
                </h3>

                {showAddNotice && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 13.5, color: '#1e3a8a' }}>Publish New Examination Circular</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Notice Title (e.g. Grade 10 Board Prelim Timetable 2026-27)"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      />
                      <input
                        type="date"
                        className="admin-input"
                        value={newNotice.date}
                        onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Target Batch (e.g. Grades 9 & 10)"
                        value={newNotice.batch}
                        onChange={(e) => setNewNotice({ ...newNotice, batch: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={handleAddNotice}
                      >
                        Add Circular
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setShowAddNotice(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {(data.examination?.notices?.length || 0) === 0 ? (
                  <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: 12, background: '#f8fafc', borderRadius: 6 }}>
                    No specific examination circulars posted currently. Click "+ Add Exam Notice" above to publish one.
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Circular / Notice Title</th>
                          <th>Target Batch</th>
                          <th style={{ width: 80, textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.examination.notices.map((nt, idx) => (
                          <tr key={idx}>
                            <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{nt.date || '—'}</td>
                            <td>{nt.title}</td>
                            <td><span className="admin-badge badge-info">{nt.batch || 'All Grades'}</span></td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                style={{ padding: '2px 8px', fontSize: 11 }}
                                onClick={() => handleDeleteNotice(idx)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: CURRICULUM SUBJECTS DIRECTORY
              ======================================================== */}
          {activeTab === 'subjects' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Curriculum Subjects Directory
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Manage all subjects taught across Pre-Primary, Primary, Middle School, and Secondary School under CBSE and State Board tracks.
                  </p>
                </div>
                <div>
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
                {/* Search & Wing Filter Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`admin-btn ${subjectYearFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                      onClick={() => setSubjectYearFilter('all')}
                    >
                      All Wings ({allSubjects.length})
                    </button>
                    {SCHOOL_LEVEL_OPTIONS.map(lvl => {
                      const count = allSubjects.filter(s => s.yearKey === lvl.key).length
                      return (
                        <button
                          key={lvl.key}
                          type="button"
                          className={`admin-btn ${subjectYearFilter === lvl.key ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
                          onClick={() => setSubjectYearFilter(lvl.key)}
                        >
                          {lvl.label.split('(')[0].trim()} ({count})
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ minWidth: 240 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Search subjects or code..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      style={{ padding: '6px 12px', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Subjects Grid Table */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 80 }}>Code</th>
                        <th>Subject Name</th>
                        <th>Wing / Level</th>
                        <th>Supervising Department</th>
                        <th>Key Topics</th>
                        <th style={{ width: 140, textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748b' }}>
                            No subjects found matching the filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSubjects.map(sub => {
                          const topicsArr = Array.isArray(sub.keyTopics) ? sub.keyTopics : (Array.isArray(sub.topics) ? sub.topics : [])
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
                                  {topicsArr.length} Focus Areas
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                    style={{ padding: '3px 8px', fontSize: 11.5 }}
                                    onClick={() => handleOpenEditSubject(sub)}
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
          )}

          {/* ========================================================
              TAB 8: ACADEMIC CALENDAR
              ======================================================== */}
          {activeTab === 'calendar' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>
                    Academic Calendar &amp; Annual Term Schedules
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    Configure the annual academic session, reopenings, vacation terms, sports day, and downloadable calendar PDF.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => setShowAddEvent(true)}
                  >
                    + Add Calendar Event
                  </button>
                </div>
              </div>

              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Academic Year</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={data.calendar?.academic_year || '2026–2027'}
                      onChange={(e) => handleSectionField('calendar', 'academic_year', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Downloadable Calendar PDF Document</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="PDF File URL..."
                        value={data.calendar?.calendar_pdf_url || ''}
                        onChange={(e) => handleSectionField('calendar', 'calendar_pdf_url', e.target.value)}
                      />
                      <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0 }}>
                        {uploadingCalendarPdf ? 'Uploading...' : 'Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          style={{ display: 'none' }}
                          disabled={uploadingCalendarPdf}
                          onChange={handleUploadCalendarPdf}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Add Event Form */}
                {showAddEvent && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--navy-header)' }}>Add Academic Event</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12, marginBottom: 12 }}>
                      <input
                        type="date"
                        className="admin-input"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Event Activity (e.g. Term 1 Summative Assessment)"
                        value={newEvent.activity}
                        onChange={(e) => setNewEvent({ ...newEvent, activity: e.target.value })}
                      />
                      <select
                        className="admin-input"
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      >
                        <option value="Academic">Academic</option>
                        <option value="Pre-Primary">Pre-Primary</option>
                        <option value="Celebration">Celebration</option>
                        <option value="School Event">School Event</option>
                        <option value="Examination">Examination</option>
                        <option value="Sports">Sports</option>
                        <option value="Annual Day">Annual Day</option>
                        <option value="Vacation">Vacation</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={handleAddEvent}
                      >
                        Save Event
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setShowAddEvent(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Events Table */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 120 }}>Date</th>
                        <th>Event &amp; Academic Activity</th>
                        <th style={{ width: 140 }}>Category</th>
                        <th style={{ width: 80, textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.calendar?.events || []).map((ev, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{ev.date}</td>
                          <td>{ev.activity}</td>
                          <td>
                            <span className="admin-badge badge-info">{ev.category || 'Academic'}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              style={{ padding: '2px 8px', fontSize: 11 }}
                              onClick={() => handleDeleteEvent(idx)}
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
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT SUBJECT
          ======================================================== */}
      {showSubjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: 640 }}>
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

            <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Subject Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Foundational Mathematics &amp; Logic"
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
                  {SCHOOL_DEPARTMENT_OPTIONS.map(dept => (
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
