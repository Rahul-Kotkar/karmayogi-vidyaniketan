import React, { useState, useEffect } from 'react'
import { migrationsService } from '../../services/endpoints.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import { isDevAdmin } from '../../data/adminPermissions.js'

export default function AdminMigrations() {
  const { user } = useAuth()
  const [data, setData] = useState({
    db_connected: false,
    db_error: '',
    db_config: null,
    migrations: [],
    total: 0,
    pending: 0
  })
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    db: '',
    user: '',
    pass: ''
  })
  const [backups, setBackups] = useState([])
  const [backingUp, setBackingUp] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const loadStatus = async () => {
    setLoading(true)
    try {
      const res = await migrationsService.getStatus()
      const payload = res?.migrations ? res : (res?.data?.migrations ? res.data : (res?.data || res))
      if (payload) {
        const isConnected = Boolean(payload.db_connected)
        setData({
          db_connected: isConnected,
          db_error: payload.db_error || '',
          db_config: payload.db_config || null,
          migrations: Array.isArray(payload.migrations) ? payload.migrations : [],
          total: payload.total !== undefined ? payload.total : (payload.migrations?.length || 0),
          pending: payload.pending !== undefined ? payload.pending : (payload.migrations?.filter(m => !m.executed)?.length || 0)
        })

        if (payload.backups && Array.isArray(payload.backups)) {
          setBackups(payload.backups)
        }

        if (payload.db_config) {
          setDbConfig(prev => ({
            ...prev,
            host: payload.db_config.host || 'localhost',
            port: payload.db_config.port || '3306',
            db: payload.db_config.db || '',
            user: payload.db_config.user || '',
            pass: ''
          }))
        }

        if (!isConnected) {
          setShowConfig(true)
        }
      }
    } catch (err) {
      setMsg({ text: 'Failed to inspect database migrations: ' + err.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  useEffect(() => {
    if (msg.text && msg.type === 'success') {
      const timer = setTimeout(() => {
        setMsg({ text: '', type: '' })
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [msg])

  const handleSaveDbConfig = async (e) => {
    if (e) e.preventDefault()
    setSavingConfig(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await migrationsService.saveDbConfig(dbConfig)
      if (res?.success) {
        setMsg({
          text: res?.message || 'Database connected and credentials updated in .env successfully!',
          type: 'success'
        })
        setShowConfig(false)
        await loadStatus()
      } else {
        setMsg({
          text: res?.message || 'Database connection test failed. Please verify credentials.',
          type: 'danger'
        })
      }
    } catch (err) {
      setMsg({
        text: 'Error connecting to database: ' + (err?.response?.data?.message || err.message),
        type: 'danger'
      })
    } finally {
      setSavingConfig(false)
    }
  }

  const handleCreateBackup = async () => {
    setBackingUp(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await migrationsService.createBackup()
      setMsg({
        text: res?.message || 'Database snapshot created successfully!',
        type: res?.success ? 'success' : 'danger'
      })
      await loadStatus()
    } catch (err) {
      setMsg({ text: 'Backup failed: ' + err.message, type: 'danger' })
    } finally {
      setBackingUp(false)
    }
  }

  const handleRestoreBackup = async (filename) => {
    if (!window.confirm(`Restore database from snapshot "${filename}"?\n\nWARNING: Current table rows will be replaced by the contents of this snapshot. Only proceed if you intend to revert.`)) return
    setRestoring(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await migrationsService.restoreBackup(filename)
      setMsg({
        text: res?.message || 'Database snapshot restored successfully!',
        type: res?.success ? 'success' : 'danger'
      })
      await loadStatus()
    } catch (err) {
      setMsg({ text: 'Snapshot restore failed: ' + err.message, type: 'danger' })
    } finally {
      setRestoring(false)
    }
  }

  const handleRunMigrations = async () => {
    if (data.pending === 0) {
      setMsg({
        text: 'All schema migrations are already applied and up to date. Seed re-runs are permanently shielded to protect your live admin data.',
        type: 'info'
      })
      return
    }

    const promptText = `Run all ${data.pending} pending SQL database migration(s) now? An automated safety backup will be created first.`
    if (!window.confirm(promptText)) return
    setRunning(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await migrationsService.runMigrations({})
      setMsg({
        text: res?.message || 'Database migrations executed successfully! All tables are up to date.',
        type: res?.success ? 'success' : 'warning'
      })
      await loadStatus()
    } catch (err) {
      setMsg({ text: 'Error running migrations: ' + err.message, type: 'danger' })
    } finally {
      setRunning(false)
    }
  }

  const handleRunSingle = async (file) => {
    if (file.toLowerCase().includes('seed')) {
      alert('Baseline demo seeds are permanently protected and cannot be re-executed on an active database to prevent overwriting your customized admin data.')
      return
    }
    if (!window.confirm(`Execute SQL migration script "${file}" on the active database now?`)) return
    setRunning(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await migrationsService.runMigrations({ file, force: true })
      setMsg({
        text: res?.message || `Migration script "${file}" executed successfully!`,
        type: res?.success ? 'success' : 'warning'
      })
      await loadStatus()
    } catch (err) {
      setMsg({ text: `Error running "${file}": ` + err.message, type: 'danger' })
    } finally {
      setRunning(false)
    }
  }

  if (!isDevAdmin(user)) {
    return (
      <div className="admin-card" style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626', margin: '0 0 10px' }}>Access Restricted</h2>
        <p style={{ color: '#64748b' }}>
          Database migrations management is restricted to authorized administrators.
        </p>
      </div>
    )
  }

  const executedCount = data.total - data.pending

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">System Maintenance</span>
          <h1>Database Migrations</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Inspect database schema status and execute pending SQL table migrations.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className={`admin-btn ${showConfig ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setShowConfig(!showConfig)}
            title="Configure MySQL database host, username, and password"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            <span>{showConfig ? 'Close DB Config' : 'DB Connection Settings'}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleCreateBackup}
            disabled={loading || running || backingUp}
            title="Create an instantaneous snapshot backup of current database rows"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{backingUp ? 'Saving Snapshot...' : 'Backup Snapshot'}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={loadStatus}
            disabled={loading || running}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className={`admin-btn ${data.pending > 0 ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={handleRunMigrations}
            disabled={loading || running || data.pending === 0}
            style={data.pending === 0 ? { opacity: 0.85, cursor: 'default' } : {}}
            title={data.pending === 0 ? 'All schema migrations applied' : 'Run pending schema migrations'}
          >
            {data.pending === 0 ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>Schema Up to Date</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                <span>
                  {running
                    ? 'Executing Migrations...'
                    : `Run ${data.pending} Pending Migration${data.pending > 1 ? 's' : ''}`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div
          className={`admin-alert alert-${msg.type}`}
          style={{
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <span>{msg.text}</span>
          <button
            type="button"
            onClick={() => setMsg({ text: '', type: '' })}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontWeight: 700,
              fontSize: 16,
              padding: '0 4px',
              lineHeight: 1
            }}
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Database Connection Configuration Card */}
      {showConfig && (
        <div className="admin-card" style={{ marginBottom: 20, border: data.db_connected ? '1px solid #e2e8f0' : '1.5px solid #f59e0b', background: '#ffffff' }}>
          <div className="admin-card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>MySQL Database Credentials</h3>
                <span className={`admin-badge ${data.db_connected ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>
                  {data.db_connected ? 'Connected' : 'Connection Required'}
                </span>
              </div>
              <span style={{ fontSize: 13, color: '#64748b', marginTop: 4, display: 'block' }}>
                Test and securely save MySQL database settings directly to the server's <code>.env</code> file.
              </span>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => setShowConfig(false)}
            >
              Hide
            </button>
          </div>

          <div className="admin-card-body" style={{ padding: '18px 20px' }}>
            {data.db_error && !data.db_connected && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 16,
                fontSize: 13,
                color: '#92400e'
              }}>
                <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Current Connection Error:
                </div>
                <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontSize: 12, wordBreak: 'break-all' }}>
                  {data.db_error}
                </code>
                <div style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.5, color: '#78350f' }}>
                  <strong>Hostinger hPanel checklist:</strong><br />
                  1. Go to <strong>Hostinger hPanel &rarr; Databases &rarr; MySQL Databases</strong>.<br />
                  2. Ensure user <code>{dbConfig.user || 'u495202283_shnproduser'}</code> is assigned to the database with <strong>All Privileges</strong>.<br />
                  3. If unsure of the password, click <strong>... (three dots) &rarr; Change Password</strong> next to the user in Hostinger, enter the new password below, and click <strong>Test Connection &amp; Save</strong>.
                </div>
              </div>
            )}

            <form onSubmit={handleSaveDbConfig}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Database Host
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={dbConfig.host}
                    onChange={e => setDbConfig({ ...dbConfig, host: e.target.value })}
                    placeholder="localhost or 127.0.0.1"
                    required
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Usually 'localhost' on Hostinger</span>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Port
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={dbConfig.port}
                    onChange={e => setDbConfig({ ...dbConfig, port: e.target.value })}
                    placeholder="3306"
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Default: 3306</span>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Database Name
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={dbConfig.db}
                    onChange={e => setDbConfig({ ...dbConfig, db: e.target.value })}
                    placeholder="e.g. u495202283_shnproddb"
                    required
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Exact DB Name in Hostinger</span>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Database Username
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={dbConfig.user}
                    onChange={e => setDbConfig({ ...dbConfig, user: e.target.value })}
                    placeholder="e.g. u495202283_shnproduser"
                    required
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Exact Username in Hostinger</span>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Database Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="admin-input"
                      value={dbConfig.pass}
                      onChange={e => setDbConfig({ ...dbConfig, pass: e.target.value })}
                      placeholder="Enter MySQL user password"
                      style={{ paddingRight: 40 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: 12,
                        padding: '4px'
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Set via Hostinger hPanel</span>
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={savingConfig || !dbConfig.user || !dbConfig.db}
                  style={{ minWidth: 200 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{savingConfig ? 'Testing & Saving...' : 'Test Connection & Save to .env'}</span>
                </button>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Verifies connection immediately before saving to prevent invalid configurations.
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="admin-card" style={{ padding: '16px 18px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Database Status
            </span>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0b63e5',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 600,
                padding: 0
              }}
            >
              {showConfig ? 'Hide' : 'Configure'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: data.db_connected ? '#16a34a' : '#ef4444'
            }} />
            <strong style={{ fontSize: 15, color: '#0f172a' }}>
              {data.db_connected ? 'Connected' : 'Disconnected'}
            </strong>
          </div>
          <div style={{ fontSize: 12, color: data.db_connected ? '#16a34a' : '#ef4444', marginTop: 4 }}>
            {data.db_connected ? 'MySQL active' : 'Access denied / wrong password'}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 18px', margin: 0 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Scripts
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>
            {data.total}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Versioned SQL files
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 18px', margin: 0 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Executed
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>
            {executedCount}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Applied to database
          </div>
        </div>

        <div className="admin-card" style={{ padding: '16px 18px', margin: 0 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pending
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: data.pending > 0 ? '#0b63e5' : '#0f172a', marginTop: 6 }}>
            {data.pending}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            {data.pending === 0 ? 'All up to date' : 'Awaiting execution'}
          </div>
        </div>
      </div>

      {/* Migrations Table Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Database Migration Scripts</h3>
            <span style={{ fontSize: 13, color: '#5c6672' }}>
              Sequential SQL scripts tracking schema and table structures
            </span>
          </div>
          <span className="admin-tab-count">
            {data.migrations.length} scripts
          </span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              Checking migration files...
            </div>
          ) : data.migrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              No SQL migration files found.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th style={{ width: 250 }}>Migration Script File</th>
                  <th>Description & Purpose</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 170 }}>Executed Date</th>
                  <th style={{ width: 120, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.migrations.map((m, idx) => {
                  const isExecuted = m.executed
                  return (
                    <tr key={m.file || idx}>
                      <td><span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>{idx + 1}</span></td>
                      <td>
                        <code style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                          {m.file}
                        </code>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.45 }}>
                          {m.description || 'Database schema update script'}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${isExecuted ? 'badge-success' : 'badge-warning'}`}>
                          {isExecuted ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <span>Executed</span>
                            </>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, color: '#64748b' }}>
                          {m.executed_at || 'Awaiting execution'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {m.file.toLowerCase().includes('seed') ? (
                          <span style={{
                            fontSize: 11,
                            color: '#059669',
                            fontWeight: 600,
                            padding: '3px 8px',
                            background: '#ecfdf5',
                            borderRadius: 4,
                            border: '1px solid #a7f3d0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }} title="Baseline demo seeds are locked to prevent overwriting your live admin data">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Locked (Seed)
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: 12, minHeight: 30 }}
                            onClick={() => handleRunSingle(m.file)}
                            disabled={running || loading}
                            title={isExecuted ? 'Re-execute this migration script' : 'Execute this migration script'}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <span>{isExecuted ? 'Re-run' : 'Run'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Database Snapshots & Auto-Backups Card */}
      <div className="admin-card" style={{ marginTop: 24, background: '#ffffff' }}>
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Database Snapshots &amp; Auto-Backups</h3>
            <span style={{ fontSize: 13, color: '#64748b', marginTop: 4, display: 'block' }}>
              Automatic point-in-time snapshots created before migrations, protecting your customized admin data from loss.
            </span>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleCreateBackup}
            disabled={loading || running || backingUp}
            style={{ fontSize: 12.5 }}
          >
            {backingUp ? 'Creating Snapshot...' : '+ Create Manual Snapshot'}
          </button>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {backups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b', fontSize: 13 }}>
              No snapshots created yet. Click <strong>"+ Create Manual Snapshot"</strong> to create a point-in-time restore point.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 45 }}>#</th>
                  <th>Snapshot File</th>
                  <th style={{ width: 180 }}>Created Timestamp</th>
                  <th style={{ width: 120 }}>Size</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Restore</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b, idx) => (
                  <tr key={b.filename}>
                    <td><span style={{ fontSize: 12, color: '#64748b' }}>{idx + 1}</span></td>
                    <td>
                      <code style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                        {b.filename}
                      </code>
                    </td>
                    <td><span style={{ fontSize: 12.5, color: '#334155' }}>{b.created_at}</span></td>
                    <td><span style={{ fontSize: 12, color: '#64748b' }}>{Math.round((b.size_bytes || 0) / 1024)} KB</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '3px 8px', fontSize: 11.5, minHeight: 28 }}
                        onClick={() => handleRestoreBackup(b.filename)}
                        disabled={restoring || loading || running}
                        title="Revert database rows to this snapshot"
                      >
                        {restoring ? 'Restoring...' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Safety & Integrity Information Box */}
      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="admin-card-header">
          <h3>Data Protection &amp; Integrity Policy</h3>
        </div>
        <div className="admin-card-body" style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong>How is your admin data protected?</strong> All SQL migration scripts are strictly additive (<code>CREATE TABLE IF NOT EXISTS</code> and <code>ADD COLUMN</code>). Baseline demo seeds use <code>INSERT IGNORE</code> and are permanently locked on active databases, ensuring custom changes made from the admin panel can <strong>never</strong> be overridden or erased by migrations.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Automated Pre-Migration Backups:</strong> Whenever migrations or updates are executed, the system automatically takes an instantaneous snapshot of all tables into <code>persistent_storage/backups/</code>. You can also click <strong>"Backup Snapshot"</strong> at any time to save a custom restore point.
          </p>
        </div>
      </div>
    </div>
  )
}
