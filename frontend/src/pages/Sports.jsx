import React from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { 
  TrophyIcon, 
  HeartIcon, 
  UsersIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ArrowRightIcon 
} from '../components/Icons.jsx'

const SPORTS_FACILITIES = [
  {
    id: 'athletics-football',
    title: '400m Athletic Track & Full-Size Football Field',
    campus: 'Shelve High School Campus',
    badge: 'Outdoor Arena',
    description: 'Expansive grass arena designed for sprint events (100m, 200m, 400m), relay championships, long jump pits, and regulation football tournaments.',
    features: [
      'Multi-lane grass running tracks with marked boundaries',
      'Full-size standard football field with goalposts',
      'Annual house march-past and athletic medal ceremonies',
      'Qualified athletic trainers for endurance building'
    ],
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cricket',
    title: 'Cricket Pitches & Dedicated Practice Nets',
    campus: 'Shelve & Isbavi Campuses',
    badge: 'Outdoor Nets',
    description: 'Turf and concrete net practice cages allowing young cricketers to master stroke play, fast and spin bowling, and match fielding techniques.',
    features: [
      'Multiple boxed practice nets with safety netting',
      'Dedicated coaching for U-12, U-14, and U-16 age brackets',
      'Regular inter-school and friendly league matches',
      'Batting drills, bowling machines, and video analysis basics'
    ],
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'traditional-sports',
    title: 'Traditional Indian Arenas: Kho-Kho & Kabaddi',
    campus: 'Both Campuses',
    badge: 'Traditional Courts',
    description: 'Dedicated clay and mud arenas preserving India’s rich sporting heritage that cultivate razor-sharp reflexes, stamina, courage, and synchronized teamwork.',
    features: [
      'Regulation-dimension Kabaddi mud mats with safety margins',
      'Dual Kho-Kho poles and properly line-marked running corridors',
      'Solapur district school tournament medal winners',
      'Daily coached evening practice sessions'
    ],
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'volleyball-basketball',
    title: 'Hard Courts: Volleyball & Basketball',
    campus: 'Shelve & Isbavi Campuses',
    badge: 'Court Arena',
    description: 'Smooth, durable hard courts featuring regulation-height basketball hoops, tournament volleyball nets, perimeter fencing, and safety runoff buffers.',
    features: [
      'Weather-resistant concrete surface with clear sport striping',
      'Adjustable net systems for Primary and Secondary divisions',
      'Inter-house basketball and volleyball tournaments',
      'Footwork, dribbling, and spike technique development'
    ],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'indoor-arena',
    title: 'Indoor Sports Arena: Badminton, Table Tennis & Chess',
    campus: 'Shelve Campus',
    badge: 'Indoor Complex',
    description: 'Spacious covered sports hall housing tournament-grade Stag table tennis tables, wooden badminton courts, carrom boards, and a dedicated chess room.',
    features: [
      'Tournament-specification table tennis boards & barriers',
      'Multiple chess stations fostering mental tactical strategy',
      'Carrom boards for focus and finger precision',
      'All-weather indoor play sheltered from sun and monsoon'
    ],
    image: 'https://images.unsplash.com/photo-1611255894596-10d4021467ec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'yoga-martial-arts',
    title: 'Yoga, Pranayama & Self-Defense Training',
    campus: 'Both Campuses',
    badge: 'Wellness & Defense',
    description: 'Peaceful, ventilated wellness studio dedicated to daily morning Surya Namaskar, breathwork, posture correction, and disciplined karate / martial arts instruction.',
    features: [
      'Certified yoga masters leading morning assemblies',
      'Karate belt grading and certified self-defense drills for girls',
      'Concentration enhancement and mindful stress relief',
      'Special sessions for posture, spinal health, and flexibility'
    ],
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  }
]

const HOUSES = [
  { name: 'Prithvi House', element: 'Earth', color: '#16a34a', motto: 'Stability, Resilience & Perseverance', bg: '#f0fdf4', border: '#bbf7d0' },
  { name: 'Agni House', element: 'Fire', color: '#dc2626', motto: 'Passion, Zeal & Competitive Courage', bg: '#fef2f2', border: '#fecaca' },
  { name: 'Jal House', element: 'Water', color: '#0284c7', motto: 'Adaptability, Grace & Collective Strength', bg: '#f0f9ff', border: '#bae6fd' },
  { name: 'Vayu House', element: 'Air', color: '#d97706', motto: 'Speed, Boundless Intellect & Freedom', bg: '#fffbeb', border: '#fde68a' }
]

const ANNUAL_SPORTS_CALENDAR = [
  {
    timing: 'December / January',
    title: 'Karmotsav - Annual Athletic Meet',
    desc: 'Grand 3-day multi-discipline sports fest featuring march past by all 4 houses, track events, field finals, and championship trophy award ceremony on Shelve ground.'
  },
  {
    timing: 'Year-Round (Term 1 & Term 2)',
    title: 'Inter-House Sports League (IHSL)',
    desc: 'Regular weekend inter-house fixtures across Cricket, Football, Kabaddi, Kho-Kho, Volleyball, and Chess between Prithvi, Agni, Jal, and Vayu houses.'
  },
  {
    timing: '21st June',
    title: 'International Yoga Day Demonstration',
    desc: 'Mass yoga performance involving students, teachers, and school leadership highlighting ancient physical wellness and disciplined living.'
  },
  {
    timing: 'August – February',
    title: 'District & Divisional DSO Tournaments',
    desc: 'Official District Sports Office (DSO) school representation across athletic championships, football leagues, and regional martial arts meets.'
  }
]

