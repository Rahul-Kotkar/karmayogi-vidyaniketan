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
        try {
          const res = await authService.getMe()
          if (res?.data) {
            setUser(res.data)
            localStorage.setItem('cop_admin_user', JSON.stringify(res.data))
          }
        } catch {
          // Token invalid or expired
          logout()
        }
      }
      setLoading(false)
    }
    verifySession()
  }, [token])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    if (res?.data?.token) {
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('cop_admin_token', res.data.token)
      localStorage.setItem('cop_admin_user', JSON.stringify(res.data.user))
      return res.data
    }
    throw new Error(res?.message || 'Login failed')
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
