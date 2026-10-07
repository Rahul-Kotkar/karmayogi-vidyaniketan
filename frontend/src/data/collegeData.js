// Central data for Karmayogi Vidyaniketan / Karmayogi Public School
// Shri Pandurang Pratishthan, Pandharpur
// All content is editable here — public pages render from this authoritative dataset.

import { DEPARTMENTS_DATA } from './departmentsData.js';
import { SCHOOL_SUBJECTS, SCHOOL_LEVELS, BPT_SUBJECTS, BPT_YEARS } from './subjectsData.js';
import { DEFAULT_CAMPUS_ACTIVITIES, DEFAULT_STUDENT_HOUSES, DEFAULT_STUDENT_CLUBS } from './studentCornerData.js';
import { DEFAULT_IQAC_DATA } from './iqacData.js';

export {
  DEPARTMENTS_DATA,
  SCHOOL_SUBJECTS,
  SCHOOL_LEVELS,
  BPT_SUBJECTS,
  BPT_YEARS,
  DEFAULT_CAMPUS_ACTIVITIES,
  DEFAULT_STUDENT_HOUSES,
  DEFAULT_STUDENT_CLUBS,
  DEFAULT_IQAC_DATA
};

export const COLLEGE = {
  foundation: "Shri Pandurang Pratishthan's",
  name: "KARMAYOGI VIDYANIKETAN",
  subname: "Karmayogi Public School",
  founder_name: "स्व. सुधाकरपंत परिचारक",
  motto: "Shape Young Minds. Build Strong Futures.",
  mottoAuthor: "Shri Pandurang Pratishthan, Pandharpur",
  lines: [
    "English Medium • Co-Educational School • Nursery to Grade 10",
    "CBSE & State Board Tracks • Shri Pandurang Pratishthan, Pandharpur",
    "Primary Campus: Isbavi | High School Campus: Shelve, Pandharpur (MS)"
  ],
  address: "Isbavi & Shelve, Pandharpur, Dist: Solapur, Maharashtra - 413304",
  primary_campus: {
    name: "Primary / Foundation Campus",
    address: "Isbavi, behind MSEDCL Division Office, Link Road, Pandharpur, Maharashtra",
    grades: "Nursery to Grade 4"
  },
  main_campus: {
    name: "Main High School Campus",
    address: "Shelve, Pandharpur, Dist: Solapur, Maharashtra - 413304",
    grades: "Grade 5 to Grade 10"
  },
  phone: "+91-8459863477",
  phones: ["+91-8459863477", "+91-9527632033", "+91-8788642412"],
  email: "vijaymadane3@gmail.com",
  website: "www.karmayogividyaniketan.edu.in",
  working_hours: "Monday to Saturday: 8:00 AM – 2:00 PM (Sunday: Closed)",
  campus_features: "Smart classrooms, advanced science & robotics labs, sports arena, and transportation"
};

export const QUICK_LINKS = [
  { label: "Admissions Open", path: "/admissions" },
  { label: "Curriculum", path: "/curriculum" },
  { label: "School Facilities", path: "/facilities" },
  { label: "Transportation", path: "/transport" },
  { label: "Contact School", path: "/contact" }
];

export const SOCIAL_LINKS = [
  { platform: "facebook", url: "https://facebook.com", icon: "fb" },
  { platform: "instagram", url: "https://instagram.com", icon: "ig" },
  { platform: "youtube", url: "https://youtube.com", icon: "yt" },
  { platform: "linkedin", url: "https://linkedin.com", icon: "li" }
];

// Row 1: Primary Institutional Navigation
export const ROW_1_NAV = [
  { label: "HOME", path: "/" },
  {
    label: "ABOUT US",
    path: "/about",
    children: [
      { label: "About the School", path: "/about" },
      { label: "Vision & Mission", path: "/vision-mission" },
      { label: "Principal's Message", path: "/principal-message" },
      { label: "Chairman's Message", path: "/about#chairman" },
      { label: "Shri Pandurang Pratishthan", path: "/about#management" },
      { label: "Our Leadership", path: "/about#leadership" }
    ]
  },
  {
    label: "ACADEMICS",
    path: "/academics",
    children: [
      { label: "Academic Overview", path: "/academics" },
      { label: "Pre-Primary (Nursery, Jr/Sr KG)", path: "/pre-primary" },
      { label: "Primary School (Grades 1-5)", path: "/primary" },
      { label: "Secondary School (Grades 6-10)", path: "/secondary" },
      { label: "Curriculum & Boards", path: "/curriculum" },
      { label: "Teaching Methodology", path: "/academics#methodology" },
      { label: "Examination & Assessment", path: "/academics#examination" }
    ]
  },
  {
    label: "ADMISSIONS",
    path: "/admissions",
    children: [
      { label: "Admission Overview", path: "/admissions" },
      { label: "Admission Process", path: "/admission-process" },
      { label: "Eligibility Criteria", path: "/admission-process#eligibility" },
      { label: "Documents Required", path: "/admission-process#documents" },
      { label: "Fee Structure", path: "/fees" },
      { label: "Enquiry / Apply Now", path: "/admissions#apply" },
      { label: "Admission FAQs", path: "/fees#faqs" }
    ]
  },
  {
    label: "CAMPUS",
    path: "/infrastructure",
    children: [
      { label: "Infrastructure Overview", path: "/infrastructure" },
      { label: "Smart Classrooms", path: "/facilities#smart-classrooms" },
      { label: "Science Laboratories", path: "/labs#science" },
      { label: "Computer Laboratory", path: "/labs#computer" },
      { label: "STEM Laboratory", path: "/labs#stem" },
      { label: "AI & Robotics Lab", path: "/labs#robotics" },
      { label: "Digital Library", path: "/facilities#library" },
      { label: "Transportation Fleet", path: "/transport" },
      { label: "Sports Facilities", path: "/sports" }
    ]
  },
  {
    label: "STUDENT LIFE",
    path: "/student-life",
    children: [
      { label: "Sports & Athletics", path: "/sports" },
      { label: "Cultural Activities", path: "/student-life#cultural" },
      { label: "Clubs & Activities", path: "/student-life#clubs" },
      { label: "Events & Celebrations", path: "/events" },
      { label: "Field Trips & Excursions", path: "/student-life#field-trips" },
      { label: "Competitions & Olympiads", path: "/student-life#competitions" },
      { label: "Student Achievements", path: "/student-life#achievements" }
    ]
  },
  { label: "FACILITIES", path: "/facilities" },
  { label: "GALLERY", path: "/gallery" },
  { label: "CONTACT US", path: "/contact" }
];

