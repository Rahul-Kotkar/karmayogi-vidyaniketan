import React from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { 
  BusIcon, 
  ShieldIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  CompassIcon, 
  PhoneIcon 
} from '../components/Icons.jsx'

const ROUTES_COVERED = [
  {
    id: 1,
    title: 'Route 1: Pandharpur City Core & Station Ring',
    coverage: 'Urban Pandharpur & Railway Hub',
    destinations: 'Isbavi (Primary) & Shelve (High School)',
    stops: ['Railway Station Chowk', 'Shivaji Chowk', 'Pradakshina Road', 'Navi Peth', 'Mahadwar Road', 'Link Road', 'Isbavi Primary Campus'],
    morningPickup: '07:15 AM',
    afternoonDrop: '02:35 PM',
    distance: '8 km circuit'
  },
  {
    id: 2,
    title: 'Route 2: Isbavi – Shelve Campus Highway Corridor',
    coverage: 'Inter-Campus & Gadegaon Belt',
    destinations: 'Shelve High School Campus',
    stops: ['Isbavi Substation', 'MSEDCL Division Office', 'Link Road Phata', 'Gadegaon Phata', 'Shelve Village Naka', 'Shelve High School Gate'],
    morningPickup: '07:25 AM',
    afternoonDrop: '02:40 PM',
    distance: '10 km circuit'
  },
  {
    id: 3,
    title: 'Route 3: Kasegaon – Sangola Road Feeder',
    coverage: 'South Pandharpur Suburban Zone',
    destinations: 'Isbavi (Primary) & Shelve (High School)',
    stops: ['Kasegaon Phata', 'Bhatumbare Chowk', 'Gopalpur Road', 'Bhakti Marg Bypass', 'Isbavi & Shelve Campuses'],
    morningPickup: '07:05 AM',
    afternoonDrop: '02:50 PM',
    distance: '14 km circuit'
  },
  {
    id: 4,
    title: 'Route 4: Korti – Wakhari Rural Express',
    coverage: 'North-East Rural Feeder',
    destinations: 'Isbavi (Primary) & Shelve (High School)',
    stops: ['Korti Village Center', 'Korti Phata', 'Wakhari Bypass', 'Tungat Phata', 'Shelve Campus Main Gate'],
    morningPickup: '07:00 AM',
    afternoonDrop: '03:00 PM',
    distance: '16 km circuit'
  },
  {
    id: 5,
    title: 'Route 5: Karad Road – Bohali Rural Belt',
    coverage: 'West Pandharpur Feeder Corridor',
    destinations: 'Shelve High School Campus',
    stops: ['Bohali Naka', 'Sonavale Phata', 'Takli Road Link', 'Pandharpur Ring Road Bypass', 'Shelve Campus'],
    morningPickup: '06:55 AM',
    afternoonDrop: '03:10 PM',
    distance: '18 km circuit'
  },
  {
    id: 6,
    title: 'Route 6: Mohol Road – Ranje Rural Link',
    coverage: 'East Solapur Highway Corridor',
    destinations: 'Isbavi (Primary) & Shelve (High School)',
    stops: ['Ranje Village', 'Puluj Phata', 'Old Karad Naka', 'Anand Nagar', 'Isbavi Campus & Shelve Campus'],
    morningPickup: '07:00 AM',
    afternoonDrop: '03:05 PM',
    distance: '15 km circuit'
  }
]

const SAFETY_PILLARS = [
  {
    title: 'Real-Time GPS Tracking & Speed Governors',
    desc: 'Every yellow bus is fitted with continuous GPS tracking monitored at the central school office, with government-certified speed governors calibrated strictly under 40 km/h.',
    icon: CompassIcon
  },
  {
    title: 'Experienced Drivers & Female Attendants',
    desc: 'All vehicles are driven by verified, licensed commercial drivers accompanied by a caring female attendant on every trip to assist Pre-Primary and Primary pupils safely on and off.',
    icon: ShieldIcon
  },
  {
    title: 'Comprehensive Safety, CCTV & First-Aid',
    desc: 'Each bus carries a fully stocked emergency first-aid kit, dual-camera CCTV monitoring, functional fire extinguisher, emergency exits, and child safety window grilles.',
    icon: CheckCircleIcon
  },
  {
    title: 'Direct Transport Helpline & Dispatch Desk',
    desc: 'Dedicated transport desk coordinator accessible via telephone throughout morning pickup and afternoon drop hours for route inquiries, traffic advisories, and parent support.',
    icon: PhoneIcon
  }
]

