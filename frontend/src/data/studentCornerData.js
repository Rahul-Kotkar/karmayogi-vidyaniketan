// Central structured data for Student Corner & Campus Life
// Matching the 6 user-side subpages: Activities, Support & Mentorship, Achievements, Scholarships, Anti-Ragging, Student Council

export const DEFAULT_CAMPUS_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'National Physiotherapy Week (NPW)',
    shortTitle: 'Physiotherapy Week & Symposia',
    category: 'Annual Professional Event',
    badge: 'Annual Professional Event',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    desc: 'Held annually with state and national academic symposia in association with professional physiotherapy associations, featuring scientific seminars, inter-collegiate model-making competitions, clinical poster presentations, and community ergonomics awareness campaigns.'
  },
  {
    id: 'act-2',
    title: 'World Physical Therapy Day (Sept 8)',
    shortTitle: 'World Physical Therapy Day',
    category: 'Global Celebration',
    badge: 'Global Celebration',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    desc: 'Annual global observance honoring the physical therapy profession. Students take the professional oath, conduct free health checkup camps, and organize rallies educating the public on physical wellness, arthritis management, and mobility.'
  },
  {
    id: 'act-3',
    title: "Annual Cultural Fest — 'Karmotsav'",
    shortTitle: "Annual Cultural Fest — 'Karmotsav'",
    category: 'Cultural Extravaganza',
    badge: 'Cultural Extravaganza',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    desc: 'A vibrant multi-day cultural festival showcasing student talents in classical & modern dance, music, drama, fashion shows, street plays on healthcare awareness, and fine arts across Maharashtra.'
  },
  {
    id: 'act-4',
    title: "Annual Sports Tournament — 'Karmayogi Trophy'",
    shortTitle: "Annual Sports Tournament — 'Karmayogi Trophy'",
    category: 'Athletics & Games',
    badge: 'Athletics & Games',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    desc: 'Inter-departmental and inter-collegiate sports championship encompassing cricket, volleyball, kabaddi, badminton, table tennis, and track-and-field athletic events promoting physical fitness and sportsmanship.'
  },
  {
    id: 'act-5',
    title: 'National Service Scheme (NSS) Outreach',
    shortTitle: 'NSS Community Health Outreach',
    category: 'Community & Social Responsibility',
    badge: 'Community & Social Responsibility',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    desc: 'Active NSS unit conducting 7-day rural special residential camps, free medical diagnosis and physical therapy treatment camps, blood donation drives, tree plantation, and village sanitation campaigns in Pandharpur taluka.'
  },
  {
    id: 'act-6',
    title: 'Hospital Clinical Postings & Community Visits',
    shortTitle: 'Hospital Clinical Postings',
    category: 'Experiential Learning',
    badge: 'Experiential Learning',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    desc: 'Regular clinical postings to multi-speciality attached teaching hospitals, ICU rehabilitation units, OPD clinics, rehabilitation centres, and specialized pediatric and geriatric facilities across Solapur district.'
  },
  {
    id: 'act-7',
    title: 'Student Innovation & Scientific Competitions',
    shortTitle: 'Scientific Research Competitions',
    category: 'Research & Creativity',
    badge: 'Research & Creativity',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    desc: 'Annual technical paper presentations, clinical problem-solving hackathons, research poster presentations, and quiz leagues stimulating scientific inquiry and analytical problem-solving.'
  },
  {
    id: 'act-8',
    title: 'Health Awareness & Blood Donation Camps',
    shortTitle: 'Health Awareness & Blood Donation',
    category: 'Public Healthcare',
    badge: 'Public Healthcare',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    desc: 'Periodic voluntary blood donation camps in collaboration with government civil hospitals, alongside free diabetes, hypertension, and musculoskeletal posture screening for rural communities.'
  }
]

export const DEFAULT_BEYOND_CLASSROOM_SPACES = [
  {
    id: 'space-1',
    title: 'Laboratories',
    icon: 'flask',
    desc: 'Practical spaces for discipline-specific learning and experimentation.'
  },
  {
    id: 'space-2',
    title: 'Central Library',
    icon: 'book',
    desc: 'A focused environment for study, reference, and collaborative learning.'
  },
  {
    id: 'space-3',
    title: 'Hostel Facilities',
    icon: 'home',
    desc: 'Editable information about accommodation and student support facilities.'
  },
  {
    id: 'space-4',
    title: 'Sports',
    icon: 'gamepad',
    desc: 'Spaces and activities that encourage wellbeing, teamwork, and healthy competition.'
  },
  {
    id: 'space-5',
    title: 'Cultural Activities',
    icon: 'music',
    desc: 'A platform for expression, celebration, and student participation.'
  },
  {
    id: 'space-6',
    title: 'Student Clubs',
    icon: 'users',
    desc: 'Technical and interest-based groups that encourage initiative and collaboration.'
  },
  {
    id: 'space-7',
    title: 'Transportation',
    icon: 'bus',
    desc: 'Editable route and transport information for students and families.'
  }
]

