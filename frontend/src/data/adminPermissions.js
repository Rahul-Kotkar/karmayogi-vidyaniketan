// ========================================================
// College of Physiotherapy - Admin Role & Permissions Directory
// Granular Menu & Submenu Permissions for Role-Based Access Control
// ========================================================

export const ADMIN_PERMISSION_GROUPS = [
  {
    groupId: 'primary_nav',
    groupTitle: 'ROW 1: PRIMARY WEBSITE NAVIGATION',
    menus: [
      { id: 'dashboard', label: 'Dashboard Overview', path: '/admin/dashboard' },
      { id: 'home', label: 'Homepage Settings & Slides', path: '/admin/home' },
      { id: 'about', label: 'About & Institutional History', path: '/admin/about' },
      { id: 'admissions', label: 'Admissions Desk & Fees', path: '/admin/admissions' },
      { id: 'courses', label: 'Courses & Sanctioned Intake', path: '/admin/courses' },
      { id: 'faculty', label: 'Faculty & Staff Roster', path: '/admin/faculty' },
      { id: 'notices', label: 'Circulars & Official Notices', path: '/admin/notices' },
      { id: 'news', label: 'News & Announcements', path: '/admin/news' },
      { id: 'events', label: 'Campus Events & Workshops', path: '/admin/events' },
      { id: 'gallery', label: 'Photo Gallery & Albums', path: '/admin/gallery' },
      { id: 'messages', label: 'Enquiry Contact Messages', path: '/admin/messages' },
      { id: 'activity_logs', label: 'User Activity & Audit Logs', path: '/admin/logs' },
      { id: 'settings', label: 'Website Identity Settings', path: '/admin/settings' }
    ]
  },
  {
    groupId: 'academic_services',
    groupTitle: 'ROW 2: ACADEMIC & CAMPUS SERVICES',
    menus: [
      {
        id: 'academics',
        label: 'Academics Management',
        path: '/admin/academics',
        submenus: [
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
        label: 'Campus Facilities',
        path: '/admin/facilities',
        submenus: [
          { id: 'facilities_overview', label: 'Campus Overview & Grounds', path: '/admin/facilities?tab=overview' },
          { id: 'facilities_labs', label: 'Specialized Laboratories', path: '/admin/facilities?tab=labs' },
          { id: 'facilities_library', label: 'Central Library & Reading Hall', path: '/admin/facilities?tab=library' },
          { id: 'facilities_hostel', label: 'Hostel & Residential Blocks', path: '/admin/facilities?tab=hostel' },
          { id: 'facilities_sports', label: 'Sports & Gymnasium Complex', path: '/admin/facilities?tab=sports' },
          { id: 'facilities_cafeteria', label: 'Cafeteria & Mess Facility', path: '/admin/facilities?tab=cafeteria' },
          { id: 'facilities_transport', label: 'Bus & Transportation Fleet', path: '/admin/facilities?tab=transport' },
          { id: 'facilities_clinical', label: 'Teaching Hospital Affiliation', path: '/admin/facilities?tab=clinical' }
        ]
      },
      {
        id: 'departments',
        label: 'College Departments',
        path: '/admin/departments'
      },
      {
        id: 'student_corner',
        label: 'Student Corner',
        path: '/admin/student-corner',
        submenus: [
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
        label: 'Research & Innovation',
        path: '/admin/research',
        submenus: [
          { id: 'res_overview', label: 'R&D Center Overview', path: '/admin/research?tab=overview' },
          { id: 'res_centers', label: 'Specialized Research Centers', path: '/admin/research?tab=centers' },
          { id: 'res_projects', label: 'Active & Completed Projects', path: '/admin/research?tab=projects' },
          { id: 'res_publications', label: 'Faculty Publications', path: '/admin/research?tab=publications' },
          { id: 'res_patents', label: 'Patents & IPR Innovations', path: '/admin/research?tab=patents' },
          { id: 'res_scholars', label: 'Ph.D. Scholars Desk', path: '/admin/research?tab=scholars' },
          { id: 'res_funded', label: 'Funded Research Grants', path: '/admin/research?tab=funded' },
          { id: 'res_conferences', label: 'Conference Presentations', path: '/admin/research?tab=conferences' },
          { id: 'res_journal', label: 'KJPRS College Journal', path: '/admin/research?tab=journal' },
          { id: 'res_achievements', label: 'Research Awards & Honors', path: '/admin/research?tab=achievements' }
        ]
      },
      {
        id: 'placement',
        label: 'Training & Placement',
        path: '/admin/training-placement',
        submenus: [
          { id: 'tp_highlights', label: '1. Highlights & Top Stats', path: '/admin/training-placement?tab=highlights' },
          { id: 'tp_recruiters', label: '2. Recruiter Network', path: '/admin/training-placement?tab=recruiters' },
          { id: 'tp_yearly', label: '3. Year-Wise Placements', path: '/admin/training-placement?tab=yearly' },
          { id: 'tp_outcomes', label: '4. Course-Wise Outcomes', path: '/admin/training-placement?tab=outcomes' },
          { id: 'tp_prep', label: '5. Prep Program (Stages)', path: '/admin/training-placement?tab=prep' },
          { id: 'tp_officer', label: '6. TPO\'s Desk', path: '/admin/training-placement?tab=officer' },
          { id: 'tp_testimonials', label: '7. Student Success Stories', path: '/admin/training-placement?tab=testimonials' }
        ]
      },
      {
        id: 'committees',
        label: 'Institutional Committees',
        path: '/admin/committees',
        submenus: [
          { id: 'com_overview', label: 'Overview of Committees', path: '/admin/committees' },
          { id: 'com_antiragging', label: 'Anti-Ragging Committee & Squad', path: '/admin/committees?tab=anti-ragging' },
          { id: 'com_icc', label: 'Internal Complaints Committee (ICC)', path: '/admin/committees?tab=icc' },
          { id: 'com_council', label: 'College Council & Advisory', path: '/admin/committees?tab=college-council' },
          { id: 'com_grievance', label: 'Student Grievance Redressal (SGRC)', path: '/admin/committees?tab=grievance' },
          { id: 'com_ethics', label: 'Institutional Ethics Committee (IEC)', path: '/admin/committees?tab=ethics' },
          { id: 'com_welfare', label: 'Student Welfare & Mentorship', path: '/admin/committees?tab=student-welfare' },
          { id: 'com_library', label: 'Library & Resource Committee', path: '/admin/committees?tab=library' }
        ]
      },
      {
        id: 'mandatory_disclosures',
        label: 'Mandatory Disclosures',
        path: '/admin/mandatory-disclosures',
        submenus: [
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
        submenus: [
          { id: 'iqac_cell', label: 'Internal Quality Assurance Cell', path: '/admin/iqac-naac?tab=iqac' },
          { id: 'iqac_naac_sub', label: 'NAAC Accreditation', path: '/admin/iqac-naac?tab=naac' },
          { id: 'iqac_minutes', label: 'Minutes of IQAC', path: '/admin/iqac-naac?tab=minutes' },
          { id: 'iqac_initiatives', label: 'Quality Initiatives', path: '/admin/iqac-naac?tab=initiatives' },
          { id: 'iqac_aqar', label: 'Annual Quality Reports (AQAR)', path: '/admin/iqac-naac?tab=aqar' }
        ]
      },
      {
        id: 'navigation_visibility',
        label: 'Menu Visibility (Row 2)',
        path: '/admin/navigation'
      }
    ]
  }
]

// Collect flat list of all permission IDs for quick validation
export const ALL_PERMISSION_KEYS = []
ADMIN_PERMISSION_GROUPS.forEach(g => {
  g.menus.forEach(m => {
    ALL_PERMISSION_KEYS.push(m.id)
    if (m.submenus) {
      m.submenus.forEach(s => ALL_PERMISSION_KEYS.push(s.id))
    }
  })
})

/**
 * Check if the user is a root developer administrator
 */
export function isDevAdmin(user) {
  if (!user) return false
  const role = (user.role || '').toLowerCase()
  const email = (user.email || '').toLowerCase()
  const name = (user.name || '').toLowerCase()
  const id = Number(user.id || user.sub || 0)

  return (
    role === 'superadmin' ||
    role === 'devadmin' ||
    role === 'developer' ||
    email === 'devkarma' ||
    email.includes('devkarma') ||
    id === 1
  )
}

/**
 * Check if a user has access to a specific permission key
 */
export function hasPermission(user, permissionId) {
  if (!user) return false
  if (isDevAdmin(user)) return true

  const perms = Array.isArray(user.permissions) ? user.permissions : []
  if (perms.includes('*') || perms.includes('all')) return true
  return perms.includes(permissionId)
}

/**
 * Check if user can access a menu or any of its submenus
 */
export function hasMenuAccess(user, menu) {
  if (!user) return false
  if (isDevAdmin(user)) return true

  // If menu itself is granted
  if (hasPermission(user, menu.id)) return true

  // If any child submenu is granted
  if (menu.submenus && menu.submenus.length > 0) {
    return menu.submenus.some(s => hasPermission(user, s.id))
  }

  return false
}

/**
 * Check if user has access to a specific path / URL
 */
export function hasPathAccess(user, pathname, search = '') {
  if (!user) return false
  if (isDevAdmin(user)) return true

  // Developer routes strictly forbidden for non-devadmin
  if (pathname.includes('/admin/rbac') || pathname.includes('/admin/migrations')) {
    return false
  }

  // Dashboard is standard entry
  if (pathname === '/admin/dashboard' || pathname === '/admin') {
    return hasPermission(user, 'dashboard')
  }

  // Check matching menu or submenu
  for (const group of ADMIN_PERMISSION_GROUPS) {
    for (const menu of group.menus) {
      const [mPath] = menu.path.split('?')
      if (pathname.startsWith(mPath)) {
        // If has submenus, check query / tab
        if (menu.submenus && menu.submenus.length > 0) {
          const currentUrl = `${pathname}${search}`
          const exactSubmenu = menu.submenus.find(s => s.path === currentUrl)
          if (exactSubmenu) {
            return hasPermission(user, exactSubmenu.id) || hasPermission(user, menu.id)
          }
          // Defaulting to root of menu
          return hasMenuAccess(user, menu)
        }
        return hasPermission(user, menu.id)
      }
    }
  }

  return false
}
