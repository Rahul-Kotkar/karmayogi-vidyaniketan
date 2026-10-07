import React from 'react'
import pandharpurLogoImg from '../assets/pandharpur_logo.jpg'
import trustLogoImg from '../assets/trust_logo.png'
import founderImg from '../assets/founder.png'

const LOGO_STYLE = {
  width: 'auto',
  maxWidth: '135px',
  objectFit: 'contain',
  display: 'block'
}

export function FoundationLogo({ src }) {
  return (
    <img
      src={src || pandharpurLogoImg || trustLogoImg}
      alt="Shri Pandurang Pratishthan - Karmayogi Emblem"
      style={LOGO_STYLE}
      className="college-crest-img"
    />
  )
}

export function CollegeLogo({ src, className = "college-crest-img", style = {} }) {
  return (
    <img
      src={src || pandharpurLogoImg || trustLogoImg}
      alt="Karmayogi College of Physiotherapy Emblem"
      style={{ ...LOGO_STYLE, ...style }}
      className={className}
    />
  )
}

export function FounderPortrait({ src }) {
  return (
    <div className="header-founder-portrait">
      <img
        src={src || founderImg}
        alt="Late Shri Pandurang Pratishthan Patron / Founder"
        className="founder-portrait-img"
      />
    </div>
  )
}

