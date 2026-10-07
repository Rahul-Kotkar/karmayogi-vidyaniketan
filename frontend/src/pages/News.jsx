import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import heroBuildingImg from '../assets/hero_building.png'
import { pagesService, getCachedHomeData } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'
import { SearchIcon, CalendarIcon } from '../components/Icons.jsx'

function parseNewsDate(item) {
  if (item?.displayDate) return item.displayDate
  const raw = String(item?.date || '').trim()
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const mIdx = parseInt(isoMatch[2], 10) - 1
    return {
      day: isoMatch[3],
      month: months[mIdx] || 'SEP',
      year: isoMatch[1]
    }
  }
  const textMatch = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})?/)
  if (textMatch) {
    return {
      day: textMatch[2].padStart(2, '0'),
      month: textMatch[1].toUpperCase().slice(0, 3),
      year: textMatch[3] || '2026'
    }
  }
  return { day: '10', month: 'SEP', year: '2026' }
}

export default function News() {
  const [newsList, setNewsList] = useState(() => getCachedHomeData()?.news_list || [])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('ALL')
  const [activeStory, setActiveStory] = useState(null)
  const [loading, setLoading] = useState(() => !getCachedHomeData()?.news_list)
  const [expandedCards, setExpandedCards] = useState({})

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    async function loadNews() {
      try {
        const page = await pagesService.getBySlug('home')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            if (parsed.news_list && Array.isArray(parsed.news_list) && parsed.news_list.length > 0) {
              setNewsList(parsed.news_list)
            }
          } catch {
            // fallback
          }
        }
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  // Extract unique tags
  const allTags = ['ALL', ...new Set(newsList.map(item => (item.tag || 'GENERAL').toUpperCase()))]

  // Filter news
  const filtered = newsList.filter(item => {
    const matchTag = selectedTag === 'ALL' || (item.tag || 'GENERAL').toUpperCase() === selectedTag
    const matchSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.desc || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.tag || '').toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <PageShell
      title="College News & Media"
    >
      {/* Top Controls: Search & Category Pills */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: selectedTag === tag ? '#1d4ed8' : '#e2e8f0',
                  background: selectedTag === tag ? '#1d4ed8' : '#ffffff',
                  color: selectedTag === tag ? '#ffffff' : '#334155',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search news articles..."
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

      {/* Grid of News Cards */}
      <h3 style={{ fontSize: 18, color: '#0f172a', margin: '0 0 18px', fontWeight: 700 }}>
        All News &amp; Bulletins ({filtered.length})
      </h3>

      {loading && filtered.length === 0 ? (
        <div className="news-grid-cards">
          {[1, 2, 3].map(k => (
            <div key={k} style={{ background: '#f8fafc', height: 260, borderRadius: 10, border: '1px solid #e2e8f0' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
          <p style={{ fontSize: 16, margin: '0 0 10px' }}>No news articles found matching your criteria.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setSelectedTag('ALL') }}
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
        <div className="news-grid-cards">
          {filtered.map((item, idx) => {
            const b = parseNewsDate(item)
            return (
              <article
                key={item.id || idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Card Thumbnail */}
                <div style={{ height: 190, position: 'relative', background: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={resolveMediaUrl(item.image, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80')}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#1d4ed8',
                      color: '#ffffff',
                      borderRadius: 4,
                      padding: '4px 10px',
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.tag || 'NEWS'}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarIcon size={13} color="#64748b" />
                    <span>{b.month} {b.day}, {b.year}</span>
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {item.title}
                  </h4>

                  {(() => {
                    const cardId = item.id || idx
                    const isExpanded = Boolean(expandedCards[cardId])
                    return (
                      <>
                        <p
                          className={`card-desc-clamp ${isExpanded ? 'is-expanded' : ''}`}
                          style={{
                            fontSize: 13,
                            color: '#475569',
                            lineHeight: 1.5,
                            margin: '0 0 16px'
                          }}
                        >
                          {item.desc}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                          <button
                            type="button"
                            onClick={() => toggleCard(cardId)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: '#1d4ed8',
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            {isExpanded ? 'Read Less ↑' : 'Read More →'}
                          </button>
                          {item.link ? (
                            <Link to={item.link} style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
                              View Details
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveStory(item)}
                              style={{ border: 'none', background: 'none', fontSize: 12, color: '#64748b', cursor: 'pointer', padding: 0 }}
                            >
                              Popup View
                            </button>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Story Reader Modal */}
      {activeStory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
          onClick={() => setActiveStory(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {activeStory.image && (
              <div style={{ height: 260, width: '100%', overflow: 'hidden' }}>
                <img
                  src={resolveMediaUrl(activeStory.image, heroBuildingImg)}
                  alt={activeStory.title}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = heroBuildingImg
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: 4, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  {activeStory.tag || 'COLLEGE NEWS'}
                </span>
                <span style={{ fontSize: 12.5, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <CalendarIcon size={13} color="#64748b" />
                  <span>{activeStory.date}</span>
                </span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1.35, margin: '0 0 16px' }}>
                {activeStory.title}
              </h2>

              <p style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.7, margin: '0 0 24px', whiteSpace: 'pre-line' }}>
                {activeStory.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                {activeStory.link ? (
                  <Link
                    to={activeStory.link}
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      padding: '8px 18px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Go to Related Page →
                  </Link>
                ) : <span />}
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    padding: '8px 18px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
