import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { COLLEGE as DEFAULT_COLLEGE, SOCIAL_LINKS } from '../data/collegeData.js'
import { CollegeLogo, FounderPortrait } from './Logo.jsx'
import { settingsService, getCachedSettings } from '../services/endpoints.js'

function formatCollegeSettings(data) {
  if (!data || !data.college_name) return DEFAULT_COLLEGE
  return {
    ...DEFAULT_COLLEGE,
    foundation: data.foundation_name || DEFAULT_COLLEGE.foundation,
    name: data.college_name || DEFAULT_COLLEGE.name,
    phone: data.college_phone || data.phone || DEFAULT_COLLEGE.phone,
    email: data.college_email || data.email || DEFAULT_COLLEGE.email,
    address: data.college_address || data.address || DEFAULT_COLLEGE.address,
    trust_logo_url: null,
    college_logo_url: data.college_logo_url || null,
    founder_photo_url: data.founder_photo_url || null,
    founder_name: data.founder_name || DEFAULT_COLLEGE.founder_name,
    lines: [
      data.affiliation_line_1,
      data.affiliation_line_2,
      data.affiliation_line_3,
      data.affiliation_line_4,
      data.affiliation_line_5
    ].filter(Boolean).length > 0 ? [
      data.affiliation_line_1,
      data.affiliation_line_2,
      data.affiliation_line_3,
      data.affiliation_line_4,
      data.affiliation_line_5
    ].filter(Boolean) : DEFAULT_COLLEGE.lines
  }
}

export default function Header() {
  const [college, setCollege] = useState(() => {
    const cached = getCachedSettings()
    return cached ? formatCollegeSettings(cached) : DEFAULT_COLLEGE
  })

  useEffect(() => {
    settingsService.get().then(data => {
      if (data && data.college_name) {
        setCollege(formatCollegeSettings(data))
      }
    }).catch(() => {})
  }, [])

  return (
    <header className="site-header-wrapper">
      {/* 1. Top Utility Info Bar */}
      <div className="top-utility-bar">
        <div className="top-utility-container">
          <div className="top-utility-left">
            <span className="top-info-item">
              <svg className="top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{college.address}</span>
            </span>

            <span className="top-info-item">
              <svg className="top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${college.phone}`}>{college.phone}</a>
            </span>

            <span className="top-info-item">
              <svg className="top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${college.email}`}>{college.email}</a>
            </span>
          </div>

          <div className="top-utility-right">
            <div className="top-social-icons" aria-label="Social media links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Branding Header */}
      <div className="main-college-header">
        <div className="header-inner-grid">
          {/* Left: Logo */}
          <div className="header-brand-logo">
            <Link to="/" aria-label="Karmayogi Vidyaniketan Home">
              <CollegeLogo src={college.college_logo_url} />
            </Link>
          </div>

          {/* Center-Left: Foundation & School Name + Affiliation */}
          <div className="header-center-info">
            <div className="header-foundation-name">{college.foundation}</div>
            <h1 className="header-college-title">
              <Link to="/">{college.name}</Link>
            </h1>
            {college.subname && (
              <div className="header-school-subname" style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--gold, #c9a227)', letterSpacing: '0.6px', marginTop: '1px', marginBottom: '3px' }}>
                {college.subname}
              </div>
            )}
            <div className="header-affiliations">
              {college.lines.map((line, idx) => (
                <p key={idx} className="affiliation-line">{line}</p>
              ))}
            </div>
          </div>

          {/* Right: Founder Photo & Name */}
          <div className="header-founder-section">
            <div className="founder-card-wrap">
              <FounderPortrait src={college.founder_photo_url} />
              <div className="founder-caption-name">
                {college.founder_name && college.founder_name !== "स्व. सुधाकरपंत परिचारक" ? (
                  college.founder_name
                ) : (
                  <>
                    स्व. सुधाकरपंत
                    <br />
                    परिचारक
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
