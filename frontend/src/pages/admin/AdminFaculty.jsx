import React, { useState, useEffect } from 'react'
import { facultyService, departmentsService, uploadService, clearLocalCache } from '../../services/endpoints.js'
import { resolveMediaUrl } from '../../utils/mediaUrl.js'

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const initialForm = {
    department_id: '',
    name: '',
    designation: '',
    program_badge: 'BPT',
    qualification: '',
    specialization: '',
    experience: '',
    email: '',
    phone: '',
    photo: '',
    profile_description: '',
    research_interests: '',
    google_scholar: '',
    orcid: '',
    scopus: '',
    linkedin: '',
    research_gate: '',
    resume_url: '',
    order_index: 0,
    is_active: 1
  }

  const [form, setForm] = useState(initialForm)

  const loadData = async () => {
    setLoading(true)
    try {
      const [facData, deptData] = await Promise.all([
        facultyService.getAll(true),
        departmentsService.getAll()
      ])
      setFaculty(Array.isArray(facData) ? facData : [])
      setDepartments(Array.isArray(deptData) ? deptData : [])
    } catch {
      setMsg({ text: 'Failed to load faculty information', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingFaculty(item)
      setForm({
        department_id: item.department_id || '',
        name: item.name || '',
        designation: item.designation || '',
        program_badge: item.program_badge || 'BPT',
        qualification: item.qualification || '',
        specialization: item.specialization || '',
        experience: item.experience || '',
        email: item.email || '',
        phone: item.phone || '',
        photo: item.photo || '',
        profile_description: item.profile_description || '',
        research_interests: item.research_interests || '',
        google_scholar: item.google_scholar || '',
        orcid: item.orcid || '',
        scopus: item.scopus || '',
        linkedin: item.linkedin || '',
        research_gate: item.research_gate || '',
        resume_url: item.resume_url || '',
        order_index: item.order_index || 0,
        is_active: item.is_active !== undefined ? item.is_active : 1
      })
    } else {
      setEditingFaculty(null)
      setForm({
        ...initialForm,
        department_id: departments[0]?.id || '',
        order_index: faculty.length + 1
      })
    }
    setModalOpen(true)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadService.uploadFile(file, 'faculty')
      setForm(prev => ({ ...prev, photo: url }))
      setMsg({ text: 'Faculty photograph uploaded successfully', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Photo upload failed', type: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingResume(true)
    try {
      const url = await uploadService.uploadFile(file, 'resumes')
      setForm(prev => ({ ...prev, resume_url: url }))
      setMsg({ text: 'Resume / CV file uploaded successfully', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Resume upload failed', type: 'danger' })
    } finally {
      setUploadingResume(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFaculty?.id) {
        await facultyService.update(editingFaculty.id, form)
        setMsg({ text: 'Faculty profile updated successfully', type: 'success' })
      } else {
        await facultyService.create(form)
        setMsg({ text: 'Faculty member added successfully', type: 'success' })
      }
      clearLocalCache('faculty')
      setModalOpen(false)
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving faculty', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this faculty member?')) return
    try {
      await facultyService.delete(id)
      clearLocalCache('faculty')
      setMsg({ text: 'Faculty member removed successfully', type: 'success' })
      loadData()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete faculty', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            Faculty & Staff Directory
            <span className="admin-page-badge">Academic Staff</span>
          </h1>
          <p>
            Manage faculty profiles, academic badges, qualifications, research interests, and optional scholar links.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Add Faculty Member
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
          <h3>Faculty Directory</h3>
          <span style={{ fontSize: 13, color: '#5c6672' }}>Total: {faculty.length}</span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>Loading faculty records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 55 }}>Photo</th>
                    <th>Faculty Name & Role</th>
                    <th>Department & Badges</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Optional Profiles</th>
                    <th style={{ width: 130, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f, i) => {
                    const avatarUrl = f.photo ? resolveMediaUrl(f.photo) : null
                    const hasScholar = Boolean(f.google_scholar)
                    const hasOrcid = Boolean(f.orcid)
                    const hasScopus = Boolean(f.scopus)
                    const hasLinkedIn = Boolean(f.linkedin)
                    const hasRG = Boolean(f.research_gate)
                    const hasResume = Boolean(f.resume_url)

                    return (
                      <tr key={f.id || i}>
                        <td>
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={f.name}
                              style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                            />
                          ) : (
                            <div style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              background: '#071d3a',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 14
                            }}>
                              {(f.name || 'F').charAt(0)}
                            </div>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: '#071d3a', fontSize: 14 }}>{f.name}</strong>
                          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>{f.designation}</div>
                          {f.email && <div style={{ fontSize: 11.5, color: '#64748b' }}>{f.email}</div>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #bfdbfe',
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 4
                            }}>
                              {f.program_badge || 'BPT'}
                            </span>
                            {f.specialization && (
                              <span style={{
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                fontSize: 10.5,
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: 4
                              }}>
                                {f.specialization}
                              </span>
                            )}
                            {f.department_name && (
                              <span style={{
                                background: '#f8fafc',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: 4
                              }}>
                                {f.department_name}
                              </span>
                            )}
                            {!f.specialization && !f.department_name && (
                              <span style={{
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                fontSize: 10.5,
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: 4
                              }}>
                                PHYSIOTHERAPY
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
                          {f.qualification || '—'}
                        </td>
                        <td style={{ fontSize: 13, color: '#475569' }}>
                          {f.experience || '—'}
                        </td>
                        <td>
                          {/* Profiles Indicators */}
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <span
                              title={hasScholar ? `Google Scholar: ${f.google_scholar}` : 'Google Scholar: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasScholar ? '#071d3a' : '#f1f5f9',
                                color: hasScholar ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasScholar ? '#071d3a' : '#e2e8f0'
                              }}
                            >
                              GS
                            </span>
                            <span
                              title={hasOrcid ? `ORCID: ${f.orcid}` : 'ORCID: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasOrcid ? '#a6ce39' : '#f1f5f9',
                                color: hasOrcid ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasOrcid ? '#8eb922' : '#e2e8f0'
                              }}
                            >
                              iD
                            </span>
                            <span
                              title={hasScopus ? `Scopus: ${f.scopus}` : 'Scopus: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasScopus ? '#ea580c' : '#f1f5f9',
                                color: hasScopus ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasScopus ? '#ea580c' : '#e2e8f0'
                              }}
                            >
                              SCOPUS
                            </span>
                            <span
                              title={hasLinkedIn ? `LinkedIn: ${f.linkedin}` : 'LinkedIn: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasLinkedIn ? '#0a66c2' : '#f1f5f9',
                                color: hasLinkedIn ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasLinkedIn ? '#0a66c2' : '#e2e8f0'
                              }}
                            >
                              IN
                            </span>
                            <span
                              title={hasRG ? `ResearchGate: ${f.research_gate}` : 'ResearchGate: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasRG ? '#00ccbb' : '#f1f5f9',
                                color: hasRG ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasRG ? '#00b3a4' : '#e2e8f0'
                              }}
                            >
                              RG
                            </span>
                            <span
                              title={hasResume ? `Resume: ${f.resume_url}` : 'Resume: Not set'}
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                background: hasResume ? '#dc2626' : '#f1f5f9',
                                color: hasResume ? '#ffffff' : '#94a3b8',
                                border: '1px solid',
                                borderColor: hasResume ? '#dc2626' : '#e2e8f0'
                              }}
                            >
                              CV
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ marginRight: 6 }}
                            onClick={() => handleOpenModal(f)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(f.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD/EDIT FACULTY MODAL ================= */}
      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 720 }}>
            <div className="admin-modal-header">
              <h3>{editingFaculty ? 'Edit Faculty Profile' : 'Add New Faculty Member'}</h3>
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
              <div className="admin-modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                {/* Section 1: Core Details */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#071d3a', borderBottom: '1px solid #e2e8f0', paddingBottom: 6, margin: '0 0 12px' }}>
                    1. Basic Information & Role
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Dr. Wagh Vaibhav Sudhakar"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Designation *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={form.designation}
                        onChange={e => setForm({ ...form, designation: e.target.value })}
                        placeholder="e.g. ASSOCIATE PROFESSOR"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Program Badge</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={form.program_badge}
                        onChange={e => setForm({ ...form, program_badge: e.target.value })}
                        placeholder="e.g. BPT, MPT, B.PHARM"
                      />
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {['BPT', 'MPT', 'Ph.D', 'B.PHARM'].map(badge => (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => setForm({ ...form, program_badge: badge })}
                            style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              background: form.program_badge === badge ? '#2563eb' : '#f1f5f9',
                              color: form.program_badge === badge ? '#fff' : '#334155',
                              border: '1px solid #cbd5e1',
                              borderRadius: 4,
                              cursor: 'pointer'
                            }}
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Department</label>
                      <select
                        className="admin-select"
                        value={form.department_id}
                        onChange={e => setForm({ ...form, department_id: e.target.value })}
                      >
                        <option value="">-- General / College-wide --</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Experience (Years)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={form.experience}
                        onChange={e => setForm({ ...form, experience: e.target.value })}
                        placeholder="e.g. 16 Years"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Qualification *</label>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={form.qualification}
                        onChange={e => setForm({ ...form, qualification: e.target.value })}
                        placeholder="e.g. M. Pharm, P.hD or MPT (Neuro)"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Specialization / Dept Badge</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={form.specialization}
                        onChange={e => setForm({ ...form, specialization: e.target.value })}
                        placeholder="e.g. PHARMACEUTICAL CHEMISTRY"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact & Photograph */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#071d3a', borderBottom: '1px solid #e2e8f0', paddingBottom: 6, margin: '0 0 12px' }}>
                    2. Contact & Photograph
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="admin-input"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. vaibhavsw2011@rediffmail.com"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Contact Phone</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 8149371381"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Faculty Photograph</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="admin-input"
                        style={{ flex: 1 }}
                      />
                      {form.photo && (
                        <img
                          src={resolveMediaUrl(form.photo)}
                          alt="Preview"
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }}
                        />
                      )}
                    </div>
                    {uploading && <div style={{ fontSize: 12, color: '#1d4ed8', marginTop: 4 }}>Uploading photo...</div>}
                    <div style={{ marginTop: 4 }}>
                      <input
                        type="text"
                        placeholder="Or enter image URL directly"
                        value={form.photo}
                        onChange={e => setForm({ ...form, photo: e.target.value })}
                        className="admin-input"
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Research Interests & Biography */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#071d3a', borderBottom: '1px solid #e2e8f0', paddingBottom: 6, margin: '0 0 12px' }}>
                    3. Research Interests & Bio
                  </h4>

                  <div className="admin-form-group">
                    <label>Research Interests <span style={{ color: '#64748b', fontWeight: 400 }}>(Optional - displayed in popup card)</span></label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={form.research_interests}
                      onChange={e => setForm({ ...form, research_interests: e.target.value })}
                      placeholder="e.g. Analytical method development and validation, Process development and validation, Nano technology formulation..."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Profile Biography <span style={{ color: '#64748b', fontWeight: 400 }}>(Optional)</span></label>
                    <textarea
                      rows="2"
                      className="admin-textarea"
                      value={form.profile_description}
                      onChange={e => setForm({ ...form, profile_description: e.target.value })}
                      placeholder="Brief academic history, achievements or clinical background..."
                    />
                  </div>
                </div>

                {/* Section 4: Academic & Professional Profiles (OPTIONAL) */}
                <div style={{ marginBottom: 16, background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#071d3a', margin: 0 }}>
                      4. Academic Profiles & Resume (Optional)
                    </h4>
                    <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '2px 8px', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                      Optional Fields
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                    Buttons for these profiles will appear in the faculty popup only if the corresponding URL is provided.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Google Scholar Profile URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={form.google_scholar}
                        onChange={e => setForm({ ...form, google_scholar: e.target.value })}
                        placeholder="https://scholar.google.com/citations?user=..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>ORCID Profile / ID</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={form.orcid}
                        onChange={e => setForm({ ...form, orcid: e.target.value })}
                        placeholder="e.g. 0000-0002-1825-0097 or URL"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Scopus Profile URL / ID</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={form.scopus}
                        onChange={e => setForm({ ...form, scopus: e.target.value })}
                        placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>LinkedIn Profile URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={form.linkedin}
                        onChange={e => setForm({ ...form, linkedin: e.target.value })}
                        placeholder="https://www.linkedin.com/in/..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>ResearchGate Profile URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={form.research_gate}
                        onChange={e => setForm({ ...form, research_gate: e.target.value })}
                        placeholder="https://www.researchgate.net/profile/..."
                      />
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: 6 }}>
                    <label>Curriculum Vitae / Resume (PDF)</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="admin-input"
                        style={{ flex: 1 }}
                      />
                      {form.resume_url && (
                        <a
                          href={resolveMediaUrl(form.resume_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}
                        >
                          View PDF
                        </a>
                      )}
                    </div>
                    {uploadingResume && <div style={{ fontSize: 12, color: '#1d4ed8', marginTop: 4 }}>Uploading resume document...</div>}
                    <div style={{ marginTop: 4 }}>
                      <input
                        type="text"
                        placeholder="Or enter direct PDF document URL"
                        value={form.resume_url}
                        onChange={e => setForm({ ...form, resume_url: e.target.value })}
                        className="admin-input"
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Visibility & Ordering */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={form.is_active === 1 || form.is_active === true}
                      onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#071d3a' }}>Active & Visible on Public Website</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Display Order:</span>
                    <input
                      type="number"
                      className="admin-input"
                      style={{ width: 70, padding: '4px 8px', fontSize: 12 }}
                      value={form.order_index}
                      onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    />
                  </div>
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
                  {editingFaculty ? 'Save Changes' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
