import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import officialLogo from '../../assets/pandharpur_logo.jpg'
import '../../admin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #05162e 0%, #0a2540 50%, #0f2d59 100%)',
      padding: 16,
      fontFamily: 'var(--body-font, sans-serif)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        maxWidth: 420,
        width: '100%',
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        borderTop: '5px solid #0f2d59'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 72,
            height: 72,
            margin: '0 auto 14px',
            borderRadius: '50%',
            background: '#ffffff',
            padding: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={officialLogo}
              alt="Pandharpur Official College Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ color: '#a11212', fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Shri Pandurang Pratishthan's
          </div>
          <h2 style={{
            color: '#05162e',
            fontSize: 20,
            fontWeight: 800,
            margin: '6px 0 4px',
            lineHeight: 1.25,
            letterSpacing: '-0.01em'
          }}>
            Karmayogi College of Physiotherapy
          </h2>
          <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
            Shelve, Pandharpur — Administration Command
          </div>
        </div>

        {error && (
          <div className="admin-alert alert-danger" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Username or Email Address</label>
            <input
              id="admin-email"
              type="text"
              required
              className="admin-input"
              placeholder="Enter username or email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Secure Password</label>
            <input
              id="admin-password"
              type="password"
              required
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10, fontSize: 14 }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Control Panel'}
          </button>
        </form>

      </div>
    </div>
  )
}
