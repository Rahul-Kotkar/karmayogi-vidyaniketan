import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_SPORTS_TEAMS, DEFAULT_SPORTS_META } from '../data/studentCornerData.js'
import { ActivityIcon, ShieldIcon, MedalIcon, CalendarIcon } from '../components/Icons.jsx'

const HOUSE_TEAMS = [
  { name: 'Prithvi House', element: 'Earth', color: '#16a34a', motto: 'Stability, Resilience & Perseverance', bg: '#f0fdf4', border: '#bbf7d0', points: 445, rank: '2nd' },
  { name: 'Agni House', element: 'Fire', color: '#dc2626', motto: 'Passion, Zeal & Competitive Courage', bg: '#fef2f2', border: '#fecaca', points: 480, rank: '1st (Champions)' },
  { name: 'Jal House', element: 'Water', color: '#0284c7', motto: 'Adaptability, Grace & Collective Strength', bg: '#f0f9ff', border: '#bae6fd', points: 410, rank: '3rd' },
  { name: 'Vayu House', element: 'Air', color: '#d97706', motto: 'Speed, Boundless Intellect & Freedom', bg: '#fffbeb', border: '#fde68a', points: 390, rank: '4th' }
]

const ANNUAL_EVENTS = [
  {
    timing: 'December',
    title: 'Karmotsav - Annual Athletic Meet & Sports Gala',
    desc: 'Grand 3-day Olympic-style sports extravaganza featuring lighting of the school torch, synchronized house march-past, track finals, field events, and championship trophy award ceremony on Shelve sports ground.'
  },
  {
    timing: 'Year-Round (Term 1 & Term 2)',
    title: 'Inter-House Sports League (IHSL)',
    desc: 'Regular weekend inter-house fixtures across Cricket, Football, Kabaddi, Kho-Kho, Volleyball, and Chess between Prithvi, Agni, Jal, and Vayu houses fostering healthy rivalry.'
  },
  {
    timing: 'August – February',
    title: 'District & Divisional DSO Tournaments',
    desc: 'Official District Sports Office (DSO) school representation across athletic championships, football leagues, and regional martial arts meets.'
  },
  {
    timing: '21st June',
    title: 'International Yoga Day Demonstration',
    desc: 'Mass yoga performance involving students, teachers, and school leadership highlighting ancient physical wellness and disciplined living.'
  }
]

const SPORTS_PILLAR_ICONS = [ActivityIcon, ShieldIcon, MedalIcon]

