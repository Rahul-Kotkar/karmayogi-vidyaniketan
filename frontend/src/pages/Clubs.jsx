import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_CLUBS_DATA } from '../data/collegeData.js'
import { clubsService, getCachedClubsData, setCachedClubsData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

export default function Clubs() {
  const { subpage } = useParams()

  // Prehydrated state from cache; do not show static dummy data if waiting for original server data
  const cached = getCachedClubsData()
  const [clubs, setClubs] = useState(() => (Array.isArray(cached) && cached.length > 0 ? cached : null))
  const [loading, setLoading] = useState(() => !cached || cached.length === 0)

  // Normalize current subpage slug
  const currentSlug = (subpage || '').toLowerCase().trim()

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

  // Fetch live dynamic clubs data from CMS / backend
  useEffect(() => {
    let mounted = true
    const loadClubs = async () => {
      try {
        const data = await clubsService.getAll()
        if (mounted) {
          if (Array.isArray(data) && data.length > 0) {
            setClubs(data)
            setCachedClubsData(data)
          } else {
            setClubs(DEFAULT_CLUBS_DATA)
          }
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setClubs(prev => prev || DEFAULT_CLUBS_DATA)
          setLoading(false)
        }
      }
    }

    loadClubs()
    window.addEventListener('clubs_updated', loadClubs)
    return () => {
      mounted = false
      window.removeEventListener('clubs_updated', loadClubs)
    }
  }, [])

  if (loading && (!clubs || clubs.length === 0)) {
    return (
      <PageShell title="Clubs & Committees">
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
            Loading Clubs & Committees...
          </p>
        </div>
      </PageShell>
    )
  }

  const safeClubs = clubs || []

  // Find active club by slug / id
  const activeClub = safeClubs.find(c => {
    const slug = (c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase()
    return slug === currentSlug
  })

  const pageTitle = activeClub
    ? `${activeClub.name} — Clubs & Committees`
    : "School Clubs & Activity Committees"

  return (
    <PageShell title={pageTitle}>
      <div className="clubs-single-page" style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>

        {/* ========================================================
            NAVIGATION PILLS / SUBMENU TABS
            ======================================================== */}
        <nav className="club-tabs-nav" aria-label="Clubs Navigation" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          margin: '0 0 28px',
          padding: '12px 16px',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0'
        }}>
          <Link
            to="/clubs"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
              background: !currentSlug ? 'var(--blue-vibrant, #003b95)' : '#ffffff',
              color: !currentSlug ? '#ffffff' : '#334155',
              border: !currentSlug ? '1px solid var(--blue-vibrant, #003b95)' : '1px solid #cbd5e1',
              boxShadow: !currentSlug ? '0 2px 6px rgba(0, 59, 149, 0.2)' : 'none'
            }}
          >
            Overview
          </Link>
          {safeClubs.map(c => {
            const slug = c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const isActive = currentSlug === slug.toLowerCase()
            return (
              <Link
                key={slug}
                to={`/clubs/${slug}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--blue-vibrant, #003b95)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  border: isActive ? '1px solid var(--blue-vibrant, #003b95)' : '1px solid #cbd5e1',
                  boxShadow: isActive ? '0 2px 6px rgba(0, 59, 149, 0.2)' : 'none'
                }}
              >
                {c.name}
              </Link>
            )
          })}
        </nav>

        {/* ========================================================
            CASE 1: OVERVIEW PAGE (/clubs)
            ======================================================== */}
        {!currentSlug && (
          <div className="clubs-overview-section">
            <div className="academics-intro-block" style={{
              background: '#134A98',
              color: '#ffffff',
              padding: '36px 32px',
              borderRadius: 14,
              marginBottom: 32,
              boxShadow: '0 8px 24px rgba(19, 74, 152, 0.16)'
            }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: 12
              }}>
                Co-Curricular & Technical Wings
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 14px', color: '#ffffff' }}>
                School Clubs & Activity Committees
              </h1>
              <p style={{ fontSize: '15px', lineHeight: 1.75, margin: 0, color: '#e0f2fe', maxWidth: 840 }}>
                At Karmayogi Vidyaniketan, co-curricular clubs and functional committees bridge the classroom with real-world creativity, leadership, and technical innovation. From vibrant cultural performances to cutting-edge computer lab governance, technical mentoring, and athletic excellence, our student-led committees foster holistic character development and collaborative spirit.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24
            }}>
              {safeClubs.map((c, idx) => {
                const slug = c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                const memberCount = Array.isArray(c.members) ? c.members.length : 0
                return (
                  <article
                    key={slug}
                    style={{
                      background: '#ffffff',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    {c.photo_url && (
                      <div style={{ height: 180, width: '100%', overflow: 'hidden', background: '#f1f5f9' }}>
                        <img
                          src={resolveMediaUrl(c.photo_url)}
                          alt={c.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: 6 }}>
                          Club #{idx + 1}
                        </span>
                        {memberCount > 0 && (
                          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                            {memberCount} Members
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                        {c.name}
                      </h3>
                      {c.subtitle && (
                        <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', margin: '0 0 12px' }}>
                          {c.subtitle}
                        </p>
                      )}
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 18px', flexGrow: 1 }}>
                        {c.info ? (c.info.length > 150 ? `${c.info.slice(0, 150)}...` : c.info) : 'Active student committee and co-curricular body.'}
                      </p>
                      <Link
                        to={`/clubs/${slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px 18px',
                          background: '#073B73',
                          color: '#ffffff',
                          borderRadius: 8,
                          fontSize: '13.5px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'background 0.2s'
                        }}
                      >
                        View Committee Details & Members →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 2: DEDICATED COMMITTEE / CLUB SUBPAGE
            ======================================================== */}
        {activeClub && (
          <section className="club-detail-section" style={{ display: 'grid', gap: 28 }}>
            
            {/* 1. COMMITTEE NAME HEADER */}
            <div className="club-header-block" style={{
              background: '#ffffff',
              padding: '24px 28px',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Active School Committee
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  Academic Year 2026-27
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--heading-font, Merriweather, Georgia, serif)',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--navy-header, #073B73)',
                margin: '0 0 8px',
                lineHeight: 1.3
              }}>
                {activeClub.name}
              </h1>
              {activeClub.subtitle && (
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, fontStyle: 'italic' }}>
                  {activeClub.subtitle}
                </p>
              )}
            </div>

            {/* 2. ONE GROUP PHOTO CENTER WHOLE */}
            <div className="club-group-photo-center-wrapper" style={{
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '100%',
                maxHeight: 520,
                overflow: 'hidden',
                borderRadius: 10,
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={resolveMediaUrl(activeClub.photo_url || '/assets/about_students.png')}
                  alt={`${activeClub.name} Group Photo`}
                  style={{
                    width: '100%',
                    maxHeight: 520,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Fallback gracefully if image path not found
                    e.currentTarget.src = '/assets/hero_building.png'
                  }}
                />
              </div>
              {activeClub.photo_caption && (
                <div style={{
                  marginTop: 12,
                  padding: '8px 16px',
                  color: '#475569',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>{activeClub.photo_caption}</span>
                </div>
              )}
            </div>

            {/* 3. THE INFO */}
            <div className="club-info-card" style={{
              background: '#ffffff',
              padding: '28px 30px',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  width: 4,
                  height: 22,
                  background: 'var(--blue-vibrant, #003b95)',
                  borderRadius: 2
                }} />
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--navy-header, #0f172a)',
                  margin: 0
                }}>
                  Club Information & Key Objectives
                </h2>
              </div>
              <div style={{ color: '#334155', fontSize: '15px', lineHeight: 1.8 }}>
                {activeClub.info ? (
                  activeClub.info.split('\n').filter(Boolean).map((para, pIdx) => (
                    <p key={pIdx} style={{ margin: '0 0 12px' }}>{para}</p>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#64748b' }}>
                    Information for this committee will be updated soon.
                  </p>
                )}
              </div>
            </div>

            {/* 4. TABLE WITH FIELDS ("srno,commiittee memeber name,designation") */}
            <div className="club-members-card" style={{
              background: '#ffffff',
              padding: '28px 30px',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 4,
                    height: 22,
                    background: 'var(--blue-vibrant, #003b95)',
                    borderRadius: 2
                  }} />
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--navy-header, #0f172a)',
                    margin: 0
                  }}>
                    Committee Constitution & Members Directory
                  </h2>
                </div>
                {Array.isArray(activeClub.members) && activeClub.members.length > 0 && (
                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#073B73',
                    background: '#e0f2fe',
                    padding: '4px 12px',
                    borderRadius: 20
                  }}>
                    {activeClub.members.length} Appointed Members
                  </span>
                )}
              </div>

              {Array.isArray(activeClub.members) && activeClub.members.length > 0 ? (
                <>
                  {/* Desktop Table (> 768px) */}
                  <div className="committees-table-wrapper committees-desktop-view">
                    <table className="committees-table">
                      <thead>
                        <tr>
                          <th style={{ width: '12%', textAlign: 'center' }}>Sr. No.</th>
                          <th style={{ width: '53%' }}>Committee Member Name</th>
                          <th style={{ width: '35%' }}>Designation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeClub.members.map((m, mIdx) => (
                          <tr key={mIdx}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                              {m.srno !== undefined ? m.srno : mIdx + 1}
                            </td>
                            <td>
                              <strong style={{ color: 'var(--navy-header, #073B73)', fontSize: '14.5px' }}>
                                {m.name}
                              </strong>
                            </td>
                            <td>
                              <span
                                className="committees-role-badge"
                                style={{
                                  background: (m.designation || '').toLowerCase().includes('in-charge') || (m.designation || '').toLowerCase().includes('head') || (m.designation || '').toLowerCase().includes('president')
                                    ? '#ecfdf5'
                                    : '#f0fdf4',
                                  color: (m.designation || '').toLowerCase().includes('in-charge') || (m.designation || '').toLowerCase().includes('head') || (m.designation || '').toLowerCase().includes('president')
                                    ? '#047857'
                                    : '#15803d',
                                  border: '1px solid #bbf7d0',
                                  padding: '4px 12px',
                                  borderRadius: 20,
                                  fontWeight: 600,
                                  fontSize: '12.5px'
                                }}
                              >
                                {m.designation || 'Member'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View (<= 768px) */}
                  <div className="committees-mobile-cards">
                    {activeClub.members.map((m, mIdx) => (
                      <div key={mIdx} className="committee-member-card" style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: '14px 16px',
                        marginBottom: 10
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#64748b',
                            background: '#e2e8f0',
                            padding: '2px 8px',
                            borderRadius: 4
                          }}>
                            Sr. #{m.srno !== undefined ? m.srno : mIdx + 1}
                          </span>
                          <span
                            style={{
                              background: '#ecfdf5',
                              color: '#047857',
                              padding: '3px 8px',
                              borderRadius: 12,
                              fontSize: 11.5,
                              fontWeight: 700
                            }}
                          >
                            {m.designation || 'Member'}
                          </span>
                        </div>
                        <strong style={{ fontSize: 15, color: 'var(--navy-header, #073B73)' }}>
                          {m.name}
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                  No members currently listed in the roster.
                </p>
              )}
            </div>

            {/* Back Link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <Link
                to="/clubs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#073B73',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                ← Back to All Clubs Overview
              </Link>
            </div>
          </section>
        )}

        {/* Fallback if slug not matched */}
        {currentSlug && !activeClub && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#0f172a', marginBottom: 12 }}>Committee Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>The requested club or committee does not exist or has been relocated.</p>
            <Link
              to="/clubs"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#073B73',
                color: '#ffffff',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Return to Clubs Overview
            </Link>
          </div>
        )}

      </div>
    </PageShell>
  )
}
