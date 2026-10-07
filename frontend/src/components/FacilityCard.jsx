import React from 'react'

export default function FacilityCard({ facility }) {
  const [expanded, setExpanded] = React.useState(false)
  const imageUrl = facility.image_url || facility.img || facility.image || ''
  const description = facility.description || facility.desc || ''

  return (
    <article className="card facility-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={facility.title || 'Facility'}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            const seed = facility.slug || facility.id || 'facility'
            e.target.src = `https://picsum.photos/seed/cop${seed}/640/420`
          }}
        />
      ) : (
        <div style={{ height: 180, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <span>No image</span>
        </div>
      )}
      <div className="card-body">
        <h3>{facility.title}</h3>
        {description && (
          <>
            <p className={`card-desc-clamp ${expanded ? 'is-expanded' : ''}`}>{description}</p>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="card-inline-expand-btn"
            >
              {expanded ? 'Read Less ↑' : 'Read More →'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}
