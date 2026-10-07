import api from './api.js'
import {
  NOTICES as FALLBACK_NOTICES,
  EVENTS as FALLBACK_EVENTS,
  FACULTY as FALLBACK_FACULTY,
  COURSES as FALLBACK_COURSES,
  DEPARTMENTS as FALLBACK_DEPARTMENTS,
  FACILITIES as FALLBACK_FACILITIES,
  GALLERY as FALLBACK_GALLERY,
  ALBUMS as FALLBACK_ALBUMS,
  COLLEGE as FALLBACK_COLLEGE
} from '../data/collegeData.js'

// --------------------------------------------------------
// LocalStorage & In-Memory Cache Layer (Zero-Flicker Prehydration)
// --------------------------------------------------------
const memoryCache = new Map()
const CACHE_PREFIX = 'cop_cache_'

export function getLocalCache(key, fallback = null) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key)
  }
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(`${CACHE_PREFIX}${key}`) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      memoryCache.set(key, parsed)
      return parsed
    }
  } catch {}
  return fallback
}

export function clearLocalCache(key) {
  memoryCache.delete(key)
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
    }
  } catch {}
}

export function setLocalCache(key, data) {
  if (data === undefined || data === null) {
    clearLocalCache(key)
    return
  }
  memoryCache.set(key, data)
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data))
    }
  } catch {}
}

export function getCachedHomeData() {
  return getLocalCache('home_data', null)
}

export function setCachedHomeData(data) {
  setLocalCache('home_data', data)
}

export function getCachedAboutData() {
  return getLocalCache('about_data', null)
}

export function setCachedAboutData(data) {
  setLocalCache('about_data', data)
}

export function getCachedAdmissionsData() {
  return getLocalCache('admissions_data', null)
}

export function setCachedAdmissionsData(data) {
  setLocalCache('admissions_data', data)
}

export function getCachedResearchData() {
  return getLocalCache('research_data', null)
}

export function setCachedResearchData(data) {
  setLocalCache('research_data', data)
}

export function getCachedCommitteesData() {
  return getLocalCache('committees_data', null)
}

export function setCachedCommitteesData(data) {
  setLocalCache('committees_data', data)
}

export function getCachedPlacementData() {
  return getLocalCache('placement_data', null)
}

export function setCachedPlacementData(data) {
  setLocalCache('placement_data', data)
}

export function getCachedAcademicsData() {
  return getLocalCache('academics_data', null)
}

export function setCachedAcademicsData(data) {
  setLocalCache('academics_data', data)
}

export function getCachedDisclosuresData() {
  return getLocalCache('disclosures_data', null)
}

export function setCachedDisclosuresData(data) {
  setLocalCache('disclosures_data', data)
}

export function getCachedDepartmentsData() {
  return getLocalCache('departments_data', null)
}

export function setCachedDepartmentsData(data) {
  setLocalCache('departments_data', data)
}

export function getCachedAcademicYears() {
  return getLocalCache('academic_years', null)
}

export function setCachedAcademicYears(data) {
  setLocalCache('academic_years', data)
}

export function getCachedNavVisibility() {
  return getLocalCache('nav_visibility', { hiddenMenus: [], hiddenSubmenus: {} })
}

export function setCachedNavVisibility(data) {
  setLocalCache('nav_visibility', data)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nav_visibility_updated', { detail: data }))
  }
}

export function getCachedIQACData() {
  return getLocalCache('iqac_data', null)
}

export function setCachedIQACData(data) {
  setLocalCache('iqac_data', data)
}

export function getCachedSettings() {
  return getLocalCache('settings', null)
}

export function setCachedSettings(data) {
  setLocalCache('settings', data)
}

export function getCachedNotices() {
  return getLocalCache('notices', null)
}

export function setCachedNotices(data) {
  setLocalCache('notices', data)
}

export function getCachedEvents() {
  return getLocalCache('events', null)
}

export function setCachedEvents(data) {
  setLocalCache('events', data)
}

export function getCachedFacilities() {
  return getLocalCache('facilities', null)
}

export function setCachedFacilities(data) {
  setLocalCache('facilities', data)
}

export function getCachedFaculty() {
  return getLocalCache('faculty', null)
}

