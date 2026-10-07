// Central data for the College of Physiotherapy website.
// All content is editable here — pages render from this data.
import { DEPARTMENTS_DATA } from './departmentsData.js';
import { BPT_SUBJECTS, BPT_YEARS } from './subjectsData.js';

export { DEPARTMENTS_DATA, BPT_SUBJECTS, BPT_YEARS };

export const COLLEGE = {
  foundation: "Shri Pandurang Pratishthan's",
  name: "KARMAYOGI COLLEGE OF PHYSIOTHERAPY",
  founder_name: "स्व. सुधाकरपंत परिचारक",
  motto: "Service to humanity is service to God",
  mottoAuthor: "Shri Pandurang Pratishthan",
  lines: [
    "Affiliated to Maharashtra University of Health Sciences, Nashik, Approved by Govt. of Maharashtra",
    "Approved by Directorate of Medical Education and Research (DMER), Mumbai",
    "Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS) - 413304."
  ],
  address: "Shelve, Pandharpur, Taluka: Pandharpur, Dist: Solapur - 413304",
  phone: "+91 02186 272345",
  email: "info@karmayogiphysiotherapy.edu.in",
  website: "www.karmayogiphysiotherapy.edu.in"
};

export const QUICK_LINKS = [
  { label: "BPT Subjects", path: "/academics/subjects" },
  { label: "Student Login", path: "/student-corner#login" },
  { label: "ERP", path: "/student-corner#erp" },
  { label: "Contact Us", path: "/contact" }
];

export const SOCIAL_LINKS = [
  { platform: "facebook", url: "https://facebook.com", icon: "fb" },
  { platform: "instagram", url: "https://instagram.com", icon: "ig" },
  { platform: "youtube", url: "https://youtube.com", icon: "yt" },
  { platform: "linkedin", url: "https://linkedin.com", icon: "li" }
];

// Row 1 Menu (Institutional Navigation: Home, About, Admissions, Faculty, Notices, Gallery, Contact)
export const ROW_1_NAV = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "ADMISSIONS", path: "/admissions" },
  { label: "FACULTY", path: "/faculty" },
  { label: "NOTICES", path: "/notices" },
  { label: "NEWS", path: "/news" },
  { label: "EVENTS", path: "/events" },
  { label: "GALLERY", path: "/gallery" },
  { label: "CONTACT", path: "/contact" }
];

// Row 2 Menu (Academics, Departments, Student Corner, Research, Facilities, Placement, Committees, IQAC/NAAC, Disclosures)
export const ROW_2_NAV = [
  { 
    label: "ACADEMICS", 
    path: "/academics/subjects", 
    children: [
      { label: "Subjects", path: "/academics/subjects", slug: "subjects" },
      { label: "Academic Calendar", path: "/academics/academic-calendar", slug: "academic-calendar" },
      { label: "Timetable", path: "/academics/timetable", slug: "timetable" },
      { label: "Examination", path: "/academics/examination", slug: "examination" },
      { label: "Results", path: "/academics/results", slug: "results" },
      { label: "Academic Policies", path: "/academics/academic-policies", slug: "academic-policies" },
      { label: "Student Handbook", path: "/academics/student-handbook", slug: "student-handbook" }
    ]
  },
  { 
    label: "DEPARTMENTS", 
    path: "/departments" 
  },
  { 
    label: "STUDENT CORNER", 
    path: "/student-corner", 
    children: [
      { label: "Student Activities", path: "/student-corner/activities", slug: "activities" },
      { label: "Student Support & Mentorship", path: "/student-corner/support", slug: "support" },
      { label: "Student Achievements", path: "/student-corner/achievements", slug: "achievements" },
      { label: "Scholarships & Freeships", path: "/student-corner/scholarships", slug: "scholarships" },
      { label: "Student Council", path: "/student-corner/council", slug: "council" }
    ]
  },
  { 
    label: "RESEARCH", 
    path: "/research", 
    children: [
      { label: "Research Overview", path: "/research/overview", slug: "overview" },
      { label: "Research Centers", path: "/research/centers", slug: "centers" },
      { label: "Research Projects", path: "/research/projects", slug: "projects" },
      { label: "Publications", path: "/research/publications", slug: "publications" },
      { label: "Patents", path: "/research/patents", slug: "patents" },
      { label: "Research Scholars", path: "/research/scholars", slug: "scholars" },
      { label: "Funded Projects", path: "/research/funded-projects", slug: "funded-projects" },
      { label: "Conferences", path: "/research/conferences", slug: "conferences" },
      { label: "Journals", path: "/research/journals", slug: "journals" },
      { label: "Research Achievements", path: "/research/achievements", slug: "achievements" }
    ]
  },
  { 
    label: "FACILITIES", 
    path: "/facilities", 
    children: [
      { label: "Physiotherapy Labs", path: "/facilities/labs", slug: "labs" },
      { label: "Central Library", path: "/facilities/library", slug: "library" },
      { label: "Classrooms & AV Halls", path: "/facilities/classrooms", slug: "classrooms" },
      { label: "Computer Lab & IT", path: "/facilities/computer-lab", slug: "computer-lab" },
      { label: "Hostel & Mess", path: "/facilities/hostel", slug: "hostel" },
      { label: "Sports & Fitness Center", path: "/facilities/sports", slug: "sports" }
    ]
  },
  { 
    label: "PLACEMENT", 
    path: "/training-placement" 
  },
  { 
    label: "COMMITTEES", 
    path: "/committees", 
    children: [
      { label: "Overview of Committees", path: "/committees", slug: "overview" },
      { label: "Anti-Ragging Committee", path: "/committees/anti-ragging", slug: "anti-ragging" },
      { label: "Internal Complaints Committee (ICC)", path: "/committees/icc", slug: "icc" },
      { label: "College Council", path: "/committees/college-council", slug: "college-council" },
      { label: "Grievance Redressal Committee", path: "/committees/grievance", slug: "grievance" },
      { label: "Institutional Ethics Committee (IEC)", path: "/committees/ethics", slug: "ethics" },
      { label: "Student Welfare & Mentorship", path: "/committees/student-welfare", slug: "student-welfare" },
      { label: "Library Committee", path: "/committees/library", slug: "library" }
    ]
  },
  { 
    label: "IQAC / NAAC", 
    path: "/iqac-naac", 
    children: [
      { label: "Internal Quality Assurance Cell", path: "/iqac-naac/iqac", slug: "iqac" },
      { label: "NAAC Accreditation", path: "/iqac-naac/naac", slug: "naac" },
      { label: "Minutes of IQAC", path: "/iqac-naac/minutes", slug: "minutes" },
      { label: "Quality Initiatives", path: "/iqac-naac/initiatives", slug: "initiatives" },
      { label: "Annual Quality Reports (AQAR)", path: "/iqac-naac/aqar", slug: "aqar" }
    ]
  },
  { 
    label: "MANDATORY DISCLOSURES", 
    path: "/mandatory-disclosures", 
    children: [
      { label: "MUHS Mandated Disclosures", path: "/mandatory-disclosures/muhs", slug: "muhs" },
      { label: "Institutional Policies", path: "/mandatory-disclosures/policies", slug: "policies" },
      { label: "Government Approvals", path: "/mandatory-disclosures/approvals", slug: "approvals" },
      { label: "Annual Financial Audit", path: "/mandatory-disclosures/reports", slug: "reports" }
    ]
  }
];

export const TOP_NAV = ROW_1_NAV;
export const SECOND_NAV = ROW_2_NAV;

export const COURSES = [
  {
    id: "bpt",
    code: "BPT",
    name: "Bachelor of Physiotherapy (BPT)",
    degree_level: "UG",
    duration: "4.5 Years (including 6-month compulsory internship)",
    intake: "60 Seats",
    eligibility: "10+2 (PCB) with NEET-UG qualification",
    fees: "As per FRA norms (₹ 88,000 / year)",
    description: "A comprehensive undergraduate program covering musculoskeletal, neurological, cardiopulmonary and community physiotherapy with extensive clinical exposure.",
    status: "Active",
    order_index: 1
  },
  {
    id: "mpt",
    code: "MPT",
    name: "Master of Physiotherapy (MPT)",
    degree_level: "PG",
    duration: "2 Years",
    intake: "20 Seats",
    eligibility: "BPT from MUHS / recognized university with PGP-CET qualification",
    fees: "As per FRA norms (₹ 88,000 / year)",
    description: "A specialized postgraduate program offering advanced clinical competencies in musculoskeletal, neurological, and sports rehabilitation.",
    status: "Active",
    order_index: 2
  }
];

export const FACILITIES = [
  { id: "labs", title: "Physiotherapy Laboratories", desc: "Well-equipped electrotherapy, exercise therapy and hydrotherapy labs with modern physiotherapy equipment.", img: "https://picsum.photos/seed/coplab/640/420" },
  { id: "library", title: "Central Library", desc: "Rich collection of physiotherapy and medical textbooks, national and international journals with digital access.", img: "https://picsum.photos/seed/coplib/640/420" },
  { id: "clinical", title: "Clinical Training Facilities", desc: "Clinical postings at Dr. Vithalrao Vikhe Patil Hospital and affiliated hospitals for hands-on patient care.", img: "https://picsum.photos/seed/copclin/640/420" },
  { id: "classrooms", title: "Classrooms", desc: "Spacious, ventilated lecture halls with audio-visual aids for effective teaching-learning.", img: "https://picsum.photos/seed/copclass/640/420" },
  { id: "computer", title: "Computer Laboratory", desc: "Computer lab with internet facility, e-learning resources and research software support.", img: "https://picsum.photos/seed/copcomp/640/420" },
  { id: "sports", title: "Sports Facilities", desc: "Indoor and outdoor sports facilities promoting physical fitness and all-round development.", img: "https://picsum.photos/seed/copsport/640/420" },
  { id: "hostel", title: "Hostel", desc: "Separate, secure hostel accommodation for boys and girls with mess and recreational facilities.", img: "https://picsum.photos/seed/cophostel/640/420" },
  { id: "hospital", title: "Hospital / Clinical Facilities", desc: "Attached hospital with OPD, IPD and specialized physiotherapy services for community care.", img: "https://picsum.photos/seed/cophosp/640/420" }
];

export const DEPARTMENTS = DEPARTMENTS_DATA.map(d => ({
  id: d.id,
  slug: d.slug,
  name: d.name,
  head: d.head,
  tagline: d.tagline,
  desc: d.tagline || d.overview,
  description: d.overview,
  overview: d.overview,
  academic_year: d.academic_year || d.yearKey || 'year-1',
  yearKey: d.yearKey || d.academic_year || 'year-1',
  yearLabel: d.yearLabel || 'First Year BPT',
  subject_count: d.subject_count || (d.relatedSubjectIds?.length || 0),
  relatedSubjectIds: d.relatedSubjectIds || [],
  specializations: d.specializations || []
}));

export const FACULTY = [];

export const NOTICES = [];

export const EVENTS = [];

export const GALLERY = [
  { src: "https://picsum.photos/seed/campus1/800/600", cat: "Campus", cap: "Main Building" },
  { src: "https://picsum.photos/seed/acad1/800/600", cat: "Academic Activities", cap: "Lecture Session" },
  { src: "https://picsum.photos/seed/clin1/800/600", cat: "Clinical Training", cap: "Clinical Posting" },
  { src: "https://picsum.photos/seed/event1/800/600", cat: "Events", cap: "Annual Day" },
  { src: "https://picsum.photos/seed/stud1/800/600", cat: "Students", cap: "Student Volunteers" },
  { src: "https://picsum.photos/seed/wksp1/800/600", cat: "Workshops", cap: "Manual Therapy Workshop" },
  { src: "https://picsum.photos/seed/sport1/800/600", cat: "Sports", cap: "Annual Sports Meet" },
  { src: "https://picsum.photos/seed/campus2/800/600", cat: "Campus", cap: "Library Block" },
  { src: "https://picsum.photos/seed/acad2/800/600", cat: "Academic Activities", cap: "Seminar Presentation" },
  { src: "https://picsum.photos/seed/clin2/800/600", cat: "Clinical Training", cap: "OPD Training" },
  { src: "https://picsum.photos/seed/event2/800/600", cat: "Events", cap: "Convocation" },
  { src: "https://picsum.photos/seed/wksp2/800/600", cat: "Workshops", cap: "Electrotherapy Demo" }
];

