import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Navbar2Row from '../components/Navbar2Row.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout() {
  return (
    <div className="site-public-layout">
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />
      <Navbar2Row />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
