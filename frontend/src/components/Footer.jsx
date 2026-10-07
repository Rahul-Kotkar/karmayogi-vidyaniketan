import React from 'react'
import { Link } from 'react-router-dom'
import { COLLEGE } from '../data/collegeData.js'

export default function Footer() {
  return (
    <footer className="college-footer">
      <div className="footer-top">
        <div className="footer-about">
          <div className="footer-brand">COLLEGE OF PHYSIOTHERAPY</div>
          <p>
            {COLLEGE.foundation.replace("'s", '')}<br />
            {COLLEGE.address}<br />
            Affiliated to MUHS, Nashik · NAAC Grade 'A' (CGPA 3.02)
          </p>
          <div className="socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        <div className="footer-links-col footer-col-quick">
          <h4>Quick Links</h4>
          <ul className="footer-quick-links-grid">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/faculty">Faculty</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/notices">Notices</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-links-col footer-col-important">
          <h4>Important Links</h4>
          <ul>
            <li><a href="https://muhs.ac.in" target="_blank" rel="noreferrer">MUHS, Nashik</a></li>
            <li><a href="https://ugc.gov.in" target="_blank" rel="noreferrer">UGC</a></li>
            <li><a href="https://naac.gov.in" target="_blank" rel="noreferrer">NAAC</a></li>
            <li><a href="https://maharashtra.gov.in" target="_blank" rel="noreferrer">Govt. of Maharashtra</a></li>
            <li><a href="https://iap.org.in" target="_blank" rel="noreferrer">Indian Association of Physiotherapists</a></li>
          </ul>
        </div>
        <div className="footer-links-col footer-col-contact">
          <h4>Contact</h4>
          <ul>
            <li><b>Phone:</b> {COLLEGE.phone}</li>
            <li><b>Email:</b> <a href={'mailto:' + COLLEGE.email}>{COLLEGE.email}</a></li>
            <li><b>Website:</b> {COLLEGE.website}</li>
            <li style={{ marginTop: 8 }}>{COLLEGE.address}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-left">
            © 2026 Karmayogi College of Physiotherapy. All Rights Reserved. | Shri Pandurang Pratishthan, Shelve, Pandharpur
          </div>
          <div className="footer-bottom-right">
            Designed &amp; Developed by <span className="dev-credit-names" style={{ fontWeight: 700, color: '#ffffff' }}>Rahul &amp; Pratik</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
