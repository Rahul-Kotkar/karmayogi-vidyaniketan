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
  setCachedNotices,
  getCachedEvents,
  setCachedEvents,
  getCachedFacilities,
  setCachedFacilities
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



function parseNewsBadgeDate(item) {
  if (item?.displayDate) return item.displayDate
  const raw = String(item?.date || '').trim()
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const mIdx = parseInt(isoMatch[2], 10) - 1
    return {
      day: isoMatch[3],
      month: months[mIdx] || 'SEP',
      year: isoMatch[1]
    }
  }
  const textMatch = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})?/)
  if (textMatch) {
    return {
      day: textMatch[2].padStart(2, '0'),
      month: textMatch[1].toUpperCase().slice(0, 3),
      year: textMatch[3] || '2026'
    }
  }
  return { day: '10', month: 'SEP', year: '2026' }
}

const DEFAULT_PRINCIPAL_MESSAGE = `Dear Students, Parents and Well-wishers,

It gives me immense pleasure to welcome you to Karmayogi College of Physiotherapy, Shelve, Pandharpur. Physiotherapy is a noble profession dedicated to restoring movement, relieving pain, and improving the quality of life of every patient we serve.

Our institution strives to blend strong academic foundations with rigorous clinical training, ethical medical practice, and meaningful rehabilitation research. Our students learn not only the science of rehabilitation but also the art of compassionate patient care. I invite you to join us in this journey of healing and service.

Our distinguished faculty team brings decades of clinical expertise across Orthopaedic Physiotherapy, Neurosciences, Cardiopulmonary Rehabilitation, Sports Medicine, and Community Rehabilitation. With cutting-edge electrotherapy modalities, biomechanics laboratories, and specialized kinesiology gymnasiums, we ensure that every student gains extensive practical acumen right from their foundational years.

Through direct hands-on bedside postings at our multi-specialty teaching hospital, rural healthcare outreach camps, and evidence-based clinical case presentations, our students cultivate decisive clinical reasoning and deep empathy. We take pride in mentoring graduates who excel in hospital networks, private rehabilitation centers, sports organizations, and postgraduate research institutions nationwide.

As we continually advance our academic programs in accordance with MUHS and national healthcare standards, I welcome you to explore our vibrant campus and partner with us in shaping the future of rehabilitative medicine.`

