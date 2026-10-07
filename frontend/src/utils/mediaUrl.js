// Utility to resolve media/image URLs across local Vite dev server, PHP local backend, and production
export function resolveMediaUrl(path, fallback = '') {
  if (!path) return fallback
  const trimmed = String(path).trim()
  if (!trimmed) return fallback

  // If already absolute or base64 data
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  // In development on Vite (e.g. port 5173 or other non-8000 dev ports), direct to backend port 8000
  if (typeof window !== 'undefined' && window.location && window.location.port === '5173') {
    return `http://localhost:8000${cleanPath}`
  }

  return cleanPath
}
