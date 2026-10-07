import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function Infrastructure() {
  return (
    <PageShell title="Campus Infrastructure" subtitle="Two Modern Campuses: Isbavi &amp; Shelve | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Overview */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Purpose-Built Educational Infrastructure
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            Under the management of Shri Pandurang Pratishthan, Karmayogi Vidyaniketan / Karmayogi Public School operates across two purpose-built campuses in Pandharpur: the <strong>Primary / Foundation Campus at Isbavi</strong> and the <strong>Main High School &amp; Residential Campus at Shelve</strong>. Designed with ample natural light, ventilation, green courtyards, and advanced safety systems, our campuses create an ideal setting for learning and character development.
          </p>
        </div>

        {/* Two Campuses Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Isbavi Campus */}
          <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 210, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80"
                alt="Isbavi Primary & Foundation Campus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                FOUNDATION CAMPUS &bull; PANDHARPUR TOWN
              </span>
              <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '4px 0 10px' }}>
                Primary / Foundation Campus (Isbavi)
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                Located behind MSEDCL Division Office, Link Road, Pandharpur. Dedicated to early childhood and primary students (Nursery to Grade 4). Features child-safe play areas, sandpits, activity centers, reading corners, and colorful classrooms.
              </p>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginTop: 14 }}>
                <strong style={{ fontSize: '12px', color: 'var(--navy-header)', display: 'block', marginBottom: 4 }}>Address:</strong>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  Isbavi, behind MSEDCL Division Office, Link Road, Pandharpur.
                </span>
              </div>
            </div>
          </div>

          {/* Shelve Campus */}
          <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 210, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80"
                alt="Shelve Main High School & Residential Campus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9a227', textTransform: 'uppercase' }}>
                HIGH SCHOOL &bull; RESIDENTIAL HOSTEL CAMPUS
              </span>
              <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '4px 0 10px' }}>
                Main High School &amp; Residential Campus (Shelve)
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                Expansive green campus at Shelve accommodating Middle &amp; Secondary grades (Grade 5 to Grade 10) along with residential hostel wings for 800 boys and 200 girls, science labs, computer center, AI robotics studio, and full-size sports grounds.
              </p>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginTop: 14 }}>
                <strong style={{ fontSize: '12px', color: 'var(--navy-header)', display: 'block', marginBottom: 4 }}>Address:</strong>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  Shelve, Pandharpur, Dist: Solapur, Maharashtra - 413304.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Highlights */}
        <div style={{ background: '#f8fafc', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 20 }}>
            Infrastructure &amp; Safety Highlights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {[
              { title: "Smart Classrooms", desc: "Interactive digital displays, audio-visual projection, and ergonomic desks." },
              { title: "Specialized Science Labs", desc: "Physics, Chemistry, and Biology laboratories equipped with modern apparatus." },
              { title: "Computer, STEM & Robotics", desc: "Air-conditioned computing center with broadband and hands-on robotics kits." },
              { title: "Central Digital Library", desc: "Over 5,000 titles, periodicals, encyclopedias, and digital reading terminals." },
              { title: "Vast Sports Grounds", desc: "Cricket nets, football field, volleyball, kho-kho, kabaddi courts, and athletic tracks." },
              { title: "Campus Safety & Surveillance", desc: "24/7 CCTV surveillance, boundary walls, security guards, and fire safety systems." },
              { title: "Clean Drinking Water", desc: "Commercial RO water purification plants supplying chilled, potable water." },
              { title: "Residential Hostels & Mess", desc: "Secure boarding wings for 800 boys and 200 girls with nutritious mess dining." }
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--navy-header)', fontSize: '14.5px', display: 'block', marginBottom: 4 }}>
                  ✓ {item.title}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/contact" className="btn btn-primary">Schedule a Campus Visit &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
