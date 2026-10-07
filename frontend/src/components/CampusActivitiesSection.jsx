import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DEFAULT_CAMPUS_ACTIVITIES, DEFAULT_BEYOND_CLASSROOM_SPACES } from '../data/studentCornerData.js'

function renderSpaceIcon(icon) {
  switch (icon) {
    case 'flask':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.66 18.25A2 2 0 0 0 6.36 21h11.28a2 2 0 0 0 1.7-2.75L14 9.31V2" />
          <line x1="8.5" y1="2" x2="15.5" y2="2" />
          <line x1="6.5" y1="15" x2="17.5" y2="15" />
        </svg>
      )
    case 'book':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    case 'home':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'gamepad':
    case 'sports':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="2" />
        </svg>
      )
    case 'music':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    case 'users':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'bus':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="15" rx="2" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
          <path d="M5 8h14" />
          <path d="M10 3v5" />
          <path d="M14 3v5" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

export default function CampusActivitiesSection({ activities = DEFAULT_CAMPUS_ACTIVITIES, spaces = DEFAULT_BEYOND_CLASSROOM_SPACES, showSpaces = true }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null)

  const items = Array.isArray(activities) && activities.length > 0 ? activities : DEFAULT_CAMPUS_ACTIVITIES

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex !== null) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const handleKey = (e) => {
        if (e.key === 'Escape') setActivePhotoIndex(null)
        if (e.key === 'ArrowRight') setActivePhotoIndex(prev => (prev + 1) % items.length)
        if (e.key === 'ArrowLeft') setActivePhotoIndex(prev => (prev - 1 + items.length) % items.length)
      }
      window.addEventListener('keydown', handleKey)

      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKey)
      }
    }
  }, [activePhotoIndex, items.length])

  const activeItem = activePhotoIndex !== null ? items[activePhotoIndex] : null

  return (
    <div className="campus-activities-wrap">
      {/* Main Container Card matching Reference Screenshot */}
      <div className="campus-activities-card">
        {/* Section Header */}
        <div className="campus-activities-header">
          <span className="campus-activities-tag">BEYOND THE CLASSROOM</span>
          <h2 className="campus-activities-title">Campus Activities & Student Life</h2>
          <p className="campus-activities-lead">
            Life at Karmayogi College of Physiotherapy extends far beyond classroom lectures. From World Physiotherapy Day symposiums and scientific exhibits to vibrant annual cultural fests, athletics, community medical outreach, and student clubs, our campus offers a vibrant environment for comprehensive personality and leadership development.
          </p>
          <div className="campus-gallery-hint">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>Select an image to view it in a larger format.</span>
          </div>
        </div>

        {/* 3-Column Photo Card Grid matching Reference */}
        <div className="campus-activities-grid">
          {items.map((act, index) => {
            const imgSrc = act.image || act.photo || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
            const badge = act.badge || act.category || 'Campus Life'
            const title = act.title || 'Student Activity'

            return (
              <article
                key={act.id || index}
                className="activity-photo-card"
                onClick={() => setActivePhotoIndex(index)}
              >
                {/* Photo with Blue Ribbon Caption */}
                <div className="activity-card-photo-box">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="activity-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                  {/* Category Pill Tag pinned top-left */}
                  <span className="activity-badge-pill">{badge}</span>

                  {/* Dark Blue Ribbon Banner matching Screenshot 2 */}
                  <div className="activity-blue-ribbon">
                    <span className="activity-ribbon-title">{act.shortTitle || act.ribbon_title || title}</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="activity-zoom-icon"
                      title="View larger format"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                </div>

                {/* Card Content Below Photo */}
                <div className="activity-card-body">
                  <h3 className="activity-content-title">{title}</h3>
                  <p className="activity-content-desc">{act.desc}</p>
                  <button
                    type="button"
                    className="activity-expand-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActivePhotoIndex(index)
                    }}
                  >
                    <span>View in Larger Format</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {/* Optional "Spaces & Experiences that shape student life" (Image 1) */}
        {showSpaces && (
          <div className="campus-spaces-section">
            <div className="campus-spaces-header">
              <span className="campus-activities-tag">BEYOND THE CLASSROOM</span>
              <h3 className="campus-spaces-title">Spaces and experiences that shape student life</h3>
            </div>

            <div className="campus-spaces-grid">
              {(Array.isArray(spaces) && spaces.length > 0 ? spaces : DEFAULT_BEYOND_CLASSROOM_SPACES).map((sp, idx) => (
                <div key={sp.id || idx} className="campus-space-card">
                  <div className="campus-space-icon-box">
                    {renderSpaceIcon(sp.icon)}
                  </div>
                  <h4 className="campus-space-card-title">{sp.title}</h4>
                  <p className="campus-space-card-desc">{sp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / High-Res Image Modal matching Screenshot 2 */}
      {activeItem && typeof document !== 'undefined' && createPortal(
        <div
          className="activity-lightbox-backdrop"
          onClick={() => setActivePhotoIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="activity-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            <div className="activity-lightbox-header">
              <div>
                <span className="activity-lightbox-badge">{activeItem.badge || activeItem.category}</span>
                <h3 className="activity-lightbox-title">{activeItem.title}</h3>
              </div>
              <button
                type="button"
                className="activity-lightbox-close"
                onClick={() => setActivePhotoIndex(null)}
                aria-label="Close image"
              >
                ✕
              </button>
            </div>

            {/* Enlarged Photo Container */}
            <div className="activity-lightbox-img-box">
              <img
                src={activeItem.image || activeItem.photo}
                alt={activeItem.title}
                className="activity-lightbox-img"
              />

              {/* Prev / Next controls */}
              <button
                type="button"
                className="activity-lightbox-arrow prev"
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePhotoIndex((activePhotoIndex - 1 + items.length) % items.length)
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="activity-lightbox-arrow next"
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePhotoIndex((activePhotoIndex + 1) % items.length)
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </div>

            {/* Description & Details Footer */}
            <div className="activity-lightbox-footer">
              <p className="activity-lightbox-desc">{activeItem.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Photo {activePhotoIndex + 1} of {items.length}
                </span>
                <button
                  type="button"
                  className="activity-lightbox-done-btn"
                  onClick={() => setActivePhotoIndex(null)}
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
