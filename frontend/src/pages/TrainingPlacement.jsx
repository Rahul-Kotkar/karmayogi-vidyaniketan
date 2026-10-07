import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_PLACEMENT_DATA } from '../data/collegeData.js'
import { pagesService, getCachedPlacementData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'
import defaultTpoPhoto from '../assets/tpo_officer.jpg'

// Institutional Hospital & Corporate Partners Network
const RECRUITER_BRICKS = [
  { name: "Apollo Hospitals", category: "Multi-Specialty Network", initials: "AH" },
  { name: "Fortis Healthcare", category: "Super-Specialty Tertiary", initials: "FH" },
  { name: "Manipal Hospitals", category: "Tertiary Care & Rehab", initials: "MH" },
  { name: "Max Healthcare", category: "Multi-Specialty Chain", initials: "MX" },
  { name: "Ruby Hall Clinic", category: "Critical Care & Neuro", initials: "RH" },
  { name: "Sancheti Hospital", category: "Orthopaedics & Joint Care", initials: "SH" },
  { name: "Sahyadri Hospitals", category: "Trauma & Neurosciences", initials: "SY" },
  { name: "DY Patil Hospital", category: "Medical Foundation", initials: "DY" },
  { name: "KEM Hospital", category: "Teaching & Tertiary Care", initials: "KM" },
  { name: "Jupiter Hospital", category: "Super-Specialty", initials: "JH" },
  { name: "Nanavati Hospital", category: "Super Speciality", initials: "NH" },
  { name: "Narayana Health", category: "Cardiac & General Care", initials: "NHD" },
  { name: "Aster DM Healthcare", category: "Healthcare Network", initials: "AST" },
  { name: "Columbia Asia", category: "Multi-Specialty", initials: "CA" },
  { name: "Kokilaben Hospital", category: "Center for Bone & Joint", initials: "KDA" },
  { name: "Care Hospitals", category: "Tertiary Care", initials: "CH" },
  { name: "Qi Spine Clinics", category: "Spine Rehabilitation", initials: "QS" },
  { name: "Portea Medical", category: "Home Healthcare", initials: "PM" },
  { name: "HCAH Healthcare", category: "Long-Term Rehabilitation", initials: "HCH" },
  { name: "Ashwini Rugnalaya", category: "Solapur Tertiary Care", initials: "ASH" }
]

// Year-wise verified placement records
const YEARLY_PLACEMENTS = [
  {
    year: "2024-25",
    eligible: 60,
    placed: 53,
    ratio: "88.3%",
    ratioNum: 88.3,
    highest: "₹ 8.40 LPA",
    average: "₹ 4.20 LPA",
    partners: ["Apollo Hospitals", "Fortis Healthcare", "Sancheti Orthopaedic", "Ruby Hall Clinic", "Qi Spine"]
  },
  {
    year: "2023-24",
    eligible: 60,
    placed: 55,
    ratio: "91.6%",
    ratioNum: 91.6,
    highest: "₹ 7.50 LPA",
    average: "₹ 3.90 LPA",
    partners: ["Manipal Hospitals", "Sahyadri Hospitals", "DY Patil Hospital", "HCAH", "Portea Medical"]
  },
  {
    year: "2022-23",
    eligible: 50,
    placed: 44,
    ratio: "88.0%",
    ratioNum: 88.0,
    highest: "₹ 6.80 LPA",
    average: "₹ 3.60 LPA",
    partners: ["Jupiter Hospital", "KEM Hospital", "Nanavati Super Speciality", "Sancheti"]
  },
  {
    year: "2021-22",
    eligible: 50,
    placed: 43,
    ratio: "86.0%",
    ratioNum: 86.0,
    highest: "₹ 6.00 LPA",
    average: "₹ 3.40 LPA",
    partners: ["Apollo Hospitals", "Ruby Hall Clinic", "Aster DM Healthcare", "Ashwini Rugnalaya"]
  }
]

// Placement Testimonials / Alumni Success Stories
const STUDENT_TESTIMONIALS = [
  {
    name: "Dr. Priya Deshmukh",
    program: "B.P.T",
    batch: "Batch 2023-24",
    packageAmt: "₹ 8.40 LPA",
    company: "Apollo Super-Specialty Hospitals",
    designation: "Clinical Musculoskeletal Specialist",
    location: "Pune, Maharashtra"
  },
  {
    name: "Dr. Rohan Kulkarni",
    program: "B.P.T",
    batch: "Batch 2023-24",
    packageAmt: "₹ 6.80 LPA",
    company: "Sancheti Orthopaedic & Rehabilitation",
    designation: "Sports Rehab & Post-Op Physical Therapist",
    location: "Pune, Maharashtra"
  },
  {
    name: "Dr. Sneha Jadhav",
    program: "B.P.T",
    batch: "Batch 2022-23",
    packageAmt: "₹ 5.50 LPA",
    company: "Ruby Hall Clinic Critical Care",
    designation: "ICU & Cardiopulmonary Physiotherapist",
    location: "Pune, Maharashtra"
  },
  {
    name: "Dr. Amit Shinde",
    program: "B.P.T",
    batch: "Batch 2023-24",
    packageAmt: "₹ 5.20 LPA",
    company: "Qi Spine Advanced Rehabilitation",
    designation: "Spine & Postural Consultant",
    location: "Mumbai, Maharashtra"
  },
  {
    name: "Dr. Pooja Patil",
    program: "B.P.T",
    batch: "Batch 2022-23",
    packageAmt: "₹ 4.80 LPA",
    company: "Sahyadri Super Speciality Hospital",
    designation: "Neurological Physiotherapist",
    location: "Western Maharashtra"
  },
  {
    name: "Dr. Rahul Bhosale",
    program: "B.P.T",
    batch: "Batch 2021-22",
    packageAmt: "₹ 4.50 LPA",
    company: "HealthCare at Home (HCAH)",
    designation: "Clinical Home Care Lead",
    location: "Solapur / Pandharpur"
  },
  {
    name: "Dr. Aarti More",
    program: "M.P.T",
    batch: "Batch 2023-24",
    packageAmt: "₹ 7.20 LPA",
    company: "Manipal Comprehensive Rehab Center",
    designation: "Senior Neuro Physiotherapist",
    location: "Bengaluru, Karnataka"
  },
  {
    name: "Dr. Vishal Sawant",
    program: "M.P.T",
    batch: "Batch 2022-23",
    packageAmt: "₹ 6.50 LPA",
    company: "DY Patil Hospital & Research Institute",
    designation: "Assistant Professor & Clinical Lead",
    location: "Kolhapur, Maharashtra"
  }
]

export default function TrainingPlacement() {
  const { subpage } = useParams()

  // State
  const [data, setData] = useState(() => {
    const cached = getCachedPlacementData()
    if (cached) {
      return {
        ...DEFAULT_PLACEMENT_DATA,
        ...cached,
        cell_info: { ...DEFAULT_PLACEMENT_DATA.cell_info, ...(cached.cell_info || {}) },
        officer: { ...DEFAULT_PLACEMENT_DATA.officer, ...(cached.officer || {}) }
      }
    }
    return DEFAULT_PLACEMENT_DATA
  })

  const [filterDept, setFilterDept] = useState('all')
  const [expandedYears, setExpandedYears] = useState({ 0: true })
  const [showAllMobileRecruiters, setShowAllMobileRecruiters] = useState(false)

  // Auto scroll to target section if subpage or hash is specified
  useEffect(() => {
    const slug = (subpage || '').toLowerCase().trim()
    const hash = window.location.hash.replace('#', '').toLowerCase().trim()
    const target = slug || hash

    if (target) {
      let elementId = ''
      if (['officer', 'tpos-desk', 'desk'].includes(target)) elementId = 'tpos-desk'
      else if (['process', 'placement-preparation-program'].includes(target)) elementId = 'placement-preparation-program'
      else if (['statistics', 'yearwise-placements'].includes(target)) elementId = 'yearwise-placements'
      else if (['highest-package', 'average-package', 'packages', 'highlights'].includes(target)) elementId = 'placement-highlights'
      else if (['recruiter-logos', 'recruiters', 'recruiter-network'].includes(target)) elementId = 'recruiter-network'
      else if (['testimonials', 'student-success-stories'].includes(target)) elementId = 'student-success-stories'

      if (elementId) {
        setTimeout(() => {
          const el = document.getElementById(elementId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 150)
      }
    } else {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      } catch {
        window.scrollTo(0, 0)
      }
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [subpage])

  // Fetch live CMS data
  useEffect(() => {
    pagesService.getBySlug('training-placement').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setData(prev => ({
            ...prev,
            ...parsed,
            cell_info: {
              ...prev.cell_info,
              ...(parsed.cell_info || {}),
              top_stats: Array.isArray(parsed.cell_info?.top_stats) && parsed.cell_info.top_stats.length > 0
                ? parsed.cell_info.top_stats
                : prev.cell_info.top_stats
            },
            officer: { ...prev.officer, ...(parsed.officer || {}) },
            recruiter_network: Array.isArray(parsed.recruiter_network) && parsed.recruiter_network.length > 0
              ? parsed.recruiter_network
              : prev.recruiter_network,
            yearly_placements: Array.isArray(parsed.yearly_placements) && parsed.yearly_placements.length > 0
              ? parsed.yearly_placements
              : prev.yearly_placements,
            coursewise_outcomes: {
              ...prev.coursewise_outcomes,
              ...(parsed.coursewise_outcomes || {})
            },
            prep_program: Array.isArray(parsed.prep_program) && parsed.prep_program.length > 0
              ? parsed.prep_program
              : prev.prep_program,
            testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0
              ? parsed.testimonials
              : prev.testimonials
          }))
        } catch {}
      }
    }).catch(() => {})
  }, [])

  const officer = data.officer || DEFAULT_PLACEMENT_DATA.officer
  const cellInfo = data.cell_info || DEFAULT_PLACEMENT_DATA.cell_info
  const topStats = (cellInfo.top_stats && cellInfo.top_stats.length > 0)
    ? cellInfo.top_stats
    : DEFAULT_PLACEMENT_DATA.cell_info.top_stats

  const recruiterBricks = (data.recruiter_network && data.recruiter_network.length > 0)
    ? data.recruiter_network
    : (DEFAULT_PLACEMENT_DATA.recruiter_network || RECRUITER_BRICKS)

  const yearlyPlacements = (data.yearly_placements && data.yearly_placements.length > 0)
    ? data.yearly_placements
    : (DEFAULT_PLACEMENT_DATA.yearly_placements || YEARLY_PLACEMENTS)

  const coursewiseOutcomes = data.coursewise_outcomes || DEFAULT_PLACEMENT_DATA.coursewise_outcomes

  const prepProgram = (data.prep_program && data.prep_program.length > 0)
    ? data.prep_program
    : (DEFAULT_PLACEMENT_DATA.prep_program || [
        {
          step: "01",
          title: "Clinical Assessment",
          desc: "Evaluating clinical acumen, physical therapy diagnostic foundations, and patient bedside communication to identify key focus areas."
        },
        {
          step: "02",
          title: "Specialized Workshops",
          desc: "Pre-placement mock tests, ICU mobility simulations, kinesio-taping certifications, and profile enhancement matching real hospital parameters."
        },
        {
          step: "03",
          title: "Guest Seminars",
          desc: "Interactive CME sessions led by hospital medical superintendents, chief physiotherapists, and successful clinical alumni."
        },
        {
          step: "04",
          title: "Recruitment Drives",
          desc: "Direct on-campus recruitment drives, multi-center pool placement interviews, and final clinical offer letter confirmation."
        }
      ])

  const allTestimonials = (data.testimonials && data.testimonials.length > 0)
    ? data.testimonials
    : (DEFAULT_PLACEMENT_DATA.testimonials || STUDENT_TESTIMONIALS)

  const toggleYearCard = (idx) => {
    setExpandedYears(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const filteredTestimonials = allTestimonials.filter(t => {
    if (filterDept === 'all') return true
    return (t.program || '').toLowerCase() === filterDept.toLowerCase()
  })

  return (
    <PageShell title="Training and Placements">
      <div className="satthacop-placement-page">

        {/* ========================================================
            SECTION 1: PLACEMENT HIGHLIGHTS & KEY STATS
            ======================================================== */}
        <section id="placement-highlights" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header">
            <h1 className="satthacop-section-title">{cellInfo.intro_title || "Connecting Talent with Healthcare Leaders"}</h1>
            <p className="satthacop-section-desc">
              {cellInfo.intro_lead || "Our active Training and Placement Cell conducts mock clinical interviews, bedside rehabilitation workshops, resume building sessions, and on-campus recruitment drives with Maharashtra's and India's top hospitals and healthcare networks."}
            </p>

            {/* Top 4 Key Statistics Cards */}
            <div className="satthacop-top-stats-grid">
              {topStats.map((stat, idx) => (
                <div key={idx} className="satthacop-stat-box">
                  <div className="satthacop-stat-val" style={{ color: '#073b73' }}>{stat.value}</div>
                  <div className="satthacop-stat-lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: PREMIER RECRUITER NETWORK (BRICK WALL)
            ======================================================== */}
        <section id="recruiter-network" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header" style={{ marginBottom: 20 }}>
            <h2 className="satthacop-section-title" style={{ fontSize: 26 }}>Our Premier Recruiter Network</h2>
            <p className="satthacop-section-desc">
              Leading healthcare networks, multi-specialty hospitals, and rehabilitation centers where our physiotherapy alumni build impactful careers in Orthopedic, Neurological, Cardio-Pulmonary, and Sports Physiotherapy.
            </p>
          </div>

          <div className={`satthacop-brick-wall ${showAllMobileRecruiters ? 'show-all-mobile' : ''}`}>
            {recruiterBricks.map((item, idx) => (
              <div
                key={idx}
                className={`satthacop-brick-card ${idx >= 6 ? 'satthacop-brick-card-extra' : ''}`}
              >
                <div className="satthacop-brick-card-icon">
                  {item.initials}
                </div>
                <div className="satthacop-brick-name">{item.name}</div>
                <div className="satthacop-brick-sub">{item.category}</div>
              </div>
            ))}
          </div>

          {recruiterBricks.length > 6 && (
            <div className="satthacop-view-more-wrap">
              <button
                type="button"
                className="satthacop-view-more-btn"
                onClick={() => setShowAllMobileRecruiters(prev => !prev)}
                aria-label={showAllMobileRecruiters ? "Show fewer recruiters" : "View more recruiter logos"}
              >
                {showAllMobileRecruiters ? (
                  <>
                    <span>Show Less</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  </>
                ) : (
                  <>
                    <span>View More Recruiters ({recruiterBricks.length - 6}+)</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            SECTION 3: STUDENTS PLACED PER ACADEMIC YEAR (YEAR-WISE)
            ======================================================== */}
        <section id="yearwise-placements" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header">
            <div className="satthacop-section-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span>Annual Campus Placements Track Record</span>
            </div>
            <h2 className="satthacop-section-title">Students Placed per Academic Year</h2>
            <p className="satthacop-section-desc">
              Year-by-year summary of student participation, corporate recruitment count, placement conversion ratios, and compensation trends.
            </p>
          </div>

          <div className="satthacop-yearly-box">
            <div className="satthacop-yearly-box-header">
              <div>
                <h3 className="satthacop-yearly-box-title">Academic Year Performance Breakdown</h3>
                <div className="satthacop-yearly-box-sub">Verified placement cell records approved by Training & Placement Cell</div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="placement-stats-desktop-view">
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>Academic Year</th>
                    <th style={{ textAlign: 'center' }}>Eligible Students</th>
                    <th style={{ textAlign: 'center' }}>Students Placed</th>
                    <th>Placement Ratio</th>
                    <th>Highest CTC</th>
                    <th>Average CTC</th>
                    <th>Key Hiring Partners</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyPlacements.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>Academic Year {row.year}</strong></td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.eligible}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="placement-badge placement-badge-success">{row.placed}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#073b73' }}>{row.ratio}</div>
                        <div className="satthacop-table-progress-bar">
                          <div className="satthacop-table-progress-fill" style={{ width: `${row.ratioNum || (row.eligible ? (row.placed / row.eligible) * 100 : 0)}%` }}></div>
                        </div>
                      </td>
                      <td>
                        <span className="placement-badge placement-badge-accent">{row.highest}</span>
                      </td>
                      <td><strong>{row.average}</strong></td>
                      <td style={{ fontSize: 12.5, color: '#475569' }}>
                        {Array.isArray(row.partners) ? row.partners.join(', ') : row.partners}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Expandable Accordion Cards */}
            <div className="placement-stats-mobile-cards" style={{ padding: 12 }}>
              {yearlyPlacements.map((row, idx) => {
                const isExpanded = Boolean(expandedYears[idx])
                return (
                  <div key={idx} className="satthacop-yearly-mcard">
                    <button
                      type="button"
                      className="satthacop-yearly-mcard-head"
                      onClick={() => toggleYearCard(idx)}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, color: '#05162e', fontSize: 15 }}>
                            Year {row.year}
                          </span>
                          <span className="placement-badge placement-badge-success" style={{ fontSize: 11 }}>
                            {row.ratio}
                          </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                          Placed: <strong style={{ color: '#0f172a' }}>{row.placed}/{row.eligible}</strong> • Highest: <strong style={{ color: '#073b73' }}>{row.highest}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#00458b' }}>
                        <span>{isExpanded ? 'Show Less' : 'Details'}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="satthacop-yearly-mcard-body">
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                            <span>Placement Success Rate</span>
                            <span style={{ color: '#073b73' }}>{row.ratio}</span>
                          </div>
                          <div className="satthacop-table-progress-bar" style={{ width: '100%', height: 6 }}>
                            <div className="satthacop-table-progress-fill" style={{ width: `${row.ratioNum}%` }}></div>
                          </div>
                        </div>

                        <div className="placement-stat-grid">
                          <div className="placement-stat-sub">
                            <span className="placement-stat-sub-label">Eligible Students</span>
                            <strong className="placement-stat-sub-val">{row.eligible}</strong>
                          </div>
                          <div className="placement-stat-sub">
                            <span className="placement-stat-sub-label">Students Placed</span>
                            <strong className="placement-stat-sub-val" style={{ color: '#059669' }}>{row.placed}</strong>
                          </div>
                          <div className="placement-stat-sub">
                            <span className="placement-stat-sub-label">Highest CTC</span>
                            <strong className="placement-stat-sub-val" style={{ color: '#073b73' }}>{row.highest}</strong>
                          </div>
                          <div className="placement-stat-sub">
                            <span className="placement-stat-sub-label">Average CTC</span>
                            <strong className="placement-stat-sub-val">{row.average}</strong>
                          </div>
                        </div>

                        <div style={{ paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                            Key Hiring Partners
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {row.partners.map((p, pIdx) => (
                              <span key={pIdx} style={{ fontSize: 11, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: COURSE-WISE GRADUATE OUTCOMES
            ======================================================== */}
        <section id="coursewise-outcomes" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header">
            <div className="satthacop-section-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              <span>Course-Wise Career Pathways</span>
            </div>
            <h2 className="satthacop-section-title">Course-Wise Graduate Outcomes</h2>
            <p className="satthacop-section-desc">
              Distribution of graduating students across Campus Placements, Higher Education & Research (MPT / Fellowships), and Independent Clinical Rehabilitation Practice.
            </p>
          </div>

          <div className="satthacop-outcomes-grid">
            {/* Outcome Card 1: B.P.T */}
            <div className="satthacop-outcome-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: '#1d4ed8', background: '#eff6ff', padding: '3px 8px', borderRadius: 999, border: '1px solid #bfdbfe' }}>
                      {coursewiseOutcomes?.bpt?.level || 'Undergraduate'}
                    </span>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: '#05162e', margin: '6px 0 2px', fontFamily: 'var(--heading-font)' }}>
                      {coursewiseOutcomes?.bpt?.program || 'B.P.T (Bachelor of Physiotherapy)'}
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                      {coursewiseOutcomes?.bpt?.duration || '4.5 Years Degree (Incl. 6 Months Internship)'}
                    </p>
                  </div>
                </div>

                <div style={{ margin: '20px 0' }}>
                  {/* Legend 1 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#10b981' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Campus & Hospital Placed</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Hospital, OPD & Intensive Care Careers</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                      {coursewiseOutcomes?.bpt?.placed_pct ?? 76}%
                    </span>
                  </div>

                  {/* Legend 2 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#2563eb' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Higher Studies (MPT / Fellowships)</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>MPT CET / AIIMS / International MS</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '3px 10px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                      {coursewiseOutcomes?.bpt?.higher_studies_pct ?? 18}%
                    </span>
                  </div>

                  {/* Legend 3 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#f59e0b' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Clinical Private Practice & Rehab</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Independent Sports & Ortho Clinics</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#b45309', background: '#fffbeb', padding: '3px 10px', borderRadius: 8, border: '1px solid #fde68a' }}>
                      {coursewiseOutcomes?.bpt?.private_practice_pct ?? 6}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                <span style={{ fontWeight: 600 }}>MUHS Approved Curriculum</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{coursewiseOutcomes?.bpt?.note || '100% Productive Track'}</span>
              </div>
            </div>

            {/* Outcome Card 2: M.P.T */}
            <div className="satthacop-outcome-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed', background: '#f5f3ff', padding: '3px 8px', borderRadius: 999, border: '1px solid #ddd6fe' }}>
                      {coursewiseOutcomes?.mpt?.level || 'Postgraduate'}
                    </span>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: '#05162e', margin: '6px 0 2px', fontFamily: 'var(--heading-font)' }}>
                      {coursewiseOutcomes?.mpt?.program || 'M.P.T (Master of Physiotherapy)'}
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                      {coursewiseOutcomes?.mpt?.duration || '2 Years Specialized Clinical Masters'}
                    </p>
                  </div>
                </div>

                <div style={{ margin: '20px 0' }}>
                  {/* Legend 1 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#10b981' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Super-Specialty Hospital Placed</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Tertiary Care, Neuro & Ortho Posts</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                      {coursewiseOutcomes?.mpt?.placed_pct ?? 82}%
                    </span>
                  </div>

                  {/* Legend 2 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#2563eb' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Clinical Academia & Doctoral (Ph.D)</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Assistant Professor & Research Fellows</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '3px 10px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                      {coursewiseOutcomes?.mpt?.higher_studies_pct ?? 12}%
                    </span>
                  </div>

                  {/* Legend 3 */}
                  <div className="satthacop-outcome-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: '#f59e0b' }}></span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Specialized Consultancies & Clinics</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Advanced Sports Rehab Centers</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#b45309', background: '#fffbeb', padding: '3px 10px', borderRadius: 8, border: '1px solid #fde68a' }}>
                      {coursewiseOutcomes?.mpt?.private_practice_pct ?? 6}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                <span style={{ fontWeight: 600 }}>Super-Specialty Focus</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{coursewiseOutcomes?.mpt?.note || '100% Productive Track'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: PLACEMENT PREPARATION PROGRAM (PROCESS)
            ======================================================== */}
        <section id="placement-preparation-program" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header">
            <h2 className="satthacop-section-title">Our Placement Preparation Program</h2>
            <p className="satthacop-section-desc">
              We groom students systematically starting from the clinical postings year to ensure smooth healthcare career placement.
            </p>
          </div>

          <div className="satthacop-prep-grid">
            {prepProgram.map((step, idx) => (
              <div key={idx} className="satthacop-prep-card">
                <span className="satthacop-prep-num">{step.step}</span>
                <h4 className="satthacop-prep-title">{step.title}</h4>
                <p className="satthacop-prep-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 6: TPO's DESK (STANDALONE 2-COL PHOTO & MESSAGE)
            ======================================================== */}
        <section id="tpos-desk" className="tpo-desk-section" style={{ scrollMarginTop: 100 }}>
          <div className="tpo-desk-header">
            <h2 className="tpo-desk-main-title">TPO's Desk</h2>
            <p className="tpo-desk-subtitle">Message from the Training and Placement Officer.</p>
          </div>

          <div className="tpo-desk-layout">
            {/* Left Column: Standalone Portrait Photo Card */}
            <div className="tpo-desk-photo-card">
              <img
                src={officer.photo_url ? resolveMediaUrl(officer.photo_url) : defaultTpoPhoto}
                alt={officer.name || "Dr. Nitin More"}
                className="tpo-desk-photo-img"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = defaultTpoPhoto
                }}
              />
              <div className="tpo-desk-photo-overlay" style={{ color: '#ffffff' }}>
                <h3 className="tpo-desk-officer-name" style={{ color: '#ffffff', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                  {officer.name || "Dr. Nitin More"}
                </h3>
                <p className="tpo-desk-officer-role" style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                  {officer.designation_short || "Training and Placement Officer (Ph.D)"}
                </p>
              </div>
            </div>

            {/* Right Column: Message Card */}
            <div className="tpo-desk-message-card">
              <div>
                <h3 className="tpo-desk-msg-title">Training and Placement Officer's Message</h3>
                <div className="tpo-desk-title-line"></div>

                <div className="tpo-desk-msg-content" style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                  {typeof officer.message === 'string' ? (
                    officer.message.split(/\r?\n\s*\r?\n/).filter(Boolean).map((para, pIdx) => (
                      <p key={pIdx} style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                        {para}
                      </p>
                    ))
                  ) : (
                    <p style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                      {officer.message}
                    </p>
                  )}
                  {officer.quote && (
                    <p className="tpo-desk-quote-highlight" style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                      "{officer.quote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Contact Strip */}
              <div className="tpo-desk-contact-strip">
                {officer.email && (
                  <a href={`mailto:${officer.email}`} className="tpo-desk-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>{officer.email}</span>
                  </a>
                )}

                {officer.phone && (
                  <a href={`tel:${officer.phone.split('/')[0].trim()}`} className="tpo-desk-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{officer.phone}</span>
                  </a>
                )}

                {officer.office && (
                  <div className="tpo-desk-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{officer.office}</span>
                  </div>
                )}

                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="tpo-desk-contact-item tpo-desk-linkedin-link"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <strong>LinkedIn</strong>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 7: STUDENT SUCCESS STORIES & TESTIMONIALS
            ======================================================== */}
        <section id="student-success-stories" className="placement-section" style={{ scrollMarginTop: 100 }}>
          <div className="satthacop-section-header" style={{ textAlign: 'left', margin: '0 0 24px' }}>
            <h2 className="satthacop-section-title">Placement Testimonials and Career Highlights</h2>
            <p className="satthacop-section-desc" style={{ margin: 0 }}>
              Discover how our ambitious physiotherapy graduates secured rewarding positions at leading multi-specialty hospitals, healthcare networks, and sports rehabilitation centers.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="satthacop-filter-row">
            <button
              type="button"
              className={`satthacop-filter-btn ${filterDept === 'all' ? 'active' : ''}`}
              onClick={() => setFilterDept('all')}
            >
              All Programs ({allTestimonials.length})
            </button>
            <button
              type="button"
              className={`satthacop-filter-btn ${filterDept === 'B.P.T' ? 'active' : ''}`}
              onClick={() => setFilterDept('B.P.T')}
            >
              B.P.T ({allTestimonials.filter(t => (t.program || '').toUpperCase() === 'B.P.T').length})
            </button>
            <button
              type="button"
              className={`satthacop-filter-btn ${filterDept === 'M.P.T' ? 'active' : ''}`}
              onClick={() => setFilterDept('M.P.T')}
            >
              M.P.T ({allTestimonials.filter(t => (t.program || '').toUpperCase() === 'M.P.T').length})
            </button>
          </div>

          {/* Structured Testimonial Cards Grid */}
          <div className="satthacop-testimonials-grid">
            {filteredTestimonials.map((t, idx) => (
              <div key={idx} className="satthacop-testimonial-card">
                <div>
                  <div className="satthacop-testimonial-top">
                    <div>
                      <h4 className="satthacop-testimonial-name">{t.name}</h4>
                      <div className="satthacop-testimonial-meta">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }}></span>
                        <span>{t.program}</span>
                        <span>•</span>
                        <span>{t.batch}</span>
                      </div>
                    </div>
                    <span className="satthacop-testimonial-pkg-badge">
                      {t.packageAmt}
                    </span>
                  </div>

                  <div className="satthacop-testimonial-details" style={{ marginTop: 12 }}>
                    <div className="satthacop-testimonial-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>
                      <div>
                        <div className="satthacop-testimonial-row-title">Hospital / Organization</div>
                        <div className="satthacop-testimonial-row-val">{t.company}</div>
                      </div>
                    </div>

                    <div className="satthacop-testimonial-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                      <div>
                        <div className="satthacop-testimonial-row-title">Designation</div>
                        <div className="satthacop-testimonial-row-val" style={{ color: '#00458b' }}>{t.designation}</div>
                      </div>
                    </div>

                    <div className="satthacop-testimonial-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <div>
                        <div className="satthacop-testimonial-row-title">Location</div>
                        <div className="satthacop-testimonial-row-val" style={{ color: '#64748b' }}>{t.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageShell>
  )
}
