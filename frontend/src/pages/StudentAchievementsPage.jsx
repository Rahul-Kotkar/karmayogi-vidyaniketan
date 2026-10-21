import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS_META } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  TrophyIcon,
  StarIcon,
  BookOpenIcon,
  MedalIcon
} from '../components/Icons.jsx'

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState(DEFAULT_STUDENT_ACHIEVEMENTS)
  const [meta, setMeta] = useState(DEFAULT_ACHIEVEMENTS_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.achievements) && parsed.achievements.length > 0) {
            setAchievements(parsed.achievements)
          }
          if (parsed.achievements_meta) {
            setMeta({ ...DEFAULT_ACHIEVEMENTS_META, ...parsed.achievements_meta })
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
          if (Array.isArray(parsed.achievements) && parsed.achievements.length > 0) {
            setAchievements(parsed.achievements)
          }
          if (parsed.achievements_meta) {
            setMeta({ ...DEFAULT_ACHIEVEMENTS_META, ...parsed.achievements_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
  }, [])

  return (
    <PageShell 
      title="Student Achievements & Laurels" 
      subtitle="Celebrating Academic Honors, Olympiad Medals & District Athletic Championships • Karmayogi Vidyaniketan, Pandharpur"
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
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
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
              <Link to={meta.explore_btn_link || "/notices"} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{meta.explore_btn_text || 'View Recent Merit Circulars'}</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to={meta.inquire_btn_link || "/admissions"} className="btn btn-secondary">
                <span>{meta.inquire_btn_text || 'Admission Guidance'}</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src={meta.image || "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80"} 
              alt={meta.image_tag || "Student championship ceremony"} 
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
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.8px' }}>
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

        {/* 2. Dynamic Key Metric Cards */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', background: '#fef3c7', padding: '4px 12px', borderRadius: 12 }}>
              {meta.section_badge || 'BY THE NUMBERS'}
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              {meta.section_title || 'Milestones of Institutional Pride'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {achievements.map((item, idx) => (
              <div key={item.id || idx} style={{
                background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
                color: '#ffffff',
                borderRadius: 12,
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '38px', fontWeight: 800, color: '#facc15', fontFamily: 'var(--heading-font, Merriweather, serif)', marginBottom: 8 }}>
                    {item.stat}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>
                    {item.title}
                  </h4>
                </div>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Three Categories of Student Accomplishments */}
        {Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {meta.pillars.map((pillar, idx) => {
              const icons = [BookOpenIcon, MedalIcon, TrophyIcon]
              const colors = [
                { bg: '#eff6ff', color: '#1d4ed8', check: '#2563eb' },
                { bg: '#fffbeb', color: '#b45309', check: '#d97706' },
                { bg: '#ecfdf5', color: '#047857', check: '#059669' }
              ]
              const IconComp = icons[idx % icons.length]
              const theme = colors[idx % colors.length]
              const highlights = Array.isArray(pillar.highlights)
                ? pillar.highlights
                : typeof pillar.highlights === 'string'
                  ? pillar.highlights.split('\n').filter(Boolean)
                  : []

              return (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: theme.bg, color: theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <IconComp size={24} color={theme.color} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>
                      {pillar.desc}
                    </p>
                  </div>
                  {highlights.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'grid', gap: 6 }}>
                      {highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                          <CheckCircleIcon width="14" height="14" style={{ color: theme.check }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 5. Felicitation Culture Card */}
        <div style={{
          background: '#fffbeb',
          borderRadius: 14,
          padding: '28px 24px',
          border: '1px solid #fde68a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16
        }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#78350f', margin: '0 0 6px' }}>
              {meta.felicitation_title || 'Quarterly Felicitation & Merit Assemblies'}
            </h3>
            <p style={{ fontSize: '14px', color: '#92400e', margin: 0, maxWidth: '750px', lineHeight: 1.6 }}>
              {meta.felicitation_desc || 'We ensure talent does not go unnoticed. Alongside top rank holders, students who demonstrate outstanding personal improvement, artistic passion, or 100% attendance receive commemorative trophies in front of their cheering peers.'}
            </p>
          </div>
          <Link to={meta.explore_btn_link || "/notices"} className="btn btn-secondary" style={{ background: '#b45309', color: '#ffffff', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>Read Latest School Circulars</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
