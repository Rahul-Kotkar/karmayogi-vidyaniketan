import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import NoticeCard from '../components/NoticeCard.jsx'
import { DEFAULT_NOTICES } from '../data/collegeData.js'
import { noticesService, getCachedNotices, setCachedNotices } from '../services/endpoints.js'
import { FilePdfIcon } from '../components/Icons.jsx'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

export default function Notices() {
  const cached = getCachedNotices()
  const [notices, setNotices] = useState(() => (Array.isArray(cached) && cached.length > 0 ? cached : null))
  const [loading, setLoading] = useState(() => !cached || cached.length === 0)
  const [params] = useSearchParams()
  const openId = params.get('n')

  const fetchNotices = () => {
    noticesService.getAll().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setNotices(data)
        setCachedNotices(data)
      } else {
        setNotices(DEFAULT_NOTICES)
      }
      setLoading(false)
    }).catch(() => {
      setNotices(prev => prev || DEFAULT_NOTICES)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchNotices()
    window.addEventListener('notices_updated', fetchNotices)
    return () => window.removeEventListener('notices_updated', fetchNotices)
  }, [])

  if (loading && (!notices || notices.length === 0)) {
    return (
      <PageShell title="Notices">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 20px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: 36,
            height: 36,
            border: '3px solid #e2e8f0',
            borderTopColor: '#134A98',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            marginBottom: 16
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', fontSize: 15, fontWeight: 500, margin: 0 }}>
            Loading Notices...
          </p>
        </div>
      </PageShell>
    )
  }

  const safeNotices = notices || []
  const open = safeNotices.find(n => String(n.id) === openId)
  return (
    <PageShell title="Notices">
      {open && (
        <div className="notice-row" style={{ marginBottom: 24 }}>
          <div className="notice-body" style={{ paddingLeft: 8 }}>
            <small>{open.category} · {open.notice_date || open.date}</small>
            <h4>{open.title}</h4>
            <p>{open.body}</p>
            {open.file_url && (
              <p style={{ marginTop: 10 }}>
                <a
                  href={resolveMediaUrl(open.file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
                >
                  <FilePdfIcon size={14} color="#ffffff" />
                  <span>Download Attached Circular (PDF)</span>
                </a>
              </p>
            )}
          </div>
        </div>
      )}
      {safeNotices.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '36px 0' }}>No notices published yet.</p>
      ) : (
        safeNotices.map(n => <NoticeCard key={n.id} notice={n} />)
      )}
    </PageShell>
  )
}
