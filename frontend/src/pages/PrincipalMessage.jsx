import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { PRINCIPAL_PHOTO } from '../data/collegeData.js'

export default function PrincipalMessage() {
  return (
    <PageShell title="Principal's Message" subtitle="From the Desk of the Head of School | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'start' }}>
        {/* Photo Column */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <img
            src={PRINCIPAL_PHOTO}
            alt="Principal, Karmayogi Vidyaniketan"
            style={{ width: '100%', maxWidth: 280, height: 320, objectFit: 'cover', borderRadius: 8, margin: '0 auto 16px' }}
          />
          <h3 style={{ fontSize: '20px', color: 'var(--navy-header)', margin: '0 0 4px' }}>
            Mr. Vijay Madane
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--blue-vibrant)', fontWeight: 700, margin: '0 0 10px' }}>
            Principal / Academic Director
          </p>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
            M.Sc., M.Ed., Ph.D. (Pursuing)<br />
            18+ Years in School Education &amp; Leadership<br />
            Karmayogi Vidyaniketan / Karmayogi Public School
          </div>
        </div>

        {/* Message Column */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '36px 32px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 20 }}>
            Welcome to Karmayogi Vidyaniketan
          </h2>

          <div style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.85, display: 'grid', gap: 16 }}>
            <p>
              Dear Parents, Students and Well-Wishers,
            </p>
            <p>
              It gives me immense pleasure and pride to welcome you to <strong>Karmayogi Vidyaniketan</strong> (widely known as Karmayogi Public School), Pandharpur, operating under the philanthropic patronage of <strong>Shri Pandurang Pratishthan</strong>.
            </p>
            <p>
              School education is not merely the transmission of textbook facts; it is the sacred endeavor of lighting a fire of curiosity within each young mind, strengthening character, and building the moral courage to lead purposeful lives. At Karmayogi Vidyaniketan, we are firmly committed to providing a balanced education that develops academic ability, confidence, discipline, creativity, physical fitness and responsible citizenship.
            </p>
            <p>
              In our fast-evolving modern world, children require both timeless values and cutting-edge competencies. To achieve this synthesis, our curriculum pairs interactive smart classrooms, well-equipped science laboratories, computer education, and hands-on STEM, AI &amp; Robotics studios with classical Indian values, cultural pride, and respect for tradition.
            </p>
            <p>
              Our experienced educators nurture each child across three vital developmental milestones: foundational play-based exploration in Pre-Primary (Nursery, Jr. &amp; Sr. KG), strong conceptual mastery in Primary school (Grades 1 to 5), and rigorous analytical inquiry in Secondary school (Grades 6 to 10) leading to distinction in CBSE and State Board examinations.
            </p>
            <p>
              Furthermore, through expansive sports grounds, athletic training, daily yoga, vibrant cultural festivals, and safe GPS-monitored school bus transportation connecting Pandharpur and surrounding regions, we ensure every child thrives in a holistic, protective, and energetic environment.
            </p>
            <p>
              I warmly invite parents to visit our campuses at Isbavi and Shelve, meet our faculty, and partner with us in nurturing the leaders, innovators, and noble citizens of tomorrow.
            </p>
            <p style={{ marginTop: 12, fontWeight: 600 }}>
              With warm regards and best wishes,<br />
              <strong style={{ color: 'var(--navy-header)' }}>Mr. Vijay Madane</strong><br />
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Principal / Academic Director, Karmayogi Vidyaniketan</span>
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
