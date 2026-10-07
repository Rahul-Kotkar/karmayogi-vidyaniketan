import React from 'react'
import { Link } from 'react-router-dom'
import { SECOND_NAV } from '../data/collegeData.js'
import DropdownMenu from './DropdownMenu.jsx'

// Row 2 — institutional menu WITH hover dropdowns.
export default function SecondaryNavigation() {
  return (
    <nav className="secondary-nav" aria-label="Departments and services">
      <ul>
        {SECOND_NAV.map((item, i) => (
          <li key={i} className={item.children ? 'has-drop' : ''}>
            <Link to={item.path} className="drop-toggle">{item.label}</Link>
            {item.children && <DropdownMenu items={item.children} />}
          </li>
        ))}
      </ul>
    </nav>
  )
}
