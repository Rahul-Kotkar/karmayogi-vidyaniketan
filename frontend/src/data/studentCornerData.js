// School Student Corner & Campus Life Dataset for Karmayogi Vidyaniketan / Karmayogi Public School
// Shri Pandurang Pratishthan, Pandharpur

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

export const DEFAULT_STUDENT_HOUSES = [
  { name: 'Prithvi (Earth)', color: '#15803d', motto: 'Grounded in Values, Rooted in Strength', symbol: 'Green' },
  { name: 'Agni (Fire)', color: '#b91c1c', motto: 'Passionate in Learning, Radiant in Action', symbol: 'Red' },
  { name: 'Jal (Water)', color: '#0369a1', motto: 'Adaptable, Calm, and Resilient', symbol: 'Blue' },
  { name: 'Vayu (Wind)', color: '#d97706', motto: 'Free in Imagination, Swift in Progress', symbol: 'Yellow' }
];

export const DEFAULT_STUDENT_CLUBS = [
  { name: 'STEM & Robotics Club', desc: 'Design, coding, Arduino electronics, and competition preparation.' },
  { name: 'Literary & Debate Club', desc: 'Public speaking, creative writing, poetry, elocution, and newsletter editorial.' },
  { name: 'Eco & Nature Club', desc: 'Biodiversity documentation, waste recycling, gardening, and solar awareness.' },
  { name: 'Visual Arts & Craft Guild', desc: 'Fine arts, watercolor painting, clay sculpture, origami, and festival crafts.' },
  { name: 'Sports & Athletics Squad', desc: 'Specialized competitive coaching in cricket, football, kabaddi, and athletics.' },
  { name: 'Music & Performing Arts Ensemble', desc: 'Classical vocal music, tabla, keyboard, folk dance, and annual theatrical plays.' }
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
    title: 'Student Life & Development',
    lead: 'Nurturing curiosity, confidence, empathy, and leadership beyond textbooks at Karmayogi Vidyaniketan.'
  },
  houses: DEFAULT_STUDENT_HOUSES,
  clubs: DEFAULT_STUDENT_CLUBS,
  activities: DEFAULT_CAMPUS_ACTIVITIES,
  spaces: DEFAULT_BEYOND_CLASSROOM_SPACES,
  scholarships: {
    portalNote: 'Students from eligible categories are assisted with government scholarships and institutional merit grants.',
    portalUrl: 'https://mahadbt.maharashtra.gov.in',
    items: [
      { id: 1, title: 'Government of Maharashtra Social Welfare Scholarship', desc: 'Financial support and fee reimbursement for SC/ST/VJNT/OBC students as per government criteria.' },
      { id: 2, title: 'EBC / Economically Backward Concession', desc: 'Tuition fee concessions for meritorious students from economically weaker sections.' },
      { id: 3, title: 'Shri Pandurang Pratishthan Merit Scholarship', desc: 'Special institutional honors and fee concessions for academic, sports, and cultural distinction holders.' }
    ]
  }
};

