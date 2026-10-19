import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_FIELD_TRIPS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  MapPinIcon,
  BusIcon,
  UsersIcon,
  StethoscopeIcon,
  BookOpenIcon
} from '../components/Icons.jsx'

export default function FieldTrips() {
  const [fieldTrips, setFieldTrips] = useState(DEFAULT_FIELD_TRIPS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0) {
            setFieldTrips(parsed.fieldTrips)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Field Trips & Educational Excursions" 
      subtitle="Experiential Learning, Heritage Exploration & Industrial Exposure • Karmayogi Vidyaniketan, Pandharpur"
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
              LEARNING BEYOND CLASSROOM WALLS
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 14px', lineHeight: 1.3 }}>
              Connecting Textbook Concepts with Real-World Wonder
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 22px' }}>
              At <strong>Karmayogi Vidyaniketan</strong>, we believe true curiosity awakens when students step into the real world. Carefully planned educational journeys to historical forts of Maharashtra, astronomical observatories, modern cooperative dairy plants, and agricultural science institutes enrich academic depth and build lifelong camaraderie.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/transport" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>Safe Fleet & Transport Info</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <span>Inquire About Annual Excursions</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80" 
              alt="Students on outdoor heritage excursion" 
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.8px' }}>Annual Excursion</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>Heritage, Science & Industrial Tours</div>
            </div>
          </div>
        </div>

        {/* 3. Four Pillars of Tour Safety & Care */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <BusIcon size={24} color="#b45309" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>GPS-Tracked Yellow Buses</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Speed-governed school vehicles with real-time transit updates for school coordinators.</p>
          </div>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UsersIcon size={24} color="#b45309" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>Female Caretakers & Faculty</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Strict 1:12 teacher-student escort ratio with trained female attendants on every tour.</p>
          </div>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <StethoscopeIcon size={24} color="#b45309" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>First-Aid & Medical Kits</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Comprehensive travel medical kits, hydration stations, and on-call physician tie-ups.</p>
          </div>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <BookOpenIcon size={24} color="#b45309" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>Observation Worksheets</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Structured field questionnaires linking museum and industrial insights to school syllabus.</p>
          </div>
        </div>

        {/* 4. Curated Itineraries Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', background: '#fef3c7', padding: '4px 12px', borderRadius: 12 }}>
              CURATED ITINERARIES
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              Educational Excursion Destinations
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {fieldTrips.map((trip, idx) => (
              <div key={trip.id || idx} style={{
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
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', background: '#fef3c7', padding: '3px 10px', borderRadius: 20 }}>
                      {trip.category || 'Educational Visit'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPinIcon width="14" height="14" style={{ color: '#d97706' }} />
                      {trip.destination}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 8px' }}>
                    {trip.title}
                  </h4>

                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {trip.desc}
                  </p>
                </div>

                {trip.highlights && trip.highlights.length > 0 && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                      Key Learning Highlights:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                      {trip.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4 }}>
                          <CheckCircleIcon width="14" height="14" style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
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

        {/* 5. Bottom Transport Fleet CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #78350f, #451a03)',
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
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>Safe, Comfortable Student Transportation</h3>
            <p style={{ fontSize: '14px', color: '#fde68a', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              All field trips are conducted using our school's own fleet of serviced yellow school buses, operated by verified drivers and attended by female faculty escorts.
            </p>
          </div>
          <Link to="/transport" className="btn btn-secondary" style={{ background: '#ffffff', color: '#78350f', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>View School Bus Fleet &amp; Routes</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
