import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_HOUSES, DEFAULT_STUDENT_COUNCIL, DEFAULT_HOUSES_COUNCIL_META } from '../data/studentCornerData.js'
import { 
  ShieldIcon, 
  CrownIcon, 
  TrophyIcon, 
  UsersIcon, 
  StarIcon, 
  CheckCircleIcon,
  SparklesIcon,
  FlagIcon
} from '../components/Icons.jsx'

const HOUSE_THEMES = {
  'Prithvi House': {
    gradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    symbol: '🌍'
  },
  'Agni House': {
    gradient: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    symbol: '🔥'
  },
  'Jal House': {
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    symbol: '💧'
  },
  'Vayu House': {
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    symbol: '💨'
  }
}

export default function HousesCouncil() {
  const [houses, setHouses] = useState(DEFAULT_STUDENT_HOUSES)
  const [council, setCouncil] = useState(DEFAULT_STUDENT_COUNCIL)
  const [meta, setMeta] = useState(DEFAULT_HOUSES_COUNCIL_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.houses) && parsed.houses.length > 0) {
            setHouses(parsed.houses)
          }
          if (Array.isArray(parsed.council) && parsed.council.length > 0) {
            setCouncil(parsed.council)
          }
          if (parsed.houses_council_meta) {
            setMeta({ ...DEFAULT_HOUSES_COUNCIL_META, ...parsed.houses_council_meta })
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
          if (Array.isArray(parsed.houses) && parsed.houses.length > 0) {
            setHouses(parsed.houses)
          }
          if (Array.isArray(parsed.council) && parsed.council.length > 0) {
            setCouncil(parsed.council)
          }
          if (parsed.houses_council_meta) {
            setMeta({ ...DEFAULT_HOUSES_COUNCIL_META, ...parsed.houses_council_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
  }, [])

  return (
    <PageShell 
      title="Houses & Student Council" 
      subtitle="Fostering Teamwork, Healthy Competition, Leadership & Lifelong Character • Karmayogi Vidyaniketan, Pandharpur"
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
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
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
              <a href={meta.explore_btn_link || "#houses"} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ShieldIcon size={16} /> <span>{meta.explore_btn_text || 'Explore the 4 Houses'}</span>
              </a>
              <a href={meta.inquire_btn_link || "#council"} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <CrownIcon size={16} /> <span>{meta.inquire_btn_text || 'Student Council'}</span>
              </a>
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #002855 0%, #001c3d 100%)',
            padding: '36px 32px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 20
          }}>
            <h3 style={{ fontSize: '19px', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#f8fafc' }}>
              <TrophyIcon size={22} color="#fbbf24" />
              {meta.banner_heading || 'Annual Inter-House Championship'}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              {meta.banner_desc || 'Throughout the academic year, houses compete for the prestigious Cock-House Championship Shield across four competitive domains:'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
                <strong style={{ fontSize: '13.5px', color: '#fbbf24', display: 'block', marginBottom: 2 }}>🏃 Athletics & Sports</strong>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Annual sports meet, relays, cricket, kabaddi, and kho-kho.</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
                <strong style={{ fontSize: '13.5px', color: '#38bdf8', display: 'block', marginBottom: 2 }}>🎭 Stage & Culture</strong>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Drama, singing, classical dance, and Karmotsav gathering.</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
                <strong style={{ fontSize: '13.5px', color: '#4ade80', display: 'block', marginBottom: 2 }}>📚 Academic Olympiads</strong>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Science quizzes, elocution debates, and math competitions.</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
                <strong style={{ fontSize: '13.5px', color: '#f472b6', display: 'block', marginBottom: 2 }}>🎖️ Discipline & Duty</strong>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Assembly march-past, punctuality, and campus cleanliness.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. The Four School Houses */}
        <section id="houses" style={{ scrollMarginTop: '130px' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              FOUR PILLARS OF CAMARADERIE
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '6px 0 8px' }}>
              The School House System
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: 700, margin: '0 auto' }}>
              Each house carries a unique philosophy, distinctive color sash, and sacred motto encouraging students to strive for honor and excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {houses.map((house, idx) => {
              const theme = HOUSE_THEMES[house.name] || {
                gradient: 'linear-gradient(135deg, #002855 0%, #001c3d 100%)',
                bgLight: '#f8fafc',
                borderColor: '#e2e8f0',
                badgeBg: '#e0f2fe',
                badgeText: '#002855',
                symbol: '🛡️'
              }
              return (
                <div 
                  key={house.id || idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: 12,
                    border: `1px solid ${theme.borderColor}`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))'
                  }}
                >
                  <div style={{ height: 8, background: theme.gradient }} />
                  <div style={{ padding: '22px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '26px' }}>{theme.symbol}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: theme.badgeBg,
                        color: theme.badgeText,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        House Flag
                      </span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#002855', margin: '0 0 6px' }}>
                      {house.name}
                    </h3>

                    <div style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: 600, color: theme.badgeText, marginBottom: 12 }}>
                      Motto: "{house.motto}"
                    </div>

                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 18px', flex: 1 }}>
                      {house.description}
                    </p>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                      <span><strong>Leadership:</strong> Captains & Prefects</span>
                      <span style={{ color: theme.badgeText, fontWeight: 700 }}>Active Roster</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Student Council & Leadership Hierarchy */}
        <section id="council" style={{ scrollMarginTop: '130px' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              DEMOCRATIC STUDENT GOVERNANCE
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '6px 0 8px' }}>
              Student Council & Leadership Body
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: 700, margin: '0 auto' }}>
              True leadership is learned by shouldering real accountability. The elected student prefectorial body represents the entire student populace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {council.map((item, idx) => (
              <div 
                key={item.id || idx}
                style={{
                  background: '#ffffff',
                  borderRadius: 12,
                  padding: '24px 22px',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
                  display: 'flex',
                  gap: 16
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  color: '#002855',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {idx === 0 ? <CrownIcon size={22} /> : idx === 1 ? <TrophyIcon size={22} /> : <UsersIcon size={22} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#002855', margin: 0 }}>
                      {item.role}
                    </h4>
                  </div>
                  {item.badge && (
                    <span style={{ display: 'inline-block', fontSize: '10.5px', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>
                      {item.badge}
                    </span>
                  )}
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. The Investiture Ceremony Highlights */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: 12,
          padding: '30px 28px',
          border: '1px solid #cbd5e1',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CEREMONY & CODE OF HONOUR
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#002855', margin: '6px 0 12px' }}>
              The Annual Investiture Ceremony
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, margin: '0 0 14px' }}>
              Every academic year commences with an esteemed investiture assembly where newly elected student leaders receive their official badges, house flags, and sashes from the Management and Principal.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleIcon size={16} color="#16a34a" />
                <span>Democratic voting and speech round for candidate selection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleIcon size={16} color="#16a34a" />
                <span>Solemn student pledge to uphold discipline, empathy, and integrity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleIcon size={16} color="#16a34a" />
                <span>Mentorship under senior faculty advisors & House Masters</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 10, padding: 22, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '16px', color: '#002855', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlagIcon size={18} color="#002855" />
              The Karmayogi Student Oath
            </h4>
            <blockquote style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.7, fontStyle: 'italic', borderLeft: '3px solid #002855', paddingLeft: 12 }}>
              "We solemnly pledge to serve Karmayogi Vidyaniketan with honor and devotion. We shall lead by personal example, defend the dignity of every classmate, respect the guidance of our teachers, and hold aloft the values of character, courage, and service."
            </blockquote>
          </div>
        </div>

        {/* 5. Bottom Navigation & Admission Desk */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '20px 24px',
          background: '#ffffff',
          borderRadius: 10,
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#002855' }}>
              Explore Other Student Corner Activities
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Discover stage arts, Olympiads, hobby clubs, and field excursions.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/cultural-activities" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              Cultural Activities &rarr;
            </Link>
            <Link to="/sports-athletics" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              Sports &amp; Athletics &rarr;
            </Link>
            <Link to="/admission-enquiry" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
              Admission Enquiry &rarr;
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
