import React from 'react'

export default function SubjectCard({ subject, onViewDetails }) {
  if (!subject) return null

  return (
    <article className="bpt-subject-card">
      <div className="bpt-subject-header">
        <div className="bpt-subject-meta-left">
          <span className="bpt-abbr-badge">{subject.abbr}</span>
          <span className="bpt-year-tag">{subject.yearLabel}</span>
        </div>
        <span className="bpt-order-badge">#{subject.order}</span>
      </div>

      <div className="bpt-subject-content">
        <h3 className="bpt-subject-name">{subject.name}</h3>

        <p className="bpt-subject-desc">{subject.description}</p>

        {subject.keyTopics && subject.keyTopics.length > 0 && (
          <div className="bpt-topics-wrap">
            <span className="bpt-topics-label">Key Topics:</span>
            <div className="bpt-topics-list">
              {subject.keyTopics.map((topic, i) => (
                <span key={i} className="bpt-topic-chip">{topic}</span>
              ))}
            </div>
          </div>
        )}

        {subject.departmentName && (
          <div className="bpt-subject-dept-link-row">
            <span className="bpt-dept-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3l9-7z"></path>
              </svg>
            </span>
            <span className="bpt-dept-label">Department:</span>
            <span className="bpt-dept-name-val" style={{ color: '#475569', fontWeight: 600 }}>{subject.departmentName}</span>
          </div>
        )}
      </div>

      <div className="bpt-subject-card-footer">
        <button
          type="button"
          className="bpt-view-details-btn"
          onClick={() => onViewDetails(subject)}
        >
          <span>View Curriculum Details</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>
    </article>
  )
}
