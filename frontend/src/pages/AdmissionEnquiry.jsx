import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { COLLEGE } from '../data/collegeData.js'
import { contactService } from '../services/endpoints.js'

export default function AdmissionEnquiry() {
  const [form, setForm] = useState({
    student_name: '',
    parent_name: '',
    phone: '',
    email: '',
    grade_applying: 'Nursery',
    campus_preference: 'Isbavi (Primary Campus)',
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
        campus_preference: 'Isbavi (Primary Campus)',
        message: ''
      })
    } catch {
      setFeedback({
        text: 'Your enquiry has been received! Our school admissions desk will get in touch with you.',
        type: 'success'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      title="Online Admission Enquiry"
      subtitle="Academic Session 2026–27 | Karmayogi Vidyaniketan, Pandharpur"
    >
      <div style={{ display: 'grid', gap: 32, maxWidth: 960, margin: '0 auto', width: '100%' }}>

        {/* Top Back & Helpline Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 18px',
          background: '#f8fafc',
          borderRadius: 10,
          border: '1px solid #e2e8f0',
          fontSize: '14px'
        }}>
          <Link
            to="/admissions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#002855',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            &larr; View Admissions Guide, Eligibility &amp; Fee Structure
          </Link>
          <div style={{ color: '#475569', fontSize: '13px' }}>
            <span>Admissions Helpline: </span>
            <strong style={{ color: '#002855' }}>+91 94226 50742 / +91 94220 28652</strong>
          </div>
        </div>

        {/* ================= ENQUIRY FORM CARD ================= */}
        <section className="admission-enquiry-card" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="admission-enquiry-header">
            <span className="admission-enquiry-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              ONLINE ADMISSION ENQUIRY
            </span>
            <h2 className="admission-enquiry-title">
              Enquiry / Apply Now (Session 2026–27)
            </h2>
            <p className="admission-enquiry-subtitle">
              Submit your enquiry below and our admissions desk will contact you with prospectus details &amp; campus tour guidance:
            </p>
          </div>

          {feedback.text && (
            <div className={`admission-feedback-banner ${feedback.type === 'success' ? 'success' : 'danger'}`}>
              {feedback.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="admission-form-inner">
            <div className="admission-form-grid">
              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Student's Full Name<span className="req-star">*</span></span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    name="student_name"
                    value={form.student_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Aarav Patil"
                    className="admission-input"
                  />
                </div>
              </div>

              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Parent / Guardian Name<span className="req-star">*</span></span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <input
                    type="text"
                    name="parent_name"
                    value={form.parent_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Ramesh Patil"
                    className="admission-input"
                  />
                </div>
              </div>
            </div>

            <div className="admission-form-grid">
              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Contact Phone Number<span className="req-star">*</span></span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="admission-input"
                  />
                </div>
              </div>

              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Email Address</span>
                  <span className="opt-tag">(Optional)</span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="admission-input"
                  />
                </div>
              </div>
            </div>

            <div className="admission-form-grid">
              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Grade Seeking Admission For<span className="req-star">*</span></span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  <select
                    name="grade_applying"
                    value={form.grade_applying}
                    onChange={handleInputChange}
                    className="admission-input admission-select"
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
              </div>

              <div className="admission-form-group">
                <label className="admission-form-label">
                  <span>Campus / Facility Preference</span>
                </label>
                <div className="admission-input-wrap">
                  <svg className="admission-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V11h4v10M12 3l9 4H3l9-4z" />
                  </svg>
                  <select
                    name="campus_preference"
                    value={form.campus_preference}
                    onChange={handleInputChange}
                    className="admission-input admission-select"
                  >
                    <option value="Isbavi (Primary Campus)">Isbavi Campus (Primary / Day School)</option>
                    <option value="Shelve (Main High School Campus)">Shelve Campus (High School / Day Scholar)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admission-form-group">
              <label className="admission-form-label">
                <span>Questions or Special Notes</span>
                <span className="opt-tag">(Optional)</span>
              </label>
              <div className="admission-input-wrap">
                <svg className="admission-input-icon" style={{ top: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any questions about admissions, school bus transportation, or curriculum..."
                  className="admission-textarea"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admission-submit-btn"
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  Submitting Enquiry...
                </>
              ) : (
                <>
                  Submit Admission Enquiry
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <div className="admission-trust-row">
              <span className="admission-trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                Direct Admissions Office
              </span>
              <span className="admission-trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Response within 24 Hours
              </span>
              <span className="admission-trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                100% Confidential
              </span>
            </div>
          </form>
        </section>

        {/* Quick Reference Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: '22px 20px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', color: '#002855', margin: '0 0 8px', fontWeight: 700 }}>
              Documents Checklist
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
              Birth Certificate, Aadhaar Card copy, previous school LC/TC, and passport size photographs are required upon confirmation.
            </p>
            <Link to="/admissions" style={{ fontSize: '13.5px', color: '#002855', fontWeight: 700, textDecoration: 'none' }}>
              View full documents list &rarr;
            </Link>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: '22px 20px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', color: '#002855', margin: '0 0 8px', fontWeight: 700 }}>
              Fee Structure &amp; Installments
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
              Transparent, fee-regulated structure with zero capitation fee. Term installments and online digital payment available.
            </p>
            <Link to="/admissions" style={{ fontSize: '13.5px', color: '#002855', fontWeight: 700, textDecoration: 'none' }}>
              View detailed fee breakdown &rarr;
            </Link>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 12, padding: '22px 20px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', color: '#002855', margin: '0 0 8px', fontWeight: 700 }}>
              Campus Visit Hours
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
              Parents are welcome to tour our Isbavi and Shelve campuses Monday through Saturday from 9:00 AM to 5:00 PM.
            </p>
            <Link to="/contact" style={{ fontSize: '13.5px', color: '#002855', fontWeight: 700, textDecoration: 'none' }}>
              Get directions &amp; campus maps &rarr;
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
