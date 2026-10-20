import React, { createContext, useContext, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../services/endpoints.js'
import { isDevAdmin, hasPermission } from '../data/adminPermissions.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cop_admin_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('cop_admin_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function verifySession() {
      if (token) {
        // If it's a local dev offline session, do not attempt to contact backend
        if (token.startsWith('local_dev_token_') || user?.is_offline_dev) {
          setLoading(false)
          return
        }

        try {
          const res = await authService.getMe()
          if (res?.data) {
            setUser(res.data)
            localStorage.setItem('cop_admin_user', JSON.stringify(res.data))
          }
        } catch (err) {
          // In local dev mode, if backend is offline or server unreachable, do NOT log out if we have a cached user
          if (import.meta.env.DEV && user) {
            console.warn('Backend server is offline. Preserving local development session.')
          } else {
            // Token invalid or expired on live server
            logout()
          }
        }
      }
      setLoading(false)
    }
    verifySession()
  }, [token])

  const login = async (email, password) => {
    const normEmail = (email || '').trim().toLowerCase()
    const isMasterEmail = normEmail === 'devkarma' || normEmail === 'devkarma@gmail.com' || normEmail === 'admin@test.com' || normEmail === 'admin'
    const isMasterPass = password === 'devkarma@123' || password === 'devkarma' || password === 'admin123'

    try {
      const res = await authService.login(email, password)
      if (res?.data?.token) {
        setToken(res.data.token)
        setUser(res.data.user)
        localStorage.setItem('cop_admin_token', res.data.token)
        localStorage.setItem('cop_admin_user', JSON.stringify(res.data.user))
        return res.data
      }
      throw new Error(res?.message || 'Login failed')
    } catch (err) {
      // In local dev environment, allow master administrator bypass when backend is offline or for master credentials
      if (import.meta.env.DEV && (isMasterEmail || isMasterPass)) {
        const localMasterUser = {
          id: 1,
          name: 'Developer Administrator',
          email: normEmail.includes('@') ? normEmail : `${normEmail}@gmail.com`,
          role: 'devadmin',
          permissions: ['*'],
          is_offline_dev: true
        }
        const mockToken = 'local_dev_token_' + Date.now()
        setToken(mockToken)
        setUser(localMasterUser)
        localStorage.setItem('cop_admin_token', mockToken)
        localStorage.setItem('cop_admin_user', JSON.stringify(localMasterUser))
        return { token: mockToken, user: localMasterUser }
      }

      throw err
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cop_admin_token')
    localStorage.removeItem('cop_admin_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!token,
      isDev: isDevAdmin(user),
      hasPermission: (id) => hasPermission(user, id)
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'inherit' }}>
        <p style={{ color: '#1a4f8b', fontWeight: 600 }}>Verifying session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
