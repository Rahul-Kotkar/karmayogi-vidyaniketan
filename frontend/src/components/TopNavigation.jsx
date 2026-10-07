import React from 'react'
import { NavLink } from 'react-router-dom'
import { TOP_NAV } from '../data/collegeData.js'

// Row 1 — simple links only, NO dropdowns.
export default function TopNavigation() {
  return (
    <nav className="top-nav" aria-label="Primary">
      <ul>
        {TOP_NAV.map(item => (
          <li key={item.path}>
            <NavLink to={item.path} end={item.path === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
