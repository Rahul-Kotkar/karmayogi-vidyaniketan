import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService, getCachedIQACData } from '../services/endpoints.js'
import { DEFAULT_IQAC_DATA } from '../data/iqacData.js'

const IQAC_SUBMENUS = [
  { label: "Internal Quality Assurance Cell", slug: "iqac", path: "/iqac-naac/iqac", desc: "Institutional quality assurance governance, objectives, functions, and committee composition." },
  { label: "NAAC Accreditation", slug: "naac", path: "/iqac-naac/naac", desc: "Grade 'A' (CGPA 3.02) accreditation, peer team metrics, certificate, and criterion scores." },
  { label: "Minutes of IQAC", slug: "minutes", path: "/iqac-naac/minutes", desc: "Quarterly IQAC meeting agendas, official minutes, and Action Taken Reports (ATR)." },
  { label: "Quality Initiatives", slug: "initiatives", path: "/iqac-naac/initiatives", desc: "Faculty development, academic & administrative audits (AAA), and student feedback surveys." },
  { label: "Annual Quality Reports (AQAR)", slug: "aqar", path: "/iqac-naac/aqar", desc: "Year-wise Annual Quality Assurance Reports submitted to NAAC Bengaluru." }
]

export default function IQAC() {
  const { subpage } = useParams()
  const [page, setPage] = useState(null)
  const [data, setData] = useState(() => getCachedIQACData() || DEFAULT_IQAC_DATA)

  useEffect(() => {
    pagesService.getBySlug('iqac-naac')
      .then(res => {
        setPage(res)
        if (res?.content_html) {
          try {
            const parsed = JSON.parse(res.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              overview: { ...prev.overview, ...(parsed.overview || {}) },
              iqac: {
                ...prev.iqac,
                ...(parsed.iqac || {}),
                objectives: Array.isArray(parsed.iqac?.objectives) && parsed.iqac.objectives.length > 0 ? parsed.iqac.objectives : prev.iqac.objectives,
                functions: Array.isArray(parsed.iqac?.functions) && parsed.iqac.functions.length > 0 ? parsed.iqac.functions : prev.iqac.functions
              },
              naac: { ...prev.naac, ...(parsed.naac || {}) },
              minutes: Array.isArray(parsed.minutes) && parsed.minutes.length > 0 ? parsed.minutes : prev.minutes,
              initiatives: Array.isArray(parsed.initiatives) && parsed.initiatives.length > 0 ? parsed.initiatives : prev.initiatives,
              aqar: Array.isArray(parsed.aqar) && parsed.aqar.length > 0 ? parsed.aqar : prev.aqar
            }))
          } catch {
            // Keep default data if content_html is legacy raw HTML
          }
        }
      })
      .catch(() => {})
  }, [])

  // Normalize subpage slug
  let currentSlug = (subpage || '').toLowerCase().trim()
  if (currentSlug === 'cell') currentSlug = 'iqac'
  if (currentSlug === 'reports') currentSlug = 'aqar'

  const activeSubmenu = IQAC_SUBMENUS.find(s => s.slug === currentSlug)

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

  const pageTitle = activeSubmenu ? `${activeSubmenu.label} — IQAC & NAAC` : "IQAC / NAAC"

  return (
    <PageShell title={pageTitle} banner={page?.banner_url}>
      <div className="iqac-page-wrapper">

        {/* ========================================================
            CASE 1: OVERVIEW HUB (/iqac-naac)
            ======================================================== */}
        {!currentSlug && (
          <div className="iqac-overview-hub">
            <div className="academics-intro-block">
              <h1 className="academics-page-title">{data.overview?.title || "Internal Quality Assurance Cell (IQAC) & NAAC Accreditation"}</h1>
              <p className="academics-page-lead">
                {data.overview?.lead || "Developing a systemic mechanism for conscious, consistent, and catalytic quality improvement across all academic, clinical, research, and administrative spheres at Karmayogi College of Physiotherapy."}
              </p>
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Quality Assurance Divisions</h2>
            <div className="submenu-overview-grid">
              {IQAC_SUBMENUS.map((item, idx) => (
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
          </div>
        )}

        {/* ========================================================
            SUBMENU 1: IQAC CELL (/iqac-naac/iqac)
            ======================================================== */}
        {currentSlug === 'iqac' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">{data.iqac?.title || "Internal Quality Assurance Cell (IQAC)"}</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {data.iqac?.intro || "The IQAC was formally established in accordance with NAAC guidelines to institutionalize quality culture, coordinate quality-related pedagogical activities, and disseminate best healthcare education practices."}
            </p>

            <div className="iqac-objectives-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>Core Objectives of IQAC</h3>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>
                  {(data.iqac?.objectives || []).map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>IQAC Core Functions</h3>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>
                  {(data.iqac?.functions || []).map((fn, idx) => (
                    <li key={idx}>{fn}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 2: NAAC ACCREDITATION (/iqac-naac/naac)
            ======================================================== */}
        {currentSlug === 'naac' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">{data.naac?.title || "National Assessment and Accreditation Council (NAAC)"}</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {data.naac?.intro || "The college has been accredited with Grade 'A' (CGPA 3.02 on a 4-point scale) by NAAC, Bengaluru, testifying to our high benchmarks in curriculum delivery, student-centric teaching, research output, hospital infrastructure, and institutional values."}
            </p>

            <div className="academics-stats-grid" style={{ marginBottom: 20 }}>
              <div className="academics-stat-card">
                <div className="academics-stat-val" style={{ color: 'var(--crimson-accent)' }}>{data.naac?.grade || "Grade 'A'"}</div>
                <div className="academics-stat-lbl">NAAC Institutional Rating</div>
              </div>
              <div className="academics-stat-card">
                <div className="academics-stat-val">{data.naac?.cgpa || "3.02"}</div>
                <div className="academics-stat-lbl">Cumulative GPA (CGPA)</div>
              </div>
              <div className="academics-stat-card">
                <div className="academics-stat-val">{data.naac?.cycle || "Cycle 1"}</div>
                <div className="academics-stat-lbl">Accreditation Cycle</div>
              </div>
              <div className="academics-stat-card">
                <div className="academics-stat-val">{data.naac?.recognition || "Sec 2(f)"}</div>
                <div className="academics-stat-lbl">UGC Act Recognition</div>
              </div>
            </div>

            {data.naac?.commendations && (
              <div className="academics-notice-box" style={{ marginBottom: 20 }}>
                <strong>NAAC Peer Team Commendations: </strong>
                <span>{data.naac.commendations}</span>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            SUBMENU 3: MINUTES (/iqac-naac/minutes)
            ======================================================== */}
        {currentSlug === 'minutes' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Minutes of IQAC Meetings & Action Taken Reports</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Proceedings and resolutions of quarterly IQAC meetings along with corresponding Action Taken Reports (ATR)
              overseeing continuous institutional improvement.
            </p>

            {/* Desktop Table View (> 768px) */}
            <div className="academics-table-wrapper iqac-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Meeting Date</th>
                    <th style={{ width: '45%' }}>Key Agenda & Deliberations</th>
                    <th style={{ width: '25%' }}>Action Taken Status</th>
                    <th style={{ width: '15%' }}>Minutes File</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.minutes || []).map((m, idx) => (
                    <tr key={m.id || idx}>
                      <td><strong>{m.date}</strong></td>
                      <td>{m.agenda}</td>
                      <td><span className="academics-badge academics-badge-blue">{m.status || 'Completed'}</span></td>
                      <td>
                        {m.file_url ? (
                          <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="academics-doc-btn" style={{ fontSize: 12 }}>
                            Minutes PDF ↓
                          </a>
                        ) : (
                          <span className="academics-doc-btn" style={{ fontSize: 12, opacity: 0.7 }}>
                            Minutes PDF ↓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (<= 768px) */}
            <div className="iqac-meetings-mobile-cards">
              {(data.minutes || []).map((m, idx) => (
                <div key={m.id || idx} className="iqac-meeting-card">
                  <div className="iqac-meeting-card-head">
                    <strong className="iqac-meeting-date">{m.date}</strong>
                    <span className="academics-badge academics-badge-blue">{m.status || 'Completed'}</span>
                  </div>
                  <p className="iqac-meeting-agenda">{m.agenda}</p>
                  <div className="iqac-meeting-card-foot">
                    {m.file_url ? (
                      <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px' }}>
                        Minutes PDF ↓
                      </a>
                    ) : (
                      <span className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px', opacity: 0.7 }}>
                        Minutes PDF ↓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 4: INITIATIVES (/iqac-naac/initiatives)
            ======================================================== */}
        {currentSlug === 'initiatives' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Institutional Quality Initiatives</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Strategic programs initiated by the IQAC to elevate institutional standards across teaching pedagogy,
              clinical skill training, green campus sustainability, and stakeholder feedback.
            </p>

            <div className="student-cards-grid" style={{ marginTop: 18 }}>
              {(data.initiatives || []).map((init, idx) => (
                <div key={init.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b63e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    <span>{init.title}</span>
                  </h3>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {init.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 5: AQAR (/iqac-naac/aqar)
            ======================================================== */}
        {currentSlug === 'aqar' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Annual Quality Assurance Reports (AQAR)</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              The Annual Quality Assurance Report (AQAR) is prepared and submitted annually by the IQAC to the National
              Assessment and Accreditation Council (NAAC), Bengaluru, capturing the institution's progressive quality performance.
            </p>

            {/* Desktop Table View (> 768px) */}
            <div className="academics-table-wrapper iqac-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Academic Year</th>
                    <th style={{ width: '50%' }}>Report Focus & Criterion Highlights</th>
                    <th style={{ width: '20%' }}>Submission Status</th>
                    <th style={{ width: '15%' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.aqar || []).map((a, idx) => (
                    <tr key={a.id || idx}>
                      <td><strong>{a.year}</strong></td>
                      <td>{a.focus}</td>
                      <td><span className="academics-badge academics-badge-blue">{a.status || 'Submitted'}</span></td>
                      <td>
                        {a.file_url ? (
                          <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="academics-doc-btn" style={{ fontSize: 12 }}>
                            AQAR PDF ↓
                          </a>
                        ) : (
                          <span className="academics-doc-btn" style={{ fontSize: 12, opacity: 0.7 }}>
                            AQAR PDF ↓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (<= 768px) */}
            <div className="iqac-aqar-mobile-cards">
              {(data.aqar || []).map((a, idx) => (
                <div key={a.id || idx} className="iqac-aqar-card">
                  <div className="iqac-aqar-card-head">
                    <strong className="iqac-aqar-year">{a.year}</strong>
                    <span className="academics-badge academics-badge-blue">{a.status || 'Submitted'}</span>
                  </div>
                  <p className="iqac-aqar-focus">{a.focus}</p>
                  <div className="iqac-aqar-card-foot">
                    {a.file_url ? (
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px' }}>
                        AQAR PDF ↓
                      </a>
                    ) : (
                      <span className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px', opacity: 0.7 }}>
                        AQAR PDF ↓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageShell>
  )
}
