// School Student Life & Campus Experience Dataset for Karmayogi Vidyaniketan / Karmayogi Public School
// Shri Pandurang Pratishthan, Pandharpur

export const DEFAULT_CULTURAL_EVENTS = [
  {
    id: 'cult-1',
    title: 'Karmotsav - Annual Gathering & Cultural Fiesta',
    badge: 'Flagship Event',
    tag: 'Stage & Performing Arts',
    desc: 'The grand annual cultural extravaganza showcasing student theatrical plays, folk and classical dances (Lezim, Bharatanatyam, Kathak), classical music ensembles, and award ceremonies.',
    highlights: ['2,000+ Audience Capacity', '100% Student Participation Encouraged', 'Parent & Alumni Gala Evening']
  },
  {
    id: 'cult-2',
    title: 'Traditional & National Celebrations',
    badge: 'Cultural Pride',
    tag: 'Heritage & Values',
    desc: 'Grand celebrations of Independence Day, Republic Day, Shiv Jayanti, Guru Purnima, Ashadhi Ekadashi Dindi rally, and Marathi Bhasha Sanman Din instilling deep cultural roots.',
    highlights: ['Traditional Dindi Procession & Palkhi', 'Historical Skits & Speeches', 'Flag Hoisting & March-Past']
  },
  {
    id: 'cult-3',
    title: 'Music, Dance & Fine Arts Exhibitions',
    badge: 'Artistic Excellence',
    tag: 'Creativity Showcase',
    desc: 'Dedicated exhibitions featuring student canvas paintings, clay sculptures, Rangoli competitions, and inter-house vocal music battles evaluated by renowned regional artists.',
    highlights: ['Live Classical Tabla & Harmonium', 'Theme-Based Rangoli Contests', 'Juried Art Exhibitions']
  }
];

export const DEFAULT_STUDENT_CLUBS = [
  {
    id: 'club-1',
    title: 'STEM & Robotics Club',
    icon: 'Sparkles',
    description: 'Students tinker with DIY circuits, robotics kits, coding challenges, block programming, and models for regional science competitions.',
    activities: ['Arduino & sensor prototyping', 'Block coding & Python fundamentals', 'Science Olympiad & model prep']
  },
  {
    id: 'club-2',
    title: 'Literary & Debating Society',
    icon: 'BookOpen',
    description: 'Fosters eloquent public speaking, elocution, creative writing, book reviews, and parliamentary-style debating in English, Marathi, and Hindi.',
    activities: ['Annual school elocution debate', 'Poetry recitation & creative writing', 'School editorial & wall magazine']
  },
  {
    id: 'club-3',
    title: 'Music, Drama & Performing Arts',
    icon: 'Music',
    description: 'Classical, semi-classical vocal training, harmonium, tabla, guitar, theatrical drama, and street plays highlighting social awareness.',
    activities: ['Classical vocal choir & harmonium', 'Sanskrit shloka recitation', 'Annual theatrical stage drama']
  },
  {
    id: 'club-4',
    title: 'Fine Arts & Craft Guild',
    icon: 'Palette',
    description: 'Nurtures visual creativity through watercoloring, sketch art, origami, clay modelling, Rangoli, and annual exhibition displays.',
    activities: ['Campus art gallery showcase', 'Waste-to-wealth craft innovation', 'Elementary & Intermediate drawing prep']
  },
  {
    id: 'club-5',
    title: 'Eco & Heritage Club',
    icon: 'Compass',
    description: 'Sensitizes students towards environmental protection, tree plantation, water conservation, composting, and Pandharpur heritage preservation.',
    activities: ['Green campus tree planting drives', 'Chandrabhaga riverbank cleanliness', 'Bird watching & biodiversity studies']
  },
  {
    id: 'club-6',
    title: 'Social Service & Red Cross Wing',
    icon: 'Users',
    description: 'Instills social empathy through community service, donation drives for rural schools, and disaster-relief assistance.',
    activities: ['Community outreach & book drives', 'First aid certification camps', 'Cleanliness & health hygiene rallies']
  }
];

