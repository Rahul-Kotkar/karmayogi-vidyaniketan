import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_COMPETITIONS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  TrophyIcon
} from '../components/Icons.jsx'

export default function CompetitionsOlympiads() {
  const [competitions, setCompetitions] = useState(DEFAULT_COMPETITIONS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.competitions) && parsed.competitions.length > 0) {
            setCompetitions(parsed.competitions)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Competitions & Olympiad Mentorship" 
      subtitle="Fostering Academic Rigor, Analytical Thinking & National Honors • Karmayogi Vidyaniketan, Pandharpur"
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
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
              EXCELLENCE & TALENT SEARCH
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              Grooming Young Minds for National & Global Arenas
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              At <strong>Karmayogi Vidyaniketan</strong>, competitive exams are treated not as stressful filters, but as inspiring opportunities to test one's intellectual mettle. We run specialized preparatory modules for SOF Science &amp; Mathematics Olympiads, State Talent Search (MTS), and Government Drawing Grade Certifications.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/student-achievements" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>View Olympiad Medal Winners</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to="/academics/subjects" className="btn btn-secondary">
                <span>Academic Curriculum Details</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80" 
              alt="Student participating in national quiz competition" 
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.8px' }}>Competitive Mentorship</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>Olympiads, Quizzes &amp; Talent Searches</div>
            </div>
          </div>
        </div>

        {/* 3. Three-Step Mentoring Framework */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', marginBottom: 14 }}>
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Weekend Preparatory Batches</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Senior faculty conduct Saturday advanced problem-solving sessions breaking down higher-order thinking (HOTS) math and logical reasoning puzzles.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', marginBottom: 14 }}>
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Simulated OMR Mock Tests</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Timed mock examinations using standard optical mark reader (OMR) answer sheets eliminate exam-day anxiety and train students in speed strategy.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', marginBottom: 14 }}>
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Personal Doubt Remediation</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Small-group faculty clinics analyze incorrect answers, clarify scientific principles, and celebrate gradual score improvements.
            </p>
          </div>
        </div>

        {/* 4. Recognized Olympiads Grid */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '1px', background: '#d1fae5', padding: '4px 12px', borderRadius: 12 }}>
              EXAM PORTFOLIOS
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              Recognized Olympiads &amp; Talent Frameworks
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {competitions.map((comp, idx) => (
              <div key={comp.id || idx} style={{
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
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#065f46', background: '#d1fae5', padding: '3px 10px', borderRadius: 20 }}>
                      {comp.badge || 'National Level'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                      {comp.org}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                    {comp.name}
                  </h4>

                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', background: '#eff6ff', padding: '4px 10px', borderRadius: 6, display: 'inline-block', marginBottom: 12, border: '1px solid #dbeafe' }}>
                    Syllabus / Domains: {comp.subjects}
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {comp.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#047857', fontWeight: 700 }}>
                  <span>Special weekend mentoring batches</span>
                  <span>Previous 10-Yr Papers Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Bottom Laurels CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b, #022c22)',
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
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>Check Out the Hall of Laurels</h3>
            <p style={{ fontSize: '14px', color: '#a7f3d0', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              Discover the students who brought gold medals, state rank certificates, and government drawing grade distinctions back to Karmayogi Vidyaniketan.
            </p>
          </div>
          <Link to="/student-achievements" className="btn btn-secondary" style={{ background: '#ffffff', color: '#064e3b', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>Read Student Laurels &amp; Stats</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
