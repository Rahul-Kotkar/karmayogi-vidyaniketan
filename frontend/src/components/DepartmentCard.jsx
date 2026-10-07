import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

// High-resolution photography fallbacks for each physiotherapy discipline
const DEPT_FALLBACK_IMAGES = {
  msk: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
  neuro: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
  cardio: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  community: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  electro: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  kinesio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
  'med-sci': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
  foundations: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80'
}

const DEFAULT_DEPT_PHOTO = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'

// Distinctive SVG icons for each department discipline
function renderDeptIcon(department) {
  const s = String(department?.icon || department?.slug || department?.id || department?.code || '').toLowerCase()

  if (s.includes('bone') || s.includes('msk') || s.includes('musculo') || s.includes('ortho')) {
    // Orthopedic bone / joint kinetics
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 10c.7-.7 1.6-1 2.5-1a3.5 3.5 0 0 1 0 7c-.9 0-1.8-.3-2.5-1l-7 7c-.7.7-1.6 1-2.5 1a3.5 3.5 0 0 1 0-7c.9 0 1.8.3 2.5 1l7-7z" />
        <circle cx="19.5" cy="11.5" r="1.5" />
        <circle cx="4.5" cy="19.5" r="1.5" />
      </svg>
    )
  }

  if (s.includes('brain') || s.includes('neuro')) {
    // Neurological brain / neural network
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
      </svg>
    )
  }

  if (s.includes('heart') || s.includes('cardio') || s.includes('pulmo')) {
    // Cardiopulmonary / ECG pulse
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" />
      </svg>
    )
  }

  if (s.includes('sport') || s.includes('run') || s.includes('athlet') || s.includes('activity')) {
    // Sports physiotherapy & performance
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  }

  if (s.includes('communit') || s.includes('cbr') || s.includes('user') || s.includes('public')) {
    // Community-based rehabilitation & outreach
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

  if (s.includes('zap') || s.includes('electro') || s.includes('agent') || s.includes('modalit')) {
    // Electrotherapy & physical modalities
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  }

  if (s.includes('compass') || s.includes('kinesi') || s.includes('biomech') || s.includes('motion')) {
    // Kinesiology, kinematics & biomechanics
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  }

  if (s.includes('book') || s.includes('foundation') || s.includes('med') || s.includes('anat') || s.includes('micro')) {
    // Foundational Medical Sciences / anatomy & research
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  }

  // Clinical Stethoscope fallback
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  )
}

