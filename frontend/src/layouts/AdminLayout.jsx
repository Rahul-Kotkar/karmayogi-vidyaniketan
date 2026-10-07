import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { isDevAdmin, hasPermission } from '../data/adminPermissions.js'
import siteLogo from '../assets/pandharpur_logo.jpg'
import '../admin.css'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userIsDev = isDevAdmin(user)
  
  // Track open dropdowns by menu label
  const [openDropdowns, setOpenDropdowns] = useState({})

  // Automatically manage screen visibility and dismissal for any changes saved in admin panel
  useEffect(() => {
    const handleAlertClick = (e) => {
      const alertEl = e.target.closest('.admin-alert')
      if (alertEl) {
        alertEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
        alertEl.style.opacity = '0'
        alertEl.style.transform = 'translateY(-10px)'
        setTimeout(() => {
          if (alertEl) alertEl.style.display = 'none'
        }, 250)
      }
    }

    const observer = new MutationObserver(() => {
      const alerts = document.querySelectorAll('.admin-alert:not([data-dismiss-bound])')
      alerts.forEach(alert => {
        alert.setAttribute('data-dismiss-bound', 'true')
        
        // Scroll smoothly to keep the alert in screen view if scrolled far
        try {
          alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        } catch {}

        // Auto-dismiss after 4.5 seconds
        setTimeout(() => {
          if (alert && alert.parentElement) {
            alert.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
            alert.style.opacity = '0'
            alert.style.transform = 'translateY(-8px)'
            setTimeout(() => {
              if (alert) alert.style.display = 'none'
            }, 400)
          }
        }, 4500)
      })
    })

    document.addEventListener('click', handleAlertClick)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('click', handleAlertClick)
      observer.disconnect()
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const toggleDropdown = (label) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  // Developer Control Hub Items (DevAdmin Only)
  const devHubItems = [
    {
      id: 'rbac',
      label: 'Role-Based Admins (RBAC)',
      path: '/admin/rbac',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'activity_logs',
      label: 'User Activity & Audit Logs',
      path: '/admin/logs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'migrations',
      label: 'Database Migrations',
      path: '/admin/migrations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    }
  ]

  // Row 1 Menu (Primary Website Navigation)
  const row1NavItems = [
    {
      id: 'home',
      label: 'HOME',
      path: '/admin/home',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'about',
      label: 'ABOUT',
      path: '/admin/about',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    },
    {
      id: 'admissions',
      label: 'ADMISSIONS',
      path: '/admin/admissions',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'courses',
      label: 'COURSES & INTAKE',
      path: '/admin/courses',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: 'faculty',
      label: 'FACULTY',
      path: '/admin/faculty',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'notices',
      label: 'NOTICES',
      path: '/admin/notices',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'news',
      label: 'NEWS',
      path: '/admin/news',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v8a2 2 0 0 1-2 2z" />
          <line x1="14" y1="2" x2="14" y2="8" />
          <line x1="14" y1="8" x2="20" y2="8" />
          <line x1="7" y1="13" x2="17" y2="13" />
          <line x1="7" y1="17" x2="13" y2="17" />
        </svg>
      )
    },
    {
      id: 'events',
      label: 'EVENTS',
      path: '/admin/events',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'gallery',
      label: 'GALLERY',
      path: '/admin/gallery',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    }
  ]

  // Row 2 Menu (Academic & Campus Services with Submenus)
  const row2NavItems = [
    {
      id: 'academics',
      label: 'ACADEMICS',
      path: '/admin/academics',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      children: [
        { id: 'acad_subjects', label: 'Subjects', path: '/admin/academics?tab=subjects' },
        { id: 'acad_calendar', label: 'Academic Calendar', path: '/admin/academics?tab=calendar' },
        { id: 'acad_timetable', label: 'Timetable', path: '/admin/academics?tab=timetable' },
        { id: 'acad_examination', label: 'Examination', path: '/admin/academics?tab=examination' },
        { id: 'acad_results', label: 'Results', path: '/admin/academics?tab=results' },
        { id: 'acad_policies', label: 'Academic Policies', path: '/admin/academics?tab=policies' },
        { id: 'acad_handbook', label: 'Student Handbook', path: '/admin/academics?tab=handbook' }
      ]
    },
    {
      id: 'facilities',
      label: 'FACILITIES',
      path: '/admin/facilities',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="22" x2="9" y2="22.01" />
          <line x1="15" y1="22" x2="15" y2="22.01" />
          <line x1="9" y1="18" x2="9" y2="18.01" />
          <line x1="15" y1="18" x2="15" y2="18.01" />
          <line x1="9" y1="14" x2="9" y2="14.01" />
          <line x1="15" y1="14" x2="15" y2="14.01" />
          <line x1="9" y1="10" x2="9" y2="10.01" />
          <line x1="15" y1="10" x2="15" y2="10.01" />
          <line x1="9" y1="6" x2="9" y2="6.01" />
          <line x1="15" y1="6" x2="15" y2="6.01" />
        </svg>
      )
    },
    {
      id: 'departments',
      label: 'DEPARTMENTS',
      path: '/admin/departments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      id: 'student_corner',
      label: 'STUDENT CORNER',
      path: '/admin/student-corner',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      children: [
        { id: 'sc_activities', label: 'Activities & Gallery', path: '/admin/student-corner?tab=activities' },
        { id: 'sc_spaces', label: 'Spaces & Facilities', path: '/admin/student-corner?tab=spaces' },
        { id: 'sc_support', label: 'Student Support & Mentorship', path: '/admin/student-corner?tab=support' },
        { id: 'sc_achievements', label: 'Student Achievements', path: '/admin/student-corner?tab=achievements' },
        { id: 'sc_scholarships', label: 'Scholarships & Freeships', path: '/admin/student-corner?tab=scholarships' },
        { id: 'sc_council', label: 'Student Council', path: '/admin/student-corner?tab=council' }
      ]
    },
    {
      id: 'research',
      label: 'RESEARCH',
      path: '/admin/research',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.36 21h15.28L14 9.31V2" />
          <line x1="8.5" y1="2" x2="15.5" y2="2" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      )
    },
    {
      id: 'placement',
      label: 'PLACEMENT',
      path: '/admin/training-placement',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'committees',
      label: 'COMMITTEES',
      path: '/admin/committees',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      children: [
        { id: 'com_overview', label: 'Overview of Committees', path: '/admin/committees' },
        { id: 'com_antiragging', label: 'Anti-Ragging Committee', path: '/admin/committees?tab=anti-ragging' },
        { id: 'com_icc', label: 'Internal Complaints Committee (ICC)', path: '/admin/committees?tab=icc' },
        { id: 'com_council', label: 'College Council', path: '/admin/committees?tab=college-council' },
        { id: 'com_grievance', label: 'Grievance Redressal Committee', path: '/admin/committees?tab=grievance' },
        { id: 'com_ethics', label: 'Institutional Ethics Committee (IEC)', path: '/admin/committees?tab=ethics' },
        { id: 'com_welfare', label: 'Student Welfare & Mentorship', path: '/admin/committees?tab=student-welfare' },
        { id: 'com_library', label: 'Library Committee', path: '/admin/committees?tab=library' }
      ]
    },
    {
      id: 'mandatory_disclosures',
      label: 'MANDATORY DISCLOSURES',
      path: '/admin/mandatory-disclosures',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      children: [
        { id: 'md_muhs', label: 'MUHS Mandates & Affiliation', path: '/admin/mandatory-disclosures/muhs' },
        { id: 'md_dmer', label: 'DMER Directives', path: '/admin/mandatory-disclosures/dmer' },
        { id: 'md_audited', label: 'Audited Statements', path: '/admin/mandatory-disclosures/audited-statements' },
        { id: 'md_fra', label: 'FRA Approved Fees', path: '/admin/mandatory-disclosures/fra-fees' },
        { id: 'md_statutory', label: 'Statutory Regulatory Orders', path: '/admin/mandatory-disclosures/statutory-orders' }
      ]
    },
    {
      id: 'iqac_naac',
      label: 'IQAC / NAAC',
      path: '/admin/iqac-naac',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      children: [
        { id: 'iqac_cell', label: 'Internal Quality Assurance Cell', path: '/admin/iqac-naac?tab=iqac' },
        { id: 'iqac_naac_sub', label: 'NAAC Accreditation', path: '/admin/iqac-naac?tab=naac' },
        { id: 'iqac_minutes', label: 'Minutes of IQAC', path: '/admin/iqac-naac?tab=minutes' },
        { id: 'iqac_initiatives', label: 'Quality Initiatives', path: '/admin/iqac-naac?tab=initiatives' },
        { id: 'iqac_aqar', label: 'Annual Quality Reports (AQAR)', path: '/admin/iqac-naac?tab=aqar' }
      ]
    },
    {
      id: 'navigation_visibility',
      label: 'MENU VISIBILITY (ROW 2)',
      path: '/admin/navigation',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    }
  ]

  // System & Settings Nav Items
  const systemNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      id: 'messages',
      label: 'Contact Messages',
      path: '/admin/messages',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Website Settings',
      path: '/admin/settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    ...(!userIsDev ? [{
      id: 'activity_logs',
      label: 'Activity & Audit Logs',
      path: '/admin/logs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    }] : [])
  ]

  // Filter items based on user role and granular permissions
  const filterNavItems = (items) => {
    if (userIsDev) return items

    return items.map(item => {
      if (item.children && item.children.length > 0) {
        // Filter children
        const filteredChildren = item.children.filter(child => 
          hasPermission(user, child.id) || hasPermission(user, item.id)
        )
        if (filteredChildren.length > 0 || hasPermission(user, item.id)) {
          return {
            ...item,
            children: filteredChildren
          }
        }
        return null
      }
      return hasPermission(user, item.id) ? item : null
    }).filter(Boolean)
  }

  // Construct dynamic navigation sections
  const navSections = []

  // 1. Administration Control Section
  if (userIsDev) {
    navSections.push({
      title: 'ADMIN CONTROL',
      items: devHubItems
    })
  }

  // 2. Primary Navigation
  const filteredRow1 = filterNavItems(row1NavItems)
  if (filteredRow1.length > 0) {
    navSections.push({
      title: 'ROW 1: PRIMARY NAVIGATION',
      items: filteredRow1
    })
  }

  // 3. Academic & Campus Services
  const filteredRow2 = filterNavItems(row2NavItems)
  if (filteredRow2.length > 0) {
    navSections.push({
      title: 'ROW 2: ACADEMIC & CAMPUS SERVICES',
      items: filteredRow2
    })
  }

  // 4. System & Settings
  const filteredSystem = filterNavItems(systemNavItems)
  if (filteredSystem.length > 0) {
    navSections.push({
      title: 'SYSTEM & SETTINGS',
      items: filteredSystem
    })
  }

  // Check if a parent item is active based on current location
  const isItemActive = (item) => {
    if (location.pathname === item.path) return true
    if (item.children) {
      return item.children.some(child => {
        const [cPath] = child.path.split('?')
        return location.pathname === cPath
      })
    }
    return false
  }

  // Check if a child item is active
  const isChildActive = (child) => {
    const [cPath, cQuery] = child.path.split('?')
    if (location.pathname !== cPath) return false
    const currentParams = new URLSearchParams(location.search)
    if (!cQuery) {
      return !currentParams.get('tab')
    }
    const targetParams = new URLSearchParams(cQuery)
    for (const [k, v] of targetParams.entries()) {
      if (currentParams.get(k) === v) return true
    }
    return false
  }

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-icon">
            <img
              src={siteLogo}
              alt="Karmayogi Vidyaniketan Logo"
              className="admin-brand-logo-img"
            />
          </div>
          <div className="admin-brand-text-wrap">
            <div className="admin-sidebar-title">Karmayogi School</div>
            <div className="admin-sidebar-subtitle">
              ADMIN CONTROL PANEL
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="admin-nav-section">
              {sec.title && <div className="admin-nav-section-title">{sec.title}</div>}
              <ul>
                {sec.items.map(item => {
                  const hasChildren = Boolean(item.children && item.children.length > 0)
                  const active = isItemActive(item)
                  const isExpanded = openDropdowns[item.label] !== undefined 
                    ? openDropdowns[item.label] 
                    : active

                  return (
                    <li key={item.label} className="admin-nav-item">
                      {hasChildren ? (
                        <div className="admin-nav-parent-wrap">
                          <div
                            className={`admin-nav-parent-link ${active ? 'active' : ''}`}
                            onClick={() => toggleDropdown(item.label)}
                          >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-item-text">{item.label}</span>
                            <span className={`admin-nav-caret ${isExpanded ? 'is-open' : ''}`}>
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>

                          {isExpanded && (
                            <ul className="admin-nav-submenu">
                              {item.children.map(child => {
                                const childSelected = isChildActive(child)

                                return (
                                   <li key={child.path} className="admin-nav-subitem">
                                    <Link
                                      to={child.path}
                                      onClick={() => setSidebarOpen(false)}
                                      className={childSelected ? 'active' : ''}
                                    >
                                      <span className="admin-subnav-bullet"></span>
                                      <span>{child.label}</span>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                          <span className="admin-nav-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </NavLink>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px' }}>Active User</div>
              <strong style={{ color: '#ffffff', fontSize: 13, display: 'block', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Administrator'}
              </strong>
            </div>
            <button
              onClick={handleLogout}
              className="admin-sidebar-logout-btn"
              title="Logout from Admin Panel"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-title">
              Karmayogi Vidyaniketan - Admin Panel
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status-online">
              <span className="admin-online-dot" style={{ background: '#22c55e' }}></span>
              <span>Logged in as <strong>{user?.name || 'Administrator'}</strong></span>
            </div>
            {userIsDev ? (
              <span className="admin-role-badge" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe', fontWeight: 700 }}>
                Master Admin
              </span>
            ) : (
              <span className="admin-role-badge" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
                Staff Admin
              </span>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
