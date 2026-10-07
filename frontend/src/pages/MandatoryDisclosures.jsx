import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService, getCachedDisclosuresData, setCachedDisclosuresData } from '../services/endpoints.js'
import { DEFAULT_MANDATORY_DISCLOSURES } from '../data/collegeData.js'

const DISCLOSURES_SUBMENUS = [
  { label: "MUHS Mandated Disclosures", slug: "muhs", path: "/mandatory-disclosures/muhs", desc: "MUHS university affiliation orders, sanctioned annual intake capacity, and inspection compliance." },
  { label: "Institutional Policies", slug: "policies", path: "/mandatory-disclosures/policies", desc: "Code of conduct for students and staff, anti-ragging policies, POSH/ICC, and grievance bylaws." },
  { label: "Government Approvals", slug: "approvals", path: "/mandatory-disclosures/approvals", desc: "Government of Maharashtra gazette notifications, DMER Mumbai orders, and UGC Section 2(f) certificates." },
  { label: "Annual Financial Audit", slug: "reports", path: "/mandatory-disclosures/reports", desc: "Annual audited financial balance sheets, Fee Regulating Authority (FRA) audits, and compliance reports." }
]

function getInitialData() {
  const cached = getCachedDisclosuresData()
  if (cached && typeof cached === 'object') {
    return {
      ...DEFAULT_MANDATORY_DISCLOSURES,
      ...cached,
      muhs: Array.isArray(cached.muhs) && cached.muhs.length > 0 ? cached.muhs : DEFAULT_MANDATORY_DISCLOSURES.muhs,
      policies: Array.isArray(cached.policies) && cached.policies.length > 0 ? cached.policies : DEFAULT_MANDATORY_DISCLOSURES.policies,
      approvals: Array.isArray(cached.approvals) && cached.approvals.length > 0 ? cached.approvals : DEFAULT_MANDATORY_DISCLOSURES.approvals,
      reports: Array.isArray(cached.reports) && cached.reports.length > 0 ? cached.reports : DEFAULT_MANDATORY_DISCLOSURES.reports
    }
  }
  return DEFAULT_MANDATORY_DISCLOSURES
}

