import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../data/collegeData.js'
import defaultHeroBuildingImg from '../assets/hero_building.png'

function renderHeroTitle(title) {
  if (!title) return ''
  if (typeof title !== 'string') return title

  // If title explicitly has newline
  if (title.includes('\n')) {
    return title.split('\n').map((line, idx, arr) => (
      <React.Fragment key={idx}>
        {line}
        {idx < arr.length - 1 && <br className="hero-heading-br" />}
      </React.Fragment>
    ))
  }

  // Pre-split known default headlines into two balanced lines
  if (title.includes('World-Class Hands-on Training & Rehabilitation')) {
    return (
      <>
        World–Class Hands–on
        <br className="hero-heading-br" />
        Training &amp; Rehabilitation
      </>
    )
  }
  if (title.includes('Building Healthier Lives Through Physiotherapy')) {
    return (
      <>
        Building Healthier Lives
        <br className="hero-heading-br" />
        Through Physiotherapy
      </>
    )
  }
  if (title.includes('Empowering Next-Gen Healthcare Leaders')) {
    return (
      <>
        Empowering Next–Gen
        <br className="hero-heading-br" />
        Healthcare Leaders
      </>
    )
  }

  return title
}

export default function Hero({ data }) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // Resolve slides from admin or defaults
  let rawSlides = (data?.hero_slides && Array.isArray(data.hero_slides) && data.hero_slides.length > 0)
    ? data.hero_slides
    : HERO_SLIDES

  const slides = rawSlides.map((slide, idx) => {
    // If fallback HERO_SLIDES is used, allow legacy single fields on slide 0
    if (idx === 0 && data && (!data.hero_slides || data.hero_slides.length === 0)) {
      return {
        ...slide,
        tag: data.hero_tag || slide.tag,
        title: data.hero_title || slide.title,
        description: data.hero_sub || data.hero_tagline || slide.description,
        image: data.hero_image_url || slide.image || defaultHeroBuildingImg,
        primaryBtn: {
          text: data.hero_btn1_text || slide.primaryBtn?.text || 'Explore Our Programs →',
          link: data.hero_btn1_link || slide.primaryBtn?.link || '/academics'
        },
        secondaryBtn: {
          text: data.hero_btn2_text || slide.secondaryBtn?.text || 'About Our College',
          link: data.hero_btn2_link || slide.secondaryBtn?.link || '/about'
        }
      }
    }
    return {
      ...slide,
      image: slide.image || defaultHeroBuildingImg,
      primaryBtn: slide.primaryBtn || { text: 'Explore Our Programs →', link: '/academics' },
      secondaryBtn: slide.secondaryBtn || { text: 'About Our College', link: '/about' }
    }
  })

  // Ensure currentIdx is within bounds
  const safeIdx = currentIdx < slides.length ? currentIdx : 0
  const current = slides[safeIdx] || slides[0]

  // Auto-rotation every X seconds (configurable, default 7s)
  useEffect(() => {
    if (slides.length <= 1) return
    const intervalSeconds = Number(data?.hero_slide_duration) || 7
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length)
    }, intervalSeconds * 1000)
    return () => clearInterval(timer)
  }, [slides.length, data?.hero_slide_duration])

  return (
    <section className="modern-hero-section">
      <div className="hero-split-grid">
        {/* Left Column: Hero Text Content with smooth keyframe animation */}
        <div className="hero-text-pane">
          <div key={safeIdx} className="hero-text-animated-wrap">
            <div className="hero-tag-badge">
              {current.tag || 'HEAL | LEARN | SERVE | GROW'}
            </div>

            <h1 className="hero-main-heading">
              {renderHeroTitle(current.title)}
            </h1>

            <p className="hero-lead-description">
              {current.description}
            </p>

            <div className="hero-actions-group">
              <Link
                to={current.primaryBtn?.link || '/academics'}
                className="hero-btn-primary"
              >
                {current.primaryBtn?.text || 'Explore Our Programs →'}
              </Link>
            </div>

            {/* Slide Navigation Dots for smooth slide switching */}
            {slides.length > 1 && (
              <div className="hero-slide-nav-dots" role="tablist" aria-label="Hero slide navigation">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    role="tab"
                    aria-selected={dotIdx === safeIdx}
                    className={`hero-nav-dot ${dotIdx === safeIdx ? 'is-active' : ''}`}
                    onClick={() => setCurrentIdx(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase with smooth cross-fade layer */}
        <div className="hero-visual-pane">
          <div className="hero-image-wrapper">
            {slides.map((slide, idx) => (
              <img
                key={slide.image ? `${slide.image}-${idx}` : idx}
                src={slide.image}
                alt={slide.title || 'Karmayogi College of Physiotherapy'}
                className={`hero-building-image ${idx === safeIdx ? 'is-active' : ''}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
