import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_ACHIEVEMENTS } from '../data/studentCornerData.js'
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

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.achievements) && parsed.achievements.length > 0) {
            setAchievements(parsed.achievements)
          }
        } catch {}
      }
    }).catch(() => {})
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
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
              HALL OF EXCELLENCE
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              Every Year, Our Students Make Pandharpur Proud
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              The greatest testament to an institution’s dedication is the caliber of its students. From consistent <strong>100% Class 10 Board exam pass records</strong> to gold medals in international science Olympiads and district sports trophies, our scholars embody discipline, intellect, and grit.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/notices" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>View Recent Merit Circulars</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to="/admissions" className="btn btn-secondary">
                <span>Admission Guidance</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80" 
              alt="Student championship ceremony" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.8px' }}>Merit &amp; Laurels</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>Annual Academic &amp; Sports Trophies</div>
            </div>
          </div>
        </div>

        {/* 3. Dynamic Key Metric Cards */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', background: '#fef3c7', padding: '4px 12px', borderRadius: 12 }}>
              BY THE NUMBERS
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              Milestones of Institutional Pride
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: 'var(--blue-royal, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <BookOpenIcon size={24} color="#1d4ed8" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Class 10 Board Excellence</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>
                Unbroken string of 100% board results with more than 68% candidates securing first-class with distinction. Subject centum (100/100) recorded in Math, Science &amp; Sanskrit.
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'grid', gap: 6 }}>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#2563eb' }} />
                <span>Special merit scholar felicitations</span>
              </li>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#2563eb' }} />
                <span>Parent honor evening at Karmotsav</span>
              </li>
            </ul>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <MedalIcon size={24} color="#b45309" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>SOF Olympiad Medallists</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>
                Over 45 gold, silver, and bronze medals earned every academic year in National Science Olympiad (NSO), International Math Olympiad (IMO), and Cyber Olympiad (NCO).
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'grid', gap: 6 }}>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#d97706' }} />
                <span>Zonal and State top 100 rank holders</span>
              </li>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#d97706' }} />
                <span>Foundation merit certificates &amp; cash honors</span>
              </li>
            </ul>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <TrophyIcon size={24} color="#047857" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Solapur DSO Sports Trophies</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>
                Dominant victories across Solapur District Sports Office (DSO) championships in Kabaddi, Kho-Kho, 100m/200m track sprints, and regional Chess tournaments.
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'grid', gap: 6 }}>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#059669' }} />
                <span>District division championship winners</span>
              </li>
              <li style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircleIcon width="14" height="14" style={{ color: '#059669' }} />
                <span>State tournament qualification track record</span>
              </li>
            </ul>
          </div>
        </div>

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
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#78350f', margin: '0 0 6px' }}>Quarterly Felicitation &amp; Merit Assemblies</h3>
            <p style={{ fontSize: '14px', color: '#92400e', margin: 0, maxWidth: '750px', lineHeight: 1.6 }}>
              We ensure talent does not go unnoticed. Alongside top rank holders, students who demonstrate outstanding personal improvement, artistic passion, or 100% attendance receive commemorative trophies in front of their cheering peers.
            </p>
          </div>
          <Link to="/notices" className="btn btn-secondary" style={{ background: '#b45309', color: '#ffffff', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>Read Latest School Circulars</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
