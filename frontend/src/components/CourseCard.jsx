import React from 'react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <article className="card">
      <div className="card-body">
        <h3>{course.name}</h3>
        <ul className="course-meta">
          <li><b>Duration:</b> {course.duration}</li>
          <li><b>Eligibility:</b> {course.eligibility}</li>
        </ul>
        {course.description && (
          <>
            <p className={`card-desc-clamp ${expanded ? 'is-expanded' : ''}`}>{course.description}</p>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="card-inline-expand-btn"
            >
              {expanded ? 'Read Less ↑' : 'Read More →'}
            </button>
          </>
        )}
        <div style={{ marginTop: 10 }}>
          <Link className="link-more" to="/academics">View Details →</Link>
        </div>
      </div>
    </article>
  )
}