export default function SportsAthletics() {
  const [teams, setTeams] = useState(DEFAULT_SPORTS_TEAMS)
  const [meta, setMeta] = useState(DEFAULT_SPORTS_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(page => {
      if (page?.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          if (Array.isArray(parsed.sportsTeams) && parsed.sportsTeams.length > 0) {
            setTeams(parsed.sportsTeams)
          }
          if (parsed.sports_meta) {
            setMeta({ ...DEFAULT_SPORTS_META, ...parsed.sports_meta })
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
          if (Array.isArray(parsed.sportsTeams) && parsed.sportsTeams.length > 0) {
            setTeams(parsed.sportsTeams)
          }
          if (parsed.sports_meta) {
            setMeta({ ...DEFAULT_SPORTS_META, ...parsed.sports_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
  }, [])

  return (
    <PageShell
      title="Sports & Athletics"
      subtitle="Physical Education, Competitive Squads, Athletic Meets & Inter-House Championship | Karmayogi Vidyaniketan"
    >
      <div style={{ display: 'grid', gap: 36 }}>

        {/* 1. Distinction Callout Bridge Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          borderRadius: 12,
          padding: '20px 24px',
          border: '1.5px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>
              {meta.bridge_badge || 'CAMPUS INFRASTRUCTURE VS STUDENT ATHLETICS'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              {meta.bridge_text || 'Looking for physical playground specifications, track dimensions, and indoor arena facilities?'}
            </div>
          </div>
          <Link
            to={meta.bridge_btn_link || "/sports-facilities"}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span>{meta.bridge_btn_text || 'Explore Sports Facilities'}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 2. Sports Philosophy & Athletic Ethos */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          {meta.badge && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant, #1a56db)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {meta.badge}
              </span>
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 12px' }}>
            {meta.title}
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: '0 0 20px' }}>
            {meta.lead}
          </p>

          {Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {meta.pillars.map((pillar, idx) => {
                const IconComp = SPORTS_PILLAR_ICONS[idx % SPORTS_PILLAR_ICONS.length]
                return (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconComp size={18} color="#1d4ed8" /> {pillar.title}
                    </div>
                    <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 4. Official School Sports Teams & Squads */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant, #1a56db)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              THE KARMAYOGI SQUADS
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '6px 0 0' }}>
              Competitive School Teams &amp; Training Clinics
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: 700, margin: '8px auto 0' }}>
              Students train rigorously under expert physical education directors and NIS-certified sports mentors across multiple sporting disciplines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 24 }}>
            {teams.map((t, idx) => (
              <div key={t.id || idx} style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      {t.badge || t.sport || 'School Squad'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{t.sport}</span>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                    {t.title}
                  </h4>

                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {t.desc}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: 6 }}>
                      <strong style={{ color: '#0f172a' }}>Mentor / Coach:</strong> {t.coach}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155' }}>
                      <strong style={{ color: '#0f172a' }}>Practice Hours:</strong> {t.practice}
                    </div>
                  </div>
                </div>

                {t.achievements && (
                  <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: 8, padding: '10px 14px', marginTop: 8 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase', marginBottom: 2 }}>Squad Honors:</div>
                    <div style={{ fontSize: '12.5px', color: '#713f12', lineHeight: 1.45 }}>{t.achievements}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Inter-House Sports League (IHSL) & Standings */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 30, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold, #c9a227)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              HOUSE SYSTEM &bull; ANNUAL TROPHY RACE
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '6px 0 6px' }}>
              Inter-House Sports League (IHSL)
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: 680, margin: '0 auto' }}>
              Every enrolled student belongs to one of four historic houses, battling across weekend fixtures in Cricket, Football, Kabaddi, Kho-Kho, and Track Athletics for the prestigious Annual Best House Rolling Trophy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
            {HOUSE_TEAMS.map((h, i) => (
              <div key={i} style={{ background: h.bg, border: `1.5px solid ${h.border}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: h.color, margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-header, #0f172a)', margin: '0 0 4px' }}>
                  {h.name}
                </h4>
                <div style={{ fontSize: '12px', fontWeight: 700, color: h.color, textTransform: 'uppercase', marginBottom: 8 }}>
                  Element: {h.element}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', fontStyle: 'italic', lineHeight: 1.4, marginBottom: 14 }}>
                  "{h.motto}"
                </div>
                <div style={{ borderTop: `1px dashed ${h.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Points: {h.points}</span>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: h.color, background: '#ffffff', padding: '3px 8px', borderRadius: 999, border: `1px solid ${h.border}` }}>
                    {h.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Annual Sporting Calendar & Tournaments */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 30, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={22} color="#1d4ed8" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '22px', color: 'var(--navy-header, #0f172a)', margin: 0 }}>
                Annual Athletic Calendar &amp; Tournament Milestones
              </h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: '4px 0 0' }}>
                Official inter-school championships, annual sports meets, and coaching clinic timelines.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {ANNUAL_EVENTS.map((evt, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '3px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 8 }}>
                  {evt.timing}
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                  {evt.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                  {evt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Weekly Student Physical Education Schedule */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '20px', color: 'var(--navy-header, #0f172a)', margin: '0 0 16px' }}>
            Weekly Student Physical Training Routine
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>Session Type</th>
                  <th style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>Timing</th>
                  <th style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>Grade Focus</th>
                  <th style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>Key Activities</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>Morning Fitness &amp; Yoga</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>7:45 AM – 8:15 AM</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>All Grades (Nursery – 10)</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Surya Namaskar, pranayama, posture drills, mass assembly PT</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>Curricular PE Periods</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>45 Mins Daily</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Grade-Wise Rotation</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Sprint technique, ball control, Kabaddi/Kho-Kho drills, rules study</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>After-School Coaching Clinics</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>2:30 PM – 4:30 PM</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>School Squad Athletes</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Cricket nets, football tactics, 400m track sprints, Karate dojo</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>Saturday Inter-House League</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>8:30 AM – 12:00 PM</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Houses (Prithvi, Agni, Jal, Vayu)</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: 13 }}>Competitive league matches, refereeing practice, cheer spirit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
