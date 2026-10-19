import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_ADMISSIONS_DATA, COLLEGE } from '../data/collegeData.js'
import { pagesService, getCachedAdmissionsData } from '../services/endpoints.js'
import { CheckIcon, CreditCardIcon, CalendarIcon } from '../components/Icons.jsx'

export default function Admissions() {
  const [admissionsData, setAdmissionsData] = useState(() => getCachedAdmissionsData() || DEFAULT_ADMISSIONS_DATA)
  const [activeFaq, setActiveFaq] = useState(null)

  const loadAdmissions = () => {
    pagesService.getBySlug('admissions').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setAdmissionsData(prev => ({ ...prev, ...parsed }))
        } catch {}
      }
    }).catch(() => {})
  }

  useEffect(() => {
    loadAdmissions()
    const handleUpdated = (e) => {
      if (e?.detail?.content_html) {
        try {
          const parsed = JSON.parse(e.detail.content_html)
          setAdmissionsData(prev => ({ ...prev, ...parsed }))
        } catch {}
      } else {
        loadAdmissions()
      }
    }
    window.addEventListener('page_admissions_updated', handleUpdated)
    return () => window.removeEventListener('page_admissions_updated', handleUpdated)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const headerOffset = 130
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const processSteps = (Array.isArray(admissionsData.process_steps) && admissionsData.process_steps.length > 0)
    ? admissionsData.process_steps
    : DEFAULT_ADMISSIONS_DATA.process_steps

  const eligibilityPrograms = (Array.isArray(admissionsData.eligibility_programs) && admissionsData.eligibility_programs.length > 0)
    ? admissionsData.eligibility_programs
    : DEFAULT_ADMISSIONS_DATA.eligibility_programs

  const documentsCategories = (Array.isArray(admissionsData.documents_categories) && admissionsData.documents_categories.length > 0)
    ? admissionsData.documents_categories
    : DEFAULT_ADMISSIONS_DATA.documents_categories

  const feesTable = (Array.isArray(admissionsData.fees_table) && admissionsData.fees_table.length > 0)
    ? admissionsData.fees_table
    : DEFAULT_ADMISSIONS_DATA.fees_table

  const faqsList = (Array.isArray(admissionsData.faqs) && admissionsData.faqs.length > 0)
    ? admissionsData.faqs
    : (DEFAULT_ADMISSIONS_DATA.faqs || [
      {
        q: "Is there any donation or capitation fee for admission?",
        a: "No. Karmayogi Vidyaniketan follows a strict zero-donation policy. All admissions are conducted purely on transparent, regulated norms without capitation charges."
      },
      {
        q: "Can school fees be paid online or in installments?",
        a: "Yes, fees can be paid via Net Banking, UPI (Google Pay, PhonePe, Paytm), or Demand Draft. Parents can also pay in convenient term installments."
      },
      {
        q: "What is the minimum age for Nursery and Grade 1?",
        a: "For Nursery, the child must be at least 3 years of age as of 31st December of the admission year. For Grade 1, the child must have completed 6 years of age."
      },
      {
        q: "Is school bus transport available for all areas in Pandharpur?",
        a: "Yes, our GPS-monitored fleet of yellow school buses with female escorts operates across Pandharpur town and surrounding rural routes."
      },
      {
        q: "What documents are required for mid-year transfer admissions?",
        a: "Original School Leaving / Transfer Certificate (TC) countersigned as required, previous school report card/marksheet, and student/parent Aadhaar cards."
      }
    ])

  return (
    <PageShell
      title="Admissions 2026–27"
      subtitle="Complete Guide to Admissions, Eligibility, Documents, Fee Structure & Online Application"
    >
      <div style={{ display: 'grid', gap: 40 }}>

        {/* ================= 1. ADMISSION OVERVIEW ================= */}
        <section
          id="overview"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 32px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              display: 'inline-block',
              background: '#e0f2fe',
              color: '#002855',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ACADEMIC YEAR 2026–27
            </span>
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700 }}>
              &bull; Admissions Open (Nursery to Grade 10)
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '28px', color: '#002855', margin: '0 0 14px', lineHeight: 1.3 }}>
            Welcoming Every Learner into the Karmayogi Family
          </h2>

          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: '0 0 24px', maxWidth: 900 }}>
            {admissionsData.intro_lead || DEFAULT_ADMISSIONS_DATA.intro_lead}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 28
          }}>
            {[
              { title: "Strict Zero-Donation", desc: "Purely transparent admission based on age and seat availability." },
              { title: "Dual Campuses", desc: "Isbavi Primary & Shelve High School campuses in Pandharpur." },
              { title: "Holistic Foundation", desc: "Classroom depth, AI/STEM robotics labs, and athletic coaching." },
              { title: "Safe Transportation", desc: "Serviced fleet of GPS buses covering city and surrounding rural routes." }
            ].map((feature, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 10, border: '1px solid #e2e8f0', borderLeft: '4px solid #002855' }}>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#002855', marginBottom: 4 }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              to="/admission-enquiry"
              className="btn btn-primary"
            >
              Fill Online Enquiry Form &rarr;
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('fees')}
              className="btn btn-secondary"
            >
              View Fee Structure
            </button>
          </div>
        </section>

        {/* ================= 2. 5-STEP ADMISSION PROCESS ================= */}
        <section
          id="process"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 30px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              STEP-BY-STEP ADMISSION PROCEDURE
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 10px' }}>
              5-Step Admission Journey
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: 750, margin: '0 auto' }}>
              {admissionsData.process_intro || DEFAULT_ADMISSIONS_DATA.process_intro}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {processSteps.map((step, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#002855', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: '16px' }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 3. ELIGIBILITY CRITERIA ================= */}
        <section
          id="eligibility"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 30px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              AGE CRITERIA &amp; GUIDELINES
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 8px' }}>
              Eligibility Criteria Across School Levels
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
              {admissionsData.eligibility_intro || DEFAULT_ADMISSIONS_DATA.eligibility_intro}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
            {eligibilityPrograms.map((prog, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0', borderTop: '4px solid #002855' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {prog.duration}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '6px 0 14px' }}>
                  {prog.degree}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.75 }}>
                  {prog.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. DOCUMENTS REQUIRED ================= */}
        <section
          id="documents"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 30px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              VERIFICATION CHECKLIST
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 8px' }}>
              Documents Required for Admission
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: 0 }}>
              {admissionsData.documents_intro || "Please bring original certificates for verification along with self-attested photocopies:"}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {documentsCategories.map((cat, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e0f2fe', color: '#002855', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon size={14} color="#002855" strokeWidth={2.8} />
                  </div>
                  <h3 style={{ fontSize: '16.5px', color: 'var(--navy-header)', margin: 0 }}>
                    {cat.title}
                  </h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                  {cat.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. FEE STRUCTURE ================= */}
        <section
          id="fees"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 30px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              AFFORDABLE &bull; TRANSPARENT &bull; NO DONATION
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 8px' }}>
              Fee Structure &amp; Guidelines
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
              {admissionsData.fees_intro || DEFAULT_ADMISSIONS_DATA.fees_intro}
            </p>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 620 }}>
              <thead>
                <tr style={{ background: '#002855', color: '#ffffff' }}>
                  <th style={{ padding: '14px 18px', fontSize: '14px' }}>Division / Class</th>
                  <th style={{ padding: '14px 18px', fontSize: '14px' }}>Tuition Component</th>
                  <th style={{ padding: '14px 18px', fontSize: '14px' }}>Activity &amp; Sports</th>
                  <th style={{ padding: '14px 18px', fontSize: '14px' }}>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {feesTable.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#002855', fontSize: '14.5px' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', fontSize: '14px' }}>
                      {row.tuition_fee}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', fontSize: '14px' }}>
                      {row.dev_fee}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#002855', fontWeight: 600, fontSize: '13.5px' }}>
                      {row.payable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Rules & Modes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16.5px', color: '#002855', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCardIcon size={18} color="#002855" /> Accepted Payment Modes
              </h3>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.75 }}>
                <li>Net Banking / NEFT / RTGS to official school bank account</li>
                <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
                <li>Demand Draft (DD) in favor of <em>"Karmayogi Vidyaniketan"</em> payable at Pandharpur</li>
                <li>Official school fee collection desk (Monday to Saturday)</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16.5px', color: '#002855', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarIcon size={18} color="#002855" /> Installment Facilities
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px' }}>
                To avoid financial burden on parents, fees can be deposited in convenient term installments:
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.75 }}>
                <li><strong>Term 1:</strong> At the time of enrollment / academic session commencement</li>
                <li><strong>Term 2:</strong> Mid-term installment following the Diwali vacation</li>
              </ul>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#64748b', marginTop: 18, lineHeight: 1.6, fontStyle: 'italic' }}>
            {admissionsData.fees_notes || DEFAULT_ADMISSIONS_DATA.fees_notes}
          </p>
        </section>

        {/* ================= ONLINE ADMISSION ENQUIRY CTA ================= */}
        <section
          style={{
            background: 'linear-gradient(135deg, #002855 0%, #001c3d 100%)',
            color: '#ffffff',
            borderRadius: 14,
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16,
            boxShadow: '0 10px 30px rgba(0, 40, 85, 0.15)'
          }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontSize: '11.5px',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: 20,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            ONLINE ADMISSION ENQUIRY
          </span>

          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '28px', color: '#ffffff', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>
            Ready to Apply for Academic Session 2026–27?
          </h2>

          <p style={{ fontSize: '15.5px', color: 'rgba(255, 255, 255, 0.88)', maxWidth: 680, margin: 0, lineHeight: 1.7 }}>
            Submit an online admission enquiry for Nursery to Grade 10. Our admissions desk will contact you within 24 hours with prospectus details, fee installment options, and campus tour guidance.
          </p>

          <div style={{ marginTop: 8, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/admission-enquiry"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#ffffff',
                color: '#002855',
                fontWeight: 700,
                fontSize: '15px',
                padding: '13px 30px',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4f8' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}
            >
              Fill Online Admission Enquiry Form &rarr;
            </Link>
          </div>
        </section>

        {/* ================= 6. ADMISSION FAQS ================= */}
        <section
          id="faqs"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '36px 30px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '1px' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', color: 'var(--navy-header)', margin: '6px 0 8px' }}>
              Admission FAQs
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: 0 }}>
              Find quick answers to common queries regarding admissions, fees, curriculum, and bus transport:
            </p>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {faqsList.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <h4 style={{ fontSize: '15.5px', color: '#002855', margin: 0, fontWeight: 700 }}>
                      {faq.q}
                    </h4>
                    <span style={{
                      fontSize: '18px',
                      color: '#002855',
                      fontWeight: 800,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#475569', lineHeight: 1.65, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ================= 8. HELPDESK & CAMPUS VISITS ================= */}
        <div style={{
          background: '#f8fafc',
          padding: '28px 30px',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#002855', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
              ADMISSION COUNSELING &amp; CAMPUS TOURS
            </div>
            <h3 style={{ fontSize: '19px', color: 'var(--navy-header)', margin: '0 0 6px' }}>
              Have Questions? Talk to our Admission Helpdesk
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Helplines: <strong>{admissionsData.helpdesk_phone || "+91-8459863477, +91-9527632033"}</strong> &bull; Email: <strong>{admissionsData.helpdesk_email || "vijaymadane3@gmail.com"}</strong>
              <br />
              Hours: Monday to Saturday: 8:00 AM – 2:00 PM (Sunday Closed)
            </p>
          </div>
          <Link to="/contact" className="btn btn-secondary">
            <span>Contact School Campuses &rarr;</span>
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
