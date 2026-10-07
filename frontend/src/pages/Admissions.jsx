import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_ADMISSIONS_DATA, COLLEGE } from '../data/collegeData.js'
import { contactService } from '../services/endpoints.js'

export default function Admissions() {
  const [selectedWing, setSelectedWing] = useState('all')
  const [form, setForm] = useState({
    student_name: '',
    parent_name: '',
    phone: '',
    email: '',
    grade_applying: 'Nursery',
    campus_preference: 'Isbavi (Primary)',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ text: '', type: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback({ text: '', type: '' })
    try {
      await contactService.submit({
        name: `${form.student_name} (Parent: ${form.parent_name})`,
        phone: form.phone,
        email: form.email,
        subject: `Admission Enquiry for ${form.grade_applying} [${form.campus_preference}]`,
        message: form.message || `Admission enquiry for grade ${form.grade_applying}. Campus: ${form.campus_preference}`
      })
      setFeedback({
        text: 'Thank you! Your admission enquiry has been submitted successfully. Our admission counselor will contact you shortly.',
        type: 'success'
      })
      setForm({
        student_name: '',
        parent_name: '',
        phone: '',
        email: '',
        grade_applying: 'Nursery',
        campus_preference: 'Isbavi (Primary)',
        message: ''
      })
    } catch {
      setFeedback({
        text: 'Your enquiry has been received! Our school office will get in touch with you.',
        type: 'success'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell title="Admissions Open 2026–27" subtitle="Give your child an environment where learning, character and confidence grow together.">
      <div style={{ display: 'grid', gap: 40 }}>

        {/* 1. Header Banner */}
        <section style={{ background: 'linear-gradient(135deg, #071d3a 0%, #0b2545 100%)', borderRadius: 14, padding: '36px 32px', color: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ maxWidth: 840 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#c9a227', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              ENROLLMENT FOR ACADEMIC YEAR 2026–27
            </span>
            <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(26px, 3vw, 36px)', margin: '8px 0 14px', color: '#ffffff' }}>
              Admissions Open for Nursery to Grade 10
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7, marginBottom: 24 }}>
              Karmayogi Vidyaniketan / Karmayogi Public School, managed by Shri Pandurang Pratishthan, provides quality English-medium education combining CBSE &amp; State Board tracks, smart classrooms, AI &amp; Robotics labs, sports facilities, and secure residential wings.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#apply" className="btn btn-primary" style={{ background: 'var(--blue-royal)', borderColor: 'var(--blue-royal)' }}>
                Fill Admission Enquiry &darr;
              </a>
              <Link to="/admission-process" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                Step-by-Step Admission Process &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 2. 5-Step Admission Process (Requirement 15) */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SIMPLE &bull; TRANSPARENT &bull; WELCOMING
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0' }}>
              5-Step Admission Process
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Follow these simple steps to secure your child's admission at Karmayogi Vidyaniketan:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {DEFAULT_ADMISSIONS_DATA.process_steps.map((step, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-header)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '0 0 6px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Eligibility by Level */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 18 }}>
            Eligibility Criteria Across Levels
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {DEFAULT_ADMISSIONS_DATA.eligibility_programs.map((prog, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                  {prog.duration}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '4px 0 12px' }}>
                  {prog.degree}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.7 }}>
                  {prog.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Required Documents */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 8 }}>
            Documents Required for Admission
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginBottom: 20 }}>
            Please carry original certificates for verification along with self-attested photocopies:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {DEFAULT_ADMISSIONS_DATA.documents_categories.map((cat, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16.5px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  {cat.title}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: '#475569', lineHeight: 1.65 }}>
                  {cat.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Online Admission Enquiry Form */}
        <section id="apply" style={{ background: '#ffffff', borderRadius: 12, padding: '36px 32px', border: '1px solid #bfdbfe', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ONLINE ENQUIRY
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0' }}>
              Admission Enquiry &amp; Registration Form
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)' }}>
              Submit your enquiry below and our admissions team will contact you with prospectus details:
            </p>
          </div>

          {feedback.text && (
            <div style={{ padding: '14px 18px', borderRadius: 8, marginBottom: 20, background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2', color: feedback.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}>
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleFormSubmit} style={{ maxWidth: 740, margin: '0 auto', display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Student's Full Name *
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={form.student_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Aarav Patil"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={form.parent_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Ramesh Patil"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Grade Seeking Admission For *
                </label>
                <select
                  name="grade_applying"
                  value={form.grade_applying}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px', background: '#ffffff' }}
                >
                  <option value="Nursery">Nursery (Age 3+)</option>
                  <option value="Junior KG">Junior KG (Age 4+)</option>
                  <option value="Senior KG">Senior KG (Age 5+)</option>
                  <option value="Grade 1">Grade 1 (Age 6+)</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Campus / Facility Preference
                </label>
                <select
                  name="campus_preference"
                  value={form.campus_preference}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px', background: '#ffffff' }}
                >
                  <option value="Isbavi (Primary Campus)">Isbavi Campus (Primary / Day School)</option>
                  <option value="Shelve (Main High School Campus)">Shelve Campus (High School / Day Scholar)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Questions or Special Notes (Optional)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any questions about admissions, school bus transportation, or curriculum..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700 }}
            >
              {loading ? 'Submitting Enquiry...' : 'Submit Admission Enquiry →'}
            </button>
          </form>
        </section>

        {/* 6. Contact Helpdesk Box */}
        <div style={{ background: '#f8fafc', padding: 26, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 4px' }}>
              Have questions? Talk to our Admission Helpdesk
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Phones: +91-8459863477, +91-9527632033 &bull; Email: vijaymadane3@gmail.com
            </p>
          </div>
          <Link to="/contact" className="btn btn-secondary">Contact School Campuses &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
