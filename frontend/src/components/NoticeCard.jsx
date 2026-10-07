import React from 'react'
import { Link } from 'react-router-dom'

function formatNoticeDate(dateStr) {
  if (!dateStr) return ''
  const cleanStr = String(dateStr).split('T')[0]
  const parts = cleanStr.split('-')
  if (parts.length === 3) {
    const year = parts[0]
    const monthIdx = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day} ${months[monthIdx]} ${year}`
    }
  }
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return dateStr
}

export default function NoticeCard({ notice }) {
  const [expanded, setExpanded] = React.useState(false)
  const dateFormatted = formatNoticeDate(notice.notice_date || notice.date)
  const cleanTitle = (notice.title || '').replace(/\?{2,}/g, '–')
  const cleanBody = (notice.body || '').replace(/\?{2,}/g, '–')

  return (
    <article className="notice-row">
      <div className="notice-body">
        <div className="notice-meta-line">
          <small className="notice-category-tag">{notice.category}</small>
          {dateFormatted && (
            <span className="notice-date-text">· {dateFormatted}</span>
          )}
        </div>
        <h4>{cleanTitle}</h4>
        <p className={`card-desc-clamp ${expanded ? 'is-expanded' : ''}`}>{cleanBody}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="card-inline-expand-btn"
          >
            {expanded ? 'Read Less ↑' : 'Read More →'}
          </button>
          <Link className="link-more" to={'/notices?n=' + notice.id} style={{ margin: 0, fontSize: 12.5 }}>
            View Details →
          </Link>
        </div>
      </div>
    </article>
  )
}
