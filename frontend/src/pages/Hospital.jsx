import React, { useState, useEffect } from 'react'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'

export default function Hospital() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    pagesService.getBySlug('hospital').then(setPage).catch(() => {})
  }, [])

  return (
    <PageShell title={page?.title || "Hospital & Clinical Facilities"} banner={page?.banner_url}>
      <div className="hospital-page-wrapper">
        {page?.content_html ? (
          <div dangerouslySetInnerHTML={{ __html: page.content_html }} />
        ) : (
          <div className="hospital-content-layout">
            <div className="hospital-lead-card">
              <p className="hospital-lead-text">
                The College of Physiotherapy is attached to the multi-speciality hospital of
                Shri Pandurang Pratishthan at Shelve, Pandharpur, providing students with direct, daily clinical exposure
                to inpatient and outpatient populations.
              </p>
            </div>

            {/* Clinical Highlights Strip */}
            <div className="hospital-stats-strip">
              <div className="hospital-stat-item">
                <div className="hospital-stat-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <div className="hospital-stat-title">Attached Hospital</div>
                  <div className="hospital-stat-sub">Shri Pandurang Pratishthan</div>
                </div>
              </div>

              <div className="hospital-stat-item">
                <div className="hospital-stat-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="hospital-stat-title">Clinical Postings</div>
                  <div className="hospital-stat-sub">Daily Inpatient & Outpatient Rotations</div>
                </div>
              </div>

              <div className="hospital-stat-item">
                <div className="hospital-stat-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="hospital-stat-title">Multi-Disciplinary Care</div>
                  <div className="hospital-stat-sub">6 Core Specialty Clinical Wards</div>
                </div>
              </div>
            </div>

            {/* OPD and Clinical Training Cards */}
            <div className="hospital-grid-2">
              <div className="hospital-feature-card">
                <div className="hospital-card-header">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 id="opd" className="hospital-card-title">Physiotherapy OPD</h3>
                </div>
                <p className="hospital-card-body">
                  The outpatient department caters to hundreds of patients every month with musculoskeletal pain,
                  sports injuries, neurological deficits and post-surgical rehabilitation needs. OPD services
                  include electrotherapy, manual therapy, therapeutic exercise and ergonomic counseling.
                </p>
              </div>

              <div className="hospital-feature-card">
                <div className="hospital-card-header">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                  <h3 id="clinical" className="hospital-card-title">Clinical Training</h3>
                </div>
                <p className="hospital-card-body">
                  Students rotate through major clinical wards: orthopaedics, general surgery, medicine,
                  paediatrics, intensive care unit (ICU) and the burns ward, under the direct supervision of
                  clinical faculty.
                </p>
              </div>
            </div>

            {/* Hospital Clinical Departments */}
            <div className="hospital-dept-card">
              <div className="hospital-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <h3 id="departments" className="hospital-card-title">Hospital Clinical Departments</h3>
              </div>
              <ul className="hospital-dept-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Orthopaedic &amp; Joint Replacement Ward
                </li>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Neurology &amp; Neurosurgery Ward
                </li>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Cardio-Thoracic &amp; ICU Care Unit
                </li>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Paediatric &amp; Neonatal Care
                </li>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Obstetrics &amp; Gynaecology Postings
                </li>
                <li className="hospital-dept-badge">
                  <span className="hospital-dept-dot"></span>
                  Outreach &amp; Community Camps
                </li>
              </ul>
            </div>

            {/* Patient Services */}
            <div className="hospital-feature-card">
              <div className="hospital-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <h3 id="patient" className="hospital-card-title">Patient Services</h3>
              </div>
              <p className="hospital-card-body">
                The physiotherapy department provides accessible, affordable rehabilitation services to the
                rural and semi-urban population of Pandharpur, Solapur and surrounding districts.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
