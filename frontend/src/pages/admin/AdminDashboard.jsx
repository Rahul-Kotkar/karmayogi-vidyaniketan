import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { dashboardService } from '../../services/endpoints.js'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    counts: { notices: 14, events: 7, faculty: 24, courses: 3, gallery: 18, messages: 5 },
    recent_messages: [],
    recent_notices: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.getStats()
        if (data && data.counts) {
          setStats(prev => ({
            ...prev,
            ...data,
            counts: {
              ...prev.counts,
              ...data.counts
            }
          }))
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      label: 'COLLEGE NEWS',
      val: 4,
      linkText: 'Manage news, media & featured stories',
      path: '/admin/news',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v8a2 2 0 0 1-2 2z" />
          <line x1="14" y1="2" x2="14" y2="8" />
          <line x1="14" y1="8" x2="20" y2="8" />
          <line x1="7" y1="13" x2="17" y2="13" />
          <line x1="7" y1="17" x2="13" y2="17" />
        </svg>
      )
    },
    {
      label: 'STUDENT ACHIEVEMENTS',
      val: 4,
      linkText: 'Manage proud moments & student awards',
      path: '/admin/achievements',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      label: 'ACTIVE NOTICES',
      val: stats.counts.notices ?? 14,
      linkText: 'Manage notices & announcements',
      path: '/admin/notices',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="14" y2="13" />
        </svg>
      )
    },
    {
      label: 'PUBLISHED CIRCULARS',
      val: 3,
      linkText: 'Manage circulars & orders',
      path: '/admin/notices',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      label: 'BPT SUBJECTS',
      val: 34,
      linkText: 'Manage BPT curriculum subjects',
      path: '/admin/academics?tab=subjects',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      label: 'ACADEMIC CALENDARS',
      val: 10,
      linkText: 'Manage academic calendar events',
      path: '/admin/academics?tab=calendar',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      label: 'CLASS TIMETABLES',
      val: 4,
      linkText: 'Manage class timetables',
      path: '/admin/academics?tab=timetable',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      label: 'EXAMINATION NOTICES',
      val: 3,
      linkText: 'Manage exam timetables & notices',
      path: '/admin/academics?tab=examination',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      label: 'EXAM RESULTS',
      val: 5,
      linkText: 'Manage exam result links',
      path: '/admin/academics?tab=results',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      label: 'LIVE COURSES',
      val: stats.counts.courses ?? 3,
      linkText: 'Manage courses',
      path: '/admin/courses',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    },
    {
      label: 'ACADEMIC DEPARTMENTS',
      val: 5,
      linkText: 'Manage departments',
      path: '/admin/departments',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z" />
        </svg>
      )
    }
  ]

  const userName = user?.name || 'Developer Administrator'
  const userRole = user?.role || 'Super Administrator'

  return (
    <div>
      {/* 1. Mint Green Welcome Notification Banner */}
      <div className="admin-welcome-alert">
        <span className="admin-welcome-alert-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>Welcome {userName}!</span>
      </div>

      {/* 2. Deep Royal Navy Hero Welcome Card */}
      <div className="admin-hero-welcome-card">
        <div>
          <div className="hero-role-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Role: {userRole}</span>
          </div>
          <h2>Welcome back, {userName}!</h2>
          <p>
            Here is your configured administrative command dashboard overview. Use the quick cards below or the sidebar navigation to manage authorized content.
          </p>
        </div>
      </div>

      {/* 3. 3-Column Quick Metrics Grid */}
      <div className="admin-stats-grid">
        {cards.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="admin-stat-label">{c.label}</div>
              <div className="admin-stat-val">
                {loading ? '—' : c.val}
              </div>
              <Link to={c.path} className="admin-stat-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span>{c.linkText}</span>
              </Link>
            </div>
            <div className="admin-stat-icon-wrap">
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Bottom Activity Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Recent Notices */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Notices</h3>
            <Link to="/admin/notices" className="admin-btn admin-btn-secondary admin-btn-sm">
              Manage All
            </Link>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {stats.recent_notices && stats.recent_notices.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_notices.map(n => (
                    <tr key={n.id}>
                      <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>{n.notice_date}</td>
                      <td><b>{n.title}</b></td>
                      <td>
                        <span className={`admin-badge ${n.is_published ? 'badge-success' : 'badge-warning'}`}>
                          {n.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
                No notices published recently.
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Contact Enquiries</h3>
            <Link to="/admin/contact" className="admin-btn admin-btn-secondary admin-btn-sm">
              View Inbox
            </Link>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {stats.recent_messages && stats.recent_messages.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_messages.map(m => (
                    <tr key={m.id}>
                      <td>
                        <b>{m.name}</b><br />
                        <span style={{ fontSize: 11, color: '#64748b' }}>{m.email}</span>
                      </td>
                      <td>{m.subject || 'Enquiry'}</td>
                      <td>
                        <span className={`admin-badge ${m.status === 'unread' ? 'badge-danger' : 'badge-info'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
                No new contact enquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