export const ALBUMS = [
  {
    id: 1,
    title: "Campus & Infrastructure",
    category_name: "Campus",
    description: "State-of-the-art campus buildings, lecture halls, and central library.",
    cover_image: "https://picsum.photos/seed/campus1/800/600",
    photo_count: 2,
    photos: [
      { id: 101, image_url: "https://picsum.photos/seed/campus1/800/600", caption: "Main Academic Building" },
      { id: 102, image_url: "https://picsum.photos/seed/campus2/800/600", caption: "Central Library Block" }
    ]
  },
  {
    id: 2,
    title: "Academic Activities & Sessions",
    category_name: "Academic Activities",
    description: "Interactive lectures, clinical case presentations, and seminar sessions.",
    cover_image: "https://picsum.photos/seed/acad1/800/600",
    photo_count: 2,
    photos: [
      { id: 201, image_url: "https://picsum.photos/seed/acad1/800/600", caption: "Smart Classroom Lecture" },
      { id: 202, image_url: "https://picsum.photos/seed/acad2/800/600", caption: "Student Seminar Presentation" }
    ]
  },
  {
    id: 3,
    title: "Clinical & Hospital Training",
    category_name: "Clinical Training",
    description: "Hands-on patient assessment, rehabilitation postings, and OPD clinical rotations.",
    cover_image: "https://picsum.photos/seed/clin1/800/600",
    photo_count: 2,
    photos: [
      { id: 301, image_url: "https://picsum.photos/seed/clin1/800/600", caption: "Hospital Clinical Posting" },
      { id: 302, image_url: "https://picsum.photos/seed/clin2/800/600", caption: "OPD Patient Rehabilitation" }
    ]
  },
  {
    id: 4,
    title: "Annual Events & Celebrations",
    category_name: "Events",
    description: "Convocation ceremony, annual day festivities, and institutional achievements.",
    cover_image: "https://picsum.photos/seed/event1/800/600",
    photo_count: 2,
    photos: [
      { id: 401, image_url: "https://picsum.photos/seed/event1/800/600", caption: "Annual College Gathering" },
      { id: 402, image_url: "https://picsum.photos/seed/event2/800/600", caption: "Convocation Degree Ceremony" }
    ]
  },
  {
    id: 5,
    title: "Hands-on Workshops & Demos",
    category_name: "Workshops",
    description: "Practical manual therapy workshops, electrotherapy apparatus demonstrations, and camps.",
    cover_image: "https://picsum.photos/seed/wksp1/800/600",
    photo_count: 2,
    photos: [
      { id: 501, image_url: "https://picsum.photos/seed/wksp1/800/600", caption: "Manual Therapy Clinical Workshop" },
      { id: 502, image_url: "https://picsum.photos/seed/wksp2/800/600", caption: "Electrotherapy Equipment Demonstration" }
    ]
  },
  {
    id: 6,
    title: "Annual Sports Meet & Athletics",
    category_name: "Sports",
    description: "Inter-collegiate sports tournament, athletics meet, and fitness activities.",
    cover_image: "https://picsum.photos/seed/sport1/800/600",
    photo_count: 2,
    photos: [
      { id: 601, image_url: "https://picsum.photos/seed/sport1/800/600", caption: "Annual Sports Track & Field" },
      { id: 602, image_url: "https://picsum.photos/seed/stud1/800/600", caption: "Student Sports Volunteers" }
    ]
  }
];

export const NEWS = [];

export const ACHIEVEMENTS = [];

export const HERO_IMAGE = "https://picsum.photos/seed/cophero/1600/700";
export const PRINCIPAL_PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 480' width='400' height='480'%3E%3Crect width='100%25' height='100%25' fill='%230b2545'/%3E%3Ccircle cx='200' cy='180' r='75' fill='%231e3a8a'/%3E%3Cpath d='M90 420 C90 290, 310 290, 310 420 Z' fill='%231e3a8a'/%3E%3Ccircle cx='200' cy='175' r='55' fill='%2338bdf8' opacity='0.3'/%3E%3Ctext x='50%25' y='450' text-anchor='middle' fill='%23cbd5e1' font-family='sans-serif' font-size='15' font-weight='600'%3EDr. S. P. Deshmukh%3C/text%3E%3C/svg%3E";

export const HERO_SLIDES = [
  {
    id: 1,
    tag: "HEAL | LEARN | SERVE | GROW",
    title: "Building Healthier Lives\nThrough Physiotherapy",
    description: "Karmayogi College of Physiotherapy is dedicated to excellence in physiotherapy education, research and community service.",
    quote: "Movement for a Better Tomorrow",
    image: null, // will use imported hero_building.png
    primaryBtn: { text: "Explore Our Programs →", link: "/academics" },
    secondaryBtn: { text: "About Our College", link: "/about" }
  },
  {
    id: 2,
    tag: "CLINICAL EXCELLENCE | MODERN LABS",
    title: "World-Class Hands-on\nTraining & Rehabilitation",
    description: "Comprehensive practical exposure in electrotherapy, kinesiology, neurology and multi-specialty clinical postings.",
    quote: "Excellence in Physical Healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
    primaryBtn: { text: "View Facilities →", link: "/facilities" },
    secondaryBtn: { text: "Hospital & OPD", link: "/hospital" }
  },
  {
    id: 3,
    tag: "RESEARCH | INNOVATION | DEDICATION",
    title: "Empowering Next-Gen\nHealthcare Leaders",
    description: "Affiliated to MUHS Nashik with state-of-the-art campus, dedicated faculty mentors and outstanding career placement track records.",
    quote: "Service to Humanity is Service to God",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80",
    primaryBtn: { text: "Admissions 2026–27 →", link: "/admissions" },
    secondaryBtn: { text: "Student Corner", link: "/student-corner" }
  }
];

export const DEFAULT_WHY_ITEMS = [
  {
    id: 1,
    icon: 'faculty',
    title: 'Experienced Faculty',
    description: 'Approachable mentors support academic progress and practical understanding.'
  },
  {
    id: 2,
    icon: 'infrastructure',
    title: 'Modern Infrastructure',
    description: 'Purpose-built spaces support focused learning and student collaboration.'
  },
  {
    id: 3,
    icon: 'curriculum',
    title: 'Industry-Oriented Curriculum',
    description: 'Learning connects engineering fundamentals with evolving professional practice.'
  },
  {
    id: 4,
    icon: 'research',
    title: 'Innovation & Research',
    description: 'Projects and technical activities encourage inquiry and experimentation.'
  },
  {
    id: 5,
    icon: 'development',
    title: 'Student Development',
    description: 'Communication, teamwork, and leadership complement technical learning.'
  },
  {
    id: 6,
    icon: 'placement',
    title: 'Placement Support',
    description: 'Career preparation helps students approach professional opportunities confidently.'
  }
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: "The project-based learning environment helped me become more confident in applying engineering concepts.",
    name: "Sample Student",
    role: "Student testimonial placeholder"
  },
  {
    id: 2,
    quote: "Faculty guidance and practical sessions encouraged our team to explore ideas beyond the classroom.",
    name: "Sample Alumnus",
    role: "Alumni testimonial placeholder"
  },
  {
    id: 3,
    quote: "Campus activities gave me opportunities to collaborate, communicate, and grow as an individual.",
    name: "Sample Student",
    role: "Student testimonial placeholder"
  }
];

export const DEFAULT_ABOUT_DATA = {
  // 1. Institute Info
  institute_tag: 'Shri Pandurang Pratishthan',
  institute_title: 'About Karmayogi Institute of Physiotherapy',
  institute_subtitle: 'Shelve, Pandharpur, Dist: Solapur (MS) — 413304 | Approved by Govt. of Maharashtra & DMER Mumbai, Affiliated to MUHS Nashik',
  institute_photo_url: '',
  institute_photo_caption: 'Campus & Teaching Hospital Building, Pandharpur',
  institute_p1: "Shri Pandurang Pratishthan's Karmayogi Institute of Physiotherapy was founded with an enduring commitment to bring world-class physical healthcare education and clinical rehabilitation to rural and semi-urban communities across Maharashtra. Located in the sacred temple town of Pandharpur, the institution is built upon the philanthropic ethos of holistic community empowerment through education, compassionate medical care, and professional excellence.",
  institute_p2: 'The institute provides the comprehensive Bachelor of Physiotherapy (BPT) degree program, equipped with modern lecture halls, digital anatomy software, advanced electrotherapy modalities, kinesiology gymnasiums, biomechanics laboratories, and specialized cardiopulmonary assessment units. Attached to a multi-specialty teaching hospital, students gain intensive hands-on bedside clinical posting experience right from the foundational years, nurturing their confidence, empathy, and evidence-based diagnostic abilities.',

  // 2. Vision & Mission
  vm_tag: 'Institutional Blueprint',
  vm_title: 'Vision & Mission',
  vm_subtitle: 'Guiding principles shaping future leaders in healthcare and clinical rehabilitation',
  vision_title: 'Our Vision',
  vision_text: 'Excellence and Innovation in Medical Education, clinical practice and research in physiotherapy, through strong academic, health care & Community partnership',
  mission_title: 'Our Mission',
  mission_points: [
    'To Prepare the Students to face the Global health Care Needs.',
    'To identify the Current Needs for Research promotion.',
    'To inculcate Professional Competence in Students through Education.',
    'To Foster social engagement and development through relationship.',
    'To Provide quality Physiotherapist well Equipped with Cognitive, psychomotor and effective skills.',
    'To Develop Future Leaders Committed to Accountable Patient Care.'
  ],

  // 3. Quality Policy
  qp_tag: 'Quality Assurance',
  qp_title: 'Quality Policy',
  qp_text: 'Karmayogi institute of physiotherapy is committed to impart quality education and training which aims to pursue global standards of excellence in all our endeavors like teaching, research clinical training and continue education we measure quality process through feedback from various stake holders to remain accountable in line with our vision mission of the Institution.',

  // 4. Governing Council
  council_tag: 'Institutional Administration',
  council_title: 'Governing Council & Advisory Board',
  council_subtitle: 'Constituent management body responsible for statutory compliance, academic strategy, and quality monitoring',
  council_description: 'The Governing Council of Karmayogi Institute of Physiotherapy functions in full alignment with the statutory norms established by the Maharashtra University of Health Sciences (MUHS), Nashik, and the Directorate of Medical Education and Research (DMER), Mumbai.',
  council_members: [
    { sr_no: '1', name: 'Hon. Shri Rohan R. Patil', designation: 'President / Chairman', representation: 'Management Representative' },
    { sr_no: '2', name: 'Trust Nominee Member', designation: 'Secretary / Trustee', representation: 'Shri Pandurang Pratishthan' },
    { sr_no: '3', name: 'Principal', designation: 'Member Secretary', representation: 'Head of the Institution' },
    { sr_no: '4', name: 'Senior Professor / Academic Dean', designation: 'Member', representation: 'Teaching Faculty Representative' },
    { sr_no: '5', name: 'MUHS University Nominee', designation: 'Member', representation: 'Affiliating University Representative' },
    { sr_no: '6', name: 'Medical Director / Superintendent', designation: 'Member', representation: 'Attached Hospital Representative' },
    { sr_no: '7', name: 'Healthcare Industry / Community Expert', designation: 'Member', representation: 'Public Health & Clinical Expert' }
  ],

  // 5. Affiliations & Statutory Approvals
  approvals_tag: 'Statutory Recognitions',
  approvals_title: 'Affiliations & Government Approvals',
  approvals_subtitle: 'Recognized educational credentials ensuring statutory validity and clinical licensing eligibility',
  approvals: [
    {
      badge: 'Affiliating University',
      title: 'Maharashtra University of Health Sciences (MUHS)',
      description: 'Affiliated to MUHS, Nashik for conducting the Bachelor of Physiotherapy (BPT) degree program.'
    },
    {
      badge: 'State Regulatory Authority',
      title: 'DMER Mumbai',
      description: 'Approved by Directorate of Medical Education and Research, Government of Maharashtra, Mumbai.'
    },
    {
      badge: 'State Government Approval',
      title: 'Government of Maharashtra',
      description: 'Approved and sanctioned by the Department of Medical Education and Drugs, Govt. of Maharashtra.'
    }
  ]
};

