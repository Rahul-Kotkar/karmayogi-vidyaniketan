import React from 'react'
import pandharpurLogoImg from '../assets/pandharpur_logo.jpg'
import trustLogoImg from '../assets/trust_logo.png'
import founderImg from '../assets/founder.png'
import { resolveMediaUrl } from '../utils/mediaUrl.js'

const LOGO_STYLE = {
  width: 'auto',
  maxWidth: '135px',
  objectFit: 'contain',
  display: 'block'
}

export function FoundationLogo({ src }) {
  const resolved = src ? resolveMediaUrl(src, pandharpurLogoImg || trustLogoImg) : (pandharpurLogoImg || trustLogoImg)
  return (
    <img
      src={resolved}
      alt="Shri Pandurang Pratishthan - Karmayogi Emblem"
      style={LOGO_STYLE}
      className="college-crest-img"
    />
  )
}

export function CollegeLogo({ src, className = "college-crest-img", style = {} }) {
  const resolved = src ? resolveMediaUrl(src, pandharpurLogoImg || trustLogoImg) : (pandharpurLogoImg || trustLogoImg)
  return (
    <img
      src={resolved}
      alt="Karmayogi Vidyaniketan / Karmayogi Public School Emblem"
      style={{ ...LOGO_STYLE, ...style }}
      className={className}
    />
  )
}

export const SchoolLogo = CollegeLogo

export function FounderPortrait({ src }) {
  const resolved = src ? resolveMediaUrl(src, founderImg) : founderImg
  return (
    <div className="header-founder-portrait">
      <img
        src={resolved}
        alt="Late Shri Pandurang Pratishthan Patron / Founder"
        className="founder-portrait-img"
      />
    </div>
  )
}

