import React, { useState } from 'react'
import { MapPinIcon, CalendarIcon } from './Icons.jsx'

function parseEventDate(rawDate) {
  if (!rawDate) return { day: '15', month: 'OCT', year: '2026' }
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const parts = String(rawDate).split('-')
  if (parts.length === 3) {
    const mIdx = parseInt(parts[1], 10) - 1
    return {
      year: parts[0],
      month: months[mIdx] || 'OCT',
      day: parts[2].padStart(2, '0')
    }
  }
  const d = new Date(rawDate)
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      month: months[d.getMonth()] || 'OCT',
      day: String(d.getDate()).padStart(2, '0')
    }
  }
  return { day: '15', month: 'OCT', year: '2026' }
}

export default function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false)
  const b = parseEventDate(event?.date)
  const formattedDate = `${b.day} ${b.month.charAt(0) + b.month.slice(1).toLowerCase()} ${b.year}`

  return (
    <article
      className="home-event-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderLeft: '3.5px solid #1d4ed8',
        borderRadius: 8,
        padding: '9px 13px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Date Badge (Hidden on mobile) */}
      <div
        className="event-date-badge"
        style={{
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: 6,
          width: 50,
          height: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <span className="event-badge-month" style={{ fontSize: 9.5, fontWeight: 700, color: '#1d4ed8', letterSpacing: 0.5, textTransform: 'uppercase', lineHeight: 1 }}>
          {b.month}
        </span>
        <span className="event-badge-day" style={{ fontSize: 17, fontWeight: 800, color: '#071d3a', lineHeight: 1.05, margin: '1px 0' }}>
          {b.day}
        </span>
        <span className="event-badge-year" style={{ fontSize: 8.5, color: '#64748b', lineHeight: 1 }}>
          {b.year}
        </span>
      </div>

      {/* Event Info */}
      <div className="event-content-wrap" style={{ flex: 1, minWidth: 0 }}>
        <div className="event-meta-line" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span
            className="event-type-badge"
            style={{
              fontSize: 9.5,
              background: '#f1f5f9',
              color: '#0f172a',
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 1.35
            }}
          >
            {event?.type || 'EVENT'}
          </span>
          {/* Simple text date for mobile view */}
          <span className="event-simple-date-text">
            <CalendarIcon size={11} color="#1d4ed8" />
            <span>{formattedDate}</span>
          </span>
          {event?.venue && (
            <span className="event-venue-meta" style={{ fontSize: 11, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 3.5 }}>
              <MapPinIcon size={11} color="#2563eb" />
              <span>{event.venue}</span>
            </span>
          )}
        </div>

        <h3
          className="home-event-title"
          style={{
            margin: '0 0 2px',
            fontSize: 13.5,
            fontWeight: 700,
            color: '#071d3a',
            lineHeight: 1.3,
            fontFamily: 'var(--body-font)'
          }}
        >
          {event?.title}
        </h3>

        {event?.desc && (
          <p
            className={`card-desc-clamp ${expanded ? 'is-expanded' : ''}`}
            style={{ margin: '0 0 2px', fontSize: 11.5, color: '#475569', lineHeight: 1.4 }}
          >
            {event.desc}
          </p>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="card-inline-expand-btn"
          style={{ fontSize: 11, marginTop: 1, padding: 0 }}
        >
          {expanded ? 'Read Less ↑' : 'Read More →'}
        </button>
      </div>
    </article>
  )
}