// ========================================================
// Dynamic Course-Specific Admissions Builder & Fallback Helpers
// ========================================================
export function createDefaultCourseAdmission(course = {}) {
  const code = (course.code || course.id || 'bpt').toLowerCase();
  const name = course.name || 'Bachelor of Physiotherapy (BPT)';
  const isUG = (course.degree_level || 'UG').toUpperCase() === 'UG';
  const duration = course.duration || (isUG ? "4.5 Years (including 6-month compulsory internship)" : "2 Years");
  const intake = course.intake || "60 Seats";

  return {
    course_id: course.id || code,
    course_code: (course.code || code).toUpperCase(),
    course_name: name,
    degree_level: course.degree_level || (isUG ? 'UG' : 'PG'),
    duration: duration,
    intake: intake,

    // 1. Admission Process Guidelines
    process_intro: isUG
      ? `Admissions to the ${name} program are conducted strictly through the Centralized Admission Process (CAP) governed by the State Common Entrance Test Cell, Maharashtra, based on NEET-UG merit scores.`
      : `Admissions to the ${name} program are conducted strictly through the Centralized Counseling Process governed by the State CET Cell, Maharashtra, based on entrance merit rankings.`,
    process_steps: isUG ? [
      { num: "Step 1", title: "NEET-UG Qualification", desc: "Candidates must appear and secure a qualifying score in the NEET-UG examination conducted by the National Testing Agency (NTA)." },
      { num: "Step 2", title: "State CET Cell Registration", desc: "Complete online counseling registration on the official portal (cetcell.mahacet.org) under Health Science courses and pay registration fees." },
      { num: "Step 3", title: "Document Verification", desc: "Participate in physical or online document verification as mandated by DMER to secure placement in the Maharashtra State Merit List." },
      { num: "Step 4", title: "Preference Choice Filling", desc: "Submit college preferences online, selecting Karmayogi College of Physiotherapy, Shelve, Pandharpur, as the preferred institution code." },
      { num: "Step 5", title: "College Reporting & Admission", desc: "Report to the college campus with all original documents, status retention form, and prescribed fees to confirm the allotted seat." }
    ] : [
      { num: "Step 1", title: "PG Entrance Qualification", desc: "Appear and qualify in the relevant state post-graduate entrance test (PGP-CET)." },
      { num: "Step 2", title: "State CET Cell Registration", desc: "Register online on the State CET Cell Maharashtra portal for postgraduate medical counseling." },
      { num: "Step 3", title: "Document Verification", desc: "Verify BPT degree certificate, internship completion certificate, and state council registration." },
      { num: "Step 4", title: "Option Form Filling", desc: "Submit branch and institution preferences in centralized CAP rounds." },
      { num: "Step 5", title: "Reporting & Seat Confirmation", desc: "Report to Karmayogi College of Physiotherapy with original documents and prescribed tuition fees." }
    ],

    // 2. Eligibility Criteria
    eligibility_intro: `Candidates seeking admission to ${name} must fulfill all statutory eligibility norms framed by MUHS Nashik, DMER Mumbai, and the Government of Maharashtra:`,
    eligibility_points: isUG ? [
      "Passed Higher Secondary Certificate (10+2 / HSC) or equivalent examination from a recognized board.",
      "Passed with English, Physics, Chemistry, and Biology (PCB) subjects.",
      "Minimum 50% aggregate marks in PCB for Open/General category candidates (40% for SC, ST, VJ, NT, OBC).",
      "Qualified in NEET-UG of the current academic year.",
      "Completed 17 years of age on or before 31st December of the admission year.",
      "Indian Nationality with valid Maharashtra State Domicile (for state quota seats)."
    ] : [
      "Passed Bachelor of Physiotherapy (BPT) degree from a university recognized by MUHS / UGC with minimum 50% aggregate marks.",
      "Satisfactory completion of 6-month compulsory rotating internship before the cutoff date prescribed by State CET Cell.",
      "Valid permanent or provisional registration with the Maharashtra State OT/PT Council.",
      "Valid merit rank in the PGP-CET entrance examination conducted by State CET Cell."
    ],

    // 3. Application Form & Submission Procedure
    app_form_intro: `Information regarding the acquisition, completion, and submission of admission applications for ${name} for Centralized Counseling and Institutional Round quotas:`,
    app_cap_title: "Centralized CAP Application (State CET Cell)",
    app_cap_points: [
      "Official Portal: https://cetcell.mahacet.org/",
      "Registration Window: As declared post-entrance exam results by the State CET Cell.",
      "Process: Online registration, uploading scanned certificates, payment of counseling processing fee, and verification.",
      "Allotment: Seat allotment letters are downloaded directly from the candidate login."
    ],
    app_college_title: "College Institutional & Vacant Quota Application",
    app_college_points: [
      "Offline Application Form: Available at the College Admission Office, Karmayogi College of Physiotherapy, Shelve, Pandharpur.",
      "Office Timings: Monday to Saturday, 9:00 AM – 5:00 PM.",
      "Required Attachments: NEET/Entrance Scorecard, 10th & 12th marksheets, Leaving Certificate, Domicile, Caste Validity (if applicable), and 3 passport size photos.",
      "Submission: Duly completed forms must be submitted with original documents before the notified institutional cutoff date."
    ],
    app_form_download_url: "",

    // 4. Fee Structure Table
    fees_intro: `The fee structure for ${name} is approved and regulated annually by the Fee Regulating Authority (FRA), Government of Maharashtra. No capitation fee or donation is accepted under any circumstances.`,
    fees_table: [
      { category: "Open / General Category", tuition_fee: "₹ 80,000", dev_fee: "₹ 8,000", total_fee: "₹ 88,000", scholarship: "Nil", payable: "₹ 88,000" },
      { category: "EBC / EWS (Income <= 8 Lakh)", tuition_fee: "₹ 80,000", dev_fee: "₹ 8,000", total_fee: "₹ 88,000", scholarship: "50% Tuition Fee Concession (MahaDBT)", payable: "₹ 48,000" },
      { category: "OBC Category (Income <= 8 Lakh)", tuition_fee: "₹ 80,000", dev_fee: "₹ 8,000", total_fee: "₹ 88,000", scholarship: "50% Tuition Fee Concession (MahaDBT)", payable: "₹ 48,000" },
      { category: "VJNT / SBC Category", tuition_fee: "₹ 80,000", dev_fee: "₹ 8,000", total_fee: "₹ 88,000", scholarship: "100% Tuition Fee Concession (MahaDBT)", payable: "₹ 8,000" },
      { category: "SC / ST Category", tuition_fee: "₹ 80,000", dev_fee: "₹ 8,000", total_fee: "₹ 88,000", scholarship: "100% Tuition & Dev Fee Waiver (MahaDBT)", payable: "Nil" },
      { category: "Institutional / Management Quota", tuition_fee: "As per FRA norms", dev_fee: "As per FRA norms", total_fee: "As per FRA approved quota", scholarship: "Not applicable", payable: "As per FRA notification" }
    ],
    fees_notes: "Fees are payable via Demand Draft (DD) in favor of 'Karmayogi College of Physiotherapy' payable at Pandharpur, or via direct RTGS/NEFT to the college bank account. Refundable caution money and library deposits are applicable as per university norms.",

    // 5. Scholarships (MahaDBT)
    scholarships_intro: `Eligible candidates admitted to ${name} through the Centralized Admission Process (CAP) are entitled to state and central scholarship / freeship benefits processed via the Government of Maharashtra MahaDBT portal (https://mahadbt.maharashtra.gov.in/):`,
    scholarships_list: [
      {
        title: "Social Welfare Department (SC / ST Schemes)",
        desc: "100% Tuition Fee and Development Fee waiver for Scheduled Caste (SC) and Scheduled Tribe (ST) candidates admitted through CAP rounds with valid Caste and Validity certificates."
      },
      {
        title: "VJNT, SBC & OBC Welfare Department Schemes",
        desc: "Tuition fee concessions (50% to 100%) for VJNT, SBC, and OBC students with annual family income up to ₹8,00,000 having valid Non-Creamy Layer (NCL) certificate."
      },
      {
        title: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC / EWS)",
        desc: "50% Tuition Fee and 50% Exam Fee concession provided to Open/General category candidates from economically weaker backgrounds with family income up to ₹8,00,000 certified by Tahsildar."
      },
      {
        title: "Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna",
        desc: "Hostel maintenance allowance for children of registered marginal farmers (Alpabhudharak) and agricultural registered laborers pursuing higher professional medical education."
      },
      {
        title: "Minority Development Department Schemes",
        desc: "Financial assistance provided by the State Minority Development Department and Central Government for students belonging to Muslim, Christian, Buddhist, Sikh, Parsi, and Jain communities."
      }
    ],

    // 6. Important Dates & Admission Schedule
    dates_intro: `Academic calendar and critical dates for centralized admission counseling rounds and college commencement for ${name}:`,
    dates_list: [
      { title: "Online CET Cell Registration", desc: "As per official State CET Cell announcement schedule." },
      { title: "State Merit List Release", desc: "Provisional & final state merit ranks declared by DMER." },
      { title: "CAP Round Allotments", desc: "Round 1, Round 2, and Mop-Up rounds seat allocations." },
      { title: "College Reporting Window", desc: "Reporting to campus within 5 working days from allotment date." },
      { title: "Commencement of Classes", desc: "As notified by MUHS academic calendar." }
    ],

    // 7. Course Intake & Helpdesk
    intake_approved: intake,
    intake_description: `Approved by Government of Maharashtra, DMER Mumbai, and affiliated with Maharashtra University of Health Sciences (MUHS), Nashik.`,
    helpdesk_title: `${name} Admission Helpdesk`,
    helpdesk_phone: "+91 02186 272345, +91 94235 34567",
    helpdesk_email: "admissions@karmayogiphysiotherapy.edu.in",
    helpdesk_hours: "Monday – Saturday, 9:00 AM to 5:00 PM",
    helpdesk_address: "Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS) - 413304.",
    helpdesk_contact_persons: [
      { name: "Dr. Admission In-Charge", designation: "Admission Officer", phone: "+91 94235 34567" }
    ]
  };
}

export function getCourseAdmissionData(admissionsData, course) {
  if (!course) return null;
  const code = (course.code || '').toLowerCase().trim();
  const id = String(course.id || '').toLowerCase().trim();
  const name = (course.name || '').toLowerCase().trim();
  const key = code || id || 'bpt';
  const isUG = (course.degree_level || 'UG').toUpperCase() === 'UG';

  const defaultCourseData = createDefaultCourseAdmission(course);
  
  if (admissionsData?.courses_admissions && typeof admissionsData.courses_admissions === 'object') {
    const map = admissionsData.courses_admissions;
    
    // 1. Direct key match
    if (map[key]) {
      return { ...defaultCourseData, ...map[key] };
    }
    // 2. Direct code or id match
    if (code && map[code]) {
      return { ...defaultCourseData, ...map[code] };
    }
    if (id && map[id]) {
      return { ...defaultCourseData, ...map[id] };
    }

    // 3. Case-insensitive key search
    const foundKey = Object.keys(map).find(k => {
      const kl = k.toLowerCase().trim();
      return (
        kl === key ||
        (code && kl === code) ||
        (id && kl === id) ||
        (name && (name.includes(kl) || kl.includes(name)))
      );
    });

    if (foundKey && map[foundKey]) {
      return { ...defaultCourseData, ...map[foundKey] };
    }
  }

  // Fallback to legacy root keys ONLY for primary / UG course (e.g. BPT)
  const fallback = { ...defaultCourseData };
  if (admissionsData) {
    if (isUG || key === 'bpt') {
      if (Array.isArray(admissionsData.fees_table) && admissionsData.fees_table.length > 0) {
        fallback.fees_table = admissionsData.fees_table;
      }
      if (admissionsData.fees_intro) fallback.fees_intro = admissionsData.fees_intro;
      if (admissionsData.fees_notes) fallback.fees_notes = admissionsData.fees_notes;
      if (Array.isArray(admissionsData.process_steps) && admissionsData.process_steps.length > 0) {
        fallback.process_steps = admissionsData.process_steps;
      }
      if (admissionsData.process_intro) fallback.process_intro = admissionsData.process_intro;
      if (Array.isArray(admissionsData.scholarships_list) && admissionsData.scholarships_list.length > 0) {
        fallback.scholarships_list = admissionsData.scholarships_list;
      }
      if (Array.isArray(admissionsData.dates_list) && admissionsData.dates_list.length > 0) {
        fallback.dates_list = admissionsData.dates_list;
      }
      if (admissionsData.app_cap_title) fallback.app_cap_title = admissionsData.app_cap_title;
      if (Array.isArray(admissionsData.app_cap_points)) fallback.app_cap_points = admissionsData.app_cap_points;
      if (admissionsData.app_college_title) fallback.app_college_title = admissionsData.app_college_title;
      if (Array.isArray(admissionsData.app_college_points)) fallback.app_college_points = admissionsData.app_college_points;
    }

    // Specific eligibility program matching by name/code
    if (Array.isArray(admissionsData.eligibility_programs)) {
      const match = admissionsData.eligibility_programs.find(p => {
        const d = (p.degree || '').toLowerCase();
        return (key && d.includes(key)) || (code && d.includes(code)) || (name && (d.includes(name) || name.includes(d)));
      });
      if (match && Array.isArray(match.points)) {
        fallback.eligibility_points = match.points;
        if (match.duration) fallback.duration = match.duration;
      }
    }
  }
  return fallback;
}

const defaultBptAdmission = createDefaultCourseAdmission({
  id: "bpt",
  code: "BPT",
  name: "Bachelor of Physiotherapy (BPT)",
  degree_level: "UG",
  duration: "4.5 Years (including 6-month compulsory internship)",
  intake: "60 Seats"
});

const defaultMptAdmission = createDefaultCourseAdmission({
  id: "mpt",
  code: "MPT",
  name: "Master of Physiotherapy (MPT)",
  degree_level: "PG",
  duration: "2 Years",
  intake: "20 Seats"
});

