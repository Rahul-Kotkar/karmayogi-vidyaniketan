import React, { useState, useEffect, useRef } from 'react'

/**
 * Universal Toast Feedback Service for Admin Panel
 * Dispatches and listens to 'admin:toast' events across the entire admin application.
 */
export const adminToast = {
  success: (message, title = 'Changes Saved Successfully') => {
    window.dispatchEvent(new CustomEvent('admin:toast', {
      detail: { type: 'success', title, message }
    }))
  },
  error: (message, title = 'Save Failed') => {
    window.dispatchEvent(new CustomEvent('admin:toast', {
      detail: { type: 'error', title, message }
    }))
  },
  saving: (message = 'Saving changes to database...', title = 'Saving...') => {
    const id = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    window.dispatchEvent(new CustomEvent('admin:toast', {
      detail: { id, type: 'loading', title, message }
    }))
    return id
  },
  info: (message, title = 'System Notification') => {
    window.dispatchEvent(new CustomEvent('admin:toast', {
      detail: { type: 'info', title, message }
    }))
  }
}

export default function AdminToastContainer() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const removeToast = (id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const addOrUpdateToast = (toastData) => {
    const id = toastData.id || ('toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5))
    const type = toastData.type || 'success'
    const duration = toastData.duration !== undefined 
      ? toastData.duration 
      : (type === 'loading' ? 0 : (type === 'error' || type === 'danger' ? 7000 : 4500))

    let defaultTitle = 'Saved Successfully'
    if (type === 'loading') defaultTitle = 'Saving Changes...'
    else if (type === 'error' || type === 'danger') defaultTitle = 'Save Failed'
    else if (type === 'info') defaultTitle = 'Information'
    else if (type === 'warning') defaultTitle = 'Attention'

    const title = toastData.title || defaultTitle
    const message = toastData.message || (type === 'loading' ? 'Communicating with server...' : 'Changes persisted to database.')

    setToasts(prev => {
      // Deduplicate identical message within 1.5 seconds unless it's a state transition for the same id
      const isDuplicate = prev.some(t => t.id !== id && t.message === message && (Date.now() - t.createdAt) < 1500)
      if (isDuplicate) return prev

      const existingIdx = prev.findIndex(t => t.id === id)
      const newToast = { id, type, title, message, duration, createdAt: Date.now() }
      if (existingIdx >= 0) {
        const updated = [...prev]
        updated[existingIdx] = newToast
        return updated
      }
      return [...prev.slice(-3), newToast]
    })

    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }

    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail) {
        addOrUpdateToast(e.detail)
      }
    }

    const handleSaveStart = (e) => {
      addOrUpdateToast({
        id: e.detail?.id || 'active_save',
        type: 'loading',
        title: 'Saving Changes...',
        message: e.detail?.message || 'Writing data to server and database...',
        duration: 0
      })
    }

    const handleSaveSuccess = (e) => {
      addOrUpdateToast({
        id: e.detail?.id || 'active_save',
        type: 'success',
        title: e.detail?.title || 'Saved Successfully',
        message: e.detail?.message || 'Your changes have been saved and are live.',
        duration: 4500
      })
    }

    const handleSaveError = (e) => {
      addOrUpdateToast({
        id: e.detail?.id || 'active_save',
        type: 'error',
        title: e.detail?.title || 'Save Failed',
        message: e.detail?.message || 'The server could not save your changes. Please check database connection.',
        duration: 8000
      })
    }

    window.addEventListener('admin:toast', handleToastEvent)
    window.addEventListener('admin:feedback', handleToastEvent)
    window.addEventListener('admin:save_start', handleSaveStart)
    window.addEventListener('admin:save_success', handleSaveSuccess)
    window.addEventListener('admin:save_error', handleSaveError)

    return () => {
      window.removeEventListener('admin:toast', handleToastEvent)
      window.removeEventListener('admin:feedback', handleToastEvent)
      window.removeEventListener('admin:save_start', handleSaveStart)
      window.removeEventListener('admin:save_success', handleSaveSuccess)
      window.removeEventListener('admin:save_error', handleSaveError)
      Object.values(timersRef.current).forEach(clearTimeout)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="admin-toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error' || toast.type === 'danger'
        const isLoading = toast.type === 'loading'
        const isWarning = toast.type === 'warning'

        return (
          <div
            key={toast.id}
            className={`admin-toast admin-toast-${toast.type}`}
            role="status"
          >
            {/* Status Icon */}
            <div className="admin-toast-icon-wrap">
              {isLoading && (
                <svg className="admin-toast-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
              )}
              {isSuccess && (
                <div className="admin-toast-badge-success">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              {isError && (
                <div className="admin-toast-badge-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              )}
              {isWarning && (
                <div className="admin-toast-badge-warning">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="admin-toast-content">
              <div className="admin-toast-title">
                {toast.title}
              </div>
              <div className="admin-toast-message">
                {toast.message}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              className="admin-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ✕
            </button>

            {/* Visual Countdown Progress Bar */}
            {toast.duration > 0 && (
              <div
                className="admin-toast-progress"
                style={{
                  animationDuration: `${toast.duration}ms`
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
