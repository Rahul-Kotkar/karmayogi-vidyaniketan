import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import FacilityCard from '../components/FacilityCard.jsx'
import NoticeCard from '../components/NoticeCard.jsx'
import EventCard from '../components/EventCard.jsx'
import Gallery from '../components/Gallery.jsx'
import heroBuildingImg from '../assets/hero_building.png'
import aboutStudentsImg from '../assets/about_students.png'
import {
  COLLEGE,
  QUICK_INFO_FACTS,
  FACILITIES as DEFAULT_FACILITIES,
  NOTICES as DEFAULT_NOTICES,
  EVENTS as DEFAULT_EVENTS,
  NEWS as DEFAULT_NEWS,
  PRINCIPAL_PHOTO,
  DEFAULT_WHY_ITEMS,
  DEFAULT_TESTIMONIALS
} from '../data/collegeData.js'
import {
  noticesService,
  eventsService,
  facilitiesService,
  pagesService,
  getCachedHomeData,
  setCachedHomeData,
  getCachedAboutData,
  setCachedAboutData,
  getCachedNotices,
  getCachedEvents,
  getCachedFacilities
} from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

function renderWhyIcon(icon) {
  switch (icon) {
    case 'infrastructure':
    case 'building':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </svg>
      )
    case 'curriculum':
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    case 'research':
    case 'lightbulb':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .45 2.22 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      )
    case 'development':
    case 'student':
    case 'grad':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    case 'placement':
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    case 'transport':
    case 'bus':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2l.64-2.54a6 6 0 0 0 .36-2V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6.46a6 6 0 0 0 .36 2L4 17h2" />
          <path d="M4 11h16" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      )
    case 'faculty':
    case 'users':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
  }
}

const DEFAULT_PRINCIPAL_MESSAGE = `Dear Parents, Students and Well-Wishers,

It gives me immense pleasure to welcome you to Karmayogi Vidyaniketan (widely known as Karmayogi Public School), Pandharpur, operating under the visionary management of Shri Pandurang Pratishthan. Schooling is the sacred crucible where a child's character, intellect, curiosity, discipline, and emotional values take permanent shape.

Our school aims to provide a balanced education that develops academic ability, confidence, discipline, creativity, physical fitness and responsible citizenship. We combine modern smart classrooms, experiential science laboratories, and state-of-the-art STEM, AI and Robotics exposure with timeless Indian values and culture.

From our nurturing Pre-Primary foundational wing (Nursery, Jr. KG, Sr. KG) through our activity-rich Primary school and structured Secondary school board examination tracks (CBSE & State Board), our experienced teaching faculty mentors every learner with individualized attention, patience, and encouraging guidance.

Alongside academic rigor, we provide expansive sports grounds, athletic coaching, vibrant cultural festivals, and reliable school bus transportation. I warmly invite you to explore our campuses and join hands with us in shaping bright young minds for a fulfilling future.`

