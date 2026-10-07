import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ROW_1_NAV, ROW_2_NAV, COLLEGE } from '../data/collegeData.js'
import { CollegeLogo } from './Logo.jsx'
import { getCachedNavVisibility, settingsService, getCachedSettings } from '../services/endpoints.js'

export default function Navbar2Row() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState({})
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

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) setCollegeSettings(data)
    }).catch(() => {})

    const handleVisibilityUpdate = (e) => {
      if (e.detail) setNavVisibility(e.detail)
    }
    window.addEventListener('nav_visibility_updated', handleVisibilityUpdate)
    return () => {
      window.removeEventListener('nav_visibility_updated', handleVisibilityUpdate)
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

  // Unified Mobile Navigation Sequence
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
      path: '/academics',
      children: [
        { label: 'Academic Overview', path: '/academics' },
        { label: 'Pre-Primary (Nursery, Jr/Sr KG)', path: '/pre-primary' },
        { label: 'Primary School (Grades 1-5)', path: '/primary' },
        { label: 'Secondary School (Grades 6-10)', path: '/secondary' },
        { label: 'Curriculum & Boards', path: '/curriculum' },
        { label: 'Teaching Methodology', path: '/academics#methodology' },
        { label: 'Examination & Assessment', path: '/academics#examination' }
      ]
    },
    {
      key: 'admissions',
      label: 'Admissions',
      path: '/admissions',
      children: [
        { label: 'Admission Process', path: '/admission-process' },
        { label: 'Eligibility Criteria', path: '/admission-process#eligibility' },
        { label: 'Documents Required', path: '/admission-process#documents' },
        { label: 'Fee Structure', path: '/fees' },
        { label: 'Enquiry / Apply Now', path: '/admissions#apply' },
        { label: 'Admission FAQs', path: '/fees#faqs' }
      ]
    },
    {
      key: 'campus',
      label: 'Campus',
      path: '/infrastructure',
      children: [
        { label: 'Infrastructure Overview', path: '/infrastructure' },
        { label: 'Smart Classrooms', path: '/facilities#smart-classrooms' },
        { label: 'Science Laboratories', path: '/labs#science' },
        { label: 'Computer Laboratory', path: '/labs#computer' },
        { label: 'STEM Laboratory', path: '/labs#stem' },
        { label: 'AI & Robotics Lab', path: '/labs#robotics' },
        { label: 'Digital Library', path: '/facilities#library' },
        { label: 'Transportation Fleet', path: '/transport' },
        { label: 'Sports Facilities', path: '/sports' }
      ]
    },
    {
      key: 'student-life',
      label: 'Student Life',
      path: '/student-life',
      children: [
        { label: 'Sports & Athletics', path: '/sports' },
        { label: 'Cultural Activities', path: '/student-life#cultural' },
        { label: 'Clubs & Activities', path: '/student-life#clubs' },
        { label: 'Events & Celebrations', path: '/events' },
        { label: 'Field Trips & Excursions', path: '/student-life#field-trips' },
        { label: 'Competitions & Olympiads', path: '/student-life#competitions' },
        { label: 'Student Achievements', path: '/student-life#achievements' }
      ]
    },
    {
      key: 'facilities',
      label: 'Facilities',
      path: '/facilities'
    },
    {
      key: 'gallery',
      label: 'School Gallery',
      path: '/gallery'
    },
    {
      key: 'events',
      label: 'News & Events',
      path: '/events'
    },
    {
      key: 'contact',
      label: 'Contact Us',
      path: '/contact'
    }
  ]

  return (
    <div className="navbar-2row-wrapper">
      {/* ================= MOBILE BAR HEADER (< 992px) ================= */}
      <div className={`navbar-mobile-header ${isScrolled ? 'is-scrolled' : ''}`}>
        {isScrolled ? (
          <Link to="/" className="navbar-mobile-brand navbar-mobile-brand-logo" onClick={() => handleNavClick('/')} aria-label="Karmayogi Vidyaniketan Home">
            <CollegeLogo src={collegeSettings?.college_logo_url} className="navbar-mobile-logo" />
          </Link>
        ) : (
          <Link to="/" className="navbar-mobile-brand" onClick={() => handleNavClick('/')}>
            <span className="navbar-mobile-title">Menu</span>
            <span className="navbar-mobile-sub">Karmayogi Vidyaniketan</span>
          </Link>
        )}

        {isScrolled && (
          <div className="navbar-mobile-college-title">
            <span className="navbar-mobile-college-name">
              {collegeSettings?.college_name || "Karmayogi Vidyaniketan"}
            </span>
          </div>
        )}

        <div className="navbar-mobile-actions">
          {!isScrolled && (
            <a
              href={`tel:${COLLEGE.phone}`}
              className="navbar-mobile-call-btn"
              aria-label="Call School Helpdesk"
              title="Call School Desk"
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
              <div className="mobile-drawer-title">{collegeSettings?.college_name || "Karmayogi Vidyaniketan"}</div>
              <div className="mobile-drawer-sub">Karmayogi Public School • Pandharpur</div>
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
            {mobileNavItems.map(item => {
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
            <div className="mobile-contact-title">School Admission Desk</div>
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

        {/* ROW 2: Quick Academic, Campus & Facilities Navigation Strip */}
        <div className="navbar-row-2-strip">
          <div className="navbar-2row-container">
            <nav className="nav-deck row-2-deck" aria-label="Campus & Academic Services Navigation">
              <div className="nav-deck-inner">
                <ul className="nav-items-list row-2-list">
                  {ROW_2_NAV.map((item) => (
                    <li key={item.label} className="nav-item">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                        onClick={() => handleNavClick(item.path)}
                      >
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
