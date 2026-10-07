import React, { useState, useEffect, useMemo } from 'react'
import PageShell from '../components/PageShell.jsx'
import { BPT_YEARS, BPT_SUBJECTS } from '../data/subjectsData.js'
import { pagesService, getCachedAcademicsData } from '../services/endpoints.js'

export default function AcademicsSubjects() {
  const [expandedSubjectIds, setExpandedSubjectIds] = useState({})

  // Dynamic subjects state loaded from database with fallback to defaults
  const [subjectsData, setSubjectsData] = useState(() => {
    const cached = getCachedAcademicsData()
    if (cached?.subjects && Array.isArray(cached.subjects.list) && cached.subjects.list.length > 0) {
      return {
        years: Array.isArray(cached.subjects.years) && cached.subjects.years.length > 0 ? cached.subjects.years : BPT_YEARS,
        list: cached.subjects.list
      }
    }
    return {
      years: BPT_YEARS,
      list: BPT_SUBJECTS
    }
  })

  useEffect(() => {
    pagesService.getBySlug('academics').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          if (parsed.subjects && Array.isArray(parsed.subjects.list) && parsed.subjects.list.length > 0) {
            setSubjectsData({
              years: Array.isArray(parsed.subjects.years) && parsed.subjects.years.length > 0 ? parsed.subjects.years : BPT_YEARS,
              list: parsed.subjects.list
            })
          }
        } catch {
          // Keep current state on parse failure
        }
      }
    }).catch(() => {})
  }, [])

  // Toggle single subject dropdown
  const toggleSubject = (id) => {
    setExpandedSubjectIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Toggle all subjects in a specific year
  const toggleAllInYear = (subjects) => {
    const allExpanded = subjects.every(s => expandedSubjectIds[s.id])
    setExpandedSubjectIds(prev => {
      const next = { ...prev }
      subjects.forEach(s => {
        next[s.id] = !allExpanded
      })
      return next
    })
  }

  // Group all subjects by year
  const yearGroups = useMemo(() => {
    const years = (subjectsData.years || BPT_YEARS).filter(y => y.key !== 'all')
    const list = subjectsData.list || BPT_SUBJECTS

    return years.map(year => {
      const subjectsInYear = list
        .filter(s => s.yearKey === year.key)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
      return {
        ...year,
        subjects: subjectsInYear
      }
    })
  }, [subjectsData])

  return (
    <PageShell title="BPT Subjects Curriculum — Academics">
      <div className="bpt-curriculum-page-wrap">
        {/* Main Content Area - Year-Wise Subjects Tables */}
        <section className="bpt-main-section" style={{ paddingTop: '10px', paddingBottom: '48px' }}>
        <div className="container">
          <div className="bpt-curriculum-flow">
            {yearGroups.map(group => {
              const allExpanded = group.subjects.length > 0 && group.subjects.every(s => expandedSubjectIds[s.id])

              return (
                <section key={group.key} className="bpt-year-section" id={group.key}>
                  {/* Year Header Strip */}
                  <div className="bpt-year-section-header">
                    <div className="bpt-year-header-inner">
                      <div className="bpt-year-title-wrap">
                        <span className="bpt-year-badge">{group.academicYear || group.shortLabel}</span>
                        <h2 className="bpt-year-title">{group.label}</h2>
                        <span className="bpt-year-subject-count">
                          {group.subjects.length} Subjects
                        </span>
                      </div>

                      <button
                        type="button"
                        className="bpt-dropdown-close-btn"
                        onClick={() => toggleAllInYear(group.subjects)}
                        aria-label={`${allExpanded ? 'Collapse' : 'Expand'} all subjects in ${group.label}`}
                      >
                        {allExpanded ? '▲ Collapse All' : '▼ Expand All'}
                      </button>
                    </div>

                    {group.description && (
                      <p className="bpt-year-lead">{group.description}</p>
                    )}
                  </div>

                  {/* Desktop/Tablet Year Table */}
                  <div className="bpt-year-table-wrapper">
                    <table className="bpt-year-table" aria-label={`Subjects for ${group.label}`}>
                      <thead>
                        <tr>
                          <th className="bpt-th-index">#</th>
                          <th className="bpt-th-code">Code</th>
                          <th className="bpt-th-name">Subject Name</th>
                          <th className="bpt-th-dept">Supervising Department</th>
                          <th className="bpt-th-action">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.subjects.map((subject, idx) => {
                          const isExpanded = Boolean(expandedSubjectIds[subject.id])
                          const deptDisplay = subject.departmentName || subject.department || 'Department of Physiotherapy'
                          const topicsList = Array.isArray(subject.keyTopics)
                            ? subject.keyTopics
                            : (Array.isArray(subject.topics) ? subject.topics : [])

                          return (
                            <React.Fragment key={subject.id}>
                              {/* Main Subject Row */}
                              <tr className={`bpt-table-row ${isExpanded ? 'is-expanded' : ''}`}>
                                <td className="bpt-td-center bpt-td-index">{subject.order || (idx + 1)}</td>
                                <td className="bpt-td-code">
                                  <span className="bpt-abbr-badge">{subject.abbr}</span>
                                </td>
                                <td className="bpt-td-name">
                                  <strong className="bpt-table-subject-title">{subject.name}</strong>
                                  <span className="bpt-table-dept-sub-mobile">{deptDisplay}</span>
                                </td>
                                <td className="bpt-td-dept">
                                  <span className="bpt-table-dept-name">{deptDisplay}</span>
                                </td>
                                <td className="bpt-td-center bpt-td-action">
                                  <button
                                    type="button"
                                    className={`bpt-table-details-btn ${isExpanded ? 'active' : ''}`}
                                    onClick={() => toggleSubject(subject.id)}
                                    aria-expanded={isExpanded}
                                    aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${subject.name}`}
                                  >
                                    <span>{isExpanded ? 'Hide' : 'Details'}</span>
                                    <svg
                                      className={`bpt-details-chevron ${isExpanded ? 'rotate-180' : ''}`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      width="15"
                                      height="15"
                                      aria-hidden="true"
                                    >
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>

                              {/* Expandable Dropdown Details Row */}
                              {isExpanded && (
                                <tr className="bpt-dropdown-row">
                                  <td colSpan={5} className="bpt-dropdown-cell">
                                    <div className="bpt-dropdown-pane">
                                      <div className="bpt-dropdown-header">
                                        <div className="bpt-dropdown-meta">
                                          <span className="bpt-abbr-badge-lg">{subject.abbr}</span>
                                          <h3 className="bpt-dropdown-title">{subject.name}</h3>
                                          <span className="bpt-dropdown-year-tag">{subject.yearLabel || group.label}</span>
                                        </div>
                                        <button
                                          type="button"
                                          className="bpt-dropdown-close-btn"
                                          onClick={() => toggleSubject(subject.id)}
                                          aria-label="Close details"
                                        >
                                          ✕ Close
                                        </button>
                                      </div>

                                      <div className="bpt-dropdown-body">
                                        {/* Overview Description */}
                                        <div className="bpt-dropdown-section">
                                          <h4 className="bpt-dropdown-heading">Subject Overview &amp; Curriculum Objectives</h4>
                                          <p className="bpt-dropdown-desc">{subject.description || subject.desc || 'Comprehensive syllabus modules covering theory, laboratory practicals, and clinical demonstration.'}</p>
                                        </div>

                                        {/* Key Syllabus Topics */}
                                        {topicsList.length > 0 && (
                                          <div className="bpt-dropdown-section">
                                            <h4 className="bpt-dropdown-heading">Core Syllabus Topics</h4>
                                            <div className="bpt-topics-pills">
                                              {topicsList.map((topic, tIdx) => (
                                                <span key={tIdx} className="bpt-topic-pill">{topic}</span>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Clinical Relevance */}
                                        {subject.clinicalRelevance && (
                                          <div className="bpt-dropdown-section">
                                            <h4 className="bpt-dropdown-heading">Clinical Relevance in Physiotherapy Practice</h4>
                                            <div className="bpt-dropdown-clinical">
                                              {subject.clinicalRelevance}
                                            </div>
                                          </div>
                                        )}

                                        {/* Supervising Department */}
                                        <div className="bpt-dropdown-footer">
                                          <div className="bpt-dropdown-dept-box">
                                            <span className="bpt-dept-lbl">Supervising Academic Department:</span>
                                            <strong className="bpt-dept-val">{deptDisplay}</strong>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  )
}
