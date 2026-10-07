import React, { useState, useEffect } from 'react'
import { galleryService, uploadService } from '../../services/endpoints.js'

export default function AdminGallery() {
  const [albums, setAlbums] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAlbum, setCurrentAlbum] = useState(null)
  
  // Modals & alerts
  const [albumModalOpen, setAlbumModalOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [newCatName, setNewCatName] = useState('')

  // Create / Edit Album Form
  const [albumForm, setAlbumForm] = useState({
    id: null,
    category_id: '',
    title: '',
    description: '',
    cover_image: '',
    is_published: 1
  })

  // Multi-upload state for current album
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({ total: 0, current: 0, active: false })
  const [batchCaption, setBatchCaption] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadService.uploadFile(file, 'gallery')
      setAlbumForm(prev => ({ ...prev, cover_image: url }))
      setMsg({ text: 'Album cover photo uploaded successfully!', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Cover photo upload failed', type: 'danger' })
    } finally {
      setUploadingCover(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [albumData, catData] = await Promise.all([
        galleryService.getAlbums(),
        galleryService.getCategories()
      ])
      setAlbums(albumData || [])
      setCategories(catData || [])

      // If viewing an album, refresh its data
      if (currentAlbum) {
        const refreshed = (albumData || []).find(a => a.id === currentAlbum.id)
        if (refreshed) setCurrentAlbum(refreshed)
      }
    } catch {
      setMsg({ text: 'Failed to load gallery albums', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Create or Update Album
  const handleSaveAlbum = async (e) => {
    e.preventDefault()
    try {
      if (albumForm.id) {
        await galleryService.updateAlbum(albumForm)
        setMsg({ text: 'Album updated successfully', type: 'success' })
      } else {
        await galleryService.createAlbum(albumForm)
        setMsg({ text: 'New album created', type: 'success' })
      }
      setAlbumModalOpen(false)
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving album', type: 'danger' })
    }
  }

  // Delete Album
  const handleDeleteAlbum = async (id, title) => {
    if (!window.confirm(`Delete the entire album "${title}" and all its photos? This action cannot be undone.`)) return
    try {
      await galleryService.deleteAlbum(id)
      setMsg({ text: 'Album deleted', type: 'success' })
      if (currentAlbum?.id === id) setCurrentAlbum(null)
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete album', type: 'danger' })
    }
  }

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    try {
      await galleryService.createCategory({ name: newCatName.trim() })
      setMsg({ text: 'Category created', type: 'success' })
      setCatModalOpen(false)
      setNewCatName('')
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Error creating category', type: 'danger' })
    }
  }

  // Handle Multi-File Selection
  const handleMultiFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setSelectedFiles(files)
  }

  // Upload Batch of Photos into Current Album
  const handleBatchUpload = async (e) => {
    e.preventDefault()
    if (!currentAlbum || selectedFiles.length === 0) return

    setUploadProgress({ total: selectedFiles.length, current: 0, active: true })
    const uploadedPhotos = []

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress({ total: selectedFiles.length, current: i + 1, active: true })
        const url = await uploadService.uploadFile(file, 'gallery')
        if (url) {
          uploadedPhotos.push({
            image_url: url,
            caption: batchCaption ? `${batchCaption} (${i + 1})` : file.name.replace(/\.[^/.]+$/, ''),
            order_index: (currentAlbum.photos?.length || 0) + i + 1
          })
        }
      }

      if (uploadedPhotos.length > 0) {
        await galleryService.addPhotos(currentAlbum.id, uploadedPhotos)
        setMsg({ text: `Successfully added ${uploadedPhotos.length} photo(s) to "${currentAlbum.title}"!`, type: 'success' })
      }

      setSelectedFiles([])
      setBatchCaption('')
      // Clear file input
      const fileInput = document.getElementById('multi-photo-input')
      if (fileInput) fileInput.value = ''
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed during multi-photo upload', type: 'danger' })
    } finally {
      setUploadProgress({ total: 0, current: 0, active: false })
    }
  }

  // Delete Individual Photo
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo from the album?')) return
    try {
      await galleryService.deletePhoto(photoId)
      setMsg({ text: 'Photo deleted', type: 'success' })
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete photo', type: 'danger' })
    }
  }

  // Set Photo as Album Cover
  const handleSetCover = async (imageUrl) => {
    if (!currentAlbum) return
    try {
      await galleryService.updateAlbum({
        ...currentAlbum,
        cover_image: imageUrl
      })
      setMsg({ text: 'Album cover updated', type: 'success' })
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update cover', type: 'danger' })
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>
            {currentAlbum ? `Album: ${currentAlbum.title}` : 'Gallery & Album Management'}
            <span className="admin-page-badge">Campus Media Archive</span>
          </h1>
          <p>
            {currentAlbum
              ? `Manage and batch upload multiple photos for this album.`
              : `Organize institute photos into named albums and add multiple photos to each album at once.`}
          </p>
        </div>
        <div className="admin-page-actions">
          {currentAlbum ? (
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setCurrentAlbum(null)
                setSelectedFiles([])
                setBatchCaption('')
              }}
            >
              ← Back to All Albums
            </button>
          ) : (
            <>
              <button className="admin-btn admin-btn-secondary" onClick={() => setCatModalOpen(true)}>
                + Add Category
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  setAlbumForm({
                    id: null,
                    category_id: categories[0]?.id || '',
                    title: '',
                    description: '',
                    cover_image: '',
                    is_published: 1
                  })
                  setAlbumModalOpen(true)
                }}
              >
                + Create New Album
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: 2 }}
            onClick={() => setMsg({ text: '', type: '' })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* ========================================================
          VIEW 1: SINGLE ALBUM DETAIL & MULTI-PHOTO UPLOAD
         ======================================================== */}
      {currentAlbum ? (
        <div>
          {/* Multi-Photo Batch Upload Card */}
          <div className="admin-card" style={{ marginBottom: 24, border: '2px dashed #0b63e5', background: '#f8fafc' }}>
            <div className="admin-card-header" style={{ background: '#eff6ff' }}>
              <div>
                <h3 style={{ color: '#0b63e5', margin: 0 }}>Add Multiple Photos to this Album</h3>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#475569' }}>
                  Select one or multiple photos from your computer to batch upload into <b>{currentAlbum.title}</b>.
                </p>
              </div>
            </div>

            <div className="admin-card-body">
              <form onSubmit={handleBatchUpload}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Select Photos (Multiple Allowed) *
                    </label>
                    <input
                      id="multi-photo-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiFileSelect}
                      className="admin-input"
                      disabled={uploadProgress.active}
                    />
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      Hold <kbd style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: 3 }}>Ctrl</kbd> or <kbd style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: 3 }}>Shift</kbd> to select multiple photos at once.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Common Caption Prefix (Optional)
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={batchCaption}
                      onChange={e => setBatchCaption(e.target.value)}
                      placeholder={`e.g. ${currentAlbum.title} Photo`}
                      disabled={uploadProgress.active}
                    />
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      Leave blank to use original file names as captions.
                    </div>
                  </div>
                </div>

                {/* Selected Files Preview List */}
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: 16, padding: 12, background: '#fff', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                        Selected: {selectedFiles.length} photo(s) ready to upload
                      </span>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm"
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }}
                        onClick={() => {
                          setSelectedFiles([])
                          const input = document.getElementById('multi-photo-input')
                          if (input) input.value = ''
                        }}
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxHeight: 130, overflowY: 'auto' }}>
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '4px 8px',
                            background: '#f1f5f9',
                            borderRadius: 4,
                            fontSize: 12,
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.name}
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: 11 }}>
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {uploadProgress.active && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#0b63e5', marginBottom: 6 }}>
                      <span>Uploading Photos...</span>
                      <span>{uploadProgress.current} / {uploadProgress.total}</span>
                    </div>
                    <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #0b63e5, #00b4d8)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Batch Button */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={selectedFiles.length === 0 || uploadProgress.active}
                    style={{ padding: '9px 24px', fontWeight: 600 }}
                  >
                    {uploadProgress.active
                      ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`
                      : `Upload ${selectedFiles.length > 0 ? selectedFiles.length + ' Photo(s)' : 'Photos'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Current Album Photos Grid */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>Photos in Album ({currentAlbum.photos?.length || 0})</h3>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>
                  Category: <b>{currentAlbum.category_name || 'General'}</b> {currentAlbum.description && `• ${currentAlbum.description}`}
                </span>
              </div>
            </div>

            <div className="admin-card-body">
              {loading ? (
                <div style={{ textAlign: 'center', padding: 30 }}>Loading photos...</div>
              ) : (!currentAlbum.photos || currentAlbum.photos.length === 0) ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                  <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#f1f5f9', color: '#64748b', marginBottom: 12 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <b>No photos in this album yet.</b>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>Use the upload section above to select and add multiple photos!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
                  {currentAlbum.photos.map((photo, i) => {
                    const isCover = currentAlbum.cover_image === photo.image_url
                    return (
                      <div
                        key={photo.id || i}
                        style={{
                          border: isCover ? '2px solid #0b63e5' : '1px solid #e2e8f0',
                          borderRadius: 6,
                          overflow: 'hidden',
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}
                      >
                        {isCover && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              background: '#0b63e5',
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              zIndex: 2,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5
                            }}
                          >
                            Cover
                          </div>
                        )}

                        <div style={{ height: 140, background: '#f1f5f9', overflow: 'hidden' }}>
                          <img
                            src={photo.image_url}
                            alt={photo.caption || 'Album Photo'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </div>

                        <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                            {photo.caption || `Photo ${i + 1}`}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                            {!isCover ? (
                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: '#0b63e5', fontSize: 11.5, cursor: 'pointer', padding: 0 }}
                                onClick={() => handleSetCover(photo.image_url)}
                              >
                                Set as Cover
                              </button>
                            ) : (
                              <span style={{ fontSize: 11.5, color: '#0b63e5', fontWeight: 600 }}>Album Cover</span>
                            )}

                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11.5 }}
                              onClick={() => handleDeletePhoto(photo.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
           VIEW 2: ALL ALBUMS LIST
           ======================================================== */
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Photo Albums ({albums.length})</h3>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Click on any album to open it and upload/manage its photos.</span>
            </div>
          </div>

          <div className="admin-card-body">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 30 }}>Loading albums...</div>
            ) : albums.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#f1f5f9', color: '#64748b', marginBottom: 12 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <b>No albums created yet.</b>
                <p style={{ margin: '4px 0 0', fontSize: 13 }}>Click "+ Create New Album" above to create your first photo album!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {albums.map(alb => {
                  const photoCount = alb.photo_count || alb.photos?.length || 0
                  return (
                    <div
                      key={alb.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                    >
                      {/* Album Cover */}
                      <div
                        style={{ height: 160, background: '#f1f5f9', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => setCurrentAlbum(alb)}
                      >
                        {alb.cover_image ? (
                          <img
                            src={alb.cover_image}
                            alt={alb.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                            No Cover Image
                          </div>
                        )}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 4,
                            letterSpacing: 0.3
                          }}
                        >
                          {photoCount} Photos
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#000000',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            textTransform: 'uppercase'
                          }}
                        >
                          {alb.category_name || 'General'}
                        </span>
                      </div>

                      {/* Album Content */}
                      <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4
                            style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
                            onClick={() => setCurrentAlbum(alb)}
                          >
                            {alb.title}
                          </h4>
                          {alb.description && (
                            <p style={{ margin: '5px 0 0', fontSize: 12.5, color: '#64748b', lineHeight: 1.4 }}>
                              {alb.description}
                            </p>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => setCurrentAlbum(alb)}
                          >
                            Manage Photos ({photoCount})
                          </button>
                          
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              onClick={() => {
                                setAlbumForm({
                                  id: alb.id,
                                  category_id: alb.category_id || '',
                                  title: alb.title,
                                  description: alb.description || '',
                                  cover_image: alb.cover_image || '',
                                  is_published: alb.is_published ?? 1
                                })
                                setAlbumModalOpen(true)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteAlbum(alb.id, alb.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT ALBUM
         ======================================================== */}
      {albumModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3>{albumForm.id ? 'Edit Album' : 'Create New Photo Album'}</h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={() => setAlbumModalOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAlbum}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Album Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={albumForm.title}
                    onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                    placeholder="e.g. Annual Sports Meet 2026"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    className="admin-select"
                    value={albumForm.category_id}
                    onChange={e => setAlbumForm({ ...albumForm, category_id: e.target.value })}
                  >
                    <option value="">-- General / Campus --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={albumForm.description}
                    onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })}
                    placeholder="Brief description of this photo album or event..."
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ fontWeight: 600 }}>Cover Image (Optional)</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1, minWidth: 200 }}
                      value={albumForm.cover_image || ''}
                      onChange={e => setAlbumForm({ ...albumForm, cover_image: e.target.value })}
                      placeholder="Paste image URL (https://...) or choose file"
                    />
                    <label
                      className="admin-btn admin-btn-secondary"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {albumForm.cover_image && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}
                        onClick={() => setAlbumForm({ ...albumForm, cover_image: '' })}
                        title="Clear cover image"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {uploadingCover && <div style={{ fontSize: 12, color: '#0b63e5', marginTop: 4 }}>Uploading cover photo...</div>}
                  {albumForm.cover_image ? (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={albumForm.cover_image}
                        alt="Album Cover Preview"
                        style={{ width: 100, height: 65, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1' }}
                      />
                      <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Custom cover photo set</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      If left blank, the first photo uploaded into this album will automatically become the cover.
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    className="admin-select"
                    value={albumForm.is_published}
                    onChange={e => setAlbumForm({ ...albumForm, is_published: Number(e.target.value) })}
                  >
                    <option value={1}>Published (Visible on Website)</option>
                    <option value={0}>Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setAlbumModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {albumForm.id ? 'Save Changes' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD CATEGORY
         ======================================================== */}
      {catModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 420 }}>
            <div className="admin-modal-header">
              <h3>Create Gallery Category</h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}
                onClick={() => setCatModalOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Convocation, Free Health Camps"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setCatModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
