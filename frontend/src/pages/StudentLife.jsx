import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { pagesService } from '../services/endpoints.js';
import { DEFAULT_STUDENT_CORNER_DATA } from '../data/studentCornerData.js';
import { 
  UsersIcon as Users, 
  SparklesIcon as Sparkles, 
  TrophyIcon as Trophy, 
  PaletteIcon as Palette, 
  MusicIcon as Music, 
  BookOpenIcon as BookOpen, 
  CompassIcon as Compass, 
  CheckCircleIcon as CheckCircle2, 
  ArrowRightIcon as ArrowRight, 
  ShieldIcon as ShieldCheck,
  CalendarIcon,
  StarIcon,
  MapPinIcon
} from '../components/Icons.jsx';

const CLUB_ICONS = {
  Sparkles,
  BookOpen,
  Music,
  Palette,
  Compass,
  Users
};

export default function StudentLife() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('cultural');
  const [data, setData] = useState(DEFAULT_STUDENT_CORNER_DATA);

  // Load dynamic data saved by the Admin Panel
  useEffect(() => {
    pagesService.getBySlug('student-corner').then(page => {
      if (page?.content_html) {
        try {
          const parsed = JSON.parse(page.content_html);
          setData(prev => ({
            ...prev,
            ...parsed,
            cultural: Array.isArray(parsed.cultural) && parsed.cultural.length > 0 ? parsed.cultural : prev.cultural,
            clubs: Array.isArray(parsed.clubs) && parsed.clubs.length > 0 ? parsed.clubs : prev.clubs,
            fieldTrips: Array.isArray(parsed.fieldTrips) && parsed.fieldTrips.length > 0 ? parsed.fieldTrips : prev.fieldTrips,
            competitions: Array.isArray(parsed.competitions) && parsed.competitions.length > 0 ? parsed.competitions : prev.competitions,
            achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : prev.achievements,
            houses: Array.isArray(parsed.houses) && parsed.houses.length > 0 ? parsed.houses : prev.houses,
            council: Array.isArray(parsed.council) && parsed.council.length > 0 ? parsed.council : prev.council
          }));
        } catch {}
      }
    }).catch(() => {});
  }, []);

  // Handle direct navigation via URL hash (#cultural, #clubs, #field-trips, #competitions, #achievements, #houses, #council, #sports)
  useEffect(() => {
    if (location.hash) {
      const hashKey = location.hash.replace('#', '');
      const validTabs = ['cultural', 'clubs', 'field-trips', 'competitions', 'achievements', 'houses', 'council', 'sports'];
      if (validTabs.includes(hashKey)) {
        setActiveTab(hashKey);
        setTimeout(() => {
          const el = document.getElementById(hashKey);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      }
    }
  }, [location.hash]);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    window.history.replaceState(null, '', `#${tabKey}`);
    const el = document.getElementById(tabKey);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageShell
      badge="Student Experience & Campus Life"
      title="Student Life, Activities & Achievements"
      subtitle={data.overview?.lead || "At Karmayogi Vidyaniketan, education extends far beyond textbooks into athletics, stage arts, hobby clubs, adventurous field trips, and competitive triumphs."}
    >

      {/* Sticky Tab Navigator */}
      <section className="py-4 bg-white border-b border-gray-200 sticky top-16 z-20 backdrop-blur-md bg-white/95 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {[
              { key: 'cultural', label: 'Cultural Activities', icon: '🎭' },
              { key: 'clubs', label: 'Clubs & Activities', icon: '🔬' },
              { key: 'field-trips', label: 'Field Trips & Excursions', icon: '🚌' },
              { key: 'competitions', label: 'Competitions & Olympiads', icon: '🏆' },
              { key: 'achievements', label: 'Student Achievements', icon: '🌟' },
              { key: 'houses', label: 'House System', icon: '🛡️' },
              { key: 'council', label: 'Student Council', icon: '👑' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabClick(tab.key)}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            <Link
              to="/sports"
              className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-xs"
            >
              <span>⚽</span>
              <span>Sports & Athletics →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 1. Cultural Activities Section */}
      <section id="cultural" className="py-16 bg-gradient-to-b from-blue-50/40 to-white scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 tracking-wide uppercase mb-3">
              Expressive Stage & Arts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Cultural Activities & Karmotsav
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Every child possesses innate artistic and expressive spark. Through our signature annual gathering <strong>Karmotsav</strong>, festive dindis, musical choirs, and drama productions, students build stage presence, team harmony, and cultural appreciation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {(data.cultural || []).map((evt, idx) => (
              <div key={evt.id || idx} className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {evt.badge}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{evt.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{evt.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{evt.desc}</p>
                </div>
                {evt.highlights && evt.highlights.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
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

          <div className="bg-purple-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h4 className="text-xl font-bold mb-2">Explore the Visual Glimpses of Past Performances</h4>
              <p className="text-purple-200 text-sm">View hundreds of vibrant stage, drama, and festival photographs in our school gallery.</p>
            </div>
            <Link
              to="/gallery"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold rounded-xl transition-all text-sm shrink-0 inline-flex items-center gap-2"
            >
              Open Photo Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Clubs & Activities Section */}
      <section id="clubs" className="py-16 bg-gray-50/70 scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 tracking-wide uppercase mb-3">
              Hands-On Curiosity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Hobby Clubs & Enrichment Societies
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Every Wednesday and Saturday afternoon, regular lectures give way to creative club hours where students tinker with robotics, debate contemporary issues, sketch canvases, or organize nature conservation campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(data.clubs || []).map((club, idx) => {
              const IconComponent = typeof club.icon === 'function' ? club.icon : (CLUB_ICONS[club.icon] || Sparkles);
              return (
                <div key={club.id || idx} className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-5 border border-blue-100">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{club.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{club.description}</p>
                  {club.activities && club.activities.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Core Pursuits:</div>
                      <ul className="space-y-1.5 text-xs text-gray-700">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Field Trips & Excursions Section */}
      <section id="field-trips" className="py-16 bg-white scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
              Beyond Classroom Walls
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Field Trips & Educational Excursions
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Nothing deepens understanding like real-world observation. Our structured educational excursions connect classroom concepts with Maharashtra’s rich heritage, cutting-edge science centers, industrial hubs, and biological reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {(data.fieldTrips || []).map((trip, idx) => (
              <div key={trip.id || idx} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {trip.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <MapPinIcon size={12} color="#64748b" /> {trip.destination}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{trip.desc}</p>
                </div>
                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 bg-white -mx-7 -mb-7 p-7 rounded-b-2xl border-t">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Experience Points:</div>
                    <div className="flex flex-wrap gap-2">
                      {trip.highlights.map((h, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                🛡️
              </div>
              <div>
                <h4 className="text-lg font-bold">Strict Safety & Escort Standards</h4>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">Every outdoor tour includes certified teacher-to-student ratios (1:12), verified fleet transport, onboard first-aid kits, and real-time parent SMS alerts.</p>
              </div>
            </div>
            <Link
              to="/transport"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 shrink-0"
            >
              View Bus Fleet Safety
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Competitions & Olympiads Section */}
      <section id="competitions" className="py-16 bg-gray-50/70 scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 tracking-wide uppercase mb-3">
              National & Regional Benchmarks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Competitions & Olympiad Mentorship
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              We empower learners to test their mettle beyond the standard syllabus. Dedicated mentoring sessions groom students for national Science & Math Olympiads, State Talent Search exams, and prestigious drawing certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {(data.competitions || []).map((comp, idx) => (
              <div key={comp.id || idx} className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {comp.badge}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{comp.org}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{comp.name}</h3>
                  <div className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                    Subjects: {comp.subjects}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{comp.desc}</p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span>Special weekend mentoring batches</span>
                  <span>Previous Year Papers & Mock Drills</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Student Achievements Section */}
      <section id="achievements" className="py-16 bg-white scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
              Hall of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Student Achievements & Laurels
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              The true testament of a school is the heights reached by its scholars. From flawless 10th board results to state-level sports podiums and Olympiad medals, our students make Pandharpur proud every year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {(data.achievements || []).map((item, idx) => (
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

          <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-amber-950 mb-1">Recognizing Every Talent, Big & Small</h4>
              <p className="text-amber-900 text-sm">Quarterly Felicitation Assemblies reward outstanding academic improvers, 100% attendance holders, and young creators alongside top rankers.</p>
            </div>
            <Link
              to="/notices"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shrink-0 transition-all"
            >
              Read Latest Honours & Circulars
            </Link>
          </div>
        </div>
      </section>

      {/* 6. School House System Section */}
      <section id="houses" className="py-16 bg-gray-50/70 scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
              Four Pillars of Camaraderie
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              The School House System
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Upon admission, every student is allocated to one of four historic houses. Guided by House Masters, House Captains, and student prefects, this system builds lifelong bonding and team spirit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data.houses || []).map((house, idx) => (
              <div key={house.id || idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className={`h-4 bg-gradient-to-r ${house.color || 'from-blue-600 to-indigo-800'}`} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                      {house.name}
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${house.accent || 'bg-blue-100 text-blue-900 border-blue-300'}`}>
                      House Badge
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-3 italic">
                    Motto: "{house.motto}"
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {house.description}
                  </p>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Annual Championship Contender</span>
                    <span className="font-semibold text-blue-900">Lead by House Captains</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Student Council & Leadership Section */}
      <section id="council" className="py-16 bg-white scroll-mt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 tracking-wide uppercase mb-3">
              Student Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
              Student Council & Investiture
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              True leadership is learned by shouldering real responsibility. Every academic year begins with a democratic election and formal investiture ceremony for student leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(data.council || []).map((item, idx) => (
              <div key={item.id || idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-5 font-bold text-lg">
                  {idx === 0 ? <ShieldCheck className="w-7 h-7" /> : idx === 1 ? <Trophy className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.role}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Sports & Physical Education Preview Banner */}
      <section id="sports" className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                Physical Rigour & Sportsmanship
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ fontFamily: 'Merriweather, serif' }}>
                Sports & Athletics Infrastructure
              </h2>
              <p className="text-blue-100 text-base leading-relaxed mb-6">
                From 400m running tracks and cricket practice nets to regulation mud arenas for Kabaddi and Kho-Kho, sports is integral to the Karmayogi Vidyaniketan experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/sports"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all text-sm inline-flex items-center gap-2"
                >
                  Explore All Sports Arenas <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/admissions#apply"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm"
                >
                  Enquire for Admission
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-xs text-center">
                <div className="text-3xl font-extrabold text-amber-400 mb-1">400m</div>
                <div className="text-xs text-slate-300 font-semibold">Athletic Running Track</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-xs text-center">
                <div className="text-3xl font-extrabold text-amber-400 mb-1">4+</div>
                <div className="text-xs text-slate-300 font-semibold">Cricket Practice Nets</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-xs text-center">
                <div className="text-3xl font-extrabold text-amber-400 mb-1">Full</div>
                <div className="text-xs text-slate-300 font-semibold">Football & Kho-Kho Arena</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15 backdrop-blur-xs text-center">
                <div className="text-3xl font-extrabold text-amber-400 mb-1">Daily</div>
                <div className="text-xs text-slate-300 font-semibold">Morning Yoga & PT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageShell>
  );
}