// Default Admissions Data (Baseline Fallback)
export const DEFAULT_ADMISSIONS_DATA = {
  intro_title: "Admissions 2026–27",
  intro_lead: "Admissions to professional degree programs at Karmayogi College of Physiotherapy, Shelve, Pandharpur, are conducted in accordance with the regulations prescribed by the State Common Entrance Test Cell (State CET Cell), Government of Maharashtra, Directorate of Medical Education and Research (DMER), Mumbai, and Maharashtra University of Health Sciences (MUHS), Nashik.",

  // Course-specific admissions map (keyed by lowercase course code or id)
  courses_admissions: {
    bpt: defaultBptAdmission,
    mpt: defaultMptAdmission
  },

  // Legacy root keys for backwards compatibility with any unmigrated components
  process_intro: defaultBptAdmission.process_intro,
  process_steps: defaultBptAdmission.process_steps,
  eligibility_intro: defaultBptAdmission.eligibility_intro,
  eligibility_programs: [
    {
      degree: "Bachelor of Physiotherapy (BPT)",
      duration: "4.5 Years (including 6-month compulsory internship)",
      points: defaultBptAdmission.eligibility_points
    },
    {
      degree: "Master of Physiotherapy (MPT)",
      duration: "2 Years",
      points: defaultMptAdmission.eligibility_points
    }
  ],
  app_form_intro: defaultBptAdmission.app_form_intro,
  app_cap_title: defaultBptAdmission.app_cap_title,
  app_cap_points: defaultBptAdmission.app_cap_points,
  app_college_title: defaultBptAdmission.app_college_title,
  app_college_points: defaultBptAdmission.app_college_points,
  fees_intro: defaultBptAdmission.fees_intro,
  fees_table: defaultBptAdmission.fees_table,
  fees_notes: defaultBptAdmission.fees_notes,
  scholarships_intro: defaultBptAdmission.scholarships_intro,
  scholarships_list: defaultBptAdmission.scholarships_list,
  dates_intro: defaultBptAdmission.dates_intro,
  dates_list: defaultBptAdmission.dates_list,

  documents_intro: "Candidates must submit original certificates along with 3 sets of self-attested photocopies at the time of admission:",
  documents_categories: [
    {
      title: "Academic & Entrance Records",
      items: [
        "NEET-UG Admit Card & Scorecard",
        "State CET Cell Online Application Form & Registration Receipt",
        "Provisional Seat Allotment Letter",
        "SSC (10th) Passing Certificate & Statement of Marks",
        "HSC (12th) Passing Certificate & Statement of Marks"
      ]
    },
    {
      title: "Identity & Domicile Documents",
      items: [
        "Nationality Certificate & Domicile Certificate of Maharashtra",
        "College Leaving Certificate / Transfer Certificate (TC)",
        "Migration Certificate (if qualifying examination is outside Maharashtra State Board)",
        "Aadhaar Card Copy",
        "Affidavit / Gap Certificate on stamp paper (if applicable)"
      ]
    },
    {
      title: "Caste, Category & Medical",
      items: [
        "Caste Certificate (for Reserved category candidates)",
        "Caste Validity Certificate (Mandatory for SC/ST/VJ/NT/OBC)",
        "Non-Creamy Layer Certificate (valid up to 31st March of current financial year for VJNT/SBC/OBC)",
        "EWS Certificate / PwD Certificate (if claiming quota)",
        "Medical Fitness Certificate in prescribed format (Annexure-H)",
        "4 recent passport-size color photographs"
      ]
    }
  ],

  helpdesk_phone: "+91 02186 272345, +91 94235 34567",
  helpdesk_email: "info@karmayogiphysiotherapy.edu.in",
  helpdesk_hours: "Monday – Saturday, 9:00 AM to 5:00 PM",
  helpdesk_address: "Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS) - 413304."
};

// ========================================================
// DEFAULT RESEARCH & DEVELOPMENT DATA (10 SUBMENUS)
// ========================================================
export const DEFAULT_RESEARCH_DATA = {
  overview: {
    intro_title: "Research & Development (R&D)",
    intro_lead: "Karmayogi Institute of Physiotherapy actively promotes evidence-based clinical investigation, rehabilitative innovation, and interdisciplinary research. Operating under the research protocols of Maharashtra University of Health Sciences (MUHS) and the ethical frameworks of the Indian Council of Medical Research (ICMR), our institution bridges academic clinical therapy and translational rehabilitation science.",
    vision: "To be recognized as a leading center of excellence for clinical physiotherapy research and rehabilitation technology, translating scientific insights into accessible, high-impact patient care.",
    mission: "Cultivate an inquisitive, ethical research environment among faculty and students; facilitate funded translational clinical projects; and pioneer indigenous therapeutic solutions for community and musculoskeletal rehabilitation.",
    iec_statement: "All clinical trials and human investigations require mandatory review and written approval by the Institutional Ethics Committee (IEC). Ethical clearances, informed consent protocols, and participant safety follow national biomedical standards.",
    stats: [
      { label: "Active Research Projects", value: "18+" },
      { label: "Peer-Reviewed Publications", value: "48+" },
      { label: "Patents Filed / Granted", value: "05" },
      { label: "Approved Research Guides", value: "08" },
      { label: "Sanctioned Research Grants", value: "₹24.5 L" }
    ],
    thrust_areas: [
      "Musculoskeletal Biomechanics & Postural Ergonomics",
      "Neuro-Rehabilitation & Motor Recovery Pathways",
      "Cardiorespiratory Fitness & Critical Care Rehabilitation",
      "Sports Kinesiology & Injury Prevention",
      "Geriatric Balance & Fall Risk Mitigation",
      "Community & Occupational Health in Rural Populations"
    ]
  },

  centers: [
    {
      id: 1,
      name: "Center for Biomechanics & Motion Analysis",
      scope: "Quantitative 3D motion tracking, force plate ground reaction analysis, kinematic modeling, and dynamic surface electromyography (sEMG) for pathological gait and sports movement.",
      lead_faculty: "Dr. P. Deshmukh, MPT (Musculoskeletal)",
      equipment: "3D Optical Motion Capture System, Dual Ground Reaction Force Plates, 16-Channel Wireless sEMG Unit"
    },
    {
      id: 2,
      name: "Advanced Neuro-Rehabilitation & Motor Recovery Lab",
      scope: "Investigating neuroplasticity protocols, body-weight supported treadmill training, robotic balance perturbation, and virtual reality biofeedback in stroke, spinal cord injury, and Parkinson's rehabilitation.",
      lead_faculty: "Dr. S. Patil, MPT (Neurosciences)",
      equipment: "Dynamic Balance Master Platform, Immersive VR Rehabilitation Suite, Transcranial Electrical Neuromodulation"
    },
    {
      id: 3,
      name: "Cardiopulmonary Assessment & Exercise Physiology Unit",
      scope: "Cardiorespiratory fitness evaluation, pulmonary function testing, automated spirometry, and submaximal exercise tolerance testing in post-CABG and COPD clinical cohorts.",
      lead_faculty: "Dr. A. Kulkarni, MPT (Cardiovascular & Respiratory)",
      equipment: "Computerized Diagnostic Spirometer, Cosmed Ergometer, 12-Lead Wireless Stress ECG Monitor"
    },
    {
      id: 4,
      name: "Ergonomics & Community Health Research Unit",
      scope: "Work-related musculoskeletal disorder (WMSD) screening, postural load analysis, occupational rehabilitation, and rural health surveys across agricultural workers in Solapur district.",
      lead_faculty: "Dr. M. Shinde, MPT (Community Physiotherapy)",
      equipment: "Digital Inclinometers, Hand Grip & Pinch Dynamometers, REBA/RULA Occupational Assessment Software"
    }
  ],

  projects: [
    {
      id: 1,
      title: "Efficacy of Proprioceptive Neuromuscular Training on Dynamic Balance and Fall Risk in Rural Elderly Cohort",
      investigators: "Dr. P. Deshmukh (PI), Dr. A. Joshi (Co-PI)",
      dept: "Musculoskeletal Physiotherapy",
      duration: "2023 - 2025",
      status: "Ongoing",
      summary: "Evaluating balance perturbation and dual-task neuromuscular training protocols in 120 rural senior citizens in Pandharpur taluka."
    },
    {
      id: 2,
      title: "Comparative Evaluation of Virtual Reality-Assisted vs. Conventional Task-Specific Training in Post-Stroke Upper Limb Function",
      investigators: "Dr. S. Patil (PI), Dr. N. More (Co-PI)",
      dept: "Neuro-Physiotherapy",
      duration: "2022 - 2024",
      status: "Completed",
      summary: "Assessed Fugl-Meyer scores and action research arm tests; showed statistically significant acceleration in functional grasp recovery."
    },
    {
      id: 3,
      title: "Impact of Inspiratory Muscle Training on Functional Exercise Capacity in Post-ICU Convalescent Patients",
      investigators: "Dr. A. Kulkarni (PI)",
      dept: "Cardiorespiratory Physiotherapy",
      duration: "2023 - 2024",
      status: "Ongoing",
      summary: "Targeting diaphragm conditioning and 6-minute walk distance enhancement in patients recovering from critical respiratory distress."
    },
    {
      id: 4,
      title: "Prevalence of Work-Related Musculoskeletal Disorders and Ergonomic Assessment among Handloom and Powerloom Workers",
      investigators: "Dr. M. Shinde (PI)",
      dept: "Community Physiotherapy",
      duration: "2023 - 2025",
      status: "Ongoing",
      summary: "Field-based occupational posture analysis using REBA and RULA frameworks to design low-cost ergonomic workstations."
    }
  ],

  publications: [
    {
      id: 1,
      title: "Immediate effects of Maitland mobilization versus Mulligan's mobilization with movement in chronic mechanical neck pain: A randomized clinical study",
      authors: "Deshmukh P., Shinde M., Kulkarni A.",
      journal: "International Journal of Health & Rehabilitation Sciences",
      year: "2024",
      volume: "Vol. 13, Issue 2, pp. 45-52",
      indexing: "Scopus / UGC CARE",
      doi: "10.15520/ijhrs.v13i2.812"
    },
    {
      id: 2,
      title: "Effectiveness of high-intensity interval training vs. moderate-intensity continuous training on aerobic capacity in Phase-II cardiac rehabilitation",
      authors: "Kulkarni A., Patil S.",
      journal: "Journal of Clinical & Diagnostic Research",
      year: "2023",
      volume: "Vol. 17, Issue 8, pp. KC01-KC06",
      indexing: "PubMed / Web of Science",
      doi: "10.7860/JCDR/2023/58914.16789"
    },
    {
      id: 3,
      title: "Predictors of functional ambulation recovery following early rehabilitation in acute ischaemic stroke: A prospective hospital registry study",
      authors: "Patil S., Joshi A., More N.",
      journal: "Indian Journal of Physiotherapy and Occupational Therapy",
      year: "2023",
      volume: "Vol. 17, Issue 3, pp. 112-118",
      indexing: "UGC CARE",
      doi: "10.37506/ijpot.v17i3.19045"
    },
    {
      id: 4,
      title: "Ergonomic risk exposure and prevalence of musculoskeletal discomfort among agricultural farmers in Western Maharashtra",
      authors: "Shinde M., Deshmukh P.",
      journal: "Bulletin of Faculty of Physical Therapy",
      year: "2022",
      volume: "Vol. 27, Issue 1, Article 34",
      indexing: "Scopus / SpringerOpen",
      doi: "10.1186/s43161-022-00094-1"
    }
  ],

  patents: [
    {
      id: 1,
      title: "Ergonomic Dynamic Ankle-Foot Orthosis with Variable Resistance Dampener",
      app_no: "202321045812 A",
      status: "Published",
      filing_date: "14/08/2023",
      inventors: "Dr. P. Deshmukh, Dr. S. Patil",
      authority: "Indian Patent Office (IPO)",
      category: "Assistive Device Patent"
    },
    {
      id: 2,
      title: "Portable Multi-Axis Cervical Range of Motion Digital Inclinometer",
      app_no: "202221038901 A",
      status: "Published",
      filing_date: "22/06/2022",
      inventors: "Dr. M. Shinde, Dr. A. Kulkarni",
      authority: "Indian Patent Office (IPO)",
      category: "Diagnostic Innovation"
    },
    {
      id: 3,
      title: "Adjustable Postural Biofeedback Device for Pediatric Cerebral Palsy Sitting Alignment",
      app_no: "Design No. 389201-001",
      status: "Registered / Granted",
      filing_date: "05/11/2021",
      inventors: "Dr. S. Patil, Karmayogi Institute",
      authority: "Patent & Design Office, Govt. of India",
      category: "Design Registration"
    }
  ],

  scholars: [
    {
      id: 1,
      name: "Dr. Pooja S. Salunkhe",
      guide: "Dr. P. Deshmukh",
      topic: "Neuromuscular biomechanics of knee osteoarthritis and efficacy of kinetic chain stabilization protocols",
      dept: "Musculoskeletal Physiotherapy",
      reg_year: "2022",
      status: "Ph.D. Scholar (Pursuing)"
    },
    {
      id: 2,
      name: "Dr. Rohan M. Gaikwad",
      guide: "Dr. S. Patil",
      topic: "Task-oriented dual-task training on executive function and postural control in subacute stroke survivors",
      dept: "Neuro-Physiotherapy",
      reg_year: "2023",
      status: "Ph.D. Scholar (Pursuing)"
    },
    {
      id: 3,
      name: "Dr. Neha V. Joshi",
      guide: "Dr. A. Kulkarni",
      topic: "Comparative efficacy of inspiratory muscle training vs incentive spirometry in post-cardiac surgery recovery",
      dept: "Cardiorespiratory Physiotherapy",
      reg_year: "2023",
      status: "Postgraduate Fellow"
    },
    {
      id: 4,
      name: "Dr. Amit R. Bansode",
      guide: "Dr. M. Shinde",
      topic: "Ergonomic interventions and health literacy program in farm laborers suffering from chronic lower back syndromes",
      dept: "Community Physiotherapy",
      reg_year: "2024",
      status: "Ph.D. Scholar (Registered)"
    }
  ],

  funded_projects: [
    {
      id: 1,
      title: "Establishment of Advanced Motion Biomechanics and Clinical Movement Analysis Center for Rural Athletes and Patients",
      agency: "MUHS Research Grant & Institutional Development Scheme",
      pi: "Dr. P. Deshmukh",
      amount: "₹ 8,50,000",
      tenure: "2023 - 2025",
      status: "Sanctioned & Ongoing"
    },
    {
      id: 2,
      title: "Community-Based Stroke Early Rehabilitation & Caregiver Training Model in Rural Maharashtra",
      agency: "State Health Sciences Research Assistance Scheme",
      pi: "Dr. S. Patil",
      amount: "₹ 5,20,000",
      tenure: "2022 - 2024",
      status: "Completed"
    },
    {
      id: 3,
      title: "Workplace Ergonomic Risk Mitigation and Musculoskeletal Health Program for Powerloom Industrial Workers",
      agency: "Institutional Research Seed Grant",
      pi: "Dr. M. Shinde",
      amount: "₹ 3,80,000",
      tenure: "2023 - 2024",
      status: "Ongoing"
    },
    {
      id: 4,
      title: "Pulmonary Rehabilitation Outcomes in Post-Infectious Chronic Lung Disease in Semi-Urban Populations",
      agency: "Karmayogi Trust Healthcare Research Fund",
      pi: "Dr. A. Kulkarni",
      amount: "₹ 4,00,000",
      tenure: "2024 - 2026",
      status: "Sanctioned & Initiated"
    }
  ],

  conferences: [
    {
      id: 1,
      title: "61st Annual National Conference of Indian Association of Physiotherapists (IAPCON)",
      paper_title: "Kinematic evaluation of gait asymmetry following total knee arthroplasty",
      presenter: "Dr. P. Deshmukh",
      date: "Jan 2024",
      venue: "Kolkata, India",
      type: "Oral Presentation"
    },
    {
      id: 2,
      title: "MUHS State Physiotherapy Research Colloquium",
      paper_title: "Correlation between trunk muscle endurance and dynamic balance in Parkinson's Disease",
      presenter: "Dr. S. Patil",
      date: "Oct 2023",
      venue: "Nashik, Maharashtra",
      type: "Keynote & Paper"
    },
    {
      id: 3,
      title: "International Conference on Cardiopulmonary Physical Therapy & Rehabilitation",
      paper_title: "Role of early bedside active cycling in preventing intensive care acquired weakness",
      presenter: "Dr. A. Kulkarni",
      date: "Mar 2023",
      venue: "New Delhi, India",
      type: "Poster Presentation"
    },
    {
      id: 4,
      title: "National Sports Physiotherapy Summit",
      paper_title: "Return-to-sport testing protocols post-ACL reconstruction: Clinical guidelines vs practical execution",
      presenter: "Dr. M. Shinde",
      date: "Dec 2023",
      venue: "Pune, Maharashtra",
      type: "Oral Presentation"
    }
  ],

  journals: {
    name: "Karmayogi Journal of Physiotherapy & Rehabilitation Sciences (KJPRS)",
    issn: "ISSN: 2582-9424 (Online - Approved Series)",
    frequency: "Bi-Annual (June & December Editions)",
    peer_review: "Double-blind peer-reviewed scientific medical publication",
    scope: "Welcoming original research papers, systematic reviews, randomized controlled trials, clinical case reports, and short communications spanning Musculoskeletal, Neurological, Cardiopulmonary, Sports, and Community Physiotherapy.",
    editorial_board: [
      { role: "Editor-in-Chief", name: "Dr. P. Deshmukh, Principal & Professor (Musculoskeletal)" },
      { role: "Associate Editor", name: "Dr. S. Patil, Professor (Neuro-Physiotherapy)" },
      { role: "Managing Editor", name: "Dr. A. Kulkarni, Associate Professor (Cardiopulmonary)" },
      { role: "Executive Member", name: "Dr. M. Shinde, Associate Professor (Community Physiotherapy)" },
      { role: "Advisory Panel", name: "Senior Clinical Specialists & MUHS Board of Studies Experts" }
    ],
    guidelines: "Manuscripts must strictly conform to ICMJE recommendations, include Institutional Ethics Committee (IEC) clearance references, and provide structured abstracts with clinical registration details.",
    submission_email: "research@karmayogi.org.in"
  },

  achievements: [
    {
      id: 1,
      title: "Best Scientific Paper Presentation Award",
      awardee: "Dr. P. Deshmukh",
      event: "60th National Conference of the Indian Association of Physiotherapists",
      year: "2023",
      details: "Awarded 1st Prize in Senior Musculoskeletal Research Category for work on biomechanical gait retraining."
    },
    {
      id: 2,
      title: "MUHS Young Researcher Appreciation Award",
      awardee: "Dr. S. Patil",
      event: "Maharashtra University of Health Sciences Annual Convocation",
      year: "2023",
      details: "Recognized for exceptional translational neuro-rehabilitation publications in indexed international journals."
    },
    {
      id: 3,
      title: "Best Clinical Innovation in Assistive Technology",
      awardee: "Faculty Research Cell, Karmayogi Institute",
      event: "State Healthcare Innovation Conclave",
      year: "2022",
      details: "Honored for indigenous low-cost portable cervical inclinometer design patent."
    },
    {
      id: 4,
      title: "International Travel Fellowship Grant",
      awardee: "Dr. A. Kulkarni",
      event: "World Physiotherapy Congress",
      year: "2023",
      details: "Awarded travel sponsorship for presenting research on pulmonary rehabilitation protocols in rural centers."
    }
  ]
};

