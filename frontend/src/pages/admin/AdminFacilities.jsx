import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { facilitiesService, uploadService } from '../../services/endpoints.js'

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([])
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
    category: 'Science & STEM Labs',
    description: '',
    image_url: '',
    is_active: 1
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await facilitiesService.getAll()
      setFacilities(data)
    } catch {
      setMsg({ text: 'Failed to load facilities', type: 'danger' })
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
    if (tab === 'labs') return 'Science & STEM Labs'
    if (tab === 'transport') return 'Transportation'
    if (tab === 'sports') return 'Sports Facilities'
    return 'Science & STEM Labs'
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setForm({
        title: item.title || '',
        slug: item.slug || item.id || '',
        category: item.category || 'Science & STEM Labs',
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
      if (editingItem?.id) {
        await facilitiesService.update(editingItem.id, form)
        setMsg({ text: 'Facility updated', type: 'success' })
      } else {
        await facilitiesService.create(form)
        setMsg({ text: 'Facility added', type: 'success' })
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving facility', type: 'danger' })
    }
  }

  const matchesTab = (fac, tab) => {
    if (!tab || tab === 'all' || tab === 'overview') return true
    const text = `${fac.title || ''} ${fac.slug || ''} ${fac.category || ''} ${fac.description || ''} ${fac.desc || ''}`.toLowerCase()
    if (tab === 'infrastructure') {
      return text.includes('infrastructure') || text.includes('building') || text.includes('campus') || text.includes('foundation')
    }
    if (tab === 'classrooms') {
      return text.includes('classroom') || text.includes('smart') || text.includes('touchscreen') || text.includes('audio-visual')
    }
    if (tab === 'science') {
      return text.includes('physics') || text.includes('chemistry') || text.includes('biology') || (text.includes('science') && text.includes('lab'))
    }
    if (tab === 'computer') {
      return text.includes('computer') || text.includes('coding') || text.includes('digital education') || text.includes('it-lab')
    }
    if (tab === 'stem') {
      return text.includes('stem') || text.includes('engineering') || text.includes('prototypes')
    }
    if (tab === 'robotics') {
      return text.includes('robot') || text.includes('ai') || text.includes('artificial intelligence') || text.includes('arduino')
    }
    if (tab === 'library') {
      return text.includes('library') || text.includes('book') || text.includes('reading') || text.includes('literature')
    }
    if (tab === 'labs') {
      return text.includes('lab') || text.includes('science') || text.includes('stem') || text.includes('robotics') || text.includes('computer')
    }
    if (tab === 'transport') {
      return text.includes('transport') || text.includes('bus') || text.includes('transit') || text.includes('fleet')
    }
    if (tab === 'sports') {
      return text.includes('sport') || text.includes('athletic') || text.includes('ground') || text.includes('court') || text.includes('gym')
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
      sports: facilities.filter(f => matchesTab(f, 'sports')).length
    }
  }, [facilities])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return
    try {
      await facilitiesService.delete(id)
      setMsg({ text: 'Facility removed', type: 'success' })
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
                      <strong style={{ color: '#071d3a' }}>{fac.title}</strong>
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
                        onClick={() => handleDelete(fac.id)}
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
