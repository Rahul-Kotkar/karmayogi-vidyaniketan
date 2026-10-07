import React, { useState, useEffect, useMemo } from 'react'
import { activityLogsService, usersService } from '../../services/endpoints.js'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function AdminActivityLogs({ initialUserId = null, standalone = true }) {
  const { user: currentAuthUser } = useAuth()

  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({
    total_logs: 0,
    total_logins: 0,
    total_changes: 0,
    today_logins: 0,
    today_changes: 0,
    active_users_30d: 0
  })
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  // Filters
  const [selectedUser, setSelectedUser] = useState(initialUserId || '')
  const [selectedAction, setSelectedAction] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Only list created users for supervision (exclude master dev user)
  const createdUsers = useMemo(() => {
    return (usersList || []).filter(u => {
      const email = (u.email || '').toLowerCase()
      const role = (u.role || '').toLowerCase()
      const id = Number(u.id || 0)
      return email !== 'devkarma' && !email.includes('devkarma') && id !== 1 && !['superadmin', 'devadmin', 'developer'].includes(role)
    })
  }, [usersList])

  // Sync initialUserId if prop changes
  useEffect(() => {
    if (initialUserId !== null && initialUserId !== undefined) {
      setSelectedUser(initialUserId)
      setCurrentPage(1)
    }
  }, [initialUserId])

  // Load created users for filter dropdown
  useEffect(() => {
    async function loadUsers() {
      try {
        const u = await usersService.getAll()
        setUsersList(Array.isArray(u) ? u : [])
      } catch {}
    }
    loadUsers()
  }, [])

  // Load aggregated stats for created users
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const data = await activityLogsService.getStats()
      if (data) setStats(data)
    } catch {}
    setStatsLoading(false)
  }

  // Load logs
  const fetchLogs = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 30
      }
      if (selectedUser) params.user_id = selectedUser
      if (selectedAction) params.action = selectedAction
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const res = await activityLogsService.getAll(params)
      // Exclude any developer admin records on client-side as an additional layer
      const cleanLogs = (res.logs || []).filter(item => {
        const email = (item.user_email || '').toLowerCase()
        const role = (item.user_role || '').toLowerCase()
        const id = Number(item.user_id || 0)
        return email !== 'devkarma' && !email.includes('devkarma') && id !== 1 && !['superadmin', 'devadmin', 'developer'].includes(role)
      })

      setLogs(cleanLogs)
      setCurrentPage(res.page || 1)
      setTotalPages(res.total_pages || 1)
      setTotalRecords(cleanLogs.length)
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchLogs(currentPage)
  }, [selectedUser, selectedAction, currentPage])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleResetFilters = () => {
    setSelectedUser(initialUserId || '')
    setSelectedAction('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr.replace(/-/g, '/'))
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return dateStr
    }
  }

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return ''
    try {
      const now = new Date()
      const d = new Date(dateStr.replace(/-/g, '/'))
      const diffMs = now - d
      const diffSec = Math.floor(diffMs / 1000)
      if (diffSec < 60) return 'Just now'
      const diffMin = Math.floor(diffSec / 60)
      if (diffMin < 60) return `${diffMin}m ago`
      const diffHr = Math.floor(diffMin / 60)
      if (diffHr < 24) return `${diffHr}h ago`
      const diffDays = Math.floor(diffHr / 24)
      if (diffDays < 7) return `${diffDays}d ago`
      return ''
    } catch {
      return ''
    }
  }

  const getActionBadge = (action) => {
    const act = (action || '').toUpperCase()
    if (act === 'LOGIN') {
      return <span className="admin-badge badge-success">Logged In</span>
    }
    if (act === 'CREATE') {
      return <span className="admin-badge badge-info">Created</span>
    }
    if (act === 'UPDATE') {
      return <span className="admin-badge badge-info">Updated</span>
    }
    if (act === 'DELETE') {
      return <span className="admin-badge badge-warning">Deleted</span>
    }
    if (act === 'PASSWORD_CHANGE') {
      return <span className="admin-badge badge-info">Password</span>
    }
    return <span className="admin-badge">{act}</span>
  }

  return (
    <div>
      {/* Page Header */}
      {standalone && (
        <div className="admin-page-header">
          <div>
            <h1>
              User Activity &amp; Audit Logs
              <span className="admin-page-badge">Security Audit</span>
            </h1>
            <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
              Supervise created administrator logins, remote IP addresses, and administrative panel updates.
            </p>
          </div>
          <div className="admin-page-actions">
            <button
              onClick={() => { fetchStats(); fetchLogs(currentPage); }}
              className="admin-btn admin-btn-secondary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh Logs
            </button>
          </div>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: 20 }}>
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Supervised Users</div>
            <div className="admin-stat-val">{createdUsers.length}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {createdUsers.length === 1 ? '1 active created user' : `${createdUsers.length} created accounts`}
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">User Logins</div>
            <div className="admin-stat-val">
              {statsLoading ? '...' : (stats.total_logins || 0)}
            </div>
            <div style={{ fontSize: 12, color: '#15803d' }}>
              +{stats.today_logins || 0} today
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Changes &amp; Updates</div>
            <div className="admin-stat-val">
              {statsLoading ? '...' : (stats.total_changes || 0)}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              +{stats.today_changes || 0} today
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
            {/* Search Input */}
            <div style={{ minWidth: 220, flex: '1 1 220px' }}>
              <input
                type="text"
                placeholder="Search user, email, IP, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ padding: '8px 12px', fontSize: 13 }}
              />
            </div>

            {/* Filter by Created User */}
            <select
              value={selectedUser}
              onChange={(e) => { setSelectedUser(e.target.value); setCurrentPage(1); }}
              className="admin-select"
              style={{ width: 'auto', minWidth: 180, padding: '8px 12px', fontSize: 13 }}
            >
              <option value="">All Created Users</option>
              {createdUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>

            {/* Filter by Action */}
            <select
              value={selectedAction}
              onChange={(e) => { setSelectedAction(e.target.value); setCurrentPage(1); }}
              className="admin-select"
              style={{ width: 'auto', minWidth: 150, padding: '8px 12px', fontSize: 13 }}
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Logins Only</option>
              <option value="CHANGES">Content Updates Only</option>
              <option value="CREATE">Created Only</option>
              <option value="UPDATE">Updated Only</option>
              <option value="DELETE">Deleted Only</option>
            </select>
          </div>

          {(selectedUser || selectedAction || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Logs Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>
              User Activity Records
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
              Showing {logs.length} recorded actions from created administrators
            </p>
          </div>
          {totalPages > 1 && (
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
            Loading activity records...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
            <div style={{ fontWeight: 600, color: '#334155', marginBottom: 4, fontSize: 15 }}>
              No activity logs found for created users
            </div>
            <p style={{ fontSize: 13, margin: 0, color: '#64748b' }}>
              {selectedUser || selectedAction || searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Activity logs will appear here when created administrators (e.g. phyadmin@org.in) log in and perform actions.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Date &amp; Time</th>
                  <th style={{ width: '25%' }}>Administrator</th>
                  <th style={{ width: '13%' }}>Action</th>
                  <th style={{ width: '25%' }}>Activity Description</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => {
                  const relTime = getRelativeTime(item.created_at)
                  return (
                    <tr key={item.id}>
                      {/* Date & Time */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {formatDateTime(item.created_at)}
                        </div>
                        {relTime && (
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                            {relTime}
                          </div>
                        )}
                      </td>

                      {/* User Info */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0
                          }}>
                            {(item.user_name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {item.user_name || 'Administrator'}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#64748b' }}>
                              {item.user_email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td>
                        {getActionBadge(item.action)}
                      </td>

                      {/* Activity Description */}
                      <td>
                        <div style={{ color: '#0f172a', fontWeight: 500, fontSize: 13 }}>
                          {item.description}
                        </div>
                      </td>

                      {/* IP Address */}
                      <td style={{ textAlign: 'right' }}>
                        <code style={{
                          fontFamily: 'Consolas, monospace',
                          fontSize: 12,
                          padding: '3px 8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 4,
                          color: '#475569'
                        }}>
                          {item.ip_address || '—'}
                        </code>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
