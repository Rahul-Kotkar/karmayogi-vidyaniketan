import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { FACILITIES as FALLBACK_FACILITIES } from '../data/collegeData.js'
import { facilitiesService } from '../services/endpoints.js'

const FACILITY_METADATA = {
  'labs': {
    aliases: ['physiotherapy-labs', 'laboratories'],
    title: 'Physiotherapy Laboratories',
    badge: 'Core Clinical Labs',
    img: 'https://picsum.photos/seed/coplab/800/450',
    lead: 'State-of-the-art specialized laboratories for Electrotherapy, Exercise Therapy, Kinesiotherapy, and Biomechanics, complying fully with MUHS and DMER norms.',
    features: [
      'Electrotherapy Lab: Equipped with therapeutic ultrasound, shortwave diathermy, interferential therapy (IFT), TENS, laser therapy, and muscle stimulators.',
      'Exercise Therapy Lab: Suspension therapy frames, parallel bars, wall bars, posture evaluation grids, multi-gym stations, and Swiss balance balls.',
      'Kinesiology & Biomechanics Lab: Manual muscle testing kits, electronic goniometers, and video movement analysis tools.',
      'Hydrotherapy Setup: Contrast baths, whirlpool immersion units, and hot pack hydrocollator units.'
    ],
    incharge: 'Dr. A. B. Deshmukh (Lab Director)',
    hours: '8:30 AM to 5:00 PM (Monday to Saturday)'
  },
  'library': {
    aliases: ['central-library'],
    title: 'Central Medical & Physiotherapy Library',
    badge: 'Knowledge Resource Center',
    img: 'https://picsum.photos/seed/coplib/800/450',
    lead: 'A rich repository of medical, physiotherapy, and rehabilitation textbooks, national and international journals, and digital e-library databases.',
    features: [
      'Comprehensive collection of 3,500+ text and reference volumes across all physiotherapy disciplines.',
      'Subscriptions to peer-reviewed print journals and e-journal consortiums (Delnet, MUHS Digital Library).',
      'Air-conditioned reading hall with seating capacity for over 120 students and faculty researchers.',
      'Automated library management system with OPAC computerized catalog search and barcode lending.',
      'Dedicated digital library terminal section with high-speed internet for online literature search.'
    ],
    incharge: 'Mr. S. R. Shinde (Chief Librarian)',
    hours: '8:00 AM to 8:00 PM (Reading Room open till 10:00 PM during exam sessions)'
  },
  'classrooms': {
    aliases: ['classrooms-av-halls', 'lecture-halls'],
    title: 'Classrooms & AV Lecture Halls',
    badge: 'Interactive Learning Spaces',
    img: 'https://picsum.photos/seed/copclass/800/450',
    lead: 'Spacious, acoustically engineered, and ventilated tiered lecture halls equipped with modern audio-visual technology for effective didactic pedagogy.',
    features: [
      'Smart classrooms equipped with high-resolution LCD projection and motorized projection screens.',
      'Integrated digital podiums, public address (PA) systems, and cordless microphone sets.',
      'Ergonomic student desk seating designed for sustained comfort during intensive academic lectures.',
      'High-speed campus Wi-Fi connectivity supporting interactive digital presentations and quizzes.'
    ],
    incharge: 'Academic Section In-Charge',
    hours: '8:30 AM to 5:00 PM'
  },
  'computer-lab': {
    aliases: ['computer-lab-it', 'it-center'],
    title: 'Computer Laboratory & IT Center',
    badge: 'Digital Computing Hub',
    img: 'https://picsum.photos/seed/copcomp/800/450',
    lead: 'A dedicated IT center providing high-speed internet connectivity, academic computing resources, and statistical software tools for students and research scholars.',
    features: [
      'Networked workstation terminals running licensed Windows OS and office productivity suites.',
      'Statistical computing packages (SPSS, R) installed for clinical research data analysis and dissertation work.',
      'Dedicated 100 Mbps leased line high-speed fiber internet and campus-wide secure Wi-Fi access.',
      'Printing, scanning, and digital document archiving facilities available for student academic work.'
    ],
    incharge: 'Mr. V. M. Joshi (IT Administrator)',
    hours: '9:00 AM to 6:00 PM'
  },
  'hostel': {
    aliases: ['hostel-mess', 'accommodation'],
    title: 'Hostel Accommodation & Dining Mess',
    badge: 'Residential Campus Life',
    img: 'https://picsum.photos/seed/cophostel/800/450',
    lead: 'Safe, well-appointed, and comfortable residential hostel facilities on campus with separate wings for male and female physiotherapy students.',
    features: [
      'Furnished twin and triple occupancy rooms with study desks, ergonomic chairs, wardrobes, and balconies.',
      'Hygienic dining mess serving nutritious, balanced vegetarian meals prepared under strict sanitary inspection.',
      '24x7 security personnel, biometric attendance monitoring, and round-the-clock CCTV surveillance.',
      'Solar water heating systems, RO drinking water coolers on each floor, and recreational television lounges.'
    ],
    incharge: 'Hostel Rectors & Wardens',
    hours: '24x7 Residence (Mess: 7:30 AM – 9:30 PM)'
  },
  'sports': {
    aliases: ['sports-fitness-center', 'fitness'],
    title: 'Sports & Physical Fitness Center',
    badge: 'Recreation & Athletic Training',
    img: 'https://picsum.photos/seed/copsport/800/450',
    lead: 'Comprehensive indoor and outdoor sports infrastructure supporting physical conditioning, athletic training, and recreational wellness.',
    features: [
      'Indoor sports arena for table tennis, badminton, carrom, and competitive chess.',
      'Outdoor expansive sports grounds for cricket, volleyball, football, and athletic track events.',
      'Gymnasium equipped with cardiovascular treadmills, stationary bicycles, and free-weight resistance stations.',
      'Yoga and meditation center hosting weekly wellness sessions led by certified instructors.'
    ],
    incharge: 'Director of Physical Education',
    hours: '6:00 AM – 8:00 AM & 4:30 PM – 7:30 PM'
  }
}