// ========================================================
// DEFAULT COMMITTEES DATA (DYNAMIC STATUTORY & ACADEMIC COMMITTEES)
// ========================================================
export const DEFAULT_COMMITTEES_DATA = [
  {
    id: "anti-ragging",
    name: "Anti-Ragging Committee & Squad",
    designation: "Statutory Mandatory Body (UGC & MUHS Mandated)",
    responsibilities: "1. Enforce strict zero-tolerance anti-ragging measures on college campus, attached teaching hospital, and student hostels.\n2. Formulate and deploy surprise anti-ragging squad patrols during admission periods, canteen hours, and evening clinic shifts.\n3. Conduct mandatory orientation programs and collect anti-ragging undertakings from all newly enrolled students and parents.\n4. Promptly investigate any reported ragging or intimidation incidents in strict accordance with the Maharashtra Prohibition of Ragging Act, 1999 and UGC Anti-Ragging Regulations.",
    contact_details: "Convenor: Dr. P. Deshmukh (Principal) | Phone: +91 02186 272345 / +91 94220 12345 | Email: antiragging@karmayogi.org.in | 24x7 National Helpline: 1800-180-5522 | Office: Principal's Secretariat, Ground Floor",
    members: [
      { name: "Dr. P. Deshmukh", designation: "Principal & Professor", role: "Chairperson", contact: "principal@karmayogi.org.in" },
      { name: "Dr. S. Patil", designation: "Professor (Neurosciences)", role: "Member Secretary", contact: "+91 98221 44556" },
      { name: "Dr. A. Kulkarni", designation: "Associate Professor (Cardiopulmonary)", role: "Faculty Member", contact: "+91 97665 11223" },
      { name: "Dr. M. Shinde", designation: "Associate Professor (Community)", role: "Hostel Warden / Member", contact: "+91 98901 22334" },
      { name: "Adv. R. K. Joshi", designation: "Advocate, Pandharpur Bar", role: "Legal Expert Member", contact: "Pandharpur Civil Court" },
      { name: "Shri S. V. Gaikwad", designation: "Police Sub-Inspector", role: "Civil Police Administration", contact: "Pandharpur Rural Station" },
      { name: "Mr. Rohan Salunkhe", designation: "IV BPT Student", role: "Student Representative (Senior)", contact: "Student Council" },
      { name: "Ms. Snehal More", designation: "I BPT Student", role: "Student Representative (Fresher)", contact: "Class Representative" }
    ],
    documents: [
      { title: "Anti-Ragging Committee Notification & Office Order 2024-25", url: "#", date: "July 2024", type: "Office Order" },
      { title: "MUHS Anti-Ragging Directives & Undertaking Proforma", url: "#", date: "2024", type: "University Guidelines" }
    ]
  },
  {
    id: "icc",
    name: "Internal Complaints Committee (ICC) & Gender Sensitization Cell",
    designation: "Statutory Cell under POSH Act, 2013 & UGC Regulations",
    responsibilities: "1. Foster a secure, gender-equitable working and educational environment free from gender discrimination or sexual harassment.\n2. Facilitate confidential inquiry proceedings for grievances filed by female students, teaching faculty, or administrative staff.\n3. Conduct periodic legal literacy seminars, POSH awareness workshops, and self-defense training clinics.\n4. Recommend disciplinary and preventive actions to college administration within stipulated statutory timelines.",
    contact_details: "Presiding Officer: Dr. S. Patil | Phone: +91 02186 272346 | Email: icc@karmayogi.org.in | Office: College Council Room, First Floor",
    members: [
      { name: "Dr. S. Patil", designation: "Professor & HOD (Neurosciences)", role: "Presiding Officer", contact: "icc@karmayogi.org.in" },
      { name: "Dr. M. Shinde", designation: "Associate Professor (Community)", role: "Faculty Member", contact: "+91 98901 22334" },
      { name: "Mrs. V. R. Kulkarni", designation: "Office Superintendent", role: "Non-Teaching Staff Member", contact: "admin@karmayogi.org.in" },
      { name: "Mrs. Sunita Jadhav", designation: "Social Worker / NGO Representative", role: "External Member (NGO)", contact: "Solapur Mahila Vikas Kendra" },
      { name: "Ms. Pooja Kale", designation: "MPT Post-Graduate Scholar", role: "Student Representative", contact: "PG Scholar" }
    ],
    documents: [
      { title: "ICC Constitution Office Order 2024-25", url: "#", date: "June 2024", type: "Office Order" },
      { title: "Handbook on Sexual Harassment of Women at Workplace (POSH)", url: "#", date: "2023", type: "Policy Handbook" }
    ]
  },
  {
    id: "college-council",
    name: "College Council & Academic Advisory Board",
    designation: "Apex Academic & Administrative Advisory Body",
    responsibilities: "1. Supervise general academic administration, clinical postings, and university examination schedules.\n2. Review departmental teaching curricula, logbooks, continuous internal evaluations (CIE), and student attendance records.\n3. Formulate annual institutional budget priorities for lab modernization, library books, and research infrastructure.\n4. Coordinate with MUHS and DMER regarding academic approvals, faculty roasters, and college affiliations.",
    contact_details: "Chairman: Dr. P. Deshmukh | Phone: +91 02186 272345 | Email: council@karmayogi.org.in | Office: Board Room, 2nd Floor",
    members: [
      { name: "Dr. P. Deshmukh", designation: "Principal & Professor", role: "Chairperson", contact: "principal@karmayogi.org.in" },
      { name: "Dr. S. Patil", designation: "HOD, Neurosciences Physiotherapy", role: "Member Secretary", contact: "+91 98221 44556" },
      { name: "Dr. A. Kulkarni", designation: "HOD, Cardiopulmonary Physiotherapy", role: "Member", contact: "+91 97665 11223" },
      { name: "Dr. M. Shinde", designation: "HOD, Community Physiotherapy", role: "Member", contact: "+91 98901 22334" },
      { name: "Mr. B. T. Pawar", designation: "Registrar / Administrative Officer", role: "Administrative Member", contact: "registrar@karmayogi.org.in" }
    ],
    documents: [
      { title: "College Council Minutes of Meeting (Q1 2024-25)", url: "#", date: "August 2024", type: "Minutes of Meeting" },
      { title: "Academic Calendar & Council Guidelines 2024-25", url: "#", date: "June 2024", type: "Academic Policy" }
    ]
  },
  {
    id: "grievance",
    name: "Student Grievance Redressal Committee (SGRC)",
    designation: "Statutory Student Welfare Body (MUHS Regulated)",
    responsibilities: "1. Provide an accessible, transparent, and fair portal for redressing student academic, infrastructural, and campus grievances.\n2. Address concerns related to examination evaluations, hall tickets, hostel amenities, or library resources without prejudice.\n3. Maintain complete confidentiality and ensure resolution within 15 working days from formal submission.\n4. Recommend systemic improvements to college administration based on recurring grievance patterns.",
    contact_details: "Convenor: Dr. A. Kulkarni | Phone: +91 02186 272348 | Email: grievance@karmayogi.org.in | Drop-box: Outside Student Section, Ground Floor",
    members: [
      { name: "Dr. P. Deshmukh", designation: "Principal", role: "Ombudsman / Head", contact: "principal@karmayogi.org.in" },
      { name: "Dr. A. Kulkarni", designation: "Associate Professor", role: "Convenor", contact: "grievance@karmayogi.org.in" },
      { name: "Dr. S. Patil", designation: "Professor", role: "Faculty Member", contact: "+91 98221 44556" },
      { name: "Mr. Amit Shinde", designation: "General Secretary (Student Council)", role: "Special Invitee (Student)", contact: "Student Rep" }
    ],
    documents: [
      { title: "Student Grievance Redressal Mechanism & Policy", url: "#", date: "2024", type: "Institutional Policy" },
      { title: "Grievance Submission Form (PDF Format)", url: "#", date: "2024", type: "Proforma" }
    ]
  },
  {
    id: "ethics",
    name: "Institutional Ethics Committee (IEC)",
    designation: "Bio-Medical & Clinical Research Ethical Oversight Body",
    responsibilities: "1. Review all research projects, clinical trials, and postgraduate theses involving human participants.\n2. Ensure full compliance with ICMR ethical guidelines and MUHS scientific standards.\n3. Verify participant informed consent processes, confidentiality safeguards, and risk-benefit ratios.\n4. Issue formal IEC clearance certificates required for scientific publication and thesis submissions.",
    contact_details: "Member Secretary: Dr. S. Patil | Email: iec@karmayogi.org.in | Meeting Frequency: Quarterly / On-Demand | Office: Clinical Research Wing",
    members: [
      { name: "Dr. R. M. Chidgupkar", designation: "Senior Medical Specialist (MD)", role: "External Chairperson", contact: "External Expert" },
      { name: "Dr. S. Patil", designation: "Professor (Neurosciences)", role: "Member Secretary", contact: "iec@karmayogi.org.in" },
      { name: "Dr. P. Deshmukh", designation: "Principal & Professor", role: "Clinician Member", contact: "principal@karmayogi.org.in" },
      { name: "Dr. A. Kulkarni", designation: "Associate Professor", role: "Basic Medical Scientist", contact: "+91 97665 11223" },
      { name: "Adv. R. K. Joshi", designation: "Legal Expert", role: "Legal Member", contact: "Civil Bar" },
      { name: "Mrs. S. Jadhav", designation: "Social Scientist", role: "Lay Person / Community Rep", contact: "NGO" }
    ],
    documents: [
      { title: "IEC Standard Operating Procedures (SOP)", url: "#", date: "2024", type: "SOP Document" },
      { title: "Clinical Research Ethics Proposal Proforma (Annexure A)", url: "#", date: "2024", type: "Application Form" }
    ]
  },
  {
    id: "student-welfare",
    name: "Student Welfare, Mentorship & Guidance Committee",
    designation: "Student Mentorship & Psychosocial Support Cell",
    responsibilities: "1. Oversee faculty-to-student mentorship programs (1:15 mentor-mentee ratio).\n2. Coordinate psychiatric, psychological counseling, and stress-management clinics for exam preparedness.\n3. Administer government (MahaDBT) and trust scholarships for socio-economically disadvantaged students.\n4. Facilitate student co-curricular opportunities and hostel well-being.",
    contact_details: "Coordinator: Dr. M. Shinde | Phone: +91 02186 272349 | Email: mentorship@karmayogi.org.in | Office: Student Support Center, 1st Floor",
    members: [
      { name: "Dr. M. Shinde", designation: "Associate Professor", role: "Coordinator & Senior Mentor", contact: "+91 98901 22334" },
      { name: "Dr. A. Joshi", designation: "Assistant Professor", role: "Faculty Mentor", contact: "+91 94234 55667" },
      { name: "Dr. N. More", designation: "Assistant Professor", role: "Faculty Mentor", contact: "+91 98600 11223" },
      { name: "Mrs. Rekha Patil", designation: "Professional Clinical Psychologist", role: "Consultant Counselor", contact: "By Appointment" }
    ],
    documents: [
      { title: "Mentor-Mentee Framework & Student Handbook 2024-25", url: "#", date: "2024", type: "Guidelines" }
    ]
  },
  {
    id: "library",
    name: "Library & Learning Resource Committee",
    designation: "Institutional Learning Infrastructure Committee",
    responsibilities: "1. Plan the annual acquisition of medical & physiotherapy textbooks, reference treatises, and e-journal subscriptions.\n2. Ensure digital library facilities, MUHS Digital Library Consortium access, and remote database connectivity.\n3. Formulate library borrowing rules, book bank schemes for reserved category students, and reading room hours.\n4. Conduct user-satisfaction audits and recommend modern ergonomic reading room enhancements.",
    contact_details: "Convener: Librarian / Dr. A. Kulkarni | Phone: +91 02186 272340 | Email: library@karmayogi.org.in | Central Library, 2nd Floor",
    members: [
      { name: "Dr. P. Deshmukh", designation: "Principal", role: "Chairman", contact: "principal@karmayogi.org.in" },
      { name: "Mr. K. S. Shinde", designation: "Chief Librarian (M.Lib.Sc)", role: "Member Secretary", contact: "library@karmayogi.org.in" },
      { name: "Dr. A. Kulkarni", designation: "Associate Professor", role: "Faculty Member", contact: "+91 97665 11223" },
      { name: "Dr. S. Patil", designation: "Professor", role: "Faculty Member", contact: "+91 98221 44556" },
      { name: "Mr. Pranav Mane", designation: "III BPT Student", role: "Student Member", contact: "Library Representative" }
    ],
    documents: [
      { title: "Central Library Rules & Book Bank Policy", url: "#", date: "2024", type: "Library Policy" }
    ]
  }
];

