import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link, useLocation } from 'react-router-dom'
import instituteBuildingImg from '../assets/hero_building.png'
import founderPortraitImg from '../assets/founder.png'
import { pagesService, getCachedAboutData } from '../services/endpoints.js'
import { DEFAULT_ABOUT_DATA, COLLEGE, PRINCIPAL_PHOTO } from '../data/collegeData.js'

export default function About() {
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
              council_members: Array.isArray(parsed.council_members) && parsed.council_members.length > 0 ? parsed.council_members : prev.council_members,
              approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals
            }))
          } catch {}
        }
      } catch {}
    }
    load()
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
                  src={data.institute_photo_url || instituteBuildingImg}
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
            3. PRINCIPAL'S WELCOME MESSAGE
            ======================================================== */}
        <section id="principal-message" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">Principal's Message</h2>
            <p className="about-section-subtitle">Guiding Philosophy &amp; Welcome from the Head of School</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'start' }}>
            {/* Principal Profile Card */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(7, 29, 58, 0.05)', textAlign: 'center' }}>
              <img
                src={PRINCIPAL_PHOTO}
                alt="Mr. Vijay Madane - Principal, Karmayogi Vidyaniketan"
                style={{ width: '100%', maxWidth: 260, height: 290, objectFit: 'cover', borderRadius: 10, margin: '0 auto 16px', display: 'block' }}
              />
              <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 4px', fontWeight: 800 }}>
                Mr. Vijay Madane
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--blue-vibrant)', fontWeight: 700, margin: '0 0 10px' }}>
                Principal &amp; Academic Director
              </p>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                M.Sc., M.Ed., Ph.D. (Pursuing)<br />
                18+ Years in School Education &amp; Governance<br />
                Karmayogi Vidyaniketan / Karmayogi Public School
              </div>
            </div>

            {/* Principal Narrative */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(7, 29, 58, 0.05)' }}>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--navy-header)', marginBottom: 14 }}>
                Nurturing Character, Intellect and Lifelong Curiosity
              </h3>
              <div style={{ fontSize: '15px', color: '#334155', lineHeight: 1.85, display: 'grid', gap: 14 }}>
                <p>
                  Dear Parents, Students and Well-Wishers,
                </p>
                <p>
                  It gives me immense pride to welcome you to <strong>Karmayogi Vidyaniketan</strong> (widely known as Karmayogi Public School), operating under the visionary leadership of <strong>Shri Pandurang Pratishthan, Pandharpur</strong>. Schooling is the sacred crucible where a child's character, curiosity, discipline, and emotional values take permanent shape.
                </p>
                <p>
                  Our school pairs rigorous academic instruction in CBSE and State Board tracks with interactive smart classrooms, experiential science laboratories, and 21st-century AI &amp; Robotics exposure. Alongside scholastic excellence, we prioritize sports stamina, physical fitness, traditional Indian arts, and ethical mindfulness.
                </p>
                <p>
                  With dedicated GPS-monitored school bus transportation connecting Pandharpur town and surrounding rural zones, we ensure every student enjoys safe, stress-free travel. I warmly invite parents to partner with us in inspiring the leaders, thinkers, and noble citizens of tomorrow.
                </p>
                <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <strong style={{ color: 'var(--navy-header)', fontSize: '15px' }}>Mr. Vijay Madane</strong><br />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Principal &amp; Academic Director, Karmayogi Vidyaniketan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. CHAIRMAN'S MESSAGE & FOUNDER'S TRIBUTE
            ======================================================== */}
        <section id="chairman-message" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">Chairman's Message &amp; Founder's Vision</h2>
            <p className="about-section-subtitle">Leadership Guidance &amp; Tribute to Late Founder स्व. सुधाकरपंत परिचारक</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'start' }}>
            {/* Founder Card */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(7, 29, 58, 0.05)', textAlign: 'center' }}>
              <img
                src={founderPortraitImg}
                alt="स्व. सुधाकरपंत परिचारक - Founder, Shri Pandurang Pratishthan"
                style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', border: '4px solid #dbeafe', margin: '0 auto 16px', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 4px', fontWeight: 800 }}>
                स्व. सुधाकरपंत परिचारक
              </h3>
              <p style={{ fontSize: '13.5px', color: '#c2410c', fontWeight: 700, margin: '0 0 10px' }}>
                Founder, Shri Pandurang Pratishthan
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Former MLA &amp; Visionary Leader who dedicated his life to empowering the agrarian community and rural youth of Pandharpur through education, agriculture, and cooperative institutions.
              </p>
            </div>

            {/* Chairman Narrative */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(7, 29, 58, 0.05)' }}>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', color: 'var(--navy-header)', marginBottom: 14 }}>
                Empowering Generations with Meaningful Education
              </h3>
              <div style={{ fontSize: '15px', color: '#334155', lineHeight: 1.85, display: 'grid', gap: 14 }}>
                <p>
                  On behalf of <strong>Shri Pandurang Pratishthan</strong>, I welcome you to Karmayogi Vidyaniketan / Karmayogi Public School. Our founding inspiration was rooted in the firm conviction that geographical location should never be an obstacle to acquiring world-class education.
                </p>
                <p>
                  Our management body continuously invests in school infrastructure, certified educator talent, modern STEM labs, digital classrooms, and safe student transport fleets. We strive to nurture children who excel not only in academic board examinations, but who also embody integrity, humility, and selfless service toward society.
                </p>
                <p>
                  We extend our deepest gratitude to parents for their unwavering trust and invite all families to be an integral part of the Karmayogi family.
                </p>
                <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <strong style={{ color: 'var(--navy-header)', fontSize: '15px' }}>Governing Body, Shri Pandurang Pratishthan</strong><br />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pandharpur, Dist: Solapur, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. PARENT TRUST / SHRI PANDURANG PRATISHTHAN
            ======================================================== */}
        <section id="management" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">Shri Pandurang Pratishthan, Pandharpur</h2>
            <p className="about-section-subtitle">Parent Governance Organization &amp; Legacy of Service</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '28px 26px', borderRadius: 12, border: '1px solid #e2e8f0', lineHeight: 1.85, fontSize: '15.5px', color: '#334155' }}>
            <p style={{ marginBottom: 14 }}>
              <strong>Shri Pandurang Pratishthan</strong> is a renowned public charitable trust registered in the holy pilgrimage city of Pandharpur, Solapur district, Maharashtra. Established with the noble philosophy of rural upliftment, cooperative growth, and accessible learning, the trust stewards top-tier educational campuses catering to thousands of young learners.
            </p>
            <p style={{ margin: 0 }}>
              Under the enduring inspiration of late founder <strong>स्व. सुधाकरपंत परिचारक</strong> and the forward-looking management council, <strong>Karmayogi Vidyaniketan / Karmayogi Public School</strong> serves as the flagship school campus, providing equal educational opportunity, advanced pedagogy, and holistic student support to boys and girls across the Solapur region.
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
