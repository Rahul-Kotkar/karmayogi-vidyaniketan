import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_COMPETITIONS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight,
  TrophyIcon as Trophy
} from '../components/Icons.jsx'

export default function CompetitionsOlympiads() {
  const [competitions, setCompetitions] = useState(DEFAULT_COMPETITIONS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.competitions) && parsed.competitions.length > 0) {
            setCompetitions(parsed.competitions)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Competitions & Olympiad Mentorship" 
      subtitle="Fostering Academic Rigor, Analytical Thinking & National Honors • Karmayogi Vidyaniketan"
    >
      <div className="space-y-12">
        {/* Secondary Sub-navigation Bar */}
        <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-slate-200">
          <Link to="/sports" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">⚽ Sports & Athletics</Link>
          <Link to="/cultural-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🎭 Cultural Activities</Link>
          <Link to="/clubs-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🔬 Clubs & Activities</Link>
          <Link to="/field-trips" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🚌 Field Trips</Link>
          <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-900 text-white shadow-xs whitespace-nowrap">🏆 Competitions & Olympiads</span>
          <Link to="/student-achievements" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🌟 Student Achievements</Link>
        </div>

        {/* Hero Feature Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 tracking-wide uppercase mb-3">
                Excellence & Talent Search
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Grooming Young Minds for National & Global Arenas
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                At <strong>Karmayogi Vidyaniketan</strong>, competitive exams are treated not as stressful filters, but as inspiring opportunities to test one's intellectual mettle. We run specialized preparatory modules for SOF Science & Mathematics Olympiads, State Talent Search (MTS), and Government Drawing Grade Certifications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/student-achievements" className="btn btn-primary inline-flex items-center gap-2">
                  <span>View Olympiad Medal Winners</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/academics/subjects" className="btn btn-secondary inline-flex items-center gap-2">
                  <span>Academic Curriculum Details</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-emerald-950">
              <img 
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80" 
                alt="Student participating in national quiz competition" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Competitive Mentorship</div>
                  <div className="text-xl font-bold">Olympiads, Quizzes & Talent Searches</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Mentoring Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Weekend Preparatory Batches</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Senior faculty conduct Saturday advanced problem-solving sessions breaking down higher-order thinking (HOTS) math and logical reasoning puzzles.
            </p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Simulated OMR Mock Tests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Timed mock examinations using standard optical mark reader (OMR) answer sheets eliminate exam-day anxiety and train students in speed strategy.
            </p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Personal Doubt Remediation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Small-group faculty clinics analyze wrong answers, clarify scientific principles, and celebrate gradual score jumps.
            </p>
          </div>
        </div>

        {/* Dynamic Competitions List */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Exam Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Recognized Olympiads & Talent Frameworks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((comp, idx) => (
              <div key={comp.id || idx} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {comp.badge || 'National Level'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{comp.org}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{comp.name}</h3>
                  <div className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-3 border border-blue-100">
                    Syllabus / Domains: {comp.subjects}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{comp.desc}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span>Special weekend mentoring batches</span>
                  <span>Previous 10-Yr Papers Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">Check Out the Hall of Laurels</h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Discover the students who brought gold medals, state rank certificates, and government drawing grade distinctions back to Karmayogi Vidyaniketan.
            </p>
          </div>
          <Link to="/student-achievements" className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2 shadow-md">
            <span>Read Student Laurels & Stats</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
