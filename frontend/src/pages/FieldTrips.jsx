import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_FIELD_TRIPS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight,
  MapPinIcon
} from '../components/Icons.jsx'

export default function FieldTrips() {
  const [fieldTrips, setFieldTrips] = useState(DEFAULT_FIELD_TRIPS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0) {
            setFieldTrips(parsed.fieldTrips)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Field Trips & Educational Excursions" 
      subtitle="Experiential Learning, Heritage Exploration & Industrial Exposure • Karmayogi Vidyaniketan"
    >
      <div className="space-y-12">
        {/* Secondary Sub-navigation Bar */}
        <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-slate-200">
          <Link to="/sports" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">⚽ Sports & Athletics</Link>
          <Link to="/cultural-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🎭 Cultural Activities</Link>
          <Link to="/clubs-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🔬 Clubs & Activities</Link>
          <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-900 text-white shadow-xs whitespace-nowrap">🚌 Field Trips</span>
          <Link to="/competitions-olympiads" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🏆 Competitions & Olympiads</Link>
          <Link to="/student-achievements" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🌟 Student Achievements</Link>
        </div>

        {/* Hero Feature Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
                Learning Beyond Classroom Walls
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Connecting Textbook Concepts with Real-World Wonder
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                At <strong>Karmayogi Vidyaniketan</strong>, we believe true curiosity awakens when students step into the real world. Carefully planned educational journeys to historical forts of Maharashtra, astronomical observatories, modern cooperative dairy plants, and agricultural science institutes enrich academic depth and build camaraderie.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/transport" className="btn btn-primary inline-flex items-center gap-2">
                  <span>Safe Fleet & Transport Info</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn btn-secondary inline-flex items-center gap-2">
                  <span>Annual Excursion Calendar</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-amber-950">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80" 
                alt="Students on outdoor heritage excursion" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Annual Excursions</div>
                  <div className="text-xl font-bold">Heritage, Science & Industrial Tours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Tour Safety & Care */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl mb-2">🚌</div>
            <h3 className="font-bold text-slate-900 mb-1">GPS-Tracked Yellow Buses</h3>
            <p className="text-xs text-slate-600">Speed governed school vehicles with real-time transit updates for school coordinators.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl mb-2">👩‍🏫</div>
            <h3 className="font-bold text-slate-900 mb-1">Female Caretakers & Faculty</h3>
            <p className="text-xs text-slate-600">Strict 1:12 teacher-student escort ratio with trained female attendants on every tour.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl mb-2">🩺</div>
            <h3 className="font-bold text-slate-900 mb-1">First-Aid & Medical Kits</h3>
            <p className="text-xs text-slate-600">Comprehensive travel medical kits, hydration stations, and on-call physician tie-ups.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold text-slate-900 mb-1">Observation Worksheets</h3>
            <p className="text-xs text-slate-600">Structured field questionnaires linking museum and industrial insights to school syllabus.</p>
          </div>
        </div>

        {/* Dynamic Field Trips Showcase */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Curated Itineraries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Educational Excursion Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fieldTrips.map((trip, idx) => (
              <div key={trip.id || idx} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {trip.category || 'Educational Visit'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-amber-600" />
                      {trip.destination}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{trip.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{trip.desc}</p>
                </div>
                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Learning Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {trip.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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

        {/* Transport Fleet CTA */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">Safe, Comfortable Student Transportation</h3>
            <p className="text-amber-100 text-sm max-w-xl">
              All field trips are conducted using our school's own fleet of serviced yellow school buses, operated by verified drivers and attended by faculty escorts.
            </p>
          </div>
          <Link to="/transport" className="px-6 py-3 bg-white hover:bg-slate-100 text-amber-900 font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2 shadow-md">
            <span>View School Bus Fleet & Routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
