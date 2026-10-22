import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { facilitiesService, uploadService } from '../../services/endpoints.js'

export const CANONICAL_FACILITIES = [
  {
    id: 'fac-infra',
    title: 'Infrastructure Overview',
    slug: 'infrastructure',
    category: 'Campus',
    order_index: 1,
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious, purpose-built multi-acre campuses at Isbavi (Foundation Campus) and Shelve (Main High School Campus) featuring child-safe infrastructure, ventilated classrooms, and expansive playgrounds.'
  },
  {
    id: 'fac-smart',
    title: 'Smart Classrooms',
    slug: 'smart-classrooms',
    category: 'Academic',
    order_index: 2,
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: 'Equipped with interactive smart boards, digital audio-visual resources, and ergonomic seating.'
  },
  {
    id: 'fac-science',
    title: 'Science Laboratories',
    slug: 'science-labs',
    category: 'Academic',
    order_index: 3,
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    description: 'Dedicated, well-equipped physics, chemistry, and biology laboratories for safe practical experiments.'
  },
  {
    id: 'fac-computer',
    title: 'Computer Laboratory',
    slug: 'computer-lab',
    category: 'Academic',
    order_index: 4,
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Modern computer facilities for digital education, providing 1:1 computer access, high-speed broadband, and programming platforms.'
  },
  {
    id: 'fac-stem',
    title: 'STEM Laboratory',
    slug: 'stem-lab',
    category: 'Innovation',
    order_index: 5,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Hands-on science, technology, engineering and mathematics learning where students build mechanical models and test creative ideas.'
  },
  {
    id: 'fac-robotics',
    title: 'AI & Robotics Lab',
    slug: 'stem-robotics',
    category: 'Innovation',
    order_index: 6,
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'State-of-the-art computational studio with Arduino kits, microcontrollers, and coding software.'
  },
  {
    id: 'fac-library',
    title: 'Central School Library',
    slug: 'library',
    category: 'Academic',
    order_index: 7,
    image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    description: 'Rich collection of over 8,000 curriculum texts, reference encyclopedias, and quiet reading zones.'
  },
  {
    id: 'fac-sports',
    title: 'Sports Grounds & Outdoor Arenas',
    slug: 'sports',
    category: 'Campus',
    order_index: 8,
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-lane running tracks, football ground, cricket nets, kabaddi mud courts, and volleyball setups.'
  },
  {
    id: 'fac-transport',
    title: 'School Bus Transportation',
    slug: 'transport',
    category: 'Campus',
    order_index: 9,
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Fleet of GPS-monitored yellow school buses with female attendants connecting Pandharpur and nearby towns.'
  },
  {
    id: 'fac-av',
    title: 'Digital Media & AV Hall',
    slug: 'digital-av-hall',
    category: 'Academic',
    order_index: 10,
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious audio-visual hall for seminars, educational screenings, storytelling, and student assemblies.'
  }
]

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState(CANONICAL_FACILITIES)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'all'

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Academic',
    description: '',
    image_url: '',
    is_active: 1
  })

  const mergeCanonicalFacilities = (apiList) => {
    if (Array.isArray(apiList) && apiList.length > 0) {
      return [...apiList].sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0))
    }
    return CANONICAL_FACILITIES
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await facilitiesService.getAll()
      if (Array.isArray(data)) {
        setFacilities(mergeCanonicalFacilities(data))
      } else {
        setFacilities(CANONICAL_FACILITIES)
      }
    } catch {
      setFacilities(CANONICAL_FACILITIES)
      setMsg({ text: 'Notice: Using local default facilities.', type: 'info' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getDefaultCategoryForTab = (tab) => {
    if (tab === 'infrastructure') return 'Infrastructure'
    if (tab === 'classrooms') return 'Smart Classrooms'
    if (tab === 'science') return 'Science Laboratories'
    if (tab === 'computer') return 'Computer Laboratory'
    if (tab === 'stem') return 'STEM Laboratory'
    if (tab === 'robotics') return 'AI & Robotics Lab'
    if (tab === 'library') return 'Digital Library'
    if (tab === 'transport') return 'Transportation'
    if (tab === 'sports') return 'Sports Facilities'
    if (tab === 'av') return 'General Amenities'
    return 'Infrastructure'
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setForm({
        title: item.title || '',
        slug: item.slug || item.id || '',
        category: item.category || 'Infrastructure',
        description: item.description || item.desc || '',
        image_url: item.image_url || item.img || '',
        is_active: item.is_active !== undefined ? item.is_active : 1
      })
    } else {
      setEditingItem(null)
      setForm({
        title: '',
        slug: '',
        category: getDefaultCategoryForTab(activeTab),
        description: '',
        image_url: '',
        is_active: 1
      })
    }
    setModalOpen(true)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'facilities')
      setForm(prev => ({ ...prev, image_url: url }))
      setMsg({ text: 'Facility photograph uploaded', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const targetId = editingItem.id || editingItem.slug
        await facilitiesService.update(targetId, {
          ...form,
          id: editingItem.id,
          slug: form.slug || editingItem.slug
        })
        setMsg({ text: 'Facility updated successfully', type: 'success' })
      } else {
        await facilitiesService.create(form)
        setMsg({ text: 'Facility added successfully', type: 'success' })
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving facility', type: 'danger' })
    }
  }

  const matchesTab = (fac, tab) => {
    if (!tab || tab === 'all' || tab === 'overview') return true
    const slug = (fac.slug || fac.id || '').toLowerCase()
    const title = (fac.title || '').toLowerCase()
    const cat = (fac.category || '').toLowerCase()

    if (tab === 'infrastructure') {
      return slug === 'infrastructure' || title.includes('infrastructure') || cat.includes('infrastructure')
    }
    if (tab === 'classrooms') {
      return slug === 'smart-classrooms' || slug === 'classrooms' || title.includes('classroom') || cat.includes('classroom')
    }
    if (tab === 'science') {
      return slug === 'science-labs' || slug === 'science' || title.includes('science') || cat.includes('science')
    }
    if (tab === 'computer') {
      return slug === 'computer-lab' || slug === 'computer' || title.includes('computer') || cat.includes('computer')
    }
    if (tab === 'stem') {
      return (slug === 'stem-lab' || (slug.includes('stem') && !slug.includes('robotics')) || title.includes('stem')) && !title.includes('robotics')
    }
    if (tab === 'robotics') {
      return slug === 'stem-robotics' || slug === 'ai-robotics' || slug.includes('robotics') || title.includes('robotics') || cat.includes('robotics') || title.includes('ai & robotics')
    }
    if (tab === 'library') {
      return slug === 'library' || slug === 'digital-library' || title.includes('library') || cat.includes('library')
    }
    if (tab === 'transport') {
      return slug === 'transport' || slug === 'transportation' || title.includes('transport') || title.includes('bus') || cat.includes('transport')
    }
    if (tab === 'sports') {
      return slug === 'sports' || slug === 'sports-facilities' || title.includes('sport') || title.includes('arenas') || cat.includes('sport')
    }
    if (tab === 'av') {
      return slug === 'digital-av-hall' || slug.includes('av') || title.includes('av hall') || title.includes('digital media') || cat.includes('av') || cat.includes('media')
    }
    return true
  }

  const filteredFacilities = useMemo(() => {
    return facilities.filter(fac => matchesTab(fac, activeTab))
  }, [facilities, activeTab])

  const tabCounts = useMemo(() => {
    return {
      all: facilities.length,
      infrastructure: facilities.filter(f => matchesTab(f, 'infrastructure')).length,
      classrooms: facilities.filter(f => matchesTab(f, 'classrooms')).length,
      science: facilities.filter(f => matchesTab(f, 'science')).length,
      computer: facilities.filter(f => matchesTab(f, 'computer')).length,
      stem: facilities.filter(f => matchesTab(f, 'stem')).length,
      robotics: facilities.filter(f => matchesTab(f, 'robotics')).length,
      library: facilities.filter(f => matchesTab(f, 'library')).length,
      transport: facilities.filter(f => matchesTab(f, 'transport')).length,
      sports: facilities.filter(f => matchesTab(f, 'sports')).length,
      av: facilities.filter(f => matchesTab(f, 'av')).length
    }
  }, [facilities])

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete the facility "${item.title}"?`)) return
    try {
      const targetId = item.id || item.slug
      if (targetId) {
        await facilitiesService.delete(targetId)
      }
      setFacilities(prev => prev.filter(f => f.id !== item.id && (!item.slug || f.slug !== item.slug)))
      setMsg({ text: 'Facility removed successfully', type: 'success' })
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete facility', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            Facilities & Infrastructure
            <span className="admin-page-badge">Campus Amenities</span>
          </h1>
          <p>
            Manage campus infrastructure: science &amp; STEM laboratories, transportation fleet, sports grounds, and academic facilities.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Add Facility
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 style={{ margin: 0 }}>Campus Facilities</h3>
            <span style={{ fontSize: 13, color: '#5c6672' }}>
              Showing {filteredFacilities.length} of {facilities.length} items
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'all' || activeTab === 'overview' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({})}
            style={{ fontSize: 12 }}
          >
            All Facilities ({tabCounts.all})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'infrastructure' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'infrastructure' })}
            style={{ fontSize: 12 }}
          >
            Infrastructure ({tabCounts.infrastructure})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'classrooms' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'classrooms' })}
            style={{ fontSize: 12 }}
          >
            Smart Classrooms ({tabCounts.classrooms})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'science' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'science' })}
            style={{ fontSize: 12 }}
          >
            Science Labs ({tabCounts.science})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'computer' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'computer' })}
            style={{ fontSize: 12 }}
          >
            Computer Lab ({tabCounts.computer})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'stem' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'stem' })}
            style={{ fontSize: 12 }}
          >
            STEM Lab ({tabCounts.stem})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'robotics' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'robotics' })}
            style={{ fontSize: 12 }}
          >
            AI &amp; Robotics ({tabCounts.robotics})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'library' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'library' })}
            style={{ fontSize: 12 }}
          >
            Digital Library ({tabCounts.library})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'transport' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'transport' })}
            style={{ fontSize: 12 }}
          >
            Transportation ({tabCounts.transport})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'sports' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'sports' })}
            style={{ fontSize: 12 }}
          >
            Sports Facilities ({tabCounts.sports})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'av' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'av' })}
            style={{ fontSize: 12 }}
          >
            Digital Media &amp; AV ({tabCounts.av})
          </button>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading facilities...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Facility Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((fac, i) => (
                  <tr key={fac.id || i}>
                    <td>
                      <img
                        src={fac.image_url || fac.img}
                        alt={fac.title}
                        style={{ width: 50, height: 35, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </td>
                    <td>
                      <strong style={{ color: '#2050a4' }}>{fac.title}</strong>
                    </td>
                    <td>
                      <span className="admin-badge badge-info">{fac.category || 'Facility'}</span>
                    </td>
                    <td style={{ fontSize: 12, color: '#5c6672' }}>{fac.description || fac.desc}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenModal(fac)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(fac)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFacilities.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>
                      No facilities found under this category tab. Click "+ Add Facility" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Facility' : 'Add Facility'}</h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={() => setModalOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Facility Title *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={form.title}
                      onChange={e => {
                        const title = e.target.value
                        setForm({
                          ...form,
                          title,
                          slug: form.slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                        })
                      }}
                      placeholder="e.g. Science Laboratories, School Bus Transport..."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      className="admin-select"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Smart Classrooms">Smart Classrooms</option>
                      <option value="Science Laboratories">Science Laboratories</option>
                      <option value="Computer Laboratory">Computer Laboratory</option>
                      <option value="STEM Laboratory">STEM Laboratory</option>
                      <option value="AI & Robotics Lab">AI &amp; Robotics Lab</option>
                      <option value="Digital Library">Digital Library</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Sports Facilities">Sports Facilities</option>
                      <option value="Science & STEM Labs">Science &amp; STEM Labs</option>
                      <option value="General Amenities">General Amenities</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Facility Description *</label>
                  <textarea
                    rows="3"
                    required
                    className="admin-textarea"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Equipment, capacity, clinical functions..."
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 600 }}>Facility Photograph</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1, minWidth: 200 }}
                      value={form.image_url || ''}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      placeholder="Paste image URL (https://...) or choose file"
                    />
                    <label
                      className="admin-btn admin-btn-secondary"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0, height: 38 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {form.image_url && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                        onClick={() => setForm({ ...form, image_url: '' })}
                        title="Clear photo"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {uploading && <div style={{ fontSize: 12, color: '#1a4f8b', marginTop: 4 }}>Uploading photo...</div>}
                  {form.image_url && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={form.image_url} alt="Facility Preview" style={{ width: 90, height: 55, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Facility photo active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
