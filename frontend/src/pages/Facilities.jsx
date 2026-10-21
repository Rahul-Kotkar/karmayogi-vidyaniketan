import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { FACILITIES as FALLBACK_FACILITIES, COLLEGE } from '../data/collegeData.js'
import { facilitiesService, getCachedFacilities, setCachedFacilities } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

const SCHOOL_FACILITY_METADATA = {
  'infrastructure': {
    aliases: ['infrastructure', 'campus-infrastructure', 'school-infrastructure'],
    title: 'Infrastructure Overview',
    badge: 'Modern Two-Campus Setup',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    lead: 'Spacious, purpose-built multi-acre campuses at Isbavi (Foundation Campus) and Shelve (Main High School Campus) featuring child-safe infrastructure, ventilated classrooms, and expansive playgrounds.',
    features: [
      'Two dedicated campuses: Primary / Foundation at Isbavi and High School at Shelve.',
      'Naturally ventilated, sunlit classrooms and child-safe ergonomic furniture.',
      'Comprehensive campus safety: 24x7 CCTV surveillance, boundary walls, and security guards.',
      'Generator power backup and purified UV/RO drinking water stations across campuses.'
    ],
    incharge: 'Campus Estate & Infrastructure Officer',
    hours: '7:30 AM to 6:00 PM'
  },
  'smart-classrooms': {
    aliases: ['classrooms', 'smart-classrooms'],
    title: 'Smart Classrooms',
    badge: 'Technology-Enabled Classrooms',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    lead: 'Technology-enabled classrooms supporting interactive learning with smart touchscreen displays, multimedia projectors, and audio-visual modules.',
    features: [
      'Interactive digital smart boards and high-resolution multimedia projectors.',
      'Curriculum-aligned 3D animated visual content for science, mathematics, and geography.',
      'Ergonomic child-safe student desks supporting healthy posture and comfort.',
      'Well-ventilated, naturally illuminated rooms creating an energetic learning ambiance.'
    ],
    incharge: 'Academic Technology Coordinator',
    hours: '8:00 AM to 2:00 PM (Monday to Saturday)'
  },
  'science-labs': {
    aliases: ['labs', 'science-laboratories', 'science-labs', 'science'],
    title: 'Science Laboratories',
    badge: 'Hands-on Scientific Learning',
    img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    lead: 'Well-equipped laboratories for practical learning across Physics, Chemistry, and Biology, allowing students to conduct experiments safely.',
    features: [
      'Dedicated individual workstations for Physics, Chemistry, and Biology practicals.',
      'High-precision optical microscopes, specimen slides, and analytical balances.',
      'Comprehensive safety gear including eye-wash stations, fire extinguishers, and first-aid kits.',
      'Weekly scheduled double-period practical sessions for middle and secondary students.'
    ],
    incharge: 'Mr. Prakash T. Kulkarni (HOD Science)',
    hours: '8:00 AM to 2:00 PM'
  },
  'computer-lab': {
    aliases: ['computer-laboratory', 'computer-lab', 'computer', 'it-lab'],
    title: 'Computer Laboratory',
    badge: 'Digital Education & Coding Hub',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    lead: 'Modern computer facilities for digital education, providing 1:1 computer access, high-speed broadband, and programming platforms.',
    features: [
      'High-performance networked desktop computers with dedicated student headsets.',
      'Broadband internet connectivity with strict educational firewall and cyber safety.',
      'Interactive coding tools: Scratch for primary grades, Python & HTML/CSS for secondary.',
      'Air-conditioned laboratory with backup power generators ensuring uninterrupted sessions.'
    ],
    incharge: 'Mr. Amit S. Bhosale (HOD Computer Science)',
    hours: '8:00 AM to 2:00 PM'
  },
  'stem-lab': {
    aliases: ['stem-laboratory', 'stem-lab', 'stem'],
    title: 'STEM Laboratory',
    badge: 'Hands-on Innovation Lab',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    lead: 'Hands-on science, technology, engineering and mathematics learning where students build mechanical models and test creative ideas.',
    features: [
      'Hands-on engineering prototype kits, gear trains, pulley mechanisms, and lever assemblies.',
      'Renewable energy experiment stations including solar panel circuits and miniature wind turbines.',
      'Design thinking workstations encouraging creative problem-solving in teams.',
      'Annual science expo preparation hub where students construct working models.'
    ],
    incharge: 'STEM Innovation Coordinator',
    hours: '8:00 AM to 2:00 PM'
  },
  'ai-robotics': {
    aliases: ['ai-robotics-lab', 'ai-robotics', 'robotics', 'stem-robotics'],
    title: 'AI & Robotics Lab',
    badge: 'Next-Gen Emerging Tech',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    lead: 'Introduce students to emerging technologies, robotics and artificial intelligence through hands-on microcontroller kits and sensors.',
    features: [
      'Arduino and Raspberry Pi microcontrollers with sensory components (ultrasonic, IR, light, temperature).',
      'Programmable robotic buggies, obstacle-avoiding cars, and robotic arms.',
      'Introduction to Python algorithmic logic and AI computer vision concepts.',
      'Guidance for inter-school robotics competitions, hackathons, and science fairs.'
    ],
    incharge: 'AI & Robotics Mentor',
    hours: '8:00 AM to 2:00 PM'
  },
  'library': {
    aliases: ['digital-library', 'central-library', 'library'],
    title: 'Digital Library',
    badge: 'Knowledge Resource Center',
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    lead: 'Modern digital and language learning resources with thousands of fiction, non-fiction, encyclopedias, reference texts, and e-learning terminals.',
    features: [
      'Over 5,000 age-appropriate books spanning classical world literature, Indian history, and science.',
      'Subscription to educational magazines, national newspapers, and academic periodicals.',
      'Computerized e-learning terminals with access to digital encyclopedias and audiobooks.',
      'Quiet, sunlit reading hall with seating for over 100 students fostering a love for reading.'
    ],
    incharge: 'Senior Librarian',
    hours: '8:00 AM to 2:30 PM'
  },
  'sports': {
    aliases: ['sports-facilities', 'playground', 'sports'],
    title: 'Sports Facilities',
    badge: 'Expansive Athletic Fields',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    lead: 'Expansive playgrounds and courts supporting cricket, football, athletics track, badminton, volleyball, and traditional Indian sports.',
    features: [
      'Standard 400-meter clay athletic track and cricket practice nets.',
      'Full-size football ground and outdoor volleyball courts.',
      'Dedicated courts for traditional Indian games: Kho-Kho and Kabaddi.',
      'Indoor sports arena for chess, carrom, table tennis, and yoga routines.'
    ],
    incharge: 'Mr. Pravin K. Jadhav (Sports Director)',
    hours: '7:00 AM to 5:00 PM'
  },
  'transport': {
    aliases: ['school-bus', 'bus-transportation', 'transportation', 'transport'],
    title: 'Transportation Fleet',
    badge: 'Safe & GPS-Monitored Fleet',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    lead: 'Dedicated school bus service with GPS tracking, CCTV cameras, speed governors, and trained female attendants covering Pandharpur and rural routes.',
    features: [
      'Fleet of modern yellow school buses complying with all RTO school transport safety standards.',
      'Real-time GPS vehicle tracking enabling punctual pickup and drop schedules.',
      'On-board female attendants and first-aid kits on every individual bus route.',
      'Extensive route network covering Pandharpur city, Isbavi, Shelve, and neighboring taluka villages.'
    ],
    incharge: 'Transport Safety Officer',
    hours: '6:30 AM to 6:00 PM'
  }
}

