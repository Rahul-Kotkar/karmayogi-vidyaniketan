import React, { useState, useEffect } from 'react'
import { usersService } from '../../services/endpoints.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import { ADMIN_PERMISSION_GROUPS, ALL_PERMISSION_KEYS, isDevAdmin } from '../../data/adminPermissions.js'
import AdminActivityLogs from './AdminActivityLogs.jsx'

export default function AdminRBAC() {
  const { user: currentAuthUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [modalError, setModalError] = useState('')

  // Top tabs
  const [activeTab, setActiveTab] = useState('accounts') // 'accounts' | 'logs'
  const [userLogsModalTarget, setUserLogsModalTarget] = useState(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    is_active: 1,
    permissions: []
  })

  // Collapsed sections in permissions editor
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleExpand = (menuId) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }))
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await usersService.getAll()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setMsg({ text: 'Failed to load administrator accounts: ' + err.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleOpenModal = (u = null) => {
    setModalError('')
    if (u) {
      setEditingUser(u)
      setForm({
        name: u.name || '',
        email: u.email || '',
        password: '',
        role: u.role || 'admin',
        is_active: u.is_active !== undefined ? Number(u.is_active) : 1,
        permissions: Array.isArray(u.permissions) ? [...u.permissions] : (u.role === 'devadmin' ? ['*'] : [])
      })
    } else {
      setEditingUser(null)
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        is_active: 1,
        permissions: ['dashboard']
      })
    }
    setModalOpen(true)
  }

  // Permission selection helpers
  const isPermissionChecked = (permId) => {
    if (form.permissions.includes('*')) return true
    return form.permissions.includes(permId)
  }

  const togglePermission = (permId) => {
    setForm(prev => {
      let current = prev.permissions.includes('*') ? [...ALL_PERMISSION_KEYS] : [...prev.permissions]
      if (current.includes(permId)) {
        current = current.filter(p => p !== permId && p !== '*')
      } else {
        current.push(permId)
      }
      return { ...prev, permissions: current }
    })
  }

  const toggleMenuWithSubmenus = (menu) => {
    const allChildIds = [menu.id]
    if (menu.submenus) {
      menu.submenus.forEach(s => allChildIds.push(s.id))
    }

    setForm(prev => {
      let current = prev.permissions.includes('*') ? [...ALL_PERMISSION_KEYS] : [...prev.permissions]
      const allSelected = allChildIds.every(id => current.includes(id))

      if (allSelected) {
        // Deselect all
        current = current.filter(p => !allChildIds.includes(p) && p !== '*')
      } else {
        // Select all
        allChildIds.forEach(id => {
          if (!current.includes(id)) current.push(id)
        })
      }
      return { ...prev, permissions: current }
    })
  }

  // Quick Presets
  const applyPreset = (preset) => {
    if (preset === 'all') {
      setForm(prev => ({ ...prev, permissions: ['*'] }))
    } else if (preset === 'none') {
      setForm(prev => ({ ...prev, permissions: [] }))
    } else if (preset === 'academic') {
      const keys = ['dashboard', 'academics', 'facilities', 'departments', 'committees']
      ADMIN_PERMISSION_GROUPS.forEach(g => {
        g.menus.forEach(m => {
          if (['academics', 'facilities', 'committees'].includes(m.id) && m.submenus) {
            m.submenus.forEach(s => keys.push(s.id))
          }
        })
      })
      setForm(prev => ({ ...prev, permissions: keys }))
    } else if (preset === 'notices') {
      setForm(prev => ({ ...prev, permissions: ['dashboard', 'notices', 'news', 'events', 'gallery'] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalError('')

    if (!form.name.trim()) {
      setModalError('Please enter the Administrator Full Name.')
      return
    }
    if (!form.email.trim()) {
      setModalError('Please enter the Username / Login ID.')
      return
    }
    if (!editingUser && !form.password) {
      setModalError('Please enter a Password for the administrator.')
      return
    }
    if (!editingUser && form.password.length < 4) {
      setModalError('Password must be at least 4 characters long.')
      return
    }

    setSaving(true)
    setMsg({ text: '', type: '' })

    try {
      if (editingUser?.id) {
        await usersService.update(editingUser.id, form)
        setMsg({ text: `Administrator account "${form.name}" updated successfully.`, type: 'success' })
      } else {
        await usersService.create(form)
        setMsg({ text: `New administrator "${form.name}" created with assigned permissions.`, type: 'success' })
      }
      setModalOpen(false)
      loadUsers()
    } catch (err) {
      console.error('Error saving administrator account:', err)
      setModalError(err.message || 'Error saving administrator account. Please check your inputs.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u) => {
    if (u.id === 1 || u.email === 'devkarma' || u.role === 'devadmin' || u.role === 'superadmin') {
      alert('Master Administrator account cannot be deleted.')
      return
    }
    if ((currentAuthUser?.id || currentAuthUser?.sub) === u.id) {
      alert('You cannot delete your own active administrator account.')
      return
    }
    if (!window.confirm(`Delete administrator account "${u.name}" (${u.email})? This action is permanent.`)) return

    try {
      await usersService.delete(u.id)
      setMsg({ text: `Account for ${u.name} deleted successfully.`, type: 'success' })
      loadUsers()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete user account', type: 'danger' })
    }
  }

  const getPermissionsSummary = (u) => {
    if (u.role === 'devadmin' || u.role === 'superadmin' || u.email === 'devkarma' || u.id === 1) {
      return <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Full Access (All Menus & Database)</span>
    }
    const perms = Array.isArray(u.permissions) ? u.permissions : []
    if (perms.includes('*')) {
      return <span style={{ color: '#2563eb', fontWeight: 600 }}>Unrestricted (All Menus)</span>
    }
    if (perms.length === 0) {
      return <span style={{ color: '#94a3b8' }}>No Menus Assigned</span>
    }

    // Count top-level menus and submenus
    let menuCount = 0
    let subCount = 0
    ADMIN_PERMISSION_GROUPS.forEach(g => {
      g.menus.forEach(m => {
        if (perms.includes(m.id)) menuCount++
        if (m.submenus) {
          m.submenus.forEach(s => {
            if (perms.includes(s.id)) subCount++
          })
        }
      })
    })

    return (
      <span style={{ color: '#0f172a', fontSize: 12.5 }}>
        <strong>{menuCount}</strong> menus, <strong>{subCount}</strong> submenus granted
      </span>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Access Control &amp; Roles</span>
          <h1>Role-Based Access Control (RBAC) &amp; Admins</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Create and manage staff administrator accounts with custom menu and submenu permissions.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleOpenModal()}
            style={{ fontWeight: 600, padding: '10px 20px', fontSize: 14 }}
          >
            + Create New Admin
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 16 }}>
          {msg.text}
        </div>
      )}

      {/* Top Navigation Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`admin-tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Administrator Accounts</span>
          <span className="admin-tab-count">{users.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          <span>User Activity &amp; Audit Logs</span>
        </button>
      </div>

      {activeTab === 'logs' ? (
        <div style={{ marginTop: 8 }}>
          <AdminActivityLogs standalone={false} />
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Admin Accounts</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{users.length}</div>
        </div>
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Accounts</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', marginTop: 4 }}>
            {users.filter(u => u.is_active).length}
          </div>
        </div>
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Master Admins</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1d4ed8', marginTop: 4 }}>
            {users.filter(u => u.role === 'devadmin' || u.role === 'superadmin' || u.email === 'devkarma' || u.id === 1).length}
          </div>
        </div>
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Staff Admins</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
            {users.filter(u => u.role !== 'devadmin' && u.role !== 'superadmin' && u.email !== 'devkarma' && u.id !== 1).length}
          </div>
        </div>
      </div>

      {/* Admins Table Card */}
      <div className="admin-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, margin: 0, color: 'var(--navy-header)' }}>Configured Administrative Accounts</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
              Configure granular access and permissions for administrative staff.
            </p>
          </div>
          <button
            onClick={loadUsers}
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: 12, padding: '5px 12px', display: 'inline-flex', alignItems: 'center' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh List
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            Loading administrator accounts...
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            No accounts found. Click "+ Create New Admin" to add one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Administrator Name</th>
                  <th>Username / Login ID</th>
                  <th>Role</th>
                  <th>Granted Menu Access</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const isDev = isDevAdmin(u)
                  return (
                    <tr key={u.id || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong style={{ color: isDev ? '#1e3a8a' : 'var(--navy-header)' }}>
                          {isDev ? 'Administrator' : u.name}
                        </strong>
                        {isDev && (
                          <span style={{
                            marginLeft: 8,
                            fontSize: 10,
                            padding: '2px 6px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            fontWeight: 700
                          }}>
                            MASTER ADMIN
                          </span>
                        )}
                      </td>
                      <td>
                        <code style={{ fontSize: 12.5, color: '#0f172a' }}>{isDev ? 'devkarma' : u.email}</code>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: isDev ? '#eff6ff' : '#f1f5f9',
                          color: isDev ? '#1d4ed8' : '#334155'
                        }}>
                          {isDev ? 'Master Admin' : 'Staff Admin'}
                        </span>
                      </td>
                      <td>
                        {getPermissionsSummary(u)}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: u.is_active ? '#16a34a' : '#94a3b8'
                        }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: u.is_active ? '#22c55e' : '#cbd5e1' }} />
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            style={{
                              fontSize: 12,
                              padding: '4px 10px',
                              background: '#eff6ff',
                              borderColor: '#bfdbfe',
                              color: '#1d4ed8',
                              fontWeight: 600
                            }}
                            onClick={() => setUserLogsModalTarget(u)}
                            title={`View audit logs, logins & changes by ${u.name || u.email}`}
                          >
                            Audit Logs
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            style={{ fontSize: 12, padding: '4px 10px' }}
                            onClick={() => handleOpenModal(u)}
                          >
                            Permissions
                          </button>
                          {!isDev && (
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger"
                              style={{ fontSize: 12, padding: '4px 8px' }}
                              onClick={() => handleDelete(u)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}

      {/* Modal: Create / Edit Admin & Permissions */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            maxWidth: 860,
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div>
                <h3 style={{ fontSize: 18, margin: 0, color: 'var(--navy-header)' }}>
                  {editingUser ? `Configure Admin Permissions: ${editingUser.name}` : 'Create Role-Based Access Admin'}
                </h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Assign authorized menus and submenus for this administrator.
                </span>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Pinned Top: Error Alert & Basic Details */}
              <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
                {modalError && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    color: '#991b1b',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{modalError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="e.g. Dr. P. Deshmukh"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Username / Login ID *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="e.g. deshmukh_admin"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">
                      {editingUser ? 'New Password (Optional)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      className="admin-input"
                      placeholder={editingUser ? 'Leave blank to retain' : '••••••••••••'}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_active)}
                      onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                    />
                    <span>Account Active (Allowed to log in)</span>
                  </label>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Role: <strong style={{ color: '#2563eb' }}>STAFF ADMIN</strong>
                  </div>
                </div>
              </div>

              {/* Scrollable Middle: Menu & Submenu Access Permissions */}
              <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
                {/* Granular Menu Permissions Header */}
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 15, margin: 0, color: 'var(--navy-header)' }}>
                      Menu & Submenu Access Permissions
                    </h4>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      Select which navigation sections this admin is permitted to see and manage.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 11, padding: '4px 8px' }}
                      onClick={() => applyPreset('all')}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 11, padding: '4px 8px' }}
                      onClick={() => applyPreset('none')}
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 11, padding: '4px 8px' }}
                      onClick={() => applyPreset('academic')}
                    >
                      Academics Only
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: 11, padding: '4px 8px' }}
                      onClick={() => applyPreset('notices')}
                    >
                      Notices/News Only
                    </button>
                  </div>
                </div>

                {/* Permission Groups */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ADMIN_PERMISSION_GROUPS.map(group => (
                    <div key={group.groupId} style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{
                        padding: '8px 14px',
                        background: '#f1f5f9',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#475569',
                        letterSpacing: '0.04em'
                      }}>
                        {group.groupTitle}
                      </div>

                      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                        {group.menus.map(menu => {
                          const hasSub = Boolean(menu.submenus && menu.submenus.length > 0)
                          const isMenuChecked = isPermissionChecked(menu.id)
                          const isExpanded = expandedMenus[menu.id]

                          return (
                            <div
                              key={menu.id}
                              style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                padding: '10px 12px',
                                background: isMenuChecked ? '#eff6ff' : '#ffffff',
                                gridColumn: hasSub ? 'span 2' : 'span 1'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                                  <input
                                    type="checkbox"
                                    checked={isMenuChecked}
                                    onChange={() => {
                                      if (hasSub) {
                                        toggleMenuWithSubmenus(menu)
                                      } else {
                                        togglePermission(menu.id)
                                      }
                                    }}
                                  />
                                  <strong style={{ fontSize: 13, color: isMenuChecked ? '#1d4ed8' : '#334155' }}>
                                    {menu.label}
                                  </strong>
                                </label>

                                {hasSub && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(menu.id)}
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      color: '#2563eb',
                                      fontSize: 12,
                                      cursor: 'pointer',
                                      fontWeight: 600
                                    }}
                                  >
                                    {isExpanded ? '▲ Hide Submenus' : `▼ ${menu.submenus.length} Submenus`}
                                  </button>
                                )}
                              </div>

                              {/* Submenus Checklist */}
                              {hasSub && (isExpanded || isMenuChecked) && (
                                <div style={{
                                  marginTop: 10,
                                  paddingTop: 8,
                                  borderTop: '1px dashed #cbd5e1',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gap: 6,
                                  paddingLeft: 24
                                }}>
                                  {menu.submenus.map(sub => {
                                    const isSubChecked = isPermissionChecked(sub.id)
                                    return (
                                      <label
                                        key={sub.id}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6,
                                          fontSize: 12,
                                          cursor: 'pointer',
                                          color: isSubChecked ? '#1e40af' : '#475569'
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSubChecked}
                                          onChange={() => togglePermission(sub.id)}
                                        />
                                        <span>{sub.label}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pinned Bottom: Modal Footer */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                flexShrink: 0
              }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                  style={{ minWidth: 140, fontWeight: 600 }}
                >
                  {saving ? (editingUser ? 'Saving...' : 'Creating Admin...') : editingUser ? 'Save Permissions' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User-Specific Activity & Audit Logs Modal */}
      {userLogsModalTarget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            maxWidth: 1200,
            width: '100%',
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
              flexShrink: 0
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--navy-header, #0f2d59)' }}>
                    Activity &amp; Change Audit: {userLogsModalTarget.name || 'Administrator'}
                  </h3>
                  <code style={{ fontSize: 12, background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 4 }}>
                    {userLogsModalTarget.email}
                  </code>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                  Live audit trail of logins, IP addresses, and specific modifications made by this administrator.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setUserLogsModalTarget(null)
                    setActiveTab('logs')
                  }}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: 12, padding: '5px 12px' }}
                >
                  Open in Full Logs View ↗
                </button>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setUserLogsModalTarget(null)}
                  title="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              <AdminActivityLogs
                standalone={false}
                initialUserId={userLogsModalTarget.id || userLogsModalTarget.email}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
