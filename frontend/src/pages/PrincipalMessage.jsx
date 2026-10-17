import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { PRINCIPAL_PHOTO } from '../data/collegeData.js'
import { pagesService, getCachedHomeData, getCachedAboutData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

const DEFAULT_MESSAGE = `Dear Parents, Students and Well-Wishers,

It gives me immense pleasure and pride to welcome you to Karmayogi Vidyaniketan (widely known as Karmayogi Public School), Pandharpur, operating under the philanthropic patronage of Shri Pandurang Pratishthan.

School education is not merely the transmission of textbook facts; it is the sacred endeavor of lighting a fire of curiosity within each young mind, strengthening character, and building the moral courage to lead purposeful lives. At Karmayogi Vidyaniketan, we are firmly committed to providing a balanced education that develops academic ability, confidence, discipline, creativity, physical fitness and responsible citizenship.

In our fast-evolving modern world, children require both timeless values and cutting-edge competencies. To achieve this synthesis, our curriculum pairs interactive smart classrooms, well-equipped science laboratories, computer education, and hands-on STEM, AI & Robotics studios with classical Indian values, cultural pride, and respect for tradition.

Our experienced educators nurture each child across three vital developmental milestones: foundational play-based exploration in Pre-Primary (Nursery, Jr. & Sr. KG), strong conceptual mastery in Primary school (Grades 1 to 5), and rigorous analytical inquiry in Secondary school (Grades 6 to 10) leading to distinction in CBSE and State Board examinations.

Furthermore, through expansive sports grounds, athletic training, daily yoga, vibrant cultural festivals, and safe GPS-monitored school bus transportation connecting Pandharpur and surrounding regions, we ensure every child thrives in a holistic, protective, and energetic environment.

I warmly invite parents to visit our campuses at Isbavi and Shelve, meet our faculty, and partner with us in nurturing the leaders, innovators, and noble citizens of tomorrow.`

export default function PrincipalMessage() {
  const [homeData, setHomeData] = useState(() => getCachedHomeData())
  const [aboutData, setAboutData] = useState(() => getCachedAboutData())

  const loadData = () => {
    pagesService.getBySlug('home').then(page => {
      if (page && page.content_html) {
        try {
          setHomeData(JSON.parse(page.content_html))
        } catch {}
      }
    }).catch(() => {})

    pagesService.getBySlug('about').then(page => {
      if (page && page.content_html) {
        try {
          setAboutData(JSON.parse(page.content_html))
        } catch {}
      }
    }).catch(() => {})
  }

  useEffect(() => {
    loadData()
    const handleHomeUpdated = (e) => {
      if (e?.detail?.content_html) {
        try { setHomeData(JSON.parse(e.detail.content_html)) } catch {}
      } else { loadData() }
    }
    const handleAboutUpdated = (e) => {
      if (e?.detail?.content_html) {
        try { setAboutData(JSON.parse(e.detail.content_html)) } catch {}
      } else { loadData() }
    }
    window.addEventListener('page_home_updated', handleHomeUpdated)
    window.addEventListener('page_about_updated', handleAboutUpdated)
    return () => {
      window.removeEventListener('page_home_updated', handleHomeUpdated)
      window.removeEventListener('page_about_updated', handleAboutUpdated)
    }
  }, [])

  const principalPhoto = resolveMediaUrl(
    homeData?.principal_photo_url || aboutData?.principal_photo_url,
    PRINCIPAL_PHOTO
  )
  const principalName = homeData?.principal_name || aboutData?.principal_name || 'Mr. Vijay Madane'
  const principalTitle = homeData?.principal_designation || aboutData?.principal_designation || 'Principal / Academic Director'
  const messageBody = homeData?.principal_message || aboutData?.principal_message || DEFAULT_MESSAGE

  const paragraphs = messageBody
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <PageShell title="Principal's Message" subtitle="From the Desk of the Head of School | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'start' }}>
        {/* Photo Column */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <img
            src={principalPhoto}
            alt={`${principalName} - Principal, Karmayogi Vidyaniketan`}
            style={{ width: '100%', maxWidth: 280, height: 320, objectFit: 'cover', borderRadius: 8, margin: '0 auto 16px' }}
          />
          <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '0 0 4px' }}>
            {principalName}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--blue-vibrant)', fontWeight: 700, margin: '0 0 10px', whiteSpace: 'pre-line' }}>
            {principalTitle}
          </p>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
            Karmayogi Vidyaniketan / Karmayogi Public School<br />
            Pandharpur, Solapur (MS)
          </div>
        </div>

        {/* Message Column */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '36px 32px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 20 }}>
            {homeData?.principal_title || 'Welcome to Karmayogi Vidyaniketan'}
          </h2>

          <div style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.85, display: 'grid', gap: 16 }}>
            {paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {p}
              </p>
            ))}

            <p style={{ marginTop: 12, fontWeight: 600 }}>
              With warm regards and best wishes,<br />
              <strong style={{ color: 'var(--navy-header)' }}>{principalName}</strong><br />
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{principalTitle}</span>
            </p>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-primary">Apply for Admission →</Link>
            <Link to="/about" className="btn btn-secondary">About Our School</Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
