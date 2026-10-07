import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { COURSES as FALLBACK_COURSES, DEFAULT_ADMISSIONS_DATA, COLLEGE, getCourseAdmissionData } from '../data/collegeData.js'
import { coursesService, pagesService, noticesService, getCachedAdmissionsData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

export default function Admissions() {
  const location = useLocation()

  // 1. Initial State Prehydrated from Cache
  const [data, setData] = useState(() => {
    const cached = getCachedAdmissionsData()
    if (cached) {
      return {
        ...DEFAULT_ADMISSIONS_DATA,
        ...cached,
        courses_admissions: cached.courses_admissions || DEFAULT_ADMISSIONS_DATA.courses_admissions
      }
    }
    return DEFAULT_ADMISSIONS_DATA
  })

  const [courses, setCourses] = useState(FALLBACK_COURSES)
  const [selectedCourseKey, setSelectedCourseKey] = useState('')
  const [notices, setNotices] = useState([])

  // 2. Fetch Live Dynamic Data
  useEffect(() => {
    // 2.1 Fetch dynamic admissions CMS content
    pagesService
      .getBySlug('admissions')
      .then(page => {
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              courses_admissions: parsed.courses_admissions || prev.courses_admissions
            }))
          } catch {
            // Keep default structure
          }
        }
      })
      .catch(() => {})

    // 2.2 Fetch live courses from catalog
    coursesService
      .getAll()
      .then(list => {
        if (Array.isArray(list) && list.length > 0) {
          setCourses(list)
        }
      })
      .catch(() => {})

    // 2.3 Fetch live notices
    noticesService
      .getAll()
      .then(list => {
        if (Array.isArray(list)) setNotices(list)
      })
      .catch(() => {})

    // 2.4 Cross-tab storage listener for real-time admin sync
    const handleStorage = (e) => {
      if (e.key === 'cop_cache_admissions_data' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setData(prev => ({
            ...prev,
            ...parsed,
            courses_admissions: parsed.courses_admissions || prev.courses_admissions
          }))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 3. Sync URL Query Parameter (?course=mpt or ?course=bpt)
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search)
      const qCourse = params.get('course')
      if (qCourse) {
        setSelectedCourseKey(qCourse.toLowerCase().trim())
      }
    }
  }, [location.search])

  // 4. Resolve Active Courses List
  const activeCourses = (courses || []).filter(c => c.status !== 'Inactive')
  const effectiveCourses = activeCourses.length > 0 ? activeCourses : FALLBACK_COURSES
  const isSingleCourse = effectiveCourses.length <= 1

  // 5. Determine Active Course Key & Model
  const activeKey =
    selectedCourseKey ||
    (effectiveCourses[0]?.code || effectiveCourses[0]?.id || 'bpt').toLowerCase()

  const selectedCourse =
    effectiveCourses.find(c => {
      const ck = (c.code || c.id || '').toLowerCase()
      return ck === activeKey || String(c.id).toLowerCase() === activeKey
    }) || effectiveCourses[0]

  // 6. Resolve Active Course Admission Dataset
  const courseData = getCourseAdmissionData(data, selectedCourse) || {}

  // 7. Filter Admission-Related Notices
  const admissionNotices = notices.filter(
    n =>
      (n.category && n.category.toLowerCase().includes('admission')) ||
      (n.title && n.title.toLowerCase().includes('admission')) ||
      (n.title && n.title.toLowerCase().includes('bpt')) ||
      (n.title && n.title.toLowerCase().includes('mpt'))
  )
  const displayNotices = admissionNotices.length > 0 ? admissionNotices.slice(0, 5) : notices.slice(0, 4)

  // Quick switch helper
  const handleSelectCourse = (key) => {
    setSelectedCourseKey(key.toLowerCase())
  }

  // Mobile Accordion Dropdown States
  const [expandedFees, setExpandedFees] = useState({ 0: true })
  const [expandedCourses, setExpandedCourses] = useState({ 0: true })

  const toggleFeeAccordion = (idx) => {
    setExpandedFees(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const toggleCourseAccordion = (idx) => {
    setExpandedCourses(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <PageShell title="Admissions">
      <div className="admissions-single-page">
        {/* Intro Block */}
        <div className="admissions-intro-block">
          <h1 className="admissions-page-title">{data.intro_title || 'Admissions 2026–27'}</h1>
          <p className="admissions-page-lead">{data.intro_lead}</p>
        </div>

        {/* Program Selector Tabs (Multi-Course Mode) */}
        {!isSingleCourse && (
          <div className="admissions-program-bar">
            <span className="admissions-program-bar-label">Program:</span>
            <div className="admissions-program-tabs">
              {effectiveCourses.map(c => {
                const cKey = (c.code || c.id || '').toLowerCase()
                const isSel = activeKey === cKey || String(c.id).toLowerCase() === activeKey
                const isUG = (c.degree_level || 'UG').toUpperCase() === 'UG'

                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => handleSelectCourse(cKey)}
                    className={`admissions-program-tab ${isSel ? 'active' : ''}`}
                    aria-pressed={isSel}
                  >
                    <span className="admissions-tab-title">{c.name} ({c.code || c.id})</span>
                    <span className="admissions-tab-meta">
                      {c.duration || (isUG ? '4.5 Yrs' : '2 Yrs')} &bull; {c.intake || (isUG ? '60 Seats' : '20 Seats')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}


        {/* SECTION 1: ADMISSION PROCESS GUIDELINES */}
        <section id="process" className="admissions-section">
          <h2 className="admissions-section-title">1. Admission Process Guidelines</h2>
          <p className="admissions-section-intro">{courseData.process_intro}</p>

          <div className="admissions-process-timeline">
            {(courseData.process_steps || []).map((st, idx) => (
              <div key={idx} className="admissions-process-step">
                <div className="admissions-process-step-num">Step {idx + 1}</div>
                <h3 className="admissions-process-step-title">{st.title}</h3>
                <p className="admissions-process-step-desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: ELIGIBILITY CRITERIA */}
        <section id="eligibility" className="admissions-section">
          <h2 className="admissions-section-title">2. Eligibility Criteria</h2>
          <p className="admissions-section-intro">{courseData.eligibility_intro}</p>

          <div className="admissions-eligibility-info">
            <div className="admissions-meta-lead">
              <strong>Degree Program:</strong> {courseData.course_name} &nbsp;&bull;&nbsp; 
              <strong>Duration:</strong> {courseData.duration || selectedCourse.duration || '4.5 Years'} &nbsp;&bull;&nbsp; 
              <strong>Approved Intake:</strong> {courseData.intake || selectedCourse.intake || '60 Seats'} &nbsp;&bull;&nbsp;
              <strong>Affiliation:</strong> Maharashtra University of Health Sciences (MUHS), Nashik
            </div>

            <ul className="admissions-standard-list">
              {(courseData.eligibility_points || []).map((pt, pIdx) => (
                <li key={pIdx}>{pt}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 3: APPLICATION PROCEDURE */}
        <section id="application" className="admissions-section">
          <h2 className="admissions-section-title">3. Application Form &amp; Submission Procedure</h2>
          <p className="admissions-section-intro">{courseData.app_form_intro}</p>

          <div className="admissions-app-two-col">
            <div className="admissions-app-col">
              <h3 className="admissions-col-heading">{courseData.app_cap_title || 'Centralized CAP Application (State CET Cell)'}</h3>
              <ul className="admissions-standard-list">
                {(courseData.app_cap_points || []).map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className="admissions-app-col">
              <h3 className="admissions-col-heading">{courseData.app_college_title || 'College Institutional & Vacant Quota Application'}</h3>
              <ul className="admissions-standard-list">
                {(courseData.app_college_points || []).map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          {courseData.app_form_download_url && (
            <div className="admissions-action-row">
              <a
                href={resolveMediaUrl(courseData.app_form_download_url)}
                target="_blank"
                rel="noreferrer"
                className="admissions-btn-primary"
              >
                Download Institutional Admission Form (PDF)
              </a>
            </div>
          )}
        </section>

        {/* SECTION 4: ACADEMIC COURSES OFFERED & APPROVED INTAKE */}
        <section id="intake" className="admissions-section">
          <h2 className="admissions-section-title">
            {isSingleCourse ? '4. Course Offered & Sanctioned Intake' : '4. Academic Courses & Approved Intake'}
          </h2>
          <p className="admissions-section-intro">
            Professional degree programs approved by the Directorate of Medical Education and Research (DMER), Mumbai, Government of Maharashtra, and affiliated with Maharashtra University of Health Sciences (MUHS), Nashik:
          </p>

          {/* Desktop Table View */}
          <div className="admissions-desktop-table-wrap">
            <div className="admissions-table-container">
              <table className="admissions-data-table">
                <thead>
                  <tr>
                    <th>Degree Program</th>
                    <th>Course Code</th>
                    <th>Degree Level</th>
                    <th>Duration</th>
                    <th>Sanctioned Intake</th>
                    <th>Affiliating University</th>
                    {!isSingleCourse && <th style={{ textAlign: 'center' }}>Details</th>}
                  </tr>
                </thead>
                <tbody>
                  {effectiveCourses.map(c => {
                    const cKey = (c.code || c.id || '').toLowerCase()
                    const isCurrent = activeKey === cKey || String(c.id).toLowerCase() === activeKey

                    return (
                      <tr key={c.id || c.code} className={isCurrent ? 'admissions-row-active' : ''}>
                        <td data-label="Degree Program">
                          <strong>{c.name}</strong>
                          {isCurrent && !isSingleCourse && (
                            <span className="admissions-row-tag">Viewing</span>
                          )}
                        </td>
                        <td data-label="Course Code"><code>{c.code || c.id}</code></td>
                        <td data-label="Degree Level">{c.degree_level || 'UG'}</td>
                        <td data-label="Duration">{c.duration || '4.5 Years'}</td>
                        <td data-label="Sanctioned Intake"><strong>{c.intake || '60 Seats'}</strong></td>
                        <td data-label="Affiliating University">MUHS, Nashik</td>
                        {!isSingleCourse && (
                          <td data-label="Details" style={{ textAlign: 'center' }}>
                            {isCurrent ? (
                              <span className="admissions-viewing-text">Selected</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectCourse(cKey)}
                                className="admissions-table-btn"
                              >
                                Select &rarr;
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Accordion Dropdown View */}
          <div className="admissions-mobile-accordion-wrap">
            {effectiveCourses.map((c, idx) => {
              const cKey = (c.code || c.id || '').toLowerCase()
              const isCurrent = activeKey === cKey || String(c.id).toLowerCase() === activeKey
              const isOpen = !!expandedCourses[idx]
              return (
                <div key={c.id || c.code} className={`admissions-acc-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    onClick={() => toggleCourseAccordion(idx)}
                    className="admissions-acc-header"
                    aria-expanded={isOpen}
                  >
                    <div className="admissions-acc-title-group">
                      <span className="admissions-acc-title">{c.name}</span>
                      <span className="admissions-acc-preview">
                        <code>{c.code || c.id}</code> &bull; {c.duration || '4.5 Years'} &bull; {c.intake || '60 Seats'}
                      </span>
                    </div>
                    <span className="admissions-acc-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="admissions-acc-body">
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Course Code</span>
                        <span className="admissions-acc-val"><code>{c.code || c.id}</code></span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Degree Level</span>
                        <span className="admissions-acc-val">{c.degree_level || 'UG'}</span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Duration</span>
                        <span className="admissions-acc-val">{c.duration || '4.5 Years'}</span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Sanctioned Intake</span>
                        <span className="admissions-acc-val"><strong>{c.intake || '60 Seats'}</strong></span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Affiliating Body</span>
                        <span className="admissions-acc-val">MUHS, Nashik</span>
                      </div>
                      {!isSingleCourse && (
                        <div className="admissions-acc-row" style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
                          {isCurrent ? (
                            <span className="admissions-viewing-text">Selected Program</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectCourse(cKey)}
                              className="admissions-table-btn"
                            >
                              Select Program &rarr;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 5: FEE STRUCTURE */}
        <section id="fees" className="admissions-section">
          <h2 className="admissions-section-title">5. Fee Structure (Regulated by FRA, Maharashtra)</h2>
          <p className="admissions-section-intro">{courseData.fees_intro}</p>

          {/* Desktop Table View */}
          <div className="admissions-desktop-table-wrap">
            <div className="admissions-table-container">
              <table className="admissions-data-table">
                <thead>
                  <tr>
                    <th>Quota / Category</th>
                    <th>Tuition Fee</th>
                    <th>Development Fee</th>
                    <th>Total Approved Fee</th>
                    <th>Scholarship / Concession</th>
                    <th>Payable by Student</th>
                  </tr>
                </thead>
                <tbody>
                  {(courseData.fees_table || []).map((row, idx) => (
                    <tr key={idx}>
                      <td data-label="Quota / Category"><strong>{row.category}</strong></td>
                      <td data-label="Tuition Fee">{row.tuition_fee}</td>
                      <td data-label="Development Fee">{row.dev_fee}</td>
                      <td data-label="Total Approved Fee"><strong>{row.total_fee}</strong></td>
                      <td data-label="Scholarship / Concession">{row.scholarship}</td>
                      <td data-label="Payable by Student" className="admissions-fee-payable">
                        <strong>{row.payable}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Accordion Dropdown View */}
          <div className="admissions-mobile-accordion-wrap">
            {(courseData.fees_table || []).map((row, idx) => {
              const isOpen = !!expandedFees[idx]
              return (
                <div key={idx} className={`admissions-acc-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    onClick={() => toggleFeeAccordion(idx)}
                    className="admissions-acc-header"
                    aria-expanded={isOpen}
                  >
                    <div className="admissions-acc-title-group">
                      <span className="admissions-acc-title">{row.category}</span>
                      <span className="admissions-acc-preview">Payable: {row.payable}</span>
                    </div>
                    <span className="admissions-acc-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="admissions-acc-body">
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Tuition Fee</span>
                        <span className="admissions-acc-val">{row.tuition_fee}</span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Development Fee</span>
                        <span className="admissions-acc-val">{row.dev_fee}</span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Total Approved Fee</span>
                        <span className="admissions-acc-val"><strong>{row.total_fee}</strong></span>
                      </div>
                      <div className="admissions-acc-row">
                        <span className="admissions-acc-label">Scholarship / Concession</span>
                        <span className="admissions-acc-val">{row.scholarship}</span>
                      </div>
                      <div className="admissions-acc-row admissions-acc-total-row">
                        <span className="admissions-acc-label">Payable by Student</span>
                        <span className="admissions-acc-total-val">{row.payable}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {courseData.fees_notes && (
            <p className="admissions-note-text">
              <strong>Payment Advisory:</strong> {courseData.fees_notes}
            </p>
          )}
        </section>

        {/* SECTION 6: SCHOLARSHIPS (MAHADBT) */}
        <section id="scholarships" className="admissions-section">
          <h2 className="admissions-section-title">6. Scholarships &amp; Financial Concessions (MahaDBT)</h2>
          <p className="admissions-section-intro">{courseData.scholarships_intro}</p>

          <div className="admissions-scholarships-list">
            {(courseData.scholarships_list || []).map((sch, idx) => (
              <div key={idx} className="admissions-scholarship-row">
                <h3 className="admissions-scholarship-title">{sch.title}</h3>
                <p className="admissions-scholarship-desc">{sch.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: IMPORTANT DATES & ADMISSION SCHEDULE */}
        <section id="dates" className="admissions-section">
          <h2 className="admissions-section-title">7. Important Dates &amp; Admission Schedule</h2>
          <p className="admissions-section-intro">{courseData.dates_intro}</p>

          <div className="admissions-dates-list">
            {(courseData.dates_list || []).map((d, idx) => (
              <div key={idx} className="admissions-date-row">
                <div className="admissions-date-label">{d.title}</div>
                <div className="admissions-date-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: MANDATORY DOCUMENTS CHECKLIST */}
        <section id="documents" className="admissions-section">
          <h2 className="admissions-section-title">8. Mandatory Documents Checklist</h2>
          <p className="admissions-section-intro">{data.documents_intro}</p>

          <div className="admissions-docs-columns">
            {(data.documents_categories || []).map((cat, idx) => (
              <div key={idx} className="admissions-docs-column">
                <h3 className="admissions-col-heading">{cat.title}</h3>
                <ul className="admissions-standard-list">
                  {(cat.items || []).map((item, iIdx) => (
                    <li key={iIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: ADMISSION NOTICES & CIRCULARS */}
        <section id="circulars" className="admissions-section">
          <h2 className="admissions-section-title">9. Admission Notices &amp; Official Circulars</h2>
          <p className="admissions-section-intro">
            Official announcements, seat vacancy updates, and circulars concerning admissions:
          </p>

          {displayNotices.length > 0 ? (
            <div className="admissions-notices-list">
              {displayNotices.map(notice => (
                <div key={notice.id} className="admissions-notice-item">
                  <div className="admissions-notice-info">
                    <div className="admissions-notice-meta">
                      {notice.category || 'Admission'} &bull; {notice.notice_date || 'Recent'}
                    </div>
                    <div className="admissions-notice-title">{notice.title}</div>
                  </div>
                  <div>
                    {notice.file_url ? (
                      <a
                        href={resolveMediaUrl(notice.file_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="admissions-btn-outline"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <Link to="/notices" className="admissions-btn-outline">
                        View Notice
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="admissions-empty-note">
              No current admission notices posted. Please visit the notices section for general circulars.
            </p>
          )}

          <div style={{ marginTop: 14 }}>
            <Link to="/notices" className="admissions-inline-link">
              View All Institutional Notices &amp; Circulars &rarr;
            </Link>
          </div>
        </section>

        {/* SECTION 10: ADMISSION COUNSELING & HELPDESK */}
        <section id="helpdesk" className="admissions-section">
          <h2 className="admissions-section-title">{courseData.helpdesk_title || '10. Admission Counseling & Helpdesk'}</h2>
          <p className="admissions-section-intro">
            For inquiries regarding eligibility verification, course details, campus hostel accommodation, 
            or institutional counseling for <strong>{courseData.course_name}</strong>, contact the admission desk:
          </p>
          
          <div className="admissions-helpdesk-content">
            <div className="admissions-helpdesk-meta-row">
              <span className="admissions-meta-label">Helpline:</span>
              <span className="admissions-meta-val">{courseData.helpdesk_phone || data.helpdesk_phone || COLLEGE.phone}</span>
            </div>
            <div className="admissions-helpdesk-meta-row">
              <span className="admissions-meta-label">Email:</span>
              <span className="admissions-meta-val">{courseData.helpdesk_email || data.helpdesk_email || COLLEGE.email}</span>
            </div>
            <div className="admissions-helpdesk-meta-row">
              <span className="admissions-meta-label">Visiting Hours:</span>
              <span className="admissions-meta-val">{courseData.helpdesk_hours || data.helpdesk_hours || 'Monday – Saturday, 9:00 AM to 5:00 PM'}</span>
            </div>
            <div className="admissions-helpdesk-meta-row">
              <span className="admissions-meta-label">Campus Address:</span>
              <span className="admissions-meta-val">{courseData.helpdesk_address || data.helpdesk_address || COLLEGE.address}</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <Link to="/contact" className="admissions-btn-primary">
                Submit Online Admission Enquiry &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