// Row 2: Secondary Quick-Access School Explorer Strip
export const ROW_2_NAV = [
  { label: "PRE-PRIMARY", path: "/pre-primary" },
  { label: "PRIMARY SCHOOL", path: "/primary" },
  { label: "SECONDARY SCHOOL", path: "/secondary" },
  { label: "CURRICULUM", path: "/curriculum" },
  { label: "SCIENCE & STEM LABS", path: "/labs" },
  { label: "TRANSPORTATION", path: "/transport" },
  { label: "SPORTS FACILITIES", path: "/sports" },
  { label: "SCHOOL INFRASTRUCTURE", path: "/infrastructure" },
  { label: "NEWS & EVENTS", path: "/events" },
  { label: "ADMISSION ENQUIRY", path: "/admissions#apply" }
];

export const TOP_NAV = ROW_1_NAV;
export const SECOND_NAV = ROW_2_NAV;

// School Quick Information Facts
export const QUICK_INFO_FACTS = [
  {
    title: "Nursery to Grade 10",
    icon: "grad"
  },
  {
    title: "English Medium",
    icon: "book"
  },
  {
    title: "Co-Educational School",
    icon: "users"
  },
  {
    title: "CBSE & State Board Tracks",
    icon: "curriculum"
  },
  {
    title: "Modern Campus",
    icon: "infrastructure"
  },
  {
    title: "Safe Transportation",
    icon: "transport"
  }
];

// School Courses / Grade Offerings
export const COURSES = [
  {
    id: "pre-primary",
    code: "PRE-PRIMARY",
    name: "Pre-Primary Wing (Nursery, Jr. KG, Sr. KG)",
    degree_level: "Foundational Stage",
    duration: "3 Years (Ages 3 to 6)",
    intake: "Activity-Based Small Batches",
    eligibility: "Age 3+ for Nursery as on 31st December",
    fees: "Transparent & Affordable",
    description: "Activity-based, play-way foundational learning developing sensory, cognitive, language, fine motor and socialization skills.",
    status: "Active",
    order_index: 1
  },
  {
    id: "primary",
    code: "PRIMARY",
    name: "Primary School (Grades 1 to 5)",
    degree_level: "Preparatory Stage",
    duration: "5 Years (Grades 1 to 5)",
    intake: "Multiple Sections",
    eligibility: "Successful completion of prior grade / Age 6+ for Grade 1",
    fees: "Transparent & Affordable",
    description: "Strong fundamentals in reading, writing, mathematical fluency, environmental curiosity, multilingual competence and creative arts.",
    status: "Active",
    order_index: 2
  },
  {
    id: "secondary",
    code: "SECONDARY",
    name: "Secondary School (Grades 6 to 10)",
    degree_level: "Middle & Secondary Stage",
    duration: "5 Years (Grades 6 to 10)",
    intake: "Multiple Sections",
    eligibility: "Promotion / Transfer Certificate from recognized school",
    fees: "Transparent & Affordable",
    description: "Structured academic learning, laboratory inquiry, computer science, STEM, AI & Robotics, preparing students for board examination distinction.",
    status: "Active",
    order_index: 3
  }
];

// School Facilities
export const FACILITIES = [
  {
    id: "smart-classrooms",
    title: "Smart Classrooms",
    desc: "Technology-enabled classrooms equipped with interactive smart boards, multimedia projectors, and digital audio-visual resources supporting interactive, visual learning.",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "science-labs",
    title: "Science Laboratories",
    desc: "Well-equipped, spacious laboratories for Physics, Chemistry, and Biology designed for hands-on practical experiments, scientific inquiry, and board exam practicals.",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "computer-lab",
    title: "Computer Laboratory",
    desc: "Modern computer facilities equipped with high-speed internet, dedicated workstations, educational software, and foundational coding platforms for digital literacy.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "stem-lab",
    title: "STEM Laboratory",
    desc: "Hands-on science, technology, engineering, and mathematics learning space where students build mechanical prototypes, conduct experiments, and test innovative ideas.",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ai-robotics",
    title: "AI & Robotics Lab",
    desc: "Introduces students to emerging technologies, Arduino microcontrollers, sensory robotics kits, and artificial intelligence applications to cultivate futuristic problem-solving.",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "digital-library",
    title: "Digital Library",
    desc: "Extensive repository of age-appropriate literature, encyclopedias, academic reference books, periodicals, e-books, and language learning resources in a quiet study ambiance.",
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sports-facilities",
    title: "Sports Facilities",
    desc: "Expansive outdoor playgrounds and indoor arenas supporting athletics, cricket, football, volleyball, kabaddi, kho-kho, badminton, and daily yogic physical fitness.",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "transportation",
    title: "Transportation",
    desc: "Dedicated fleet of safe school buses covering Pandharpur town and surrounding rural routes, equipped with trained staff, emergency first-aid, and safety protocols.",
    img: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80"
  }
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
  academic_year: d.academic_year || d.yearKey || 'all',
  yearKey: d.yearKey || d.academic_year || 'all',
  yearLabel: d.yearLabel || 'School Department',
  subject_count: d.subject_count || 5,
  relatedSubjectIds: d.relatedSubjectIds || [],
  specializations: d.specializations || []
}));

export const FACULTY = [
  {
    id: 1,
    name: "Mr. Vijay Madane",
    designation: "Principal / Academic Director",
    department: "School Administration & Secondary Wing",
    qualification: "M.Sc., M.Ed., Ph.D. (Pursuing)",
    experience: "18 Years in Academic Leadership",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Mrs. Sunita S. Kadam",
    designation: "Head - Pre-Primary Wing",
    department: "Early Childhood Care & Education",
    qualification: "M.A., B.Ed., ECCE",
    experience: "14 Years in Foundational Education",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Mr. Ramesh D. More",
    designation: "Coordinator - Primary School Wing",
    department: "Primary Mathematics & Pedagogy",
    qualification: "M.Sc. (Maths), B.Ed.",
    experience: "16 Years in School Teaching",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Mr. Prakash T. Kulkarni",
    designation: "HOD - Science & STEM Laboratories",
    department: "Science (Physics & Chemistry)",
    qualification: "M.Sc. (Chemistry), B.Ed.",
    experience: "15 Years in Science Education",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Mr. Amit S. Bhosale",
    designation: "HOD - Computer Science & Robotics",
    department: "Information Technology & AI",
    qualification: "M.C.A., B.Ed., Certified AI Educator",
    experience: "11 Years in Educational Technology",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Mr. Sunil B. Shinde",
    designation: "Director - Physical Education & Sports",
    department: "Physical Education & Athletics",
    qualification: "M.P.Ed., NIS (Athletics)",
    experience: "14 Years in Youth Sports Coaching",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  }
];

