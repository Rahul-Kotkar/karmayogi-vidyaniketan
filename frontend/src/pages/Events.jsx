import React, { useEffect, useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_EVENTS } from '../data/collegeData.js'
import { eventsService, getCachedEvents, setCachedEvents } from '../services/endpoints.js'
import { SearchIcon } from '../components/Icons.jsx'
import EventCard from '../components/EventCard.jsx'

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
  return { day: '15', month: 'OCT', year: '2026' }
}

export default function Events() {
  const cached = getCachedEvents()
  const [events, setEvents] = useState(() => (Array.isArray(cached) && cached.length > 0 ? cached : null))
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [loading, setLoading] = useState(() => !cached || cached.length === 0)
  const [expandedEvents, setExpandedEvents] = useState({})

  const toggleEvent = (id) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    const fetchEvents = () => {
      eventsService.getAll()
        .then(res => {
          if (res && Array.isArray(res) && res.length > 0) {
            setEvents(res)
            setCachedEvents(res)
          } else {
            setEvents(DEFAULT_EVENTS)
          }
        })
        .catch(() => {
          setEvents(prev => prev || DEFAULT_EVENTS)
        })
        .finally(() => setLoading(false))
    }

    fetchEvents()
    window.addEventListener('events_updated', fetchEvents)
    return () => window.removeEventListener('events_updated', fetchEvents)
  }, [])

  if (loading && (!events || events.length === 0)) {
    return (
      <PageShell title="Campus Events">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 20px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: 36,
            height: 36,
            border: '3px solid #e2e8f0',
            borderTopColor: '#134A98',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            marginBottom: 16
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500, margin: 0 }}>
            Loading Events...
          </p>
        </div>
      </PageShell>
    )
  }

  const safeEvents = events || []

  const types = ['ALL', ...new Set(safeEvents.map(e => (e.event_type || e.type || 'Event').toUpperCase()))]

  const filtered = safeEvents.filter(e => {
    const eventType = (e.event_type || e.type || 'Event').toUpperCase()
    const matchType = selectedType === 'ALL' || eventType === selectedType
    const matchSearch =
      (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
      ((e.description || e.desc || '')).toLowerCase().includes(search.toLowerCase()) ||
      (e.venue || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <PageShell
      title="Upcoming Events & Academic Calendar"
    >
      {/* Search & Category Pills Filter Bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {types.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: selectedType === t ? '#1d4ed8' : '#e2e8f0',
                  background: selectedType === t ? '#1d4ed8' : '#ffffff',
                  color: selectedType === t ? '#ffffff' : '#334155',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search events, venues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 34px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={14} color="#94a3b8" />
            </span>
          </div>
        </div>
      </div>

      {/* Events List Grid */}
      <div className="events-page-list" style={{ display: 'grid', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
            <p style={{ fontSize: 16, margin: '0 0 10px' }}>No events found matching your search.</p>
            <button
              type="button"
              onClick={() => { setSearch(''); setSelectedType('ALL') }}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#1d4ed8',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filtered.map((e, i) => (
            <EventCard key={e.id || i} event={e} />
          ))
        )}
      </div>
    </PageShell>
  )
}
