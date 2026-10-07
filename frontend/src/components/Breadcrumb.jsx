import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="page-breadcrumb-bar">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            return (
              <React.Fragment key={idx}>
                <span className="crumb-sep" aria-hidden="true">/</span>
                {isLast || !item.path ? (
                  <span className="crumb-current" aria-current="page">{item.label}</span>
                ) : (
                  <Link to={item.path}>{item.label}</Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
