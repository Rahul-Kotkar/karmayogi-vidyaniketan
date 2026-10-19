import React from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { MapPinIcon, BandageIcon, DropletIcon, ShieldIcon, SproutIcon } from '../components/Icons.jsx'

const CAMPUS_FACILITIES = [
  {
    id: 'athletics-football',
    title: '400m 8-Lane Athletic Track & Full-Size Football Field',
    campus: 'Shelve High School Campus',
    badge: 'Outdoor Stadium Arena',
    dimensions: 'Standard 400-meter oval running track + 105m x 68m FIFA-regulation grass pitch',
    features: [
      'Multi-lane grass running tracks with marked boundaries and sprint straightaways',
      'Full-size standard football field with high-tensile safety netting behind goalposts',
      'Spectator pavilion seating accommodating over 1,500 students and guests',
      'Automated sprinkler systems and dedicated ground staff maintaining green turf'
    ],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cricket',
    title: 'Cricket Pitches & Boxed Practice Net Enclosures',
    campus: 'Shelve & Isbavi Campuses',
    badge: 'Turf & Concrete Practice Cages',
    dimensions: '3 dedicated boxed net bays (22 yards standard pitch length)',
    features: [
      'Multiple boxed practice nets with heavy-gauge safety netting preventing stray balls',
      'Dual-surface options: Natural turf pitch and weather-proof concrete practice slab',
      'Bowling machine compatibility for speed and spin facing drills',
      'Full cricket gear inventory including helmets, leg guards, SG balls, and English willow bats'
    ],
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'traditional-sports',
    title: 'Traditional Indian Arenas: Kho-Kho & Kabaddi',
    campus: 'Both Campuses',
    badge: 'Heritage Clay & Mud Courts',
    dimensions: 'Kabaddi: 13m x 10m with 1m safety runoff | Kho-Kho: 29m x 16m standard field',
    features: [
      'Regulation-dimension soft red mud Kabaddi courts with lime line markings and safety borders',
      'Official dual Kho-Kho wooden poles firmly anchored with shock-absorbing ground preparation',
      'Daily morning maintenance, line re-marking, and water misting for dust-free play',
      'Preserving rural Maharashtra athletic traditions with modern safety supervision'
    ],
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'volleyball-basketball',
    title: 'Hard Courts: Volleyball & Basketball',
    campus: 'Shelve Campus',
    badge: 'All-Weather Acrylic Court',
    dimensions: 'Basketball: 28m x 15m | Volleyball: 18m x 9m with 3m perimeter buffer',
    features: [
      'Weather-resistant acrylic smooth finish with non-slip court traction',
      'Spring-loaded regulation-height basketball backboards and rims',
      'Tournament-spec volleyball post systems with adjustable tension nets',
      'Perimeter chain-link fencing and energy-efficient LED floodlights for evening training'
    ],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'indoor-arena',
    title: 'Indoor Multi-Sport Complex: Badminton, Table Tennis & Chess',
    campus: 'Shelve Campus Indoor Complex',
    badge: 'Covered Sports Arena',
    dimensions: 'Spacious hall accommodating 2 wooden badminton courts and 4 table tennis stations',
    features: [
      'Tournament-grade Stag table tennis tables with safety court barriers and scoreboards',
      'Wooden-floored badminton courts with non-glare LED illumination',
      'Acoustically quiet Chess room equipped with tournament clocks and demonstration boards',
      'Carrom boards, fitness mats, and all-weather play protected from monsoon and peak sun'
    ],
    image: 'https://images.unsplash.com/photo-1611255894596-10d4021467ec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'yoga-martial-arts',
    title: 'Yoga, Pranayama Studio & Martial Arts Dojo',
    campus: 'Both Campuses',
    badge: 'Wellness & Fitness Studio',
    dimensions: 'Airy 1,800 sq.ft hall with rubberized shock-absorbing flooring',
    features: [
      'Eco-friendly yoga mats and posture alignment mirrors for morning assemblies',
      'Dojo safety mats for Karate sparring, high kicks, and fall-defense drills',
      'Cross-ventilation windows overlooking green school grounds for pure airflow',
      'Sound system for meditation bells, pranayama breath counting, and guided mindfulness'
    ],
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  }
]

