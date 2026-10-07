import React from 'react'
import { Link } from 'react-router-dom'

export default function DropdownMenu({ items }) {
  return (
    <ul className="dropdown">
      {items.map((c, i) => (
        <li key={i}><Link to={c.path}>{c.label}</Link></li>
      ))}
    </ul>
  )
}
