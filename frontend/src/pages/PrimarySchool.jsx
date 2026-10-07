import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function PrimarySchool() {
  return (
    <PageShell title="Primary School Wing" subtitle="Preparatory Stage: Grades 1 to 5 | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Hero Section */}
        <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
            <div style={{ padding: '36px 30px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                GRADES 1 TO 5 &bull; PREPARATORY STAGE
              </span>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '8px 0 14px' }}>
                Building Strong Fundamentals, Curiosity &amp; Communication
              </h2>
              <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                In the Primary School years at Karmayogi Vidyaniketan, children transition from foundational play into structured academic inquiry. Our curriculum focuses on solid reading and writing fundamentals across English, Marathi, and Hindi, mental math agility, scientific curiosity through environmental studies, and creative expression through visual arts and junior sports.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/admissions" className="btn btn-primary">Admissions Open (Grades 1–5) &rarr;</Link>
                <Link to="/curriculum" className="btn btn-secondary">Explore Subjects</Link>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: 280, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
                alt="Primary school children learning enthusiastically"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Primary Stage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
              1. Strong Language &amp; Literacy
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Fluent reading, expressive creative writing, correct grammar, vocabulary enrichment, and public speaking in English, state language Marathi, and national language Hindi.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
              2. Conceptual Math &amp; Mental Agility
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Arithmetic operations, fractions, geometry, word problem solving, and mental calculation tricks that demystify numbers and cultivate computational confidence.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
              3. Environmental &amp; Scientific Discovery
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Observation of plant and animal life, weather patterns, natural resources, water conservation, and community health through engaging practical projects.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
              4. Arts, Digital Skills &amp; Athletics
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Junior computer laboratory classes, block coding, watercolor painting, clay sculpture, daily yoga, kabaddi, kho-kho, and athletic track races.
            </p>
          </div>
        </div>

        {/* Teaching Approach */}
        <div style={{ background: '#f8fafc', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 20 }}>
            Our Primary Pedagogical Approach
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { title: "Smart Interactive Classrooms", desc: "Digital modules visualize complex ideas into interactive animations." },
              { title: "Individualized Remedial Support", desc: "No child left behind; personalized teacher attention for reading and math." },
              { title: "Reading Circles & Library Time", desc: "Weekly scheduled library hours fostering a lifelong habit of book reading." },
              { title: "Continuous Formative Assessment", desc: "Assessment through observation and quizzes rather than exam stress." },
              { title: "Value Education & Morning Assembly", desc: "Daily moral reflections, thought for the day, and national pledge." },
              { title: "Field Excursions & Nature Walks", desc: "Regular educational tours connecting textbook topics with living nature." }
            ].map((a, i) => (
              <div key={i} style={{ background: '#ffffff', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--blue-vibrant)', fontSize: '14.5px', display: 'block', marginBottom: 4 }}>
                  ✓ {a.title}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {a.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div style={{ background: 'var(--navy-header)', color: '#ffffff', padding: '28px 30px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 4px' }}>
              Admissions Open for Primary Grades 1 to 5
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Campus visits and student interactions are conducted Monday to Saturday.
            </p>
          </div>
          <Link to="/admission-process" className="btn btn-primary" style={{ background: 'var(--blue-royal)', borderColor: 'var(--blue-royal)' }}>
            Check Admission Process &rarr;
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
