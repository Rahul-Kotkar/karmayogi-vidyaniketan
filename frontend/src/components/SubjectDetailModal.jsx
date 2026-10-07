import React, { useEffect } from 'react'

export default function SubjectDetailModal({ subject, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!subject) return null

  return (
    <div className="bpt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-subject-title">
      <div className="bpt-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="bpt-modal-header">
          <div className="bpt-modal-title-group">
            <div className="bpt-modal-badges">
              <span className="bpt-abbr-badge bpt-abbr-badge-lg">{subject.abbr}</span>
              <span className="bpt-year-tag">{subject.yearLabel}</span>
              <span className="bpt-order-badge">Subject #{subject.order}</span>
            </div>
            <h2 id="modal-subject-title" className="bpt-modal-title">{subject.name}</h2>
          </div>
          <button
            type="button"
            className="bpt-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="bpt-modal-body">
          {/* Introductory Overview */}
          <section className="bpt-modal-section">
            <h4 className="bpt-modal-section-title">Introductory Subject Overview</h4>
            <p className="bpt-modal-desc">{subject.description}</p>
          </section>

          {/* Key Topics */}
          {subject.keyTopics && subject.keyTopics.length > 0 && (
            <section className="bpt-modal-section">
              <h4 className="bpt-modal-section-title">Key Core Topics</h4>
              <ul className="bpt-modal-topics-grid">
                {subject.keyTopics.map((topic, i) => (
                  <li key={i} className="bpt-modal-topic-item">
                    <span className="bpt-topic-bullet">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Clinical Relevance & Laboratory Application */}
          {subject.clinicalRelevance && (
            <section className="bpt-modal-section">
              <h4 className="bpt-modal-section-title">Clinical Relevance & Practical Application</h4>
              <div className="bpt-modal-relevance-box">
                <span className="bpt-relevance-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'flex-start', marginTop: 2 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vibrant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"></path>
                    <path d="M9 12.5v3.5a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4v-1.5"></path>
                    <circle cx="18" cy="10" r="2.5"></circle>
                  </svg>
                </span>
                <p>{subject.clinicalRelevance}</p>
              </div>
            </section>
          )}

          {/* Department Info */}
          {subject.departmentName && (
            <section className="bpt-modal-section">
              <h4 className="bpt-modal-section-title">Academic Department Affiliation</h4>
              <div className="bpt-modal-dept-card">
                <div>
                  <div className="bpt-modal-dept-label">Delivered under:</div>
                  <strong className="bpt-modal-dept-name">{subject.departmentName}</strong>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="bpt-modal-footer">
          <button type="button" className="bpt-modal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
