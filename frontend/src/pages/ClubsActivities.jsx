import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_CLUBS, DEFAULT_CLUBS_META } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  MusicIcon,
  PaletteIcon,
  CompassIcon,
  UsersIcon,
  ClockIcon,
  GraduationCapIcon,
  MedalIcon
} from '../components/Icons.jsx'

const CLUB_ICONS = {
  Sparkles: SparklesIcon,
  BookOpen: BookOpenIcon,
  Music: MusicIcon,
  Palette: PaletteIcon,
  Compass: CompassIcon,
  Users: UsersIcon
}

const PILLAR_ICONS = [ClockIcon, GraduationCapIcon, MedalIcon]

export default function ClubsActivities() {
  const [clubs, setClubs] = useState(DEFAULT_STUDENT_CLUBS)
  const [clubsMeta, setClubsMeta] = useState(DEFAULT_CLUBS_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.clubs) && parsed.clubs.length > 0) {
            setClubs(parsed.clubs)
          }
          if (parsed.clubs_meta) {
            setClubsMeta({ ...DEFAULT_CLUBS_META, ...parsed.clubs_meta })
          }
        } catch {}
      }
    }).catch(() => {})
  }

  useEffect(() => {
    loadData()
    const handleUpdate = (e) => {
      if (e.detail?.content_html) {
        try {
          const parsed = JSON.parse(e.detail.content_html)
          if (Array.isArray(parsed.clubs) && parsed.clubs.length > 0) {
            setClubs(parsed.clubs)
          }
          if (parsed.clubs_meta) {
            setClubsMeta({ ...DEFAULT_CLUBS_META, ...parsed.clubs_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
  }, [])

  return (
    <PageShell 
      title="Student Clubs & Co-Curricular Societies" 
      subtitle="Hands-On Innovation, Creativity & Passions Beyond Textbooks • Karmayogi Vidyaniketan, Pandharpur"
    >
      <div style={{ display: 'grid', gap: 36 }}>

        {/* 1. Hero Feature Banner with Split Layout */}
        <div style={{
          background: '#ffffff',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'stretch'
        }}>
          <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {clubsMeta.badge && (
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant, #0284c7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {clubsMeta.badge}
              </span>
            )}
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              {clubsMeta.title || 'Discovering Passions, Building Future Skills'}
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              {clubsMeta.lead}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to={clubsMeta.explore_btn_link || "/labs"} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{clubsMeta.explore_btn_text || 'Explore Science & STEM Labs'}</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to={clubsMeta.inquire_btn_link || "/contact"} className="btn btn-secondary">
                <span>{clubsMeta.inquire_btn_text || 'Inquire About Club Programs'}</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src={clubsMeta.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"} 
              alt={clubsMeta.image_tag || "Students building robotics project"} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {(clubsMeta.image_sub || clubsMeta.image_tag) && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 20px',
                background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)',
                color: '#ffffff'
              }}>
                {clubsMeta.image_sub && (
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px' }}>
                    {clubsMeta.image_sub}
                  </div>
                )}
                {clubsMeta.image_tag && (
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>
                    {clubsMeta.image_tag}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Club Schedule & Operational Overview (Pillars) */}
        {Array.isArray(clubsMeta.pillars) && clubsMeta.pillars.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {clubsMeta.pillars.map((pillar, idx) => {
              const IconComp = PILLAR_ICONS[idx % PILLAR_ICONS.length]
              return (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <IconComp size={22} color="#1d4ed8" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* 3. Active Clubs Grid */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-royal, #1d4ed8)', textTransform: 'uppercase', letterSpacing: '1px', background: '#eff6ff', padding: '4px 12px', borderRadius: 12 }}>
              {clubsMeta.section_badge || 'ACTIVE SOCIETIES'}
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              {clubsMeta.section_title || 'Explore Our Student Clubs'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {clubs.map((club, idx) => {
              const IconComp = typeof club.icon === 'function' ? club.icon : (CLUB_ICONS[club.icon] || SparklesIcon)
              return (
                <div key={club.id || idx} style={{
                  background: '#ffffff',
                  borderRadius: 12,
                  padding: 24,
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: '#eff6ff',
                      color: 'var(--blue-royal, #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                      border: '1px solid #dbeafe'
                    }}>
                      <IconComp width="22" height="22" />
                    </div>

                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                      {club.title}
                    </h4>

                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {club.description}
                    </p>
                  </div>

                  {club.activities && club.activities.length > 0 && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        Key Pursuits:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                        {club.activities.map((act, i) => (
                          <li key={i} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4 }}>
                            <CheckCircleIcon width="14" height="14" style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. Bottom Labs CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
          borderRadius: 14,
          padding: '32px 28px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))'
        }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>
              {clubsMeta.cta_title || 'Equipped Labs Supporting Club Innovations'}
            </h3>
            <p style={{ fontSize: '14px', color: '#bfdbfe', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              {clubsMeta.cta_desc || 'From our fully air-conditioned computer center to STEM electronics tables and art studios, students have unrestricted access to premium facilities.'}
            </p>
          </div>
          <Link to={clubsMeta.cta_btn_link || "/labs"} className="btn btn-secondary" style={{ background: '#ffffff', color: '#1e3a8a', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>{clubsMeta.cta_btn_text || 'Visit Science & STEM Labs'}</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
