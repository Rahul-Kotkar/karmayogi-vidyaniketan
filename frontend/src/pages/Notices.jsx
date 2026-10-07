import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import NoticeCard from '../components/NoticeCard.jsx'
import { noticesService, getCachedNotices, setCachedNotices } from '../services/endpoints.js'
import { FilePdfIcon } from '../components/Icons.jsx'

export default function Notices() {
  const [notices, setNotices] = useState(() => getCachedNotices() || [])
  const [loading, setLoading] = useState(() => !getCachedNotices())
  const [params] = useSearchParams()
  const openId = params.get('n')

  useEffect(() => {
    noticesService.getAll().then(data => {
      setNotices(data)
      setCachedNotices(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const open = notices.find(n => String(n.id) === openId)
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
                  href={open.file_url}
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
      {loading && notices.length === 0 ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          <div style={{ background: '#f8fafc', height: 72, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>
      ) : notices.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '36px 0' }}>No notices published yet.</p>
      ) : (
        notices.map(n => <NoticeCard key={n.id} notice={n} />)
      )}
    </PageShell>
  )
}
