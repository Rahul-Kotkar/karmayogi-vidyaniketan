import React from 'react'
import { Link } from 'react-router-dom'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

// Known parent path mapping for automatic clean breadcrumb hierarchy
const PARENT_ROUTE_MAP = {
  'training & placement': '/training-placement',
  'placement': '/training-placement',
  'academics': '/academics',
  'research & development': '/research',
  'research': '/research',
  'facilities': '/facilities',
  'campus facilities': '/facilities',
  'committees': '/committees',
  'mandatory disclosures': '/mandatory-disclosures',
  'disclosures': '/mandatory-disclosures',
  'iqac': '/iqac-naac',
  'iqac & naac': '/iqac-naac',
  'student corner': '/student-corner'
}

export default function PageShell({
  title,
  subtitle,
  badge,
  banner,
  hideHero = false,
  hideTitle = false,
  breadcrumbs,
  actions,
  children
}) {
  const showHero = !hideHero && !hideTitle && Boolean(title)

  // Determine breadcrumb hierarchy
  let resolvedCrumbs = []
  let currentCrumbLabel = title || 'Page'

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    resolvedCrumbs = breadcrumbs
  } else if (title && title.includes(' — ')) {
    const parts = title.split(' — ')
    const subLabel = parts[0].trim()
    const parentLabel = parts[1].trim()
    const parentKey = parentLabel.toLowerCase()
    const parentPath = PARENT_ROUTE_MAP[parentKey] || null

    if (parentPath) {
      resolvedCrumbs.push({ label: parentLabel, path: parentPath })
    } else {
      resolvedCrumbs.push({ label: parentLabel })
    }
    currentCrumbLabel = subLabel
  }

  const heroStyle = {}
  if (banner) {
    const resolvedBanner = resolveMediaUrl(banner)
    heroStyle.backgroundImage = `linear-gradient(135deg, rgba(4, 18, 36, 0.92) 0%, rgba(7, 59, 115, 0.88) 60%, rgba(10, 45, 92, 0.85) 100%), url("${resolvedBanner}")`
    heroStyle.backgroundSize = 'cover'
    heroStyle.backgroundPosition = 'center'
  }

  return (
    <main id="main" className="page-shell-main">
      {showHero ? (
        <section className="page-institutional-hero" style={heroStyle}>
          <div className="container page-hero-container">
            {/* Breadcrumb Strip */}
            <nav className="page-hero-breadcrumbs" aria-label="Breadcrumb">
              <ol className="hero-breadcrumb-list">
                <li className="hero-breadcrumb-item">
                  <Link to="/" className="hero-breadcrumb-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 5, verticalAlign: 'middle' }}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                  </Link>
                </li>
                {resolvedCrumbs.map((c, idx) => (
                  <React.Fragment key={idx}>
                    <li className="hero-breadcrumb-sep" aria-hidden="true">/</li>
                    <li className="hero-breadcrumb-item">
                      {c.path ? (
                        <Link to={c.path} className="hero-breadcrumb-link">{c.label}</Link>
                      ) : (
                        <span className="hero-breadcrumb-static">{c.label}</span>
                      )}
                    </li>
                  </React.Fragment>
                ))}
                <li className="hero-breadcrumb-sep" aria-hidden="true">/</li>
                <li className="hero-breadcrumb-item active" aria-current="page">
                  <span className="hero-breadcrumb-current">{currentCrumbLabel}</span>
                </li>
              </ol>
            </nav>

            {/* Hero Main Header */}
            <div className="page-hero-header-content">
              <h1 className="page-hero-title">{title}</h1>
              {actions && <div className="page-hero-actions">{actions}</div>}
            </div>
          </div>
          <div className="page-hero-gold-accent-bar" aria-hidden="true"></div>
        </section>
      ) : (
        <div className="page-breadcrumb-bar">
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{title}</span>
            </nav>
          </div>
        </div>
      )}

      {/* Main Page Canvas */}
      <div className="page-content-wrap">
        <div className="container prose page-content-container">
          {children}
        </div>
      </div>
    </main>
  )
}
