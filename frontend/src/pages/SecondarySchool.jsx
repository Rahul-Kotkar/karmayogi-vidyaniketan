import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function SecondarySchool() {
  return (
    <PageShell title="Secondary School Wing" subtitle="Middle &amp; Secondary Stage: Grades 6 to 10 • CBSE &amp; State Board Tracks | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Hero Section */}
        <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
            <div style={{ padding: '36px 30px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                GRADES 6 TO 10 &bull; BOARD EXAMINATIONS EXCELLENCE
              </span>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '8px 0 14px' }}>
                Structured Academic Rigor &amp; Future Readiness
              </h2>
              <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                The Secondary School Wing of Karmayogi Vidyaniketan provides a disciplined, intellectually demanding, and supportive environment for students from <strong>Grade 6 through Grade 10</strong>. Aligned with national CBSE and Maharashtra State Board standards, our curriculum blends extensive laboratory practicals, advanced mathematics, social science debates, and cutting-edge STEM, AI &amp; Robotics exposure.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/admissions" className="btn btn-primary">Admissions Open 2026–27 &rarr;</Link>
                <Link to="/labs" className="btn btn-secondary">Explore Laboratories</Link>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: 280, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Secondary students engaged in academic discussions"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Board Tracks Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* CBSE Track */}
          <div style={{ background: '#ffffff', padding: 28, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid var(--blue-vibrant)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              NATIONAL CURRICULUM
            </span>
            <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
              CBSE Track
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Follows NCERT frameworks focusing on conceptual depth, analytical thinking, application-oriented science &amp; mathematics, and continuous assessment.
            </p>
            <ul style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
              <li>English Language &amp; Literature</li>
              <li>Mathematics (Standard &amp; Basic options)</li>
              <li>Science (Physics, Chemistry, Biology Practicals)</li>
              <li>Social Science (History, Geography, Political Science, Economics)</li>
              <li>Second Language: Hindi Course A/B or Marathi</li>
              <li>Information Technology &amp; Artificial Intelligence</li>
            </ul>
          </div>

          {/* State Board Track */}
          <div style={{ background: '#ffffff', padding: 28, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #c9a227' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9a227', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              STATE CURRICULUM
            </span>
            <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
              Maharashtra State Board Track
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Comprehensive syllabus regulated by the Maharashtra State Board of Secondary and Higher Secondary Education, with thorough regional literature appreciation.
            </p>
            <ul style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
              <li>English (First or Second Language)</li>
              <li>Mathematics (Algebra &amp; Geometry)</li>
              <li>Science &amp; Technology (Part 1 &amp; Part 2 Practicals)</li>
              <li>Social Sciences (History, Civics, Geography)</li>
              <li>First Language: Marathi (मातृभाषा)</li>
              <li>Third Language: Hindi / Sanskrit</li>
            </ul>
          </div>
        </div>

        {/* Key Secondary Features */}
        <div style={{ background: '#f8fafc', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 20 }}>
            Academic Support for Grade 10 Board Excellence
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { title: "Weekly Science Lab Practicals", desc: "Mandatory individual lab stations for Physics, Chemistry, and Biology experiments." },
              { title: "Board Examination Prelim Series", desc: "Multiple full-length preliminary test rounds replicating exact board timing and evaluation." },
              { title: "Personalized Remedial Coaching", desc: "Special evening and zero-period support for students needing extra clarity in math and science." },
              { title: "STEM, AI & Robotics Studio", desc: "Hands-on coding, Arduino microcontroller programming, and robotics hardware building." },
              { title: "Career Guidance & Counseling", desc: "Expert seminars on streaming choices (Science, Commerce, Arts) and competitive exam readiness." },
              { title: "Supervised Study & Doubt-Clearing Hours", desc: "Faculty-supervised prep hours and structured academic support ensuring zero distractions and focused learning." }
            ].map((f, i) => (
              <div key={i} style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--navy-header)', fontSize: '15px', display: 'block', marginBottom: 4 }}>
                  ✓ {f.title}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* High School Campus Mention */}
        <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 4px' }}>
              Main High School &amp; Residential Campus
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Shelve, Pandharpur, Dist: Solapur, Maharashtra - 413304.
            </p>
          </div>
          <Link to="/contact" className="btn btn-secondary">Contact Shelve Campus &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
