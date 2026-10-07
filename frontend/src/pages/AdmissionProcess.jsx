import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { DEFAULT_ADMISSIONS_DATA, COLLEGE } from '../data/collegeData.js'

export default function AdmissionProcess() {
  return (
    <PageShell title="Admission Process &amp; Guidelines" subtitle="Step-by-Step Procedure, Eligibility &amp; Document Checklist | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 40 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Welcoming Every Learner into the Karmayogi Family
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            Admission to Karmayogi Vidyaniketan / Karmayogi Public School is open to all students irrespective of caste, creed, or background, based on seat availability and age criteria. Our process is designed to be transparent, friendly, and non-intimidating for children and parents alike.
          </p>
        </div>

        {/* 5-Step Process Visual Flow */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 24, textAlign: 'center' }}>
            5-Step Step-by-Step Admission Journey
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              {
                step: "1",
                title: "Enquiry & Registration",
                desc: "Fill the online admission enquiry form or visit our school offices at Isbavi (Primary) or Shelve (High School) to collect the school prospectus and brochure."
              },
              {
                step: "2",
                title: "Application Submission",
                desc: "Submit the duly completed admission registration form along with child photographs, parents' ID proofs, and previous school academic records."
              },
              {
                step: "3",
                title: "Document Verification",
                desc: "Our admissions office verifies original birth certificates, transfer certificates (TC), Aadhaar cards, and past academic progress reports."
              },
              {
                step: "4",
                title: "Interaction / Assessment",
                desc: "An informal, encouraging interaction for pre-primary children or a foundational readiness assessment for primary/secondary applicants."
              },
              {
                step: "5",
                title: "Seat Confirmation & Enrollment",
                desc: "Upon selection, complete fee payment and admission confirmation to receive the official school roll number, uniform kit, and booklist."
              }
            ].map((s, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy-header)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--navy-header)', margin: '0 0 8px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility Details */}
        <section id="eligibility" style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 20 }}>
            Age Criteria &amp; Eligibility Guidelines
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {DEFAULT_ADMISSIONS_DATA.eligibility_programs.map((prog, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 22, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue-vibrant)', textTransform: 'uppercase' }}>
                  {prog.duration}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '4px 0 12px' }}>
                  {prog.degree}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: '#475569', lineHeight: 1.65 }}>
                  {prog.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Required Documents */}
        <section id="documents" style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 12 }}>
            Mandatory Documents Checklist
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginBottom: 22 }}>
            Please carry original documents for verification along with 2 self-attested copies:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {DEFAULT_ADMISSIONS_DATA.documents_categories.map((cat, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
                  {cat.title}
                </h3>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  {cat.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div style={{ background: 'var(--navy-header)', color: '#ffffff', padding: 32, borderRadius: 12, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: '#ffffff', margin: '0 0 10px' }}>
            Ready to Begin Your Child's Learning Journey?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: 600, margin: '0 auto 22px' }}>
            Visit our admissions desk or apply online today. Our team is delighted to assist you.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admissions#apply" className="btn btn-primary" style={{ background: 'var(--blue-royal)', borderColor: 'var(--blue-royal)' }}>
              Apply for Admission →
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.6)' }}>
              Visit Campuses
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
