import React, { useState, useEffect } from 'react'
import { usersService } from '../../services/endpoints.js'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const { user: currentAuthUser } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    is_active: 1
  })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await usersService.getAll()
      setUsers(data)
    } catch {
      setMsg({ text: 'Failed to load user accounts', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleOpenModal = (u = null) => {
    if (u) {
      setEditingUser(u)
      setForm({
        name: u.name,
        email: u.email,
        password: '',
        role: u.role || 'admin',
        is_active: u.is_active !== undefined ? u.is_active : 1
      })
    } else {
      setEditingUser(null)
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        is_active: 1
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser?.id) {
        await usersService.update(editingUser.id, form)
        setMsg({ text: 'User account updated', type: 'success' })
      } else {
        await usersService.create(form)
        setMsg({ text: 'User account created', type: 'success' })
      }
      setModalOpen(false)
      loadUsers()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving user', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if ((currentAuthUser?.id || currentAuthUser?.sub) === id) {
      alert('You cannot delete your own active administrator account.')
      return
    }
    if (!window.confirm('Delete this administrator account?')) return
    try {
      await usersService.delete(id)
      setMsg({ text: 'User account deleted', type: 'success' })
      loadUsers()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete user', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            User & Administrator Accounts
            <span className="admin-page-badge">Security & Access</span>
          </h1>
          <p>
            Manage staff accounts, authorized administrative credentials, and role privileges.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Add Administrator
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Authorized Users</h3>
          <span style={{ fontSize: 13, color: '#5c6672' }}>Total: {users.length}</span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading user directory...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className="admin-badge badge-info">{u.role}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#5c6672' }}>
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenModal(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingUser ? 'Edit User Account' : 'Create New Account'}</h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={() => setModalOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Official Email *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    className="admin-input"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••••••"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Role</label>
                    <select
                      className="admin-select"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="admin">Administrator (Full Access)</option>
                      <option value="editor">Editor (Content Only)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Account Status</label>
                    <select
                      className="admin-select"
                      value={form.is_active}
                      onChange={e => setForm({ ...form, is_active: parseInt(e.target.value) })}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingUser ? 'Save Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
