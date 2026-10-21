import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link, useLocation } from 'react-router-dom'
import instituteBuildingImg from '../assets/hero_building.png'
import { pagesService, getCachedAboutData, getCachedHomeData } from '../services/endpoints.js'
import { DEFAULT_ABOUT_DATA, COLLEGE, PRINCIPAL_PHOTO, DEFAULT_PRINCIPAL_MESSAGE } from '../data/collegeData.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

export default function About() {
  const [isPrincipalExpanded, setIsPrincipalExpanded] = useState(false)
  const [homeData, setHomeData] = useState(() => getCachedHomeData())
  const [data, setData] = useState(() => {
    const cached = getCachedAboutData()
    if (cached) {
      return {
        ...DEFAULT_ABOUT_DATA,
        ...cached,
        mission_points: Array.isArray(cached.mission_points) && cached.mission_points.length > 0 ? cached.mission_points : DEFAULT_ABOUT_DATA.mission_points,
        council_members: Array.isArray(cached.council_members) && cached.council_members.length > 0 ? cached.council_members : DEFAULT_ABOUT_DATA.council_members,
        approvals: Array.isArray(cached.approvals) && cached.approvals.length > 0 ? cached.approvals : DEFAULT_ABOUT_DATA.approvals
      }
    }
    return DEFAULT_ABOUT_DATA
  })

  const location = useLocation()

  useEffect(() => {
    async function load() {
      try {
        const page = await pagesService.getBySlug('about')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setData(prev => ({
              ...prev,
              ...parsed,
              mission_points: Array.isArray(parsed.mission_points) && parsed.mission_points.length > 0 ? parsed.mission_points : prev.mission_points,
              leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders : prev.leaders,
              council_members: Array.isArray(parsed.council_members) && parsed.council_members.length > 0 ? parsed.council_members : prev.council_members,
              approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals
            }))
          } catch {}
        }
      } catch {}

      try {
        const homePage = await pagesService.getBySlug('home')
        if (homePage && homePage.content_html) {
          try {
            const parsed = JSON.parse(homePage.content_html)
            setHomeData(parsed)
          } catch {}
        }
      } catch {}
    }
    load()

    const onAboutUpdated = (e) => {
      if (e?.detail?.content_html) {
        try {
          const parsed = JSON.parse(e.detail.content_html)
          setData(prev => ({
            ...prev,
            ...parsed,
            mission_points: Array.isArray(parsed.mission_points) && parsed.mission_points.length > 0 ? parsed.mission_points : prev.mission_points,
            leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders : prev.leaders,
            council_members: Array.isArray(parsed.council_members) && parsed.council_members.length > 0 ? parsed.council_members : prev.council_members,
            approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals
          }))
        } catch {}
      } else {
        load()
      }
    }

    const onHomeUpdated = (e) => {
      if (e?.detail?.content_html) {
        try {
          setHomeData(JSON.parse(e.detail.content_html))
        } catch {}
      } else {
        pagesService.getBySlug('home').then(hp => {
          if (hp?.content_html) {
            try { setHomeData(JSON.parse(hp.content_html)) } catch {}
          }
        }).catch(() => {})
      }
    }

    window.addEventListener('page_about_updated', onAboutUpdated)
    window.addEventListener('page_home_updated', onHomeUpdated)
    return () => {
      window.removeEventListener('page_about_updated', onAboutUpdated)
      window.removeEventListener('page_home_updated', onHomeUpdated)
    }
  }, [])

  // Handle hash scrolling on page load
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    }
  }, [location.hash])

  return (
    <PageShell title="About Karmayogi Vidyaniketan" subtitle="Karmayogi Public School | Shri Pandurang Pratishthan, Pandharpur">
      <div className="about-single-page">

        {/* ========================================================
            1. ABOUT THE SCHOOL (Overview, Campuses & Key Features)
            ======================================================== */}
        <section id="about-school" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.institute_title || "About Karmayogi Vidyaniketan"}</h2>
            {data.institute_subtitle && (
              <p className="about-section-subtitle">{data.institute_subtitle}</p>
            )}
          </div>

          <div className="about-overview-grid">
            {/* Left Photo Card */}
            <div className="about-institute-photo-col">
              <div className="about-institute-photo-card">
                <img
                  src={resolveMediaUrl(data.institute_photo_url, instituteBuildingImg)}
                  alt="Karmayogi Vidyaniketan School Campus Building"
                  className="about-institute-photo"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="about-institute-text-col">
              <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.85, marginBottom: 16 }}>
                {data.institute_p1 || "Karmayogi Vidyaniketan / Karmayogi Public School is a leading co-educational English-medium school in Pandharpur, Solapur district, Maharashtra, operating under the patronage of Shri Pandurang Pratishthan. We provide a complete educational journey from Pre-Primary (Nursery, Jr. KG, Sr. KG) to Grade 10."}
              </p>

              {data.institute_p2 ? (
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.85, margin: 0 }}>
                  {data.institute_p2}
                </p>
              ) : (
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.85, margin: 0 }}>
                  With dual educational tracks combining CBSE national curriculum excellence and Maharashtra State Board standards, the school equips learners with strong academic fundamentals, communicative English fluency, science inquiry, and moral character.
                </p>
              )}
            </div>
          </div>

          {/* 3 Quick Highlight Boxes */}
          <div className="about-features-grid" style={{ marginTop: 24 }}>
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <div className="about-feature-title">Academic Distinction</div>
                <p className="about-feature-desc">Nursery to Grade 10 combining national CBSE standards and State Board benchmarks.</p>
              </div>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <div className="about-feature-title">Smart Classrooms &amp; STEM Labs</div>
                <p className="about-feature-desc">Physics, Chemistry, Biology, Mathematics and AI &amp; Robotics tinkering studios.</p>
              </div>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className="about-feature-title">Values, Sports &amp; Transport</div>
                <p className="about-feature-desc">Daily physical sports, yoga, cultural arts, and safe GPS-tracked school bus fleet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. VISION & MISSION
            ======================================================== */}
        <section id="vision-mission" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.vm_title || 'Vision & Mission'}</h2>
            {data.vm_subtitle && <p className="about-section-subtitle">{data.vm_subtitle}</p>}
          </div>

          <div className="vision-mission-grid">
            {/* Vision Card */}
            <div className="vm-vision-card">
              <div className="vm-card-top">
                <div className="vm-card-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h3>{data.vision_title || 'Our Vision'}</h3>
                </div>
              </div>
              <p className="vm-vision-text">
                "{data.vision_text || "To be an institution of educational distinction in Pandharpur and Maharashtra that nurtures young minds with intellectual vigor, moral strength, creative curiosity, and holistic life skills, empowering them to become responsible, empathetic citizens rooted in Indian values."}"
              </p>
            </div>

            {/* Mission Card with Strategic Pillars */}
            <div className="vm-mission-card">
              <div className="vm-card-top">
                <div className="vm-card-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <div>
                  <h3>{data.mission_title || 'Our Mission'}</h3>
                </div>
              </div>

              <div className="mission-pillars-grid">
                {(data.mission_points || [
                  "Provide accessible, high-standard English-medium education across Pandharpur and rural regions.",
                  "Deliver conceptual pedagogy through smart classrooms, science experimentation, and AI/Robotics exposure.",
                  "Build strong physical stamina, discipline, and teamwork through athletics, daily yoga, and traditional Indian sports.",
                  "Inculcate deep respect for Indian heritage, environmental sensitivity, moral character, and civic duty.",
                  "Foster individualized care and confidence in each learner through compassionate teacher-student mentorship.",
                  "Operate a secure, GPS-monitored school bus transport network ensuring safe commute for every child."
                ]).map((point, idx) => (
                  <div key={idx} className="mission-pillar-card">
                    <div className="mission-pillar-badge">
                      0{idx + 1}
                    </div>
                    <div className="mission-pillar-text">
                      {point}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. PRINCIPAL'S WELCOME MESSAGE (FROM THE DESK OF)
            ======================================================== */}
        {(() => {
          const principalPhoto = resolveMediaUrl(
            homeData?.principal_photo_url || data?.principal_photo_url,
            PRINCIPAL_PHOTO
          )
          const principalName = homeData?.principal_name || data?.principal_name || 'Mr. Vijay Madane'
          const principalDesignation = homeData?.principal_designation || data?.principal_designation || 'Principal / Academic Director'
          const principalMessageRaw = (homeData?.principal_message || data?.principal_message || DEFAULT_PRINCIPAL_MESSAGE).trim()
          const cleanedPrincipalMessage = principalMessageRaw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

          return (
            <section id="principal-message" className="principal-desk-section">
              <div className="principal-desk-header">
                <span className="principal-desk-eyebrow">
                  {homeData?.principal_sub || 'FROM THE DESK OF'}
                </span>
                <h2 className="principal-desk-title">
                  {homeData?.principal_title || "Principal's Message"}
                </h2>
                <div className="principal-desk-bar"></div>
              </div>

              <div className="principal-desk-grid">
                {/* Left Column: Principal Profile Card */}
                <div className="principal-desk-card">
                  <img
                    src={principalPhoto}
                    alt={`${principalName} - Principal, Karmayogi Vidyaniketan`}
                    className="principal-desk-photo"
                  />
                  <div className="principal-desk-meta">
                    <h3 className="principal-desk-name">
                      {principalName}
                    </h3>
                    <p className="principal-desk-qual" style={{ whiteSpace: 'pre-line' }}>
                      {principalDesignation}
                    </p>
                    <p className="principal-desk-inst">
                      {COLLEGE?.name || 'Karmayogi Vidyaniketan'}
                    </p>
                  </div>
                </div>

                {/* Right Column: Message Narrative */}
                <div className="principal-desk-content">
                  <div
                    className={`principal-message-text ${isPrincipalExpanded ? 'is-expanded' : 'is-clamped'}`}
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: '#334155',
                      whiteSpace: 'pre-line',
                      textAlign: 'justify'
                    }}
                  >
                    {cleanedPrincipalMessage}
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="principal-desk-readmore"
                      onClick={() => setIsPrincipalExpanded(!isPrincipalExpanded)}
                      aria-expanded={isPrincipalExpanded}
                    >
                      {isPrincipalExpanded ? 'Read Less ↑' : 'Read Full Message →'}
                    </button>
                    <Link to="/principal-message" className="principal-desk-readmore" style={{ fontSize: '14px', color: '#475569', fontWeight: 600 }}>
                      View Full Letter Page →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )
        })()}

        {/* ========================================================
            4. PARENT TRUST / SHRI PANDURANG PRATISHTHAN
            ======================================================== */}
        <section id="management" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">
              {data.trust_title || 'Shri Pandurang Pratishthan, Pandharpur'}
            </h2>
            <p className="about-section-subtitle">
              {data.trust_subtitle || 'Parent Governance Organization & Legacy of Service'}
            </p>
          </div>
          <div style={{ background: '#f8fafc', padding: '28px 26px', borderRadius: 12, border: '1px solid #e2e8f0', lineHeight: 1.85, fontSize: '15.5px', color: '#334155', whiteSpace: 'pre-line' }}>
            <p style={{ marginBottom: 14 }}>
              {data.trust_p1 ? (
                data.trust_p1
              ) : (
                <>
                  <strong>Shri Pandurang Pratishthan</strong> is a renowned public charitable trust registered in the holy pilgrimage city of Pandharpur, Solapur district, Maharashtra. Established with the noble philosophy of rural upliftment, cooperative growth, and accessible learning, the trust stewards top-tier educational campuses catering to thousands of young learners.
                </>
              )}
            </p>
            <p style={{ margin: 0 }}>
              {data.trust_p2 ? (
                data.trust_p2
              ) : (
                <>
                  Under the enduring inspiration of late founder <strong>स्व. सुधाकरपंत परिचारक</strong> and the forward-looking management council, <strong>Karmayogi Vidyaniketan / Karmayogi Public School</strong> serves as the flagship school campus, providing equal educational opportunity, advanced pedagogy, and holistic student support to boys and girls across the Solapur region.
                </>
              )}
            </p>
          </div>
        </section>

        {/* ========================================================
            6. GOVERNING COUNCIL & LEADERSHIP
            ======================================================== */}
        <section id="leadership" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.council_title || 'School Leadership & Governing Council'}</h2>
            {data.council_subtitle && <p className="about-section-subtitle">{data.council_subtitle}</p>}
          </div>

          {data.council_description && (
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.75, marginBottom: 18 }}>
              {data.council_description}
            </p>
          )}

          <div className="council-table-wrap">
            <table className="council-table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Sr.</th>
                  <th style={{ width: '34%' }}>Name / Body</th>
                  <th style={{ width: '28%' }}>Designation</th>
                  <th style={{ width: '30%' }}>Governance Role</th>
                </tr>
              </thead>
              <tbody>
                {(data.council_members || [
                  { sr_no: 1, name: "Mr. Vijay Madane", designation: "Principal & Academic Director", representation: "Head of Institution / Academic Governance" },
                  { sr_no: 2, name: "Mrs. Sunita S. Kadam", designation: "Pre-Primary Wing Coordinator", representation: "Early Childhood Care & Play-Way Lead" },
                  { sr_no: 3, name: "Mr. Ramesh D. More", designation: "Primary School Coordinator", representation: "Foundational Literacy & Numeracy" },
                  { sr_no: 4, name: "Mrs. Anita P. Patil", designation: "Secondary School & STEM Head", representation: "Secondary Board Curriculum & Science Labs" },
                  { sr_no: 5, name: "Mr. Pravin K. Jadhav", designation: "Director of Physical Education", representation: "Sports, Athletics & House Master" },
                  { sr_no: 6, name: "Mr. Shrikant G. Kulkarni", designation: "Parent-Teacher Council Secretary", representation: "Parent Community & Welfare Liaison" }
                ]).map((member, idx) => (
                  <tr key={idx}>
                    <td className="council-col-sr" data-label="Sr.">
                      <div className="council-sr-badge" style={{ margin: '0 auto' }}>
                        {member.sr_no || idx + 1}
                      </div>
                    </td>
                    <td className="council-col-name" data-label="Member Name">
                      <strong className="council-member-name" style={{ color: 'var(--navy-header)', fontSize: '14.5px' }}>{member.name}</strong>
                    </td>
                    <td className="council-col-role" data-label="Designation">
                      <span className="council-role-badge">
                        {member.designation}
                      </span>
                    </td>
                    <td className="council-col-rep" data-label="Role" style={{ color: '#475569', fontWeight: 500 }}>
                      <span className="council-rep-text">{member.representation}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================
            7. CURRICULUM PATHWAYS & BOARD RECOGNITIONS
            ======================================================== */}
        <section id="approvals" className="about-block" style={{ marginBottom: 0 }}>
          <div className="about-section-header">
            <h2 className="about-section-title">{data.approvals_title || 'Curriculum Pathways & Institutional Affiliations'}</h2>
            {data.approvals_subtitle && (
              <p className="about-section-subtitle">{data.approvals_subtitle}</p>
            )}
          </div>

          <div className="approvals-grid">
            {(data.approvals || [
              { title: "CBSE Curriculum Track", description: "Central Board of Secondary Education aligned national curriculum emphasizing conceptual clarity, experiential science, mathematics manipulatives, and NCERT frameworks." },
              { title: "Maharashtra State Board Track", description: "State Secondary Certificate (SSC) aligned curriculum offering rigorous Marathi, Hindi and English communicative proficiency and strong foundational board preparation." },
              { title: "STEM, AI & Robotics Lab", description: "Equipped with Arduino kits, microcontrollers, IoT modules, and Python coding tracks teaching creative 21st-century problem solving." },
              { title: "Comprehensive Sports Accreditation", description: "District and state-level athletic competition facilities spanning 400m track, football, cricket, and traditional Indian kho-kho and kabaddi." }
            ]).map((card, idx) => (
              <div key={idx} className="approval-card">
                <div className="approval-title">{card.title}</div>
                <div className="approval-desc">{card.description}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageShell>
  )
}