export function setCachedFaculty(data) {
  setLocalCache('faculty', data)
}

export function getCachedAlbums() {
  return getLocalCache('albums', null)
}

export function setCachedAlbums(data) {
  setLocalCache('albums', data)
}

// --------------------------------------------------------
// Auth Endpoints
// --------------------------------------------------------
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  changePassword: (current_password, new_password) => api.post('/auth/change-password', { current_password, new_password })
}

// --------------------------------------------------------
// Notices Endpoints
// --------------------------------------------------------
export const noticesService = {
  getAll: async (all = false) => {
    try {
      const res = await api.get(`/notices${all ? '?all=1' : ''}`)
      if (res?.data && Array.isArray(res.data)) {
        if (!all) setCachedNotices(res.data)
        return res.data
      }
      return getCachedNotices() || []
    } catch {
      return getCachedNotices() || []
    }
  },
  getById: (id) => api.get(`/notices?id=${id}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices?id=${id}`, data),
  delete: (id) => api.delete(`/notices?id=${id}`)
}

// --------------------------------------------------------
// Events Endpoints
// --------------------------------------------------------
export const eventsService = {
  getAll: async (all = false) => {
    try {
      const res = await api.get(`/events${all ? '?all=1' : ''}`)
      if (res?.data && Array.isArray(res.data)) {
        if (!all) setCachedEvents(res.data)
        return res.data
      }
      return getCachedEvents() || []
    } catch {
      return getCachedEvents() || []
    }
  },
  getById: (id) => api.get(`/events?id=${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events?id=${id}`, data),
  delete: (id) => api.delete(`/events?id=${id}`)
}

// --------------------------------------------------------
// Faculty Endpoints
// --------------------------------------------------------
export const facultyService = {
  getAll: async (all = false) => {
    try {
      const cacheBust = `t=${Date.now()}`
      const url = all ? `/faculty?all=1&${cacheBust}` : `/faculty?${cacheBust}`
      const res = await api.get(url)
      const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : null)
      if (items !== null) {
        if (!all) setCachedFaculty(items)
        return items
      }
      return getCachedFaculty() || []
    } catch {
      return getCachedFaculty() || []
    }
  },
  getById: (id) => api.get(`/faculty?id=${id}&t=${Date.now()}`),
  create: async (data) => {
    const res = await api.post('/faculty', data)
    clearLocalCache('faculty')
    return res
  },
  update: async (id, data) => {
    const res = await api.put(`/faculty?id=${id}`, data)
    clearLocalCache('faculty')
    return res
  },
  delete: async (id) => {
    const res = await api.delete(`/faculty?id=${id}`)
    clearLocalCache('faculty')
    return res
  }
}

// --------------------------------------------------------
// Departments Endpoints
// --------------------------------------------------------
export const departmentsService = {
  getAll: async () => {
    try {
      const res = await api.get('/departments')
      if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data
      }
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data
      }
      return getCachedDepartmentsData() || FALLBACK_DEPARTMENTS
    } catch {
      return getCachedDepartmentsData() || FALLBACK_DEPARTMENTS
    }
  },
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments?id=${id}`, data),
  delete: (id) => api.delete(`/departments?id=${id}`)
}

// --------------------------------------------------------
// Courses Endpoints
// --------------------------------------------------------
export const coursesService = {
  getAll: async () => {
    try {
      const res = await api.get('/courses')
      return (res?.data && res.data.length > 0) ? res.data : FALLBACK_COURSES
    } catch {
      return FALLBACK_COURSES
    }
  },
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses?id=${id}`, data),
  delete: (id) => api.delete(`/courses?id=${id}`)
}

