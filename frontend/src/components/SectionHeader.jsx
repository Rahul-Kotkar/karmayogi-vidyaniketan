import React from 'react'

export default function SectionHeader({ title, sub }) {
  return (
    <div className="section-head">
      {sub && <div className="sub">{sub}</div>}
      <h2>{title}</h2>
    </div>
  )
}