export default function Home() {
  const [homeData, setHomeData] = useState(() => getCachedHomeData())
  const [aboutData, setAboutData] = useState(() => getCachedAboutData())
  const [notices, setNotices] = useState(() => getCachedNotices() || [])
  const [events, setEvents] = useState(() => getCachedEvents() || [])
  const [facilities, setFacilities] = useState(() => getCachedFacilities() || [])
  const [isHomeLoading, setIsHomeLoading] = useState(() => !getCachedHomeData())
  const [isNoticesLoading, setIsNoticesLoading] = useState(() => !getCachedNotices())
  const [isEventsLoading, setIsEventsLoading] = useState(() => !getCachedEvents())
  const [activeNewsIndex, setActiveNewsIndex] = useState(0)
  const [featuredNewsExpanded, setFeaturedNewsExpanded] = useState(false)
  const [principalExpanded, setPrincipalExpanded] = useState(false)
  const [canExpandPrincipal, setCanExpandPrincipal] = useState(true)
  const principalTextRef = useRef(null)

  const cleanedPrincipalMessage = useMemo(() => {
    const raw = (homeData?.principal_message || DEFAULT_PRINCIPAL_MESSAGE).trim()
    const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    // If text already has double newlines separating paragraphs:
    if (/\n\s*\n/.test(text)) {
      return text
        .split(/\n\s*\n/)
        .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
        .filter(Boolean)
        .join('\n\n')
    }

    // If text has hard single linebreaks (e.g. copied from narrow columns/PDF):
    let normalized = text
    normalized = normalized.replace(/^(Dear [^\n]+,|Respected [^\n]+,)\n+/gim, (m, p1) => p1 + '\n\n')
    normalized = normalized.replace(/([.!?])\n+(?=[A-Z])/g, (m, p1) => p1 + '\n\n')
    normalized = normalized.replace(/\n+(?=(?:We are|We feel|Our |In conclusion|Warm regards))/gi, '\n\n')

    return normalized
      .split(/\n\s*\n/)
      .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n')
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

  const handleTogglePrincipal = () => {
    if (principalExpanded) {
      setPrincipalExpanded(false)
      const sec = document.getElementById('principal-desk')
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      setPrincipalExpanded(true)
    }
  }

  useEffect(() => {
    noticesService.getAll().then(data => {
      setNotices(data)
      setIsNoticesLoading(false)
    }).catch(() => {
      setIsNoticesLoading(false)
    })

    eventsService.getAll().then(data => {
      setEvents(data)
      setIsEventsLoading(false)
    }).catch(() => {
      setIsEventsLoading(false)
    })

    facilitiesService.getAll().then(data => {
      setFacilities(data)
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
        } catch {
          // not JSON
        }
      }
      setIsHomeLoading(false)
    }).catch(() => {
      setIsHomeLoading(false)
    })
  }, [])

  // Resolve news and achievements from user homeData, never dummy data
  const newsList = (homeData?.news_list && Array.isArray(homeData.news_list))
    ? homeData.news_list
    : []

  // Resolve Student Voices / Testimonials
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

  // Auto-advance College News slider (pauses on hover or when expanded)
  const [isNewsPaused, setIsNewsPaused] = useState(false)

  useEffect(() => {
    const totalItems = Math.min(newsList.length, 3)
    if (totalItems <= 1 || isNewsPaused || featuredNewsExpanded) return

    const timer = setInterval(() => {
      setActiveNewsIndex(prev => (prev + 1) % totalItems)
    }, 4500)

    return () => clearInterval(timer)
  }, [newsList.length, isNewsPaused, featuredNewsExpanded])

  return (
    <main id="main">
      {/* 1. Hero Section */}
      <Hero data={homeData} />



      {/* 2. Floating Highlights Strip */}
      <div className="home-highlights-wrap">
        <div className="home-highlights-card">
          <div className="home-highlight-item">
            <span className="home-highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <span className="home-highlight-text">{homeData?.highlight_1 || 'Established in 2008'}</span>
          </div>
          <div className="home-highlight-item">
            <span className="home-highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <span className="home-highlight-text">{homeData?.highlight_2 || 'Physiotherapy Education'}</span>
          </div>
          <div className="home-highlight-item">
            <span className="home-highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <span className="home-highlight-text">{homeData?.highlight_3 || 'Industry-Focused Learning'}</span>
          </div>
          <div className="home-highlight-item">
            <span className="home-highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="home-highlight-text">{homeData?.highlight_4 || 'Vibrant Campus Life'}</span>
          </div>
        </div>
      </div>

      {/* 3. About Karmayogi Section */}
      <section className="home-about-section">
        <div className="container">
          <div className="home-about-grid">
            <div className="home-about-photo-col">
              <img
                src={resolveMediaUrl(aboutData?.institute_photo_url || homeData?.about_photo_url, aboutStudentsImg)}
                alt="Students studying at Karmayogi College"
                className="home-about-photo"
              />
            </div>
            <div className="home-about-text-col">
              <span className="home-about-tag">
                {aboutData?.institute_tag || homeData?.about_sub || 'ABOUT KARMAYOGI'}
              </span>
              <h2 className="home-about-heading">
                {aboutData?.institute_title || homeData?.about_title || 'Education with purpose, practice, and perspective'}
              </h2>
              <p className="home-about-desc">
                {aboutData?.institute_p1 || homeData?.about_p1 || 'Karmayogi College of Physiotherapy nurtures clinical capability alongside curiosity, confidence, and professional responsibility in a focused academic environment.'}
              </p>
              <Link
                to={homeData?.about_btn_link || '/about'}
                className="home-about-btn"
              >
                {homeData?.about_btn_text || 'Discover Our Institute →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. Why Karmayogi / Growth Environment Section */}
      <section className="why-karmayogi-section">
        <div className="container">
          <div className="why-karmayogi-header">
            <span className="why-karmayogi-tag">
              {homeData?.why_tag || 'WHY KARMAYOGI'}
            </span>
            <h2 className="why-karmayogi-heading">
              {homeData?.why_title || 'An environment designed for growth'}
            </h2>
          </div>
          <div className="why-karmayogi-grid">
            {(homeData?.why_items && Array.isArray(homeData.why_items) && homeData.why_items.length > 0
              ? homeData.why_items
              : DEFAULT_WHY_ITEMS
            ).map((item, idx) => (
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

      {/* 4. Principal's Message Section */}
      <section id="principal-desk" className="section alt">
        <div className="container">
          <SectionHeader
            sub={homeData?.principal_sub || "From the Desk of"}
            title={homeData?.principal_title || "Principal's Message"}
          />
          <div className="principal-wrap">
            <figure className="principal-photo">
              <img
                src={resolveMediaUrl(homeData?.principal_photo_url, PRINCIPAL_PHOTO)}
                alt={homeData?.principal_name || "Principal, Karmayogi College of Physiotherapy"}
              />
              <figcaption>
                {homeData?.principal_name || 'Dr. S. P. Deshmukh'}<br />
                <small style={{ whiteSpace: 'pre-line' }}>
                  {homeData?.principal_designation || 'Principal, MPT (Ortho), Ph.D.\nKarmayogi College of Physiotherapy'}
                </small>
              </figcaption>
            </figure>
            <div className="prose">
              <div
                ref={principalTextRef}
                className={`principal-message-text ${principalExpanded ? 'is-expanded' : 'is-clamped'}`}
              >
                {cleanedPrincipalMessage}
              </div>
              {canExpandPrincipal && (
                <button
                  type="button"
                  className="principal-read-more-btn"
                  onClick={handleTogglePrincipal}
                  aria-expanded={principalExpanded}
                >
                  {principalExpanded ? 'Read Less ↑' : (homeData?.principal_btn_text || 'Read More →')}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4B. Campus Life Feature Section (After Principal's Desk) */}
      <section className="home-campus-life-section" id="campus-life">
        <div className="container">
          <div className="home-campus-life-grid">
            {/* Left Column: Eyebrow, Heading, Description & Redirect Button */}
            <div className="home-campus-life-text-col">
              <span className="home-campus-life-eyebrow">
                {homeData?.campus_life_eyebrow || 'CAMPUS LIFE'}
              </span>
              <h2 className="home-campus-life-heading">
                {homeData?.campus_life_title || 'A campus made for learning and belonging'}
              </h2>
              <p className="home-campus-life-desc">
                {homeData?.campus_life_desc || 'From laboratories and library resources to sports, cultural activities, and student clubs, campus life creates space to learn, contribute, and connect.'}
              </p>
              <Link
                to={homeData?.campus_life_btn_link || '/student-corner/activities'}
                className="home-campus-life-btn"
                title="Explore Campus Activities & Student Life"
              >
                <span>{homeData?.campus_life_btn_text || 'Explore Campus Life'}</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>

            {/* Right Column: Visual Composite with Photo + Two Colored Highlight Tiles */}
            <div className="home-campus-life-visual-col">
              <div className="home-campus-life-card">
                <div className="home-campus-life-photo-box">
                  <img
                    src={resolveMediaUrl(
                      homeData?.campus_life_image,
                      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80'
                    )}
                    alt="Students engaged in collaborative laboratory learning"
                    className="home-campus-life-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'
                    }}
                  />
                </div>

                <div className="home-campus-life-tiles-grid">
                  {/* Left Tile: Deep Blue - Modern Laboratories */}
                  <Link
                    to={homeData?.campus_life_tile1_link || '/facilities'}
                    className="home-campus-life-tile tile-blue"
                    title="View Laboratories and Facilities"
                  >
                    <div className="home-campus-life-tile-icon">
                      {/* Microscope Icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 18h8" />
                        <path d="M3 22h18" />
                        <path d="M14 22a7 7 0 1 0 0-14h-1" />
                        <path d="M9 14h2" />
                        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                        <path d="M12 6V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
                      </svg>
                    </div>
                    <span className="home-campus-life-tile-title">
                      {homeData?.campus_life_tile1_title || 'Modern Laboratories'}
                    </span>
                  </Link>

                  {/* Right Tile: Golden Amber - Sports & Culture */}
                  <Link
                    to={homeData?.campus_life_tile2_link || '/student-corner/activities'}
                    className="home-campus-life-tile tile-gold"
                    title="View Sports & Cultural Activities"
                  >
                    <div className="home-campus-life-tile-icon">
                      {/* Trophy / Award Cup Icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
                      </svg>
                    </div>
                    <span className="home-campus-life-tile-title">
                      {homeData?.campus_life_tile2_title || 'Sports & Culture'}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Facilities Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            sub={homeData?.facilities_sub || "Campus"}
            title={homeData?.facilities_title || "Facilities"}
          />
          <div className="grid grid-4 facilities-grid">
            {facilities.slice(0, 4).map((f, i) => (
              <FacilityCard key={f.id || f.slug || i} facility={f} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <Link className="btn btn-primary" to="/facilities">View All Facilities</Link>
          </div>
        </div>
      </section>

      {/* 6. Notices & Events Combined Side-by-Side Section */}
      <section className="section alt home-notices-events-section" id="notices-events">
        <div className="container">
          <div className="home-notices-events-grid">
            {/* Column 1: Latest Notices */}
            <div className="home-dual-col notices-col">
              <div className="home-dual-col-header">
                <div className="home-dual-col-title-group">
                  <span className="home-dual-eyebrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {homeData?.notices_sub || "Notice Board"}
                  </span>
                  <h2 className="home-dual-title">{homeData?.notices_title || "Latest Notices"}</h2>
                </div>
                <Link className="home-dual-header-link" to="/notices">
                  View All <span className="arrow-icon">→</span>
                </Link>
              </div>

              <div className="home-dual-col-content">
                {isNoticesLoading && notices.length === 0 ? (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  </div>
                ) : notices.length === 0 ? (
                  <div className="home-dual-empty">
                    <p>No active notices at this time.</p>
                  </div>
                ) : (
                  <div className="home-dual-items-list">
                    {notices.slice(0, 3).map((n, i) => (
                      <NoticeCard key={n.id || i} notice={n} />
                    ))}
                  </div>
                )}
              </div>

              <div className="home-dual-col-footer">
                <Link className="home-dual-footer-btn" to="/notices">
                  View All Notices ({notices.length}) →
                </Link>
              </div>
            </div>

            {/* Column 2: Upcoming Events */}
            <div className="home-dual-col events-col">
              <div className="home-dual-col-header">
                <div className="home-dual-col-title-group">
                  <span className="home-dual-eyebrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {homeData?.events_sub || "Calendar"}
                  </span>
                  <h2 className="home-dual-title">{homeData?.events_title || "Upcoming Events"}</h2>
                </div>
                <Link className="home-dual-header-link" to="/events">
                  View All <span className="arrow-icon">→</span>
                </Link>
              </div>

              <div className="home-dual-col-content">
                {isEventsLoading && events.length === 0 ? (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div style={{ background: '#f8fafc', height: 80, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <div style={{ background: '#f8fafc', height: 80, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <div style={{ background: '#f8fafc', height: 80, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  </div>
                ) : events.length === 0 ? (
                  <div className="home-dual-empty">
                    <p>No upcoming events scheduled at this time.</p>
                  </div>
                ) : (
                  <div className="home-dual-items-list home-events-grid">
                    {events.slice(0, 5).map((e, i) => (
                      <EventCard key={e.id || i} event={e} />
                    ))}
                  </div>
                )}
              </div>

              <div className="home-dual-col-footer">
                <Link className="home-dual-footer-btn" to="/events">
                  View All Events ({events.length}) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. College News Section */}
      <section className="modern-news-section" id="news">
        <div className="container">
          <div className="modern-section-head">
            <div className="modern-head-left">
              <span className="modern-head-eyebrow">{homeData?.news_eyebrow || "— NEWS & EVENTS"}</span>
              <h2 className="modern-head-title">{homeData?.news_title || "College News"}</h2>
              <p className="modern-head-subtitle">
                {homeData?.news_subtitle || "Stay informed about the latest happenings, initiatives and milestones at our college."}
              </p>
            </div>
            <div className="modern-head-right">
              <Link to={homeData?.news_view_all_link || "/news"} className="modern-head-link">
                VIEW ALL NEWS <span className="arrow-icon">→</span>
              </Link>
            </div>
          </div>

          {isHomeLoading && newsList.length === 0 ? (
            <div style={{ background: '#f8fafc', height: 260, borderRadius: 12, border: '1px solid #e2e8f0' }} />
          ) : newsList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '36px 0' }}>No college news updates published yet.</p>
          ) : (
            <div className="news-showcase-grid">
              {/* Featured Left Card */}
              {(() => {
                const feat = newsList[activeNewsIndex % newsList.length] || newsList[0]
                const badge = parseNewsBadgeDate(feat)
                const totalDots = Math.min(newsList.length, 3)
                return (
                  <article
                    className="news-featured-card"
                    onMouseEnter={() => setIsNewsPaused(true)}
                    onMouseLeave={() => setIsNewsPaused(false)}
                    onTouchStart={() => setIsNewsPaused(true)}
                    onTouchEnd={() => setIsNewsPaused(false)}
                  >
                    <div className="news-featured-img-wrap" key={`img-${activeNewsIndex}`}>
                      <img
                        src={resolveMediaUrl(feat?.image, heroBuildingImg)}
                        alt={feat?.title || "College News"}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = heroBuildingImg
                        }}
                        className="news-featured-img news-slide-animated"
                      />
                      <div className="news-date-badge">
                        <span className="badge-day">{badge.day}</span>
                        <span className="badge-month">{badge.month}</span>
                        <span className="badge-year">{badge.year}</span>
                      </div>
                    </div>

                    <div className="news-featured-content" key={`content-${activeNewsIndex}`}>
                      <div className="news-slide-animated">
                        <span className="news-tag">— {feat?.tag || "ACCREDITATION"}</span>
                        <h3 className="news-featured-title">{feat?.title}</h3>
                        <p className={`news-featured-desc card-desc-clamp ${featuredNewsExpanded ? 'is-expanded' : ''}`}>{feat?.desc}</p>
                      </div>

                      <div className="news-featured-footer">
                        <button
                          type="button"
                          onClick={() => setFeaturedNewsExpanded(!featuredNewsExpanded)}
                          className="news-read-more-btn"
                          style={{ cursor: 'pointer', background: 'transparent' }}
                        >
                          {featuredNewsExpanded ? 'Read Less ↑' : 'Read More →'}
                        </button>

                        <div className="news-slide-indicators">
                          {Array.from({ length: totalDots }).map((_, i) => (
                            <button
                              key={i}
                              className={`news-dot-btn ${activeNewsIndex === i ? 'active' : ''}`}
                              onClick={() => {
                                setActiveNewsIndex(i)
                              }}
                              aria-label={`Slide ${i + 1}`}
                            >
                              0{i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })()}
            </div>
          )}
        </div>
      </section>



      {/* 11. Photo Gallery Section */}
      <section className="section alt">
        <div className="container">
          <SectionHeader
            sub={homeData?.gallery_sub || "Campus Life"}
            title={homeData?.gallery_title || "Photo Gallery"}
          />
          <Gallery limit={6} />
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <Link className="btn btn-primary" to="/gallery">View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* 12. Student Voices / Learning Experiences Section */}
      <section className="home-student-voices-section" id="student-voices">
        <div className="container">
          <div className="student-voices-header">
            <span className="student-voices-eyebrow">
              {homeData?.testimonials_eyebrow || 'STUDENT VOICES'}
            </span>
            <h2 className="student-voices-title">
              {homeData?.testimonials_title || 'Learning experiences'}
            </h2>
            <p className="student-voices-subtitle">
              {homeData?.testimonials_subtitle || 'The comments below are sample placeholders and are not presented as verified testimonials.'}
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
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
