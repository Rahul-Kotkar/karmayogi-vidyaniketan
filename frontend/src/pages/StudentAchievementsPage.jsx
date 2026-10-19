import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { pagesService } from '../services/endpoints.js'
import { DEFAULT_STUDENT_ACHIEVEMENTS } from '../data/studentCornerData.js'
import { 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight,
  TrophyIcon as Trophy,
  StarIcon
} from '../components/Icons.jsx'

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState(DEFAULT_STUDENT_ACHIEVEMENTS)

  useEffect(() => {
    pagesService.getBySlug('student-corner').then(res => {
      if (res?.content_html) {
        try {
          const parsed = JSON.parse(res.content_html)
          if (Array.isArray(parsed.achievements) && parsed.achievements.length > 0) {
            setAchievements(parsed.achievements)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <PageShell 
      title="Student Achievements & Laurels" 
      subtitle="Celebrating Academic Honors, Olympiad Medals & District Athletic Championships • Karmayogi Vidyaniketan"
    >
      <div className="space-y-12">
        {/* Secondary Sub-navigation Bar */}
        <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border border-slate-200">
          <Link to="/sports" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">⚽ Sports & Athletics</Link>
          <Link to="/cultural-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🎭 Cultural Activities</Link>
          <Link to="/clubs-activities" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🔬 Clubs & Activities</Link>
          <Link to="/field-trips" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🚌 Field Trips</Link>
          <Link to="/competitions-olympiads" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-900 transition-all whitespace-nowrap">🏆 Competitions & Olympiads</Link>
          <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-900 text-white shadow-xs whitespace-nowrap">🌟 Student Achievements</span>
        </div>

        {/* Hero Feature Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
                Hall of Excellence
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Every Year, Our Students Make Pandharpur Proud
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                The greatest testament to an institution’s dedication is the caliber of its students. From consistent <strong>100% Class 10 Board exam pass records</strong> to gold medals in international science Olympiads and district sports trophies, our scholars embody discipline, intellect, and grit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/notices" className="btn btn-primary inline-flex items-center gap-2">
                  <span>View Recent Merit Circulars</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/admissions" className="btn btn-secondary inline-flex items-center gap-2">
                  <span>Admission Guidance</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-blue-950">
              <img 
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80" 
                alt="Student championship ceremony" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Merit & Laurels</div>
                  <div className="text-xl font-bold">Annual Academic & Sports Trophies</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Key Metric Cards */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              By The Numbers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Milestones of Institutional Pride
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item, idx) => (
              <div key={item.id || idx} className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-7 text-center shadow-md flex flex-col justify-between">
                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                    {item.stat}
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>
                </div>
                <p className="text-xs text-blue-100/90 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Categories of Student Accomplishments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xl mb-4">
                📚
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Class 10 Board Excellence</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Unbroken string of 100% board results with more than 68% candidates securing first-class with distinction. Subject centum (100/100) recorded in Math, Science & Sanskrit.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Special merit scholar felicitations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Parent honor evening at Karmotsav</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xl mb-4">
                🥇
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">SOF Olympiad Medallists</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Over 45 gold, silver, and bronze medals earned every academic year in National Science Olympiad (NSO), International Math Olympiad (IMO), and Cyber Olympiad (NCO).
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Zonal and State top 100 rank holders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Cash rewards & foundation merit certificates</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-xl mb-4">
                🏆
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Solapur DSO Sports Trophies</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dominant victories across Solapur District Sports Office (DSO) championships in Kabaddi, Kho-Kho, 100m/200m track sprints, and regional Chess tournaments.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>District division champions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>State tournament qualification track record</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Felicitation Culture Card */}
        <div className="bg-amber-50 rounded-3xl p-8 sm:p-10 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-950 mb-2">Quarterly Felicitation & Merit Assemblies</h3>
            <p className="text-amber-900 text-sm max-w-2xl leading-relaxed">
              We ensure talent does not go unnoticed. Alongside top rank holders, students who demonstrate outstanding personal improvement, artistic passion, or 100% attendance receive commemorative trophies in front of their cheering peers.
            </p>
          </div>
          <Link to="/notices" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2 shadow-sm">
            <span>Read Latest School Circulars</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
