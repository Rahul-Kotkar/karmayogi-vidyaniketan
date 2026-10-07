import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ROW_1_NAV, ROW_2_NAV, COLLEGE } from '../data/collegeData.js'
import { CollegeLogo } from './Logo.jsx'
import { getCachedCommitteesData, getCachedNavVisibility, pagesService, settingsService, getCachedSettings } from '../services/endpoints.js'

const NAV_ICONS = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  about: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  academics: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  admissions: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  ),
  departments: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  faculty: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  facilities: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7v14M21 7v14M6 21V11M10 21V11M14 21V11M18 21V11M12 3l10 4H2l10-4z" />
    </svg>
  ),
  'student-corner': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  research: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31L4.36 21h15.28L14 9.31V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  placement: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  committees: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  'iqac-naac': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  'mandatory-disclosures': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  gallery: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  notices: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  news: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M18 10h-8M18 6h-8" />
    </svg>
  ),
  events: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  contact: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export default function Navbar2Row() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState({})
  const [dynamicCommittees, setDynamicCommittees] = useState(() => getCachedCommitteesData() || null)
  const [navVisibility, setNavVisibility] = useState(() => getCachedNavVisibility() || { hiddenMenus: [], hiddenSubmenus: {} })
  const [collegeSettings, setCollegeSettings] = useState(() => getCachedSettings() || null)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Helper visibility checks
  const isMenuVisible = (menuLabel) => {
    if (!navVisibility || !Array.isArray(navVisibility.hiddenMenus)) return true
    return !navVisibility.hiddenMenus.includes(menuLabel)
  }

  const isSubmenuVisible = (menuLabel, child) => {
    if (!navVisibility || !navVisibility.hiddenSubmenus) return true
    const hiddenList = navVisibility.hiddenSubmenus[menuLabel]
    if (!Array.isArray(hiddenList) || hiddenList.length === 0) return true
    const childKey = child.path || child.slug || child.label
    return !hiddenList.includes(childKey) && !hiddenList.includes(child.label) && !hiddenList.includes(child.path)
  }

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }, [location.pathname])

  // Track window scroll for sticky mobile header branding
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Manage body scroll and Escape key when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Load live dynamic committees and navigation visibility
  useEffect(() => {
    pagesService.getBySlug('committees').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDynamicCommittees(parsed)
          }
        } catch {}
      }
    }).catch(() => {})

    pagesService.getBySlug('navigation_visibility').then(page => {
      if (page && page.content_html) {
        try {
          const parsed = JSON.parse(page.content_html)
          if (parsed && typeof parsed === 'object') {
            setNavVisibility(parsed)
          }
        } catch {}
      }
    }).catch(() => {})

    settingsService.get().then(data => {
      if (data) setCollegeSettings(data)
    }).catch(() => {})

    const handleVisibilityUpdate = (e) => {
      if (e.detail) setNavVisibility(e.detail)
    }
    const handleStorageUpdate = (e) => {
      if (e.key === 'cop_cache_nav_visibility') {
        try {
          const val = JSON.parse(e.newValue)
          if (val) setNavVisibility(val)
        } catch {}
      }
    }
    window.addEventListener('nav_visibility_updated', handleVisibilityUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    return () => {
      window.removeEventListener('nav_visibility_updated', handleVisibilityUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  const toggleMobileGroup = (groupKey) => {
    setMobileExpanded(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  const handleNavClick = (path) => {
    setMobileOpen(false)
    setActiveDropdown(null)
    if (!path || !path.includes('#')) {
      const html = document.documentElement
      const prevBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      } catch {
        window.scrollTo(0, 0)
      }
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevBehavior || ''
      })
    }
  }

  // Unified Mobile Navigation Sequence (All menus visible in proper academic sequence)
  const mobileNavItems = [
    {
      key: 'home',
      label: 'Home',
      path: '/',
      exact: true
    },
    {
      key: 'about',
      label: 'About Us',
      path: '/about'
    },
    {
      key: 'academics',
      label: 'Academics',
      path: '/academics/subjects',
      children: ROW_2_NAV.find(i => i.label === 'ACADEMICS')?.children || []
    },
    {
      key: 'admissions',
      label: 'Admissions',
      path: '/admissions'
    },
    {
      key: 'departments',
      label: 'Departments',
      path: '/departments'
    },
    {
      key: 'faculty',
      label: 'Faculty',
      path: '/faculty'
    },
    {
      key: 'facilities',
      label: 'Facilities',
      path: '/facilities',
      children: [
        { label: 'All Facilities Overview', path: '/facilities' },
        ...(ROW_2_NAV.find(i => i.label === 'FACILITIES')?.children || [])
      ]
    },
    {
      key: 'student-corner',
      label: 'Student Corner',
      path: '/student-corner',
      children: [
        { label: 'Student Corner Overview', path: '/student-corner' },
        ...(ROW_2_NAV.find(i => i.label === 'STUDENT CORNER')?.children || [])
      ]
    },
    {
      key: 'research',
      label: 'Research',
      path: '/research',
      children: [
        { label: 'Research Overview', path: '/research/overview' },
        ...(ROW_2_NAV.find(i => i.label === 'RESEARCH')?.children || []).filter(c => c.slug !== 'overview')
      ]
    },
    {
      key: 'placement',
      label: 'Placement',
      path: '/training-placement'
    },
    {
      key: 'committees',
      label: 'Committees',
      path: '/committees',
      children: dynamicCommittees && dynamicCommittees.length > 0 ? [
        { label: 'Overview of Committees', path: '/committees' },
        ...dynamicCommittees.map(c => ({
          label: c.name,
          path: `/committees/${c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        }))
      ] : (ROW_2_NAV.find(i => i.label === 'COMMITTEES')?.children || [
        { label: 'Overview of Committees', path: '/committees' }
      ])
    },
    {
      key: 'iqac-naac',
      label: 'IQAC / NAAC',
      path: '/iqac-naac',
      children: [
        { label: 'IQAC / NAAC Overview', path: '/iqac-naac' },
        ...(ROW_2_NAV.find(i => i.label === 'IQAC / NAAC')?.children || [])
      ]
    },
    {
      key: 'mandatory-disclosures',
      label: 'Mandatory Disclosures',
      path: '/mandatory-disclosures',
      children: [
        { label: 'Disclosures Overview', path: '/mandatory-disclosures' },
        ...(ROW_2_NAV.find(i => i.label === 'MANDATORY DISCLOSURES')?.children || [])
      ]
    },
    {
      key: 'gallery',
      label: 'Photo Gallery',
      path: '/gallery'
    },
    {
      key: 'notices',
      label: 'Notices',
      path: '/notices'
    },
    {
      key: 'news',
      label: 'News',
      path: '/news'
    },
    {
      key: 'events',
      label: 'Events',
      path: '/events'
    },
    {
      key: 'contact',
      label: 'Contact Us',
      path: '/contact'
    }
  ]

  const ROW2_KEY_TO_LABEL = {
    'academics': 'ACADEMICS',
    'departments': 'DEPARTMENTS',
    'facilities': 'FACILITIES',
    'student-corner': 'STUDENT CORNER',
    'research': 'RESEARCH',
    'placement': 'PLACEMENT',
    'committees': 'COMMITTEES',
    'iqac-naac': 'IQAC / NAAC',
    'mandatory-disclosures': 'MANDATORY DISCLOSURES'
  }

  // Filter mobile navigation based on visibility rules
  const filteredMobileNavItems = mobileNavItems
    .filter(item => {
      const row2Label = ROW2_KEY_TO_LABEL[item.key]
      if (row2Label && !isMenuVisible(row2Label)) {
        return false
      }
      return true
    })
    .map(item => {
      const row2Label = ROW2_KEY_TO_LABEL[item.key]
      if (row2Label && item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter(child => isSubmenuVisible(row2Label, child))
        return {
          ...item,
          children: filteredChildren
        }
      }
      return item
    })

  return (
    <div className="navbar-2row-wrapper">
      {/* Mobile Bar Header (< 992px) */}
      <div className={`navbar-mobile-header ${isScrolled ? 'is-scrolled' : ''}`}>
        {isScrolled ? (
          <Link to="/" className="navbar-mobile-brand navbar-mobile-brand-logo" onClick={() => handleNavClick('/')} aria-label="Karmayogi College of Physiotherapy Home">
            <CollegeLogo src={collegeSettings?.college_logo_url} className="navbar-mobile-logo" />
          </Link>
        ) : (
          <Link to="/" className="navbar-mobile-brand" onClick={() => handleNavClick('/')}>
            <span className="navbar-mobile-title">Menu</span>
            <span className="navbar-mobile-sub">Karmayogi Physiotherapy</span>
          </Link>
        )}
        {isScrolled && (
          <div className="navbar-mobile-college-title">
            <span className="navbar-mobile-college-name">
              {collegeSettings?.college_name || "Karmayogi College of Physiotherapy"}
            </span>
          </div>
        )}
        <div className="navbar-mobile-actions">
          {!isScrolled && (
            <a
              href={`tel:${COLLEGE.phone}`}
              className="navbar-mobile-call-btn"
              aria-label="Call College Desk"
              title="Call College"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
          <button
            className="navbar-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER & BACKDROP ================= */}
      <div
        className={`mobile-nav-backdrop ${mobileOpen ? 'is-active' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`mobile-nav-drawer ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <CollegeLogo src={collegeSettings?.college_logo_url} className="mobile-drawer-crest" />
            <div className="mobile-drawer-titles">
              <div className="mobile-drawer-title">{collegeSettings?.college_name || "Karmayogi College of Physiotherapy"}</div>
              <div className="mobile-drawer-sub">MUHS Affiliated • Pandharpur</div>
            </div>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-scroll">
          <ul className="mobile-nav-list">
            {filteredMobileNavItems.map(item => {
              const hasChildren = Boolean(item.children && item.children.length > 0)
              const isExpanded = Boolean(mobileExpanded[item.key])
              const isActiveParent = hasChildren && (
                location.pathname === item.path ||
                (item.children && item.children.some(c => c.path === location.pathname))
              )

              return (
                <li key={item.key} className={`mobile-nav-item ${hasChildren ? 'has-accordion' : ''}`}>
                  {hasChildren ? (
                    <button
                      type="button"
                      className={`mobile-nav-row mobile-nav-toggle-row ${isExpanded ? 'is-open' : ''} ${isActiveParent ? 'is-active-parent' : ''}`}
                      onClick={() => toggleMobileGroup(item.key)}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${item.label} menu`}
                    >
                      <span className="mobile-nav-label">{item.label}</span>
                      <span className="mobile-accordion-icon">
                        <svg
                          className={`mobile-chevron ${isExpanded ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="15"
                          height="15"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => `mobile-nav-row mobile-nav-link-row ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.path)}
                    >
                      <span className="mobile-nav-label">{item.label}</span>
                    </NavLink>
                  )}

                  {hasChildren && isExpanded && (
                    <ul className="mobile-subnav-list">
                      {item.children.map(subItem => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <li key={subItem.path || subItem.label} className="mobile-subnav-item">
                            <Link
                              to={subItem.path}
                              className={`mobile-subnav-link ${isSubActive ? 'active' : ''}`}
                              onClick={() => handleNavClick(subItem.path)}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Quick Contact Desk Actions */}
          <div className="mobile-drawer-contact-box">
            <div className="mobile-contact-title">College Help Desk</div>
            <a href={`tel:${COLLEGE.phone}`} className="mobile-contact-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{COLLEGE.phone}</span>
            </a>
            <a href={`mailto:${COLLEGE.email}`} className="mobile-contact-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{COLLEGE.email}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ================= DESKTOP 2-ROW NAVIGATION (>= 992px) ================= */}
      <div className="desktop-navbar-wrapper">
        {/* ROW 1: Primary Institutional Navigation */}
        <div className="navbar-row-1-strip">
          <div className="navbar-2row-container">
            <nav className="nav-deck row-1-deck" aria-label="Primary Institutional Navigation">
              <div className="nav-deck-inner">
                <ul className="nav-items-list">
                  {ROW_1_NAV.map((item, idx) => {
                    const hasChildren = Boolean(item.children && item.children.length > 0)
                    const isHovered = activeDropdown === `r1-${idx}`

                    return (
                      <li
                        key={item.label}
                        className={`nav-item ${hasChildren ? 'has-dropdown' : ''}`}
                        onMouseEnter={() => hasChildren && setActiveDropdown(`r1-${idx}`)}
                        onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                      >
                        <NavLink
                          to={item.path}
                          end={item.path === '/'}
                          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                          onClick={() => handleNavClick(item.path)}
                        >
                          <span>{item.label}</span>
                          {hasChildren && (
                            <svg className="caret-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </NavLink>

                        {hasChildren && (
                          <div className={`nav-dropdown-card ${isHovered ? 'dropdown-visible' : ''}`}>
                            <ul className="dropdown-list">
                              {item.children.map(subItem => (
                                <li key={subItem.label} className="dropdown-item">
                                  <Link
                                    to={subItem.path}
                                    className="dropdown-link"
                                    onClick={() => handleNavClick(subItem.path)}
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* ROW 2: Campus, Clinical, Research & Quality Navigation */}
        <div className="navbar-row-2-strip">
          <div className="navbar-2row-container">
            <nav className="nav-deck row-2-deck" aria-label="Campus, Clinical and Academic Services Navigation">
              <div className="nav-deck-inner">
                <ul className="nav-items-list row-2-list">
                  {ROW_2_NAV.filter(item => isMenuVisible(item.label)).map((item, idx) => {
                    let children = item.children
                    if (item.label === 'COMMITTEES' && dynamicCommittees && dynamicCommittees.length > 0) {
                      children = [
                        { label: "Overview of Committees", path: "/committees" },
                        ...dynamicCommittees.map(c => ({
                          label: c.name,
                          path: `/committees/${c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                        }))
                      ]
                    }
                    if (children && children.length > 0) {
                      children = children.filter(child => isSubmenuVisible(item.label, child))
                    }
                    const hasChildren = Boolean(children && children.length > 0)
                    const isHovered = activeDropdown === `r2-${idx}`

                    return (
                      <li
                        key={item.label}
                        className={`nav-item ${hasChildren ? 'has-dropdown' : ''}`}
                        onMouseEnter={() => hasChildren && setActiveDropdown(`r2-${idx}`)}
                        onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                      >
                        <NavLink
                          to={item.path}
                          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                          onClick={() => handleNavClick(item.path)}
                        >
                          <span>{item.label}</span>
                          {hasChildren && (
                            <svg className="caret-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </NavLink>

                        {hasChildren && (
                          <div className={`nav-dropdown-card ${isHovered ? 'dropdown-visible' : ''}`}>
                            <ul className="dropdown-list">
                              {children.map(subItem => (
                                <li key={subItem.label} className="dropdown-item">
                                  <Link
                                    to={subItem.path}
                                    className="dropdown-link"
                                    onClick={() => handleNavClick(subItem.path)}
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