export default function SportsFacilities() {
  return (
    <PageShell
      title="Campus Sports Facilities & Infrastructure"
      subtitle="Expansive Outdoor Grounds, Cricket Nets, Hard Courts & Indoor Arena | Karmayogi Vidyaniketan, Pandharpur"
    >
      <div style={{ display: 'grid', gap: 36 }}>

        {/* 1. Distinction Callout Bridge Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #eff6ff 100%)',
          borderRadius: 12,
          padding: '20px 24px',
          border: '1.5px solid #fde047',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>
              STUDENT ATHLETICS &bull; TEAMS &bull; COMPETITIONS
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              Looking for student sports squads, after-school coaching schedules, or inter-house leagues?
            </div>
          </div>
          <Link
            to="/sports-athletics"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span>View Sports &amp; Athletics</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 3. Physical Infrastructure Overview */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant, #1a56db)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CAMPUS PHYSICAL AMENITIES &bull; GROUNDS &bull; COURTS
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '0 0 12px' }}>
            Expansive Playgrounds Built to Official Competition Specifications
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: '0 0 24px' }}>
            Karmayogi Vidyaniketan / Karmayogi Public School boasts one of the most comprehensive sports ground complexes in Pandharpur. Spread across multiple acres at our Shelve and Isbavi campuses, our grounds feature regulation dimensions, shock-absorbing mud and turf surfacing, safety netting, and all-weather indoor arenas designed to support physical development from primary playtime to high school athletic championships.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#002855' }}>400m</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Standard Running Track</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#002855' }}>3 Nets</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Cricket Practice Bays</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#002855' }}>6+ Sports</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Dedicated Arenas &amp; Courts</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#002855' }}>100% Safe</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Enclosed &amp; Supervised</div>
            </div>
          </div>
        </div>

        {/* 4. Comprehensive Sports Infrastructure Arenas (6 Cards) */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant, #1a56db)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              FACILITY SPECIFICATIONS
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '26px', color: 'var(--navy-header, #0f172a)', margin: '6px 0 0' }}>
              Outdoor Arenas &amp; Indoor Complexes
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: 680, margin: '8px auto 0' }}>
              Engineered with safety runoffs, official boundaries, quality turf maintenance, and modern sports apparatus.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 24 }}>
            {CAMPUS_FACILITIES.map(item => (
              <div key={item.id} style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 210, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0, 40, 85, 0.9)', color: '#ffffff', fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                    {item.badge}
                  </span>
                  <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255, 255, 255, 0.92)', color: '#0f172a', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPinIcon size={12} color="#002855" /> {item.campus}
                  </span>
                </div>

                <div style={{ padding: '22px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '17.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.35 }}>
                      {item.title}
                    </h4>

                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, fontSize: '12px', color: '#334155', marginBottom: 14, border: '1px solid #e2e8f0' }}>
                      <strong>Dimensions:</strong> {item.dimensions}
                    </div>

                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ marginBottom: 6 }}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Safety, First Aid & Maintenance Standards */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 30, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--heading-font, serif)', fontSize: '22px', color: 'var(--navy-header, #0f172a)', margin: '0 0 16px' }}>
            Sports Safety, First-Aid &amp; Ground Maintenance Protocols
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <BandageIcon size={18} color="#002855" />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>On-Field First Aid Station</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Instant first-aid kits, ice compression packs, antiseptic supplies, and certified physical health attendants on duty during all sports hours.
              </p>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <DropletIcon size={18} color="#002855" />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>RO Hydration Stations</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Chilled and ambient RO purified drinking water points installed adjacent to athletic tracks and outdoor courts ensuring hydration.
              </p>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <ShieldIcon size={18} color="#002855" />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Certified Equipment Standard</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                High-standard sports gear including SG cricket protection, Cosco balls, Stag tables, and soft landing high-jump safety cushions.
              </p>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: '#f8fafc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <SproutIcon size={18} color="#002855" />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Turf &amp; Clay Upkeep</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Daily line re-marking, grass de-weeding, roller compaction, and mud leveling by full-time campus grounds maintenance crew.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Facility Incharge & Hours Information Card */}
        <div style={{
          background: '#002855',
          borderRadius: 12,
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold, #c9a227)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
              CAMPUS SPORTS DIRECTORY
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
              Mr. Pravin K. Jadhav
            </h3>
            <div style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 4 }}>
              Director of Physical Infrastructure &amp; School Sports
            </div>
            <div style={{ fontSize: 13.5, color: '#94a3b8' }}>
              Official Hours: Monday to Saturday: 6:30 AM – 5:30 PM (Sunday Closed)
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/sports-athletics"
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                background: '#ffffff',
                color: '#002855',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              View Student Sports Squads &rarr;
            </Link>
            <Link
              to="/contact"
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              Contact Sports Office
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
