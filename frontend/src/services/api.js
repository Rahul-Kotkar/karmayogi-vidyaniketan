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

// Request Interceptor: Attach Auth Token if present and dispatch save feedback
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

    // Trigger save feedback for mutating admin operations (POST, PUT, DELETE, PATCH)
    const method = (config.method || '').toLowerCase()
    const isMutation = ['post', 'put', 'delete', 'patch'].includes(method)
    const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

    if (isMutation && isAdmin && !config.skipToast) {
      const toastId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
      config._toastId = toastId
      
      let verb = 'Saving changes'
      if (method === 'delete') verb = 'Deleting item'
      else if (config.url?.includes('/upload')) verb = 'Uploading file'

      window.dispatchEvent(new CustomEvent('admin:save_start', {
        detail: {
          id: toastId,
          message: `${verb} and updating database...`
        }
      }))
    }

    return config
  },
  error => Promise.reject(error)
)

// Response Interceptor: Handle unauthenticated responses and save feedback
api.interceptors.response.use(
  response => {
    const config = response.config || {}
    if (config._toastId) {
      const resData = response.data
      const isSuccess = resData?.success !== false

      if (!isSuccess) {
        window.dispatchEvent(new CustomEvent('admin:save_error', {
          detail: {
            id: config._toastId,
            title: 'Save Failed',
            message: resData?.message || 'Server reported an error saving changes.'
          }
        }))
      } else {
        window.dispatchEvent(new CustomEvent('admin:save_success', {
          detail: {
            id: config._toastId,
            title: 'Changes Saved Successfully',
            message: resData?.message || 'Your changes have been saved and synced with the database.'
          }
        }))
      }
    }
    return response.data
  },
  error => {
    if (error.config?._toastId) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to save changes.'
      window.dispatchEvent(new CustomEvent('admin:save_error', {
        detail: {
          id: error.config._toastId,
          title: 'Save Failed',
          message: errMsg
        }
      }))
    }

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
