import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import instituteBuildingImg from '../assets/hero_building.png'
import { pagesService, getCachedAboutData } from '../services/endpoints.js'
import { DEFAULT_ABOUT_DATA, COLLEGE } from '../data/collegeData.js'

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

  return (
    <PageShell title="About Karmayogi Vidyaniketan" subtitle="Karmayogi Public School | Shri Pandurang Pratishthan, Pandharpur">
      <div className="about-single-page">

        {/* ========================================================
            1. ABOUT THE SCHOOL (Visual Split & Feature Highlights)
            ======================================================== */}
        <section id="about-school" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.institute_title}</h2>
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
              <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.8, marginBottom: 16 }}>
                {data.institute_p1}
              </p>

              {data.institute_p2 && (
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.8, margin: 0 }}>
                  {data.institute_p2}
                </p>
              )}
            </div>
          </div>

          {/* 3 Quick Highlight Boxes */}
          <div className="about-features-grid">
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <div className="about-feature-title">Academic Excellence</div>
                <p className="about-feature-desc">Nursery to Grade 10 education combining CBSE and State Board tracks.</p>
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
                <div className="about-feature-title">Smart Labs &amp; STEM</div>
                <p className="about-feature-desc">Interactive smart classrooms, science labs, computer lab, and AI &amp; Robotics.</p>
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
                <div className="about-feature-title">Values &amp; Student Care</div>
                <p className="about-feature-desc">Indian values, discipline, sportsmanship, and holistic child mentorship.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. PARENT TRUST / SHRI PANDURANG PRATISHTHAN
            ======================================================== */}
        <section id="management" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">Shri Pandurang Pratishthan, Pandharpur</h2>
            <p className="about-section-subtitle">Parent Governance Organization &amp; Legacy of Service</p>
          </div>
          <div style={{ background: '#f8fafc', padding: 28, borderRadius: 12, border: '1px solid #e2e8f0', lineHeight: 1.8, fontSize: '15.5px', color: '#334155' }}>
            <p style={{ marginBottom: 14 }}>
              Shri Pandurang Pratishthan is a renowned charitable trust based in the holy pilgrimage town of Pandharpur, Solapur district, Maharashtra. Founded with the inspiring motto of selfless service, rural empowerment, and holistic education, the trust manages premier educational campuses nurturing thousands of students.
            </p>
            <p style={{ margin: 0 }}>
              Under the benevolent stewardship of late founder <strong>स्व. सुधाकरपंत परिचारक</strong> and the governing body, Karmayogi Vidyaniketan / Karmayogi Public School stands as a model institution imparting quality English-medium schooling to children from Pandharpur and neighboring regions.
            </p>
          </div>
        </section>

        {/* ========================================================
            3. VISION & MISSION
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
                "{data.vision_text}"
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
                {(data.mission_points || []).map((point, idx) => (
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
            4. QUALITY COMMITMENT
            ======================================================== */}
        <section id="quality-policy" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.qp_title || 'Commitment to Quality Education'}</h2>
          </div>

          <div className="quality-policy-card">
            <p className="quality-policy-lead">
              {data.qp_text}
            </p>

            <div className="quality-badges-row">
              <div className="quality-badge-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>National Educational Standards</span>
              </div>
              <div className="quality-badge-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Regular Parent Feedback</span>
              </div>
              <div className="quality-badge-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Continuous Faculty Growth</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. GOVERNING COUNCIL / LEADERSHIP
            ======================================================== */}
        <section id="leadership" className="about-block">
          <div className="about-section-header">
            <h2 className="about-section-title">{data.council_title || 'Management & School Leadership'}</h2>
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
                  <th style={{ width: '30%' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {(data.council_members || []).map((member, idx) => (
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
            6. CURRICULUM & BOARD RECOGNITIONS
            ======================================================== */}
        <section id="approvals" className="about-block" style={{ marginBottom: 0 }}>
          <div className="about-section-header">
            <h2 className="about-section-title">{data.approvals_title || 'Curriculum Pathways & Boards'}</h2>
            {data.approvals_subtitle && (
              <p className="about-section-subtitle">{data.approvals_subtitle}</p>
            )}
          </div>

          <div className="approvals-grid">
            {(data.approvals || []).map((card, idx) => (
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
