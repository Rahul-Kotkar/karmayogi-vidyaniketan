import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_ACADEMICS_DATA } from '../data/collegeData.js'
import { pagesService, getCachedAcademicsData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

const ACADEMICS_SUBMENUS = [
  { label: "Subjects", slug: "subjects", path: "/academics/subjects", desc: "Complete 34 BPT course curriculum grouped across all 4 academic years with syllabus details." },
  { label: "Academic Calendar", slug: "academic-calendar", path: "/academics/academic-calendar", desc: "Annual term dates, didactic schedules, university examination windows, and seasonal vacations." },
  { label: "Timetable", slug: "timetable", path: "/academics/timetable", desc: "Year-wise class timetables, clinical ward postings, and laboratory practical hours." },
  { label: "Examination", slug: "examination", path: "/academics/examination", desc: "MUHS examination ordinances, mandatory 75%/80% attendance criteria, and internal assessment schemes." },
  { label: "Results", slug: "results", path: "/academics/results", desc: "University examination result notifications, annual pass statistics, and academic toppers list." },
  { label: "Academic Policies", slug: "academic-policies", path: "/academics/academic-policies", desc: "Institutional curriculum regulations, code of academic integrity, and clinical attendance guidelines." },
  { label: "Student Handbook", slug: "student-handbook", path: "/academics/student-handbook", desc: "Official student guide, curriculum outlines, academic rights, and student grievance support cells." }
]

export default function Academics() {
  const { subpage } = useParams()

  // Normalize subpage slug
  let currentSlug = (subpage || '').toLowerCase().trim()
  if (currentSlug === 'calendar') currentSlug = 'academic-calendar'
  if (currentSlug === 'policies') currentSlug = 'academic-policies'
  if (currentSlug === 'handbook') currentSlug = 'student-handbook'

  // Prehydrated state from local cache or default institutional dataset
  const [data, setData] = useState(() => {
    const cached = getCachedAcademicsData()
    if (cached) {
      return {
        ...DEFAULT_ACADEMICS_DATA,
        ...cached,
        overview: { ...DEFAULT_ACADEMICS_DATA.overview, ...(cached.overview || {}) },
        subjects: {
          ...DEFAULT_ACADEMICS_DATA.subjects,
          ...(cached.subjects || {}),
          years: Array.isArray(cached.subjects?.years) && cached.subjects.years.length > 0 ? cached.subjects.years : DEFAULT_ACADEMICS_DATA.subjects.years,
          list: Array.isArray(cached.subjects?.list) && cached.subjects.list.length > 0 ? cached.subjects.list : DEFAULT_ACADEMICS_DATA.subjects.list
        },
        calendar: {
          ...DEFAULT_ACADEMICS_DATA.calendar,
          ...(cached.calendar || {}),
          events: Array.isArray(cached.calendar?.events) && cached.calendar.events.length > 0 ? cached.calendar.events : DEFAULT_ACADEMICS_DATA.calendar.events
        },
        timetable: {
          ...DEFAULT_ACADEMICS_DATA.timetable,
          ...(cached.timetable || {}),
          years: Array.isArray(cached.timetable?.years) && cached.timetable.years.length > 0 ? cached.timetable.years : DEFAULT_ACADEMICS_DATA.timetable.years,
          schedule_rows: Array.isArray(cached.timetable?.schedule_rows) && cached.timetable.schedule_rows.length > 0 ? cached.timetable.schedule_rows : DEFAULT_ACADEMICS_DATA.timetable.schedule_rows
        },
        examination: {
          ...DEFAULT_ACADEMICS_DATA.examination,
          ...(cached.examination || {}),
          attendance_rules: { ...DEFAULT_ACADEMICS_DATA.examination.attendance_rules, ...(cached.examination?.attendance_rules || {}) },
          weightage: Array.isArray(cached.examination?.weightage) && cached.examination.weightage.length > 0 ? cached.examination.weightage : DEFAULT_ACADEMICS_DATA.examination.weightage,
          notices: Array.isArray(cached.examination?.notices) && cached.examination.notices.length > 0 ? cached.examination.notices : DEFAULT_ACADEMICS_DATA.examination.notices
        },
        results: {
          ...DEFAULT_ACADEMICS_DATA.results,
          ...(cached.results || {}),
          records: Array.isArray(cached.results?.records) && cached.results.records.length > 0 ? cached.results.records : DEFAULT_ACADEMICS_DATA.results.records
        },
        policies: {
          ...DEFAULT_ACADEMICS_DATA.policies,
          ...(cached.policies || {}),
          items: Array.isArray(cached.policies?.items) && cached.policies.items.length > 0 ? cached.policies.items : DEFAULT_ACADEMICS_DATA.policies.items
        },
        handbook: {
          ...DEFAULT_ACADEMICS_DATA.handbook,
          ...(cached.handbook || {}),
          chapters: Array.isArray(cached.handbook?.chapters) && cached.handbook.chapters.length > 0 ? cached.handbook.chapters : DEFAULT_ACADEMICS_DATA.handbook.chapters,
          contact_support: { ...DEFAULT_ACADEMICS_DATA.handbook.contact_support, ...(cached.handbook?.contact_support || {}) }
        }
      }
    }
    return DEFAULT_ACADEMICS_DATA
  })

  // Instant scroll to top on subpage change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [currentSlug])

  // Fetch live CMS data
  useEffect(() => {
    pagesService.getBySlug('academics').then(page => {
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
        } catch {}
      }
    }).catch(() => {})
  }, [])

  const overview = data.overview || DEFAULT_ACADEMICS_DATA.overview
  const calendar = data.calendar || DEFAULT_ACADEMICS_DATA.calendar
  const timetable = data.timetable || DEFAULT_ACADEMICS_DATA.timetable
  const examination = data.examination || DEFAULT_ACADEMICS_DATA.examination
  const results = data.results || DEFAULT_ACADEMICS_DATA.results
  const policies = data.policies || DEFAULT_ACADEMICS_DATA.policies
  const handbook = data.handbook || DEFAULT_ACADEMICS_DATA.handbook

  // Active subpage config
  const activeSubmenu = ACADEMICS_SUBMENUS.find(s => s.slug === currentSlug)

  // Compute Page Title
  const pageTitle = activeSubmenu ? `${activeSubmenu.label} — Academics` : "Academics"

  return (
    <PageShell title={pageTitle}>
      <div className="academics-single-page">

        {/* ========================================================
            CASE 1: OVERVIEW PAGE (/academics)
            ======================================================== */}
        {!currentSlug && (
          <div className="academics-overview-hub">
            {/* Intro Header */}
            <div className="academics-intro-block">
              <h1 className="academics-page-title">{overview.intro_title || "Academic Programs & Curriculum Administration"}</h1>
              <p className="academics-page-lead">
                {overview.intro_lead}
              </p>

              {/* Key Metrics Grid */}
              {Array.isArray(overview.highlights) && overview.highlights.length > 0 && (
                <div className="academics-stats-grid">
                  {overview.highlights.map((h, idx) => (
                    <div key={idx} className="academics-stat-card">
                      <div className="academics-stat-val">{h.value}</div>
                      <div className="academics-stat-lbl">{h.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submenu Cards Grid */}
            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Academic Modules & Sub-Sections</h2>
            <div className="submenu-overview-grid">
              {ACADEMICS_SUBMENUS.map((item, idx) => (
                <article key={item.slug} className="submenu-overview-card">
                  <div>
                    <div className="submenu-card-header">
                      <span className="submenu-card-badge">{idx + 1}</span>
                      <h3 className="submenu-card-title">{item.label}</h3>
                    </div>
                    <p className="submenu-card-desc">{item.desc}</p>
                  </div>
                  <Link to={item.path} className="submenu-card-btn">
                    Open {item.label} Page →
                  </Link>
                </article>
              ))}
            </div>

            {/* Quick Overview Summary Preview */}
            <div style={{ marginTop: 24, padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
                Quick Downloads & Key Links
              </h3>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
                {calendar.pdf_url && (
                  <a href={resolveMediaUrl(calendar.pdf_url)} target="_blank" rel="noreferrer" className="academics-doc-btn">
                    Academic Calendar PDF ↓
                  </a>
                )}
                {handbook.pdf_url && (
                  <a href={resolveMediaUrl(handbook.pdf_url)} target="_blank" rel="noreferrer" className="academics-doc-btn">
                    Student Handbook PDF ↓
                  </a>
                )}
                <Link to="/academics/examination" className="academics-doc-btn" style={{ background: '#003366', color: '#fff' }}>
                  MUHS Exam Guidelines →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMENU 1: ACADEMIC CALENDAR (/academics/academic-calendar)
            ======================================================== */}
        {currentSlug === 'academic-calendar' && (
          <section id="academic-calendar" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Academic Calendar</h1>
              </div>
              {calendar.pdf_url && (
                <a
                  href={resolveMediaUrl(calendar.pdf_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="academics-doc-btn"
                >
                  Download Calendar PDF ↓
                </a>
              )}
            </div>

            <p className="academics-section-intro">
              {calendar.lead}
            </p>

            {/* Desktop Table View (> 768px) */}
            <div className="academics-table-wrapper calendar-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '6%' }}>Sr.</th>
                    <th style={{ width: '22%' }}>Date / Schedule Period</th>
                    <th style={{ width: '42%' }}>Academic / Clinical Activity</th>
                    <th style={{ width: '16%' }}>Target Batch</th>
                    <th style={{ width: '14%' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {calendar.events?.map((ev, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{ev.date}</strong></td>
                      <td style={{ color: 'var(--navy-header)', fontWeight: 600 }}>{ev.activity}</td>
                      <td><span className="academics-badge">{ev.batch}</span></td>
                      <td>
                        <span className={`academics-badge ${ev.category?.includes('Exam') ? 'academics-badge-accent' : 'academics-badge-blue'}`}>
                          {ev.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (<= 768px) */}
            <div className="calendar-mobile-view">
              {calendar.events?.map((ev, idx) => (
                <div key={idx} className="cal-mobile-card">
                  <div className="cal-mobile-card-top">
                    <div className="cal-mobile-date-wrap">
                      <span className="cal-mobile-sr">#{idx + 1}</span>
                      <strong className="cal-mobile-date">{ev.date}</strong>
                    </div>
                    {ev.category && (
                      <span className={`academics-badge ${ev.category?.includes('Exam') ? 'academics-badge-accent' : 'academics-badge-blue'}`}>
                        {ev.category}
                      </span>
                    )}
                  </div>
                  <div className="cal-mobile-activity">
                    {ev.activity}
                  </div>
                  {ev.batch && (
                    <div className="cal-mobile-footer">
                      <span className="cal-mobile-batch-label">Target Batch:</span>
                      <span className="academics-badge">{ev.batch}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 2: TIMETABLE (/academics/timetable)
            ======================================================== */}
        {currentSlug === 'timetable' && (
          <section id="timetable" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Academic & Clinical Timetables</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {timetable.lead}
            </p>

            {/* Year-wise PDF Download Cards */}
            <div className="academics-grid-4">
              {timetable.years?.map((y, idx) => (
                <div key={idx} className="academics-card">
                  <div className="academics-card-year">{y.year}</div>
                  <div className="academics-card-shift">{y.shift}</div>
                  {y.pdf_url ? (
                    <a
                      href={resolveMediaUrl(y.pdf_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="academics-doc-btn"
                      style={{ marginTop: 10, display: 'inline-block' }}
                    >
                      Download PDF ↓
                    </a>
                  ) : (
                    <span style={{ marginTop: 10, display: 'inline-block', fontSize: 12, color: 'var(--text-muted)' }}>Notice Board</span>
                  )}
                </div>
              ))}
            </div>

            {/* Representative Daily Schedule */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', marginBottom: 12 }}>
                Representative Didactic & Clinical Timetable
              </h3>

              {/* Desktop Table View */}
              <div className="academics-table-wrapper timetable-desktop-view">
                <table className="academics-table">
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Time Slot</th>
                      <th style={{ width: '22%' }}>Activity Domain</th>
                      <th style={{ width: '38%' }}>Curricular Focus</th>
                      <th style={{ width: '22%' }}>Venue / Facility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.schedule_rows?.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.time}</strong></td>
                        <td><span className="academics-badge academics-badge-blue">{row.activity}</span></td>
                        <td>{row.curriculum}</td>
                        <td style={{ color: '#475569', fontSize: 13 }}>{row.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="timetable-mobile-view">
                {timetable.schedule_rows?.map((row, idx) => (
                  <div key={idx} className="timetable-mobile-card">
                    <div className="timetable-mobile-top">
                      <strong className="timetable-mobile-time">{row.time}</strong>
                      <span className="academics-badge academics-badge-blue">{row.activity}</span>
                    </div>
                    <div className="timetable-mobile-curriculum">{row.curriculum}</div>
                    <div className="timetable-mobile-venue">
                      <span className="timetable-venue-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      <span>{row.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 3: EXAMINATION (/academics/examination)
            ======================================================== */}
        {currentSlug === 'examination' && (
          <section id="examination" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Examination & Evaluation Schemes</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {examination.lead}
            </p>

            {/* Mandatory Attendance Box */}
            <div className="academics-notice-box" style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#003366', margin: '0 0 6px' }}>
                MUHS Statutory Attendance Mandate for University Examination Eligibility
              </h4>
              <p style={{ margin: '0 0 6px' }}>{examination.attendance_rules?.mandatory_note}</p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 10 }}>
                <div>
                  <strong>Didactic / Theory Attendance: </strong>
                  <span className="academics-badge academics-badge-accent">{examination.attendance_rules?.theory_pct}</span>
                </div>
                <div>
                  <strong>Clinical / Practical Postings: </strong>
                  <span className="academics-badge academics-badge-accent">{examination.attendance_rules?.practical_pct}</span>
                </div>
              </div>
            </div>

            {/* Assessment Weightage Structure */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', marginBottom: 12 }}>
              Internal & University Assessment Weightage Scheme
            </h3>
            <div className="academics-grid-3">
              {examination.weightage?.map((w, idx) => (
                <div key={idx} className="academics-weightage-card">
                  <div className="academics-weightage-head">{w.head}</div>
                  <div className="academics-weightage-val">{w.weightage}</div>
                  <p className="academics-weightage-desc">{w.desc}</p>
                </div>
              ))}
            </div>

            {/* Examination Circulars */}
            {Array.isArray(examination.notices) && examination.notices.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', marginBottom: 12 }}>
                  Recent Examination Circulars & Hall Ticket Notifications
                </h3>
                <div className="academics-notices-list">
                  {examination.notices.map((n, idx) => (
                    <div key={idx} className="academics-notice-item">
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{n.date} · {n.batch}</div>
                        <div style={{ fontWeight: 600, color: 'var(--navy-header)', fontSize: 14 }}>{n.title}</div>
                      </div>
                      {n.file_url && (
                        <a href={resolveMediaUrl(n.file_url)} target="_blank" rel="noreferrer" className="academics-doc-btn">
                          Circular PDF ↓
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            SUBMENU 4: RESULTS (/academics/results)
            ======================================================== */}
        {currentSlug === 'results' && (
          <section id="results" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">MUHS Examination Results & Academic Performance</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {results.lead}
            </p>

            {/* Desktop Table View */}
            <div className="academics-table-wrapper results-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>Academic Year</th>
                    <th style={{ width: '22%' }}>Exam Session</th>
                    <th style={{ width: '14%' }}>Appeared</th>
                    <th style={{ width: '14%' }}>Passed</th>
                    <th style={{ width: '16%' }}>Distinction</th>
                    <th style={{ width: '16%' }}>First Class</th>
                    <th style={{ width: '16%' }}>Pass %</th>
                  </tr>
                </thead>
                <tbody>
                  {results.records?.map((r, idx) => (
                    <tr key={idx}>
                      <td><strong>{r.year}</strong></td>
                      <td style={{ color: 'var(--navy-header)', fontWeight: 600 }}>{r.exam_session}</td>
                      <td>{r.appeared}</td>
                      <td><strong>{r.passed}</strong></td>
                      <td><span className="academics-badge academics-badge-blue">{r.distinction}</span></td>
                      <td>{r.first_class}</td>
                      <td>
                        <span className="academics-badge academics-badge-accent" style={{ fontWeight: 700 }}>
                          {r.pass_percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="results-mobile-view">
              {results.records?.map((r, idx) => (
                <div key={idx} className="results-mobile-card">
                  <div className="results-mobile-top">
                    <div className="results-mobile-year">{r.year}</div>
                    <span className="academics-badge academics-badge-accent" style={{ fontWeight: 800, fontSize: 13 }}>
                      Pass: {r.pass_percentage}
                    </span>
                  </div>
                  <div className="results-mobile-session">{r.exam_session}</div>
                  <div className="results-mobile-stats-grid">
                    <div className="results-stat-box">
                      <span className="results-stat-val">{r.appeared}</span>
                      <span className="results-stat-lbl">Appeared</span>
                    </div>
                    <div className="results-stat-box">
                      <span className="results-stat-val">{r.passed}</span>
                      <span className="results-stat-lbl">Passed</span>
                    </div>
                    <div className="results-stat-box">
                      <span className="results-stat-val">{r.distinction}</span>
                      <span className="results-stat-lbl">Distinction</span>
                    </div>
                    <div className="results-stat-box">
                      <span className="results-stat-val">{r.first_class}</span>
                      <span className="results-stat-lbl">First Class</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="academics-notice-box" style={{ marginTop: 20 }}>
              <strong>Official Result Verification: </strong>
              <span>Students can verify original mark statements and grade gazettes online at the </span>
              <a href="https://www.muhs.ac.in" target="_blank" rel="noreferrer" style={{ color: '#0066cc', fontWeight: 600 }}>
                MUHS Official Portal (www.muhs.ac.in)
              </a>
              <span> or consult the College Examination Section.</span>
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 5: ACADEMIC POLICIES (/academics/academic-policies)
            ======================================================== */}
        {currentSlug === 'academic-policies' && (
          <section id="academic-policies" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Institutional Academic Policies & Regulations</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {policies.lead}
            </p>

            <div className="academics-policies-list">
              {policies.items?.map((p, idx) => (
                <div key={idx} className="academics-policy-card">
                  <div className="academics-policy-body">
                    <span className="academics-badge academics-badge-blue">{p.category}</span>
                    <h3 className="academics-policy-title">{p.title}</h3>
                    <p className="academics-policy-summary">{p.summary}</p>
                  </div>
                  {p.pdf_url && (
                    <a
                      href={resolveMediaUrl(p.pdf_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="academics-doc-btn"
                    >
                      Policy Document PDF ↓
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 6: STUDENT HANDBOOK (/academics/student-handbook)
            ======================================================== */}
        {currentSlug === 'student-handbook' && (
          <section id="student-handbook" className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Student Academic Handbook & Conduct Guidelines</h1>
              </div>
              {handbook.pdf_url && (
                <a
                  href={resolveMediaUrl(handbook.pdf_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="academics-doc-btn"
                >
                  Download Student Handbook PDF ↓
                </a>
              )}
            </div>

            <p className="academics-section-intro">
              {handbook.lead}
            </p>

            <div className="academics-grid-2">
              {handbook.chapters?.map((ch, idx) => (
                <div key={idx} className="academics-chapter-box">
                  <div className="academics-chapter-num">Chapter {ch.num}</div>
                  <div className="academics-chapter-title">{ch.title}</div>
                  <p className="academics-chapter-desc">{ch.desc}</p>
                </div>
              ))}
            </div>

            {handbook.contact_support && (
              <div className="academics-contact-strip" style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
                  Key Academic & Student Affairs Contacts
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  <div>
                    <strong>Dean / Principal Desk: </strong>
                    <span>{handbook.contact_support.dean_office}</span>
                  </div>
                  <div>
                    <strong>College Examination Cell: </strong>
                    <span>{handbook.contact_support.exam_cell}</span>
                  </div>
                  <div>
                    <strong>Student Welfare Officer: </strong>
                    <span>{handbook.contact_support.student_welfare}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </PageShell>
  )
}
