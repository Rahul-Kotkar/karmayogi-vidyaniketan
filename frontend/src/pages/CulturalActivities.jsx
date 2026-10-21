import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_CULTURAL_EVENTS, DEFAULT_CULTURAL_META } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  SparklesIcon,
  TheaterIcon,
  MusicIcon,
  FlagIcon
} from '../components/Icons.jsx'

const CULTURAL_PILLAR_ICONS = [TheaterIcon, MusicIcon, FlagIcon]
const CULTURAL_PILLAR_COLORS = [
  { bg: '#f5f3ff', color: '#7c3aed' },
  { bg: '#fffbeb', color: '#b45309' },
  { bg: '#ecfdf5', color: '#047857' }
]

export default function CulturalActivities() {
  const [culturalEvents, setCulturalEvents] = useState(DEFAULT_CULTURAL_EVENTS)
  const [meta, setMeta] = useState(DEFAULT_CULTURAL_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.cultural) && parsed.cultural.length > 0) {
            setCulturalEvents(parsed.cultural)
          }
          if (parsed.cultural_meta) {
            setMeta({ ...DEFAULT_CULTURAL_META, ...parsed.cultural_meta })
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
          if (Array.isArray(parsed.cultural) && parsed.cultural.length > 0) {
            setCulturalEvents(parsed.cultural)
          }
          if (parsed.cultural_meta) {
            setMeta({ ...DEFAULT_CULTURAL_META, ...parsed.cultural_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
  }, [])

  return (
    <PageShell 
      title="Cultural Activities & Karmotsav" 
      subtitle="Fostering Art, Expression, Music & Heritage • Karmayogi Vidyaniketan, Pandharpur"
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
            {meta.badge && (
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {meta.badge}
              </span>
            )}
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              {meta.title}
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              {meta.lead}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to={meta.explore_btn_link || "/gallery"} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{meta.explore_btn_text || 'View Cultural Photo Gallery'}</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to={meta.inquire_btn_link || "/events"} className="btn btn-secondary">
                <span>{meta.inquire_btn_text || 'Upcoming Cultural Calendar'}</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src={meta.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"} 
              alt={meta.image_tag || "Student Cultural Gathering"} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {(meta.image_sub || meta.image_tag) && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 20px',
                background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)',
                color: '#ffffff'
              }}>
                {meta.image_sub && (
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#facc15', letterSpacing: '0.8px' }}>
                    {meta.image_sub}
                  </div>
                )}
                {meta.image_tag && (
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>
                    {meta.image_tag}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Pillars of Cultural Expression */}
        {Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {meta.pillars.map((pillar, idx) => {
              const IconComp = CULTURAL_PILLAR_ICONS[idx % CULTURAL_PILLAR_ICONS.length]
              const styleTheme = CULTURAL_PILLAR_COLORS[idx % CULTURAL_PILLAR_COLORS.length]
              return (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: styleTheme.bg, color: styleTheme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <IconComp size={24} color={styleTheme.color} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {pillar.desc}
                  </p>
                  {pillar.tag && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 14, fontSize: '11.5px', fontWeight: 700, color: styleTheme.color }}>
                      {pillar.tag}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 3. Dynamic Cultural Events Cards */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '1px', background: '#f3e8ff', padding: '4px 12px', borderRadius: 12 }}>
              {meta.section_badge || 'FEATURED CELEBRATIONS'}
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              {meta.section_title || 'Signature Cultural Events & Showcases'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {culturalEvents.map((evt, idx) => (
              <div key={evt.id || idx} style={{
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b21a8', background: '#f3e8ff', padding: '3px 10px', borderRadius: 20 }}>
                      {evt.badge || 'Annual Event'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                      {evt.tag || 'Performing Arts'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                    {evt.title}
                  </h4>

                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {evt.desc}
                  </p>
                </div>

                {evt.highlights && evt.highlights.length > 0 && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                      Key Highlights:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                      {evt.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4 }}>
                          <CheckCircleIcon width="14" height="14" style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Bottom Cultural Photo Gallery CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #4c1d95, #312e81)',
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
              {meta.cta_title || 'Relive the Memories of Past Karmotsav Events'}
            </h3>
            <p style={{ fontSize: '14px', color: '#e0e7ff', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              {meta.cta_desc || 'Browse through our high-resolution photo archives showcasing student stage dances, traditional lezim troops, drama recitals, and parent felicitations.'}
            </p>
          </div>
          <Link to={meta.cta_btn_link || "/gallery"} className="btn btn-secondary" style={{ background: '#ffffff', color: '#4c1d95', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>{meta.cta_btn_text || 'Explore Photo Gallery'}</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
