import React, { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { getDepartmentBySlug, getAllDepartments } from '../data/departmentsData.js'
import { getSubjectById } from '../data/subjectsData.js'

export default function DepartmentDetail() {
  const { slug } = useParams()
  const department = useMemo(() => getDepartmentBySlug(slug), [slug])
  const allDepartments = useMemo(() => getAllDepartments(), [])

  if (!department) {
    return (
      <div className="dept-detail-page">
        <Breadcrumb items={[{ label: 'Departments', path: '/departments' }, { label: 'Department Not Found' }]} />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2>Department Not Found</h2>
          <p style={{ color: '#64748b', marginTop: 10, marginBottom: 25 }}>
            The requested department could not be located in our academic directory.
          </p>
          <Link to="/departments" className="bpt-modal-btn-secondary" style={{ display: 'inline-block' }}>
            ← Back to All Departments
          </Link>
        </div>
      </div>
    )
  }

  // Get related subjects
  const relatedSubjects = (department.relatedSubjectIds || [])
    .map(id => getSubjectById(id))
    .filter(Boolean)

  // Other departments for sidebar / bottom navigation
  const otherDepartments = allDepartments.filter(d => d.slug !== department.slug)

  return (
    <PageShell
      title={department.name}
      breadcrumbs={[
        { label: 'Departments', path: '/departments' },
        { label: department.shortName || department.name }
      ]}
    >
      <div className="dept-detail-page">
        {/* Quick Meta Bar */}
        <div style={{ marginBottom: 24 }}>
          <div className="dept-quick-meta-bar" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div className="dept-meta-item">
              <span className="dept-meta-label" style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Head of Department</span>
              <span className="dept-meta-val" style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-header)' }}>{department.head || 'To be announced'}</span>
            </div>
            <div className="dept-meta-item">
              <span className="dept-meta-label" style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Affiliated Curriculum</span>
              <span className="dept-meta-val" style={{ fontSize: 14, fontWeight: 700, color: '#0066cc' }}>{relatedSubjects.length} BPT Subjects Mapped</span>
            </div>
            <div className="dept-meta-item">
              <span className="dept-meta-label" style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Clinical Partner</span>
              <span className="dept-meta-val" style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Attached Teaching Hospital</span>
            </div>
          </div>
        </div>

      {/* Institutional Placeholder Notice */}
      <div className="container" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div className="dept-verification-banner">
          <div className="dept-verify-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="dept-verify-text">
            <strong>Institutional Verification Notice:</strong> The faculty roster, laboratory instrumentation, and clinical postings 
            documented for this department represent standard MUHS prescribed departmental norms. Specific faculty appointments, 
            academic credentials, and equipment manifests are subject to final administrative verification by the college governing council.
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container dept-detail-container">
        <div className="dept-detail-grid">
          
          {/* Left / Main Content Column */}
          <main className="dept-main-col">
            
            {/* 1. Overview & Introduction */}
            <section className="dept-section-block" id="overview">
              <h2 className="dept-block-heading">
                <span className="dept-heading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </span>
                <span>Department Overview & Introduction</span>
              </h2>
              <p className="dept-prose-text">{department.overview}</p>
            </section>

            {/* 2. Vision, Objectives & Educational Goals */}
            <section className="dept-section-block" id="vision-objectives">
              <h2 className="dept-block-heading">
                <span className="dept-heading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </span>
                <span>Vision, Objectives & Educational Goals</span>
              </h2>
              {department.vision && (
                <div className="dept-vision-card">
                  <h3 className="dept-subheading">Departmental Vision</h3>
                  <p className="dept-vision-text">"{department.vision}"</p>
                </div>
              )}
              {department.objectives && department.objectives.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3 className="dept-subheading">Educational Objectives</h3>
                  <ul className="dept-check-list">
                    {department.objectives.map((obj, i) => (
                      <li key={i}>
                        <span className="dept-check-icon">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* 3. Scope & Importance in Physiotherapy */}
            {department.scopeImportance && (
              <section className="dept-section-block" id="scope">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </span>
                  <span>Scope & Importance in Modern Physiotherapy</span>
                </h2>
                <p className="dept-prose-text">{department.scopeImportance}</p>
              </section>
            )}

            {/* 4. Major Areas of Study & Specialization */}
            {department.specializations && department.specializations.length > 0 && (
              <section className="dept-section-block" id="specializations">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </span>
                  <span>Major Areas of Study & Clinical Specialization</span>
                </h2>
                <div className="dept-spec-grid">
                  {department.specializations.map((spec, i) => (
                    <div key={i} className="dept-spec-card">
                      <div className="dept-spec-num">0{i + 1}</div>
                      <div className="dept-spec-title">{spec}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Practical Learning & Clinical Applications */}
            {department.practicalLearning && (
              <section className="dept-section-block" id="practical-learning">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </span>
                  <span>Practical Learning & Clinical Applications</span>
                </h2>
                <p className="dept-prose-text">{department.practicalLearning}</p>
              </section>
            )}

            {/* 6. Laboratory Facilities & Equipment */}
            {department.laboratories && department.laboratories.length > 0 && (
              <section className="dept-section-block" id="laboratories">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                      <line x1="9" y1="22" x2="9" y2="22.01"/>
                      <line x1="15" y1="22" x2="15" y2="22.01"/>
                      <line x1="9" y1="6" x2="9" y2="6.01"/>
                      <line x1="15" y1="6" x2="15" y2="6.01"/>
                      <line x1="9" y1="10" x2="9" y2="10.01"/>
                      <line x1="15" y1="10" x2="15" y2="10.01"/>
                    </svg>
                  </span>
                  <span>Laboratory Facilities & Equipment</span>
                </h2>
                <div className="dept-labs-list">
                  {department.laboratories.map((lab, i) => (
                    <div key={i} className="dept-lab-card">
                      <h3 className="dept-lab-title">{lab.name}</h3>
                      <p className="dept-lab-desc">{lab.description}</p>
                      {lab.equipment && lab.equipment.length > 0 && (
                        <div className="dept-lab-equip-wrap">
                          <h4 className="dept-lab-equip-heading">Standard Equipment & Infrastructure:</h4>
                          <div className="dept-equip-pills">
                            {lab.equipment.map((item, j) => (
                              <span key={j} className="dept-equip-pill">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Clinical Exposure & Hospital Rotations */}
            {department.clinicalExposure && (
              <section className="dept-section-block" id="clinical-exposure">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                  </span>
                  <span>Clinical Exposure & Training Opportunities</span>
                </h2>
                <p className="dept-prose-text">{department.clinicalExposure}</p>
              </section>
            )}

            {/* 8. Student Learning Outcomes */}
            {department.learningOutcomes && department.learningOutcomes.length > 0 && (
              <section className="dept-section-block" id="outcomes">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </span>
                  <span>Student Learning Outcomes (SLOs)</span>
                </h2>
                <div className="dept-outcomes-list">
                  {department.learningOutcomes.map((slo, i) => (
                    <div key={i} className="dept-outcome-item">
                      <div className="dept-outcome-badge">SLO {i + 1}</div>
                      <p className="dept-outcome-text">{slo}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 9. Faculty Profiles */}
            <section className="dept-section-block" id="faculty">
              <h2 className="dept-block-heading">
                <span className="dept-heading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span>Departmental Faculty Profiles</span>
              </h2>
              <p className="dept-prose-text" style={{ marginBottom: 20 }}>
                Faculty members guiding academic instruction, practical demonstrations, and bedside clinical mentorship:
              </p>
              <div className="dept-faculty-grid">
                {department.faculty && department.faculty.map((f, i) => (
                  <div key={i} className="dept-faculty-card">
                    <div className="dept-faculty-avatar">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0b63e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="dept-faculty-info">
                      <h4 className="dept-faculty-name">{f.name}</h4>
                      <div className="dept-faculty-desig">{f.designation}</div>
                      <div className="dept-faculty-qual">{f.qualification}</div>
                      <div className="dept-faculty-exp">{f.experience}</div>
                      <div className="dept-faculty-placeholder-tag">
                        <span>{f.status || 'Verification Required'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. Related BPT Subjects with Links to Subjects Page */}
            {relatedSubjects.length > 0 && (
              <section className="dept-section-block" id="related-subjects">
                <h2 className="dept-block-heading">
                  <span className="dept-heading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </span>
                  <span>Related BPT Subjects in Curriculum</span>
                </h2>
                <p className="dept-prose-text" style={{ marginBottom: 18 }}>
                  The following subjects from the 4-year BPT program are conducted in coordination with this department:
                </p>
                <div className="dept-related-subjects-grid">
                  {relatedSubjects.map(sub => (
                    <div key={sub.id} className="dept-rel-sub-card">
                      <div className="dept-rel-sub-header">
                        <span className="bpt-abbr-badge">{sub.abbr}</span>
                        <span className="bpt-year-tag">{sub.yearLabel}</span>
                      </div>
                      <h4 className="dept-rel-sub-name">{sub.name}</h4>
                      <p className="dept-rel-sub-desc">{sub.description}</p>
                      <Link
                        to={`/academics/subjects?search=${encodeURIComponent(sub.name)}`}
                        className="dept-rel-sub-link"
                      >
                        <span>View Subject in Curriculum</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </main>

          {/* Right Sidebar: Navigation & Other Departments */}
          <aside className="dept-sidebar-col">
            <div className="dept-sticky-sidebar">
              
              {/* Quick Jump In-Page Menu */}
              <div className="dept-sidebar-card">
                <h3 className="dept-sidebar-title">On This Page</h3>
                <ul className="dept-jumplinks-list">
                  <li><a href="#overview">Overview & Introduction</a></li>
                  <li><a href="#vision-objectives">Vision & Objectives</a></li>
                  <li><a href="#scope">Scope & Clinical Importance</a></li>
                  <li><a href="#specializations">Major Specializations</a></li>
                  <li><a href="#laboratories">Laboratory Facilities</a></li>
                  <li><a href="#clinical-exposure">Clinical Exposure</a></li>
                  <li><a href="#outcomes">Learning Outcomes</a></li>
                  <li><a href="#faculty">Faculty Profiles</a></li>
                  {relatedSubjects.length > 0 && (
                    <li><a href="#related-subjects">Related BPT Subjects ({relatedSubjects.length})</a></li>
                  )}
                </ul>
              </div>

              {/* Related Academic Departments */}
              <div className="dept-sidebar-card">
                <h3 className="dept-sidebar-title">All Departments</h3>
                <ul className="dept-other-list">
                  {allDepartments.map(d => {
                    const isCurrent = d.slug === department.slug
                    return (
                      <li key={d.slug} className={isCurrent ? 'active-dept-item' : ''}>
                        <Link to={`/departments/${d.slug}`}>
                          <span>{d.shortName}</span>
                          {isCurrent && <span className="current-dot">•</span>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <div style={{ marginTop: 16 }}>
                  <Link to="/departments" className="dept-all-back-link">
                    ← Overview of All Departments
                  </Link>
                </div>
              </div>

              {/* Curriculum Quick Action */}
              <div className="dept-sidebar-card dept-cta-card">
                <h4 style={{ color: '#ffffff', fontSize: 16, marginBottom: 8 }}>BPT Subjects Directory</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 14 }}>
                  Browse the complete 34 BPT subject syllabus across all four academic years.
                </p>
                <Link to="/academics/subjects" className="dept-sidebar-cta-btn">
                  Explore BPT Subjects →
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
      </div>
    </PageShell>
  )
}
