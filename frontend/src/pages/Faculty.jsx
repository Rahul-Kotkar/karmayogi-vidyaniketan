import React, { useEffect, useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { DEFAULT_FACULTY } from '../data/collegeData.js'
import { facultyService, getCachedFaculty } from '../services/endpoints.js'
import { resolveMediaUrl } from '../utils/mediaUrl.js'
import { SearchIcon } from '../components/Icons.jsx'

function formatFacultyName(name) {
  if (!name) return ''
  return name
    .replace(/([a-zA-Z])\.([a-zA-Z])/g, '$1. $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
}

function formatExp(exp) {
  if (!exp) return '10+ Years'
  const trimmed = String(exp).trim()
  if (/year/i.test(trimmed)) return trimmed
  return `${trimmed} Years`
}

export default function Faculty() {
  const [faculty, setFaculty] = useState(() => {
    const cached = getCachedFaculty()
    return Array.isArray(cached) && cached.length > 0 ? cached : DEFAULT_FACULTY
  })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')
  const [selectedFaculty, setSelectedFaculty] = useState(null)

  useEffect(() => {
    facultyService.getAll().then(res => {
      if (res && Array.isArray(res) && res.length > 0) {
        setFaculty(res)
        setSelectedFaculty(prev => {
          if (!prev) return null
          return res.find(f => f.id === prev.id) || prev
        })
      }
    }).catch(() => {})
  }, [])

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!selectedFaculty) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedFaculty(null)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedFaculty])

  // Collect unique departments
  const departments = ['ALL', ...new Set(
    faculty
      .map(f => f.department_name || f.specialization || '')
      .filter(Boolean)
      .map(d => d.replace(/Physiotherapy/i, '').trim())
  )]

  const filtered = faculty.filter(f => {
    const deptString = (f.department_name || f.specialization || '').toLowerCase()
    const matchesDept = selectedDept === 'ALL' || deptString.includes(selectedDept.toLowerCase())

    const query = search.toLowerCase()
    const matchesSearch =
      !search ||
      (f.name || '').toLowerCase().includes(query) ||
      (f.designation || '').toLowerCase().includes(query) ||
      (f.qualification || '').toLowerCase().includes(query) ||
      (f.specialization || '').toLowerCase().includes(query) ||
      (f.department_name || '').toLowerCase().includes(query) ||
      (f.research_interests || '').toLowerCase().includes(query) ||
      (f.profile_description || '').toLowerCase().includes(query)

    return matchesDept && matchesSearch
  })

  return (
    <PageShell
      title="Our Esteemed Faculty"
    >
      {/* Controls Bar: Filter Pills and Search Box */}
      <div className="faculty-controls-bar" style={{ marginBottom: 24 }}>
        <div className="faculty-filter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          {/* Department Filter Pills */}
          <div className="faculty-dept-pills" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {departments.slice(0, 7).map(dept => {
              const active = selectedDept === dept
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`faculty-dept-pill ${active ? 'active' : ''}`}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: active ? '#1d4ed8' : '#e2e8f0',
                    background: active ? '#1d4ed8' : '#ffffff',
                    color: active ? '#ffffff' : '#334155',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {dept}
                </button>
              )
            })}
          </div>

          {/* Right: Search Box */}
          <div className="faculty-search-box-wrap" style={{ position: 'relative', width: 260, maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search faculty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={14} color="#94a3b8" />
            </span>
          </div>
        </div>

        <div className="faculty-count-text" style={{ fontSize: 13, color: '#64748b' }}>
          Showing <strong>{filtered.length}</strong> faculty {filtered.length === 1 ? 'member' : 'members'}
          {selectedDept !== 'ALL' && ` in ${selectedDept}`}
        </div>
      </div>

      {loading && filtered.length === 0 ? (
        <div className="faculty-cards-grid">
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="faculty-skeleton-card" style={{ background: '#f8fafc', height: 420, borderRadius: 18, border: '1px solid #e2e8f0' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: 12, color: '#64748b' }}>
          <p style={{ fontSize: 16, margin: '0 0 12px' }}>No faculty members found matching your search.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setSelectedDept('ALL') }}
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              border: 'none',
              background: '#1d4ed8',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* ================= CARDS DIRECTORY VIEW (EXACT IMAGE 1) ================= */
        <div className="faculty-cards-grid">
          {filtered.map((f, i) => {
            const cardId = f.id || i
            const programBadge = f.program_badge || 'CBSE'
            const badge2 = (f.specialization || f.department_name || 'ACADEMICS').toUpperCase()
            const avatarUrl = f.photo ? resolveMediaUrl(f.photo) : null
            const expLabel = formatExp(f.experience)

            return (
              <article 
                key={cardId} 
                className="faculty-card"
                onClick={() => setSelectedFaculty(f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedFaculty(f)
                  }
                }}
                title={`Click to view profile of ${f.name || 'faculty member'}`}
              >
                {/* 1. Large Top Portrait Photo */}
                <div className="faculty-card-img-wrap">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={f.name}
                      className="faculty-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="faculty-card-img-placeholder">
                      <div style={{ textAlign: 'center' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: 600 }}>Faculty Profile</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Card Body Content */}
                <div className="faculty-card-body">
                  {/* Dual Badges */}
                  <div className="faculty-card-badges">
                    <span className="faculty-badge-program">
                      {programBadge}
                    </span>
                    <span className="faculty-badge-dept" title={badge2}>
                      {badge2}
                    </span>
                  </div>

                  {/* Designation */}
                  <div className="faculty-card-desig">
                    {f.designation ? f.designation.toUpperCase() : 'FACULTY'}
                  </div>

                  {/* Name (Serif typography) */}
                  <h3 className="faculty-card-name">
                    {formatFacultyName(f.name)}
                  </h3>

                  {/* Qualification & Department Context */}
                  <div className="faculty-card-qual">
                    <span>{f.qualification || 'M.A., B.Ed.'}</span>
                    {f.department_name && f.department_name.toUpperCase() !== badge2 && (
                      <span className="faculty-card-subdept" style={{ display: 'block', fontSize: 11.5, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
                        {f.department_name}
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: Experience + Arrow Button */}
                  <div className="faculty-card-bottom">
                    <span className="faculty-card-exp">
                      {expLabel}
                    </span>
                    <button
                      type="button"
                      className="faculty-card-arrow-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFaculty(f)
                      }}
                      aria-label={`View full profile of ${f.name}`}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ================= 2-GRID FACULTY DETAIL MODAL POPUP (40% / 60%) ================= */}
      {selectedFaculty && (
        <div 
          className="faculty-modal-overlay" 
          onClick={() => setSelectedFaculty(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="faculty-modal-card" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right "X" Close Button */}
            <button 
              type="button"
              className="faculty-modal-close-btn" 
              onClick={() => setSelectedFaculty(null)}
              aria-label="Close modal"
              title="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Left Grid (40%): Faculty Full Photo */}
            <div className="faculty-modal-left">
              {selectedFaculty.photo ? (
                <img
                  src={resolveMediaUrl(selectedFaculty.photo)}
                  alt={selectedFaculty.name}
                  className="faculty-modal-full-img"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="faculty-modal-img-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span style={{ marginTop: 10, fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>Faculty Profile</span>
                </div>
              )}
            </div>

            {/* Right Grid (60%): All Information */}
            <div className="faculty-modal-right">
              {/* Header Details */}
              <div className="faculty-modal-header-block">
                <h2 className="faculty-modal-name">
                  {formatFacultyName(selectedFaculty.name)}
                </h2>
                <div className="faculty-modal-desig">
                  {selectedFaculty.designation ? selectedFaculty.designation.toUpperCase() : 'FACULTY'}
                </div>
                <div className="faculty-modal-meta">
                  <span>Experience: {formatExp(selectedFaculty.experience)}</span>
                  {selectedFaculty.department_name && (
                    <>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span>{selectedFaculty.department_name}</span>
                    </>
                  )}
                  {selectedFaculty.specialization && (
                    <>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedFaculty.specialization}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="faculty-modal-divider" />

              {/* Information List */}
              <div className="faculty-modal-fields-list">
                {/* Qualifications */}
                {selectedFaculty.qualification && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Qualifications</span>
                    <div className="faculty-modal-field-value">
                      {selectedFaculty.qualification}
                    </div>
                  </div>
                )}

                {/* Specialization */}
                {selectedFaculty.specialization && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Specialization</span>
                    <div className="faculty-modal-field-value" style={{ fontWeight: 600, color: '#0f172a' }}>
                      {selectedFaculty.specialization}
                    </div>
                  </div>
                )}

                {/* Department */}
                {selectedFaculty.department_name && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Department</span>
                    <div className="faculty-modal-field-value">
                      {selectedFaculty.department_name}
                    </div>
                  </div>
                )}

                {/* Contact */}
                {(selectedFaculty.email || selectedFaculty.phone) && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Contact</span>
                    <div className="faculty-modal-field-value">
                      {selectedFaculty.email && (
                        <div>
                          <a href={`mailto:${selectedFaculty.email}`} title={`Email ${selectedFaculty.name}`}>
                            {selectedFaculty.email}
                          </a>
                        </div>
                      )}
                      {selectedFaculty.phone && (
                        <div style={{ marginTop: selectedFaculty.email ? 3 : 0 }}>
                          <a href={`tel:${selectedFaculty.phone}`} title={`Call ${selectedFaculty.phone}`}>
                            {selectedFaculty.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Research Interests */}
                {selectedFaculty.research_interests && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Research Interests</span>
                    <div className="faculty-modal-field-value" style={{ color: '#334155' }}>
                      {selectedFaculty.research_interests}
                    </div>
                  </div>
                )}

                {/* Biography / Profile Description */}
                {(selectedFaculty.profile_description || selectedFaculty.bio) && (
                  <div className="faculty-modal-field-item">
                    <span className="faculty-modal-field-label">Biography</span>
                    <div className="faculty-modal-field-value" style={{ color: '#334155', lineHeight: 1.6 }}>
                      {selectedFaculty.profile_description || selectedFaculty.bio}
                    </div>
                  </div>
                )}

                {/* Optional Academic Profiles & Resume (Matching Reference Image 2 with Branded Logos) */}
                {(selectedFaculty.google_scholar || selectedFaculty.orcid || selectedFaculty.scopus || selectedFaculty.research_gate || selectedFaculty.linkedin || selectedFaculty.resume_url) && (
                  <div className="faculty-modal-actions-bar">
                    {/* 1. Google Scholar */}
                    {selectedFaculty.google_scholar && (
                      <a
                        href={selectedFaculty.google_scholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-pill-btn"
                        title="Google Scholar Profile"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.24-1.37 3.64-5.27 3.64-3.17 0-5.76-2.63-5.76-5.87s2.59-5.87 5.76-5.87c1.8 0 3.01.77 3.7 1.43l2.35-2.27C21.99 3.68 19.46 2.5 16.18 2.5 9.95 2.5 4.88 7.57 4.88 13.8s5.07 11.3 11.3 11.3c6.51 0 10.82-4.58 10.82-11.02 0-.74-.08-1.3-.17-1.98z" />
                        </svg>
                        <span>GOOGLE SCHOLAR</span>
                      </a>
                    )}

                    {/* 2. ORCID */}
                    {selectedFaculty.orcid && (
                      <a
                        href={selectedFaculty.orcid.startsWith('http') ? selectedFaculty.orcid : `https://orcid.org/${selectedFaculty.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-pill-btn"
                        title="ORCID Profile"
                      >
                        <svg width="14" height="14" viewBox="0 0 256 256" style={{ flexShrink: 0 }}>
                          <circle cx="128" cy="128" r="128" fill="#071d3a" className="orcid-circle" />
                          <path fill="#ffffff" className="orcid-path" d="M86.3 186.2H70.9V79.1h15.4v107.1zM78.6 66.8c-5.2 0-9.4-4.2-9.4-9.4s4.2-9.4 9.4-9.4 9.4 4.2 9.4 9.4-4.2 9.4-9.4 9.4zm85.8 59.9c0 33.1-19.7 60.1-51.1 60.1h-33V79.1h33c31.4 0 51.1 27 51.1 60.1v-12.5zm-15.8 0c0-24.8-13.8-44.5-35.3-44.5h-17.5v89h17.5c21.5 0 35.3-19.7 35.3-44.5z"/>
                        </svg>
                        <span>ORCID</span>
                      </a>
                    )}

                    {/* 3. Scopus */}
                    {selectedFaculty.scopus && (
                      <a
                        href={selectedFaculty.scopus.startsWith('http') ? selectedFaculty.scopus : `https://www.scopus.com/authid/detail.uri?authorId=${selectedFaculty.scopus}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-pill-btn"
                        title="Scopus Profile"
                      >
                        <svg width="13" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <path 
                            fillRule="evenodd" 
                            clipRule="evenodd" 
                            d="M2.5 1.5C2.5 0.67 3.17 0 4 0H12C12.83 0 13.5 0.67 13.5 1.5V14.5C13.5 15.33 12.83 16 12 16H4C3.17 16 2.5 15.33 2.5 14.5V1.5ZM6.5 1.5H9.5V6L8 4.8L6.5 6V1.5ZM4.2 12.2H11.8V13.6H4.2V12.2Z" 
                            fill="#ea580c" 
                          />
                        </svg>
                        <span>SCOPUS</span>
                      </a>
                    )}

                    {/* 4. ResearchGate */}
                    {selectedFaculty.research_gate && (
                      <a
                        href={selectedFaculty.research_gate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-pill-btn"
                        title="ResearchGate Profile"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <rect width="24" height="24" rx="4" fill="#00ccbb" />
                          <path d="M5.5 18V7h5c2.4 0 4.2 1.3 4.2 3.5 0 1.5-.9 2.7-2.3 3.2l2.8 4.3h-2.7l-2.4-3.9H7.6V18H5.5zm2.1-5.7h2.6c1.3 0 2.2-.7 2.2-1.8s-.9-1.8-2.2-1.8H7.6v3.6zm10.7-1.1c-.2-.1-.5-.2-.8-.2-.9 0-1.6.7-1.6 1.7 0 1 .7 1.7 1.6 1.7.5 0 .9-.2 1.1-.4v-.9h-1.1v-.8h1.9v2.2c-.5.5-1.2.7-1.9.7-1.5 0-2.6-1.1-2.6-2.6s1.1-2.6 2.6-2.6c.6 0 1.2.2 1.7.5l-.9.7z" fill="#ffffff" />
                        </svg>
                        <span>RESEARCHGATE</span>
                      </a>
                    )}

                    {/* 5. LinkedIn */}
                    {selectedFaculty.linkedin && (
                      <a
                        href={selectedFaculty.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-pill-btn"
                        title="LinkedIn Profile"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <rect width="24" height="24" rx="4" fill="#0a66c2" />
                          <path d="M6.5 9.5h2.8V18H6.5V9.5zm1.4-3.9c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6.7-1.6 1.6-1.6zm4.1 3.9h2.7v1.2h.04c.4-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.8 3.3 4.2V18h-2.8v-4.1c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V18H12V9.5z" fill="#ffffff" />
                        </svg>
                        <span>LINKEDIN</span>
                      </a>
                    )}

                    {/* 6. SEE RESUME (PDF) */}
                    {selectedFaculty.resume_url && (
                      <a
                        href={resolveMediaUrl(selectedFaculty.resume_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faculty-resume-solid-btn"
                        title="View Resume / Curriculum Vitae (PDF)"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#f59e0b" />
                          <path d="M14 2v6h6" fill="#d97706" />
                          <rect x="4.5" y="11.5" width="15" height="7" rx="1.5" fill="#071d3a" />
                          <text x="12" y="16.8" fill="#f59e0b" fontSize="5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">PDF</text>
                        </svg>
                        <span>SEE RESUME (PDF)</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