export const DEFAULT_STUDENT_CORNER_DATA = {
  activities: DEFAULT_CAMPUS_ACTIVITIES,
  spaces: DEFAULT_BEYOND_CLASSROOM_SPACES,

  support: {
    guardianScheme: 'Each faculty member is assigned a cohort of 15–20 students. Monthly one-on-one sessions monitor academic progress, attendance records, and personal wellbeing.',
    items: [
      {
        id: 'sup-1',
        title: 'Academic Remedial Coaching',
        desc: 'Special tutorial classes, simplified study material, and bilingual explanations arranged after college hours for students needing additional academic support before university exams.'
      },
      {
        id: 'sup-2',
        title: 'Professional Psychological Counseling',
        desc: 'Confidential counseling services available on campus to help students manage exam stress, clinical anxiety, hostel transition, and personal challenges.'
      },
      {
        id: 'sup-3',
        title: 'Grievance Redressal Mechanism',
        desc: 'Students can lodge academic, hostel or general grievances online or through the suggestion box. The committee meets fortnightly for prompt resolution.'
      }
    ]
  },

  achievements: [
    {
      id: 'ach-1',
      title: 'State Physiotherapy Conference Quiz',
      detail: '1st Prize awarded to Final Year BPT batch in inter-collegiate clinical reasoning and diagnosis competition.'
    },
    {
      id: 'ach-2',
      title: 'MUHS University Examination Merit Rankers',
      detail: 'Top 10 university ranks secured by BPT students in Kinesiology, Biomechanics and Electrotherapy.'
    },
    {
      id: 'ach-3',
      title: 'Inter-Collegiate Sports Tournament',
      detail: 'Overall Runners-up in State Medical Inter-Collegiate Badminton, Table Tennis & Athletics Meet.'
    },
    {
      id: 'ach-4',
      title: 'Community Health Outreach Recognition',
      detail: 'Commendation by District Health Administration for screening over 2,500 rural geriatric and pediatric patients.'
    }
  ],

  scholarships: {
    portalUrl: 'https://mahadbt.maharashtra.gov.in',
    portalNote: 'Students are assisted by our dedicated College Scholarship Desk to register and submit applications on the MahaDBT Portal (mahadbt.maharashtra.gov.in).',
    items: [
      {
        id: 'sch-1',
        authority: 'Govt of Maharashtra',
        title: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
        details: '50% Tuition and Exam Fee concession for Open/General category students with annual family income up to ₹8.00 Lakhs admitted through CAP round.'
      },
      {
        id: 'sch-2',
        authority: 'Social Justice Dept',
        title: 'Post-Matric Scholarship for SC / ST / VJNT / OBC / SBC Categories',
        details: '100% Tuition fee waiver and maintenance allowance for SC/ST students, and 50% to 100% fee concession for VJNT, OBC, and SBC categories as per government norms.'
      },
      {
        id: 'sch-3',
        authority: 'Minority Welfare',
        title: 'State & Central Minority Scholarships',
        details: 'Financial scholarship for eligible Muslim, Christian, Buddhist, Sikh, Parsi and Jain minority students meeting academic criteria.'
      }
    ]
  },

  council: {
    preamble: 'The College Student Council is constituted under Section 40 of the Maharashtra Public Universities Act, 2016, giving students a democratic platform to voice academic suggestions, organize institutional events, and foster institutional harmony.',
    items: [
      {
        id: 'cou-1',
        title: 'Student Council President',
        details: 'Coordinates all student activities, chairs student meetings, and represents student body on the College Development Committee (CDC).'
      },
      {
        id: 'cou-2',
        title: 'General Secretary (GS)',
        details: "Liaises directly with the Principal and Dean's Office regarding academic schedules, examinations, and student welfare."
      },
      {
        id: 'cou-3',
        title: 'Cultural & Sports Secretaries',
        details: 'Manages the annual fest, inter-collegiate tournaments, fitness campaigns, and cultural representations at MUHS Youth Festivals.'
      },
      {
        id: 'cou-4',
        title: 'Class Representatives (CRs)',
        details: 'Elected representatives from BPT 1st, 2nd, 3rd, and 4th years ensuring effective communication between students and teaching faculty.'
      }
    ]
  }
}