export default function Transportation() {
  return (
    <PageShell 
      title="School Bus Transportation & Feeder Routes" 
      subtitle="Safe, Punctual, GPS-Monitored Student Commute | Karmayogi Vidyaniketan, Pandharpur"
    >
      <div style={{ display: 'grid', gap: 36 }}>

        {/* 1. Overview & Fleet Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              RELIABLE &amp; SECURE COMMUTE
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Connecting Young Minds Safely to Both Campuses Daily
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            Karmayogi Vidyaniketan / Karmayogi Public School maintains a dedicated, modern fleet of yellow school buses designed to provide safe, comfortable, and stress-free daily transit for students. Covering key residential sectors within Pandharpur town as well as rural feeder belts, our routes connect directly to the <strong>Isbavi Primary Campus (Nursery to Grade 4)</strong> and the <strong>Shelve Main High School Campus (Grade 5 to Grade 10)</strong>.
          </p>
        </div>

        {/* 2. Key Safety Pillars (4 Cards) */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--gold-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SAFETY COMES FIRST
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', margin: '6px 0 0' }}>
              Built Around Child Protection &amp; Punctuality
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {SAFETY_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div key={i} style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: 'var(--blue-royal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon width="22" height="22" />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
                    {pillar.title}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Comprehensive Covered Routes Directory */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                ROUTE DIRECTORY &bull; ACADEMIC YEAR 2026–27
              </span>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', margin: '4px 0 0' }}>
                Active School Bus Circuits &amp; Designated Stoppages
              </h3>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Covering over 15+ urban and suburban feeder points
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 }}>
            {ROUTES_COVERED.map(r => (
              <div key={r.id} style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', padding: 22, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 4 }}>
                    {r.distance}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {r.coverage}
                  </span>
                </div>

                <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-header)', margin: '0 0 6px' }}>
                  {r.title}
                </h4>

                <div style={{ fontSize: '12.5px', color: 'var(--blue-royal)', fontWeight: 600, marginBottom: 14 }}>
                  Serves: {r.destinations}
                </div>

                <div style={{ flex: 1, marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPinIcon width="14" height="14" style={{ color: 'var(--blue-vibrant)' }} />
                    Key Stoppages:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {r.stops.map((stop, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '11.5px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 8px', color: '#334155' }}>
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#047857', fontWeight: 600 }}>
                    <ClockIcon width="13" height="13" />
                    Pickup: {r.morningPickup}
                  </div>
                  <div style={{ color: '#475569', fontWeight: 600 }}>
                    Drop: {r.afternoonDrop}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Transport Code of Conduct & Parent Guidelines */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--navy-header)', margin: '0 0 16px' }}>
            Parent Guidelines &amp; Student Bus Etiquette
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircleIcon width="18" height="18" style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
              <span><strong>Arrival Time:</strong> Students must report to their designated stoppage 5 minutes prior to scheduled morning pickup time.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircleIcon width="18" height="18" style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
              <span><strong>Pre-Primary Pickups:</strong> Kindergarten children will only be handed over in the afternoon to guardians holding authorized school ID cards.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircleIcon width="18" height="18" style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
              <span><strong>In-Bus Discipline:</strong> Students must remain seated while the vehicle is in motion. Unruly conduct or distracting the driver is strictly prohibited.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircleIcon width="18" height="18" style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
              <span><strong>Route Changes:</strong> Any permanent stoppage or route modification request must be submitted in writing to the transport desk 7 days in advance.</span>
            </div>
          </div>
        </div>

        {/* 5. Direct Action & Transport Desk Support CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071d3a 0%, #0b2545 60%, #0d3b66 100%)', borderRadius: 14, padding: '36px 32px', color: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                HAVE QUESTIONS ABOUT BUS STOPS OR ADMISSION?
              </span>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: '#ffffff', margin: '8px 0 12px' }}>
                Opt-in During Admission or Contact Transport Desk
              </h3>
              <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65, margin: '0 0 18px' }}>
                School bus seats are allocated on a first-come, first-served basis according to vehicle capacity on each feeder line. To confirm your child's route for the upcoming term, connect with our transport counselors.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary" style={{ background: '#0284c7', borderColor: '#0284c7' }}>
                  Enquire Bus Route &amp; Stop &rarr;
                </Link>
                <Link to="/admissions" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.6)' }}>
                  Admission Overview
                </Link>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 22, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', marginBottom: 6 }}>
                Direct Transport Helplines
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
                +91-8459863477
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#93c5fd', marginBottom: 12 }}>
                +91-9527632033
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                Email: <span style={{ color: '#ffffff' }}>vijaymadane3@gmail.com</span><br />
                Office Hours: Mon–Sat 8:00 AM – 2:00 PM (Sunday Closed)
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
