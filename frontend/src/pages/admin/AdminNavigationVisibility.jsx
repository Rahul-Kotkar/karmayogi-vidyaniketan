import React, { useState, useEffect, useMemo } from 'react'
import { ROW_1_NAV, ROW_2_NAV } from '../../data/collegeData.js'
import {
  getCachedNavVisibility,
  setCachedNavVisibility,
  pagesService
} from '../../services/endpoints.js'

export default function AdminNavigationVisibility() {
  const [hiddenMenus, setHiddenMenus] = useState([])
  const [hiddenSubmenus, setHiddenSubmenus] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [menuFilter, setMenuFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Combined menu list for both Row 1 and Row 2
  const allNavItems = useMemo(() => [
    ...ROW_1_NAV.map(m => ({ ...m, row: 1, rowBadge: 'First Menu (Main)' })),
    ...ROW_2_NAV.map(m => ({ ...m, row: 2, rowBadge: 'Second Menu (Strip)' }))
  ], [])

  // Load initial settings
  useEffect(() => {
    const cached = getCachedNavVisibility()
    if (cached && typeof cached === 'object') {
      setHiddenMenus(Array.isArray(cached.hiddenMenus) ? cached.hiddenMenus : [])
      setHiddenSubmenus(cached.hiddenSubmenus && typeof cached.hiddenSubmenus === 'object' ? cached.hiddenSubmenus : {})
    }

    pagesService.getBySlug('navigation_visibility')
      .then(res => {
        if (res?.content_html) {
          try {
            const parsed = JSON.parse(res.content_html)
            if (parsed && typeof parsed === 'object') {
              setHiddenMenus(Array.isArray(parsed.hiddenMenus) ? parsed.hiddenMenus : [])
              setHiddenSubmenus(parsed.hiddenSubmenus && typeof parsed.hiddenSubmenus === 'object' ? parsed.hiddenSubmenus : {})
              setCachedNavVisibility(parsed)
            }
          } catch (err) {
            console.error('Error parsing navigation visibility:', err)
          }
        }
      })
      .catch(err => {
        console.warn('Navigation visibility fetch fallback to cache:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Auto-dismiss alert after 4s
  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ text: '', type: '' }), 4000)
      return () => clearTimeout(timer)
    }
  }, [msg])

  // Helper checks
  const isMenuHidden = (menuLabel) => hiddenMenus.includes(menuLabel)

  const isSubmenuHidden = (menuLabel, subKey) => {
    const list = hiddenSubmenus[menuLabel]
    return Array.isArray(list) && list.includes(subKey)
  }

  // Toggle dropdown for a specific menu
  const toggleDropdown = (menuLabel) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }))
  }

  // Toggle whole menu
  const toggleMenu = (menuLabel) => {
    setHiddenMenus(prev => {
      if (prev.includes(menuLabel)) {
        return prev.filter(m => m !== menuLabel)
      } else {
        return [...prev, menuLabel]
      }
    })
  }

  // Toggle individual submenu
  const toggleSubmenu = (menuLabel, subKey) => {
    setHiddenSubmenus(prev => {
      const currentList = Array.isArray(prev[menuLabel]) ? prev[menuLabel] : []
      let updatedList
      if (currentList.includes(subKey)) {
        updatedList = currentList.filter(k => k !== subKey)
      } else {
        updatedList = [...currentList, subKey]
      }
      return {
        ...prev,
        [menuLabel]: updatedList
      }
    })
  }

  // Show all submenus for a menu
  const showAllSubmenusForMenu = (menuLabel) => {
    setHiddenSubmenus(prev => ({
      ...prev,
      [menuLabel]: []
    }))
  }

  // Hide all submenus for a menu
  const hideAllSubmenusForMenu = (menuLabel, subKeys) => {
    setHiddenSubmenus(prev => ({
      ...prev,
      [menuLabel]: [...subKeys]
    }))
  }

  // Reset everything to visible
  const handleResetAll = () => {
    if (window.confirm('Reset all first and second menu items and submenus to visible?')) {
      setHiddenMenus([])
      setHiddenSubmenus({})
      setMsg({ text: 'All navigation menus and submenus reset to visible. Click "Save Changes" to apply.', type: 'info' })
    }
  }

  // Save changes
  const handleSave = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      const payload = {
        hiddenMenus,
        hiddenSubmenus
      }
      await pagesService.save({
        slug: 'navigation_visibility',
        title: 'Navigation Menu Visibility Settings',
        content_html: JSON.stringify(payload)
      })
      setCachedNavVisibility(payload)
      setMsg({ text: 'First & Second Menu visibility updated successfully and synced with the website.', type: 'success' })
    } catch (err) {
      console.error('Failed to save navigation visibility:', err)
      const payload = { hiddenMenus, hiddenSubmenus }
      setCachedNavVisibility(payload)
      setMsg({ text: 'Visibility updated locally in browser cache.', type: 'success' })
    } finally {
      setSaving(false)
    }
  }

  // Filtered menu list
  const filteredNav = useMemo(() => {
    let list = allNavItems
    if (activeTab === 'row1') list = list.filter(m => m.row === 1)
    if (activeTab === 'row2') list = list.filter(m => m.row === 2)
    if (menuFilter !== 'all') list = list.filter(m => m.label === menuFilter)
    return list
  }, [allNavItems, activeTab, menuFilter])

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-badge">Navigation Architecture</span>
          <h1>First &amp; Second Menu Visibility</h1>
          <p style={{ color: '#5c6672', margin: '4px 0 0', fontSize: 13.5 }}>
            Configure which primary (first menu) and secondary (second menu) navigation items appear on the public website and mobile drawer.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleResetAll}
            disabled={saving}
          >
            Reset to Default
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ minWidth: 140, display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div className={`admin-alert alert-${msg.type}`} style={{ marginBottom: 18 }}>
          {msg.text}
        </div>
      )}

      {/* Main Single Card Content */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Website Navigation Menu Settings
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              First Menu: Top Header | Second Menu: Academic &amp; Explorer Strip.
            </span>
          </div>

          {/* Menu Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>Filter Menu:</label>
            <select
              className="admin-select"
              value={menuFilter}
              onChange={(e) => {
                setMenuFilter(e.target.value)
                if (e.target.value !== 'all') {
                  setOpenDropdowns(prev => ({ ...prev, [e.target.value]: true }))
                }
              }}
              style={{ width: 'auto', minWidth: 200, padding: '6px 12px', fontSize: 13 }}
            >
              <option value="all">All Menus ({allNavItems.length})</option>
              {allNavItems.map(m => (
                <option key={`${m.row}-${m.label}`} value={m.label}>
                  [{m.row === 1 ? 'First' : 'Second'}] {m.label} {m.children ? `(${m.children.length} submenus)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setActiveTab('all')}
            style={{ fontSize: 12 }}
          >
            All Menus ({allNavItems.length})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'row1' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setActiveTab('row1')}
            style={{ fontSize: 12 }}
          >
            First Menu / Header ({ROW_1_NAV.length})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${activeTab === 'row2' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setActiveTab('row2')}
            style={{ fontSize: 12 }}
          >
            Second Menu / Strip ({ROW_2_NAV.length})
          </button>
        </div>

        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              Loading navigation visibility settings...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Menu Bar</th>
                    <th style={{ width: '22%' }}>Menu Name</th>
                    <th style={{ width: '23%' }}>Website Link</th>
                    <th style={{ width: '12%' }}>Status</th>
                    <th style={{ width: '13%' }}>Action</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>Submenus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNav.map((item) => {
                    const menuHidden = isMenuHidden(item.label)
                    const children = item.children || []
                    const hasChildren = children.length > 0
                    const subKeys = children.map(c => c.path || c.slug || c.label)
                    const hiddenCount = children.filter(c => isSubmenuHidden(item.label, c.path || c.slug || c.label)).length
                    const isDropdownOpen = Boolean(openDropdowns[item.label])

                    return (
                      <React.Fragment key={`${item.row}-${item.label}`}>
                        <tr style={{ background: menuHidden ? '#fffbfb' : '#ffffff' }}>
                          <td>
                            <span
                              className="admin-badge"
                              style={{
                                fontSize: 11,
                                padding: '3px 8px',
                                background: item.row === 1 ? '#eff6ff' : '#f1f5f9',
                                color: item.row === 1 ? '#1d4ed8' : '#334155',
                                border: item.row === 1 ? '1px solid #bfdbfe' : '1px solid #cbd5e1'
                              }}
                            >
                              {item.rowBadge}
                            </span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ color: menuHidden ? '#94a3b8' : '#0f172a' }}>
                                {item.label}
                              </strong>
                              {hasChildren && hiddenCount > 0 && !menuHidden && (
                                <span style={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>
                                  ({hiddenCount} hidden)
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <code style={{ fontSize: 12, color: menuHidden ? '#94a3b8' : '#2563eb' }}>
                              {item.path}
                            </code>
                          </td>

                          <td>
                            <span className={`admin-badge ${menuHidden ? 'badge-danger' : 'badge-success'}`}>
                              {menuHidden ? 'Hidden on Site' : 'Visible on Site'}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className={`admin-btn admin-btn-sm ${menuHidden ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                              onClick={() => toggleMenu(item.label)}
                              style={{ fontSize: 12, minWidth: 90 }}
                            >
                              {menuHidden ? 'Show Menu' : 'Hide Menu'}
                            </button>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            {hasChildren ? (
                              <button
                                type="button"
                                className={`admin-btn admin-btn-sm ${isDropdownOpen ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                                onClick={() => toggleDropdown(item.label)}
                                style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                              >
                                <span>Submenus ({children.length})</span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </button>
                            ) : (
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                Standalone Link
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Collapsible Dropdown Panel for Submenus */}
                        {hasChildren && isDropdownOpen && (
                          <tr>
                            <td colSpan="6" style={{ background: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
                              <div style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8,
                                padding: '14px 16px'
                              }}>
                                {/* Dropdown Header Controls */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                  marginBottom: 12,
                                  paddingBottom: 8,
                                  borderBottom: '1px solid #f1f5f9'
                                }}>
                                  <div style={{ fontSize: 13, color: '#0f172a' }}>
                                    <strong>{item.label} Submenus:</strong>{' '}
                                    <span style={{ color: '#64748b' }}>
                                      {children.length - hiddenCount} of {children.length} visible on site
                                    </span>
                                    {menuHidden && (
                                      <span style={{ marginLeft: 8, color: '#b91c1c', fontSize: 12, fontWeight: 600 }}>
                                        (Note: Entire menu is currently hidden)
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                      type="button"
                                      className="admin-btn admin-btn-secondary admin-btn-sm"
                                      style={{ fontSize: 11.5, padding: '3px 8px' }}
                                      onClick={() => showAllSubmenusForMenu(item.label)}
                                    >
                                      Show All
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-btn admin-btn-secondary admin-btn-sm"
                                      style={{ fontSize: 11.5, padding: '3px 8px' }}
                                      onClick={() => hideAllSubmenusForMenu(item.label, subKeys)}
                                    >
                                      Hide All
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-btn admin-btn-secondary admin-btn-sm"
                                      style={{ fontSize: 11.5, padding: '3px 8px' }}
                                      onClick={() => toggleDropdown(item.label)}
                                    >
                                      Close ▲
                                    </button>
                                  </div>
                                </div>

                                {/* Compact Grid of Submenus */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                                  gap: 10
                                }}>
                                  {children.map(child => {
                                    const childKey = child.path || child.slug || child.label
                                    const isHidden = isSubmenuHidden(item.label, childKey)

                                    return (
                                      <label
                                        key={childKey}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: '8px 12px',
                                          borderRadius: 6,
                                          background: isHidden ? '#f8fafc' : '#ffffff',
                                          border: isHidden ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                                          cursor: 'pointer',
                                          userSelect: 'none',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                                          <input
                                            type="checkbox"
                                            checked={!isHidden}
                                            onChange={() => toggleSubmenu(item.label, childKey)}
                                            style={{ accentColor: '#2563eb', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
                                          />
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{
                                              fontSize: 13,
                                              fontWeight: 500,
                                              color: isHidden ? '#94a3b8' : '#0f172a',
                                              textDecoration: isHidden ? 'line-through' : 'none',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis'
                                            }}>
                                              {child.label}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                              {child.path}
                                            </div>
                                          </div>
                                        </div>

                                        <span className={`admin-badge ${isHidden ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0, marginLeft: 8 }}>
                                          {isHidden ? 'Hidden' : 'Visible'}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
