import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { SCHOOL_LEVELS, SCHOOL_SUBJECTS } from '../data/subjectsData.js'

export default function Academics() {
  const { subpage } = useParams()
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filteredSubjects = selectedLevel === 'all'
    ? SCHOOL_SUBJECTS
    : SCHOOL_SUBJECTS.filter(s => s.yearKey === selectedLevel)

  return (
    <PageShell title="Academic Programs &amp; Curriculum" subtitle="Nursery to Grade 10 • CBSE &amp; State Board Tracks | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 40 }}>

        {/* 1. Academic Overview Banner */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ACADEMIC EXCELLENCE &bull; SHAPING YOUNG MINDS
          </span>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '8px 0 16px' }}>
            A Balanced Journey of Knowledge, Character &amp; Life Skills
          </h2>
          <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.8, margin: 0 }}>
            Karmayogi Vidyaniketan provides a structured and stimulating academic curriculum designed to develop foundational literacy, scientific inquiry, computational thinking, mathematical problem solving, and multilingual communication. From our activity-based Pre-Primary classes through Grade 10 secondary board tracks, each stage of education is tailored to child development milestones.
          </p>
        </section>

        {/* 2. The Three Core School Wings */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
              EDUCATIONAL DIVISIONS
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0' }}>
              Our Three Academic Wings
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Pre-Primary */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 190, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80"
                  alt="Pre-Primary Foundational Learning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  Ages 3 to 6 &bull; Foundational Stage
                </span>
                <h3 style={{ fontSize: '21px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Pre-Primary Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Nursery, Jr. KG and Sr. KG with activity-based and foundational learning. Emphasizes sensory exploration, phonics, joyful numeracy, motor coordination, storytelling, and social habits.
                </p>
                <div style={{ marginTop: 16 }}>
                  <Link to="/pre-primary" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    View Pre-Primary Wing &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Primary School */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 190, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80"
                  alt="Primary School Conceptual Mastery"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  Grades 1 to 5 &bull; Preparatory Stage
                </span>
                <h3 style={{ fontSize: '21px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Primary School Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Focus on strong fundamentals, curiosity, communication and creativity. Reading and writing in English, Marathi, Hindi, mental math, science discovery, and junior computer labs.
                </p>
                <div style={{ marginTop: 16 }}>
                  <Link to="/primary" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    View Primary Wing &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary School */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 190, overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                  alt="Secondary School Board Excellence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  Grades 6 to 10 &bull; Middle &amp; Secondary
                </span>
                <h3 style={{ fontSize: '21px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
                  Secondary School Wing
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  Structured academic learning with preparation for higher education under CBSE &amp; State Board tracks. Intensive science labs, advanced mathematics, AI &amp; Robotics, and mock exams.
                </p>
                <div style={{ marginTop: 16 }}>
                  <Link to="/secondary" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    View Secondary Wing &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Teaching Methodologies (Requirement 10) */}
        <section id="methodology" style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              PEDAGOGICAL EXCELLENCE
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0' }}>
              Teaching Methodologies
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: 660, margin: '0 auto' }}>
              We implement learner-centric, engaging teaching strategies that spark curiosity and deep conceptual understanding:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              {
                title: "Activity-Based Learning",
                desc: "Hands-on projects, games, Montessori manipulatives, and tactile learning kits make abstract ideas tangible."
              },
              {
                title: "Smart Classroom Learning",
                desc: "Interactive digital displays, 3D animated video modules, and audio-visual tools enhance retention."
              },
              {
                title: "Experiential Learning",
                desc: "Real-world scientific observation, nature trails, museum visits, and agricultural field excursions."
              },
              {
                title: "STEM Education",
                desc: "Cross-disciplinary science, technology, engineering, and mathematics projects solving real challenges."
              },
              {
                title: "Digital Learning",
                desc: "Dedicated computer laboratory sessions, coding in Scratch & Python, and digital assignments."
              },
              {
                title: "Project-Based Learning",
                desc: "Collaborative research and annual science exhibitions encouraging self-directed inquiry."
              },
              {
                title: "Collaborative Learning",
                desc: "Peer study circles, team presentations, group problem solving, and respectful debate."
              }
            ].map((m, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--blue-vibrant)', marginBottom: 6 }}>
                  0{idx + 1} &bull; METHOD
                </div>
                <h3 style={{ fontSize: '16.5px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Curriculum & Subjects Directory */}
        <section id="curriculum">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: 0 }}>
                Curriculum Subjects Directory
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Explore subjects taught across all developmental levels under CBSE &amp; State Board tracks
              </p>
            </div>

            {/* Level Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SCHOOL_LEVELS.map(level => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setSelectedLevel(level.key)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: 999,
                    border: '1px solid #cbd5e1',
                    background: selectedLevel === level.key ? 'var(--navy-header)' : '#ffffff',
                    color: selectedLevel === level.key ? '#ffffff' : 'var(--navy-header)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {level.shortLabel} ({level.count})
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {filteredSubjects.map(sub => (
              <div key={sub.id} style={{ background: '#ffffff', borderRadius: 10, padding: 22, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', background: '#eff6ff', padding: '3px 8px', borderRadius: 4 }}>
                    {sub.abbr}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {sub.yearLabel}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  {sub.name}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                  {sub.description}
                </p>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                  <strong style={{ fontSize: '12px', color: 'var(--navy-header)', display: 'block', marginBottom: 6 }}>
                    Key Focus Areas:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {sub.keyTopics.slice(0, 3).map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/curriculum" className="btn btn-secondary">
              View Detailed Curriculum &amp; Evaluation Guide &rarr;
            </Link>
          </div>
        </section>

        {/* 5. Examination & Assessment Framework (Requirement 10) */}
        <section id="examination" style={{ background: '#f8fafc', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 12 }}>
            Examination &amp; Continuous Assessment System
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
            At Karmayogi Vidyaniketan, assessment is a tool for constructive learning and encouragement rather than anxiety. We follow Continuous and Comprehensive Evaluation (CCE) in harmony with CBSE and State Board directives:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                Formative Assessments (FA)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Continuous classroom observation, project portfolios, lab practical viva, quizzes, speaking skills (ASL), and creative assignments.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                Summative Evaluations (SA)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Term-end written examinations testing conceptual depth, mathematical application, problem solving, and analytical clarity.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                Board Prelim Mock Series
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Rigorous full-length prelim examinations for Grade 10 students replicating exact board conditions with personalized feedback.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                Parent Progress Conferences
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Quarterly Open House sessions where teachers and parents review student progress cards and design individualized support plans.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link to="/admissions" className="btn btn-primary">Admissions Open 2026–27 — Apply Today &rarr;</Link>
          </div>
        </section>

      </div>
    </PageShell>
  )
}
