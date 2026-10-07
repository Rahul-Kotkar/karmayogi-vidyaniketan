import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { isDevAdmin, hasPermission } from '../data/adminPermissions.js'

export default function AdminAccessGuard({ permissionId, devOnly = false, children }) {
  const { user } = useAuth()

  // Developer Admin always has full access
  if (isDevAdmin(user)) {
    return children
  }

  // Developer-only routes (RBAC, Migrations)
  if (devOnly) {
    return (
      <div className="admin-card" style={{ maxWidth: 640, margin: '60px auto', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#fee2e2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--navy-header)' }}>Developer Access Required</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
          This section contains developer system tools, database migrations, and role-based access management.
          Your account does not have developer administrator privileges.
        </p>
        <Link to="/admin/dashboard" className="admin-btn admin-btn-primary">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  // Check specific menu permission
  if (permissionId && !hasPermission(user, permissionId)) {
    return (
      <div className="admin-card" style={{ maxWidth: 640, margin: '60px auto', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#fee2e2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--navy-header)' }}>Access Restricted</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
          You do not have permission to view or manage this section.
          Please contact your <strong>Administrator</strong> to request access permissions.
        </p>
        <Link to="/admin/dashboard" className="admin-btn admin-btn-primary">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return children
}