const FACILITIES_SUBMENUS = [
  { label: "Physiotherapy Labs", slug: "labs", path: "/facilities/labs", desc: "Electrotherapy, Exercise Therapy, Kinesiotherapy, and Biomechanics laboratories." },
  { label: "Central Library", slug: "library", path: "/facilities/library", desc: "3,500+ volumes, international print/digital journals, and reading hall." },
  { label: "Classrooms & AV Halls", slug: "classrooms", path: "/facilities/classrooms", desc: "Smart lecture halls with multimedia projection and audio facilities." },
  { label: "Computer Lab & IT", slug: "computer-lab", path: "/facilities/computer-lab", desc: "Digital workstations, statistical software (SPSS), and 100 Mbps internet." },
  { label: "Hostel & Mess", slug: "hostel", path: "/facilities/hostel", desc: "Secure separate hostels for boys and girls with dining mess and RO water." },
  { label: "Sports & Fitness Center", slug: "sports", path: "/facilities/sports", desc: "Indoor games, outdoor sports ground, gymnasium, and yoga hall." }
]

export default function Facilities() {
  const { subpage } = useParams()
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES)

  useEffect(() => {
    facilitiesService.getAll().then(setFacilities).catch(() => {})
  }, [])

  // Normalize subpage slug
  let normalizedSlug = (subpage || '').toLowerCase().trim()
  if (normalizedSlug === 'physiotherapy-labs' || normalizedSlug === 'laboratories') normalizedSlug = 'labs'
  if (normalizedSlug === 'central-library') normalizedSlug = 'library'
  if (normalizedSlug === 'classrooms-av-halls') normalizedSlug = 'classrooms'
  if (normalizedSlug === 'computer-lab-it') normalizedSlug = 'computer-lab'
  if (normalizedSlug === 'hostel-mess') normalizedSlug = 'hostel'
  if (normalizedSlug === 'sports-fitness-center') normalizedSlug = 'sports'

  const activeMeta = normalizedSlug ? (FACILITY_METADATA[normalizedSlug] || null) : null

  // Instant scroll to top on subpage change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [normalizedSlug])

  const pageTitle = activeMeta ? `${activeMeta.title} — Facilities` : "Campus Facilities"

  return (
    <PageShell title={pageTitle}>
      <div className="facilities-page-wrapper">

        {/* ========================================================
            CASE 1: OVERVIEW PAGE (/facilities)
            ======================================================== */}
        {!activeMeta && (
          <div className="facilities-overview-hub">
            <div className="academics-intro-block">
              <h1 className="academics-page-title">Campus Infrastructure & Facilities</h1>
              <p className="academics-page-lead">
                Karmayogi College of Physiotherapy boasts a green, expansive campus in Shelve, Pandharpur,
                equipped with specialized laboratories, learning spaces, residential hostels, and an attached clinical hospital.
              </p>
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Key Facilities & Infrastructure</h2>
            <div className="submenu-overview-grid">
              {FACILITIES_SUBMENUS.map((item, idx) => {
                const meta = FACILITY_METADATA[item.slug]
                return (
                  <article key={item.slug} className="submenu-overview-card">
                    <div>
                      <div className="submenu-card-header">
                        <span className="submenu-card-badge">{idx + 1}</span>
                        <h3 className="submenu-card-title">{item.label}</h3>
                      </div>
                      <p className="submenu-card-desc">{item.desc}</p>
                    </div>
                    <Link to={item.path} className="submenu-card-btn">
                      Explore {item.label} Details →
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 2: DEDICATED FACILITY SUBPAGE
            ======================================================== */}
        {activeMeta && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">{activeMeta.title}</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              {activeMeta.lead}
            </p>

            {/* Feature Image & Quick Details */}
            <div className="facility-detail-split-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: 300 }}>
                <img
                  src={activeMeta.img}
                  alt={activeMeta.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 12px' }}>
                  Key Features & Capabilities
                </h3>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>
                  {activeMeta.features.map((f, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', background: '#f1f5f9', borderRadius: 6, padding: '14px 18px', marginBottom: 20 }}>
              <div>
                <strong>In-Charge / Coordination: </strong>
                <span style={{ color: '#0066cc' }}>{activeMeta.incharge}</span>
              </div>
              <div>
                <strong>Operating / Access Hours: </strong>
                <span>{activeMeta.hours}</span>
              </div>
            </div>
          </section>
        )}

      </div>
    </PageShell>
  )
}
