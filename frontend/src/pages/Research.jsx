import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_RESEARCH_DATA } from '../data/collegeData.js'
import { pagesService, getCachedResearchData } from '../services/endpoints.js'

const RESEARCH_SUBMENUS = [
  { label: "Research Overview", slug: "overview", path: "/research/overview", desc: "Institutional research vision, thrust areas, and statistical metrics." },
  { label: "Research Centers", slug: "centers", path: "/research/centers", desc: "Specialized biomechanics, gait analysis, and electrodiagnosis research facilities." },
  { label: "Research Projects", slug: "projects", path: "/research/projects", desc: "Ongoing and completed clinical trials, interventions, and studies." },
  { label: "Publications", slug: "publications", path: "/research/publications", desc: "Peer-reviewed scientific journal articles in PubMed, Scopus, and UGC CARE." },
  { label: "Patents", slug: "patents", path: "/research/patents", desc: "Patents filed and granted for innovative physiotherapy and rehabilitation devices." },
  { label: "Research Scholars", slug: "scholars", path: "/research/scholars", desc: "Doctoral (Ph.D.) research scholars, guides, and approved study topics." },
  { label: "Funded Projects", slug: "funded-projects", path: "/research/funded-projects", desc: "Research grants sponsored by MUHS, ICMR, and institutional bodies." },
  { label: "Conferences", slug: "conferences", path: "/research/conferences", desc: "National and international conferences, seminars, and scientific paper presentations." },
  { label: "Journals", slug: "journals", path: "/research/journals", desc: "Institutional journal publications, editorial boards, and author submission guidelines." },
  { label: "Research Achievements", slug: "achievements", path: "/research/achievements", desc: "Best scientific paper awards, honors, and research excellence accolades." }
]