export const NOTICES = [
  {
    id: "not-1",
    title: "Admissions Open for Academic Year 2026–27 (Nursery to Grade 10)",
    date: "2026-09-15",
    category: "Admissions",
    desc: "Admission forms are available at both Isbavi (Primary) and Shelve (Main) campus administrative offices and through online enquiry. Early interaction slots available."
  },
  {
    id: "not-2",
    title: "Karmayogi Science Exhibition & Working Model Competition Scheduled",
    date: "2026-09-22",
    category: "Academic Events",
    desc: "All students from Grade 4 to Grade 10 are invited to submit their innovative project abstracts to the STEM department coordinator."
  },
  {
    id: "not-3",
    title: "School Bus Transport Route & Safety Protocol Notice",
    date: "2026-09-28",
    category: "Transport",
    desc: "Bus routes for Pandharpur urban zones and feeder areas have been finalized. Parents requesting stop updates can submit forms at the office."
  },
  {
    id: "not-4",
    title: "Parent-Teacher Association (PTA) Open House Schedule Announced",
    date: "2026-10-02",
    category: "Administration",
    desc: "Quarterly progress review meetings for Primary and Secondary sections will be conducted on Saturday between 8:30 AM and 1:00 PM."
  }
];

export const EVENTS = [
  {
    id: "ev-1",
    title: "Annual Day Extravaganza 'Karmotsav 2026'",
    date: "2026-11-20",
    category: "Cultural",
    location: "Main Campus Auditorium, Shelve",
    time: "4:30 PM Onwards",
    desc: "A gala evening of student theatrical plays, classical dances, orchestral music, and annual felicitation of academic and sporting achievers."
  },
  {
    id: "ev-2",
    title: "Annual Inter-House Athletics & Sports Gala",
    date: "2026-12-05",
    category: "Sports",
    location: "Karmayogi Sports Grounds, Shelve",
    time: "8:00 AM – 4:00 PM",
    desc: "Three days of track events, relay races, kabaddi, kho-kho, cricket matches, and march past ceremonies celebrating athletic spirit."
  },
  {
    id: "ev-3",
    title: "Grand Science Exhibition & AI Robotics Fair",
    date: "2026-12-18",
    category: "Innovation",
    location: "STEM Innovation Lab & Central Quadrangle",
    time: "9:00 AM – 3:00 PM",
    desc: "Over 100 working models in clean energy, agricultural automation, space science, and smart city prototypes on public display."
  },
  {
    id: "ev-4",
    title: "Educational Heritage Trip to Historical Forts",
    date: "2027-01-12",
    category: "Field Trip",
    location: "Historical Heritage Circuit, Maharashtra",
    time: "Full Day Tour",
    desc: "Experiential history and geography field trip for secondary students studying Maratha architecture, water harvesting, and conservation."
  }
];