export default function Home() {
  const [homeData, setHomeData] = useState(() => getCachedHomeData())
  const [aboutData, setAboutData] = useState(() => getCachedAboutData())
  const [notices, setNotices] = useState(() => getCachedNotices() || DEFAULT_NOTICES)
  const [events, setEvents] = useState(() => getCachedEvents() || DEFAULT_EVENTS)
  const [facilities, setFacilities] = useState(() => getCachedFacilities() || DEFAULT_FACILITIES)
  const [isHomeLoading, setIsHomeLoading] = useState(() => !getCachedHomeData())
  const [principalExpanded, setPrincipalExpanded] = useState(false)
  const [canExpandPrincipal, setCanExpandPrincipal] = useState(true)
  const principalTextRef = useRef(null)

  const cleanedPrincipalMessage = useMemo(() => {
    const raw = (homeData?.principal_message || DEFAULT_PRINCIPAL_MESSAGE).trim()
    return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  }, [homeData?.principal_message])

  useEffect(() => {
    const el = principalTextRef.current
    if (!el) return
    const checkOverflow = () => {
      if (!principalExpanded) {
        setCanExpandPrincipal(el.scrollHeight > el.clientHeight + 4)
      }
    }
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [cleanedPrincipalMessage, principalExpanded])

  useEffect(() => {
    noticesService.getAll().then(data => {
      if (Array.isArray(data) && data.length > 0) setNotices(data)
    }).catch(() => {})

    eventsService.getAll().then(data => {
      if (Array.isArray(data) && data.length > 0) setEvents(data)
    }).catch(() => {})

    facilitiesService.getAll().then(data => {
      if (Array.isArray(data) && data.length > 0) setFacilities(data)
    }).catch(() => {})

    pagesService.getBySlug('about').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setAboutData(parsed)
          setCachedAboutData(parsed)
        } catch {}
      }
    }).catch(() => {})

    pagesService.getBySlug('home').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setHomeData(parsed)
          setCachedHomeData(parsed)
        } catch {}
      }
      setIsHomeLoading(false)
    }).catch(() => {
      setIsHomeLoading(false)
    })
  }, [])

  const newsList = (homeData?.news_list && Array.isArray(homeData.news_list) && homeData.news_list.length > 0)
    ? homeData.news_list
    : DEFAULT_NEWS

  const testimonialsList = (homeData?.testimonials_list && Array.isArray(homeData.testimonials_list) && homeData.testimonials_list.length > 0)
    ? homeData.testimonials_list
    : DEFAULT_TESTIMONIALS

  const voicesRef = useRef(null)
  const [activeVoiceIdx, setActiveVoiceIdx] = useState(0)

  const handleVoicesScroll = (e) => {
    const el = e.currentTarget
    if (!el) return
    const card = el.firstElementChild
    if (!card) return
    const cardWidth = card.offsetWidth + 16
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveVoiceIdx(Math.max(0, Math.min(idx, testimonialsList.length - 1)))
  }

  const scrollToVoice = (index) => {
    const el = voicesRef.current
    if (!el) return
    const card = el.children[index]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      setActiveVoiceIdx(index)
    }
  }

  return (
    <main id="main">
      {/* =====================================================
          1. HERO SECTION (Shape Young Minds. Build Strong Futures)
          ===================================================== */}
      <Hero data={homeData} />

      {/* =====================================================
          2. QUICK INFORMATION SECTION (6 Core School Highlights)
          ===================================================== */}
      <div className="home-highlights-wrap">
        <div className="home-highlights-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', alignItems: 'center' }}>
          {QUICK_INFO_FACTS.map((fact, idx) => (
            <div key={idx} className="home-highlight-item" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="home-highlight-icon" style={{ flexShrink: 0 }}>
                {renderWhyIcon(fact.icon)}
              </span>
              <strong className="home-highlight-text" style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--navy-header)', lineHeight: 1.25 }}>
                {fact.title}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          3. ABOUT THE SCHOOL SECTION
          ===================================================== */}
      <section className="home-about-section">
        <div className="container">
          <div className="home-about-grid">
            <div className="home-about-photo-col">
              <img
                src={resolveMediaUrl(aboutData?.institute_photo_url || homeData?.about_photo_url, aboutStudentsImg)}
                alt="Students learning at Karmayogi Vidyaniketan"
                className="home-about-photo"
              />
            </div>
            <div className="home-about-text-col">
              <span className="home-about-tag">
                {aboutData?.institute_tag || 'ABOUT KARMAYOGI VIDYANIKETAN'}
              </span>
              <h2 className="home-about-heading">
                {aboutData?.institute_title || 'Nurturing Intellect, Character & Indian Values'}
              </h2>
              <p className="home-about-desc">
                {aboutData?.institute_p1 || 'Karmayogi Vidyaniketan, widely known as Karmayogi Public School, is a co-educational institution located in Pandharpur, Solapur district, Maharashtra. The school operates under the management of Shri Pandurang Pratishthan, Pandharpur.'}
              </p>
              <p className="home-about-desc" style={{ marginTop: '-8px' }}>
                {aboutData?.institute_p2 || 'The school aims to provide a balanced education that develops academic ability, confidence, discipline, creativity, physical fitness and responsible citizenship.'}
              </p>
              <Link
                to="/about"
                className="home-about-btn"
              >
                Know More About Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. PRINCIPAL & SCHOOL LEADERSHIP SECTION
          ===================================================== */}
      <section id="principal-desk" className="section alt">
        <div className="container">
          <SectionHeader
            sub="Leadership Desk"
            title="Principal's Message"
          />
          <div className="principal-wrap">
            <figure className="principal-photo">
              <img
                src={resolveMediaUrl(homeData?.principal_photo_url, PRINCIPAL_PHOTO)}
                alt="Principal, Karmayogi Vidyaniketan"
              />
              <figcaption>
                Mr. Vijay Madane<br />
                <small style={{ whiteSpace: 'pre-line' }}>
                  Principal / Academic Director{'\n'}Karmayogi Vidyaniketan / Karmayogi Public School
                </small>
              </figcaption>
            </figure>
            <div className="prose">
              <div
                ref={principalTextRef}
                className={`principal-message-text ${principalExpanded ? 'is-expanded' : 'is-clamped'}`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {cleanedPrincipalMessage}
              </div>
              {canExpandPrincipal && (
                <button
                  type="button"
                  className="principal-read-more-btn"
                  onClick={() => setPrincipalExpanded(!principalExpanded)}
                  aria-expanded={principalExpanded}
                >
                  {principalExpanded ? 'Read Less ↑' : 'Read Full Message →'}
                </button>
              )}
            </div>
          </div>

          {/* School Leadership Team Cards */}
          <div style={{ marginTop: 44 }}>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--heading-font)', color: 'var(--navy-header)', fontSize: '20px', marginBottom: 20 }}>
              School Leadership &amp; Administration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ background: '#ffffff', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800, color: 'var(--blue-vibrant)' }}>
                  Chairman / Management
                </span>
                <h4 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '6px 0 4px' }}>
                  Shri Pandurang Pratishthan
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Founding governance body guiding educational vision, ethics, infrastructure investment, and student welfare.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800, color: 'var(--blue-vibrant)' }}>
                  Principal / Head of School
                </span>
                <h4 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '6px 0 4px' }}>
                  Mr. Vijay Madane
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Leading academic administration, teacher mentorship, CBSE &amp; State board curriculum integration.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800, color: 'var(--blue-vibrant)' }}>
                  Academic Section Heads
                </span>
                <h4 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '6px 0 4px' }}>
                  Pre-Primary &amp; Primary Coordinators
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Guiding foundational literacy, activity-based pedagogies, science laboratory sessions, and continuous evaluation.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800, color: 'var(--blue-vibrant)' }}>
                  Teaching Faculty &amp; Coaches
                </span>
                <h4 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '6px 0 4px' }}>
                  Dedicated Educators &amp; Sports Mentors
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Qualified subject specialists, STEM lab trainers, language experts, and NIS-certified sports coaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          5. ACADEMICS SECTION (Pre-Primary, Primary, Secondary)
          ===================================================== */}
      <section className="section" id="academics">
        <div className="container">
          <SectionHeader
            sub="Learning Pathways"
            title="Academic Wings &amp; Curriculum"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 36 }}>
            {/* Pre-Primary Card */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80"
                  alt="Pre-Primary Activity Learning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Foundational Stage (Ages 3–6)
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Pre-Primary Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Nursery, Jr. KG and Sr. KG with activity-based and foundational learning. Emphasizes sensory development, phonics, joyful numeracy, motor coordination, and curiosity.
                </p>
                <Link to="/pre-primary" className="btn btn-secondary" style={{ marginTop: 16, textAlign: 'center' }}>
                  Explore Pre-Primary →
                </Link>
              </div>
            </div>

            {/* Primary Card */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80"
                  alt="Primary School Classroom Learning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Preparatory Stage (Grades 1–5)
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Primary School Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Focus on strong fundamentals, curiosity, communication and creativity. Solid literacy in English, Marathi, Hindi, mental math, environmental studies, and digital exploration.
                </p>
                <Link to="/primary" className="btn btn-secondary" style={{ marginTop: 16, textAlign: 'center' }}>
                  Explore Primary School →
                </Link>
              </div>
            </div>

            {/* Secondary Card */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                  alt="Secondary School Academic Rigor"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Middle &amp; Secondary (Grades 6–10)
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Secondary School Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Structured academic learning with preparation for higher education under CBSE &amp; State Board tracks. Intensive lab practicals, AI &amp; Robotics, and mock test series.
                </p>
                <Link to="/secondary" className="btn btn-secondary" style={{ marginTop: 16, textAlign: 'center' }}>
                  Explore Secondary School →
                </Link>
              </div>
            </div>
          </div>

          {/* Teaching Methodologies */}
          <div style={{ background: '#f8fafc', padding: '32px 28px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--heading-font)', color: 'var(--navy-header)', fontSize: '21px', marginBottom: 18 }}>
              Modern Teaching Methodologies at Karmayogi Vidyaniketan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
              {[
                { title: "Activity-Based Learning", desc: "Hands-on projects, games, and tactile manipulative kits." },
                { title: "Smart Classroom Learning", desc: "Interactive digital displays and multimedia video animations." },
                { title: "Experiential Learning", desc: "Real-world scientific observation and field study excursions." },
                { title: "STEM Education", desc: "Integrated science, math, engineering prototypes and logic." },
                { title: "Digital Learning", desc: "Computer labs, coding exercises, and digital assignments." },
                { title: "Project-Based Learning", desc: "Collaborative research and annual science model showcases." },
                { title: "Collaborative Learning", desc: "Teamwork, group discussions, and peer puzzle solving." }
              ].map((m, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: 'var(--blue-vibrant)', fontSize: '14px', display: 'block', marginBottom: 4 }}>
                    ✓ {m.title}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          6. SCHOOL FACILITIES SECTION
          ===================================================== */}
      <section className="section alt" id="facilities">
        <div className="container">
          <SectionHeader
            sub="Modern Infrastructure"
            title="School Facilities"
          />
          <div className="grid grid-4 facilities-grid">
            {facilities.slice(0, 8).map((f, i) => (
              <FacilityCard key={f.id || f.slug || i} facility={f} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link className="btn btn-primary" to="/facilities">View All School Facilities →</Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          7. DEDICATED TRANSPORT & CAMPUS SAFETY SECTION
          ===================================================== */}
      <section className="section" id="transport">
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #071d3a 0%, #0b2545 60%, #0d3b66 100%)', borderRadius: 14, color: '#ffffff', padding: 'clamp(28px, 4vw, 52px)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'center' }}>
              <div>
                <span style={{ color: '#c9a227', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  CAMPUS FLEET &amp; STUDENT SAFETY
                </span>
                <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(24px, 2.5vw, 34px)', margin: '10px 0 16px', color: '#ffffff', lineHeight: 1.3 }}>
                  Safe, Punctual &amp; GPS-Monitored School Bus Transport
                </h2>
                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.7, marginBottom: 20 }}>
                  Karmayogi Vidyaniketan operates a dedicated fleet of GPS-equipped yellow school buses connecting Pandharpur town, Isbavi, Shelve, and neighboring rural feeder routes. With trained drivers, female attendants, and speed governors, we ensure safe and punctual commutes for every child.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 26 }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>15+</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Feeder Routes Covered</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>100%</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>GPS &amp; Attendant Monitored</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/transport" className="btn btn-primary" style={{ background: '#0284c7', borderColor: '#0284c7' }}>
                    Explore Transport Fleet →
                  </Link>
                  <Link to="/contact" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.6)' }}>
                    Enquire Bus Routes
                  </Link>
                </div>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                  alt="Karmayogi School Bus Fleet"
                  style={{ width: '100%', borderRadius: 10, border: '2px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          8. WHY CHOOSE KARMAYOGI VIDYANIKETAN (10 Points)
          ===================================================== */}
      <section className="why-karmayogi-section">
        <div className="container">
          <div className="why-karmayogi-header">
            <span className="why-karmayogi-tag">
              EXCELLENCE IN SCHOOLING
            </span>
            <h2 className="why-karmayogi-heading">
              Why Choose Karmayogi Vidyaniketan?
            </h2>
          </div>
          <div className="why-karmayogi-grid">
            {DEFAULT_WHY_ITEMS.map((item, idx) => (
              <div key={item.id || idx} className="why-card">
                <div className="why-card-icon-wrap">
                  {renderWhyIcon(item.icon)}
                </div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          9. PROMINENT ADMISSIONS SECTION
          ===================================================== */}
      <section className="section" style={{ background: '#f0f7ff', borderTop: '1px solid #bfdbfe', borderBottom: '1px solid #bfdbfe' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px', color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
            ACADEMIC SESSION 2026–27
          </span>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(26px, 3vw, 38px)', color: 'var(--navy-header)', margin: '8px 0 14px' }}>
            Admissions Open
          </h2>
          <p style={{ fontSize: '16.5px', color: '#475569', maxWidth: 680, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Give your child an environment where learning, character and confidence grow together. Applications are welcomed for Nursery through Grade 10.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <Link to="/admissions" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Apply for Admission →
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
              Admission Enquiry Desk
            </Link>
          </div>

          {/* 5-Step Admission Process Flow */}
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', marginBottom: 20 }}>
              Simple 5-Step Admission Process
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
              {[
                { step: "1", title: "Submit Enquiry", desc: "Online or at school front desk" },
                { step: "2", title: "Application", desc: "Form & document submission" },
                { step: "3", title: "Document Verification", desc: "Birth/TC & marks verification" },
                { step: "4", title: "Interaction", desc: "Informal learner readiness review" },
                { step: "5", title: "Confirmation", desc: "Seat allocation & enrollment" }
              ].map((s, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '18px 14px', borderRadius: 8, border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--navy-header)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    {s.step}
                  </div>
                  <strong style={{ display: 'block', fontSize: '14px', color: 'var(--navy-header)', marginBottom: 4 }}>
                    {s.title}
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          10. SPORTS & STUDENT LIFE PREVIEW
          ===================================================== */}
      <section className="home-campus-life-section" id="student-life">
        <div className="container">
          <div className="home-campus-life-grid">
            <div className="home-campus-life-text-col">
              <span className="home-campus-life-eyebrow">
                STUDENT LIFE &amp; ACTIVITY
              </span>
              <h2 className="home-campus-life-heading">
                Sports, Creativity &amp; Child Development
              </h2>
              <p className="home-campus-life-desc">
                From daily physical education and cricket practice to robotics bootcamps, annual day dramatics, and educational field trips, student life at Karmayogi Vidyaniketan is energetic, engaging, and purposeful.
              </p>
              <Link
                to="/student-life"
                className="home-campus-life-btn"
                title="Explore Student Life"
              >
                <span>Discover Student Life</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>

            <div className="home-campus-life-visual-col">
              <div className="home-campus-life-card">
                <div className="home-campus-life-photo-box">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80"
                    alt="Students enjoying sports on school grounds"
                    className="home-campus-life-img"
                  />
                </div>

                <div className="home-campus-life-tiles-grid">
                  <Link
                    to="/sports"
                    className="home-campus-life-tile tile-blue"
                    title="View Sports Facilities"
                  >
                    <div className="home-campus-life-tile-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12a14.5 14.5 0 0 0 20 0" />
                      </svg>
                    </div>
                    <span className="home-campus-life-tile-title">
                      Sports &amp; Athletics
                    </span>
                  </Link>

                  <Link
                    to="/events"
                    className="home-campus-life-tile tile-gold"
                    title="View Cultural & Annual Celebrations"
                  >
                    <div className="home-campus-life-tile-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
                      </svg>
                    </div>
                    <span className="home-campus-life-tile-title">
                      Cultural Celebrations
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          11. NEWS & EVENTS DUAL SECTION
          ===================================================== */}
      <section className="section alt home-notices-events-section" id="news-events">
        <div className="container">
          <div className="home-notices-events-grid">
            {/* Notices Board */}
            <div className="home-dual-col notices-col">
              <div className="home-dual-col-header">
                <div className="home-dual-col-title-group">
                  <span className="home-dual-eyebrow">
                    NOTICE BOARD
                  </span>
                  <h2 className="home-dual-title">School Notices &amp; Circulars</h2>
                </div>
                <Link className="home-dual-header-link" to="/events">
                  View All <span className="arrow-icon">→</span>
                </Link>
              </div>

              <div className="home-dual-col-content">
                <div className="home-dual-items-list">
                  {notices.slice(0, 3).map((n, i) => (
                    <NoticeCard key={n.id || i} notice={n} />
                  ))}
                </div>
              </div>

              <div className="home-dual-col-footer">
                <Link className="home-dual-footer-btn" to="/events">
                  View All Notices &rarr;
                </Link>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="home-dual-col events-col">
              <div className="home-dual-col-header">
                <div className="home-dual-col-title-group">
                  <span className="home-dual-eyebrow">
                    UPCOMING EVENTS
                  </span>
                  <h2 className="home-dual-title">School Calendar &amp; Celebrations</h2>
                </div>
                <Link className="home-dual-header-link" to="/events">
                  View All <span className="arrow-icon">→</span>
                </Link>
              </div>

              <div className="home-dual-col-content">
                <div className="home-dual-items-list home-events-grid">
                  {events.slice(0, 3).map((e, i) => (
                    <EventCard key={e.id || i} event={e} />
                  ))}
                </div>
              </div>

              <div className="home-dual-col-footer">
                <Link className="home-dual-footer-btn" to="/events">
                  View Full Event Calendar &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          12. SCHOOL PHOTO GALLERY
          ===================================================== */}
      <section className="section">
        <div className="container">
          <SectionHeader
            sub="Visual Journey"
            title="School Photo Gallery"
          />
          <Gallery limit={6} />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link className="btn btn-primary" to="/gallery">View Full School Gallery →</Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          13. PARENT & STUDENT VOICES
          ===================================================== */}
      <section className="home-student-voices-section" id="voices">
        <div className="container">
          <div className="student-voices-header">
            <span className="student-voices-eyebrow">
              COMMUNITY VOICES
            </span>
            <h2 className="student-voices-title">
              What Parents Say About Us
            </h2>
            <p className="student-voices-subtitle">
              Hear from our school community about their experiences at Karmayogi Vidyaniketan.
            </p>
          </div>

          <div
            className="student-voices-grid"
            ref={voicesRef}
            onScroll={handleVoicesScroll}
          >
            {testimonialsList.map((item, idx) => (
              <div key={item.id || idx} className="student-voice-card">
                <div className="student-voice-quote-icon" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8" />
                  </svg>
                </div>

                <p className="student-voice-quote-text">
                  “{item.quote ? item.quote.replace(/^[“"]+|[”"]+$/g, '') : ''}”
                </p>

                <div className="student-voice-author">
                  <h4 className="student-voice-name">{item.name}</h4>
                  <span className="student-voice-role">{item.role}</span>
                </div>
              </div>
            ))}
          </div>

          {testimonialsList.length > 1 && (
            <div className="student-voices-dots" aria-hidden="true">
              {testimonialsList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`student-voice-dot ${activeVoiceIdx === i ? 'active' : ''}`}
                  onClick={() => scrollToVoice(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