// ========================================================
// DEFAULT TRAINING & PLACEMENT DATA (8 SUBMENUS)
// ========================================================
export const DEFAULT_PLACEMENT_DATA = {
  cell_info: {
    intro_title: "Connecting Talent with Healthcare Leaders",
    intro_lead: "Our active Training and Placement Cell conducts mock clinical interviews, bedside rehabilitation workshops, resume building sessions, and on-campus recruitment drives with Maharashtra's and India's top hospitals and healthcare networks.",
    vision: "To be a leader in clinical physiotherapy placements by nurturing compassionate, evidence-based physical therapists who deliver world-class rehabilitation across healthcare networks globally.",
    mission: "Facilitate seamless transition from academic learning to professional clinical practice through structured pre-placement clinical postings, soft skill seminars, hospital partnerships, and continuous career guidance.",
    top_stats: [
      { label: "Highest Package", value: "₹ 8.40 LPA" },
      { label: "Average Package", value: "₹ 4.20 LPA" },
      { label: "Hospital & Recruiter Partners", value: "45+" },
      { label: "Clinical Placement Support", value: "100%" }
    ],
    key_highlights: [
      { label: "Placement & Clinical Postings Track Record", value: "92%+" },
      { label: "Hospital & Healthcare Recruiter Partners", value: "45+" },
      { label: "Highest Package Offered", value: "₹ 8.40 LPA" },
      { label: "Average Package Range", value: "₹ 4.20 LPA" },
      { label: "Compulsory Rotatory Internship", value: "6 Months" }
    ]
  },

  officer: {
    name: "Dr. Nitin More",
    designation: "Training & Placement Officer (TPO) & Associate Professor",
    designation_short: "Training and Placement Officer (Ph.D)",
    qualification: "MPT (Musculoskeletal Sciences), Ph.D. Scholar",
    experience: "12+ Years in Clinical Physiotherapy & Academic Placement Coordination",
    photo_url: "",
    message: "It gives me immense pleasure to welcome you to the Training and Placement Cell of Karmayogi College of Physiotherapy, Pandharpur. Our primary objective is to bridge the gap between academic learning and professional requirements by providing students with meaningful opportunities for career development. The Training and Placement Cell works continuously to facilitate campus recruitment drives, hospital bedside postings, rotatory clinical internships, skill-development programmes, career guidance, aptitude training, interview preparation, and industry-academia interactions. We strive to connect our students with reputed multi-specialty hospitals and healthcare organizations while helping them identify career opportunities aligned with their knowledge, skills, and aspirations.\n\nOur dedicated efforts focus not only on securing employment but also on developing clinical competence, bedside communication skills, professional medical ethics, leadership qualities, and confidence among students. We encourage students to actively participate in training programmes, clinical interactions, seminars, workshops, and placement activities to become industry-ready healthcare professionals.\n\nI sincerely appreciate the cooperation of our management, Principal, faculty members, hospital partners, recruiters, alumni, and students in making our placement initiatives successful. Together, we are committed to creating a strong platform where every student can transform their knowledge into professional excellence and career opportunities.",
    quote: "Empowering Healthcare Leaders Today for a Successful Physiotherapy Career Tomorrow.",
    email: "placement@karmayogi.org.in",
    phone: "+91 02186 272347 / +91 98600 11223",
    office: "T&P Cell, Room No. 104, Administrative Wing, 1st Floor",
    hours: "Monday to Saturday: 9:30 AM – 5:00 PM",
    linkedin: "https://www.linkedin.com"
  },

  recruiter_network: [
    { name: "Apollo Hospitals", category: "Multi-Specialty Network", initials: "AH" },
    { name: "Fortis Healthcare", category: "Super-Specialty Tertiary", initials: "FH" },
    { name: "Manipal Hospitals", category: "Tertiary Care & Rehab", initials: "MH" },
    { name: "Max Healthcare", category: "Multi-Specialty Chain", initials: "MX" },
    { name: "Ruby Hall Clinic", category: "Critical Care & Neuro", initials: "RH" },
    { name: "Sancheti Hospital", category: "Orthopaedics & Joint Care", initials: "SH" },
    { name: "Sahyadri Hospitals", category: "Trauma & Neurosciences", initials: "SY" },
    { name: "DY Patil Hospital", category: "Medical Foundation", initials: "DY" },
    { name: "KEM Hospital", category: "Teaching & Tertiary Care", initials: "KM" },
    { name: "Jupiter Hospital", category: "Super-Specialty", initials: "JH" },
    { name: "Nanavati Hospital", category: "Super Speciality", initials: "NH" },
    { name: "Narayana Health", category: "Cardiac & General Care", initials: "NHD" },
    { name: "Aster DM Healthcare", category: "Healthcare Network", initials: "AST" },
    { name: "Columbia Asia", category: "Multi-Specialty", initials: "CA" },
    { name: "Kokilaben Hospital", category: "Center for Bone & Joint", initials: "KDA" },
    { name: "Care Hospitals", category: "Tertiary Care", initials: "CH" },
    { name: "Qi Spine Clinics", category: "Spine Rehabilitation", initials: "QS" },
    { name: "Portea Medical", category: "Home Healthcare", initials: "PM" },
    { name: "HCAH Healthcare", category: "Long-Term Rehabilitation", initials: "HCH" },
    { name: "Ashwini Rugnalaya", category: "Solapur Tertiary Care", initials: "ASH" }
  ],

  yearly_placements: [
    {
      year: "2024-25",
      eligible: 60,
      placed: 53,
      ratio: "88.3%",
      ratioNum: 88.3,
      highest: "₹ 8.40 LPA",
      average: "₹ 4.20 LPA",
      partners: ["Apollo Hospitals", "Fortis Healthcare", "Sancheti Orthopaedic", "Ruby Hall Clinic", "Qi Spine"]
    },
    {
      year: "2023-24",
      eligible: 60,
      placed: 55,
      ratio: "91.6%",
      ratioNum: 91.6,
      highest: "₹ 7.50 LPA",
      average: "₹ 3.90 LPA",
      partners: ["Manipal Hospitals", "Sahyadri Hospitals", "DY Patil Hospital", "HCAH", "Portea Medical"]
    },
    {
      year: "2022-23",
      eligible: 50,
      placed: 44,
      ratio: "88.0%",
      ratioNum: 88.0,
      highest: "₹ 6.80 LPA",
      average: "₹ 3.60 LPA",
      partners: ["Jupiter Hospital", "KEM Hospital", "Nanavati Super Speciality", "Sancheti"]
    },
    {
      year: "2021-22",
      eligible: 50,
      placed: 43,
      ratio: "86.0%",
      ratioNum: 86.0,
      highest: "₹ 6.00 LPA",
      average: "₹ 3.40 LPA",
      partners: ["Apollo Hospitals", "Ruby Hall Clinic", "Aster DM Healthcare", "Ashwini Rugnalaya"]
    }
  ],

  coursewise_outcomes: {
    bpt: {
      program: "B.P.T (Bachelor of Physiotherapy)",
      duration: "4.5 Years Degree (Incl. 6 Months Internship)",
      level: "Undergraduate",
      placed_pct: 76,
      higher_studies_pct: 18,
      private_practice_pct: 6,
      note: "100% Productive Track"
    },
    mpt: {
      program: "M.P.T (Master of Physiotherapy)",
      duration: "2 Years Specialized Clinical Masters",
      level: "Postgraduate",
      placed_pct: 82,
      higher_studies_pct: 12,
      private_practice_pct: 6,
      note: "100% Productive Track"
    }
  },

  prep_program: [
    {
      step: "01",
      title: "Clinical Assessment",
      desc: "Evaluating clinical acumen, physical therapy diagnostic foundations, and patient bedside communication to identify key focus areas."
    },
    {
      step: "02",
      title: "Specialized Workshops",
      desc: "Pre-placement mock tests, ICU mobility simulations, kinesio-taping certifications, and profile enhancement matching real hospital parameters."
    },
    {
      step: "03",
      title: "Guest Seminars",
      desc: "Interactive CME sessions led by hospital medical superintendents, chief physiotherapists, and successful clinical alumni."
    },
    {
      step: "04",
      title: "Recruitment Drives",
      desc: "Direct on-campus recruitment drives, multi-center pool placement interviews, and final clinical offer letter confirmation."
    }
  ],

  testimonials: [
    {
      name: "Dr. Priya Deshmukh",
      program: "B.P.T",
      batch: "Batch 2023-24",
      packageAmt: "₹ 8.40 LPA",
      company: "Apollo Super-Specialty Hospitals",
      designation: "Clinical Musculoskeletal Specialist",
      location: "Pune, Maharashtra"
    },
    {
      name: "Dr. Rohan Kulkarni",
      program: "B.P.T",
      batch: "Batch 2023-24",
      packageAmt: "₹ 6.80 LPA",
      company: "Sancheti Orthopaedic & Rehabilitation",
      designation: "Sports Rehab & Post-Op Physical Therapist",
      location: "Pune, Maharashtra"
    },
    {
      name: "Dr. Sneha Jadhav",
      program: "B.P.T",
      batch: "Batch 2022-23",
      packageAmt: "₹ 5.50 LPA",
      company: "Ruby Hall Clinic Critical Care",
      designation: "ICU & Cardiopulmonary Physiotherapist",
      location: "Pune, Maharashtra"
    },
    {
      name: "Dr. Amit Shinde",
      program: "B.P.T",
      batch: "Batch 2023-24",
      packageAmt: "₹ 5.20 LPA",
      company: "Qi Spine Advanced Rehabilitation",
      designation: "Spine & Postural Consultant",
      location: "Mumbai, Maharashtra"
    },
    {
      name: "Dr. Pooja Patil",
      program: "B.P.T",
      batch: "Batch 2022-23",
      packageAmt: "₹ 4.80 LPA",
      company: "Sahyadri Super Speciality Hospital",
      designation: "Neurological Physiotherapist",
      location: "Western Maharashtra"
    },
    {
      name: "Dr. Rahul Bhosale",
      program: "B.P.T",
      batch: "Batch 2021-22",
      packageAmt: "₹ 4.50 LPA",
      company: "HealthCare at Home (HCAH)",
      designation: "Clinical Home Care Lead",
      location: "Solapur / Pandharpur"
    },
    {
      name: "Dr. Aarti More",
      program: "M.P.T",
      batch: "Batch 2023-24",
      packageAmt: "₹ 7.20 LPA",
      company: "Manipal Comprehensive Rehab Center",
      designation: "Senior Neuro Physiotherapist",
      location: "Bengaluru, Karnataka"
    },
    {
      name: "Dr. Vishal Sawant",
      program: "M.P.T",
      batch: "Batch 2022-23",
      packageAmt: "₹ 6.50 LPA",
      company: "DY Patil Hospital & Research Institute",
      designation: "Assistant Professor & Clinical Lead",
      location: "Kolhapur, Maharashtra"
    }
  ],

  // Legacy mappings for backwards compatibility
  process: [
    { step: "01", title: "Clinical Assessment", desc: "Evaluating clinical acumen, physical therapy diagnostic foundations, and patient bedside communication." },
    { step: "02", title: "Specialized Workshops", desc: "Pre-placement mock tests, ICU mobility simulations, and kinesio-taping certifications." },
    { step: "03", title: "Guest Seminars", desc: "Interactive CME sessions led by hospital medical superintendents and chief physiotherapists." },
    { step: "04", title: "Recruitment Drives", desc: "Direct on-campus recruitment drives, pool placement interviews, and clinical offer letter confirmation." }
  ],
  recruiters: [
    { name: "Apollo Hospitals", category: "Multi-Specialty Network", location: "Pan-India" },
    { name: "Fortis Healthcare", category: "Super-Specialty Tertiary", location: "Mumbai / Pune / NCR" },
    { name: "Manipal Hospitals", category: "Tertiary Care & Rehab", location: "Bangalore / Pune" },
    { name: "Sancheti Hospital", category: "Orthopaedics & Joint Care", location: "Pune" },
    { name: "Ruby Hall Clinic", category: "Critical Care & Neuro", location: "Pune" }
  ],
  statistics: [
    { year: "2024 - 2025", total_students: 60, placed: 53, higher_studies: 5, success_rate: "88.3%" },
    { year: "2023 - 2024", total_students: 60, placed: 55, higher_studies: 4, success_rate: "91.6%" },
    { year: "2022 - 2023", total_students: 50, placed: 44, higher_studies: 4, success_rate: "88.0%" },
    { year: "2021 - 2022", total_students: 50, placed: 43, higher_studies: 5, success_rate: "86.0%" }
  ],
  highest_package: {
    amount: "₹ 8.40 LPA",
    role: "Clinical Musculoskeletal Specialist",
    description: "Awarded to graduating physiotherapy candidates securing specialized clinical and sports rehabilitation roles.",
    records: [
      { year: "2024 - 2025", amount: "₹ 8.40 LPA", company: "Apollo Super-Specialty Hospitals", role: "Clinical Musculoskeletal Specialist" },
      { year: "2023 - 2024", amount: "₹ 7.50 LPA", company: "Super-Specialty Spine & Sports Rehabilitation Network", role: "Clinical Specialist Associate" },
      { year: "2022 - 2023", amount: "₹ 6.80 LPA", company: "Multi-Specialty Corporate Hospital Group", role: "Intensive Care Physiotherapist" }
    ]
  },
  average_package: {
    overall_average: "₹ 4.20 LPA",
    median_package: "₹ 3.90 LPA",
    fresher_range: "₹ 3.40 LPA – ₹ 5.40 LPA",
    description: "Reflects the average annual remuneration offered across clinical hospital postings and institutional partnerships.",
    breakdown: [
      { domain: "Multi-Specialty Hospital Physiotherapist", range: "₹ 3.60 – 4.80 LPA" },
      { domain: "Sports & Athletic Rehabilitation Specialist", range: "₹ 4.50 – 6.50 LPA" },
      { domain: "Neuro-Pediatric Rehabilitation Clinician", range: "₹ 3.80 – 5.20 LPA" }
    ]
  },
  recruiter_logos: [
    { name: "Apollo Hospitals", category: "Hospital Network", logo_url: "" },
    { name: "Fortis Healthcare", category: "Tertiary Care", logo_url: "" },
    { name: "Manipal Hospitals", category: "Healthcare Chain", logo_url: "" },
    { name: "Sahyadri Hospitals", category: "Neuro & Trauma", logo_url: "" },
    { name: "Ruby Hall Clinic", category: "Multi-Specialty", logo_url: "" },
    { name: "Sancheti Hospital", category: "Orthopaedics", logo_url: "" }
  ]
};

