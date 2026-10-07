import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function Labs() {
  return (
    <PageShell title="Science, STEM &amp; Technology Laboratories" subtitle="Hands-on Inventions, Scientific Inquiries &amp; Robotics | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Where Theory Transforms into Hands-On Discovery
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            At Karmayogi Vidyaniketan / Karmayogi Public School, our science and technology laboratories are the heart of experiential education. Equipped with high-precision instruments, safety protocols, and modern computing power, students learn by testing hypotheses, coding algorithms, observing living cells, and constructing autonomous robotic prototypes.
          </p>
        </div>

        {/* 4 Dedicated Laboratories */}
        <div style={{ display: 'grid', gap: 28 }}>
          {/* 1. Science Laboratories */}
          <div id="science" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ height: '100%', minHeight: 260, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Science Laboratories"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                PHYSICS &bull; CHEMISTRY &bull; BIOLOGY
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
                Science Laboratories
              </h3>
              <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.65, marginBottom: 16 }}>
                Well-equipped laboratories for practical learning across Physics, Chemistry, and Biology. Features individual experiment benches, chemical hoods, compound optical microscopes, glass apparatus, specimen collections, and anatomical charts adhering strictly to CBSE and State Board requirements.
              </p>
              <ul style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>Weekly mandatory double-period practicals for Grades 6 through 10.</li>
                <li>Individual record logbooks and continuous practical viva evaluations.</li>
                <li>Comprehensive safety gear: eye showers, chemical neutralizing kits, and extinguishers.</li>
              </ul>
            </div>
          </div>

          {/* 2. Computer Laboratory */}
          <div id="computer" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ height: '100%', minHeight: 260, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                alt="Computer Laboratory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                DIGITAL EDUCATION &bull; CODING &bull; IT
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
                Computer Laboratory
              </h3>
              <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.65, marginBottom: 16 }}>
                Modern computer facilities for digital education. Features networked desktop computers with dedicated student headsets, high-speed broadband, educational software suites, and safe internet browsing.
              </p>
              <ul style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>1:1 computer access during all scheduled laboratory periods.</li>
                <li>Curriculum: Scratch block coding for primary to Python, HTML5, and MySQL for secondary.</li>
                <li>Power backup generators ensuring zero disruption during coding classes.</li>
              </ul>
            </div>
          </div>

          {/* 3. STEM Laboratory */}
          <div id="stem" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ height: '100%', minHeight: 260, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="STEM Laboratory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                SCIENCE &bull; TECHNOLOGY &bull; ENGINEERING &bull; MATH
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
                STEM Laboratory
              </h3>
              <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.65, marginBottom: 16 }}>
                Hands-on science, technology, engineering and mathematics learning space where students apply textbook theories to real-world engineering prototypes, mechanical assemblies, and green energy kits.
              </p>
              <ul style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>Modular mechanics kits: gears, pulleys, levers, pneumatics, and structural trusses.</li>
                <li>Renewable energy modules: solar tracking panels, mini hydro-turbines, and fuel cells.</li>
                <li>Preparation zone for the Annual Karmayogi Science Exhibition.</li>
              </ul>
            </div>
          </div>

          {/* 4. AI & Robotics Lab */}
          <div id="robotics" style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ height: '100%', minHeight: 260, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                alt="AI & Robotics Lab"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                ARTIFICIAL INTELLIGENCE &bull; ROBOTICS KITS &bull; IOT
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--navy-header)', margin: '6px 0 12px' }}>
                AI &amp; Robotics Laboratory
              </h3>
              <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.65, marginBottom: 16 }}>
                Introduce students to emerging technologies, robotics and artificial intelligence. Students construct programmable autonomous buggies, wire ultrasonic sensors, explore Python machine learning scripts, and develop 21st-century problem-solving capabilities.
              </p>
              <ul style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>Arduino microcontrollers, breadboards, ultrasonic, infrared, and temperature sensors.</li>
                <li>Robotic car kits, line follower chassis, and motor driver modules.</li>
                <li>Specialized coaching for national robotics olympiads and coding hackathons.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/admissions" className="btn btn-primary">Enroll Your Child for Practical Science &amp; STEM Education &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
