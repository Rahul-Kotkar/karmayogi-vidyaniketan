import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import DepartmentCard from '../components/DepartmentCard.jsx'
import {
  DEPARTMENTS_DATA,
  DEFAULT_ACADEMIC_YEARS,
  enrichDepartment
} from '../data/departmentsData.js'
import {
  pagesService,
  departmentsService,
  getCachedDepartmentsData,
  getCachedAcademicYears
} from '../services/endpoints.js'

export default function Departments() {
  const [academicYears, setAcademicYears] = useState(() => {
    return getCachedAcademicYears() || DEFAULT_ACADEMIC_YEARS
  })

  const [departments, setDepartments] = useState(() => {
    const cached = getCachedDepartmentsData() || DEPARTMENTS_DATA
    return cached.map(d => enrichDepartment(d)).filter(Boolean)
  })

  const [filterQuery, setFilterQuery] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchDynamicData() {
      try {
        // 1. Fetch Dynamic Academic Years if configured
        const yearsPageRes = await pagesService.getBySlug('academic_years')
        if (yearsPageRes?.content_html) {
          try {
            const parsedYears = JSON.parse(yearsPageRes.content_html)
            if (Array.isArray(parsedYears) && parsedYears.length > 0 && isMounted) {
              setAcademicYears(parsedYears)
            }
          } catch {}
        }

        // 2. Fetch Dynamic Departments from CMS or API
        const pageRes = await pagesService.getBySlug('departments')
        if (pageRes?.content_html) {
          try {
            const parsed = JSON.parse(pageRes.content_html)
            if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
              setDepartments(parsed.map(d => enrichDepartment(d)).filter(Boolean))
              return
            }
          } catch {}
        }

        const deptRes = await departmentsService.getAll()
        if (Array.isArray(deptRes) && deptRes.length > 0 && isMounted) {
          setDepartments(deptRes.map(d => enrichDepartment(d)).filter(Boolean))
        }
      } catch {}
    }

    fetchDynamicData()
    return () => { isMounted = false }
  }, [])

  // Resolve which year a department belongs to
  const getDeptYearKey = (dept) => {
    if (!dept) return ''
    if (dept.academic_year !== undefined && dept.academic_year !== null) return String(dept.academic_year)
    if (dept.yearKey !== undefined && dept.yearKey !== null) return String(dept.yearKey)
    return ''
  }

  // Filter and group departments year-wise
  const q = filterQuery.toLowerCase().trim()
  const rawDepts = (Array.isArray(departments) && departments.length > 0 ? departments : DEPARTMENTS_DATA)
    .map(d => enrichDepartment(d))
    .filter(Boolean)

  const activeYearDefinitions = academicYears && academicYears.length > 0
    ? academicYears
    : DEFAULT_ACADEMIC_YEARS

  const filterDeptFn = (dept) => {
    if (!dept) return false
    if (!q) return true
    const name = String(dept.name || '').toLowerCase()
    const code = String(dept.code || '').toLowerCase()
    const tagline = String(dept.tagline || '').toLowerCase()
    const overview = String(dept.overview || dept.description || dept.desc || '').toLowerCase()
    const hod = String(dept.head || dept.hod || '').toLowerCase()
    const specs = Array.isArray(dept.specializations)
      ? dept.specializations.join(' ').toLowerCase()
      : typeof dept.specializations === 'string'
        ? dept.specializations.toLowerCase()
        : ''

    return (
      name.includes(q) ||
      code.includes(q) ||
      tagline.includes(q) ||
      overview.includes(q) ||
      hod.includes(q) ||
      specs.includes(q)
    )
  }

  const yearSections = activeYearDefinitions.map(yearDef => {
    const allDeptsInYear = rawDepts.filter(d => getDeptYearKey(d) === yearDef.key)
    const filteredDepts = allDeptsInYear.filter(filterDeptFn)

    return {
      ...yearDef,
      totalUploaded: allDeptsInYear.length,
      departments: filteredDepts
    }
  }).filter(section => {
    return section.totalUploaded > 0 && section.departments.length > 0
  })

  // General / Non-year-specific departments
  const allGeneralDepts = rawDepts.filter(d => {
    const yk = getDeptYearKey(d)
    return !yk || yk === 'none' || yk === 'general'
  })
  const filteredGeneralDepts = allGeneralDepts.filter(filterDeptFn)

  return (
    <PageShell title="Academic & Clinical Departments">
      <div className="departments-page-wrap">
        {/* Departments Directory Section */}
        <section className="dept-grid-section" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
          <div>
            <div className="dept-filter-bar" style={{ marginBottom: '36px' }}>
              <div>
                <p className="dept-section-lead" style={{ margin: 0, fontSize: 15 }}>
                  Explore our academic wings, science & STEM labs, sports, and language faculties.
                </p>
              </div>
            <div className="dept-search-wrap">
              <input
                type="text"
                placeholder="Search academic wings or subjects..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="dept-search-input"
                aria-label="Search departments"
              />
              {filterQuery && (
                <button
                  type="button"
                  className="dept-search-clear"
                  onClick={() => setFilterQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Year-Wise Arrangement & General Departments */}
          {(yearSections.length > 0 || filteredGeneralDepts.length > 0) ? (
            <div className="dept-years-container">
              {yearSections.map(section => (
                <div key={section.key} className="dept-year-block">
                  <div className="dept-year-header">
                    <div className="dept-year-header-left">
                      <div className="dept-year-badge">
                        <span>🏛️</span>
                        <span>{section.roman || section.shortLabel || section.label}</span>
                      </div>
                      <h2 className="dept-year-title">{section.label} Departments</h2>
                      {section.subtitle && (
                        <p className="dept-year-desc">{section.subtitle}</p>
                      )}
                    </div>
                    <div className="dept-year-count-pill">
                      {section.departments.length} {section.departments.length === 1 ? 'Department' : 'Departments'}
                    </div>
                  </div>

                  <div className="dept-cards-grid">
                    {section.departments.map(dept => (
                      <DepartmentCard key={dept.slug || dept.id || dept.code} department={dept} />
                    ))}
                  </div>
                </div>
              ))}

              {filteredGeneralDepts.length > 0 && (
                <div className="dept-year-block">
                  <div className="dept-year-header">
                    <div className="dept-year-header-left">
                      <div className="dept-year-badge">
                        <span>🏛️</span>
                        <span>General</span>
                      </div>
                      <h2 className="dept-year-title">Academic & Clinical Departments</h2>
                      <p className="dept-year-desc">Core departments and college-wide clinical training centers</p>
                    </div>
                    <div className="dept-year-count-pill">
                      {filteredGeneralDepts.length} {filteredGeneralDepts.length === 1 ? 'Department' : 'Departments'}
                    </div>
                  </div>

                  <div className="dept-cards-grid">
                    {filteredGeneralDepts.map(dept => (
                      <DepartmentCard key={dept.slug || dept.id || dept.code} department={dept} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="dept-empty-state">
              <div className="dept-empty-icon">🔍</div>
              <h3>No matching departments found</h3>
              <p>
                {filterQuery
                  ? `We couldn't find any department matching "${filterQuery}".`
                  : 'No academic departments are currently published.'}
              </p>
              {filterQuery && (
                <button
                  type="button"
                  className="dept-empty-reset-btn"
                  onClick={() => setFilterQuery('')}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}

        </div>
      </section>
      </div>
    </PageShell>
  )
}
