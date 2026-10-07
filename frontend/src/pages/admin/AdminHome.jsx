import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pagesService, uploadService, setCachedHomeData } from '../../services/endpoints.js'
import { HERO_SLIDES, NEWS as DEFAULT_NEWS, ACHIEVEMENTS as DEFAULT_ACHIEVEMENTS, DEFAULT_WHY_ITEMS, DEFAULT_TESTIMONIALS } from '../../data/collegeData.js'

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('hero')
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)

  const [homeData, setHomeData] = useState({
    // Hero Slider
    hero_slides: HERO_SLIDES,
    hero_slide_duration: 7,

    // About Section
    about_sub: 'ABOUT KARMAYOGI',
    about_title: 'Education with purpose, practice, and perspective',
    about_p1: 'Karmayogi College of Physiotherapy nurtures clinical capability alongside curiosity, confidence, and professional responsibility in a focused academic environment.',
    about_p2: 'Approved by the Directorate of Medical Education and Research (DMER), Mumbai, the institution offers state-of-the-art laboratories, extensive clinical postings, and a dedicated academic faculty.',
    about_p3: 'With experienced faculty, modern laboratories, an attached hospital and a strong research culture, the institution trains competent, compassionate physiotherapists who serve communities across the region and the country.',
    about_btn_text: 'Discover Our Institute →',
    about_btn_link: '/about',

    // Floating Highlights Strip
    highlight_1: 'Established in 2008',
    highlight_2: 'Physiotherapy Education',
    highlight_3: 'Industry-Focused Learning',
    highlight_4: 'Vibrant Campus Life',

    // Why Karmayogi Section
    why_tag: 'WHY KARMAYOGI',
    why_title: 'An environment designed for growth',
    why_items: DEFAULT_WHY_ITEMS,

    // Stats
    stat_1_val: '25+', stat_1_lbl: 'Years of Excellence',
    stat_2_val: '1500+', stat_2_lbl: 'Alumni Physiotherapists',
    stat_3_val: '30+', stat_3_lbl: 'Experienced Faculty',
    stat_4_val: 'Grade A', stat_4_lbl: 'Accreditation & Recognition',

    // Principal
    principal_sub: 'From the Desk of',
    principal_title: "Principal's Message",
    principal_name: 'Dr. S. P. Deshmukh',
    principal_designation: 'Principal, MPT (Ortho), Ph.D.\nKarmayogi College of Physiotherapy',
    principal_photo_url: '',
    principal_btn_text: 'Read More →',
    principal_btn_link: '/about',
    principal_message: `Dear Students, Parents and Well-wishers,

It gives me immense pleasure to welcome you to Karmayogi College of Physiotherapy, Shelve, Pandharpur. Physiotherapy is a noble profession dedicated to restoring movement, relieving pain, and improving the quality of life of every patient we serve.

Our institution strives to blend strong academic foundations with rigorous clinical training, ethical medical practice, and meaningful rehabilitation research. Our students learn not only the science of rehabilitation but also the art of compassionate patient care. I invite you to join us in this journey of healing and service.

Our distinguished faculty team brings decades of clinical expertise across Orthopaedic Physiotherapy, Neurosciences, Cardiopulmonary Rehabilitation, Sports Medicine, and Community Rehabilitation. With cutting-edge electrotherapy modalities, biomechanics laboratories, and specialized kinesiology gymnasiums, we ensure that every student gains extensive practical acumen right from their foundational years.

Through direct hands-on bedside postings at our multi-specialty teaching hospital, rural healthcare outreach camps, and evidence-based clinical case presentations, our students cultivate decisive clinical reasoning and deep empathy. We take pride in mentoring graduates who excel in hospital networks, private rehabilitation centers, sports organizations, and postgraduate research institutions nationwide.

As we continually advance our academic programs in accordance with MUHS and national healthcare standards, I welcome you to explore our vibrant campus and partner with us in shaping the future of rehabilitative medicine.`,

    // Campus Life Feature (After Principal's Desk)
    campus_life_eyebrow: 'CAMPUS LIFE',
    campus_life_title: 'A campus made for learning and belonging',
    campus_life_desc: 'From laboratories and library resources to sports, cultural activities, and student clubs, campus life creates space to learn, contribute, and connect.',
    campus_life_btn_text: 'Explore Campus Life',
    campus_life_btn_link: '/student-corner/activities',
    campus_life_image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80',
    campus_life_tile1_title: 'Modern Laboratories',
    campus_life_tile1_link: '/facilities',
    campus_life_tile2_title: 'Sports & Culture',
    campus_life_tile2_link: '/student-corner/activities',

    // Section Titles
    facilities_sub: 'Campus',
    facilities_title: 'Facilities',
    notices_sub: 'Notice Board',
    notices_title: 'Latest Notices',
    events_sub: 'Calendar',
    events_title: 'Upcoming Events',
    news_sub: 'Media',
    news_title: 'College News',
    achievements_sub: 'Proud Moments',
    achievements_title: 'Student Achievements',
    gallery_sub: 'Campus Life',
    gallery_title: 'Photo Gallery',

    // Dynamic Lists
    news_list: DEFAULT_NEWS,
    achievements_list: DEFAULT_ACHIEVEMENTS,

    // Student Voices / Learning Experiences (Testimonials)
    testimonials_eyebrow: 'STUDENT VOICES',
    testimonials_title: 'Learning experiences',
    testimonials_subtitle: 'The comments below are sample placeholders and are not presented as verified testimonials.',
    testimonials_list: DEFAULT_TESTIMONIALS
  })

  const [saving, setSaving] = useState(false)
  const [uploadingSlide, setUploadingSlide] = useState(false)
  const [uploadingPrincipal, setUploadingPrincipal] = useState(false)
  const [uploadingCampusLife, setUploadingCampusLife] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // New News Item Draft
  const [newNews, setNewNews] = useState({ date: new Date().toISOString().split('T')[0], title: '', desc: '' })
  const [showAddNews, setShowAddNews] = useState(false)

  // New Achievement Draft
  const [newAch, setNewAch] = useState({ title: '', detail: '' })
  const [showAddAch, setShowAddAch] = useState(false)

  // Testimonials Draft
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', name: '', role: '' })
  const [showAddTestimonial, setShowAddTestimonial] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const page = await pagesService.getBySlug('home')
        if (page && page.content_html) {
          try {
            const parsed = JSON.parse(page.content_html)
            setHomeData(prev => {
              // Ensure hero_slides is an array
              let slides = (parsed.hero_slides && Array.isArray(parsed.hero_slides) && parsed.hero_slides.length > 0)
                ? parsed.hero_slides
                : prev.hero_slides

              // If legacy hero_title or hero_image_url was saved in old format, merge into slide 0
              if (parsed.hero_title && (!parsed.hero_slides || parsed.hero_slides.length === 0)) {
                slides = slides.map((s, idx) => idx === 0 ? {
                  ...s,
                  title: parsed.hero_title || s.title,
                  tag: parsed.hero_tag || s.tag,
                  description: parsed.hero_sub || parsed.hero_tagline || s.description,
                  image: parsed.hero_image_url || s.image
                } : s)
              }

              return {
                ...prev,
                ...parsed,
                hero_slides: slides,
                news_list: (parsed.news_list && parsed.news_list.length > 0) ? parsed.news_list : prev.news_list,
                achievements_list: (parsed.achievements_list && parsed.achievements_list.length > 0) ? parsed.achievements_list : prev.achievements_list,
                why_items: (parsed.why_items && Array.isArray(parsed.why_items) && parsed.why_items.length > 0) ? parsed.why_items : (prev.why_items || DEFAULT_WHY_ITEMS),
                testimonials_list: (parsed.testimonials_list && Array.isArray(parsed.testimonials_list) && parsed.testimonials_list.length > 0) ? parsed.testimonials_list : (prev.testimonials_list || DEFAULT_TESTIMONIALS)
              }
            })
          } catch {
            // Not JSON
          }
        }
      } catch {
        // Fallback
      }
    }
    load()
  }, [])

  // Slide CRUD Helpers
  const currentSlides = homeData.hero_slides || HERO_SLIDES
  const safeSlideIdx = activeSlideIdx < currentSlides.length ? activeSlideIdx : 0
  const activeSlide = currentSlides[safeSlideIdx] || currentSlides[0]

  const updateActiveSlide = (field, value) => {
    const updated = currentSlides.map((slide, i) => {
      if (i === safeSlideIdx) {
        return { ...slide, [field]: value }
      }
      return slide
    })
    setHomeData(prev => ({
      ...prev,
      hero_slides: updated,
      // Keep legacy fields in sync from slide 0
      ...(safeSlideIdx === 0 ? {
        hero_title: field === 'title' ? value : prev.hero_title,
        hero_tag: field === 'tag' ? value : prev.hero_tag,
        hero_sub: field === 'description' ? value : prev.hero_sub,
        hero_image_url: field === 'image' ? value : prev.hero_image_url
      } : {})
    }))
  }

  const updateActiveSlideButton = (btnType, field, value) => {
    const updated = currentSlides.map((slide, i) => {
      if (i === safeSlideIdx) {
        const btn = slide[btnType] || {}
        return {
          ...slide,
          [btnType]: { ...btn, [field]: value }
        }
      }
      return slide
    })
    setHomeData(prev => ({ ...prev, hero_slides: updated }))
  }

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingSlide(true)
    try {
      const url = await uploadService.uploadFile(file, 'banners')
      updateActiveSlide('image', url)
      setMsg({ text: `Slide ${safeSlideIdx + 1} photo uploaded successfully! Click "Save All Changes" to publish.`, type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Slide image upload failed', type: 'danger' })
    } finally {
      setUploadingSlide(false)
    }
  }

  const handleAddNewSlide = () => {
    const newSlide = {
      id: Date.now(),
      tag: 'NEW ANNOUNCEMENT | SPECIALTY CARE',
      title: 'New Spotlight Title Here',
      description: 'Enter a compelling description highlighting academic programs, hospital facilities or research achievements.',
      quote: 'Excellence in Physical Healthcare',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
      primaryBtn: { text: 'Learn More →', link: '/about' },
      secondaryBtn: { text: 'Contact Us', link: '/contact' }
    }
    const updated = [...currentSlides, newSlide]
    setHomeData(prev => ({ ...prev, hero_slides: updated }))
    setActiveSlideIdx(updated.length - 1)
    setMsg({ text: `New Slide ${updated.length} added! Customize its details below and save.`, type: 'success' })
  }

  const handleDeleteSlide = (index) => {
    if (currentSlides.length <= 1) {
      alert('You must keep at least 1 hero slide.')
      return
    }
    if (!window.confirm(`Are you sure you want to delete Slide ${index + 1}?`)) return
    const updated = currentSlides.filter((_, i) => i !== index)
    setHomeData(prev => ({ ...prev, hero_slides: updated }))
    setActiveSlideIdx(Math.max(0, index - 1))
    setMsg({ text: `Slide ${index + 1} deleted.`, type: 'success' })
  }

  const handleMoveSlide = (index, direction) => {
    const newIdx = index + direction
    if (newIdx < 0 || newIdx >= currentSlides.length) return
    const updated = [...currentSlides]
    const temp = updated[index]
    updated[index] = updated[newIdx]
    updated[newIdx] = temp
    setHomeData(prev => ({ ...prev, hero_slides: updated }))
    setActiveSlideIdx(newIdx)
  }

  // Principal Photo Upload
  const handlePrincipalPhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPrincipal(true)
    try {
      const url = await uploadService.uploadFile(file, 'faculty')
      setHomeData(prev => {
        const next = { ...prev, principal_photo_url: url }
        setCachedHomeData(next)
        return next
      })
      setMsg({ text: 'Principal portrait uploaded successfully! Click "Save All Changes" to publish.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploadingPrincipal(false)
    }
  }

  // Campus Life Photo Upload
  const handleCampusLifePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingCampusLife(true)
    try {
      const url = await uploadService.uploadFile(file, 'campus_life')
      setHomeData(prev => {
        const next = { ...prev, campus_life_image: url }
        setCachedHomeData(next)
        return next
      })
      setMsg({ text: 'Campus Life photo uploaded successfully! Click "Save All Changes" to publish.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Image upload failed', type: 'danger' })
    } finally {
      setUploadingCampusLife(false)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await pagesService.save({
        slug: 'home',
        title: 'Homepage All Elements & Slider',
        content_html: JSON.stringify(homeData)
      })
      setCachedHomeData(homeData)
      setMsg({ text: 'All homepage elements & sliding photos saved successfully! Changes are immediately live on the website.', type: 'success' })
    } catch (err) {
      setMsg({ text: err.message || 'Error saving homepage content', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  // News CRUD Helpers
  const handleAddNews = (e) => {
    e.preventDefault()
    if (!newNews.title) return
    const updated = [
      { id: Date.now(), ...newNews },
      ...(homeData.news_list || [])
    ]
    setHomeData({ ...homeData, news_list: updated })
    setNewNews({ date: new Date().toISOString().split('T')[0], title: '', desc: '' })
    setShowAddNews(false)
  }

  const handleDeleteNews = (index) => {
    const updated = homeData.news_list.filter((_, i) => i !== index)
    setHomeData({ ...homeData, news_list: updated })
  }

  // Achievements CRUD Helpers
  const handleAddAchievement = (e) => {
    e.preventDefault()
    if (!newAch.title) return
    const updated = [
      { ...newAch },
      ...(homeData.achievements_list || [])
    ]
    setHomeData({ ...homeData, achievements_list: updated })
    setNewAch({ title: '', detail: '' })
    setShowAddAch(false)
  }

  const handleDeleteAchievement = (index) => {
    const updated = homeData.achievements_list.filter((_, i) => i !== index)
    setHomeData({ ...homeData, achievements_list: updated })
  }

  // Testimonials (Student Voices) CRUD Helpers
  const handleAddTestimonial = (e) => {
    e.preventDefault()
    if (!newTestimonial.quote || !newTestimonial.name) {
      alert('Please enter both quote text and student/alumnus name.')
      return
    }
    const item = {
      id: Date.now(),
      quote: newTestimonial.quote.trim(),
      name: newTestimonial.name.trim(),
      role: newTestimonial.role.trim() || 'Student testimonial placeholder'
    }
    const updated = [...(homeData.testimonials_list || DEFAULT_TESTIMONIALS), item]
    setHomeData({ ...homeData, testimonials_list: updated })
    setNewTestimonial({ quote: '', name: '', role: '' })
    setShowAddTestimonial(false)
  }

  const handleUpdateTestimonial = (index, field, value) => {
    const list = [...(homeData.testimonials_list || DEFAULT_TESTIMONIALS)]
    list[index] = { ...list[index], [field]: value }
    setHomeData({ ...homeData, testimonials_list: list })
  }

  const handleDeleteTestimonial = (index) => {
    const list = [...(homeData.testimonials_list || DEFAULT_TESTIMONIALS)]
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return
    const updated = list.filter((_, i) => i !== index)
    setHomeData({ ...homeData, testimonials_list: updated })
  }

  const tabs = [
    {
      id: 'hero',
      label: '1. Sliding Photos & Hero Carousel',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      id: 'why',
      label: '2. Why Karmayogi (Growth)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      id: 'stats',
      label: '3. Highlights & Key Stats',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      id: 'principal',
      label: "4. Principal's Desk",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'campus_life',
      label: '5. Campus Life Feature',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: 'testimonials',
      label: '6. Student Voices (Testimonials)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'headers',
      label: '7. Section Headings',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    }
  ]

  return (
    <div>
      {/* Header Bar */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Homepage &amp; Media Control</span>
          <h1>Homepage Management (100% Control)</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Customize sliding photos, carousel content, hero texts, stats counters, news, and achievements.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', marginBottom: 24, paddingBottom: 6 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 15px',
              borderRadius: 6,
              border: activeTab === t.id ? '1px solid #0f2d59' : '1px solid #e2e8f0',
              background: activeTab === t.id ? '#0f2d59' : '#ffffff',
              color: activeTab === t.id ? '#ffffff' : '#475569',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ==================================================== */}
        {/* TAB 1: SLIDING PHOTOS & HERO CAROUSEL */}
        {/* ==================================================== */}
        {activeTab === 'hero' && (
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>1. Hero Sliding Photos &amp; Content Carousel</h3>
                <span style={{ fontSize: 12, color: '#5c6672' }}>
                  Manage multiple rotating slides: photos, titles, badges, descriptions, quotes, and buttons
                </span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={handleAddNewSlide}
                style={{ fontSize: 12.5 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add New Slide</span>
              </button>
            </div>
            <div className="admin-card-body">
              {/* Carousel Configuration Strip */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Auto-Rotation Duration:</label>
                  <select
                    className="admin-input"
                    style={{ width: 140, padding: '6px 10px', fontSize: 13 }}
                    value={homeData.hero_slide_duration || 7}
                    onChange={e => setHomeData({ ...homeData, hero_slide_duration: Number(e.target.value) })}
                  >
                    <option value={5}>5 seconds</option>
                    <option value={7}>7 seconds (default)</option>
                    <option value={10}>10 seconds</option>
                    <option value={12}>12 seconds</option>
                  </select>
                </div>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Total Slides: <strong>{currentSlides.length}</strong> | Auto-pauses when visitor hovers mouse over slider
                </span>
              </div>

              {/* Slide Selection Bar */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {currentSlides.map((slide, i) => (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => setActiveSlideIdx(i)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: safeSlideIdx === i ? '1.5px solid #0b63e5' : '1px solid #cbd5e1',
                      background: safeSlideIdx === i ? '#eff6ff' : '#ffffff',
                      color: safeSlideIdx === i ? '#0b63e5' : '#334155',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>Slide {i + 1}</span>
                    {safeSlideIdx === i && <span style={{ fontSize: 11, background: '#0b63e5', color: 'white', padding: '1px 5px', borderRadius: 999 }}>Active</span>}
                  </button>
                ))}
              </div>

              {/* Active Slide Editor */}
              {activeSlide && (
                <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 20, background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, background: '#0b63e5', color: 'white', padding: '3px 10px', borderRadius: 4 }}>
                        Editing Slide {safeSlideIdx + 1} of {currentSlides.length}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        "{activeSlide.title ? activeSlide.title.substring(0, 35) + '...' : 'Untitled'}"
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(safeSlideIdx, -1)}
                        disabled={safeSlideIdx === 0}
                        className="admin-btn admin-btn-outline"
                        style={{ fontSize: 12, padding: '4px 10px' }}
                        title="Move Slide Up/Left"
                      >
                        ← Move Left
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(safeSlideIdx, 1)}
                        disabled={safeSlideIdx === currentSlides.length - 1}
                        className="admin-btn admin-btn-outline"
                        style={{ fontSize: 12, padding: '4px 10px' }}
                        title="Move Slide Down/Right"
                      >
                        Move Right →
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(safeSlideIdx)}
                        disabled={currentSlides.length <= 1}
                        className="admin-btn admin-btn-danger"
                        style={{ fontSize: 12, padding: '4px 10px' }}
                      >
                        Delete Slide
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                    <div>
                      <div className="admin-form-group">
                        <label>Tag Badge Text</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={activeSlide.tag || ''}
                          onChange={e => updateActiveSlide('tag', e.target.value)}
                          placeholder="e.g. HEAL | LEARN | SERVE | GROW"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Main Headline Title *</label>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          value={activeSlide.title || ''}
                          onChange={e => updateActiveSlide('title', e.target.value)}
                          placeholder="e.g. Building Healthier Lives Through Physiotherapy"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Lead Description Paragraph</label>
                        <textarea
                          rows="3"
                          className="admin-textarea"
                          value={activeSlide.description || ''}
                          onChange={e => updateActiveSlide('description', e.target.value)}
                          placeholder="Describe the clinical excellence, campus, or career opportunity..."
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="admin-form-group">
                          <label>Primary Button Text</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={activeSlide.primaryBtn?.text || ''}
                            onChange={e => updateActiveSlideButton('primaryBtn', 'text', e.target.value)}
                            placeholder="Explore Our Programs →"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Primary Button Link</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={activeSlide.primaryBtn?.link || ''}
                            onChange={e => updateActiveSlideButton('primaryBtn', 'link', e.target.value)}
                            placeholder="/academics"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="admin-form-group">
                          <label>Secondary Button Text</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={activeSlide.secondaryBtn?.text || ''}
                            onChange={e => updateActiveSlideButton('secondaryBtn', 'text', e.target.value)}
                            placeholder="About Our College"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Secondary Button Link</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={activeSlide.secondaryBtn?.link || ''}
                            onChange={e => updateActiveSlideButton('secondaryBtn', 'link', e.target.value)}
                            placeholder="/about"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Slide Photo Upload & Preview */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
                      <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>Slide {safeSlideIdx + 1} Photo</h4>
                      <div style={{ width: '100%', height: 180, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        {activeSlide.image ? (
                          <img src={activeSlide.image} alt={`Slide ${safeSlideIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 12, color: '#64748b' }}>Default Campus Building</span>
                        )}
                      </div>
                      <div className="admin-form-group">
                        <label style={{ fontSize: 12 }}>Upload New Photo for Slide {safeSlideIdx + 1}</label>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <span>{uploadingSlide ? 'Uploading...' : 'Choose Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlideImageUpload}
                              disabled={uploadingSlide}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                        {uploadingSlide && <p style={{ fontSize: 11, color: '#0284c7', margin: '4px 0 0' }}>Uploading photo...</p>}
                      </div>
                      <div className="admin-form-group" style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 12 }}>Or Paste Photo URL</label>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ fontSize: 12 }}
                          value={activeSlide.image || ''}
                          onChange={e => updateActiveSlide('image', e.target.value)}
                          placeholder="https://... or /uploads/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: WHY KARMAYOGI (GROWTH ENVIRONMENT) */}
        {/* ==================================================== */}
        {activeTab === 'why' && (
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>2. Why Karmayogi (Growth Environment) Section</h3>
                <span style={{ fontSize: 12, color: '#5c6672' }}>Controls the feature cards grid highlighting faculty, infrastructure, curriculum, and student support</span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  const newItem = {
                    id: Date.now(),
                    icon: 'faculty',
                    title: 'New Key Highlight',
                    description: 'Description of the academic, practical or developmental benefit for students.'
                  }
                  setHomeData(prev => ({
                    ...prev,
                    why_items: [...(prev.why_items || DEFAULT_WHY_ITEMS), newItem]
                  }))
                }}
                style={{ fontSize: 12.5 }}
              >
                + Add Feature Card
              </button>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
                <div className="admin-form-group">
                  <label>Section Tag / Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.why_tag || ''}
                    onChange={e => setHomeData({ ...homeData, why_tag: e.target.value })}
                    placeholder="WHY KARMAYOGI"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Section Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.why_title || ''}
                    onChange={e => setHomeData({ ...homeData, why_title: e.target.value })}
                    placeholder="An environment designed for growth"
                  />
                </div>
              </div>

              <h4 style={{ fontSize: 14, margin: '20px 0 12px', color: '#0f172a' }}>Feature Cards Grid ({(homeData.why_items || DEFAULT_WHY_ITEMS).length} Cards)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                {(homeData.why_items || DEFAULT_WHY_ITEMS).map((card, idx) => (
                  <div key={card.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#00458b', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4 }}>
                        Card #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = homeData.why_items || DEFAULT_WHY_ITEMS
                          if (currentItems.length <= 1) {
                            alert('You must keep at least 1 feature card.')
                            return
                          }
                          const updated = currentItems.filter((_, i) => i !== idx)
                          setHomeData({ ...homeData, why_items: updated })
                        }}
                        className="admin-btn admin-btn-danger"
                        style={{ fontSize: 11, padding: '2px 8px' }}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontSize: 12 }}>Card Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={card.title || ''}
                        onChange={e => {
                          const currentItems = [...(homeData.why_items || DEFAULT_WHY_ITEMS)]
                          currentItems[idx] = { ...currentItems[idx], title: e.target.value }
                          setHomeData({ ...homeData, why_items: currentItems })
                        }}
                        placeholder="e.g. Experienced Faculty"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label style={{ fontSize: 12 }}>Icon Style</label>
                      <select
                        className="admin-input"
                        value={card.icon || 'faculty'}
                        onChange={e => {
                          const currentItems = [...(homeData.why_items || DEFAULT_WHY_ITEMS)]
                          currentItems[idx] = { ...currentItems[idx], icon: e.target.value }
                          setHomeData({ ...homeData, why_items: currentItems })
                        }}
                      >
                        <option value="faculty">👥 Faculty / Mentors</option>
                        <option value="infrastructure">🏢 Modern Infrastructure / Campus</option>
                        <option value="curriculum">📖 Industry / Clinical Curriculum</option>
                        <option value="research">💡 Innovation &amp; Research</option>
                        <option value="development">🎓 Student Development</option>
                        <option value="placement">💼 Placement Support</option>
                      </select>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: 12 }}>Card Description</label>
                      <textarea
                        rows="2"
                        className="admin-textarea"
                        value={card.description || ''}
                        onChange={e => {
                          const currentItems = [...(homeData.why_items || DEFAULT_WHY_ITEMS)]
                          currentItems[idx] = { ...currentItems[idx], description: e.target.value }
                          setHomeData({ ...homeData, why_items: currentItems })
                        }}
                        placeholder="Approachable mentors support academic progress..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    if (window.confirm('Reset all feature cards to the standard 6 reference cards?')) {
                      setHomeData(prev => ({
                        ...prev,
                        why_tag: 'WHY KARMAYOGI',
                        why_title: 'An environment designed for growth',
                        why_items: DEFAULT_WHY_ITEMS
                      }))
                    }
                  }}
                  style={{ fontSize: 12 }}
                >
                  ↺ Reset to Standard 6 Cards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: FLOATING HIGHLIGHTS & STATISTICS */}
        {/* ==================================================== */}
        {activeTab === 'stats' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>3. Floating Highlights Strip &amp; Milestone Counters</h3>
              <span style={{ fontSize: 12, color: '#5c6672' }}>Controls the 4 top floating feature badges and impact milestone counters</span>
            </div>
            <div className="admin-card-body">
              <h4 style={{ fontSize: 13.5, margin: '0 0 12px', color: '#00458b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Top Floating Highlights Strip (4 Badges)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: 12 }}>Highlight 1 (🎓 Grad Cap)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.highlight_1 || ''}
                    onChange={e => setHomeData({ ...homeData, highlight_1: e.target.value })}
                    placeholder="Established in 2008"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: 12 }}>Highlight 2 (📖 Book)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.highlight_2 || ''}
                    onChange={e => setHomeData({ ...homeData, highlight_2: e.target.value })}
                    placeholder="Physiotherapy Education"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: 12 }}>Highlight 3 (💼 Briefcase)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.highlight_3 || ''}
                    onChange={e => setHomeData({ ...homeData, highlight_3: e.target.value })}
                    placeholder="Industry-Focused Learning"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: 12 }}>Highlight 4 (👥 Users)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.highlight_4 || ''}
                    onChange={e => setHomeData({ ...homeData, highlight_4: e.target.value })}
                    placeholder="Vibrant Campus Life"
                  />
                </div>
              </div>

              <h4 style={{ fontSize: 13.5, margin: '0 0 12px', color: '#0f172a' }}>Milestone Numbers &amp; Counters</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13.5 }}>Counter 1</h4>
                  <label>Value / Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_1_val || ''}
                    onChange={e => setHomeData({ ...homeData, stat_1_val: e.target.value })}
                    placeholder="25+"
                  />
                  <label style={{ marginTop: 8 }}>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_1_lbl || ''}
                    onChange={e => setHomeData({ ...homeData, stat_1_lbl: e.target.value })}
                    placeholder="Years of Excellence"
                  />
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13.5 }}>Counter 2</h4>
                  <label>Value / Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_2_val || ''}
                    onChange={e => setHomeData({ ...homeData, stat_2_val: e.target.value })}
                    placeholder="1500+"
                  />
                  <label style={{ marginTop: 8 }}>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_2_lbl || ''}
                    onChange={e => setHomeData({ ...homeData, stat_2_lbl: e.target.value })}
                    placeholder="Alumni Physiotherapists"
                  />
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13.5 }}>Counter 3</h4>
                  <label>Value / Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_3_val || ''}
                    onChange={e => setHomeData({ ...homeData, stat_3_val: e.target.value })}
                    placeholder="30+"
                  />
                  <label style={{ marginTop: 8 }}>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_3_lbl || ''}
                    onChange={e => setHomeData({ ...homeData, stat_3_lbl: e.target.value })}
                    placeholder="Experienced Faculty"
                  />
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13.5 }}>Counter 4</h4>
                  <label>Value / Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_4_val || ''}
                    onChange={e => setHomeData({ ...homeData, stat_4_val: e.target.value })}
                    placeholder="Grade A"
                  />
                  <label style={{ marginTop: 8 }}>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.stat_4_lbl || ''}
                    onChange={e => setHomeData({ ...homeData, stat_4_lbl: e.target.value })}
                    placeholder="Accreditation & Recognition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: PRINCIPAL'S DESK */}
        {/* ==================================================== */}
        {activeTab === 'principal' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>4. From the Desk of Principal</h3>
              <span style={{ fontSize: 12, color: '#5c6672' }}>Photo, name, credentials, and full welcome speech</span>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                    <div className="admin-form-group">
                      <label>Section Sub-title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.principal_sub || ''}
                        onChange={e => setHomeData({ ...homeData, principal_sub: e.target.value })}
                        placeholder="From the Desk of"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Section Main Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.principal_title || ''}
                        onChange={e => setHomeData({ ...homeData, principal_title: e.target.value })}
                        placeholder="Principal's Message"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="admin-form-group">
                      <label>Principal's Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.principal_name || ''}
                        onChange={e => setHomeData({ ...homeData, principal_name: e.target.value })}
                        placeholder="Dr. S. P. Deshmukh"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Button Text</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.principal_btn_text || ''}
                        onChange={e => setHomeData({ ...homeData, principal_btn_text: e.target.value })}
                        placeholder="Read More →"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Designation &amp; Qualifications (Multiple lines supported)</label>
                    <textarea
                      rows="2"
                      className="admin-textarea"
                      value={homeData.principal_designation || ''}
                      onChange={e => setHomeData({ ...homeData, principal_designation: e.target.value })}
                      placeholder="Principal, MPT (Ortho), Ph.D.&#10;Karmayogi College of Physiotherapy"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Principal's Welcome Address Text</label>
                    <textarea
                      rows="10"
                      className="admin-textarea"
                      value={homeData.principal_message || ''}
                      onChange={e => setHomeData({ ...homeData, principal_message: e.target.value })}
                    />
                    <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 0' }}>
                      <strong>Pro Tip:</strong> Separate paragraphs with a blank line. The website displays the first 10 lines of the address initially and provides an in-place &quot;Read More →&quot; toggle that expands the full message directly on the homepage.
                    </p>
                  </div>
                </div>

                {/* Principal Photo */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>Principal Photo</h4>
                  <div style={{ width: '100%', height: 200, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    {homeData.principal_photo_url ? (
                      <img src={homeData.principal_photo_url} alt="Principal Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 12, color: '#64748b' }}>Default Portrait</span>
                    )}
                  </div>
                  <div className="admin-form-group">
                    <label style={{ fontSize: 12 }}>Upload New Portrait</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>{uploadingPrincipal ? 'Uploading...' : 'Choose Portrait'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePrincipalPhotoUpload}
                          disabled={uploadingPrincipal}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    {uploadingPrincipal && <p style={{ fontSize: 11, color: '#0284c7', margin: '4px 0 0' }}>Uploading portrait...</p>}
                  </div>
                  <div className="admin-form-group" style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 12 }}>Or Paste Photo URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ fontSize: 12 }}
                      value={homeData.principal_photo_url || ''}
                      onChange={e => setHomeData({ ...homeData, principal_photo_url: e.target.value })}
                      placeholder="https://... or /uploads/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: CAMPUS LIFE FEATURE (AFTER PRINCIPAL'S DESK) */}
        {/* ==================================================== */}
        {activeTab === 'campus_life' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>5. Campus Life Feature (After Principal&apos;s Desk)</h3>
              <span style={{ fontSize: 12, color: '#5c6672' }}>
                Controls the 2-column &quot;A campus made for learning and belonging&quot; section on the homepage with collaborative lab photo and 2 colored highlight tiles
              </span>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                {/* Left Form Column */}
                <div>
                  <div className="admin-form-group">
                    <label>Eyebrow Tag (Small uppercase header)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={homeData.campus_life_eyebrow || ''}
                      onChange={e => setHomeData({ ...homeData, campus_life_eyebrow: e.target.value })}
                      placeholder="CAMPUS LIFE"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Section Heading *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={homeData.campus_life_title || ''}
                      onChange={e => setHomeData({ ...homeData, campus_life_title: e.target.value })}
                      placeholder="A campus made for learning and belonging"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Description Paragraph *</label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={homeData.campus_life_desc || ''}
                      onChange={e => setHomeData({ ...homeData, campus_life_desc: e.target.value })}
                      placeholder="From laboratories and library resources to sports, cultural activities, and student clubs, campus life creates space to learn, contribute, and connect."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Action Button Text</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.campus_life_btn_text || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_btn_text: e.target.value })}
                        placeholder="Explore Campus Life"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Action Button Redirect Link</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.campus_life_btn_link || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_btn_link: e.target.value })}
                        placeholder="/student-corner/activities"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                    <div className="admin-form-group">
                      <label style={{ color: '#00458b', fontWeight: 700 }}>Tile 1: Deep Blue Tile (Modern Laboratories)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.campus_life_tile1_title || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_tile1_title: e.target.value })}
                        placeholder="Modern Laboratories"
                      />
                      <input
                        type="text"
                        className="admin-input"
                        style={{ marginTop: 6, fontSize: 12 }}
                        value={homeData.campus_life_tile1_link || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_tile1_link: e.target.value })}
                        placeholder="Link e.g. /facilities"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ color: '#b45309', fontWeight: 700 }}>Tile 2: Golden Amber Tile (Sports &amp; Culture)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={homeData.campus_life_tile2_title || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_tile2_title: e.target.value })}
                        placeholder="Sports & Culture"
                      />
                      <input
                        type="text"
                        className="admin-input"
                        style={{ marginTop: 6, fontSize: 12 }}
                        value={homeData.campus_life_tile2_link || ''}
                        onChange={e => setHomeData({ ...homeData, campus_life_tile2_link: e.target.value })}
                        placeholder="Link e.g. /student-corner/activities"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Visual & Live Preview Column */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>Feature Photo (Laboratory / Students)</h4>
                  <div className="admin-form-group">
                    <label style={{ fontSize: 12 }}>Upload Feature Image</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>{uploadingCampusLife ? 'Uploading...' : 'Choose Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCampusLifePhotoUpload}
                          disabled={uploadingCampusLife}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    {uploadingCampusLife && <p style={{ fontSize: 11, color: '#0284c7', margin: '4px 0 0' }}>Uploading image...</p>}
                  </div>
                  <div className="admin-form-group" style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 12 }}>Or Paste Photo URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ fontSize: 12 }}
                      value={homeData.campus_life_image || ''}
                      onChange={e => setHomeData({ ...homeData, campus_life_image: e.target.value })}
                      placeholder="https://... or /uploads/..."
                    />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h5 style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Live Composite Card Preview:
                    </h5>
                    <div style={{ width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: '#fff' }}>
                      <div style={{ width: '100%', height: 160, background: '#0b1f3b', overflow: 'hidden' }}>
                        <img
                          src={homeData.campus_life_image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80'}
                          alt="Campus Life Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <div style={{ background: '#00458b', color: '#fff', padding: '14px 12px' }}>
                          <div style={{ fontSize: 16, marginBottom: 6 }}>🔬</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{homeData.campus_life_tile1_title || 'Modern Laboratories'}</div>
                        </div>
                        <div style={{ background: '#e2a84a', color: '#1a202c', padding: '14px 12px' }}>
                          <div style={{ fontSize: 16, marginBottom: 6 }}>🏆</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{homeData.campus_life_tile2_title || 'Sports & Culture'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: STUDENT VOICES / TESTIMONIALS (CRUD) */}
        {/* ==================================================== */}
        {activeTab === 'testimonials' && (
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>6. Student Voices / Learning Experiences (Testimonials)</h3>
                <span style={{ fontSize: 12, color: '#5c6672' }}>Add, edit, or delete student and alumni testimonials displayed at the bottom of the homepage</span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowAddTestimonial(!showAddTestimonial)}
              >
                {showAddTestimonial ? 'Close Form' : '+ Add Testimonial'}
              </button>
            </div>
            <div className="admin-card-body">
              {/* Section Header Controls */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 14, color: '#0f172a' }}>Section Title &amp; Description</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                  <div className="admin-form-group">
                    <label>Eyebrow / Category Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={homeData.testimonials_eyebrow || ''}
                      onChange={e => setHomeData({ ...homeData, testimonials_eyebrow: e.target.value })}
                      placeholder="STUDENT VOICES"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Main Section Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={homeData.testimonials_title || ''}
                      onChange={e => setHomeData({ ...homeData, testimonials_title: e.target.value })}
                      placeholder="Learning experiences"
                    />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginTop: 12 }}>
                  <label>Subtitle / Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={homeData.testimonials_subtitle || ''}
                    onChange={e => setHomeData({ ...homeData, testimonials_subtitle: e.target.value })}
                    placeholder="The comments below are sample placeholders and are not presented as verified testimonials."
                  />
                </div>
              </div>

              {/* Add New Testimonial Form */}
              {showAddTestimonial && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 18, marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 12px', color: '#0369a1' }}>Add New Testimonial Card</h4>
                  <div className="admin-form-group">
                    <label>Quote / Feedback Message *</label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={newTestimonial.quote}
                      onChange={e => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                      placeholder="e.g. The project-based learning environment helped me become more confident..."
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="admin-form-group">
                      <label>Author Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newTestimonial.name}
                        onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        placeholder="e.g. Sample Student / Rahul Sharma"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Designation / Role</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={newTestimonial.role}
                        onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                        placeholder="e.g. Student testimonial placeholder / Alumni testimonial placeholder"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowAddTestimonial(false)}>Cancel</button>
                    <button type="button" className="admin-btn admin-btn-primary" onClick={handleAddTestimonial}>Save Testimonial Card</button>
                  </div>
                </div>
              )}

              {/* List of Testimonials */}
              <div style={{ display: 'grid', gap: 16 }}>
                {(!homeData.testimonials_list || homeData.testimonials_list.length === 0) ? (
                  <p style={{ color: '#64748b', fontStyle: 'italic' }}>No testimonials added yet. Click "+ Add Testimonial" above.</p>
                ) : (
                  homeData.testimonials_list.map((t, i) => (
                    <div key={t.id || i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 18, background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0a4c8a' }}>Card #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(i)}
                          className="admin-btn admin-btn-danger"
                          style={{ fontSize: 12, padding: '4px 10px' }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="admin-form-group" style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 12 }}>Quote Text</label>
                        <textarea
                          rows="2"
                          className="admin-textarea"
                          value={t.quote || ''}
                          onChange={e => handleUpdateTestimonial(i, 'quote', e.target.value)}
                          placeholder="Quote message..."
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div className="admin-form-group">
                          <label style={{ fontSize: 12 }}>Author Name</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={t.name || ''}
                            onChange={e => handleUpdateTestimonial(i, 'name', e.target.value)}
                            placeholder="Student Name"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label style={{ fontSize: 12 }}>Role / Designation</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={t.role || ''}
                            onChange={e => handleUpdateTestimonial(i, 'role', e.target.value)}
                            placeholder="Designation"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 7: SECTION HEADINGS */}
        {/* ==================================================== */}
        {activeTab === 'headers' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>7. Customizable Section Headings</h3>
              <span style={{ fontSize: 12, color: '#5c6672' }}>Change the sub-headings and main titles for all sections across the homepage</span>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {/* Facilities */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>Facilities Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.facilities_sub || ''} onChange={e => setHomeData({ ...homeData, facilities_sub: e.target.value })} placeholder="Campus" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.facilities_title || ''} onChange={e => setHomeData({ ...homeData, facilities_title: e.target.value })} placeholder="Facilities" />
                </div>

                {/* Notices */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>Notice Board Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.notices_sub || ''} onChange={e => setHomeData({ ...homeData, notices_sub: e.target.value })} placeholder="Notice Board" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.notices_title || ''} onChange={e => setHomeData({ ...homeData, notices_title: e.target.value })} placeholder="Latest Notices" />
                </div>

                {/* Events */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>Events Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.events_sub || ''} onChange={e => setHomeData({ ...homeData, events_sub: e.target.value })} placeholder="Calendar" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.events_title || ''} onChange={e => setHomeData({ ...homeData, events_title: e.target.value })} placeholder="Upcoming Events" />
                </div>

                {/* News */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>News Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.news_sub || ''} onChange={e => setHomeData({ ...homeData, news_sub: e.target.value })} placeholder="Media" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.news_title || ''} onChange={e => setHomeData({ ...homeData, news_title: e.target.value })} placeholder="College News" />
                </div>

                {/* Achievements */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>Achievements Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.achievements_sub || ''} onChange={e => setHomeData({ ...homeData, achievements_sub: e.target.value })} placeholder="Proud Moments" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.achievements_title || ''} onChange={e => setHomeData({ ...homeData, achievements_title: e.target.value })} placeholder="Student Achievements" />
                </div>

                {/* Gallery */}
                <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 6, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0b63e5' }}>Gallery Section</h4>
                  <label>Sub-heading</label>
                  <input type="text" className="admin-input" value={homeData.gallery_sub || ''} onChange={e => setHomeData({ ...homeData, gallery_sub: e.target.value })} placeholder="Campus Life" />
                  <label style={{ marginTop: 8 }}>Main Title</label>
                  <input type="text" className="admin-input" value={homeData.gallery_title || ''} onChange={e => setHomeData({ ...homeData, gallery_title: e.target.value })} placeholder="Photo Gallery" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, marginBottom: 40 }}>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ minWidth: 200, padding: '12px 24px', fontSize: 15, justifyContent: 'center' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