export const DEFAULT_FIELD_TRIPS = [
  {
    id: 'trip-1',
    title: 'Historical Forts & Heritage Excursions',
    destination: 'Solapur Bhuikot Fort, Sinhagad & Raigad',
    category: 'History & Heritage',
    desc: 'On-site historical exploration where students study Maratha architecture, fortress defense engineering, and Maharashtra’s rich heritage with expert guides.',
    highlights: ['Guided architecture study', 'Historical role-play & quizzes', 'Safety-first escorted tours']
  },
  {
    id: 'trip-2',
    title: 'Nehru Science Centre & Planetarium Tour',
    destination: 'Nehru Science Centre & Regional Observatories',
    category: 'STEM & Astronomy',
    desc: 'Interactive physics demonstrations, 3D space dome screenings, and astronomical telescope sky-watching sessions to ignite inquisitive scientific minds.',
    highlights: ['Hands-on scientific exhibits', 'Planetarium dome show', 'Interactive robotics workshop']
  },
  {
    id: 'trip-3',
    title: 'Agro-Tourism & Nature Ecology Trails',
    destination: 'Agricultural Research Station & Botanical Reserves',
    category: 'Environmental Studies',
    desc: 'Practical exposure to organic farming, drip irrigation technology, flora identification, bird watching, and biodiversity preservation in Pandharpur and Solapur districts.',
    highlights: ['Soil & crop science study', 'River ecology observations', 'Nature journal documentation']
  },
  {
    id: 'trip-4',
    title: 'Dairy & Cooperative Industrial Visits',
    destination: 'Modern Automated Dairy & Food Processing Plants',
    category: 'Industrial Exposure',
    desc: 'Learning the journey of milk pasteurization, hygiene standards, packaging automation, and cooperative economics in rural Maharashtra.',
    highlights: ['Industrial automation live demo', 'Quality assurance lab tour', 'Q&A with plant engineers']
  }
];

export const DEFAULT_COMPETITIONS = [
  {
    id: 'comp-1',
    name: 'SOF National & International Olympiads',
    org: 'Science Olympiad Foundation (New Delhi)',
    subjects: 'NSO (Science), IMO (Math), IEO (English), NCO (Cyber)',
    badge: 'International Level',
    desc: 'Rigorous preparatory coaching and test series enabling students to compete against global peers, earning international ranks and merit certificates.'
  },
  {
    id: 'comp-2',
    name: 'Maharashtra Talent Search (MTS) & NTSE',
    org: 'State & National Talent Councils',
    subjects: 'Mental Ability (MAT) & Scholastic Aptitude (SAT)',
    badge: 'State & National',
    desc: 'Special scholarship training batches conducted by senior faculty to develop advanced problem-solving speed and critical thinking.'
  },
  {
    id: 'comp-3',
    name: 'Government Drawing Grade Examinations',
    org: 'Directorate of Art, Maharashtra State',
    subjects: 'Elementary & Intermediate Grade Exams',
    badge: 'Certified Credential',
    desc: 'Comprehensive practical training in object drawing, memory drawing, design, and geometry, granting extra marks for secondary board admissions.'
  },
  {
    id: 'comp-4',
    name: 'Inter-School Elocution, Debates & Quizzes',
    org: 'District School Associations & Rotary Club',
    subjects: 'English, Marathi & Hindi Public Speaking',
    badge: 'Communication',
    desc: 'Intense debating fixtures honing persuasive reasoning, vocabulary, stage confidence, and current affairs mastery.'
  }
];

export const DEFAULT_STUDENT_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    stat: '100%',
    title: 'Class 10 Board Pass Track Record',
    desc: 'Consistent 100% board results with over 68% of candidates scoring distinction (above 75%) and top percentiles in Solapur district.'
  },
  {
    id: 'ach-2',
    stat: '45+',
    title: 'SOF Olympiad Medals (Annual)',
    desc: 'Gold, Silver, and Bronze medals won across Science, Mathematics, Cyber, and English Olympiads with zonal rank holders.'
  },
  {
    id: 'ach-3',
    stat: '18+',
    title: 'District Sports Trophies',
    desc: 'Championship wins in Solapur District DSO tournaments for Kabaddi, Kho-Kho, Sprinting (100m/200m), and Chess.'
  },
  {
    id: 'ach-4',
    stat: '98.4%',
    title: 'School Highest Board Score',
    desc: 'Exemplary academic achievement achieved by our batch topper with centum (100/100) scores in Mathematics and Science.'
  }
];

