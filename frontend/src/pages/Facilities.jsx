import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { FACILITIES as FALLBACK_FACILITIES, COLLEGE } from '../data/collegeData.js'
import { facilitiesService } from '../services/endpoints.js'

const SCHOOL_FACILITY_METADATA = {
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
    aliases: ['labs', 'science-laboratories', 'science-labs'],
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
    aliases: ['computer-laboratory', 'it-lab'],
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
    aliases: ['stem-laboratory', 'stem'],
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
    aliases: ['ai-robotics-lab', 'robotics'],
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
    aliases: ['digital-library', 'central-library'],
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
    aliases: ['sports-facilities', 'playground'],
    title: 'Sports Facilities',
    badge: 'Athletics, Fitness & Games',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    lead: 'Facilities supporting physical fitness, teamwork and competitive sports with expansive outdoor grounds and dedicated training courts.',
    features: [
      'Multi-sport outdoor grounds with cricket pitch, practice nets, and full-size football field.',
      'Dedicated training courts for traditional Indian sports: Kabaddi and Kho-Kho with floodlights.',
      'Volleyball, badminton, and table tennis facilities with specialized equipment.',
      'Daily morning yoga, Surya Namaskar, and NIS-certified athletic coaching.'
    ],
    incharge: 'Mr. Sunil B. Shinde (Director of Physical Education)',
    hours: '6:30 AM to 6:00 PM'
  },

  'transportation': {
    aliases: ['school-bus', 'transport'],
    title: 'Transportation Fleet',
    badge: 'Safe & Punctual School Commute',
    img: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
    lead: 'School bus transportation for students across Pandharpur town and surrounding rural areas with experienced drivers and attendants.',
    features: [
      'Dedicated fleet of well-maintained school buses covering major routes in Pandharpur taluka.',
      'Trained drivers, bus conductors, and female attendants ensuring student safety onboard.',
      'Equipped with first-aid kits, fire extinguishers, and speed governors adhering to RTO norms.',
      'Punctual pickup and drop schedules aligned with school bell timings.'
    ],
    incharge: 'Transport Supervisor',
    hours: '6:30 AM to 4:00 PM'
  }
}

export default function Facilities() {
  const { subpage } = useParams()
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES)

  useEffect(() => {
    facilitiesService.getAll().then(list => {
      if (Array.isArray(list) && list.length > 0) setFacilities(list)
    }).catch(() => {})
  }, [])

  // If viewing a specific facility subpage
  let activeDetail = null
  if (subpage) {
    const rawKey = subpage.toLowerCase().trim()
    for (const [key, meta] of Object.entries(SCHOOL_FACILITY_METADATA)) {
      if (key === rawKey || meta.aliases.includes(rawKey)) {
        activeDetail = meta
        break
      }
    }
  }

  if (activeDetail) {
    return (
      <PageShell title={activeDetail.title} subtitle={activeDetail.badge}>
        <div style={{ display: 'grid', gap: 32 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
            <img
              src={activeDetail.img}
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
              <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.75, marginBottom: 24 }}>
                {activeDetail.lead}
              </p>

              <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', marginBottom: 12 }}>
                Key Infrastructure &amp; Features:
              </h3>
              <ul style={{ margin: '0 0 24px', paddingLeft: 20, fontSize: '14.5px', color: '#475569', lineHeight: 1.8 }}>
                {activeDetail.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, fontSize: '13.5px', color: 'var(--text-muted)' }}>
                <div><strong>In-Charge:</strong> {activeDetail.incharge}</div>
                <div><strong>Operational Hours:</strong> {activeDetail.hours}</div>
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

  return (
    <PageShell title="School Facilities &amp; Infrastructure" subtitle="State-of-the-Art Learning Spaces, Labs, Sports &amp; Student Transport | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
            Built for Curiosity, Safety &amp; All-Round Growth
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            Karmayogi Vidyaniketan / Karmayogi Public School provides an inspiring institutional environment spanning our Primary campus at Isbavi and High School campus at Shelve. Our campuses boast modern technology-enabled smart classrooms, dedicated science and STEM robotics laboratories, digital library, vast outdoor sporting fields, and dedicated bus transportation.
          </p>
        </div>

        {/* Facilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {Object.entries(SCHOOL_FACILITY_METADATA).map(([key, item]) => (
            <div key={key} id={key} style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                <Link to={`/facilities/${key}`} className="btn btn-secondary" style={{ textAlign: 'center', fontSize: '13.5px', padding: '10px 16px' }}>
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
          <Link to="/contact" className="btn btn-primary" style={{ background: 'var(--blue-royal)', borderColor: 'var(--blue-royal)' }}>
            Schedule a School Visit &rarr;
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