export default function MandatoryDisclosures() {
  const { subpage } = useParams()
  const [data, setData] = useState(getInitialData)
  const [page, setPage] = useState(null)

  useEffect(() => {
    pagesService.getBySlug('mandatory-disclosures').then(res => {
      setPage(res)
      if (res && res.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (parsed && typeof parsed === 'object') {
            setData(prev => {
              const updated = {
                ...prev,
                ...parsed,
                muhs: Array.isArray(parsed.muhs) && parsed.muhs.length > 0 ? parsed.muhs : prev.muhs,
                policies: Array.isArray(parsed.policies) && parsed.policies.length > 0 ? parsed.policies : prev.policies,
                approvals: Array.isArray(parsed.approvals) && parsed.approvals.length > 0 ? parsed.approvals : prev.approvals,
                reports: Array.isArray(parsed.reports) && parsed.reports.length > 0 ? parsed.reports : prev.reports
              }
              setCachedDisclosuresData(updated)
              return updated
            })
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  // Normalize subpage slug
  let currentSlug = (subpage || '').toLowerCase().trim()
  if (currentSlug === 'audit') currentSlug = 'reports'

  const activeSubmenu = DISCLOSURES_SUBMENUS.find(s => s.slug === currentSlug)

  // Instant scroll to top on subpage change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [currentSlug])

  // Sort MUHS mandates by Academic Year in descending chronological order
  const sortedMuhsYears = [...(data.muhs || [])].sort((a, b) => {
    const valA = parseInt(String(a.year).match(/\d{4}/)?.[0] || '0', 10)
    const valB = parseInt(String(b.year).match(/\d{4}/)?.[0] || '0', 10)
    return valB - valA
  })

  const pageTitle = activeSubmenu ? `${activeSubmenu.label} — Mandatory Disclosures` : "Mandatory Disclosures"

  return (
    <PageShell title={pageTitle} banner={page?.banner_url}>
      <div className="disclosures-page-wrapper">

        {/* ========================================================
            CASE 1: OVERVIEW HUB (/mandatory-disclosures)
            ======================================================== */}
        {!currentSlug && (
          <div className="disclosures-overview-hub">
            <div className="academics-intro-block">
              <h1 className="academics-page-title">Statutory Mandatory Disclosures & Public Compliance</h1>
              <p className="academics-page-lead">
                In strict adherence to statutory regulatory mandates issued by Maharashtra University of Health Sciences (MUHS),
                the Directorate of Medical Education and Research (DMER), Mumbai, UGC, and the Government of Maharashtra,
                the following institutional documentation, affiliations, and audit reports are placed in the public domain.
              </p>
            </div>

            <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>Statutory Compliance Portals</h2>
            <div className="submenu-overview-grid">
              {DISCLOSURES_SUBMENUS.map((item, idx) => (
                <article key={item.slug} className="submenu-overview-card">
                  <div>
                    <div className="submenu-card-header">
                      <span className="submenu-card-badge">{idx + 1}</span>
                      <h3 className="submenu-card-title">{item.label}</h3>
                    </div>
                    <p className="submenu-card-desc">{item.desc}</p>
                  </div>
                  <Link to={item.path} className="submenu-card-btn">
                    View {item.label} Documents →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMENU 1: MUHS DISCLOSURES (/mandatory-disclosures/muhs)
            Minimal, Year-Wise Sorted Tables with: Sr. No | Title | View PDF
            ======================================================== */}
        {currentSlug === 'muhs' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">MUHS Mandated Institutional Disclosures</h1>
              </div>
            </div>

            <p className="academics-section-intro" style={{ marginBottom: 28 }}>
              Official university disclosure compendium in compliance with Maharashtra University of Health Sciences (MUHS), Nashik guidelines.
            </p>

            {sortedMuhsYears.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', color: '#64748b' }}>
                No mandatory disclosure documents published yet.
              </div>
            ) : (
              sortedMuhsYears.map((yearGroup, yIdx) => {
                const docs = Array.isArray(yearGroup.documents) ? yearGroup.documents : []
                return (
                  <div key={yearGroup.year || yIdx} className="muhs-year-block" style={{ marginBottom: 32 }}>
                    {/* Minimal Academic Year Header */}
                    <div
                      className="muhs-year-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        background: '#0b2545',
                        color: '#ffffff',
                        borderRadius: '8px 8px 0 0',
                        fontWeight: 700,
                        fontSize: 15
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Academic Year: {yearGroup.year}</span>
                      </div>
                      <span className="muhs-year-count" style={{ fontSize: 12.5, fontWeight: 500, color: '#93c5fd' }}>
                        {docs.length} {docs.length === 1 ? 'Mandate' : 'Mandates'}
                      </span>
                    </div>

                    {/* Minimal Table: Sr. No | Title | View PDF */}
                    <div className="academics-table-wrapper" style={{ margin: 0, borderRadius: '0 0 8px 8px', borderTop: 'none' }}>
                      <table className="academics-table muhs-mandate-table" style={{ margin: 0 }}>
                        <thead>
                          <tr>
                            <th style={{ width: '12%', textAlign: 'center' }}>Sr. No.</th>
                            <th style={{ width: '66%' }}>Title</th>
                            <th style={{ width: '22%', textAlign: 'center' }}>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docs.length === 0 ? (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                                No mandate documents uploaded for Academic Year {yearGroup.year}.
                              </td>
                            </tr>
                          ) : (
                            docs.map((doc, idx) => (
                              <tr key={doc.id || idx}>
                                <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                                  {idx + 1}
                                </td>
                                <td className="muhs-doc-title" style={{ fontWeight: 600, color: '#1e293b' }}>
                                  {doc.title}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {doc.file_url ? (
                                    <a
                                      href={doc.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="academics-doc-btn muhs-doc-btn"
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                      </svg>
                                      View PDF
                                    </a>
                                  ) : (
                                    <span
                                      className="academics-doc-btn muhs-doc-btn"
                                      style={{ opacity: 0.75, cursor: 'pointer' }}
                                      onClick={() => alert(`Document "${doc.title}" for A.Y. ${yearGroup.year} is on file at the college administrative office.`)}
                                      title="Click to view file status"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                      </svg>
                                      View PDF
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })
            )}
          </section>
        )}

        {/* ========================================================
            SUBMENU 2: POLICIES (/mandatory-disclosures/policies)
            ======================================================== */}
        {currentSlug === 'policies' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Institutional Policies & Code of Conduct</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Codified operational and ethical bylaws governing student discipline, professional ethics, workplace harassment prevention, and academic integrity.
            </p>

            <div className="disclosures-policies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {(data.policies || []).map((pol, idx) => (
                <div key={pol.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-header)', margin: '0 0 6px' }}>
                    {pol.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
                    {pol.desc}
                  </p>
                  {pol.file_url ? (
                    <a
                      href={pol.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="academics-doc-btn"
                      style={{ fontSize: 12, textDecoration: 'none', display: 'inline-block' }}
                    >
                      Policy PDF ↓
                    </a>
                  ) : (
                    <span className="academics-doc-btn" style={{ fontSize: 12, opacity: 0.8, cursor: 'default' }}>
                      Policy PDF ↓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 3: GOVERNMENT APPROVALS (/mandatory-disclosures/approvals)
            ======================================================== */}
        {currentSlug === 'approvals' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Government Approvals & Regulatory Orders</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Official approval documents validating the establishment, course sanction, and university recognition of the college.
            </p>

            {/* Desktop Table View (> 768px) */}
            <div className="academics-table-wrapper approvals-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%', textAlign: 'center' }}>Sr.</th>
                    <th style={{ width: '38%' }}>Approving Authority</th>
                    <th style={{ width: '36%' }}>Notification / Order Details</th>
                    <th style={{ width: '18%', textAlign: 'center' }}>View Document</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.approvals || []).map((appr, idx) => (
                    <tr key={appr.id || idx}>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                      <td><strong>{appr.authority}</strong></td>
                      <td>{appr.title}</td>
                      <td style={{ textAlign: 'center' }}>
                        {appr.file_url ? (
                          <a
                            href={appr.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="academics-doc-btn"
                            style={{ fontSize: 12, textDecoration: 'none' }}
                          >
                            View Order ↓
                          </a>
                        ) : (
                          <span className="academics-doc-btn" style={{ fontSize: 12, opacity: 0.8 }}>
                            Order PDF ↓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (<= 768px) */}
            <div className="approvals-mobile-cards">
              {(data.approvals || []).map((appr, idx) => (
                <div key={appr.id || idx} className="approval-card">
                  <div className="approval-card-head">
                    <span className="approval-sr-badge">#{idx + 1}</span>
                    <strong className="approval-authority">{appr.authority}</strong>
                  </div>
                  <p className="approval-title">{appr.title}</p>
                  <div className="approval-card-foot">
                    {appr.file_url ? (
                      <a
                        href={appr.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="academics-doc-btn"
                        style={{ fontSize: 11, padding: '5px 12px', textDecoration: 'none' }}
                      >
                        View Order ↓
                      </a>
                    ) : (
                      <span className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px', opacity: 0.8 }}>
                        Order PDF ↓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            SUBMENU 4: REPORTS & FINANCIAL AUDIT (/mandatory-disclosures/reports)
            ======================================================== */}
        {currentSlug === 'reports' && (
          <section className="academics-section">
            <div className="academics-section-header">
              <div>
                <h1 className="academics-section-title">Annual Financial Audit & Compliance Reports</h1>
              </div>
            </div>

            <p className="academics-section-intro">
              Certified chartered accountant financial statements, balance sheets, and Fee Regulating Authority (FRA) disclosures.
            </p>

            {/* Desktop Table View (> 768px) */}
            <div className="academics-table-wrapper financial-reports-desktop-view">
              <table className="academics-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Financial Year</th>
                    <th style={{ width: '45%' }}>Financial Statement / Report Type</th>
                    <th style={{ width: '20%' }}>Audit Status</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.reports || []).map((rep, idx) => (
                    <tr key={rep.id || idx}>
                      <td><strong>{rep.year}</strong></td>
                      <td>{rep.title}</td>
                      <td>
                        <span className="academics-badge academics-badge-blue">
                          {rep.status || 'Audited'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {rep.file_url ? (
                          <a
                            href={rep.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="academics-doc-btn"
                            style={{ fontSize: 12, textDecoration: 'none' }}
                          >
                            Download PDF ↓
                          </a>
                        ) : (
                          <span className="academics-doc-btn" style={{ fontSize: 12, opacity: 0.8 }}>
                            Report PDF ↓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (<= 768px) */}
            <div className="financial-reports-mobile-cards">
              {(data.reports || []).map((rep, idx) => (
                <div key={rep.id || idx} className="financial-report-card">
                  <div className="financial-report-card-head">
                    <strong className="financial-report-year">{rep.year}</strong>
                    <span className="academics-badge academics-badge-blue">{rep.status || 'Audited'}</span>
                  </div>
                  <p className="financial-report-title">{rep.title}</p>
                  <div className="financial-report-card-foot">
                    {rep.file_url ? (
                      <a
                        href={rep.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="academics-doc-btn"
                        style={{ fontSize: 11, padding: '5px 12px', textDecoration: 'none' }}
                      >
                        Download PDF ↓
                      </a>
                    ) : (
                      <span className="academics-doc-btn" style={{ fontSize: 11, padding: '5px 12px', opacity: 0.8 }}>
                        Report PDF ↓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageShell>
  )
}
