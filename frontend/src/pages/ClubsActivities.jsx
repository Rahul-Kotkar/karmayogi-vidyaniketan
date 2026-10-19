import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_CLUBS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight,
  SparklesIcon as Sparkles,
  BookOpenIcon as BookOpen,
  MusicIcon as Music,
  PaletteIcon as Palette,
  CompassIcon as Compass,
  UsersIcon as Users
} from '../components/Icons.jsx'

const CLUB_ICON_COMPONENTS = {
  Sparkles,
  BookOpen,
  Music,
  Palette,
  Compass,
  Users
}

export default function ClubsActivities() {
  const [clubs, setClubs] = useState(DEFAULT_STUDENT_CLUBS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.clubs) && parsed.clubs.length > 0) {
            setClubs(parsed.clubs)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Student Clubs & Co-Curricular Societies" 
      subtitle="Hands-On Innovation, Creativity & Passions Beyond Textbooks • Karmayogi Vidyaniketan"
    >
      <div className="space-y-12">
        {/* Secondary Sub-navigation Bar */}
        <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-slate-200">
          <Link to="/sports" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">⚽ Sports & Athletics</Link>
          <Link to="/cultural-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🎭 Cultural Activities</Link>
          <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-900 text-white shadow-xs whitespace-nowrap">🔬 Clubs & Activities</span>
          <Link to="/field-trips" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🚌 Field Trips</Link>
          <Link to="/competitions-olympiads" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🏆 Competitions & Olympiads</Link>
          <Link to="/student-achievements" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🌟 Student Achievements</Link>
        </div>

        {/* Hero Feature Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 tracking-wide uppercase mb-3">
                Co-Curricular Exploration
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Discovering Passions, Building Future Skills
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Every Wednesday and Saturday afternoon at <strong>Karmayogi Vidyaniketan</strong>, regular class schedules pause for club hours. Students are encouraged to choose specialized interest societies spanning robotics, debate, public speaking, gardening, and visual arts, fostering lifelong hobbies and career spark.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/labs" className="btn btn-primary inline-flex items-center gap-2">
                  <span>Explore Science & STEM Labs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn btn-secondary inline-flex items-center gap-2">
                  <span>Inquire About Club Programs</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-blue-900">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" 
                alt="Students building robotics project" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Hands-on Learning</div>
                  <div className="text-xl font-bold">STEM & Robotics Tinkering Hub</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Club Schedule & Operational Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-2">⏰</div>
            <h3 className="font-bold text-slate-900 mb-1">Dedicated Weekly Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every Wednesday (2:00 PM – 3:30 PM) and Saturday mornings are preserved exclusively for mentored club activities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-bold text-slate-900 mb-1">Faculty & Industry Mentors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained subject teachers alongside visiting robotics engineers and artists provide structured, hands-on guidance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-2xl mb-2">🏅</div>
            <h3 className="font-bold text-slate-900 mb-1">Exhibition & Certifications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students present working prototypes, art galleries, and wall magazines during the annual Karmotsav & Science Day.
            </p>
          </div>
        </div>

        {/* Grid of Dynamic Clubs */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Active Societies
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Explore Our Student Clubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, idx) => {
              const IconComp = typeof club.icon === 'function' ? club.icon : (CLUB_ICON_COMPONENTS[club.icon] || Sparkles)
              return (
                <div key={club.id || idx} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-5 border border-blue-100">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{club.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{club.description}</p>
                  </div>

                  {club.activities && club.activities.length > 0 && (
                    <div className="border-t border-slate-100 pt-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Pursuits:</div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {club.activities.map((act, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">Equipped Labs Supporting Club Innovations</h3>
            <p className="text-blue-200 text-sm max-w-xl">
              From our fully air-conditioned computer center to STEM electronics tables and art studios, students have unrestricted access to premium facilities.
            </p>
          </div>
          <Link to="/labs" className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2 shadow-md">
            <span>Visit Science & STEM Labs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