// ========================================================
// DEFAULT ACADEMICS DATASET (7 Submenus)
// ========================================================
export const DEFAULT_ACADEMICS_DATA = {
  overview: {
    title: "Academic Programs & Curriculum Administration",
    lead: "Comprehensive academic calendars, weekly didactic and clinical timetables, statutory examination ordinances, university results verification, institutional policies, and student conduct guidelines governed in affiliation with Maharashtra University of Health Sciences (MUHS), Nashik.",
    session_year: "Academic Year 2024 - 2025",
    affiliation: "Affiliated to MUHS, Nashik | Approved by Govt. of Maharashtra & DMER Mumbai",
    highlights: [
      { value: "4.5 Yrs", label: "BPT Degree (Incl. 6 Mos Rotatory Internship)" },
      { value: "100%", label: "MUHS Prescribed Curriculum Compliance" },
      { value: "75% / 80%", label: "Mandatory Attendance (Theory / Clinical)" },
      { value: "1200+ Hrs", label: "Hospital Bedside Clinical Postings" }
    ]
  },

  // 1. Subjects (Curriculum)
  subjects: {
    title: "BPT Curriculum & Subjects",
    lead: "Complete 4-Year Bachelor of Physiotherapy didactic and clinical subjects catalogue prescribed under Maharashtra University of Health Sciences (MUHS), Nashik.",
    years: BPT_YEARS,
    list: BPT_SUBJECTS
  },

  // 2. Academic Calendar
  calendar: {
    title: "Academic Calendar",
    lead: "Official institutional schedule specifying term commencement, clinical postings, continuous sessional evaluations, vacation recesses, and MUHS university examinations.",
    current_year: "Academic Session 2024 - 2025",
    pdf_url: "",
    events: [
      { date: "01 Aug 2024", activity: "Commencement of Academic Term - Odd Semesters (II, III & IV BPT)", batch: "II, III, IV BPT", category: "Term Start" },
      { date: "16 Sep 2024", activity: "Orientation Program & Induction for Fresh Batch (I BPT)", batch: "I BPT", category: "Induction" },
      { date: "14 Oct - 19 Oct 2024", activity: "First Periodic Internal Sessional Assessment (Theory & Practical)", batch: "All Batches", category: "Assessment" },
      { date: "28 Oct - 09 Nov 2024", activity: "Diwali Vacation & Mid-Term Recess", batch: "All Batches", category: "Vacation" },
      { date: "16 Dec - 21 Dec 2024", activity: "Second Sessional Assessment & Clinical Logbook Review", batch: "II, III, IV BPT", category: "Assessment" },
      { date: "06 Jan - 18 Jan 2025", activity: "MUHS Winter University Practical & Theory Examinations", batch: "Eligible Batches", category: "University Exam" },
      { date: "27 Jan 2025", activity: "Commencement of Academic Term - Even Semesters", batch: "All Batches", category: "Term Start" },
      { date: "17 Mar - 22 Mar 2025", activity: "Preliminary / Pre-University Examination (Theory & Practical)", batch: "All Batches", category: "Prelim Exam" },
      { date: "15 Apr - 30 May 2025", activity: "MUHS Summer University Theory & Practical Examinations", batch: "All Batches", category: "University Exam" },
      { date: "01 Jun - 15 Jul 2025", activity: "Summer Clinical Rotations & Preparatory Term Break", batch: "All Batches", category: "Clinical Vacation" }
    ]
  },

  // 2. Timetable
  timetable: {
    title: "Timetable & Clinical Rosters",
    lead: "Weekly operational schedules coordinating classroom lectures, biomechanics laboratory sessions, and multi-specialty hospital bedside postings.",
    note: "Students must report punctually in prescribed clinical uniforms with stethoscopes, reflex hammers, and validated logbooks during all clinical posting hours.",
    years: [
      {
        year_name: "I BPT (First Year)",
        timing: "08:30 AM - 04:30 PM",
        theory_subjects: "Human Anatomy, Human Physiology, Biochemistry, Fundamental of Exercise Therapy & Electrotherapy",
        clinical_focus: "Clinical Observation, Fundamental Kinesiology & Biomechanics Lab",
        pdf_url: ""
      },
      {
        year_name: "II BPT (Second Year)",
        timing: "08:30 AM - 04:30 PM",
        theory_subjects: "Pathology, Microbiology, Pharmacology, Exercise Therapy, Electrotherapy",
        clinical_focus: "OPD Patient Evaluation, Electrotherapy Modality Application & Exercise Lab",
        pdf_url: ""
      },
      {
        year_name: "III BPT (Third Year)",
        timing: "08:30 AM - 04:30 PM",
        theory_subjects: "Surgery, Orthopaedics, Medicine, Paediatrics, Community Health & Sociology",
        clinical_focus: "Orthopaedic In-patient Wards, Surgical ICU, Neurological OPD & Trauma Postings",
        pdf_url: ""
      },
      {
        year_name: "IV BPT (Final Year)",
        timing: "08:30 AM - 04:30 PM",
        theory_subjects: "Musculoskeletal PT, Neuro PT, Cardio-Respiratory PT, Community PT, Bioengineering & Ethics",
        clinical_focus: "ICU Management, Cardiopulmonary Rehab, Neuro-rehab OPD & Community Camps",
        pdf_url: ""
      }
    ],
    schedule_rows: [
      { day: "Monday", time: "08:30 AM - 12:30 PM", slot1: "Hospital Clinical Postings (Rotational Wards)", slot2: "Didactic Lectures (Major Medical Specialties)", slot3: "Practical / Lab Demonstration" },
      { day: "Tuesday", time: "08:30 AM - 12:30 PM", slot1: "Hospital Clinical Postings (Rotational Wards)", slot2: "Physiotherapy Core Theory", slot3: "Hands-on Clinical Skill Training" },
      { day: "Wednesday", time: "08:30 AM - 12:30 PM", slot1: "Hospital Clinical Postings (Rotational Wards)", slot2: "Didactic Lectures (Pathology / Medicine)", slot3: "Case Presentations & Seminar" },
      { day: "Thursday", time: "08:30 AM - 12:30 PM", slot1: "Hospital Clinical Postings (Rotational Wards)", slot2: "Physiotherapy Core Theory", slot3: "Remedial Coaching / Mentorship" },
      { day: "Friday", time: "08:30 AM - 12:30 PM", slot1: "Hospital Clinical Postings (Rotational Wards)", slot2: "Applied Biomechanics & Research", slot3: "Practical Examination Practice" },
      { day: "Saturday", time: "08:30 AM - 01:30 PM", slot1: "Specialized OPD Postings & Community Outreach", slot2: "Journal Club / Guest Lectures", slot3: "Library & Self-Study Hours" }
    ]
  },

  // 3. Examination
  examination: {
    title: "Examination Cell & Evaluation Framework",
    lead: "Statutory assessment ordinances prescribed by Maharashtra University of Health Sciences (MUHS), Nashik ensuring clinical competence, objectivity, and academic integrity.",
    attendance_rules: {
      theory_min: "75%",
      practical_min: "80%",
      clinical_min: "85%",
      note: "Candidate failing to fulfill required minimum attendance percentage in theory or practicals shall not be eligible to appear for MUHS University Examinations under any circumstances as per University Ordinance."
    },
    weightage: [
      { component: "Continuous Internal Assessment (CIA)", weight: "20%", description: "Derived from periodic terminal sessional exams, day-to-day practical performance, clinical case presentations, and discipline." },
      { component: "MUHS University Theory Examination", weight: "50%", description: "Centrally administered descriptive and MCQ examination conducted by MUHS at appointed regional examination centres." },
      { component: "MUHS University Practical & Clinical Viva", weight: "30%", description: "Evaluation by one internal and one external university-appointed examiner on real patients, objective viva, and logbook viva." }
    ],
    passing_criteria: "A candidate must secure a minimum of 50% marks in Theory (University Exam + Internal) and 50% marks in Practical/Clinical examination separately to be declared successful.",
    notices: [
      { title: "Notification for MUHS Winter Examination Form Submission", date: "15 Oct 2024", batch: "II, III & IV BPT", file_url: "" },
      { title: "Schedule for Second Internal Sessional Theory & Practical Exams", date: "02 Dec 2024", batch: "All Batches", file_url: "" },
      { title: "Standard Operating Procedure for Clinical Case Logbook Submission", date: "10 Jan 2025", batch: "IV BPT & Interns", file_url: "" },
      { title: "Preliminary Examination Time Table - Summer Academic Session", date: "25 Feb 2025", batch: "All Batches", file_url: "" }
    ]
  },

  // 4. Results
  results: {
    title: "University Examination Results",
    lead: "Official university performance statistics and verification guidelines for students of Karmayogi Institute of Physiotherapy affiliated with MUHS, Nashik.",
    portal_url: "https://www.muhs.ac.in",
    portal_notice: "MUHS publishes official individual student grade sheets directly on the university results portal. Consolidated college statement of marks are received by the college Examination Cell within 15 days of online declaration.",
    records: [
      { year: "2023 - 2024", exam_session: "Summer 2024 (Final Year BPT)", appeared: 58, passed: 56, distinction: 9, first_class: 38, pass_percentage: "96.55%" },
      { year: "2023 - 2024", exam_session: "Winter 2023 (Supplementary & Regular)", appeared: 24, passed: 22, distinction: 3, first_class: 15, pass_percentage: "91.66%" },
      { year: "2022 - 2023", exam_session: "Summer 2023 (Final Year BPT)", appeared: 60, passed: 57, distinction: 11, first_class: 39, pass_percentage: "95.00%" },
      { year: "2021 - 2022", exam_session: "Summer 2022 (Final Year BPT)", appeared: 55, passed: 52, distinction: 8, first_class: 36, pass_percentage: "94.54%" }
    ],
    revaluation_rules: "Students seeking verification of marks or photocopy of answer books must submit the prescribed MUHS application along with fees to the College Examination Cell within 7 days from the online result declaration."
  },

  // 5. Academic Policies
  policies: {
    title: "Academic Policies & Regulations",
    lead: "Institutional codes, regulatory statutes, and operational guidelines governing academic progress, clinical postings, and ethical medical education.",
    items: [
      {
        title: "Attendance & Condonation Policy",
        summary: "Mandates 75% attendance in theory and 80% attendance in clinical/practical sessions. Biometric and daily register tracking ensure compliance. Medical leave condonation requires Medical Board certification.",
        category: "Attendance & Discipline",
        pdf_url: ""
      },
      {
        title: "Compulsory Rotatory Clinical Internship Policy",
        summary: "Detailed 6-month continuous rotatory hospital posting guidelines following successful completion of IV BPT. Covers mandatory rotations in Orthopaedics, Neurology, Cardio-respiratory, ICU, and Community Rehab.",
        category: "Clinical Internship",
        pdf_url: ""
      },
      {
        title: "Continuous Internal Assessment (CIA) Policy",
        summary: "Prescribes the scheduling of two periodic sessional exams and one preliminary exam per academic year. Mandates transparent grievance redressal and display of internal marks prior to university submission.",
        category: "Evaluation",
        pdf_url: ""
      },
      {
        title: "Code of Academic Integrity & Clinical Ethics",
        summary: "Defines ethical responsibilities during patient interaction, strict confidentiality of medical records (HIPAA/NMC compliance), prohibition of academic dishonesty, and professional decorum.",
        category: "Ethics & Integrity",
        pdf_url: ""
      },
      {
        title: "Remedial Teaching & Mentorship Policy",
        summary: "Systematic identification of slow learners through diagnostic tests and periodic evaluations, followed by structured tutorial sessions, bilingual clarifications, and individual faculty mentor allocation.",
        category: "Student Support",
        pdf_url: ""
      }
    ]
  },

  // 6. Student Handbook
  handbook: {
    title: "Student Handbook & Code of Conduct",
    lead: "Comprehensive institutional manual providing orientation guidelines, hospital etiquette, campus regulations, student support services, and disciplinary codes for all enrolled students.",
    current_edition: "Academic Edition 2024 - 2025",
    pdf_url: "",
    chapters: [
      {
        num: "01",
        title: "Introduction & Institutional Ethos",
        desc: "Overview of Karmayogi Institute of Physiotherapy, vision, mission, leadership, and our pledge to humanitarian rehabilitation."
      },
      {
        num: "02",
        title: "Academic Structure & Curriculum Navigation",
        desc: "Breakdown of BPT syllabus prescribed by MUHS, examination schedules, credit structure, and prerequisite criteria."
      },
      {
        num: "03",
        title: "Clinical Hospital Protocol & Dress Code",
        desc: "Standards for white aprons, clean institutional uniforms, nametags, patient communication etiquette, and hygiene protocols."
      },
      {
        num: "04",
        title: "Campus Facilities & Library Rules",
        desc: "Guidelines for laboratory safety, electrotherapy equipment care, central library lending rules, and IT / Wi-Fi policy."
      },
      {
        num: "05",
        title: "Student Welfare, Mentorship & Health Support",
        desc: "Proctorial mentorship system, counseling support, campus medical health insurance, and remedial coaching schemes."
      },
      {
        num: "06",
        title: "Disciplinary Codes & Statutory Committees",
        desc: "Zero-tolerance anti-ragging policy, gender sensitization (ICC), grievance redressal protocols, and disciplinary penalties."
      }
    ],
    contact_support: {
      dean_office: "principal@karmayogiphysio.edu.in",
      exam_cell: "examcell@karmayogiphysio.edu.in",
      student_welfare: "studentwelfare@karmayogiphysio.edu.in"
    }
  }
};

