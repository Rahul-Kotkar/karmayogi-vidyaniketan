import React, { useState, useEffect } from 'react'
import {
  departmentsService,
  pagesService,
  uploadService,
  getCachedDepartmentsData,
  setCachedDepartmentsData,
  getCachedAcademicYears,
  setCachedAcademicYears,
  clearLocalCache
} from '../../services/endpoints.js'
import {
  DEPARTMENTS_DATA,
  DEFAULT_ACADEMIC_YEARS,
  enrichDepartment
} from '../../data/departmentsData.js'
import DepartmentCard from '../../components/DepartmentCard.jsx'

export default function AdminDepartments() {
  const [academicYears, setAcademicYears] = useState(() => {
    return getCachedAcademicYears() || DEFAULT_ACADEMIC_YEARS
  })
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Department Modal State
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    slug: '',
    academic_year: '',
    head: '',
    tagline: '',
    image_url: '',
    icon: 'bone',
    subject_count: 4,
    specializations: '',
    description: '',
    order_index: 0
  })

  // Academic Year Modal State
  const [yearModalOpen, setYearModalOpen] = useState(false)
  const [editingYear, setEditingYear] = useState(null)
  const [yearForm, setYearForm] = useState({
    key: '',
    label: '',
    shortLabel: '',
    roman: 'Year I',
    subtitle: '',
    order_index: 1
  })

  // Load Years & Departments
  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Load Academic Years
      let loadedYears = DEFAULT_ACADEMIC_YEARS
      const yearsPageRes = await pagesService.getBySlug('academic_years')
      if (yearsPageRes?.content_html) {
        try {
          const parsedYears = JSON.parse(yearsPageRes.content_html)
          if (Array.isArray(parsedYears) && parsedYears.length > 0) {
            loadedYears = parsedYears
          }
        } catch {}
      } else {
        const cachedYears = getCachedAcademicYears()
        if (cachedYears && Array.isArray(cachedYears) && cachedYears.length > 0) {
          loadedYears = cachedYears
        }
      }
      setAcademicYears(loadedYears)
      setCachedAcademicYears(loadedYears)

      // 2. Load Departments
      let rawList = null
      const deptsPageRes = await pagesService.getBySlug('departments')
      if (deptsPageRes && deptsPageRes.content_html !== undefined && deptsPageRes.content_html !== null) {
        try {
          const parsedDepts = JSON.parse(deptsPageRes.content_html)
          if (Array.isArray(parsedDepts)) {
            rawList = parsedDepts
          }
        } catch {}
      }

      if (!rawList) {
        try {
          const apiData = await departmentsService.getAll()
          if (Array.isArray(apiData) && apiData.length > 0) {
            rawList = apiData
          }
        } catch {}
      }

      if (!rawList) {
        const cachedDepts = getCachedDepartmentsData()
        if (cachedDepts && Array.isArray(cachedDepts) && cachedDepts.length > 0) {
          rawList = cachedDepts
        }
      }

      if (!rawList) {
        rawList = DEPARTMENTS_DATA
      }

      const enrichedList = rawList.map(d => enrichDepartment(d)).filter(Boolean)
      setDepartments(enrichedList)
      setCachedDepartmentsData(enrichedList)
    } catch {
      setMsg({ text: 'Loaded departments with local fail-safe data', type: 'info' })
      const enrichedList = DEPARTMENTS_DATA.map(d => enrichDepartment(d))
      setDepartments(enrichedList)
      setCachedDepartmentsData(enrichedList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Helper to resolve year key
  const getDeptYearKey = (dept) => {
    if (!dept) return ''
    if (dept.academic_year !== undefined && dept.academic_year !== null) return String(dept.academic_year)
    if (dept.yearKey !== undefined && dept.yearKey !== null) return String(dept.yearKey)
    return ''
  }

  // --- Department Modal Handlers ---
  const handleOpenDeptModal = (d = null, preselectedYearKey = null) => {
    if (d) {
      setEditingDept(d)
      const rawSpecs = Array.isArray(d.specializations)
        ? d.specializations.join('\n')
        : String(d.specializations || '')

      setDeptForm({
        name: d.name || '',
        code: d.code || d.id?.toUpperCase() || '',
        slug: d.slug || d.id || '',
        academic_year: getDeptYearKey(d),
        head: d.head || '',
        tagline: d.tagline || d.shortName || '',
        subject_count: d.subject_count !== undefined ? Number(d.subject_count) : (d.relatedSubjectIds?.length || 4),
        specializations: rawSpecs,
        description: d.overview || d.description || d.desc || '',
        order_index: d.order_index || 0,
        image_url: d.image_url || d.bannerImage || d.photo || '',
        icon: d.icon || 'bone'
      })
    } else {
      setEditingDept(null)
      const defaultYear = preselectedYearKey || (activeTab !== 'all' ? activeTab : '')
      setDeptForm({
        name: '',
        code: '',
        slug: '',
        academic_year: defaultYear,
        head: '',
        tagline: '',
        subject_count: 4,
        specializations: "Spinal Assessment & Manual Therapy\nPeripheral Joint Mobilization\nPost-Surgical Orthopedic Rehabilitation",
        description: '',
        order_index: departments.length + 1,
        image_url: '',
        icon: 'bone'
      })
    }
    setDeptModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadService.uploadFile(file, 'departments')
      setDeptForm(prev => ({ ...prev, image_url: url }))
      setMsg({ text: 'Department banner photo uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveDepartment = async (e) => {
    e.preventDefault()
    try {
      const isGeneral = !deptForm.academic_year || deptForm.academic_year === 'none' || deptForm.academic_year === 'general'
      const yearMeta = isGeneral ? null : academicYears.find(y => y.key === deptForm.academic_year)
      const yearKey = isGeneral ? '' : deptForm.academic_year
      const yearLabel = isGeneral ? 'General / All Years' : (yearMeta?.shortLabel || yearMeta?.label || 'BPT')

      const specsArray = deptForm.specializations
        ? deptForm.specializations.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
        : []

      const rawTitle = (deptForm.name || 'Department').trim()
      const formattedTitle = /^Department of /i.test(rawTitle) ? rawTitle : `Department of ${rawTitle}`
      const rawCode = (deptForm.code || formattedTitle.replace(/^Department of\s+/i, '').slice(0, 4) || 'DEPT').trim().toUpperCase()

      const deptRecord = {
        id: editingDept?.id || deptForm.slug || rawCode.toLowerCase(),
        slug: deptForm.slug || rawCode.toLowerCase() || formattedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        code: rawCode,
        name: formattedTitle,
        shortName: formattedTitle.replace(/^Department of\s+/i, ''),
        academic_year: yearKey,
        yearKey: yearKey,
        yearLabel,
        head: deptForm.head.trim() || 'To be announced',
        tagline: deptForm.tagline.trim(),
        subject_count: Number(deptForm.subject_count) || 0,
        specializations: specsArray,
        overview: deptForm.description.trim(),
        description: deptForm.description.trim(),
        order_index: Number(deptForm.order_index) || 0,
        image_url: (deptForm.image_url || '').trim(),
        bannerImage: (deptForm.image_url || '').trim(),
        icon: deptForm.icon || 'bone'
      }

      let updatedList = []
      if (editingDept) {
        updatedList = departments.map(d => (d.id === editingDept.id || d.slug === editingDept.slug) ? { ...d, ...deptRecord } : d)
      } else {
        updatedList = [...departments, deptRecord]
      }

      const finalEnriched = updatedList.map(d => enrichDepartment(d))
      setDepartments(finalEnriched)
      setCachedDepartmentsData(finalEnriched)

      // Sync to backend pages table
      await pagesService.save({
        slug: 'departments',
        title: 'Academic & Clinical Departments',
        content_html: JSON.stringify(finalEnriched)
      })

      // Also attempt to sync to MySQL departments table
      try {
        const targetId = editingDept?.id || editingDept?.slug
        if (editingDept && targetId) {
          await departmentsService.update(targetId, {
            name: deptRecord.name,
            slug: deptRecord.slug,
            head: deptRecord.head,
            academic_year: deptRecord.academic_year,
            tagline: deptRecord.tagline,
            description: deptRecord.description,
            specializations: deptRecord.specializations,
            subject_count: deptRecord.subject_count,
            order_index: deptRecord.order_index
          })
        } else if (!editingDept) {
          await departmentsService.create({
            name: deptRecord.name,
            slug: deptRecord.slug,
            head: deptRecord.head,
            academic_year: deptRecord.academic_year,
            tagline: deptRecord.tagline,
            description: deptRecord.description,
            specializations: deptRecord.specializations,
            subject_count: deptRecord.subject_count,
            order_index: deptRecord.order_index
          })
        }
      } catch {}

      setMsg({
        text: editingDept ? `Department "${formattedTitle}" updated successfully.` : `New department "${formattedTitle}" created successfully!`,
        type: 'success'
      })
      setDeptModalOpen(false)
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save department', type: 'danger' })
    }
  }

  const handleDeleteDepartment = async (dept) => {
    if (!window.confirm(`Delete ${dept.name || 'this department'}?`)) return
    try {
      const targetSlug = dept.slug || dept.id
      const targetId = dept.id || dept.slug

      const updatedList = departments.filter(d =>
        d.id !== dept.id &&
        d.slug !== dept.slug &&
        d.id !== targetSlug &&
        d.slug !== targetId
      )
      setDepartments(updatedList)
      setCachedDepartmentsData(updatedList)

      // 1. Delete from MySQL departments table (pass numeric id or slug)
      try {
        if (targetId) {
          await departmentsService.delete(targetId)
        }
        if (targetSlug && targetSlug !== targetId) {
          await departmentsService.delete(targetSlug)
        }
      } catch (errApi) {
        console.warn('API departments delete error:', errApi)
      }

      // 2. Persist updated list to CMS pages table
      await pagesService.save({
        slug: 'departments',
        title: 'Academic & Clinical Departments',
        content_html: JSON.stringify(updatedList)
      })

      // 3. Clear local storage caches so reload does not restore deleted items
      clearLocalCache('page_departments')
      clearLocalCache('departments_data')
      setCachedDepartmentsData(updatedList)

      setMsg({ text: `Department "${dept.name}" removed successfully.`, type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete department', type: 'danger' })
    }
  }

  const handleMoveDepartmentYear = async (dept, targetYearKey) => {
    try {
      const targetYear = academicYears.find(y => y.key === targetYearKey)
      const updatedList = departments.map(d => {
        if (d.id === dept.id || d.slug === dept.slug) {
          return {
            ...d,
            academic_year: targetYearKey,
            yearKey: targetYearKey,
            yearLabel: targetYear?.shortLabel || targetYear?.label || 'BPT'
          }
        }
        return d
      })

      const finalEnriched = updatedList.map(d => enrichDepartment(d))
      setDepartments(finalEnriched)
      setCachedDepartmentsData(finalEnriched)

      await pagesService.save({
        slug: 'departments',
        title: 'Academic & Clinical Departments',
        content_html: JSON.stringify(finalEnriched)
      })

      // Also sync to MySQL departments table
      try {
        if (dept && typeof dept.id === 'number') {
          await departmentsService.update(dept.id, {
            academic_year: targetYearKey
          })
        }
      } catch {}

      setMsg({ text: `Moved "${dept.name}" to ${targetYear?.label || targetYearKey}.`, type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update department year', type: 'danger' })
    }
  }

  // --- Academic Year Modal Handlers ---
  const handleOpenYearModal = (y = null) => {
    if (y) {
      setEditingYear(y)
      setYearForm({
        key: y.key,
        label: y.label,
        shortLabel: y.shortLabel || y.label,
        roman: y.roman || 'Year I',
        subtitle: y.subtitle || '',
        order_index: y.order_index || 1
      })
    } else {
      setEditingYear(null)
      const nextNum = academicYears.length + 1
      const romanList = ['Year I', 'Year II', 'Year III', 'Year IV', 'Year V', 'Year VI']
      const nameList = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
      setYearForm({
        key: `year-${nextNum}`,
        label: `${nameList[nextNum - 1] || `${nextNum}th`} Year BPT`,
        shortLabel: `${nextNum}th Year BPT`,
        roman: romanList[nextNum - 1] || `Year ${nextNum}`,
        subtitle: 'Foundations and specialized clinical physiotherapy curriculum',
        order_index: nextNum
      })
    }
    setYearModalOpen(true)
  }

  const handleSaveAcademicYear = async (e) => {
    e.preventDefault()
    try {
      const yearRecord = {
        key: yearForm.key.trim().toLowerCase(),
        label: yearForm.label.trim(),
        shortLabel: yearForm.shortLabel.trim() || yearForm.label.trim(),
        roman: yearForm.roman.trim(),
        subtitle: yearForm.subtitle.trim(),
        order_index: Number(yearForm.order_index) || 1
      }

      let updatedYears = []
      if (editingYear) {
        updatedYears = academicYears.map(y => y.key === editingYear.key ? yearRecord : y)
      } else {
        if (academicYears.some(y => y.key === yearRecord.key)) {
          throw new Error(`Academic Year key "${yearRecord.key}" already exists. Please choose a unique key.`)
        }
        updatedYears = [...academicYears, yearRecord]
      }

      setAcademicYears(updatedYears)
      setCachedAcademicYears(updatedYears)

      await pagesService.save({
        slug: 'academic_years',
        title: 'Academic Curriculum Years',
        content_html: JSON.stringify(updatedYears)
      })

      setMsg({
        text: editingYear ? `Academic Year "${yearRecord.label}" updated.` : `New Academic Year "${yearRecord.label}" created!`,
        type: 'success'
      })
      setYearModalOpen(false)
      setActiveTab(yearRecord.key)
    } catch (err) {
      setMsg({ text: err.message || 'Error saving academic year', type: 'danger' })
    }
  }

  const handleDeleteAcademicYear = async (yearKey) => {
    const count = departments.filter(d => getDeptYearKey(d) === yearKey).length
    if (count > 0) {
      alert(`Cannot delete this year because it contains ${count} departments. Please delete or move the departments to another year first.`)
      return
    }

    if (!window.confirm(`Delete this academic year (${yearKey})?`)) return

    try {
      const updatedYears = academicYears.filter(y => y.key !== yearKey)
      setAcademicYears(updatedYears)
      setCachedAcademicYears(updatedYears)

      await pagesService.save({
        slug: 'academic_years',
        title: 'Academic Curriculum Years',
        content_html: JSON.stringify(updatedYears)
      })

      setMsg({ text: `Academic Year (${yearKey}) deleted.`, type: 'success' })
      setActiveTab('all')
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete academic year', type: 'danger' })
    }
  }

  // --- Reset to Standard 4-Year Catalog ---
  const handlePopulateStandardCatalog = async () => {
    if (!window.confirm("Restore the standard 8 BPT departments across all 4 academic years?")) return

    try {
      const fullList = DEPARTMENTS_DATA.map(d => enrichDepartment(d))
      setAcademicYears(DEFAULT_ACADEMIC_YEARS)
      setCachedAcademicYears(DEFAULT_ACADEMIC_YEARS)
      setDepartments(fullList)
      setCachedDepartmentsData(fullList)

      await pagesService.save({
        slug: 'academic_years',
        title: 'Academic Curriculum Years',
        content_html: JSON.stringify(DEFAULT_ACADEMIC_YEARS)
      })

      await pagesService.save({
        slug: 'departments',
        title: 'Academic & Clinical Departments',
        content_html: JSON.stringify(fullList)
      })

      setMsg({ text: 'Standard 4-Year BPT catalog restored successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to restore catalog', type: 'danger' })
    }
  }

  // Filter departments for search
  const filteredDepartments = departments.filter(d => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.code && d.code.toLowerCase().includes(q)) ||
      (d.head && d.head.toLowerCase().includes(q)) ||
      (d.tagline && d.tagline.toLowerCase().includes(q))
    )
  })

  // Selected year data if viewing a specific year tab
  const currentYear = academicYears.find(y => y.key === activeTab)
  const currentYearDepartments = currentYear
    ? filteredDepartments.filter(d => getDeptYearKey(d) === currentYear.key)
    : []

  // Preview object for live department card preview matching Screenshot 3
  const previewDept = {
    id: deptForm.code?.toLowerCase() || 'preview',
    code: deptForm.code?.toUpperCase() || 'MSK',
    name: deptForm.name ? (/^Department of /i.test(deptForm.name) ? deptForm.name : `Department of ${deptForm.name}`) : 'Department of Musculoskeletal Physiotherapy',
    tagline: deptForm.tagline || 'Specialized Orthopedic Assessment, Joint Mobilization & Musculoskeletal Rehabilitation',
    subject_count: Number(deptForm.subject_count) || 4,
    overview: deptForm.description || 'The Department of Musculoskeletal Physiotherapy is dedicated to advancing the clinical diagnosis, manual therapy, and therapeutic rehabilitation of conditions affecting the musculoskeletal system...',
    head: deptForm.head || 'Dr. A. B. Deshmukh',
    image_url: deptForm.image_url || '',
    bannerImage: deptForm.image_url || '',
    icon: deptForm.icon || 'bone',
    specializations: deptForm.specializations
      ? deptForm.specializations.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : [
          'Spinal Assessment & Manual Therapy (Cervical, Thoracic & Lumbo-Pelvic)',
          'Peripheral Joint Mobilization & Manipulation',
          'Post-Surgical Orthopedic Rehabilitation (TKR, THR, Arthroscopy, Fracture Fixation)'
        ]
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            Department Management
            <span className="admin-page-badge">Academic & Clinical Divisions</span>
          </h1>
          <p>
            Manage academic and clinical departments categorized by BPT curriculum academic year.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => handleOpenYearModal()}
          >
            + Add Academic Year
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleOpenDeptModal(null, activeTab !== 'all' ? activeTab : null)}
          >
            + Add Department
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      {/* Clean, Simple & Handy Year Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>All Departments</span>
          <span className="admin-tab-count">{departments.length}</span>
        </button>
        {academicYears.map(y => {
          const count = departments.filter(d => getDeptYearKey(d) === y.key).length
          return (
            <button
              key={y.key}
              className={`admin-tab-btn ${activeTab === y.key ? 'active' : ''}`}
              onClick={() => setActiveTab(y.key)}
            >
              <span>{y.shortLabel || y.label}</span>
              <span className="admin-tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Main Single Card Content */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Loading departments directory...
          </div>
        ) : activeTab === 'all' ? (
          /* ========================================================= */
          /* TAB: ALL DEPARTMENTS DIRECTORY                            */
          /* ========================================================= */
          <>
            <div className="admin-card-header">
              <div>
                <h3>All Departments Directory</h3>
                <span style={{ fontSize: 13, color: '#5c6672' }}>
                  Total: {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="admin-input"
                  style={{ width: 220, padding: '6px 12px', fontSize: 13 }}
                />
              </div>
            </div>

            <div className="admin-card-body" style={{ padding: 0 }}>
              {filteredDepartments.length === 0 ? (
                <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                  {searchQuery ? 'No departments match your search query.' : 'No departments available. Click "+ Add Department" to add one.'}
                </div>
              ) : (
                <table className="admin-table" key="all-departments-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Code</th>
                      <th>Department Title & Tagline</th>
                      <th style={{ width: 160 }}>Academic Year</th>
                      <th>Head of Department (HOD)</th>
                      <th style={{ width: 110 }}>Subjects</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((d, i) => {
                      const yearKey = getDeptYearKey(d)
                      const yearMeta = academicYears.find(y => y.key === yearKey)

                      return (
                        <tr key={`all-${d.id || d.slug}-${i}`}>
                          <td>
                            <span className="admin-badge badge-info">
                              {d.code || d.id?.toUpperCase() || 'DEPT'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {d.image_url && (
                                <img
                                  src={d.image_url}
                                  alt={d.name}
                                  style={{ width: 44, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                                />
                              )}
                              <div>
                                <strong style={{ color: '#071d3a', display: 'block' }}>{d.name}</strong>
                                {d.tagline && (
                                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                                    {d.tagline}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                              {yearMeta ? (yearMeta.shortLabel || yearMeta.label) : (yearKey ? yearKey : 'General / All Years')}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#334155', fontSize: 13 }}>
                              {d.head || 'To be announced'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#475569', fontSize: 13 }}>
                              {d.subject_count || 4} Subjects
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => handleOpenDeptModal(d)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteDepartment(d)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* TAB: SPECIFIC ACADEMIC YEAR VIEW                          */
          /* ========================================================= */
          currentYear && (
            <>
              <div className="admin-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="admin-badge badge-info">{currentYear.roman}</span>
                    <h3 style={{ margin: 0 }}>{currentYear.label}</h3>
                  </div>
                  {currentYear.subtitle && (
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                      {currentYear.subtitle}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => handleOpenDeptModal(null, currentYear.key)}
                  >
                    + Add Department to {currentYear.shortLabel || currentYear.label}
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => handleOpenYearModal(currentYear)}
                  >
                    Edit Year
                  </button>
                  {currentYearDepartments.length === 0 && (
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDeleteAcademicYear(currentYear.key)}
                      title="Delete academic year"
                    >
                      Delete Year
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-card-body" style={{ padding: 0 }}>
                {currentYearDepartments.length === 0 ? (
                  <div style={{ padding: '44px 20px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                      No departments uploaded under {currentYear.label} yet.
                    </p>
                    <p style={{ margin: '0 0 18px', fontSize: 13, color: '#64748b' }}>
                      Note: On the public website, only years with at least one uploaded department are displayed.
                    </p>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={() => handleOpenDeptModal(null, currentYear.key)}
                    >
                      + Upload First Department to {currentYear.label}
                    </button>
                  </div>
                ) : (
                  <table className="admin-table" key={`admin-dept-table-${activeTab}`}>
                    <thead>
                      <tr>
                        <th style={{ width: 80 }}>Code</th>
                        <th>Department Title & Tagline</th>
                        <th style={{ width: 140 }}>Academic Year</th>
                        <th>Head of Department (HOD)</th>
                        <th style={{ width: 110 }}>BPT Subjects</th>
                        <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentYearDepartments.map((d, i) => (
                        <tr key={`row-${activeTab}-${d.id || d.slug}-${i}`}>
                          <td>
                            <span className="admin-badge badge-info">
                              {d.code || d.id?.toUpperCase() || 'DEPT'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {d.image_url && (
                                <img
                                  src={d.image_url}
                                  alt={d.name}
                                  style={{ width: 44, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                                />
                              )}
                              <div>
                                <strong style={{ color: '#071d3a', display: 'block' }}>{d.name}</strong>
                                {d.tagline && (
                                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                                    {d.tagline}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                              {currentYear.shortLabel || currentYear.label}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#334155', fontSize: 13 }}>
                              {d.head || 'To be announced'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#475569', fontSize: 13 }}>
                              {d.subject_count || 4} Subjects
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => handleOpenDeptModal(d)}
                            >
                              Edit
                            </button>
                            <select
                              style={{
                                fontSize: 12,
                                padding: '4px 6px',
                                borderRadius: 4,
                                border: '1px solid #cbd5e1',
                                marginRight: 6,
                                background: '#fff',
                                color: '#334155'
                              }}
                              value={currentYear.key}
                              onChange={(e) => handleMoveDepartmentYear(d, e.target.value)}
                              title="Move department to another Academic Year"
                            >
                              {academicYears.map(ay => (
                                <option key={ay.key} value={ay.key}>
                                  Move to: {ay.roman || ay.shortLabel}
                                </option>
                              ))}
                            </select>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteDepartment(d)}
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
            </>
          )
        )}
      </div>

      {/* ========================================================================= */}
      {/* DEPARTMENT ADD / EDIT MODAL WITH LIVE PREVIEW (MATCHES SCREENSHOT 3)     */}
      {/* ========================================================================= */}
      {deptModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '1020px', width: '95%' }}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  {editingDept ? `Edit Department (${deptForm.name || 'Department'})` : 'Upload New Department'}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Provide department details. The card will render on the public website matching the preview.
                </p>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}
                onClick={() => setDeptModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveDepartment}>
              <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  {/* Left Column: Form Fields */}
                  <div>
                    {/* Academic Year Selection */}
                    <div className="admin-form-group">
                      <label style={{ fontWeight: 700 }}>Academic Year (Curriculum Placement)</label>
                      <select
                        className="admin-input"
                        value={deptForm.academic_year || ''}
                        onChange={e => setDeptForm({ ...deptForm, academic_year: e.target.value })}
                      >
                        <option value="">None / General (Not Year-Specific)</option>
                        {academicYears.map(y => (
                          <option key={y.key} value={y.key}>
                            {y.label} ({y.roman || y.shortLabel})
                          </option>
                        ))}
                      </select>
                      <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                        Optional: Assign to a specific curriculum year, or leave as General (All Years).
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Department Name *</label>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          value={deptForm.name}
                          onChange={e => {
                            const name = e.target.value
                            setDeptForm({
                              ...deptForm,
                              name,
                              slug: deptForm.slug || name.toLowerCase().replace(/^department of\s+/i, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                            })
                          }}
                          placeholder="e.g. Department of Musculoskeletal Physiotherapy"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Code Badge</label>
                        <input
                          type="text"
                          maxLength={8}
                          className="admin-input"
                          value={deptForm.code}
                          onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                          placeholder="e.g. MSK"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 700 }}>Tagline / Clinical Subtitle</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={deptForm.tagline}
                        onChange={e => setDeptForm({ ...deptForm, tagline: e.target.value })}
                        placeholder="e.g. Specialized Orthopedic Assessment, Joint Mobilization & Musculoskeletal Rehabilitation"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Department Banner Photo</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1, minWidth: 180 }}
                            value={deptForm.image_url || ''}
                            onChange={e => setDeptForm({ ...deptForm, image_url: e.target.value })}
                            placeholder="https://... or choose file to upload"
                          />
                          <label
                            className="admin-btn admin-btn-secondary"
                            style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0, padding: '7px 12px', fontSize: 13 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {deptForm.image_url && (
                            <button
                              type="button"
                              className="admin-btn admin-btn-outline"
                              style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                              onClick={() => setDeptForm({ ...deptForm, image_url: '' })}
                              title="Clear photo"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {uploadingImage && <div style={{ fontSize: 11, color: '#0284c7', marginTop: 3 }}>Uploading photo...</div>}
                        {deptForm.image_url && (
                          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={deptForm.image_url}
                              alt="Dept Preview"
                              style={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }}
                            />
                            <span style={{ fontSize: 11.5, color: '#15803d', fontWeight: 600 }}>Custom banner image active</span>
                          </div>
                        )}
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                          Displayed at the top of the card with the icon badge.
                        </span>
                      </div>

                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Card Icon</label>
                        <select
                          className="admin-input"
                          value={deptForm.icon || 'bone'}
                          onChange={e => setDeptForm({ ...deptForm, icon: e.target.value })}
                        >
                          <option value="bone">🦴 Bone / Ortho (MSK)</option>
                          <option value="brain">🧠 Brain / Neuro (Neurology)</option>
                          <option value="heart">❤️ Heart / Cardio (Cardiopulmonary)</option>
                          <option value="activity">🏃 Runner / Sports (Sports Physio)</option>
                          <option value="users">👥 Community / Care (CBR)</option>
                          <option value="zap">⚡ Lightning / Electro (Electrotherapy)</option>
                          <option value="compass">🧭 Compass / Movement (Kinesiology)</option>
                          <option value="book-open">📖 Book / Labs (Foundational)</option>
                          <option value="stethoscope">🩺 Stethoscope / General</option>
                        </select>
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                          Pinned dark-blue badge icon.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Head of Department (HOD)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={deptForm.head}
                          onChange={e => setDeptForm({ ...deptForm, head: e.target.value })}
                          placeholder="e.g. Dr. A. B. Deshmukh"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label style={{ fontWeight: 700 }}>Number of BPT Subjects</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          className="admin-input"
                          value={deptForm.subject_count}
                          onChange={e => setDeptForm({ ...deptForm, subject_count: e.target.value })}
                          placeholder="e.g. 4"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 700 }}>Key Focus Areas / Specializations</label>
                      <textarea
                        rows="3"
                        className="admin-textarea"
                        value={deptForm.specializations}
                        onChange={e => setDeptForm({ ...deptForm, specializations: e.target.value })}
                        placeholder={"Enter each specialization on a new line or comma-separated:\nSpinal Assessment & Manual Therapy\nPeripheral Joint Mobilization\nPost-Surgical Orthopedic Rehabilitation"}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                        Rendered as rounded pills at the bottom of the department card.
                      </span>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontWeight: 700 }}>Department Overview / Scope</label>
                      <textarea
                        rows="4"
                        className="admin-textarea"
                        value={deptForm.description}
                        onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                        placeholder="Comprehensive description of the department, clinical diagnosis, and physical rehabilitation..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Live Card Preview matching Screenshot 3 */}
                  <div>
                    <div style={{
                      position: 'sticky',
                      top: '10px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Live Preview (Website Card)
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Updates live
                        </span>
                      </div>

                      {/* Actual DepartmentCard Component Rendering */}
                      <DepartmentCard department={previewDept} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setDeptModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingDept ? 'Save Changes' : 'Upload Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACADEMIC YEAR ADD / EDIT MODAL                                            */}
      {/* ========================================================================= */}
      {yearModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '540px' }}>
            <div className="admin-modal-header">
              <h3>{editingYear ? `Edit Academic Year (${yearForm.roman})` : 'Add New Academic Year'}</h3>
              <button
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' }}
                onClick={() => setYearModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveAcademicYear}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label style={{ fontWeight: 700 }}>Year Identifier (Key) *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      disabled={!!editingYear}
                      value={yearForm.key}
                      onChange={e => setYearForm({ ...yearForm, key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="e.g. year-1, year-2, mpt-1"
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      {editingYear
                        ? 'Locked system key linking departments & curriculum to this year.'
                        : 'Unique internal slug (e.g. year-5, mpt-1) linking departments.'}
                    </span>
                  </div>

                  <div className="admin-form-group">
                    <label style={{ fontWeight: 700 }}>Roman Numeral / Badge *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={yearForm.roman}
                      onChange={e => setYearForm({ ...yearForm, roman: e.target.value })}
                      placeholder="e.g. Year I, Year II"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 700 }}>Year Title (Display on Website) *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={yearForm.label}
                    onChange={e => setYearForm({ ...yearForm, label: e.target.value })}
                    placeholder="e.g. First Year BPT"
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 700 }}>Short Label (For Tabs & Badges)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={yearForm.shortLabel}
                    onChange={e => setYearForm({ ...yearForm, shortLabel: e.target.value })}
                    placeholder="e.g. 1st Year BPT"
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 700 }}>Curriculum Scope / Subtitle</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    value={yearForm.subtitle}
                    onChange={e => setYearForm({ ...yearForm, subtitle: e.target.value })}
                    placeholder="e.g. Foundations of Human Biology, Movement Science & Anatomy"
                  />
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
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingYear ? 'Save Year Details' : 'Create Academic Year'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
