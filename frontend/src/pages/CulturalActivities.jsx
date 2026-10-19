import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_CULTURAL_EVENTS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight,
  SparklesIcon as Sparkles,
  CalendarIcon,
  UsersIcon
} from '../components/Icons.jsx'

export default function CulturalActivities() {
  const [culturalEvents, setCulturalEvents] = useState(DEFAULT_CULTURAL_EVENTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.cultural) && parsed.cultural.length > 0) {
            setCulturalEvents(parsed.cultural)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Cultural Activities & Karmotsav" 
      subtitle="Fostering Art, Expression, Music & Heritage • Karmayogi Vidyaniketan, Pandharpur"
    >
      <div className="space-y-12">
        {/* Secondary Sub-navigation Bar */}
        <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-slate-200">
          <Link to="/sports" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">⚽ Sports & Athletics</Link>
          <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-900 text-white shadow-xs whitespace-nowrap">🎭 Cultural Activities</span>
          <Link to="/clubs-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🔬 Clubs & Activities</Link>
          <Link to="/field-trips" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🚌 Field Trips</Link>
          <Link to="/competitions-olympiads" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🏆 Competitions & Olympiads</Link>
          <Link to="/student-achievements" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🌟 Student Achievements</Link>
        </div>

        {/* Hero Feature Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 tracking-wide uppercase mb-3">
                Signature Annual Gathering & Arts
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Where Every Child's Talent Finds a Grand Stage
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Cultural celebrations are the vibrant heartbeat of <strong>Karmayogi Vidyaniketan</strong>. From our flagship annual fiesta <em>'Karmotsav'</em> to devotional Ashadhi Ekadashi Dindi processions and classical musical recitals, we empower young learners to overcome stage inhibitions, express their heritage, and master theatrical teamwork.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/gallery" className="btn btn-primary inline-flex items-center gap-2">
                  <span>View Cultural Photo Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/events" className="btn btn-secondary inline-flex items-center gap-2">
                  <span>Upcoming Cultural Calendar</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-purple-900">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" 
                alt="Student Cultural Gathering" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Annual Gathering</div>
                  <div className="text-xl font-bold">Karmotsav Cultural Carnival</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars of Cultural Life */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl mb-4">
                🎭
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Stage Drama & Theatrics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Marathi historical plays, English one-act drama, street plays (Nukkad Natak) on social awareness, and moral storytelling that instill articulation and courage.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-purple-700">
              100% Student Inclusion • Professional Script Mentorship
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl mb-4">
                🎶
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Music & Vocal Ensembles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Trained vocal music gurus instruct students in classical ragas, Sanskrit shloka chanting, patriotic anthems, harmonium, and rhythmic tabla accompaniments.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-amber-700">
              Dedicated Music Studios • Morning Assembly Choirs
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4">
                🚩
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Heritage Rallies & Dindi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connecting modern education with Pandharpur's timeless Bhakti culture through the annual Ashadhi Ekadashi School Dindi, Lezim performances, and flag rallies.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-700">
              Traditional Attire • Community Values & Empathy
            </div>
          </div>
        </div>

        {/* Dynamic Cultural Programs List */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Featured Celebrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Signature Cultural Events & Showcases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalEvents.map((evt, idx) => (
              <div key={evt.id || idx} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {evt.badge || 'Annual Event'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{evt.tag || 'Performing Arts'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{evt.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{evt.desc}</p>
                </div>
                {evt.highlights && evt.highlights.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {evt.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Annual Cultural Gallery CTA */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">Relive the Memories of Past Karmotsav Events</h3>
            <p className="text-purple-200 text-sm max-w-xl">
              Browse through our high-resolution photo archives showcasing student stage dances, traditional lezim troops, drama recitals, and parent felicitations.
            </p>
          </div>
          <Link to="/gallery" className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2 shadow-md">
            <span>Explore Photo Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
