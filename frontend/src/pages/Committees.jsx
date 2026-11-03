import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_COMMITTEES_DATA } from '../data/collegeData.js'
import { pagesService, getCachedCommitteesData, setCachedCommitteesData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

export default function Committees() {
  const { subpage } = useParams()

  // Prehydrated state from cache; do not flash default static data while fetching real data
  const cached = getCachedCommitteesData()
  const [committees, setCommittees] = useState(() => (Array.isArray(cached) && cached.length > 0 ? cached : null))
  const [loading, setLoading] = useState(() => !cached || cached.length === 0)

  // Normalize current subpage slug
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

  // Fetch live dynamic committees from CMS pages
  useEffect(() => {
    let mounted = true
    pagesService.getBySlug('committees').then(page => {
      if (mounted) {
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCommittees(parsed)
              setCachedCommitteesData(parsed)
              setLoading(false)
              return
            }
          } catch {}
        }
        setCommittees(DEFAULT_COMMITTEES_DATA)
        setLoading(false)
      }
    }).catch(() => {
      if (mounted) {
        setCommittees(prev => prev || DEFAULT_COMMITTEES_DATA)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  if (loading && (!committees || committees.length === 0)) {
    return (
      <PageShell title="Institutional Committees">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 20px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: 36,
            height: 36,
            border: '3px solid #e2e8f0',
            borderTopColor: '#134A98',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            marginBottom: 16
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500, margin: 0 }}>
            Loading Institutional Committees...
          </p>
        </div>
      </PageShell>
    )
  }

  const safeCommittees = committees || []

  // Build submenu list dynamically from the committees array
  const committeeSubmenus = safeCommittees.map(c => {
    const slug = c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return {
      label: c.name,
      slug: slug,
      path: `/committees/${slug}`,
      desc: c.designation || (typeof c.responsibilities === 'string' ? c.responsibilities.split('\n')[0] : "Statutory institutional committee.")
    }
  })

  // Find active committee
  const activeCommittee = safeCommittees.find(c => {
    const slug = (c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase()
    return slug === currentSlug
  })

  const pageTitle = activeCommittee ? `${activeCommittee.name} — Committees` : "Institutional Committees"

  return (
    <PageShell title={pageTitle}>
      <div className="committees-single-page">

        {/* ========================================================
            CASE 1: OVERVIEW PAGE (/committees)
            ======================================================== */}
        {!currentSlug && (
          <div className="committees-overview-hub">
            <div className="academics-intro-block">
              <h1 className="academics-page-title">Institutional Committees & Statutory Bodies</h1>
              <p className="academics-page-lead">
                In compliance with the directives of Maharashtra University of Health Sciences (MUHS), Nashik,
                the Directorate of Medical Education and Research (DMER), Mumbai, and statutory healthcare regulations,
                the college has constituted dedicated institutional committees to ensure transparent academic administration,
                student welfare, ethical research governance, and campus safety.
              </p>
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Constituted Committees & Boards</h2>
            <div className="submenu-overview-grid">
              {committeeSubmenus.map((item, idx) => (
                <article key={item.slug} className="submenu-overview-card">
                  <div>
                    <div className="submenu-card-header">
                      <span className="submenu-card-badge">{idx + 1}</span>
                      <h3 className="submenu-card-title">{item.label}</h3>
                    </div>
                    <p className="submenu-card-desc">{item.desc}</p>
                  </div>
                  <Link to={item.path} className="submenu-card-btn">
                    View Committee & Members →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 2: DEDICATED COMMITTEE SUBPAGE
            ======================================================== */}
        {activeCommittee && (
          <section className="committees-section">
            <div className="committees-section-header">
              <div>
                <h1 className="committees-section-title">
                  {activeCommittee.name}
                </h1>
              </div>
              {activeCommittee.circular_file && (
                <a
                  href={resolveMediaUrl(activeCommittee.circular_file)}
                  target="_blank"
                  rel="noreferrer"
                  className="committees-download-btn"
                >
                  Download Order / Circular PDF ↓
                </a>
              )}
            </div>

            {/* Mandate & Responsibilities */}
            {activeCommittee.responsibilities && (
              <div className="committees-block" style={{ marginTop: 18 }}>
                <h3 className="committees-block-title">Key Responsibilities & Institutional Mandate</h3>
                <div className="committees-responsibilities-text">
                  {typeof activeCommittee.responsibilities === 'string' ? (
                    activeCommittee.responsibilities.split('\n').filter(Boolean).map((line, lIdx) => (
                      <p key={lIdx} style={{ margin: '0 0 6px' }}>{line}</p>
                    ))
                  ) : (
                    <p>{JSON.stringify(activeCommittee.responsibilities)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Committee Members Table & Mobile Cards */}
            {Array.isArray(activeCommittee.members) && activeCommittee.members.length > 0 && (
              <div className="committees-block" style={{ marginTop: 24 }}>
                <h3 className="committees-block-title">
                  Committee Constitution & Member Directory ({activeCommittee.members.length} Members)
                </h3>

                {/* Desktop Table View (> 768px) */}
                <div className="committees-table-wrapper committees-desktop-view">
                  <table className="committees-table">
                    <thead>
                      <tr>
                        <th style={{ width: '8%' }}>Sr.</th>
                        <th style={{ width: '30%' }}>Member Name</th>
                        <th style={{ width: '24%' }}>Designation</th>
                        <th style={{ width: '20%' }}>Committee Role</th>
                        <th style={{ width: '18%' }}>Department / Affiliation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCommittee.members.map((m, mIdx) => (
                        <tr key={mIdx}>
                          <td>{m.sr || mIdx + 1}</td>
                          <td><strong style={{ color: 'var(--navy-header)' }}>{m.name}</strong></td>
                          <td>{m.designation}</td>
                          <td>
                            <span className={`committees-role-badge ${m.role?.toLowerCase().includes('chair') ? 'role-chair' : m.role?.toLowerCase().includes('secretary') ? 'role-sec' : 'role-member'}`}>
                              {m.role || 'Member'}
                            </span>
                          </td>
                          <td style={{ color: '#475569', fontSize: 13 }}>{m.dept || 'College'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View (<= 768px) */}
                <div className="committees-mobile-cards">
                  {activeCommittee.members.map((m, mIdx) => (
                    <div key={mIdx} className="committee-member-card">
                      <div className="committee-member-top">
                        <span className="committee-member-sr">#{m.sr || mIdx + 1}</span>
                        <strong className="committee-member-name">{m.name}</strong>
                        <span className={`committees-role-badge ${m.role?.toLowerCase().includes('chair') ? 'role-chair' : m.role?.toLowerCase().includes('secretary') ? 'role-sec' : 'role-member'}`}>
                          {m.role || 'Member'}
                        </span>
                      </div>
                      <div className="committee-member-designation">
                        {m.designation}
                      </div>
                      {m.dept && (
                        <div className="committee-member-dept">
                          <span style={{ color: '#64748b' }}>Affiliation:</span> {m.dept}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </PageShell>
  )
}