export default function Sports() {
  return (
    <PageShell 
      title="Sports & Athletics Facilities" 
      subtitle="Physical Education, Outdoor Grounds & Championship Arenas | Karmayogi Vidyaniketan, Pandharpur"
    >
      <div style={{ display: 'grid', gap: 36 }}>

        {/* 1. Philosophy & Institutional Vision */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              HEALTH, CHARACTER &bull; EXCELLENCE
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Where Character is Forged on the Playing Field
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            At Karmayogi Vidyaniketan / Karmayogi Public School, physical education is not an extracurricular afterthought—it is an essential foundational pillar of holistic development. From early childhood motor development in Kindergarten through rigorous athletic training in Secondary grades, our expansive playgrounds and multi-sport facilities inspire students to adopt active, lifelong fitness habits, courage in competition, and graceful sportsmanship in defeat.
          </p>
        </div>

        {/* 2. Three Core Pillars (Health, Excellence, Leadership) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: 'var(--blue-royal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <HeartIcon width="22" height="22" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
              Health &amp; Lifelong Fitness
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Daily mandatory physical exercise, aerobic stamina, and screen-free outdoor recreation build strong immunity, postural balance, and lifelong mental wellbeing.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <TrophyIcon width="22" height="22" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
              Competitive Excellence
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Under qualified physical education instructors and NIS certified coaches, our school squads compete proudly at taluka, Solapur district, and state athletic meets.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: 26, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <UsersIcon width="22" height="22" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 8px' }}>
              House Leadership &amp; Teamwork
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              The 4 School Houses (Prithvi, Agni, Jal, Vayu) provide leadership roles, captaincy responsibilities, and team camaraderie during seasonal inter-house tournaments.
            </p>
          </div>
        </div>

        {/* 3. Comprehensive Sports Facilities Grid (6 Cards) */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CAMPUS SPORTS INFRASTRUCTURE
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '6px 0 0' }}>
              Outdoor Arenas &amp; Indoor Complex
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {SPORTS_FACILITIES.map(sport => (
              <div key={sport.id} style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 210, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={sport.image}
                    alt={sport.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(5, 22, 46, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
                    {sport.campus}
                  </div>
                </div>

                <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-royal)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {sport.badge}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy-header)', margin: '4px 0 10px' }}>
                    {sport.title}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>
                    {sport.description}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginTop: 'auto' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>
                      Highlights:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                      {sport.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 7, lineHeight: 1.4 }}>
                          <CheckCircleIcon width="14" height="14" style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Four Houses Championship Banner */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              HOUSE SYSTEM &bull; HEALTHY COMPETITION
            </span>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', margin: '4px 0 6px' }}>
              The Four School Houses
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: 650, margin: '0 auto' }}>
              Every student from Grade 1 upwards is inducted into one of our four houses, competing in year-round athletic leagues, cross-country runs, and team sports.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {HOUSES.map((h, i) => (
              <div key={i} style={{ background: h.bg, border: `1px solid ${h.border}`, borderRadius: 10, padding: 18, textAlign: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: h.color, margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-header)', margin: '0 0 4px' }}>
                  {h.name}
                </h4>
                <div style={{ fontSize: '12px', fontWeight: 700, color: h.color, textTransform: 'uppercase', marginBottom: 6 }}>
                  Element: {h.element}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{h.motto}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Annual Sporting Highlights & Events Timeline */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 28, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CalendarIcon width="20" height="20" style={{ color: 'var(--blue-vibrant)' }} />
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--navy-header)', margin: 0 }}>
              Annual Sporting Calendar &amp; Highlights
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {ANNUAL_SPORTS_CALENDAR.map((evt, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-royal)', background: '#eff6ff', padding: '3px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 8 }}>
                  {evt.timing}
                </span>
                <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 6px' }}>
                  {evt.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                  {evt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Campus Tour & Admission Action CTA */}
        <div style={{ background: 'linear-gradient(135deg, #071d3a 0%, #0b2545 60%, #0d3b66 100%)', borderRadius: 14, padding: '36px 32px', color: '#ffffff', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            SEE OUR SPORTS ARENAS IN PERSON
          </span>
          <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: '#ffffff', margin: '8px 0 12px' }}>
            Want Your Child to Excel in Academics and Athletics?
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: 620, margin: '0 auto 22px', lineHeight: 1.65 }}>
            Admissions are open for Nursery through Grade 10 for the upcoming academic session. We warmly welcome parents to visit our sports grounds, observe physical education classes, and meet our coaching staff.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ background: '#0284c7', borderColor: '#0284c7' }}>
              Schedule a Campus Sports Tour &rarr;
            </Link>
            <Link to="/admissions" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.6)' }}>
              Admission Process &amp; Apply
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
