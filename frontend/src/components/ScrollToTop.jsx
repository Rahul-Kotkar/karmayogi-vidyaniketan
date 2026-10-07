import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop
 * Ensures that whenever navigating between routes, menus, or subpages,
 * the viewport immediately starts from the top of the new page.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    // If there is an explicit hash target (e.g. #recruiter-network), scroll to it
    if (hash) {
      const timer = setTimeout(() => {
        const id = hash.replace('#', '')
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }
      }, 60)
      return () => clearTimeout(timer)
    }

    // When navigating to any menu or page, temporarily disable smooth scroll
    // so the page immediately starts from the top without sluggish animation
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const frameId = requestAnimationFrame(() => {
      html.style.scrollBehavior = prevBehavior || ''
    })

    return () => cancelAnimationFrame(frameId)
  }, [pathname, search, hash])

  return null
}