export const DEFAULT_STUDENT_HOUSES = [
  {
    id: 'house-1',
    name: 'Prithvi House',
    motto: 'Strength, Endurance & Humility',
    color: 'from-amber-600 to-amber-800',
    accent: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Named after Mother Earth, Prithvi house embodies rooted stability, perseverance, dependability, and reverence for environmental balance.'
  },
  {
    id: 'house-2',
    name: 'Agni House',
    motto: 'Courage, Energy & Zeal',
    color: 'from-red-600 to-orange-700',
    accent: 'bg-orange-100 text-orange-900 border-orange-300',
    description: 'Signifying the holy fire, Agni house inspires passion for knowledge, bold leadership, intense athletic drive, and moral courage.'
  },
  {
    id: 'house-3',
    name: 'Jal House',
    motto: 'Adaptability, Depth & Compassion',
    color: 'from-blue-600 to-cyan-700',
    accent: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'Reflecting life-giving water and the divine river Chandrabhaga, Jal house represents deep intellectual inquiry, flexibility, and kindness.'
  },
  {
    id: 'house-4',
    name: 'Vayu House',
    motto: 'Freedom, Vision & Inclusivity',
    color: 'from-emerald-600 to-teal-800',
    accent: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Representing the spirit of the wind, Vayu house stands for boundless imagination, swift agility, progressive thoughts, and global vision.'
  }
];

export const DEFAULT_STUDENT_COUNCIL = [
  {
    id: 'role-1',
    role: 'Head Boy & Head Girl',
    badge: 'Student Leadership',
    desc: 'Serve as prime ambassadors of the student body, anchoring morning assemblies, representing peers at management councils, and leading school flag hoisting.'
  },
  {
    id: 'role-2',
    role: 'Sports & Cultural Prefects',
    badge: 'Co-Curricular',
    desc: 'Coordinate inter-house sporting fixtures, annual athletic meets, celebration of festivals, morning assembly themes, and cultural showcases.'
  },
  {
    id: 'role-3',
    role: 'House Captains & Vice-Captains',
    badge: 'House Governance',
    desc: 'Lead their respective houses in line discipline, uniform cleanliness inspections, house board displays, and inter-house competitive rallies.'
  }
];

export const DEFAULT_CAMPUS_ACTIVITIES = [
  {
    id: 'act-1',
    title: "Annual Day & Cultural Celebration — 'Karmotsav'",
    shortTitle: "Annual Day 'Karmotsav'",
    category: 'Cultural Extravaganza',
    badge: 'Annual School Showcase',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    desc: 'The grand highlight of our academic calendar featuring thematic musicals, classical and folk dance performances, Marathi drama, patriotic recitations, and student award ceremonies witnessed by thousands of parents and well-wishers.'
  },
  {
    id: 'act-2',
    title: 'Annual Sports Meet & Athletics Championship',
    shortTitle: 'Annual Sports Meet',
    category: 'Athletics & Games',
    badge: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    desc: 'A vibrant 3-day sporting carnival featuring march past contingents, track and field races, relay events, cricket, football, kabaddi, and kho-kho championships celebrating physical endurance, discipline, and sportsmanship.'
  },
  {
    id: 'act-3',
    title: 'Karmayogi Science Exhibition & STEM Expo',
    shortTitle: 'Science & STEM Exhibition',
    category: 'Innovation & Science',
    badge: 'Academic Innovation',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    desc: 'A dynamic showcase where young innovators from Primary to Secondary grades design working robotics models, solar energy prototypes, eco-friendly water filtration systems, and interactive math exhibits evaluated by external scientists.'
  },
  {
    id: 'act-4',
    title: 'Independence Day & Republic Day Celebrations',
    shortTitle: 'National Celebrations',
    category: 'Patriotic Observance',
    badge: 'National Pride',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    desc: 'Ceremonial unfurling of the National Tricolor, inspiring parade by student scout and guide squads, patriotic group songs, martial arts demonstrations, and speeches reflecting on Indian constitutional values and nation-building.'
  },
  {
    id: 'act-5',
    title: 'Educational Field Trips & Heritage Excursions',
    shortTitle: 'Educational Excursions',
    category: 'Experiential Learning',
    badge: 'Outdoor Discovery',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    desc: 'Carefully curated outdoor learning journeys to agricultural research centers, historical forts of Maharashtra, astronomical observatories, biodiversity parks, and manufacturing facilities deepening classroom insights.'
  },
  {
    id: 'act-6',
    title: 'Inter-House Elocution, Debates & Quiz Leagues',
    shortTitle: 'Literary & Quiz Leagues',
    category: 'Academic Competitions',
    badge: 'Intellectual Rigor',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    desc: 'Spirited competitions among the four school houses fostering persuasive public speaking, quick analytical thinking, current affairs awareness, and literary expression in English, Marathi, and Hindi.'
  },
  {
    id: 'act-7',
    title: 'AI, Coding & Robotics Workshops',
    shortTitle: 'Robotics & Coding Bootcamps',
    category: 'Emerging Tech',
    badge: '21st-Century Skills',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    desc: 'Weekend and club sessions where students build sensor-driven robotics buggies, code block-based games in Scratch, explore Python programming, and construct electronic circuits with mentorship from IT engineers.'
  },
  {
    id: 'act-8',
    title: 'Eco-Club Green Campus & Tree Plantation Drives',
    shortTitle: 'Eco-Club & Plantation',
    category: 'Environmental Sensitivity',
    badge: 'Community Action',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    desc: 'Student-led environmental stewardship drives cultivating organic campus vegetable gardens, conducting plastic-free awareness campaigns in Pandharpur, and planting indigenous saplings across surrounding areas.'
  }
];