export default function DepartmentCard({ department }) {
  if (!department) return null

  const [modalOpen, setModalOpen] = useState(false)

  // Lock body scroll and listen for Escape key when popup is open
  useEffect(() => {
    if (modalOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setModalOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [modalOpen])

  // Resolve code abbreviation
  const resolveCode = () => {
    if (department.code && String(department.code).trim()) {
      return String(department.code).trim().toUpperCase()
    }
    const s = String(department.slug || department.id || '').toLowerCase()
    if (s.includes('msk') || s.includes('musculo')) return 'MSK'
    if (s.includes('neuro')) return 'NEURO'
    if (s.includes('cardio')) return 'CARDIO'
    if (s.includes('sport')) return 'SPORTS'
    if (s.includes('communit')) return 'COMMUNITY'
    if (s.includes('electro')) return 'ELECTRO'
    if (s.includes('kinesi')) return 'KINESIO'
    if (s.includes('foundation') || s.includes('anat')) return 'MED-SCI'
    if (department.id && isNaN(department.id) && String(department.id).length <= 8) {
      return String(department.id).toUpperCase()
    }
    if (department.slug && String(department.slug).length <= 8) {
      return String(department.slug).toUpperCase()
    }
    return 'DEPT'
  }

  const deptCode = resolveCode()
  const subjectCount = Number(department.subject_count) || department.relatedSubjectIds?.length || department.subjectCount || 0

  // 1. Clean Title for Card (clean discipline title e.g. "Musculoskeletal Physiotherapy" matching reference)
  const rawName = String(department.name || 'Physiotherapy Department').trim()
  const displayTitle = department.shortName || rawName.replace(/^Department of\s+/i, '') || rawName
  const formalDeptTitle = /^Department of /i.test(rawName) ? rawName : `Department of ${rawName}`

  // 2. Concise Description for Card Face (2-3 lines matching reference)
  const rawTagline = department.tagline || ''
  const rawOverview = String(department.overview || department.description || department.desc || '')
  const displayDesc = rawTagline || (rawOverview.length > 130 ? `${rawOverview.slice(0, 130)}...` : rawOverview) || 'Specialized clinical education, advanced diagnosis, and evidence-informed physiotherapy practice.'

  // 3. Resolve Image for Banner
  const resolveImage = () => {
    if (department.image_url && String(department.image_url).trim()) return department.image_url
    if (department.bannerImage && String(department.bannerImage).trim()) return department.bannerImage
    if (department.photo && String(department.photo).trim()) return department.photo

    const idKey = String(department.id || department.slug || '').toLowerCase()
    for (const key of Object.keys(DEPT_FALLBACK_IMAGES)) {
      if (idKey.includes(key)) return DEPT_FALLBACK_IMAGES[key]
    }
    return DEFAULT_DEPT_PHOTO
  }

  const displayImage = resolveImage()

  // 4. Specialization Pills (shown in Show More modal)
  const specs = Array.isArray(department.specializations)
    ? department.specializations
    : typeof department.specializations === 'string'
      ? department.specializations.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : []

  return (
    <>
      <article className="dept-overview-card">
        {/* Photo Header with Pinned Navy Icon Badge matching Reference Screenshot */}
        <div
          className="dept-card-photo-wrap"
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setModalOpen(true) }}
          aria-label={`View details of ${displayTitle}`}
        >
          <img
            src={displayImage}
            alt={displayTitle}
            className="dept-card-photo"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = DEFAULT_DEPT_PHOTO
            }}
          />
          <div className="dept-card-icon-badge" title={deptCode}>
            {renderDeptIcon(department)}
          </div>
        </div>

        {/* Card Body */}
        <div className="dept-card-body">
          <h3
            className="dept-card-title"
            onClick={() => setModalOpen(true)}
            title={formalDeptTitle}
          >
            {displayTitle}
          </h3>

          <p className="dept-card-desc" title={displayDesc}>
            {displayDesc}
          </p>

          <div className="dept-card-footer">
            <button
              type="button"
              className="dept-explore-btn"
              onClick={() => setModalOpen(true)}
              aria-label={`Explore ${displayTitle}`}
            >
              <span>Explore Department</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dept-arrow-icon"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>
      </article>

      {/* Pop-up Details Modal ("Other info in Show More") */}
      {modalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="dept-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`dept-modal-title-${department.id || department.slug || deptCode}`}
        >
          <div className="dept-modal-card">
            <div className="dept-modal-top-accent" />

            <div className="dept-modal-header">
              <button
                type="button"
                className="dept-modal-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close details"
              >
                ✕
              </button>

              <div className="dept-card-badge-row" style={{ marginBottom: 10, paddingRight: 40 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="dept-code-badge">{deptCode}</span>
                  {department.yearLabel && (
                    <span className="dept-subjects-count-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                      {department.yearLabel}
                    </span>
                  )}
                  {subjectCount > 0 && (
                    <span className="dept-subjects-count-badge">
                      {subjectCount} BPT {subjectCount === 1 ? 'Subject' : 'Subjects'}
                    </span>
                  )}
                </div>
              </div>

              <h2
                id={`dept-modal-title-${department.id || department.slug || deptCode}`}
                className="dept-modal-title"
              >
                {formalDeptTitle}
              </h2>

              {rawTagline && (
                <p className="dept-modal-tagline">
                  {rawTagline}
                </p>
              )}
            </div>

            <div className="dept-modal-body">
              {/* Head of Department Card */}
              <div className="dept-modal-hod-card">
                <div className="dept-modal-hod-avatar">
                  🩺
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', color: '#64748b', textTransform: 'uppercase' }}>
                    Head of Department (HOD)
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#05162e', marginTop: '2px' }}>
                    {department.head || 'To be announced'}
                  </div>
                  {(department.headDesignation || department.headQualification) && (
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '1px' }}>
                      {[department.headDesignation, department.headQualification].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Department Overview / Scope */}
              {rawOverview && (
                <div>
                  <div className="dept-modal-section-title">
                    <span>🏛️</span>
                    <span>Department Scope & Overview</span>
                  </div>
                  <p className="dept-modal-overview-text">
                    {rawOverview}
                  </p>
                </div>
              )}

              {/* Key Focus Areas / Specializations */}
              {specs.length > 0 && (
                <div>
                  <div className="dept-modal-section-title">
                    <span>🎯</span>
                    <span>Key Clinical Focus & Specializations</span>
                  </div>
                  <div className="dept-modal-specs-grid">
                    {specs.map((spec, i) => (
                      <span key={i} className="dept-modal-spec-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="dept-modal-footer">
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Karmayogi College of Physiotherapy
              </span>

              <button
                type="button"
                className="dept-modal-close-action-btn"
                onClick={() => setModalOpen(false)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