// --------------------------------------------------------
// Facilities Endpoints
// --------------------------------------------------------
export const facilitiesService = {
  getAll: async () => {
    try {
      const res = await api.get('/facilities')
      if (res?.data && Array.isArray(res.data)) {
        setCachedFacilities(res.data)
        return res.data
      }
      return getCachedFacilities() || []
    } catch {
      return getCachedFacilities() || []
    }
  },
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities?id=${id}`, data),
  delete: (id) => api.delete(`/facilities?id=${id}`)
}

// --------------------------------------------------------
// Gallery Endpoints
// --------------------------------------------------------
export const galleryService = {
  getAlbums: async () => {
    try {
      const res = await api.get('/gallery/albums')
      if (res?.data && res.data.length > 0) {
        setCachedAlbums(res.data)
        return res.data
      }
      return getCachedAlbums() || FALLBACK_ALBUMS
    } catch {
      return getCachedAlbums() || FALLBACK_ALBUMS
    }
  },
  getAlbumById: async (id) => {
    try {
      const res = await api.get(`/gallery/albums?id=${id}`)
      return res?.data || null
    } catch {
      return null
    }
  },
  createAlbum: (data) => api.post('/gallery/albums', data),
  updateAlbum: (data) => api.post('/gallery/albums', data),
  deleteAlbum: (id) => api.delete(`/gallery/albums?id=${id}`),
  addPhotos: (albumId, photos) => api.post('/gallery/photos', { album_id: albumId, photos }),
  deletePhoto: (id) => api.delete(`/gallery/photos?id=${id}`),
  updatePhoto: (id, data) => api.put(`/gallery/photos?id=${id}`, data),
  getAll: async () => {
    try {
      const res = await api.get('/gallery/albums')
      if (res?.data && res.data.length > 0) {
        setCachedAlbums(res.data)
        return res.data
      }
      return getCachedAlbums() || FALLBACK_ALBUMS
    } catch {
      return getCachedAlbums() || FALLBACK_ALBUMS
    }
  },
  getAllRaw: async () => {
    try {
      const res = await api.get('/gallery/albums')
      return res?.data || []
    } catch {
      return []
    }
  },
  getCategories: async () => {
    try {
      const res = await api.get('/gallery/categories')
      return res?.data || []
    } catch {
      return []
    }
  },
  createCategory: (data) => api.post('/gallery/categories', data),
  create: (data) => api.post('/gallery', data),
  delete: (id) => api.delete(`/gallery?id=${id}`)
}

// --------------------------------------------------------
// Admissions Endpoints
// --------------------------------------------------------
export const admissionsService = {
  getAll: async () => {
    try {
      const res = await api.get('/admissions')
      return res?.data || []
    } catch {
      return []
    }
  },
  save: (data) => api.post('/admissions', data)
}

// --------------------------------------------------------
// CMS Pages Endpoints
// --------------------------------------------------------
export const pagesService = {
  getBySlug: async (slug) => {
    try {
      const res = await api.get(`/pages?slug=${slug}`)
      if (res?.data) {
        setLocalCache(`page_${slug}`, res.data)
        if (res.data.content_html) {
          try {
            const parsed = JSON.parse(res.data.content_html)
            if (slug === 'home') setCachedHomeData(parsed)
            if (slug === 'about') setCachedAboutData(parsed)
            if (slug === 'admissions') setCachedAdmissionsData(parsed)
            if (slug === 'research') setCachedResearchData(parsed)
            if (slug === 'committees') setCachedCommitteesData(parsed)
            if (slug === 'training-placement') setCachedPlacementData(parsed)
            if (slug === 'academics') setCachedAcademicsData(parsed)
            if (slug === 'mandatory-disclosures') setCachedDisclosuresData(parsed)
            if (slug === 'departments') setCachedDepartmentsData(parsed)
            if (slug === 'academic_years') setCachedAcademicYears(parsed)
            if (slug === 'navigation_visibility') setCachedNavVisibility(parsed)
            if (slug === 'iqac-naac') setCachedIQACData(parsed)
          } catch {}
        }
        return res.data
      }
      return getLocalCache(`page_${slug}`, null)
    } catch {
      return getLocalCache(`page_${slug}`, null)
    }
  },
  getAll: async () => {
    try {
      const res = await api.get('/pages')
      return (res?.data && res.data.length > 0) ? res.data : []
    } catch {
      return []
    }
  },
  save: async (data) => {
    const res = await api.post('/pages', data)
    if (data?.slug) {
      setLocalCache(`page_${data.slug}`, data)
      if (data.content_html) {
        try {
          const parsed = JSON.parse(data.content_html)
          if (data.slug === 'home') setCachedHomeData(parsed)
          if (data.slug === 'about') setCachedAboutData(parsed)
          if (data.slug === 'admissions') setCachedAdmissionsData(parsed)
          if (data.slug === 'research') setCachedResearchData(parsed)
          if (data.slug === 'committees') setCachedCommitteesData(parsed)
          if (data.slug === 'training-placement') setCachedPlacementData(parsed)
          if (data.slug === 'academics') setCachedAcademicsData(parsed)
          if (data.slug === 'mandatory-disclosures') setCachedDisclosuresData(parsed)
          if (data.slug === 'departments') setCachedDepartmentsData(parsed)
          if (data.slug === 'academic_years') setCachedAcademicYears(parsed)
          if (data.slug === 'navigation_visibility') setCachedNavVisibility(parsed)
        } catch {}
      }
    }
    return res
  }
}

// --------------------------------------------------------
// Contact Messages Endpoints
// --------------------------------------------------------
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: async () => {
    const res = await api.get('/contact')
    return res?.data || []
  },
  updateStatus: (id, status, notes = '') => api.put(`/contact?id=${id}`, { status, admin_notes: notes }),
  delete: (id) => api.delete(`/contact?id=${id}`)
}

// --------------------------------------------------------
// Users Endpoints (Admin Management)
// --------------------------------------------------------
export const usersService = {
  getAll: async () => {
    const res = await api.get('/users')
    return res?.data || []
  },
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users?id=${id}`, data),
  delete: (id) => api.delete(`/users?id=${id}`)
}

