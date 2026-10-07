import React, { useState, useEffect } from 'react'
import { ALBUMS as FALLBACK_ALBUMS } from '../data/collegeData.js'
import { galleryService, getCachedAlbums } from '../services/endpoints.js'
import { CameraIcon } from './Icons.jsx'

export default function Gallery({ limit }) {
  const [albums, setAlbums] = useState(() => getCachedAlbums() || FALLBACK_ALBUMS)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [cat, setCat] = useState('All')
  const [lb, setLb] = useState(null)

  useEffect(() => {
    galleryService.getAlbums().then(data => {
      if (data && data.length > 0) setAlbums(data)
    }).catch(() => {})
  }, [])

  // Extract distinct categories
  const categories = ['All', ...new Set(albums.map(a => a.category_name).filter(Boolean))]

  // Filtered albums
  const filteredAlbums = (cat === 'All' ? albums : albums.filter(a => a.category_name === cat))
  const displayedAlbums = limit ? filteredAlbums.slice(0, limit) : filteredAlbums

  // Photos of the currently selected album
  const currentPhotos = selectedAlbum?.photos || []

  // Lightbox navigation
  const nav = (dir) => {
    if (!currentPhotos.length) return
    setLb(i => (i + dir + currentPhotos.length) % currentPhotos.length)
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLb(null)
      if (e.key === 'ArrowLeft') nav(-1)
      if (e.key === 'ArrowRight') nav(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPhotos])

  return (
    <div className="gallery-album-container">
      {/* ========================================================
          VIEW A: SINGLE ALBUM PHOTOS VIEW
         ======================================================== */}
      {selectedAlbum ? (
        <div>
          {/* Album Header Bar with Back Button */}
          <div className="album-detail-header">
            <button
              type="button"
              className="album-back-btn"
              onClick={() => {
                setSelectedAlbum(null)
                setLb(null)
              }}
            >
              ← Back to All Albums
            </button>

            <div className="album-detail-meta">
              <span className="album-detail-category">{selectedAlbum.category_name || 'Gallery'}</span>
              <h2 className="album-detail-title">{selectedAlbum.title}</h2>
              {selectedAlbum.description && (
                <p className="album-detail-desc">{selectedAlbum.description}</p>
              )}
              <div className="album-detail-count" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CameraIcon size={14} color="#64748b" />
                <span>{currentPhotos.length} {currentPhotos.length === 1 ? 'Photo' : 'Photos'}</span>
              </div>
            </div>
          </div>

          {/* Photo Grid inside Selected Album */}
          {currentPhotos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <p style={{ fontSize: 16 }}>No photos in this album yet.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {currentPhotos.map((photo, i) => (
                <figure
                  className="gallery-item"
                  key={photo.id || i}
                  onClick={() => setLb(i)}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || `${selectedAlbum.title} Photo ${i + 1}`}
                    loading="lazy"
                  />
                  <figcaption className="cap">
                    {photo.caption || `${selectedAlbum.title} (${i + 1})`}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================
           VIEW B: ALL ALBUMS LIST
           ======================================================== */
        <div>
          {/* Category Filter Chips */}
          <div className="gallery-filters" role="tablist">
            {categories.map(c => (
              <button
                key={c}
                className={'chip' + (cat === c ? ' active' : '')}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Albums Card Grid */}
          <div className="album-cards-grid">
            {displayedAlbums.map(album => {
              const count = album.photo_count || album.photos?.length || 0
              const cover = album.cover_image || (album.photos && album.photos[0]?.image_url) || 'https://picsum.photos/seed/placeholder/800/600'

              return (
                <article
                  key={album.id}
                  className="album-card"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <div className="album-card-cover">
                    <img src={cover} alt={album.title} loading="lazy" />
                    <span className="album-badge-count" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CameraIcon size={12} color="#ffffff" />
                      <span>{count} {count === 1 ? 'Photo' : 'Photos'}</span>
                    </span>
                    <span className="album-badge-cat">{album.category_name || 'Campus'}</span>
                  </div>

                  <div className="album-card-body">
                    <h3 className="album-card-title">{album.title}</h3>
                    {album.description && (
                      <p className="album-card-desc">{album.description}</p>
                    )}
                    <span className="album-card-link">View Album ({count}) →</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          FULL-SCREEN LIGHTBOX VIEWER
         ======================================================== */}
      {lb !== null && currentPhotos[lb] && (
        <div
          className="lightbox"
          role="dialog"
          aria-label="Image viewer"
          onClick={() => setLb(null)}
        >
          <button className="lb-close" aria-label="Close" onClick={() => setLb(null)}>×</button>

          {currentPhotos.length > 1 && (
            <>
              <button
                className="lb-btn lb-prev"
                aria-label="Previous image"
                onClick={e => { e.stopPropagation(); nav(-1); }}
              >
                ‹
              </button>
              <button
                className="lb-btn lb-next"
                aria-label="Next image"
                onClick={e => { e.stopPropagation(); nav(1); }}
              >
                ›
              </button>
            </>
          )}

          <img
            src={currentPhotos[lb].image_url}
            alt={currentPhotos[lb].caption || 'Gallery photo'}
            onClick={e => e.stopPropagation()}
          />

          <div className="lb-cap">
            <b>{selectedAlbum?.title}</b> {currentPhotos[lb].caption && `— ${currentPhotos[lb].caption}`}
            <span style={{ display: 'block', fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              Photo {lb + 1} of {currentPhotos.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
