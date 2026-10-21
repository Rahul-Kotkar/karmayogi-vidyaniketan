import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_FIELD_TRIPS, DEFAULT_FIELD_TRIPS_META } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  MapPinIcon,
  BusIcon,
  UsersIcon,
  StethoscopeIcon,
  BookOpenIcon
} from '../components/Icons.jsx'

const FIELD_TRIP_PILLAR_ICONS = [BusIcon, UsersIcon, StethoscopeIcon, BookOpenIcon]

export default function FieldTrips() {
  const [fieldTrips, setFieldTrips] = useState(DEFAULT_FIELD_TRIPS)
  const [meta, setMeta] = useState(DEFAULT_FIELD_TRIPS_META)

  const loadData = () => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0) {
            setFieldTrips(parsed.fieldTrips)
          }
          if (parsed.field_trips_meta) {
            setMeta({ ...DEFAULT_FIELD_TRIPS_META, ...parsed.field_trips_meta })
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
          if (Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0) {
            setFieldTrips(parsed.fieldTrips)
          }
          if (parsed.field_trips_meta) {
            setMeta({ ...DEFAULT_FIELD_TRIPS_META, ...parsed.field_trips_meta })
          }
        } catch {}
      }
    }
    window.addEventListener('page_student_corner_updated', handleUpdate)
    return () => window.removeEventListener('page_student_corner_updated', handleUpdate)
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
              <Link to={meta.explore_btn_link || "/transport"} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{meta.explore_btn_text || 'Safe Fleet & Transport Info'}</span>
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to={meta.inquire_btn_link || "/contact"} className="btn btn-secondary">
                <span>{meta.inquire_btn_text || 'Inquire About Annual Excursions'}</span>
              </Link>
            </div>
          </div>

          <div style={{ minHeight: 280, position: 'relative', overflow: 'hidden' }}>
            <img 
              src={meta.image || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"} 
              alt={meta.image_tag || "Students on outdoor heritage excursion"} 
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

        {/* 2. Four Pillars of Tour Safety & Care */}
        {Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {meta.pillars.map((pillar, idx) => {
              const IconComp = FIELD_TRIP_PILLAR_ICONS[idx % FIELD_TRIP_PILLAR_ICONS.length]
              return (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <IconComp size={24} color="#b45309" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header, #0f172a)', margin: '0 0 6px' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* 3. Curated Itineraries Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', background: '#fef3c7', padding: '4px 12px', borderRadius: 12 }}>
              {meta.section_badge || 'CURATED ITINERARIES'}
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, Merriweather, serif)', fontSize: '24px', color: 'var(--navy-header, #0f172a)', margin: '10px 0 0' }}>
              {meta.section_title || 'Educational Excursion Destinations'}
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
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>
              {meta.cta_title || 'Safe, Comfortable Student Transportation'}
            </h3>
            <p style={{ fontSize: '14px', color: '#fde68a', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
              {meta.cta_desc || "All field trips are conducted using our school's own fleet of serviced yellow school buses, operated by verified drivers and attended by female faculty escorts."}
            </p>
          </div>
          <Link to={meta.cta_btn_link || "/transport"} className="btn btn-secondary" style={{ background: '#ffffff', color: '#78350f', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>{meta.cta_btn_text || 'View School Bus Fleet & Routes'}</span>
            <ArrowRightIcon width="16" height="16" />
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