export const DEFAULT_BEYOND_CLASSROOM_SPACES = [
  {
    id: 'space-1',
    icon: 'sports',
    title: 'Outdoor Grounds & Arenas',
    desc: 'Sprawling grass grounds for athletics, football, cricket nets, kabaddi courts, and kho-kho arenas fostering stamina and sportsmanship.'
  },
  {
    id: 'space-2',
    icon: 'flask',
    title: 'STEM & Robotics Hub',
    desc: 'Tinkering and discovery space with Arduino kits, microcontrollers, sensor modules, and science apparatus for project work.'
  },
  {
    id: 'space-3',
    icon: 'book',
    title: 'Central School Library',
    desc: 'Over 8,000 curriculum textbooks, encyclopedias, children’s literature, periodicals, and quiet reading spaces.'
  },
  {
    id: 'space-4',
    icon: 'music',
    title: 'Music & Cultural Hall',
    desc: 'Acoustically treated activity halls dedicated to vocal music, harmonium, tabla, theatrical rehearsals, and festival preparations.'
  },
  {
    id: 'space-5',
    icon: 'book',
    title: 'Reading & Resource Center',
    desc: 'Spacious quiet study commons and reference archives with curriculum books, encyclopedias, and educational journals.'
  },
  {
    id: 'space-6',
    icon: 'bus',
    title: 'Safe Commute & Transport',
    desc: 'GPS-monitored yellow school bus fleet connecting Pandharpur city, Isbavi, Shelve, and neighboring regions with female caretakers.'
  }
];

export const DEFAULT_STUDENT_CORNER_DATA = {
  overview: {
    title: 'Student Life, Activities & Achievements',
    lead: 'At Karmayogi Vidyaniketan, education extends far beyond textbooks into athletics, stage arts, hobby clubs, adventurous field trips, and competitive triumphs.'
  },
  cultural: DEFAULT_CULTURAL_EVENTS,
  clubs: DEFAULT_STUDENT_CLUBS,
  fieldTrips: DEFAULT_FIELD_TRIPS,
  competitions: DEFAULT_COMPETITIONS,
  achievements: DEFAULT_STUDENT_ACHIEVEMENTS,
  houses: DEFAULT_STUDENT_HOUSES,
  council: DEFAULT_STUDENT_COUNCIL,
  activities: DEFAULT_CAMPUS_ACTIVITIES,
  spaces: DEFAULT_BEYOND_CLASSROOM_SPACES
};