export const GALLERY = [
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", cat: "Campus", cap: "Main Academic School Building" },
  { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", cat: "Classrooms", cap: "Interactive Smart Classroom Learning" },
  { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80", cat: "Laboratories", cap: "Senior Science Chemistry Practical" },
  { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80", cat: "Laboratories", cap: "AI & Robotics Laboratory Workshop" },
  { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80", cat: "Sports", cap: "Annual Sports Day Athletics Track" },
  { src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", cat: "Cultural Activities", cap: "Annual Day Cultural Dance Performance" },
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", cat: "Students", cap: "Students Collaborating on Projects" },
  { src: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80", cat: "Infrastructure", cap: "Main Campus Green Grounds & Courtyard" },
  { src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80", cat: "Classrooms", cap: "Central Digital Library Reading Hall" },
  { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80", cat: "Students", cap: "Pre-Primary Foundational Activity Room" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80", cat: "Sports", cap: "Outdoor Football and Cricket Grounds" },
  { src: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80", cat: "Infrastructure", cap: "School Bus Transportation Fleet" }
];

export const ALBUMS = [
  {
    id: 1,
    title: "Campus & Modern Infrastructure",
    category_name: "Campus",
    description: "State-of-the-art academic buildings, smart classrooms, library, and green surroundings.",
    cover_image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    photo_count: 2,
    photos: [
      { id: 101, image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", caption: "Main Academic High School Block" },
      { id: 102, image_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80", caption: "Campus Green Grounds & Outdoor Spaces" }
    ]
  },
  {
    id: 2,
    title: "Smart Classrooms & Foundational Learning",
    category_name: "Classrooms",
    description: "Technology-enabled multimedia teaching and activity-based pre-primary rooms.",
    cover_image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    photo_count: 2,
    photos: [
      { id: 201, image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", caption: "Interactive Smart Board Session" },
      { id: 202, image_url: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80", caption: "Pre-Primary Activity Corner" }
    ]
  },
  {
    id: 3,
    title: "Science, STEM & Robotics Laboratories",
    category_name: "Laboratories",
    description: "Hands-on experiments in Physics, Chemistry, Biology, and AI Robotics.",
    cover_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    photo_count: 2,
    photos: [
      { id: 301, image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80", caption: "Science Laboratory Experiment" },
      { id: 302, image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80", caption: "Robotics Kit Assembly & Coding" }
    ]
  },
  {
    id: 4,
    title: "Sports Meet, Athletics & Fitness",
    category_name: "Sports",
    description: "Athletics tournaments, cricket, football, kabaddi, and fitness sessions.",
    cover_image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    photo_count: 2,
    photos: [
      { id: 401, image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80", caption: "Annual Track and Field Sprint Races" },
      { id: 402, image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80", caption: "Football & Cricket Training Grounds" }
    ]
  },
  {
    id: 5,
    title: "Annual Day 'Karmotsav' & Cultural Vibrance",
    category_name: "Cultural Activities",
    description: "Theatrical plays, classical and folk dance, music, and stage performances.",
    cover_image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    photo_count: 2,
    photos: [
      { id: 501, image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", caption: "Karmotsav Thematic Dance Presentation" },
      { id: 502, image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", caption: "Student Achievers Felicitation" }
    ]
  }
];

export const NEWS = [
  {
    id: 1,
    title: "100% Board Exam Results Achieved with Record Distinctions",
    date: "2026-06-12",
    tag: "ACADEMICS",
    desc: "Karmayogi Vidyaniketan students once again set high benchmarks in Grade 10 Board Examinations, with numerous students securing distinction marks across all subjects.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "New Advanced AI & Robotics Laboratory Inaugurated",
    date: "2026-07-25",
    tag: "INNOVATION",
    desc: "The state-of-the-art lab brings hands-on robotics, drone basics, and computer vision training to students from Grade 5 upwards under expert engineering mentors.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "School Sports Contingent Wins Medals at District Athletic Meet",
    date: "2026-08-30",
    tag: "SPORTS",
    desc: "Athletes from Karmayogi Vidyaniketan clinched gold and silver medals in 100m, 400m relay, and long jump competitions at the Solapur District School Games.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
  }
];

export const ACHIEVEMENTS = [
  {
    title: "100% Board Examination Pass Record",
    subtitle: "Excellence in Grade 10 Board Results with exceptional distinctions."
  },
  {
    title: "District Champions in Kabaddi & Kho-Kho",
    subtitle: "Consecutive podium finishes across Solapur District Inter-School Games."
  },
  {
    title: "National Science Olympiad Medals",
    subtitle: "Multiple students recognized with gold and merit ranks in STEM Olympiads."
  },
  {
    title: "State Level Kala Utsav Cultural Honors",
    subtitle: "First prize in folk drama and group classical singing at the divisional level."
  }
];

export const HERO_IMAGE = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80";

export const PRINCIPAL_PHOTO = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";

export const HERO_SLIDES = [
  {
    id: 1,
    tag: "TRUST | ACADEMICS | DISCIPLINE | VALUES",
    title: "Shape Young Minds.\nBuild Strong Futures.",
    description: "Karmayogi Vidyaniketan is committed to providing quality education that combines academic excellence, modern learning, discipline and strong Indian values.",
    quote: "Education with Values & Purpose",
    image: null,
    primaryBtn: { text: "Apply for Admission", link: "/admissions" },
    secondaryBtn: { text: "Explore Our School", link: "/about" }
  },
  {
    id: 2,
    tag: "NURSERY TO GRADE 10 | ENGLISH MEDIUM",
    title: "Nurturing Curiosity,\nCharacter & Confidence",
    description: "A balanced educational experience that develops academic ability, creativity, physical fitness, and responsible citizenship across CBSE & State Board tracks.",
    quote: "Holistic Child Development",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80",
    primaryBtn: { text: "Academic Curriculum →", link: "/academics" },
    secondaryBtn: { text: "View Facilities", link: "/facilities" }
  },
  {
    id: 3,
    tag: "STEM | ROBOTICS | SPORTS | TRANSPORT",
    title: "Empowering Next-Gen\nThinkers & Leaders",
    description: "Modern smart classrooms, AI & Robotics laboratory, expansive sports grounds, and safe GPS-monitored school bus transportation.",
    quote: "Modern Infrastructure & Care",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80",
    primaryBtn: { text: "Campus & Labs →", link: "/labs" },
    secondaryBtn: { text: "Transportation", link: "/transport" }
  }
];

export const DEFAULT_WHY_ITEMS = [
  {
    id: 1,
    icon: 'curriculum',
    title: 'Strong Academic Foundation',
    description: 'Rigorous conceptual mastery from early literacy and numeracy up to board examination distinction.'
  },
  {
    id: 2,
    icon: 'infrastructure',
    title: 'Modern Infrastructure',
    description: 'Spacious campuses at Isbavi and Shelve equipped with well-ventilated classrooms, labs, and play areas.'
  },
  {
    id: 3,
    icon: 'faculty',
    title: 'Experienced Teaching Environment',
    description: 'Dedicated educators who mentor each child with care, patience, individualized attention, and discipline.'
  },
  {
    id: 4,
    icon: 'research',
    title: 'Smart Classrooms',
    description: 'Interactive digital boards and multimedia learning tools making complex concepts vivid and engaging.'
  },
  {
    id: 5,
    icon: 'lightbulb',
    title: 'STEM, AI & Robotics Exposure',
    description: 'Hands-on experiential laboratories fostering coding, robotics assembly, and inventive 21st-century problem solving.'
  },
  {
    id: 6,
    icon: 'development',
    title: 'Sports & Extracurricular Development',
    description: 'Daily athletic training, team sports, music, dance, debates, and vibrant cultural celebrations.'
  },
  {
    id: 7,
    icon: 'building',
    title: 'Safe Student Transportation',
    description: 'Dedicated fleet of GPS-equipped school buses with female attendants serving Pandharpur and nearby rural routes.'
  },
  {
    id: 8,
    icon: 'briefcase',
    title: 'Focus on Values and Discipline',
    description: 'Deep grounding in Indian cultural values, integrity, respect, civic responsibility, and moral character.'
  },
  {
    id: 9,
    icon: 'student',
    title: 'Holistic Child Development',
    description: 'Harmonious growth of intellect, emotional resilience, physical vigor, and artistic self-expression.'
  },
  {
    id: 10,
    icon: 'book',
    title: 'English-Medium Education',
    description: 'Comprehensive English fluency combined with deep appreciation of Marathi and Hindi languages.'
  }
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: "Karmayogi Vidyaniketan provides the perfect balance of academic seriousness and joyful extracurricular activities. My daughter has become so confident in speaking and expressing her ideas.",
    name: "Parent of Grade 5 Student",
    role: "Primary School Parent"
  },
  {
    id: 2,
    quote: "The STEM and Robotics lab has sparked a genuine interest in science for my son. The teachers are approachable, caring, and deeply invested in each child's character.",
    name: "Parent of Grade 8 Student",
    role: "Secondary School Parent"
  },
  {
    id: 3,
    quote: "The school bus transport network and campus safety protocols give working parents complete confidence. The school staff is always attentive and caring.",
    name: "Parent of Grade 9 Student",
    role: "Secondary School Parent"
  }
];

export const DEFAULT_ABOUT_DATA = {
  institute_tag: 'Shri Pandurang Pratishthan, Pandharpur',
  institute_title: 'About Karmayogi Vidyaniketan',
  institute_subtitle: 'Widely known as Karmayogi Public School | English Medium • Co-Educational • Nursery to Grade 10',
  institute_photo_url: '',
  institute_photo_caption: 'Main Academic Campus & Sports Grounds, Pandharpur',
  institute_p1: "Karmayogi Vidyaniketan, widely known as Karmayogi Public School, is a co-educational institution located in Pandharpur, Solapur district, Maharashtra. The school operates under the visionary management of Shri Pandurang Pratishthan, Pandharpur.",
  institute_p2: "The school aims to provide a balanced education that develops academic ability, confidence, discipline, creativity, physical fitness and responsible citizenship. Combining modern educational tools, smart classrooms, experiential science and robotics laboratories with strong Indian values, we prepare students to excel in higher education and life.",

  // Vision & Mission
  vm_tag: 'School Philosophy',
  vm_title: 'Vision & Mission',
  vm_subtitle: 'Guiding values shaping curious, confident, and conscientious young citizens',
  vision_title: 'Our Vision',
  vision_text: 'To be an institution of educational excellence that nurtures young minds with intellectual vigor, moral strength, creative curiosity, and holistic life skills, empowering them to become responsible global citizens rooted in Indian values.',
  mission_title: 'Our Mission',
  mission_points: [
    'To provide quality English-medium education accessible to students across Pandharpur and surrounding regions.',
    'To foster a learning environment combining academic rigor with hands-on STEM, digital learning, and arts.',
    'To cultivate physical fitness, sportsmanship, and teamwork through regular sports and athletics.',
    'To instill character, self-discipline, empathy, and reverence for Indian culture, heritage, and social harmony.',
    'To maintain state-of-the-art infrastructure, safe residential facilities, and a supportive educator-student partnership.',
    'To nurture every child’s unique potential through individualized guidance and encouraging mentorship.'
  ],

  // Quality Policy
  qp_tag: 'Educational Standards',
  qp_title: 'Our Commitment to Quality Education',
  qp_text: 'Karmayogi Vidyaniketan is dedicated to delivering learner-centric education aligned with CBSE and State Board standards. We continually evaluate our teaching methodologies, teacher development programs, classroom facilities, and safety standards through systematic feedback and constructive parent-teacher collaboration.',

  // Governing Council / Management
  council_tag: 'School Governance',
  council_title: 'Management & School Leadership',
  council_subtitle: 'Governed by Shri Pandurang Pratishthan, Pandharpur',
  council_description: 'Under the benevolent leadership of Shri Pandurang Pratishthan, Karmayogi Vidyaniketan functions with clear educational vision, statutory compliance, student safety priorities, and continuous infrastructure modernization.',
  council_members: [
    { sr_no: '1', name: 'Shri Pandurang Pratishthan Management', designation: 'Parent Trust', representation: 'Founding Organization' },
    { sr_no: '2', name: 'Mr. Vijay Madane', designation: 'Principal / Academic Director', representation: 'Head of the School' },
    { sr_no: '3', name: 'Mrs. Sunita S. Kadam', designation: 'Pre-Primary Coordinator', representation: 'Foundational Stage Head' },
    { sr_no: '4', name: 'Mr. Ramesh D. More', designation: 'Primary School Coordinator', representation: 'Preparatory Stage Head' },
    { sr_no: '5', name: 'Senior Faculty Representatives', designation: 'Teachers Council', representation: 'Faculty Representation' },
    { sr_no: '6', name: 'Parent-Teacher Association (PTA) Members', designation: 'Parent Representatives', representation: 'PTA Committee' }
  ],

  // Statutory Recognitions
  approvals_tag: 'Curriculum & Boards',
  approvals_title: 'Educational Tracks & Affiliations',
  approvals_subtitle: 'Recognized educational curricula ensuring seamless higher secondary transitions',
  approvals: [
    {
      badge: 'Parent Organization',
      title: 'Shri Pandurang Pratishthan, Pandharpur',
      description: 'Established trust managing prestigious educational institutions across Solapur district with a commitment to excellence.'
    },
    {
      badge: 'Academic Boards',
      title: 'CBSE & Maharashtra State Board Tracks',
      description: 'Comprehensive curriculum pathways adhering to national pedagogical standards and state educational board frameworks.'
    },
    {
      badge: 'Medium & Level',
      title: 'English Medium • Co-Educational',
      description: 'Full educational spectrum from Nursery foundational years through Grade 10 secondary board certification.'
    }
  ]
};

// Default Admissions Data for the School
export const DEFAULT_ADMISSIONS_DATA = {
  intro_title: "Admissions Open 2026–27",
  intro_lead: "Give your child an environment where learning, character and confidence grow together. Karmayogi Vidyaniketan invites applications for Nursery to Grade 10 for the upcoming academic year.",

  process_intro: "We follow a transparent, child-friendly 5-step admission process designed to understand each learner and ensure a welcoming transition into our school family:",
  process_steps: [
    {
      num: "Step 1",
      title: "Submit Enquiry",
      desc: "Fill in the simple online enquiry form or visit our school admission desks at Isbavi (Primary) or Shelve (Main) campus to collect the prospectus."
    },
    {
      num: "Step 2",
      title: "Application Submission",
      desc: "Submit the completed school admission application form along with candidate photographs and previous academic progress records."
    },
    {
      num: "Step 3",
      title: "Document Verification",
      desc: "Our admission desk verifies original birth certificate, transfer certificate (TC), Aadhaar card, and previous progress report cards."
    },
    {
      num: "Step 4",
      title: "Interaction / Assessment",
      desc: "A warm, informal interaction for early learners or a foundational readiness assessment for senior grades to identify learning strengths."
    },
    {
      num: "Step 5",
      title: "Admission Confirmation",
      desc: "Upon successful interaction, complete the enrollment formalities and fee remittance to confirm your child's seat."
    }
  ],

  eligibility_intro: "Age and academic criteria for admission across school levels as per educational guidelines:",
  eligibility_programs: [
    {
      degree: "Pre-Primary Wing (Nursery, Jr. KG, Sr. KG)",
      duration: "Nursery, Jr. KG, Sr. KG",
      points: [
        "Nursery: Minimum 3 years of age as of 31st December of the admission year.",
        "Junior KG: Minimum 4 years of age as of 31st December.",
        "Senior KG: Minimum 5 years of age as of 31st December.",
        "Original Birth Certificate from Municipal Corporation / Gram Panchayat.",
        "Child-friendly informal interaction with parents."
      ]
    },
    {
      degree: "Primary School (Grades 1 to 5)",
      duration: "Grades 1 to 5",
      points: [
        "Grade 1: Minimum 6 years of age completed as of 31st December.",
        "Grades 2 to 5: Successful completion and promotion from the preceding grade in a recognized school.",
        "Original School Leaving Certificate / Transfer Certificate (TC) countersigned as applicable.",
        "Progress report card of previous academic year."
      ]
    },
    {
      degree: "Secondary School (Grades 6 to 10)",
      duration: "Grades 6 to 10",
      points: [
        "Successful completion and pass certificate of preceding grade from recognized CBSE / State / ICSE school.",
        "Original School Leaving Certificate / Transfer Certificate (TC).",
        "Marksheet / Cumulative Progress Report Card.",
        "Readiness assessment in English, Mathematics, and Science."
      ]
    }
  ],

  documents_intro: "Parents are requested to submit the following documents at the time of admission:",
  documents_categories: [
    {
      title: "Student Identification & Birth Records",
      items: [
        "Original Birth Certificate (for Pre-Primary & Grade 1 admission)",
        "Student Aadhaar Card copy",
        "Original School Leaving Certificate / Transfer Certificate (TC) for Grades 2 to 10",
        "Previous School Marksheet / Progress Report Card",
        "5 recent passport-size color photographs of the student"
      ]
    },
    {
      title: "Parent & Address Verification",
      items: [
        "Parents' Aadhaar Card copies (Father & Mother / Guardian)",
        "Proof of Residence (Electricity bill, Ration card, or Domicile certificate)",
        "2 passport-size photographs of each parent / guardian",
        "Caste Certificate (if claiming reserved category scholarship / records)"
      ]
    },
    {
      title: "Medical & Transport Documents (If Applicable)",
      items: [
        "Student blood group and basic medical fitness declaration",
        "Immunization record copy for Pre-Primary admissions",
        "Bus transport registration form (for opting school transportation)",
        "Special medical diet / emergency contacts disclosure"
      ]
    }
  ],

  fees_intro: "Karmayogi Vidyaniketan maintains an affordable, transparent fee structure approved by school management without capitation fees or hidden charges:",
  fees_table: [
    { category: "Pre-Primary (Nursery, Jr. & Sr. KG)", tuition_fee: "Affordable", dev_fee: "Included", total_fee: "As per Prospectus", scholarship: "Available for eligible wards", payable: "Term-wise installments" },
    { category: "Primary School (Grades 1 to 5)", tuition_fee: "Affordable", dev_fee: "Included", total_fee: "As per Prospectus", scholarship: "Available for eligible wards", payable: "Term-wise installments" },
    { category: "Secondary School (Grades 6 to 10)", tuition_fee: "Affordable", dev_fee: "Included", total_fee: "As per Prospectus", scholarship: "Available for eligible wards", payable: "Term-wise installments" },
    { category: "School Bus Transport (Optional)", tuition_fee: "Based on distance", dev_fee: "Safety equipped", total_fee: "Route-wise charges", scholarship: "Subsidized routes", payable: "Term-wise installments" }
  ],
  fees_notes: "Fees are payable via Net Banking, UPI, Demand Draft, or at the school cash counter against an official receipt. Term-wise installments are facilitated for parents.",

  helpdesk_title: "School Admission & Enquiry Desk",
  helpdesk_phone: "+91-8459863477, +91-9527632033",
  helpdesk_email: "vijaymadane3@gmail.com",
  helpdesk_hours: "Monday to Saturday: 8:00 AM – 2:00 PM (Sunday Closed)",
  helpdesk_address: "Isbavi Campus (Link Road) & Shelve Campus, Pandharpur, Maharashtra."
};

export const DEFAULT_COMMITTEES_DATA = [
  {
    id: 'smc',
    name: 'School Managing Committee (SMC)',
    designation: 'Apex School Governance Body',
    responsibilities: 'Oversees institutional policy, academic quality assurance, annual budgets, infrastructure safety, and overall direction under Shri Pandurang Pratishthan.',
    members: [
      { name: 'President / Trustee Nominee', role: 'Chairman', contact: 'management@karmayogividyaniketan.com' },
      { name: 'Mr. Vijay Madane', role: 'Member Secretary & Principal', contact: 'vijaymadane3@gmail.com' },
      { name: 'Senior Teacher Representative', role: 'Teacher Member', contact: 'academics@karmayogividyaniketan.com' },
      { name: 'Parent Representative (Elected)', role: 'Parent Member', contact: 'pta@karmayogividyaniketan.com' },
      { name: 'Educationist / CBSE Advisor', role: 'Nominated Member', contact: 'advisor@karmayogividyaniketan.com' }
    ]
  },
  {
    id: 'pta',
    name: 'Parent-Teacher Association (PTA) Executive Committee',
    designation: 'Parent & Educator Collaboration',
    responsibilities: 'Fosters active dialogue between parents and school administration, coordinates parent workshops, cultural fests, sports events, and student welfare.',
    members: [
      { name: 'Mr. Vijay Madane', role: 'Principal / Ex-Officio Chairperson', contact: 'vijaymadane3@gmail.com' },
      { name: 'Parent Representative (Grade 10)', role: 'Vice Chairperson', contact: 'pta@karmayogividyaniketan.com' },
      { name: 'Senior Primary Coordinator', role: 'Secretary', contact: 'primary@karmayogividyaniketan.com' },
      { name: 'Parent Representatives (Grades 1-10)', role: 'Executive Members', contact: 'pta@karmayogividyaniketan.com' }
    ]
  },
  {
    id: 'pocso-safety',
    name: 'Child Safety & Protection (POCSO) Committee',
    designation: 'Child Welfare & Protection Under Law',
    responsibilities: 'Ensures strict compliance with POCSO guidelines, CCTV surveillance standards, safe school transport, background verification of staff, and zero tolerance for harassment.',
    members: [
      { name: 'Principal / Child Welfare Lead', role: 'Chairperson', contact: 'safety@karmayogividyaniketan.com' },
      { name: 'School Counselor / Wellness Educator', role: 'Convener', contact: 'counselor@karmayogividyaniketan.com' },
      { name: 'Female Faculty Representative', role: 'Member', contact: 'preprimary@karmayogividyaniketan.com' },
      { name: 'Legal / Police Liaison Officer', role: 'External Advisor', contact: 'pandharpur.police@mahapolice.gov.in' }
    ]
  },
  {
    id: 'anti-bullying',
    name: 'Anti-Bullying & Disciplinary Committee',
    designation: 'Positive School Culture & Discipline',
    responsibilities: 'Monitors student discipline, promotes empathy and peer respect, investigates student grievances, and maintains a nurturing, fear-free campus environment.',
    members: [
      { name: 'Head of Student Welfare', role: 'Convener', contact: 'welfare@karmayogividyaniketan.com' },
      { name: 'House Masters (Prithvi, Agni, Jal, Vayu)', role: 'Members', contact: 'houses@karmayogividyaniketan.com' },
      { name: 'Sports Director / PE Head', role: 'Member', contact: 'sports@karmayogividyaniketan.com' }
    ]
  },
  {
    id: 'academic-council',
    name: 'Academic Quality & Examination Council',
    designation: 'Curriculum & CCE Continuous Evaluation',
    responsibilities: 'Coordinates lesson plans, quarterly assessments, board exam prep drills, teacher training workshops, STEM expo initiatives, and student remedial sessions.',
    members: [
      { name: 'Academic Director', role: 'Head', contact: 'academics@karmayogividyaniketan.com' },
      { name: 'Science & STEM Coordinator', role: 'Member', contact: 'stem@karmayogividyaniketan.com' },
      { name: 'Languages Department Head', role: 'Member', contact: 'languages@karmayogividyaniketan.com' },
      { name: 'Mathematics Department Head', role: 'Member', contact: 'maths@karmayogividyaniketan.com' }
    ]
  }
];

export const DEFAULT_FACULTY = [
  {
    id: 1,
    name: 'Mr. Vijay Madane',
    designation: 'Principal & Director of Academics',
    qualification: 'M.Sc., M.Ed., Ph.D. (Pursuing)',
    experience: '18+ Years',
    department_name: 'School Administration & Leadership',
    specialization: 'School Governance, Mathematics & Pedagogical Science',
    program_badge: 'CBSE / State',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    profile_description: 'An inspiring educational leader with nearly two decades of commitment to experiential learning, student leadership, and moral character development in Maharashtra.'
  },
  {
    id: 2,
    name: 'Mrs. Sunita S. Kadam',
    designation: 'Pre-Primary Wing Coordinator',
    qualification: 'M.A., B.Ed., ECCEd (Montessori)',
    experience: '12+ Years',
    department_name: 'Pre-Primary Wing',
    specialization: 'Early Childhood Care, Phonics & Play-Way Learning',
    program_badge: 'Nursery - KG',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Specializes in early literacy development, emotional resilience in young children, sensory play, and creating warm, encouraging foundational classrooms.'
  },
  {
    id: 3,
    name: 'Mr. Ramesh D. More',
    designation: 'Primary School Coordinator & Senior Mathematics Teacher',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: '14+ Years',
    department_name: 'Primary Wing',
    specialization: 'Vedic & Modern Mathematics, Mental Math & Olympiads',
    program_badge: 'Grades 1-5',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Passionate about demystifying mathematics through hands-on manipulatives, math labs, puzzles, and building solid conceptual foundations.'
  },
  {
    id: 4,
    name: 'Mrs. Anita P. Patil',
    designation: 'Secondary Science & STEM Laboratory Head',
    qualification: 'M.Sc. Physics, B.Ed.',
    experience: '10+ Years',
    department_name: 'Secondary Wing',
    specialization: 'Applied Physics, STEM Experiments & Robotics Mentorship',
    program_badge: 'Grades 6-10',
    photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Leads our active Science, AI and Robotics labs, preparing students for National Science Congress, state science exhibitions, and Olympiad ranks.'
  },
  {
    id: 5,
    name: 'Mr. Sachin B. Shinde',
    designation: 'Head of English & Communicative Skills',
    qualification: 'M.A. English Literature, B.Ed., CELTA',
    experience: '11+ Years',
    department_name: 'Languages & Literature',
    specialization: 'English Grammar, Debating, Elocution & Creative Writing',
    program_badge: 'CBSE / State',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Inspires confidence and fluency in English through reader’s theater, inter-school elocution championships, creative journals, and debating tournaments.'
  },
  {
    id: 6,
    name: 'Mr. Pravin K. Jadhav',
    designation: 'Director of Physical Education & Sports',
    qualification: 'M.P.Ed., NIS Certified Athletic Coach',
    experience: '13+ Years',
    department_name: 'Sports & Physical Education',
    specialization: 'Athletics, Football, Kabaddi & Kho-Kho Coaching',
    program_badge: 'Sports & PE',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Former state athlete dedicated to grooming disciplined, high-endurance young athletes and fostering house pride and sportsmanship across all age groups.'
  },
  {
    id: 7,
    name: 'Mrs. Manisha V. Kulkarni',
    designation: 'Computer Science, AI & Robotics Teacher',
    qualification: 'MCA, B.Ed., Certified AI Educator',
    experience: '9+ Years',
    department_name: 'Computer & AI Lab',
    specialization: 'Python, Scratch Coding, Web Technologies & Cyber Safety',
    program_badge: 'Tech & AI',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Equips students with modern coding literacy, safe digital navigation, algorithmic problem solving, and hands-on microcontroller robotics.'
  },
  {
    id: 8,
    name: 'Mr. Anand G. Deshmukh',
    designation: 'Social Sciences & Heritage Studies Teacher',
    qualification: 'M.A. History, B.Ed.',
    experience: '12+ Years',
    department_name: 'Social Sciences',
    specialization: 'Indian History, Civics, Geography & Environmental Studies',
    program_badge: 'Grades 6-10',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    profile_description: 'Brings history and geography alive through field visits, map mastery, historical enactments, and fostering deep appreciation for Indian heritage.'
  }
];

export const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Karmotsav 2026 - Annual Sports & Athletic Meet',
    type: 'Sports',
    start_date: '2026-12-18',
    end_date: '2026-12-20',
    venue: 'Shelve Campus Main Athletic Ground',
    desc: 'Grand 3-day annual athletic championship featuring march-past by all four houses, track and field finals, and championship trophy award ceremony.'
  },
  {
    id: 2,
    title: 'Science, STEM & Robotics Innovation Expo',
    type: 'Academic',
    start_date: '2026-11-10',
    end_date: '2026-11-10',
    venue: 'Raman Science & AI Laboratories, Both Campuses',
    desc: 'Showcase of inventive student projects, working robotics models, DIY sensor circuits, and eco-friendly technological solutions by Grades 3 to 10.'
  },
  {
    id: 3,
    title: 'Student Council Investiture Ceremony',
    type: 'Leadership',
    start_date: '2026-07-15',
    end_date: '2026-07-15',
    venue: 'Main School Auditorium, Shelve',
    desc: 'Formal swearing-in ceremony of Head Boy, Head Girl, House Captains, and student prefects, handing over official badges and house flags.'
  },
  {
    id: 4,
    title: 'Parent-Teacher Orientation & Progress Forum (PTM)',
    type: 'Meeting',
    start_date: '2026-09-05',
    end_date: '2026-09-05',
    venue: 'Isbavi (Primary) & Shelve (High School)',
    desc: 'Collaborative parent-teacher consultation to review student learning growth, developmental milestones, and individualized academic goals.'
  },
  {
    id: 5,
    title: 'Annual Cultural Gathering & Kalotsav Prize Distribution',
    type: 'Cultural',
    start_date: '2027-01-22',
    end_date: '2027-01-23',
    venue: 'Shri Pandurang Pratishthan Cultural Amphitheatre',
    desc: 'Enthralling multi-cultural stage presentations including traditional folk dances, theatrical plays, orchestral music, and academic awards.'
  }
];

export const DEFAULT_NOTICES = [
  {
    id: 1,
    title: 'Admissions Open for Academic Session 2026–27 (Nursery to Grade 10)',
    category: 'Admissions',
    notice_date: '2026-02-01',
    body: 'Applications are invited for admissions into Pre-Primary (Nursery, Jr. & Sr. KG), Primary (Grades 1-5), and Secondary School (Grades 6-10). Prospectus available at both Isbavi and Shelve campus admission desks.'
  },
  {
    id: 2,
    title: 'Term-1 Evaluation & Continuous Assessment Schedule',
    category: 'Academics',
    notice_date: '2026-09-12',
    body: 'The schedule for Term-1 pen-and-paper assessments and internal continuous evaluation (CCE) portfolio checks for Grades 1 to 10 has been finalized. Parents are requested to review datesheets in school diaries.'
  },
  {
    id: 3,
    title: 'Inter-School Science Olympiad & Talent Search Registration',
    category: 'Competitions',
    notice_date: '2026-06-08',
    body: 'Students from Grades 3 to 10 interested in participating in the State Science Olympiad can register their names with the STEM wing coordinator before the closing date.'
  },
  {
    id: 4,
    title: 'School Bus Route Updates & Transport Safety Verification',
    category: 'Transport',
    notice_date: '2026-06-01',
    body: 'GPS sensor and speed governor safety audits for all school buses serving Pandharpur, Korti, Gadegaon, and surrounding feeder routes have been certified for the academic year.'
  },
  {
    id: 5,
    title: 'Celebration of International Yoga Day & Morning Wellness Drill',
    category: 'Events',
    notice_date: '2026-06-20',
    body: 'Students from Kindergarten through Grade 10 along with faculty will participate in the mass Yoga & Surya Namaskar demonstration on 21st June from 07:00 AM at the sports arena.'
  }
];

export const DEFAULT_MANDATORY_DISCLOSURES = {
  muhs: [
    {
      year: '2025-26',
      documents: [
        { id: 1, title: 'School Affiliation Certificate & CBSE/State Board Registration Orders', file_url: null },
        { id: 2, title: 'Self-Certification / Proforma of Mandatory Public Disclosure', file_url: null },
        { id: 3, title: 'School Managing Committee (SMC) Constitution Order', file_url: null },
        { id: 4, title: 'Parent-Teacher Association (PTA) Registration & Office Bearers', file_url: null },
        { id: 5, title: 'Building Safety & Structural Stability Certificate', file_url: null },
        { id: 6, title: 'Fire Safety Certificate from Competent Authority', file_url: null },
        { id: 7, title: 'Safe Drinking Water and Sanitary Condition Certificate', file_url: null }
      ]
    },
    {
      year: '2024-25',
      documents: [
        { id: 8, title: 'School Renewal of Affiliation Orders', file_url: null },
        { id: 9, title: 'Annual Land & Campus Infrastructure Certificate', file_url: null },
        { id: 10, title: 'District Education Officer (DEO) Inspection Report', file_url: null }
      ]
    }
  ],
  policies: [
    {
      id: 1,
      title: 'Student Code of Conduct & Campus Discipline Policy',
      desc: 'Standards of punctuality, uniform adherence, mutual respect, device regulation, and zero tolerance for bullying or harassment.',
      file_url: null
    },
    {
      id: 2,
      title: 'Child Protection & POCSO Compliance Policy',
      desc: 'Mandatory guidelines for student physical and emotional safety, background verification of staff, and immediate reporting mechanisms.',
      file_url: null
    },
    {
      id: 3,
      title: 'Internal Complaints & Anti-Harassment Bylaws',
      desc: 'Formal grievance redressal procedure ensuring dignified, fair, and prompt inquiry into any safety or workplace concern.',
      file_url: null
    },
    {
      id: 4,
      title: 'Parent-Teacher Communication & Grievance Guidelines',
      desc: 'Transparent avenues for parent feedback, grievance escalation, visiting protocols, and constructive collaboration.',
      file_url: null
    }
  ],
  approvals: [
    {
      id: 1,
      authority: 'Government of Maharashtra / School Education Dept.',
      title: 'No Objection Certificate (NOC) and School Recognition Order',
      file_url: null
    },
    {
      id: 2,
      authority: 'Shri Pandurang Pratishthan, Pandharpur',
      title: 'Trust Registration & Institutional Governance Charter',
      file_url: null
    },
    {
      id: 3,
      authority: 'Municipal Corporation / Town Planning Pandharpur',
      title: 'Campus Land & Building Completion Certification',
      file_url: null
    },
    {
      id: 4,
      authority: 'Fire Safety & Disaster Management Dept.',
      title: 'Annual Fire Safety & Emergency Evacuation Clearance',
      file_url: null
    }
  ],
  reports: [
    {
      id: 1,
      year: '2024-25',
      title: 'Annual Audited Financial Statement & Balance Sheet',
      status: 'Audited',
      file_url: null
    },
    {
      id: 2,
      year: '2023-24',
      title: 'Annual Audited Financial Statement & Compliance Report',
      status: 'Audited',
      file_url: null
    },
    {
      id: 3,
      year: '2022-23',
      title: 'Institutional Audit & Utilization Statement',
      status: 'Audited',
      file_url: null
    }
  ]
};

export const DEFAULT_ACADEMICS_DATA = {
  overview: {
    title: 'Academic Programs & Curriculum Framework',
    lead: 'Holistic curriculum aligned with CBSE and Maharashtra State Board standards from Pre-Primary to Grade 10.'
  },
  years: [
    { key: 'pre-primary', label: 'Pre-Primary Wing (Nursery - Sr. KG)', description: 'Early childhood foundational stage focusing on phonics, motor skills, sensory play, and joyful socialization.' },
    { key: 'primary', label: 'Primary School (Grades 1 to 5)', description: 'Preparatory stage building strong foundations in literacy, numeracy, environmental science, and creative arts.' },
    { key: 'secondary', label: 'Secondary School (Grades 6 to 10)', description: 'Middle and secondary stage emphasizing analytical reasoning, science practicals, advanced mathematics, and board exam distinction.' }
  ],
  subjects: [],
  events: [],
  notices: [],
  results: [],
  policies: []
};

export const DEFAULT_RESEARCH_DATA = {
  overview: {
    title: 'Science, STEM & Innovation Hub',
    lead: 'Promoting scientific inquiry, hands-on experiments, and robotics tinkering across all school grades.'
  },
  centers: [],
  projects: [],
  publications: [],
  patents: [],
  scholars: [],
  funded_projects: [],
  conferences: [],
  journals: {},
  achievements: []
};

export const DEFAULT_PLACEMENT_DATA = {
  cell_info: {
    title: 'Career Guidance & Higher Education Cell',
    lead: 'Guiding students toward prestigious higher secondary colleges, competitive examinations, and career choices.'
  },
  officer: {
    name: 'Career Counseling Desk',
    designation: 'Student Guidance Counselor',
    email: 'vijaymadane3@gmail.com',
    phone: '+91-8459863477'
  }
};

export function createDefaultCourseAdmission(course) {
  return {
    overview: `Admission guidelines for ${course?.name || 'Academic Program'}.`,
    eligibility: ['Age criteria as per norms', 'Previous academic progress records'],
    process: ['Submit enquiry', 'Verification', 'Interaction', 'Enrollment'],
    documents: ['Birth certificate / TC', 'Report card', 'Aadhaar copy'],
    fees: 'As per school prospectus'
  };
}

export function getCourseAdmissionData(course) {
  return createDefaultCourseAdmission(course);
}





