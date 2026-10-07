import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import CampusActivitiesSection from '../components/CampusActivitiesSection.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_CORNER_DATA } from '../data/studentCornerData.js'

const STUDENT_SUBMENUS = [
  { label: "Student Activities", slug: "activities", path: "/student-corner/activities", desc: "Annual cultural festivals, sports tournaments, community outreach rallies, and World Physiotherapy Day celebrations." },
  { label: "Student Support & Mentorship", slug: "support", path: "/student-corner/support", desc: "Faculty mentorship system, academic counseling, psychological support, and grievance redressal cells." },
  { label: "Student Achievements", slug: "achievements", path: "/student-corner/achievements", desc: "MUHS academic rank holders, gold medalists, scientific paper presentation prizes, and athletic honors." },
  { label: "Scholarships & Freeships", slug: "scholarships", path: "/student-corner/scholarships", desc: "Government of Maharashtra (MahaDBT) scholarships, minority schemes, EBC fee concessions, and institutional aid." },
  { label: "Student Council", slug: "council", path: "/student-corner/council", desc: "Elected student leadership body, class representatives, and academic/cultural coordination committees." }
]

export default function StudentCorner() {
  const { subpage } = useParams()
  const [page, setPage] = useState(null)
  const [cornerData, setCornerData] = useState(DEFAULT_STUDENT_CORNER_DATA)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      setPage(res)
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          setCornerData(prev => ({
            ...prev,
            ...parsed,
            activities: Array.isArray(parsed.activities) && parsed.activities.length > 0 ? parsed.activities : prev.activities,
            spaces: Array.isArray(parsed.spaces) && parsed.spaces.length > 0 ? parsed.spaces : prev.spaces,
            support: {
              ...prev.support,
              ...(parsed.support || {}),
              items: Array.isArray(parsed.support?.items) && parsed.support.items.length > 0 ? parsed.support.items : prev.support.items
            },
            achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements,
            scholarships: {
              ...prev.scholarships,
              ...(parsed.scholarships || {}),
              items: Array.isArray(parsed.scholarships?.items) && parsed.scholarships.items.length > 0 ? parsed.scholarships.items : prev.scholarships.items
            },
            council: {
              ...prev.council,
              ...(parsed.council || {}),
              items: Array.isArray(parsed.council?.items) && parsed.council.items.length > 0 ? parsed.council.items : prev.council.items
            }
          }))
        } catch {
          // If content_html is raw string, keep default data
        }
      }
    }).catch(() => {})
  }, [])

  // Normalize subpage slug
  let currentSlug = (subpage || '').toLowerCase().trim()
  if (currentSlug === 'student-activities') currentSlug = 'activities'
  if (currentSlug === 'student-support') currentSlug = 'support'
  if (currentSlug === 'student-achievements') currentSlug = 'achievements'
  if (currentSlug === 'student-council') currentSlug = 'council'

  const activeSubmenu = STUDENT_SUBMENUS.find(s => s.slug === currentSlug)

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

  const pageTitle = activeSubmenu ? `${activeSubmenu.label} — Student Corner` : "Student Corner"

  return (
    <PageShell title={pageTitle} banner={page?.banner_url}>
      <div className="student-corner-page-wrapper">

        {/* ========================================================
            CASE 1: OVERVIEW HUB (/student-corner)
            ======================================================== */}
        {!currentSlug && (
          <div className="student-corner-overview-hub">
            <div className="academics-intro-block">
              <h1 className="academics-page-title">Student Corner & Campus Life</h1>
              <p className="academics-page-lead">
                Fostering an enriching academic environment that nurtures intellectual curiosity, clinical competence,
                ethical values, and physical wellness. Explore all student services, governance, welfare cells, and extracurricular avenues.
              </p>
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Student Life & Services</h2>
            <div className="submenu-overview-grid">
              {STUDENT_SUBMENUS.map((item, idx) => (
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

            <div style={{ marginTop: 40 }}>
              <CampusActivitiesSection 
                activities={cornerData.activities} 
                spaces={cornerData.spaces} 
                showSpaces={true} 
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMENU 1: ACTIVITIES (/student-corner/activities)
            ======================================================== */}
        {currentSlug === 'activities' && (
          <CampusActivitiesSection 
            activities={cornerData.activities} 
            spaces={cornerData.spaces} 
            showSpaces={true} 
          />
        )}

        {/* ========================================================
            SUBMENU 2: SUPPORT & MENTORSHIP (/student-corner/support)
            ======================================================== */}
        {currentSlug === 'support' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Student Support & Mentorship System</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              The college provides a structured student support system ensuring that every student receives individualized
              academic, psychological, and personal guidance throughout their 4.5-year BPT education.
            </p>

            {cornerData.support?.guardianScheme && (
              <div className="academics-notice-box" style={{ marginBottom: 20 }}>
                <strong>Guardian Faculty Scheme (Teacher-Guardian): </strong>
                <span>{cornerData.support.guardianScheme}</span>
              </div>
            )}

            <div className="student-cards-grid">
              {cornerData.support?.items?.map((item, i) => (
                <div key={item.id || i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 3: ACHIEVEMENTS (/student-corner/achievements)
            ======================================================== */}
        {currentSlug === 'achievements' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Student Achievements & Honors</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Celebrating our students' excellence in MUHS university examinations, national scientific paper presentations, sports tournaments, and clinical skills competitions.
            </p>

            {/* Desktop Table View */}
            <div className="achievements-desktop-view academics-table-wrapper" style={{ marginTop: 16 }}>
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>Sr.</th>
                    <th style={{ width: '32%' }}>Achievement Title</th>
                    <th style={{ width: '60%' }}>Details & Recognition</th>
                  </tr>
                </thead>
                <tbody>
                  {cornerData.achievements?.map((a, i) => (
                    <tr key={a.id || i}>
                      <td>{i + 1}</td>
                      <td><strong style={{ color: 'var(--navy-header)' }}>{a.title}</strong></td>
                      <td style={{ color: '#334155' }}>{a.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="achievements-mobile-view">
              {cornerData.achievements?.map((a, i) => (
                <div key={a.id || i} className="achievement-mobile-card">
                  <div className="achievement-mobile-top">
                    <span className="achievement-mobile-badge">#{i + 1}</span>
                    <h3 className="achievement-mobile-title">{a.title}</h3>
                  </div>
                  <p className="achievement-mobile-detail">{a.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 4: SCHOLARSHIPS (/student-corner/scholarships)
            ======================================================== */}
        {currentSlug === 'scholarships' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Scholarships & Fee Concessions</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Karmayogi College of Physiotherapy facilitates access to all statutory scholarships and tuition fee concessions
              mandated by the Government of Maharashtra and Directorate of Medical Education and Research (DMER).
            </p>

            <div className="academics-notice-box" style={{ marginBottom: 20 }}>
              <strong>MahaDBT Official Portal Guidance: </strong>
              <span>{cornerData.scholarships?.portalNote || 'Students are assisted by our dedicated College Scholarship Desk to register and submit applications on the MahaDBT Portal.'} </span>
              {cornerData.scholarships?.portalUrl && (
                <a href={cornerData.scholarships.portalUrl} target="_blank" rel="noreferrer" style={{ color: '#0066cc', fontWeight: 600 }}>
                  ({cornerData.scholarships.portalUrl.replace(/^https?:\/\//, '')})
                </a>
              )}
            </div>

            <div className="student-cards-grid">
              {cornerData.scholarships?.items?.map((item, i) => (
                <div key={item.id || i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    {item.authority}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 5: STUDENT COUNCIL (/student-corner/council)
            ======================================================== */}
        {currentSlug === 'council' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">College Student Council</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {cornerData.council?.preamble || 'The College Student Council is constituted under Section 40 of the Maharashtra Public Universities Act, 2016, giving students a democratic platform to voice academic suggestions, organize institutional events, and foster institutional harmony.'}
            </p>

            <div className="student-cards-grid" style={{ marginTop: 18 }}>
              {cornerData.council?.items?.map((item, i) => (
                <div key={item.id || i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 6px' }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{item.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageShell>
  )
}