// ========================================================
// DEFAULT MANDATORY DISCLOSURES DATASET
// ========================================================
export const DEFAULT_MANDATORY_DISCLOSURES = {
  overview: {
    title: "Statutory Mandatory Disclosures & Public Compliance",
    lead: "In strict adherence to statutory regulatory mandates issued by Maharashtra University of Health Sciences (MUHS), the Directorate of Medical Education and Research (DMER), Mumbai, UGC, and the Government of Maharashtra, institutional documentation, affiliations, and audit reports are placed in the public domain."
  },
  // Year-wise sorted MUHS Mandated Disclosures
  muhs: [
    {
      year: "2026–27",
      documents: [
        { id: 1, title: "MUHS Continuation of Affiliation Order (A.Y. 2026–27)", file_url: "" },
        { id: 2, title: "Sanctioned Annual Intake Capacity (60 Seats BPT)", file_url: "" },
        { id: 3, title: "Local Inquiry Committee (LIC) Inspection & Compliance Report", file_url: "" },
        { id: 4, title: "Teaching Hospital Clinical Bed Strength & MOU Verification", file_url: "" },
        { id: 5, title: "Faculty & Staff Declaration Compliance Undertaking", file_url: "" }
      ]
    },
    {
      year: "2025–26",
      documents: [
        { id: 1, title: "MUHS Continuation of Affiliation Order (A.Y. 2025–26)", file_url: "" },
        { id: 2, title: "LIC Compliance Certificate & Inspection Note", file_url: "" },
        { id: 3, title: "Approved Teaching Staff & Examiner Eligibility Roster", file_url: "" },
        { id: 4, title: "Annual Academic Audit & Infrastructure Verification", file_url: "" }
      ]
    },
    {
      year: "2024–25",
      documents: [
        { id: 1, title: "MUHS Continuation of Affiliation Order (A.Y. 2024–25)", file_url: "" },
        { id: 2, title: "MUHS Annual Academic Inspection Compliance Report", file_url: "" },
        { id: 3, title: "MUHS Affiliation Sanction & Intake Regularization Order", file_url: "" }
      ]
    }
  ],
  policies: [
    { id: 1, title: "Student & Faculty Code of Conduct", desc: "Rules on attendance, clinical attire, hospital patient communication etiquette, and campus discipline.", file_url: "" },
    { id: 2, title: "Anti-Ragging Regulatory Policy", desc: "Comprehensive statutory policy in accordance with Supreme Court rulings and UGC 2009 Regulations.", file_url: "" },
    { id: 3, title: "Internal Complaints Committee (POSH)", desc: "Zero tolerance guidelines for prevention of sexual harassment of women at the workplace.", file_url: "" },
    { id: 4, title: "Research & Bioethics Policy", desc: "ICMR compliant ethical guidelines for human participant clinical trials and patient consent protocols.", file_url: "" }
  ],
  approvals: [
    { id: 1, authority: "Government of Maharashtra", title: "Medical Education & Drugs Department Gazette Sanction", file_url: "" },
    { id: 2, authority: "DMER, Mumbai", title: "Directorate of Medical Education and Research Permission", file_url: "" },
    { id: 3, authority: "UGC Recognition", title: "Recognized under Section 2(f) of the UGC Act, 1956", file_url: "" },
    { id: 4, authority: "NAAC, Bengaluru", title: "Institutional Accreditation Grade 'A' Certificate", file_url: "" }
  ],
  reports: [
    { id: 1, year: "F.Y. 2025–26", title: "Audited Balance Sheet & Income-Expenditure Account", status: "Audited", file_url: "" },
    { id: 2, year: "F.Y. 2024–25", title: "Audited Balance Sheet & Fee Regulating Authority (FRA) Review", status: "Approved by FRA", file_url: "" },
    { id: 3, year: "F.Y. 2023–24", title: "Statutory Annual Audit & Academic Infrastructure Expenditure", status: "Certified", file_url: "" }
  ]
};