export default function Facilities() {
  const { subpage } = useParams()
  const location = useLocation()
  const [facilities, setFacilities] = useState(() => getCachedFacilities() || FALLBACK_FACILITIES)

  const loadFacilities = () => {
    facilitiesService.getAll().then(list => {
      if (Array.isArray(list) && list.length > 0) {
        setFacilities(list)
        setCachedFacilities(list)
      }
    }).catch(() => {})
  }

  useEffect(() => {
    loadFacilities()
    window.addEventListener('facilities_updated', loadFacilities)
    return () => window.removeEventListener('facilities_updated', loadFacilities)
  }, [])

  // If viewing a specific facility subpage
  let activeDetail = null
  if (subpage) {
    const rawKey = decodeURIComponent(subpage).toLowerCase().trim()
    // First check database facilities
    const dbMatch = (facilities || []).find(f => {
      const slug = (f.slug || '').toLowerCase().trim()
      const title = (f.title || '').toLowerCase().trim()
      const id = String(f.id || '').toLowerCase().trim()
      return slug === rawKey || id === rawKey || title === rawKey
    })

    if (dbMatch) {
      let rawFeatures = dbMatch.features
      let parsedFeatures = []
      if (Array.isArray(rawFeatures) && rawFeatures.length > 0) {
        parsedFeatures = rawFeatures
      } else if (typeof rawFeatures === 'string' && rawFeatures.trim()) {
        try {
          const json = JSON.parse(rawFeatures)
          if (Array.isArray(json)) parsedFeatures = json
          else parsedFeatures = rawFeatures.split('\n').filter(Boolean)
        } catch {
          parsedFeatures = rawFeatures.split('\n').filter(Boolean)
        }
      }
      if (parsedFeatures.length === 0) {
        parsedFeatures = [
          'High-standard facility built to modern educational specifications.',
          'Safe and supportive environment supervised by qualified staff.',
          'Regular maintenance and hygienic standards.'
        ]
      }

      activeDetail = {
        title: dbMatch.title || 'Campus Facility',
        badge: dbMatch.category || 'Campus Facility',
        img: resolveMediaUrl(dbMatch.image_url || dbMatch.image || dbMatch.img, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'),
        lead: dbMatch.description || dbMatch.desc || 'Modern institutional learning and recreational infrastructure for students.',
        features: parsedFeatures,
        incharge: dbMatch.incharge || 'Campus Administration',
        hours: dbMatch.hours || '8:00 AM to 2:00 PM (Monday to Saturday)'
      }
    } else if (!facilities || facilities.length === 0) {
      // Fallback to metadata only if DB facilities have not loaded
      for (const [key, meta] of Object.entries(SCHOOL_FACILITY_METADATA)) {
        if (key === rawKey || (Array.isArray(meta.aliases) && meta.aliases.includes(rawKey))) {
          activeDetail = {
            ...meta,
            features: Array.isArray(meta.features) ? meta.features : [
              'High-standard facility built to modern educational specifications.',
              'Safe and supportive environment supervised by qualified staff.',
              'Regular maintenance and hygienic standards.'
            ]
          }
          break
        }
      }
    }
  }

  if (activeDetail) {
    const safeFeatures = Array.isArray(activeDetail.features) ? activeDetail.features : []

    return (
      <PageShell title={activeDetail.title} subtitle={activeDetail.badge}>
        <div style={{ display: 'grid', gap: 32 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
            <img
              src={resolveMediaUrl(activeDetail.img)}
              alt={activeDetail.title}
              style={{ width: '100%', height: 360, objectFit: 'cover' }}
            />
            <div style={{ padding: '32px 28px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                {activeDetail.badge}
              </span>
              <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 14px' }}>
                {activeDetail.title}
              </h1>
              <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.75, marginBottom: 24, whiteSpace: 'pre-line' }}>
                {activeDetail.lead}
              </p>

              <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', marginBottom: 12 }}>
                Key Infrastructure &amp; Features:
              </h3>
              <ul style={{ margin: '0 0 24px', paddingLeft: 20, fontSize: '14.5px', color: '#475569', lineHeight: 1.8 }}>
                {safeFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, fontSize: '13.5px', color: 'var(--text-muted)' }}>
                <div><strong>In-Charge:</strong> {activeDetail.incharge || 'Campus Administration'}</div>
                <div><strong>Operational Hours:</strong> {activeDetail.hours || '8:00 AM to 2:00 PM'}</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/facilities" className="btn btn-secondary">&larr; Back to All School Facilities</Link>
          </div>
        </div>
      </PageShell>
    )
  }

  if (subpage && !activeDetail) {
    return (
      <PageShell title="Facility Not Found" subtitle="Campus Facilities | Karmayogi Vidyaniketan">
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: 'var(--navy-header)', marginBottom: 12 }}>Facility Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>The facility you are looking for does not exist or may have been updated.</p>
          <Link to="/facilities" className="btn btn-primary">&larr; Return to All School Facilities</Link>
        </div>
      </PageShell>
    )
  }

  // Display items directly synced with database facilities
  const displayItems = useMemo(() => {
    if (Array.isArray(facilities) && facilities.length > 0) {
      return facilities.map(f => {
        const slug = (f.slug || f.id || '').toLowerCase()
        const meta = SCHOOL_FACILITY_METADATA[slug] || {}
        return {
          key: slug || String(f.id),
          aliases: [slug, String(f.id), ...(meta.aliases || [])].filter(Boolean),
          title: f.title || meta.title || 'School Facility',
          badge: f.category || meta.badge || 'Campus Facility',
          img: resolveMediaUrl(f.image_url || f.image || f.img || meta.img, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'),
          lead: f.description || f.desc || meta.lead || ''
        }
      })
    }

    return Object.entries(SCHOOL_FACILITY_METADATA).map(([metaKey, meta]) => ({
      key: metaKey,
      aliases: meta.aliases,
      title: meta.title,
      badge: meta.badge,
      img: resolveMediaUrl(meta.img),
      lead: meta.lead
    }))
  }, [facilities])

  // Handle smooth scroll to respective section on mount or hash change
  useEffect(() => {
    const rawHash = (location.hash || '').replace('#', '').toLowerCase().trim()
    if (!rawHash) return

    const scrollToHash = () => {
      let el = document.getElementById(rawHash)
      if (!el) {
        for (const [key, meta] of Object.entries(SCHOOL_FACILITY_METADATA)) {
          if (key === rawHash || meta.aliases.includes(rawHash)) {
            el = document.getElementById(key)
            if (!el) {
              for (const a of meta.aliases) {
                el = document.getElementById(a)
                if (el) break
              }
            }
            break
          }
        }
      }

      if (el) {
        const headerOffset = 135
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        })

        // Subtle highlight animation cue
        el.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease'
        el.style.borderColor = '#0284c7'
        el.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.25), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        el.style.transform = 'translateY(-2px)'
        setTimeout(() => {
          if (el) {
            el.style.borderColor = '#e2e8f0'
            el.style.boxShadow = 'var(--shadow-sm)'
            el.style.transform = 'none'
          }
        }, 2200)
      }
    }

    const t1 = setTimeout(scrollToHash, 90)
    const t2 = setTimeout(scrollToHash, 350)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location.hash, location.pathname, displayItems])

  return (
    <PageShell title="School Facilities &amp; Infrastructure" subtitle="State-of-the-Art Learning Spaces, Labs, Sports &amp; Student Transport | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div id="overview" style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', scrollMarginTop: '150px' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
            Built for Curiosity, Safety &amp; All-Round Growth
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            Karmayogi Vidyaniketan / Karmayogi Public School provides an inspiring institutional environment spanning our Primary campus at Isbavi and High School campus at Shelve. Our campuses boast modern technology-enabled smart classrooms, dedicated science and STEM robotics laboratories, digital library, vast outdoor sporting fields, and dedicated bus transportation.
          </p>
        </div>

        {/* Facilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {displayItems.map((item) => (
            <div
              key={item.key}
              id={String(item.key)}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                scrollMarginTop: '150px'
              }}
            >
              {/* Invisible anchor spans for all possible alias IDs */}
              {item.aliases?.map(alias => (
                <span key={alias} id={alias} style={{ scrollMarginTop: '150px' }} />
              ))}
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                  {item.badge}
                </span>
                <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '4px 0 10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
                  {item.lead}
                </p>
                <Link to={`/facilities/${item.key}`} className="btn btn-secondary" style={{ textAlign: 'center', fontSize: '13.5px', padding: '10px 16px' }}>
                  View Facility Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--navy-header)', color: '#ffffff', padding: 32, borderRadius: 12, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: '#ffffff', margin: '0 0 10px' }}>
            Experience Our Campus in Person
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: 600, margin: '0 auto 20px' }}>
            We warmly welcome parents and students for a guided tour of our classrooms, laboratories, library, and sports grounds.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ background: '#002855', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
            Schedule a School Visit &rarr;
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
