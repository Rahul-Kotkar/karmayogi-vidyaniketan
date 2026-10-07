import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { COLLEGE } from '../data/collegeData.js'
import { contactService, settingsService } from '../services/endpoints.js'
import { MapPinIcon, PhoneIcon, SendIcon, LockIcon, ClockIcon } from '../components/Icons.jsx'

const QUICK_TOPICS = [
  'BPT Admission 2026-27',
  'MPT Specializations',
  'Clinical Training & Hospital',
  'Campus Visit Appointment',
  'Scholarships & Fees',
  'General Enquiry'
]

export default function Contact() {
  const [collegeInfo, setCollegeInfo] = useState(COLLEGE)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ text: '', type: '' })
  const [activeTopic, setActiveTopic] = useState('')

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) {
        setCollegeInfo(prev => ({
          ...prev,
          foundation: data.foundation_name || prev.foundation,
          name: data.college_name || prev.name,
          address: data.college_address || prev.address,
          phone: data.college_phone || prev.phone,
          email: data.college_email || prev.email,
          website: data.college_website || prev.website
        }))
      }
    }).catch(() => {})
  }, [])

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic)
    setForm(prev => ({ ...prev, subject: topic }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback({ text: '', type: '' })

    try {
      await contactService.submit(form)
      setFeedback({
        text: 'Thank you for reaching out! Your enquiry has been safely received. Our admissions / administration desk will contact you within 1 business day.',
        type: 'success'
      })
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setActiveTopic('')
    } catch (err) {
      setFeedback({
        text: err.message || 'Failed to submit enquiry. Please check your network and try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const mapSearchQuery = encodeURIComponent(
    `${collegeInfo.name || 'Karmayogi College of Physiotherapy'}, Shelve, Pandharpur, Maharashtra`
  )

  return (
    <PageShell
      title="Contact Our Campus"
    >
      <div className="contact-grid-wrapper">
        {/* ================= LEFT COLUMN: CONTACT CARDS ================= */}
        <div className="contact-info-column">
          {/* 1. College Location Card */}
          <div className="contact-card-box">
            <div className="contact-card-head">
              <div className="contact-icon-circle">
                <MapPinIcon size={18} color="#1d4ed8" />
              </div>
              <div>
                <h4 className="contact-card-title">Campus Location</h4>
                <span className="contact-card-sub">Main Academic &amp; Hospital Complex</span>
              </div>
            </div>

            <div className="contact-card-content">
              <div className="contact-card-foundation">
                {collegeInfo.foundation}
              </div>
              <strong className="contact-card-college">
                {collegeInfo.name}
              </strong>
              <p className="contact-card-address">
                {collegeInfo.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-map-link"
              >
                <span>View on Google Maps</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* 2. Direct Phone & Email Card */}
          <div className="contact-card-box">
            <div className="contact-card-head">
              <div className="contact-icon-circle">
                <PhoneIcon size={18} color="#1d4ed8" />
              </div>
              <div>
                <h4 className="contact-card-title">Phone &amp; Email Inquiries</h4>
                <span className="contact-card-sub">Direct Institutional Lines</span>
              </div>
            </div>

            <div className="contact-info-list">
              <div>
                <span className="contact-info-label">
                  Central Office Phone
                </span>
                <a
                  href={`tel:${collegeInfo.phone}`}
                  className="contact-info-phone"
                >
                  {collegeInfo.phone}
                </a>
              </div>

              <div>
                <span className="contact-info-label">
                  Official Email Address
                </span>
                <a
                  href={`mailto:${collegeInfo.email}`}
                  className="contact-info-link"
                >
                  {collegeInfo.email}
                </a>
              </div>

              <div>
                <span className="contact-info-label">
                  Institutional Website
                </span>
                <span className="contact-info-text">
                  {collegeInfo.website}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Office & Counseling Hours Card */}
          <div className="contact-card-box">
            <div className="contact-card-head">
              <div className="contact-icon-circle">
                <ClockIcon size={18} color="#1d4ed8" />
              </div>
              <div>
                <h4 className="contact-card-title">Office &amp; Counseling Hours</h4>
                <span className="contact-card-sub">Administration Schedule</span>
              </div>
            </div>

            <div className="contact-hours-list">
              <div className="contact-hours-row bordered">
                <span style={{ fontWeight: 600 }}>Monday – Saturday:</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>10:00 AM – 5:00 PM</span>
              </div>
              <div className="contact-hours-row">
                <span style={{ fontWeight: 600, color: '#dc2626' }}>Sunday:</span>
                <span style={{ color: '#64748b' }}>Closed (Admin Desk)</span>
              </div>
              <div className="contact-hours-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <em>Attached Hospital Emergency &amp; Trauma services are available 24/7.</em>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
        <div>
          <div className="contact-form-card">
            <h3 className="contact-form-title">Send Us an Online Enquiry</h3>
            <p className="contact-form-subtitle">
              Please share your questions or admission inquiries. Our administration desk will review and contact you promptly.
            </p>

            {/* Quick Topic Selector Chips */}
            <div className="contact-topics-section">
              <div className="contact-topics-header">
                <span className="contact-topics-label">
                  Select a Topic <span className="contact-topics-sub">(Optional)</span>
                </span>
                {activeTopic && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTopic('')
                      setForm(prev => ({ ...prev, subject: '' }))
                    }}
                    className="contact-clear-topic-btn"
                  >
                    Clear ×
                  </button>
                )}
              </div>
              <div className="contact-quick-topics">
                {QUICK_TOPICS.map(topic => {
                  const isSelected = activeTopic === topic
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`contact-topic-pill ${isSelected ? 'active' : ''}`}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span>{topic}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Feedback Notifications */}
            {feedback.text && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: feedback.type === 'success' ? '#065f46' : '#991b1b',
                  border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}>
                  {feedback.type === 'success' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  )}
                </span>
                <span style={{ flex: 1, lineHeight: 1.45 }}>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Full Name & Email */}
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="contact-input-field"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    className="contact-input-field"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Subject */}
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-label">
                    Contact Phone <span style={{ fontWeight: 400, color: '#64748b', fontSize: 12 }}>(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    className="contact-input-field"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Subject / Program
                  </label>
                  <input
                    type="text"
                    className="contact-input-field"
                    value={form.subject}
                    onChange={e => {
                      setForm({ ...form, subject: e.target.value })
                      setActiveTopic('')
                    }}
                    placeholder="e.g. Admission / Course Inquiry"
                  />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="contact-form-group" style={{ marginBottom: 20 }}>
                <label className="contact-label">
                  Your Message or Inquiry <span className="required-star">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  className="contact-input-field contact-textarea"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Please write your questions regarding course admission, eligibility, hospital training, or campus facilities..."
                />
              </div>

              {/* Submit Button */}
              <button
                className="contact-submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span>Submitting Your Enquiry...</span>
                ) : (
                  <>
                    <SendIcon size={14} color="#ffffff" />
                    <span>Submit Online Enquiry</span>
                    <span style={{ fontSize: 16 }}>→</span>
                  </>
                )}
              </button>

              <div className="contact-privacy-note">
                <LockIcon size={12} color="#64748b" />
                <span>Your contact details are kept strictly confidential and used solely to assist with your inquiry.</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE CAMPUS MAP SECTION ================= */}
      <div className="contact-map-container">
        <iframe
          title="College Campus Location Map"
          width="100%"
          height="320"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
        />
      </div>
    </PageShell>
  )
}