export default function Research() {
  const { subpage } = useParams()

  // Prehydrated state from cache or default institutional dataset
  const [data, setData] = useState(() => {
    const cached = getCachedResearchData()
    if (cached) {
      return {
        ...DEFAULT_RESEARCH_DATA,
        ...cached,
        overview: { ...DEFAULT_RESEARCH_DATA.overview, ...(cached.overview || {}) },
        centers: Array.isArray(cached.centers) && cached.centers.length > 0 ? cached.centers : DEFAULT_RESEARCH_DATA.centers,
        projects: Array.isArray(cached.projects) && cached.projects.length > 0 ? cached.projects : DEFAULT_RESEARCH_DATA.projects,
        publications: Array.isArray(cached.publications) && cached.publications.length > 0 ? cached.publications : DEFAULT_RESEARCH_DATA.publications,
        patents: Array.isArray(cached.patents) && cached.patents.length > 0 ? cached.patents : DEFAULT_RESEARCH_DATA.patents,
        scholars: Array.isArray(cached.scholars) && cached.scholars.length > 0 ? cached.scholars : DEFAULT_RESEARCH_DATA.scholars,
        funded_projects: Array.isArray(cached.funded_projects) && cached.funded_projects.length > 0 ? cached.funded_projects : DEFAULT_RESEARCH_DATA.funded_projects,
        conferences: Array.isArray(cached.conferences) && cached.conferences.length > 0 ? cached.conferences : DEFAULT_RESEARCH_DATA.conferences,
        journals: { ...DEFAULT_RESEARCH_DATA.journals, ...(cached.journals || {}) },
        achievements: Array.isArray(cached.achievements) && cached.achievements.length > 0 ? cached.achievements : DEFAULT_RESEARCH_DATA.achievements
      }
    }
    return DEFAULT_RESEARCH_DATA
  })

  // Normalize subpage slug
  let currentSlug = (subpage || '').toLowerCase().trim()

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
    pagesService.getBySlug('research').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setData(prev => ({
            ...prev,
            ...parsed,
            overview: { ...prev.overview, ...(parsed.overview || {}) },
            centers: Array.isArray(parsed.centers) && parsed.centers.length > 0 ? parsed.centers : prev.centers,
            projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : prev.projects,
            publications: Array.isArray(parsed.publications) && parsed.publications.length > 0 ? parsed.publications : prev.publications,
            patents: Array.isArray(parsed.patents) && parsed.patents.length > 0 ? parsed.patents : prev.patents,
            scholars: Array.isArray(parsed.scholars) && parsed.scholars.length > 0 ? parsed.scholars : prev.scholars,
            funded_projects: Array.isArray(parsed.funded_projects) && parsed.funded_projects.length > 0 ? parsed.funded_projects : prev.funded_projects,
            conferences: Array.isArray(parsed.conferences) && parsed.conferences.length > 0 ? parsed.conferences : prev.conferences,
            journals: { ...prev.journals, ...(parsed.journals || {}) },
            achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements
          }))
        } catch {}
      }
    }).catch(() => {})
  }, [])

  const overview = data.overview || DEFAULT_RESEARCH_DATA.overview
  const centers = data.centers || DEFAULT_RESEARCH_DATA.centers
  const projects = data.projects || DEFAULT_RESEARCH_DATA.projects
  const publications = data.publications || DEFAULT_RESEARCH_DATA.publications
  const patents = data.patents || DEFAULT_RESEARCH_DATA.patents
  const scholars = data.scholars || DEFAULT_RESEARCH_DATA.scholars
  const fundedProjects = data.funded_projects || DEFAULT_RESEARCH_DATA.funded_projects
  const conferences = data.conferences || DEFAULT_RESEARCH_DATA.conferences
  const journals = data.journals || DEFAULT_RESEARCH_DATA.journals
  const achievements = data.achievements || DEFAULT_RESEARCH_DATA.achievements

  const activeSubmenu = RESEARCH_SUBMENUS.find(s => s.slug === currentSlug)

  const pageTitle = activeSubmenu ? `${activeSubmenu.label} — Research & Development` : "Research & Development"

  return (
    <PageShell title={pageTitle}>
      <div className="research-single-page">

        {/* ========================================================
            CASE 1: OVERVIEW PAGE (/research)
            ======================================================== */}
        {!currentSlug && (
          <div className="research-overview-hub">
            <div className="research-intro-block">
              <h1 className="research-page-title">{overview.intro_title || "Research & Development (R&D)"}</h1>
              <p className="research-page-lead">
                {overview.intro_lead}
              </p>
              {Array.isArray(overview.stats) && overview.stats.length > 0 && (
                <div className="research-stats-grid">
                  {overview.stats.map((st, idx) => (
                    <div key={idx} className="research-stat-card">
                      <div className="research-stat-val">{st.value}</div>
                      <div className="research-stat-lbl">{st.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Research Sub-Modules & Programs</h2>
            <div className="submenu-overview-grid">
              {RESEARCH_SUBMENUS.map((item, idx) => (
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
            SUBMENU 1: RESEARCH OVERVIEW
            ======================================================== */}
        {currentSlug === 'overview' && (
          <section id="overview" className="research-section">
            <h1 className="research-section-title">Research Framework & Institutional Overview</h1>
            <p className="research-section-intro">
              Institutional research framework, ethical parameters, and clinical translation policies governing academic investigation at Karmayogi Institute of Physiotherapy.
            </p>

            {Array.isArray(overview.stats) && overview.stats.length > 0 && (
              <div className="research-stats-grid">
                {overview.stats.map((st, idx) => (
                  <div key={idx} className="research-stat-card">
                    <div className="research-stat-val">{st.value}</div>
                    <div className="research-stat-lbl">{st.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="research-grid-2">
              <div className="research-card">
                <h3 className="research-card-title">Research Vision</h3>
                <p className="research-card-desc">{overview.vision}</p>
              </div>
              <div className="research-card">
                <h3 className="research-card-title">Research Mission</h3>
                <p className="research-card-desc">{overview.mission}</p>
              </div>
            </div>

            {Array.isArray(overview.thrust_areas) && overview.thrust_areas.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
                  Key Research Thrust Areas:
                </h4>
                <div className="research-chips-wrap">
                  {overview.thrust_areas.map((area, idx) => (
                    <span key={idx} className="research-chip">{area}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            SUBMENU 2: RESEARCH CENTERS
            ======================================================== */}
        {currentSlug === 'centers' && (
          <section id="centers" className="research-section">
            <h1 className="research-section-title">Research Centers & Specialized Laboratories</h1>
            <p className="research-section-intro">
              Dedicated advanced research centers equipped with computerized motion analysis, electrodiagnostic testing, and rehabilitation robotics.
            </p>
            <div className="research-grid-3">
              {centers.map((c, idx) => (
                <div key={c.id || idx} className="research-card">
                  <h3 className="research-card-title">{c.name}</h3>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Coordinator:</span>
                    <span>{c.head}</span>
                  </div>
                  <p className="research-card-desc">{c.description}</p>
                  {Array.isArray(c.facilities) && c.facilities.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <span className="research-meta-label">Equipment & Capabilities:</span>
                      <div className="research-chips-wrap" style={{ marginTop: 4 }}>
                        {c.facilities.map((fac, fIdx) => (
                          <span key={fIdx} className="research-chip">{fac}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 3: RESEARCH PROJECTS
            ======================================================== */}
        {currentSlug === 'projects' && (
          <section id="projects" className="research-section">
            <h1 className="research-section-title">Active & Completed Research Projects</h1>
            <p className="research-section-intro">
              Interdisciplinary clinical investigations led by faculty members and postgraduate scholars across orthopaedics, neurosciences, and sports rehabilitation.
            </p>
            <div className="research-grid-2">
              {projects.map((p, idx) => (
                <div key={p.id || idx} className="research-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 className="research-card-title" style={{ margin: 0 }}>{p.title}</h3>
                    <span className={`research-badge ${p.status === 'Completed' ? 'research-badge-blue' : 'research-badge-accent'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Principal Investigator:</span>
                    <span>{p.pi}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Department:</span>
                    <span>{p.department}</span>
                  </div>
                  <p className="research-card-desc" style={{ marginTop: 8 }}>{p.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 4: PUBLICATIONS
            ======================================================== */}
        {currentSlug === 'publications' && (
          <section id="publications" className="research-section">
            <h1 className="research-section-title">Peer-Reviewed Scientific Publications</h1>
            <p className="research-section-intro">
              Articles authored by our faculty researchers and published in indexed national and international journals (Scopus, PubMed, UGC CARE, Web of Science).
            </p>
            <div className="research-pubs-list">
              {publications.map((pub, idx) => (
                <div key={pub.id || idx} className="research-pub-item">
                  <div className="research-pub-title">{pub.title}</div>
                  <div className="research-pub-authors">{pub.authors}</div>
                  <div className="research-pub-journal">
                    <strong>{pub.journal}</strong> ({pub.year}) · Vol. {pub.volume} | <em>Indexed in {pub.indexing}</em>
                  </div>
                  {pub.doi && (
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ color: '#0066cc' }}>
                        DOI Link: {pub.doi} ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 5: PATENTS
            ======================================================== */}
        {currentSlug === 'patents' && (
          <section id="patents" className="research-section">
            <h1 className="research-section-title">Patents & Intellectual Property Rights (IPR)</h1>
            <p className="research-section-intro">
              Innovative therapeutic devices, assistive rehabilitation technologies, and diagnostic methods developed and patented by our faculty innovators.
            </p>
            <div className="research-grid-2">
              {patents.map((pat, idx) => (
                <div key={pat.id || idx} className="research-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 className="research-card-title" style={{ margin: 0 }}>{pat.title}</h3>
                    <span className={`research-badge ${pat.status === 'Granted' ? 'research-badge-blue' : 'research-badge-accent'}`}>
                      {pat.status}
                    </span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Application / Patent No:</span>
                    <strong>{pat.app_no}</strong>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Inventors:</span>
                    <span>{pat.inventors}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Filing Year:</span>
                    <span>{pat.year}</span>
                  </div>
                  <p className="research-card-desc" style={{ marginTop: 8 }}>{pat.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 6: RESEARCH SCHOLARS
            ======================================================== */}
        {currentSlug === 'scholars' && (
          <section id="scholars" className="research-section">
            <h1 className="research-section-title">Ph.D. Research Scholars & Guides</h1>
            <p className="research-section-intro">
              Doctoral candidates enrolled under recognized MUHS Ph.D. research guides investigating fundamental movement science and translational physiotherapy.
            </p>
            <div className="research-grid-3">
              {scholars.map((sc, idx) => (
                <div key={sc.id || idx} className="research-card">
                  <h3 className="research-card-title">{sc.name}</h3>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Research Guide:</span>
                    <span>{sc.guide}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Topic of Investigation:</span>
                    <strong style={{ color: 'var(--navy-header)' }}>{sc.topic}</strong>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Registration Year:</span>
                    <span>{sc.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 7: FUNDED PROJECTS
            ======================================================== */}
        {currentSlug === 'funded-projects' && (
          <section id="funded-projects" className="research-section">
            <h1 className="research-section-title">Externally Funded Research Projects & Grants</h1>
            <p className="research-section-intro">
              Extramural and intramural research grants funded by the Maharashtra University of Health Sciences, state agencies, and healthcare organizations.
            </p>
            <div className="research-grid-2">
              {fundedProjects.map((fp, idx) => (
                <div key={fp.id || idx} className="research-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 10 }}>
                    <h3 className="research-card-title" style={{ margin: 0 }}>{fp.title}</h3>
                    {(fp.grant_amount || fp.amount) && (
                      <span className="research-badge research-badge-accent">{fp.grant_amount || fp.amount}</span>
                    )}
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Funding Agency:</span>
                    <strong>{fp.agency}</strong>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Principal Investigator:</span>
                    <span>{fp.pi}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Project Tenure:</span>
                    <span>{fp.duration}</span>
                  </div>
                  <p className="research-card-desc" style={{ marginTop: 8 }}>{fp.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 8: CONFERENCES
            ======================================================== */}
        {currentSlug === 'conferences' && (
          <section id="conferences" className="research-section">
            <h1 className="research-section-title">Conferences, Symposia & Workshops</h1>
            <p className="research-section-intro">
              Academic conferences and clinical symposia organized by the institution or attended by faculty presenters to disseminate original research findings.
            </p>
            <div className="research-grid-2">
              {conferences.map((cf, idx) => (
                <div key={cf.id || idx} className="research-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 className="research-card-title" style={{ margin: 0 }}>{cf.name}</h3>
                    <span className="research-badge research-badge-blue">{cf.role}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Dates / Session:</span>
                    <span>{cf.dates}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Venue:</span>
                    <span>{cf.venue}</span>
                  </div>
                  <p className="research-card-desc" style={{ marginTop: 8 }}>{cf.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 9: JOURNALS
            ======================================================== */}
        {currentSlug === 'journals' && (
          <section id="journals" className="research-section">
            <h1 className="research-section-title">Institutional Journal & Research Publications</h1>
            <p className="research-section-intro">{journals.intro}</p>

            <div className="research-grid-2">
              <div className="research-card">
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  Editorial Advisory Board
                </h4>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>
                  {Array.isArray(journals.editorial_board) && journals.editorial_board.map((eb, idx) => (
                    <li key={idx}><strong>{eb.role}:</strong> {eb.name}</li>
                  ))}
                </ul>
              </div>

              <div className="research-card">
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  Author Guidelines & Submissions
                </h4>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
                  {journals.guidelines}
                </p>
                <div style={{ fontSize: 13.5, color: '#1e293b' }}>
                  <strong>Editorial Submissions: </strong>
                  <a href={`mailto:${journals.submission_email}`} style={{ color: '#0066cc', fontWeight: 600 }}>
                    {journals.submission_email}
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 10: RESEARCH ACHIEVEMENTS
            ======================================================== */}
        {currentSlug === 'achievements' && (
          <section id="achievements" className="research-section">
            <h1 className="research-section-title">Research Achievements & Scientific Accolades</h1>
            <p className="research-section-intro">
              Honors, best scientific paper awards, and innovation accolades conferred upon our faculty researchers and scholars.
            </p>
            <div className="research-grid-2">
              {achievements.map((ach, idx) => (
                <div key={ach.id || idx} className="research-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 className="research-card-title" style={{ margin: 0 }}>{ach.title}</h3>
                    <span className="research-badge research-badge-accent">{ach.year}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Recipient:</span>
                    <span>{ach.awardee}</span>
                  </div>
                  <div className="research-meta-item">
                    <span className="research-meta-label">Conferring Organization:</span>
                    <span>{ach.event}</span>
                  </div>
                  <p className="research-card-desc" style={{ marginTop: 8 }}>{ach.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageShell>
  )
}
