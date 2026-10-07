import React from 'react'
import { Link } from 'react-router-dom'
import { COLLEGE } from '../data/collegeData.js'

export default function Footer() {
  return (
    <footer className="college-footer">
      <div className="footer-top">
        <div className="footer-about">
          <div className="footer-brand">KARMAYOGI VIDYANIKETAN</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a227', marginBottom: '8px' }}>
            Karmayogi Public School
          </div>
          <p>
            {COLLEGE.foundation.replace("'s", '')}, Pandharpur<br />
            English Medium • Co-Educational • Nursery to Grade 10<br />
            CBSE &amp; State Board Tracks · Pandharpur, Solapur (MS)
          </p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
          </div>
        </div>

        <div className="footer-links-col footer-col-quick">
          <h4>Quick Links</h4>
          <ul className="footer-quick-links-grid">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/infrastructure">Campus</Link></li>
            <li><Link to="/facilities">Facilities</Link></li>
            <li><Link to="/labs">Science &amp; STEM Labs</Link></li>
            <li><Link to="/student-life">Student Life</Link></li>
            <li><Link to="/transport">Transportation</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-links-col footer-col-important">
          <h4>Campuses</h4>
          <ul>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: '#ffffff', display: 'block' }}>Primary / Foundation Campus</strong>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Isbavi, behind MSEDCL Division Office, Link Road, Pandharpur.
              </span>
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: '#ffffff', display: 'block' }}>Main High School Campus</strong>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Shelve, Pandharpur, Dist: Solapur, Maharashtra - 413304.
              </span>
            </li>
            <li>
              <Link to="/admission-process" style={{ color: '#38bdf8', fontWeight: 600 }}>Admission Process &rarr;</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-col footer-col-contact">
          <h4>Contact School Desk</h4>
          <ul>
            <li><b>Phones:</b> {COLLEGE.phone}</li>
            <li><b>Additional:</b> +91-9527632033, +91-8788642412</li>
            <li><b>Email:</b> <a href={'mailto:' + COLLEGE.email}>{COLLEGE.email}</a></li>
            <li><b>Hours:</b> Mon – Sat: 8:00 AM – 2:00 PM</li>
            <li style={{ marginTop: 8 }}>Pandharpur, Solapur, Maharashtra</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-left">
            © 2026 Karmayogi Vidyaniketan. All Rights Reserved. | Shri Pandurang Pratishthan, Pandharpur
          </div>
          <div className="footer-bottom-right">
            Shri Pandurang Pratishthan, Pandharpur
          </div>
        </div>
      </div>
    </footer>
  )
}
