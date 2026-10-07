import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
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
  ShieldIcon as ShieldCheck
} from '../components/Icons.jsx';

const houses = [
  {
    name: 'Prithvi House',
    motto: 'Strength, Endurance & Humility',
    color: 'from-amber-600 to-amber-800',
    accent: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Named after Mother Earth, Prithvi house embodies rooted stability, perseverance, dependability, and reverence for environmental balance.'
  },
  {
    name: 'Agni House',
    motto: 'Courage, Energy & Zeal',
    color: 'from-red-600 to-orange-700',
    accent: 'bg-orange-100 text-orange-900 border-orange-300',
    description: 'Signifying the holy fire, Agni house inspires passion for knowledge, bold leadership, intense athletic drive, and moral courage.'
  },
  {
    name: 'Jal House',
    motto: 'Adaptability, Depth & Compassion',
    color: 'from-blue-600 to-cyan-700',
    accent: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'Reflecting life-giving water and the divine river Chandrabhaga, Jal house represents deep intellectual inquiry, flexibility, and kindness.'
  },
  {
    name: 'Vayu House',
    motto: 'Freedom, Vision & Inclusivity',
    color: 'from-emerald-600 to-teal-800',
    accent: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Representing the spirit of the wind, Vayu house stands for boundless imagination, swift agility, progressive thoughts, and global vision.'
  }
];

const clubs = [
  {
    title: 'STEM & Robotics Club',
    icon: Sparkles,
    description: 'Students tinker with DIY circuits, robotics kits, coding challenges, block programming, and models for regional science competitions.',
    activities: ['Arduino prototyping', 'Coding fundamentals', 'Science Olympiad prep']
  },
  {
    title: 'Literary & Debating Society',
    icon: BookOpen,
    description: 'Fosters eloquent public speaking, elocution, creative writing, book reviews, and parliamentary-style debating in English, Marathi, and Hindi.',
    activities: ['Annual school debate', 'Poetry recitation', 'School magazine editorship']
  },
  {
    title: 'Music, Drama & Performing Arts',
    icon: Music,
    description: 'Classical, semi-classical vocal training, harmonium, tabla, guitar, theatrical drama, and street plays highlighting social awareness.',
    activities: ['Classical music choir', 'Sanskrit shloka recitation', 'Annual drama production']
  },
  {
    title: 'Fine Arts & Craft Guild',
    icon: Palette,
    description: 'Nurtures visual creativity through water coloring, sketch art, origami, clay modelling, Rangoli, and exhibition displays.',
    activities: ['Campus art gallery showcase', 'Waste-to-wealth crafts', 'Poster design contests']
  },
  {
    title: 'Eco & Heritage Club',
    icon: Compass,
    description: 'Sensitizes students towards environmental protection, tree plantation, water conservation, composting, and Pandharpur heritage preservation.',
    activities: ['Green campus drives', 'River cleanliness rallies', 'Bird watching nature walks']
  },
  {
    title: 'Social Service & Red Cross Wing',
    icon: Users,
    description: 'Instills social empathy through community service, donation drives for rural schools, and disaster-relief assistance.',
    activities: ['Community outreach', 'First aid training', 'Health & hygiene drives']
  }
];

export default function StudentLife() {
  const [activeTab, setActiveTab] = useState('houses');

  return (
    <PageShell
      badge="Co-Curricular & Student Experience"
      title="Student Life, Houses & Clubs"
      subtitle="Education at Karmayogi Vidyaniketan is a joyful journey of discovery, creativity, leadership, and lifelong friendships."
    >

      {/* Intro Navigation Bar */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('houses')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'houses'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              School House System
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'clubs'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clubs & Societies
            </button>
            <button
              onClick={() => setActiveTab('council')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'council'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Student Council & Leadership
            </button>
          </div>
        </div>
      </section>

      {/* Houses Tab */}
      {activeTab === 'houses' && (
        <section className="py-20 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 tracking-wide uppercase mb-3">
                Four Pillars of Camaraderie
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                The School House System
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Upon admission, every student is allocated to one of four historic houses. Guided by House Masters, House Captains, and student prefects, this system builds lifelong bonding and team spirit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {houses.map((house, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className={`h-4 bg-gradient-to-r ${house.color}`} />
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                        {house.name}
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${house.accent}`}>
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
                      <span>Inter-House Trophy Contender</span>
                      <span className="font-semibold text-blue-900">Lead by House Captains</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clubs Tab */}
      {activeTab === 'clubs' && (
        <section className="py-20 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 tracking-wide uppercase mb-3">
                Discovering Passions
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                Hobby Clubs & Enrichment Societies
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Held every Wednesday and Saturday afternoon, our club hours allow students to pursue skills that ignite genuine interest and creative curiosity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club, idx) => {
                const IconComponent = club.icon;
                return (
                  <div key={idx} className="bg-white p-7 rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-5 border border-blue-100">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {club.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {club.description}
                    </p>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Activities:</div>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {club.activities.map((act, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Leadership Tab */}
      {activeTab === 'council' && (
        <section className="py-20 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 tracking-wide uppercase mb-3">
                Student Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                Student Council & Investiture
              </h2>
              <p className="mt-4 text-base text-gray-600">
                True leadership is learned by shouldering real responsibility. Every academic year begins with a democratic election and formal investiture ceremony for student leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-5 font-bold text-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Head Boy & Head Girl</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Serve as prime ambassadors of the student body, anchoring morning assemblies, representing peers at management councils, and leading school flag hoisting.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-5 font-bold text-lg">
                  <Trophy className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sports & Cultural Prefects</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Coordinate inter-house sporting fixtures, annual athletic meets, celebration of festivals, morning assembly themes, and cultural showcases.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mb-5 font-bold text-lg">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">House Captains & Vice-Captains</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lead their respective houses in line discipline, uniform cleanliness inspections, house board displays, and inter-house competitive rallies.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Annual Celebrations Banner */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-xl">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                Signature Celebrations
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ fontFamily: 'Merriweather, serif' }}>
                Karmotsav, National Festivals & Science Conclaves
              </h2>
              <p className="text-blue-100 text-base leading-relaxed mb-8">
                From Independence Day and Republic Day parades to Guru Purnima, Shiv Jayanti, Diwali celebrations, and our grand Annual Gathering & Prize Distribution, life at Karmayogi Vidyaniketan is vibrant and culturally enriching.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/gallery"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all text-sm inline-flex items-center gap-2"
                >
                  View Photo Gallery <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/events"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-sm"
                >
                  Upcoming Events Calendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
