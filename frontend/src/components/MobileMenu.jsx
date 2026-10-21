import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { TOP_NAV, SECOND_NAV } from '../data/collegeData.js'

// Mobile hamburger: both nav rows become an accordion menu.
export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState({})

  const toggleGroup = (label) => setExpanded(e => ({ ...e, [label]: !e[label] }))

  return (
    <div className="mobile-nav">
      <div className="mobile-bar">
        <span className="brand">Karmayogi Vidyaniketan</span>
        <button 
          className="hamburger" 
          aria-label="Toggle navigation menu"
          aria-expanded={open} 
          onClick={() => setOpen(o => !o)}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      <div className={'mobile-panel' + (open ? ' open' : '')}>
        {TOP_NAV.map(item => (
          <div className="m-group" key={'top-' + item.path}>
            <NavLink className="m-group-head" style={{ textDecoration: 'none' }} to={item.path}
              onClick={() => setOpen(false)} end={item.path === '/'}>
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
        {SECOND_NAV.map(group => {
          const hasChildren = Boolean(group.children && group.children.length > 0)
          if (!hasChildren) {
            return (
              <div className="m-group" key={'sec-' + group.label}>
                <NavLink
                  className="m-group-head"
                  style={{ textDecoration: 'none' }}
                  to={group.path}
                  onClick={() => setOpen(false)}
                >
                  <span>{group.label}</span>
                </NavLink>
              </div>
            )
          }
          return (
            <div className={'m-group' + (expanded[group.label] ? ' open' : '')} key={group.label}>
              <button
                className="m-group-head"
                aria-expanded={!!expanded[group.label]}
                onClick={() => toggleGroup(group.label)}
              >
                <span>{group.label}</span>
                <span className="caret">▶</span>
              </button>
              <ul className="m-links">
                {group.children.map((c, i) => (
                  <li key={i}><Link to={c.path} onClick={() => setOpen(false)}>{c.label}</Link></li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
