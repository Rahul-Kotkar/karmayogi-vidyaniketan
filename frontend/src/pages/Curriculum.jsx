import React, { useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { SCHOOL_LEVELS, SCHOOL_SUBJECTS } from '../data/subjectsData.js'

export default function Curriculum() {
  const [selectedKey, setSelectedKey] = useState('all')

  const displayedSubjects = selectedKey === 'all'
    ? SCHOOL_SUBJECTS
    : SCHOOL_SUBJECTS.filter(s => s.yearKey === selectedKey)

  return (
    <PageShell title="Curriculum &amp; Academic Framework" subtitle="CBSE &amp; Maharashtra State Board Tracks • Nursery to Grade 10 | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Comprehensive Curriculum Structure
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            At Karmayogi Vidyaniketan / Karmayogi Public School, the curriculum is structured to ensure a natural, progressive development of intellect, language, numerical fluency, scientific inquiry, and ethical sensitivity. We offer both <strong>CBSE and Maharashtra State Board tracks</strong>, allowing students to pursue national competitive benchmarks or state-focused academic pathways.
          </p>
        </div>

        {/* Level Filters */}
        <div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {SCHOOL_LEVELS.map(level => (
              <button
                key={level.key}
                type="button"
                onClick={() => setSelectedKey(level.key)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 999,
                  fontSize: '13.5px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  background: selectedKey === level.key ? 'var(--navy-header)' : '#ffffff',
                  color: selectedKey === level.key ? '#ffffff' : 'var(--navy-header)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedKey === level.key ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Subject Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {displayedSubjects.map(sub => (
              <div key={sub.id} style={{ background: '#ffffff', borderRadius: 10, padding: 22, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', background: '#eff6ff', padding: '3px 8px', borderRadius: 4 }}>
                    {sub.abbr}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {sub.yearLabel}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  {sub.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
                  {sub.description}
                </p>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                  <strong style={{ fontSize: '12px', color: 'var(--navy-header)', display: 'block', marginBottom: 6 }}>
                    Key Syllabus Elements:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    {sub.keyTopics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Co-Scholastic Curriculum */}
        <div style={{ background: '#f8fafc', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 18 }}>
            Integrated Co-Scholastic &amp; Value Education
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { title: "Physical & Health Education", desc: "Daily athletics, team sports, yoga, fitness testing, and nutritional wellness." },
              { title: "Visual & Performing Arts", desc: "Fine arts, drawing, clay modeling, vocal music, tabla, and folk dance." },
              { title: "AI, STEM & Robotics", desc: "Hands-on engineering kits, electronic circuit prototyping, and coding." },
              { title: "Value Education & Ethics", desc: "Indian cultural values, civic duty, empathy, environmental consciousness, and character." }
            ].map((c, i) => (
              <div key={i} style={{ background: '#ffffff', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--blue-vibrant)', fontSize: '14.5px', display: 'block', marginBottom: 4 }}>
                  ✓ {c.title}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {c.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Link to="/admissions" className="btn btn-primary">Enroll for the Upcoming Academic Year &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
