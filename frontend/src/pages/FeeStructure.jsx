import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { Link } from 'react-router-dom'
import { DEFAULT_ADMISSIONS_DATA, COLLEGE } from '../data/collegeData.js'
import { pagesService, getCachedAdmissionsData } from '../services/endpoints.js'

export default function FeeStructure() {
  const [data, setData] = useState(() => getCachedAdmissionsData() || DEFAULT_ADMISSIONS_DATA)

  const loadData = () => {
    pagesService.getBySlug('admissions').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          setData(prev => ({ ...prev, ...parsed }))
        } catch {}
      }
    }).catch(() => {})
  }

  useEffect(() => {
    loadData()
    const handleUpdated = (e) => {
      if (e?.detail?.content_html) {
        try {
          const parsed = JSON.parse(e.detail.content_html)
          setData(prev => ({ ...prev, ...parsed }))
        } catch {}
      } else {
        loadData()
      }
    }
    window.addEventListener('page_admissions_updated', handleUpdated)
    return () => window.removeEventListener('page_admissions_updated', handleUpdated)
  }, [])

  const feesTable = (Array.isArray(data.fees_table) && data.fees_table.length > 0)
    ? data.fees_table
    : DEFAULT_ADMISSIONS_DATA.fees_table

  const feesIntro = data.fees_intro || "In keeping with the philanthropic mission of Shri Pandurang Pratishthan, Karmayogi Vidyaniketan maintains an affordable, transparent fee structure for all classes from Nursery to Grade 10. The school operates with zero capitation fees, no hidden charges, and convenient installment payment options for parents."
  const feesNotes = data.fees_notes || "* Detailed fee circulars, uniform kits, book costs, and bus route tariffs are specified in the official school prospectus available at the school admission counter."

  return (
    <PageShell title="Fee Structure &amp; Guidelines" subtitle="Affordable, Transparent &amp; Regulated School Fees | Karmayogi Vidyaniketan">
      <div style={{ display: 'grid', gap: 36 }}>

        {/* Intro */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', color: 'var(--navy-header)', margin: '0 0 12px' }}>
            Transparent Fee Policy
          </h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>
            {feesIntro}
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
                {feesTable.map((row, idx) => (
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

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {feesNotes}
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
                a: "No. Karmayogi Vidyaniketan follows a strict zero-donation policy. All admissions are conducted purely on transparent, regulated norms."
              },
              {
                q: "Can school fees be paid online?",
                a: "Yes, parents can pay conveniently via UPI, NEFT/RTGS, or net banking directly into the official school account."
              },
              {
                q: "Are bus transport charges included in the tuition fee?",
                a: "No, school bus transportation fees are calculated separately based on the specific route and distance from student pickup point."
              }
            ].map((faq, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '15.5px', color: 'var(--navy-header)', margin: '0 0 6px' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/admissions#apply" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            Apply for Admission Now &rarr;
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
