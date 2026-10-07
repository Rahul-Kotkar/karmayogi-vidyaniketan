import React from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { DEFAULT_ADMISSIONS_DATA, COLLEGE } from '../data/collegeData.js'

export default function FeeStructure() {
  return (
    <PageShell title="Fee Structure &amp; Guidelines" subtitle="Affordable, Transparent &amp; Regulated School Fees | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Transparent Fee Policy
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            In keeping with the philanthropic mission of Shri Pandurang Pratishthan, Karmayogi Vidyaniketan maintains an affordable, transparent fee structure for all classes from Nursery to Grade 10. The school operates with zero capitation fees, no hidden charges, and convenient installment payment options for parents.
          </p>
        </div>

        {/* Fee Categories Table */}
        <section style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 18 }}>
            Fee Overview by Academic Division
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--navy-header)', color: '#ffffff' }}>
                  <th style={{ padding: '14px 16px', fontSize: '14px' }}>Division / Class</th>
                  <th style={{ padding: '14px 16px', fontSize: '14px' }}>Tuition Component</th>
                  <th style={{ padding: '14px 16px', fontSize: '14px' }}>Activity &amp; Sports</th>
                  <th style={{ padding: '14px 16px', fontSize: '14px' }}>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_ADMISSIONS_DATA.fees_table.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--navy-header)', fontSize: '14.5px' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontSize: '14px' }}>
                      {row.tuition_fee}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontSize: '14px' }}>
                      {row.dev_fee}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0284c7', fontWeight: 600, fontSize: '13.5px' }}>
                      {row.payable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
            * Detailed fee circulars, uniform kits, book costs, and bus route tariffs are specified in the official school prospectus available at the school admission counter.
          </p>
        </section>

        {/* Payment Rules & Modes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#f8fafc', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
              Accepted Payment Modes
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.75 }}>
              <li>Net Banking / NEFT / RTGS to official school bank account</li>
              <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
              <li>Demand Draft (DD) in favor of <em>"Karmayogi Vidyaniketan"</em> payable at Pandharpur</li>
              <li>Official school fee collection counter (Monday to Saturday)</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: 24, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--navy-header)', margin: '0 0 10px' }}>
              Installment Facilities
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
              To ensure zero financial stress on parents, annual school fees can be paid in convenient term installments:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '13.5px', color: '#475569', lineHeight: 1.7 }}>
              <li><strong>Term 1:</strong> At the time of admission / session commencement</li>
              <li><strong>Term 2:</strong> Mid-term post Diwali break</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <section id="faqs" style={{ background: '#ffffff', borderRadius: 12, padding: '36px 30px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', marginBottom: 20 }}>
            Frequently Asked Questions (FAQs)
          </h2>

          <div style={{ display: 'grid', gap: 16 }}>
            {[
              {
                q: "Is there any donation or capitation fee for admission?",
                a: "Absolutely not. Karmayogi Vidyaniketan has a strict zero-donation policy. All admissions are conducted fairly without any capitation charges."
              },
              {
                q: "Are hostel and transportation charges included in the tuition fee?",
                a: "No, hostel residential facilities and school bus transportation are optional services availed according to parent requirements, with separate subsidized charges."
              },
              {
                q: "What boards does the school follow?",
                a: "Karmayogi Vidyaniketan offers both CBSE and Maharashtra State Board curriculum tracks from foundational grades through Grade 10."
              },
              {
                q: "What are the school working and office hours?",
                a: "The school administrative and admission office operates Monday to Saturday from 8:00 AM to 2:00 PM (Closed on Sundays)."
              }
            ].map((faq, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: 18, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '15px', color: 'var(--navy-header)', display: 'block', marginBottom: 6 }}>
                  Q: {faq.q}
                </strong>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/admissions" className="btn btn-primary">Proceed to Admission Enquiry &rarr;</Link>
        </div>

      </div>
    </PageShell>
  )
}
