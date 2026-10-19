import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_CULTURAL_EVENTS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  SparklesIcon,
  TheaterIcon,
  MusicIcon,
  FlagIcon
} from '../components/Icons.jsx'

export default function CulturalActivities() {
  const [culturalEvents, setCulturalEvents] = useState(DEFAULT_CULTURAL_EVENTS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.cultural) && parsed.cultural.length > 0) {
            setCulturalEvents(parsed.cultural)
          }
        } catch {}
      }
    }).catch(() => {})
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
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
              SIGNATURE ANNUAL GATHERING & ARTS
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              Where Every Child's Talent Finds a Grand Stage
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              Cultural celebrations are the vibrant heartbeat of <strong>Karmayogi Vidyaniketan</strong>. From our flagship annual gathering <em>'Karmotsav'</em> to devotional Ashadhi Ekadashi Dindi processions and classical musical recitals, we empower young learners to overcome stage inhibitions, express their heritage, and master theatrical teamwork.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/gallery" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>View Cultural Photo Gallery</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to="/events" className="btn btn-secondary">
                <span>Upcoming Cultural Calendar</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" 
              alt="Student Cultural Gathering" 
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#facc15', letterSpacing: '0.8px' }}>Annual Gathering</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>Karmotsav Cultural Carnival</div>
            </div>
          </div>
        </div>

        {/* 3. Three Pillars of Cultural Expression */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <TheaterIcon size={24} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Stage Drama & Theatrics</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
              Marathi historical plays, English one-act drama, street plays on social awareness, and moral storytelling that instill articulation and courage.
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 14, fontSize: '11.5px', fontWeight: 700, color: '#7c3aed' }}>
              100% Student Inclusion • Professional Mentorship
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <MusicIcon size={24} color="#b45309" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Music & Vocal Ensembles</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
              Trained vocal music gurus instruct students in classical ragas, Sanskrit shloka chanting, patriotic anthems, harmonium, and rhythmic tabla accompaniments.
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 14, fontSize: '11.5px', fontWeight: 700, color: '#b45309' }}>
              Dedicated Music Studios • Morning Assembly Choirs
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <FlagIcon size={24} color="#047857" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>Heritage Rallies & Dindi</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
              Connecting modern education with Pandharpur's timeless Bhakti culture through the annual Ashadhi Ekadashi School Dindi, Lezim performances, and flag rallies.
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 14, fontSize: '11.5px', fontWeight: 700, color: '#047857' }}>
              Traditional Attire • Community Values & Empathy
            </div>
          </div>
        </div>

        {/* 4. Dynamic Cultural Events Cards */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '1px', background: '#f3e8ff', padding: '4px 12px', borderRadius: 12 }}>
              FEATURED CELEBRATIONS
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              Signature Cultural Events & Showcases
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
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>Relive the Memories of Past Karmotsav Events</h3>
            <p style={{ fontSize: '14px', color: '#e0e7ff', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              Browse through our high-resolution photo archives showcasing student stage dances, traditional lezim troops, drama recitals, and parent felicitations.
            </p>
          </div>
          <Link to="/gallery" className="btn btn-secondary" style={{ background: '#ffffff', color: '#4c1d95', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>Explore Photo Gallery</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
