import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'

export default function PrePrimary() {
  return (
    <PageShell title="Pre-Primary Wing" subtitle="Foundational Stage: Nursery, Junior KG &amp; Senior KG | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Hero Banner Card */}
        <div style={{ background: '#ffffff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
            <div style={{ padding: '36px 30px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                EARLY CHILDHOOD EDUCATION (AGES 3–6)
              </span>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '8px 0 14px' }}>
                Joyful, Play-Way Foundational Learning
              </h2>
              <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                At Karmayogi Vidyaniketan, our Pre-Primary wing comprises <strong>Nursery, Junior KG and Senior KG</strong>. We believe early childhood should be filled with laughter, sensory exploration, curiosity, and warmth. Our child-centric play-way curriculum lays a solid foundation in language, numbers, motor coordination, and social empathy.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/admissions" className="btn btn-primary">Enroll Your Child &rarr;</Link>
                <Link to="/contact" className="btn btn-secondary">Visit Our Pre-Primary Campus</Link>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: 280, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
                alt="Pre-primary children engaged in activity learning"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* 3 Classes Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', color: 'var(--blue-vibrant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
              N
            </div>
            <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 6px' }}>Nursery (Age 3+)</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Gentle introduction to social interaction, sensory sand/water play, finger painting, nursery rhymes, motor coordination, and daily routines.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fefce8', color: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
              Jr
            </div>
            <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 6px' }}>Junior KG (Age 4+)</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Early phonics letter recognition, pre-writing patterns, counting 1 to 20, color &amp; shape classification, storytelling, and structured games.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
              Sr
            </div>
            <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 6px' }}>Senior KG (Age 5+)</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Phonic blending, sight word reading, simple sentence writing, addition basics, environmental curiosity, and smooth readiness for Grade 1.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div style={{ background: '#f8fafc', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', color: 'var(--navy-header)', textAlign: 'center', marginBottom: 20 }}>
            Special Highlights of Our Foundational Wing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { title: "Safe & Ergonomic Environment", desc: "Child-safe furniture, rounded corners, rubberized play mats, and sanitized classrooms." },
              { title: "Dedicated Outdoor Play Zone", desc: "Slides, swings, sandpit, and mini athletics track designed for early gross-motor development." },
              { title: "Jolly Phonics Reading Program", desc: "Multi-sensory synthetic phonics teaching kids to read independently through stories and actions." },
              { title: "Montessori Manipulative Kits", desc: "Hands-on counting beads, wooden block towers, sorting trays, and tactile learning puzzles." },
              { title: "Kid Yoga & Music Circles", desc: "Daily morning stretches, action songs, and percussion rhythm activities to build calm and poise." },
              { title: "Loving & Qualified Educators", desc: "ECCE-certified teachers and caring support staff attending to every child's safety and well-being." }
            ].map((f, i) => (
              <div key={i} style={{ background: '#ffffff', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: 'var(--blue-vibrant)', fontSize: '14.5px', display: 'block', marginBottom: 4 }}>
                  ✓ {f.title}
                </strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Campus Location Mention */}
        <div style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 4px' }}>
              Located at our Primary &amp; Foundation Campus
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Isbavi, behind MSEDCL Division Office, Link Road, Pandharpur.
            </p>
          </div>
          <Link to="/contact" className="btn btn-secondary">Contact Isbavi Campus Desk &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
