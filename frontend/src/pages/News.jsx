import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import heroBuildingImg from '../assets/hero_building.png'
import { pagesService, getCachedHomeData } from '../services/endpoints.js'
import { NEWS as DEFAULT_NEWS } from '../data/collegeData.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'
import { SearchIcon, CalendarIcon, CloseIcon } from '../components/Icons.jsx'

function parseNewsDate(item) {
  if (item?.displayDate) return item.displayDate
  const raw = String(item?.date || '').trim()
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const mIdx = parseInt(isoMatch[2], 10) - 1
    return {
      day: isoMatch[3],
      month: months[mIdx] || 'OCT',
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
  return { day: '19', month: 'OCT', year: '2026' }
}

export default function News() {
  const [newsList, setNewsList] = useState(() => {
    const cached = getCachedHomeData()?.news_list
    return (Array.isArray(cached) && cached.length > 0) ? cached : DEFAULT_NEWS
  })
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('ALL')
  const [activeStory, setActiveStory] = useState(null)
  const [loading, setLoading] = useState(false)
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
      title="School News & Media"
      subtitle="Latest announcements, academic achievements, and school campus updates."
    >
      <style>{`
        .news-card-horizontal {
          display: flex;
          flex-direction: row;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }
        .news-card-horizontal:hover {
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
          border-color: #cbd5e1;
        }
        .news-card-img-wrap {
          width: 320px;
          min-width: 320px;
          position: relative;
          background: #0f172a;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .news-card-horizontal {
            flex-direction: column !important;
          }
          .news-card-img-wrap {
            width: 100% !important;
            min-width: 100% !important;
            height: 220px !important;
          }
        }
      `}</style>

      {/* Top Controls: Search & Category Pills */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: selectedTag === tag ? '#2050a4' : '#e2e8f0',
                  background: selectedTag === tag ? '#2050a4' : '#ffffff',
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

      {/* Header Row: All News & Bulletins + Count Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h3
          style={{
            fontFamily: "var(--heading-font, Georgia, serif)",
            fontSize: 22,
            color: '#0f172a',
            margin: 0,
            fontWeight: 700,
            letterSpacing: '-0.2px'
          }}
        >
          All News &amp; Bulletins
        </h3>
        <span
          style={{
            background: '#e0f2fe',
            color: '#0369a1',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 20
          }}
        >
          {filtered.length} {filtered.length === 1 ? 'Article' : 'Articles'}
        </span>
      </div>

      {/* News Cards List */}
      {loading && filtered.length === 0 ? (
        <div style={{ display: 'grid', gap: 20 }}>
          {[1, 2, 3].map(k => (
            <div key={k} style={{ background: '#f8fafc', height: 200, borderRadius: 12, border: '1px solid #e2e8f0' }} />
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
              background: '#2050a4',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {filtered.map((item, idx) => {
            const b = parseNewsDate(item)
            const cardId = item.id || idx
            const isExpanded = Boolean(expandedCards[cardId])
            const fallbackImg = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'

            return (
              <article key={cardId} className="news-card-horizontal">
                {/* Left Image Section */}
                <div className="news-card-img-wrap">
                  <img
                    src={resolveMediaUrl(item.image, fallbackImg)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = fallbackImg
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Date Overlay Badge: Top Left */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      background: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      textAlign: 'center',
                      minWidth: 54,
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                      {b.day}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 3 }}>
                      {b.month}
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: '#94a3b8' }}>
                      {b.year}
                    </div>
                  </div>

                  {/* Category Tag Overlay Badge: Top Right */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      background: 'rgba(15, 23, 42, 0.92)',
                      color: '#facc15',
                      border: '1px solid rgba(250, 204, 21, 0.4)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 10.5,
                      fontWeight: 800,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.tag || 'NEWS'}
                  </div>
                </div>

                {/* Right Content Section */}
                <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top Meta: Category Pill + Calendar Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span
                      style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '3px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: 0.8,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.tag || 'NEWS'}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, textTransform: 'uppercase' }}>
                      <CalendarIcon size={13} color="#64748b" />
                      <span>{b.month} {b.day}, {b.year}</span>
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.35 }}>
                    {item.title}
                  </h4>

                  {/* Description / Summary */}
                  <p
                    className={`card-desc-clamp ${isExpanded ? 'is-expanded' : ''}`}
                    style={{
                      fontSize: 14,
                      color: '#475569',
                      lineHeight: 1.6,
                      margin: '0 0 18px',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {item.desc}
                  </p>

                  {/* Bottom Actions Row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 14,
                      marginTop: 'auto'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCard(cardId)}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#0284c7',
                        fontSize: 13.5,
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

                    <button
                      type="button"
                      onClick={() => setActiveStory(item)}
                      style={{
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#0284c7'
                        e.currentTarget.style.color = '#0284c7'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#cbd5e1'
                        e.currentTarget.style.color = '#334155'
                      }}
                    >
                      <span>Popup View</span>
                      <span style={{ fontSize: 13 }}>↗</span>
                    </button>
                  </div>
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
                <span style={{ fontSize: 11, background: '#eff6ff', color: '#0284c7', padding: '3px 10px', borderRadius: 4, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  {activeStory.tag || 'SCHOOL NEWS'}
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
                      background: '#2050a4',
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