// --------------------------------------------------------
// Settings Endpoints
// --------------------------------------------------------
export const settingsService = {
  get: async () => {
    try {
      const res = await api.get('/settings')
      if (res?.data && Object.keys(res.data).length > 0) {
        setCachedSettings(res.data)
        return res.data
      }
      return getCachedSettings() || FALLBACK_COLLEGE
    } catch {
      return getCachedSettings() || FALLBACK_COLLEGE
    }
  },
  update: async (data) => {
    const res = await api.post('/settings', data)
    setCachedSettings(data)
    return res
  }
}

// --------------------------------------------------------
// Dashboard Stats Endpoint
// --------------------------------------------------------
export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats')
    return res?.data || {
      counts: { notices: 0, events: 0, faculty: 0, courses: 0, gallery: 0, messages: 0 },
      recent_messages: [],
      recent_notices: []
    }
  }
}

// --------------------------------------------------------
// Database Migrations Endpoint (DevAdmin Only)
// --------------------------------------------------------
export const migrationsService = {
  getStatus: async () => {
    try {
      const res = await api.get('/migrations')
      const payload = res?.migrations ? res : (res?.data?.migrations ? res.data : (res?.data || res))
      return payload || { db_connected: false, migrations: [], total: 0, pending: 0 }
    } catch (err) {
      return { db_connected: false, db_error: err.message, migrations: [], total: 0, pending: 0 }
    }
  },
  runMigrations: async (options = {}) => {
    return api.post('/migrations', { action: 'migrate', ...options })
  }
}

// --------------------------------------------------------
// Upload Endpoint
// --------------------------------------------------------
export const uploadService = {
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res?.data?.url
  }
}

// --------------------------------------------------------
// User Activity & Audit Logs Endpoint
// --------------------------------------------------------
export const activityLogsService = {
  getAll: async (params = {}) => {
    try {
      const qs = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.append(k, v)
      })
      const url = qs.toString() ? `/logs?${qs.toString()}` : '/logs'
      const res = await api.get(url)
      return res?.data || { logs: [], total: 0, page: 1, limit: 50, total_pages: 1 }
    } catch (err) {
      return { logs: [], total: 0, page: 1, limit: 50, total_pages: 1, error: err.message }
    }
  },
  getUserLogs: async (userId, params = {}) => {
    return activityLogsService.getAll({ user_id: userId, ...params })
  },
  getStats: async () => {
    try {
      const res = await api.get('/logs/stats')
      return res?.data || { total_logs: 0, total_logins: 0, total_changes: 0, today_logins: 0, today_changes: 0, active_users_30d: 0 }
    } catch {
      return { total_logs: 0, total_logins: 0, total_changes: 0, today_logins: 0, today_changes: 0, active_users_30d: 0 }
    }
  }
}
