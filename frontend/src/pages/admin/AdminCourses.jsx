import React, { useState, useEffect } from 'react'
import { coursesService } from '../../services/endpoints.js'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [form, setForm] = useState({
    code: '',
    name: '',
    degree_level: 'UG',
    duration: '',
    eligibility: '',
    intake: 'As per sanctioned intake',
    fees: 'As per FRA norms',
    description: '',
    status: 'Active'
  })

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await coursesService.getAll()
      setCourses(data)
    } catch {
      setMsg({ text: 'Failed to load courses', type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleOpenModal = (c = null) => {
    if (c) {
      setEditingCourse(c)
      setForm({
        code: c.code || c.id || '',
        name: c.name || '',
        degree_level: c.degree_level || 'UG',
        duration: c.duration || '',
        eligibility: c.eligibility || '',
        intake: c.intake || 'As per sanctioned intake',
        fees: c.fees || 'As per FRA norms',
        description: c.description || '',
        status: c.status || 'Active'
      })
    } else {
      setEditingCourse(null)
      setForm({
        code: '',
        name: '',
        degree_level: 'UG',
        duration: '',
        eligibility: '',
        intake: 'As per sanctioned intake',
        fees: 'As per FRA norms',
        description: '',
        status: 'Active'
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourse?.id) {
        await coursesService.update(editingCourse.id, form)
        setMsg({ text: 'Course details updated', type: 'success' })
      } else {
        await coursesService.create(form)
        setMsg({ text: 'New course added', type: 'success' })
      }
      setModalOpen(false)
      loadCourses()
    } catch (err) {
      setMsg({ text: err.message || 'Error saving course', type: 'danger' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course from catalog?')) return
    try {
      await coursesService.delete(id)
      setMsg({ text: 'Course deleted', type: 'success' })
      loadCourses()
    } catch (err) {
      setMsg({ text: err.message || 'Failed to delete course', type: 'danger' })
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>
            Academic Programs & Courses
            <span className="admin-page-badge">Program Catalog</span>
          </h1>
          <p>
            Manage degree programs (BPT, MPT, Ph.D.), sanctioned seat intake, eligibility criteria, and fee structures.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            + Add Academic Program
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
          <h3>Programs Catalog</h3>
          <span style={{ fontSize: 13, color: '#5c6672' }}>Total: {courses.length}</span>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 30, textAlign: 'center' }}>Loading courses...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Code</th>
                  <th>Course Title</th>
                  <th>Duration</th>
                  <th>Intake</th>
                  <th>Eligibility</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id || c.code}>
                    <td>
                      <span className="admin-badge badge-info">{c.code || c.id}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#071d3a' }}>{c.name}</strong>
                      <div style={{ fontSize: 12, color: '#5c6672', marginTop: 3 }}>
                        {c.description}
                      </div>
                    </td>
                    <td>{c.duration}</td>
                    <td>{c.intake || 'Sanctioned intake'}</td>
                    <td style={{ fontSize: 12 }}>{c.eligibility}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenModal(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingCourse ? 'Edit Academic Program' : 'Add Academic Program'}</h3>
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
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Course Code *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. BPT"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Course Name *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Bachelor of Physiotherapy (BPT)"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Degree Level</label>
                    <select
                      className="admin-select"
                      value={form.degree_level}
                      onChange={e => setForm({ ...form, degree_level: e.target.value })}
                    >
                      <option value="UG">Undergraduate (UG)</option>
                      <option value="PG">Postgraduate (PG)</option>
                      <option value="PhD">Doctoral (Ph.D.)</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Duration *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                      placeholder="e.g. 4 Years + 6 Months Internship"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Approved Intake</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.intake}
                      onChange={e => setForm({ ...form, intake: e.target.value })}
                      placeholder="e.g. 60 Seats"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Eligibility Criteria *</label>
                  <textarea
                    rows="2"
                    required
                    className="admin-textarea"
                    value={form.eligibility}
                    onChange={e => setForm({ ...form, eligibility: e.target.value })}
                    placeholder="e.g. 10+2 with PCB and valid NEET-UG score"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Course Overview & Objectives</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Fee Details</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.fees}
                      onChange={e => setForm({ ...form, fees: e.target.value })}
                      placeholder="e.g. As per Fee Regulating Authority"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Admission Status</label>
                    <select
                      className="admin-select"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active / Open</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Archived">Archived</option>
                    </select>
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
                  {editingCourse ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
