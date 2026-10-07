import axios from 'axios'

// Central Axios API Client
// In development, Vite proxies '/api' to 'http://localhost:8000'
// In production on Hostinger, Apache serves '/api' from PHP
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request Interceptor: Attach Auth Token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cop_admin_token')
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`)
      } else {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// Response Interceptor: Handle unauthenticated responses
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin page, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('cop_admin_token')
        localStorage.removeItem('cop_admin_user')
        window.location.href = '/admin/login'
      }
    }
    const message = error.response?.data?.message || error.message || 'Network request failed'
    return Promise.reject(new Error(message))
  }
)

export default api
