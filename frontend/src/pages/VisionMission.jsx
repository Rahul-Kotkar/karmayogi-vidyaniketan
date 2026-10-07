import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function VisionMission() {
  return (
    <PageShell title="Vision &amp; Mission" subtitle="Guiding Principles of Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>
        {/* Vision Section */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--blue-vibrant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-vibrant)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: 0 }}>
              Our Vision
            </h2>
          </div>
          <p style={{ fontSize: '17px', color: '#334155', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
            “To be an institution of educational distinction in Pandharpur and Maharashtra that nurtures young minds with intellectual vigor, moral strength, creative curiosity, and holistic life skills, empowering them to become responsible, empathetic citizens rooted in Indian values.”
          </p>
        </div>

        {/* Mission Section */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)', borderTop: '4px solid #c9a227' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a227' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: 0 }}>
              Our Mission Pillars
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { num: "01", title: "Accessible Quality Education", desc: "Provide high-quality English-medium schooling accessible to boys and girls across Pandharpur and rural Solapur district." },
              { num: "02", title: "Modern Experiential Pedagogy", desc: "Integrate smart classrooms, science labs, computer education, and hands-on STEM & AI Robotics with curriculum delivery." },
              { num: "03", title: "Physical Fitness & Sports", desc: "Cultivate physical endurance, sportsmanship, and teamwork through daily athletics, yoga, cricket, football, and traditional Indian sports." },
              { num: "04", title: "Indian Values & Character", desc: "Inculcate deep respect for Indian culture, self-discipline, honesty, civic duty, and environmental responsibility." },
              { num: "05", title: "Child-Centric Mentorship", desc: "Nurture each learner's unique strengths, curiosity, and emotional confidence through caring teacher-student relationships." },
              { num: "06", title: "Safe Residential Community", desc: "Maintain secure, well-supervised hostel facilities ensuring a disciplined home-away-from-home for residential students." }
            ].map((p, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--blue-vibrant)' }}>{p.num}</span>
                <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '6px 0 8px' }}>{p.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '32px 28px', border: '1px solid #cbd5e1' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 20 }}>
            Core Values at Karmayogi Vidyaniketan
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: "Trust & Transparency", desc: "Open partnership between educators, students, and parents." },
              { label: "Academic Integrity", desc: "Pursuit of conceptual mastery, honest effort, and curiosity." },
              { label: "Discipline & Respect", desc: "Cultivating self-governance, punctuality, and mutual regard." },
              { label: "Innovation & Creativity", desc: "Encouraging original thinking, problem solving, and arts." },
              { label: "Compassion & Service", desc: "Extending empathy to peers, community, and the environment." }
            ].map((v, i) => (
              <div key={i} style={{ background: '#ffffff', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--navy-header)', fontSize: '14.5px', display: 'block', marginBottom: 4 }}>
                  {v.label}
                </strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{v.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <Link to="/about" className="btn btn-secondary">Learn More About Our School →</Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
