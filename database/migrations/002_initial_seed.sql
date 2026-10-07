-- ========================================================
-- Karmayogi Vidyaniketan / Karmayogi Public School - Database Seeds
-- Shri Pandurang Pratishthan, Pandharpur
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB 10.3+
-- Default Admin Account: admin@karmayogividyaniketan.com / Admin@2026#
-- ========================================================

SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Users (Admin)
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `permissions`, `is_active`) VALUES
(1, 'Administrator', 'devkarma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', '["*"]', 1),
(2, 'Local Administrator', 'admin@test.com', '$2y$10$5GzQeYyM8rW.i61KxZk9ce3X/k6G4v9r0J61F4fK9z6Y4a3cK2a2y', 'superadmin', '["*"]', 1),
(3, 'School Administrator', 'admin@karmayogividyaniketan.com', '$2y$10$k0I.ajd58X6FFzQSnusDJePPeOTOrPkPArlEuPRUFIRwVaI1sP2OS', 'superadmin', '["*"]', 1)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `role` = VALUES(`role`), `permissions` = VALUES(`permissions`);

-- --------------------------------------------------------
-- Settings (Institutional Profile)
-- --------------------------------------------------------
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('college_name', 'Karmayogi Vidyaniketan'),
('school_subname', 'Karmayogi Public School'),
('foundation_name', 'Shri Pandurang Pratishthan, Pandharpur'),
('college_address', 'Primary Campus: Behind MSEDCL Division Office, Link Road, Isbavi | High School Campus: Shelve, Pandharpur - 413304'),
('college_phone', '+91-8459863477'),
('college_phone_alt1', '+91-9527632033'),
('college_phone_alt2', '+91-8788642412'),
('college_email', 'vijaymadane3@gmail.com'),
('college_website', 'www.karmayogividyaniketan.com'),
('affiliation_line_1', 'Managed by Shri Pandurang Pratishthan, Pandharpur'),
('affiliation_line_2', 'English Medium | Co-Educational | Nursery to Grade 10'),
('affiliation_line_3', 'CBSE & Maharashtra State Board Curriculum Tracks'),
('affiliation_line_4', 'Safe GPS-Monitored School Bus Fleet Covering Pandharpur & Environs'),
('affiliation_line_5', 'Office Hours: Mon–Sat 8:00 AM – 2:00 PM (Sunday Closed)')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- --------------------------------------------------------
-- Academic Wings & Departments
-- --------------------------------------------------------
INSERT INTO `departments` (`id`, `name`, `slug`, `head`, `academic_year`, `tagline`, `description`, `specializations`, `subject_count`, `image_url`, `order_index`, `is_active`) VALUES
(1, 'Pre-Primary Wing (Early Childhood)', 'pre-primary-wing', 'Mrs. Sunita S. Kadam', 'pre-primary', 'Play-Way Foundational Pedagogy & Sensory Discovery', 'A warm, nurturing environment for Nursery, Jr. KG, and Sr. KG children developing phonics, motor skills, and joyful socialization.', '["Montessori Play-Way Corners", "Jolly Phonics Reading", "Foundational Numeracy & Blocks", "Sensory Art & Storytelling"]', 5, 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=640&q=80', 1, 1),
(2, 'Primary School Wing', 'primary-school-wing', 'Mr. Ramesh D. More', 'primary', 'Conceptual Mastery, Literacy & Numeracy Excellence', 'Grades 1 through 5 combining core academic subjects with experiential science, mathematics manipulatives, and creative arts.', '["Interactive Smart Classrooms", "Mental Mathematics & Puzzles", "English Communicative Fluency", "Environmental Studies (EVS)"]', 6, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=640&q=80', 2, 1),
(3, 'Secondary School Wing', 'secondary-school-wing', 'Mrs. Anita P. Patil', 'secondary', 'Analytical Rigor, Science Inquiries & Board Distinction', 'Grades 6 through 10 preparing students for academic distinction, scientific method mastery, and board examination success.', '["CBSE & State Board Preparation", "Comprehensive Science Practicals", "Advanced Algebra & Geometry", "Social Sciences & Civics"]', 6, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=640&q=80', 3, 1),
(4, 'Science & STEM Laboratories', 'science-stem-labs', 'Mrs. Anita P. Patil', 'secondary', 'Experiential Experiments, Physics, Chemistry & Biology', 'State-of-the-art laboratory spaces equipped with apparatus, safety gear, models, and specimens for hands-on student experimentation.', '["Physics Mechanics & Optics Lab", "Chemistry Reaction Benches", "Biology Microscopy & Specimen Zone", "Math Manipulatives Studio"]', 4, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=640&q=80', 4, 1),
(5, 'Computer Science, AI & Robotics Lab', 'computer-ai-robotics', 'Mrs. Manisha V. Kulkarni', 'secondary', 'Coding, Robotics Tinkering & 21st-Century Digital Literacy', 'High-speed networked computer studio with Arduino kits, microcontrollers, and modern software teaching algorithms and creative coding.', '["Scratch & Python Programming", "Arduino Microcontroller Kits", "AI & Robotics Prototyping", "Cyber Safety & Internet Ethics"]', 4, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640&q=80', 5, 1),
(6, 'Sports & Physical Education Wing', 'sports-physical-education', 'Mr. Pravin K. Jadhav', 'secondary', 'Athletics, Traditional Indian Sports, Yoga & Character', 'Expansive outdoor grounds and indoor arenas developing athletic stamina, teamwork, sportsmanship, and physical health.', '["400m Athletic Track & Football", "Cricket Pitches & Nets", "Kho-Kho & Kabaddi Mud Courts", "Daily Yoga & Self-Defense"]', 4, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=640&q=80', 6, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `academic_year` = VALUES(`academic_year`), `head` = VALUES(`head`), `tagline` = VALUES(`tagline`), `description` = VALUES(`description`), `specializations` = VALUES(`specializations`);

-- --------------------------------------------------------
-- Faculty & Educators
-- --------------------------------------------------------
INSERT INTO `faculty` (`id`, `department_id`, `name`, `designation`, `qualification`, `specialization`, `experience`, `email`, `photo`, `profile_description`, `order_index`, `is_active`) VALUES
(1, 2, 'Mr. Vijay Madane', 'Principal & Director of Academics', 'M.Sc., M.Ed., Ph.D. (Pursuing)', 'School Governance & Pedagogical Science', '18 Years', 'vijaymadane3@gmail.com', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 'Dedicated educational leader steering holistic child development and value-based education.', 1, 1),
(2, 1, 'Mrs. Sunita S. Kadam', 'Pre-Primary Wing Coordinator', 'M.A., B.Ed., ECCEd', 'Early Childhood Care & Play-Way Learning', '12 Years', 'preprimary@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Specializes in phonemic literacy, sensory play, and creating warm, encouraging foundational classrooms.', 2, 1),
(3, 2, 'Mr. Ramesh D. More', 'Primary School Coordinator', 'M.Sc. Mathematics, B.Ed.', 'Mental Math, Vedic Maths & Olympiads', '14 Years', 'primary@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Demystifies mathematics through interactive manipulatives, puzzles, and practical logic.', 3, 1),
(4, 3, 'Mrs. Anita P. Patil', 'Secondary Science & STEM Head', 'M.Sc. Physics, B.Ed.', 'Applied Science, STEM & Robotics Mentorship', '10 Years', 'stem@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80', 'Prepares students for National Science Olympiads and district innovation conclaves.', 4, 1),
(5, 3, 'Mr. Sachin B. Shinde', 'Head of English & Communicative Skills', 'M.A. English Literature, B.Ed.', 'Debating, Public Speaking & Creative Writing', '11 Years', 'english@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Builds confidence and eloquent communication in English through drama, debate, and elocution.', 5, 1),
(6, 6, 'Mr. Pravin K. Jadhav', 'Director of Physical Education & Sports', 'M.P.Ed., NIS Athletic Coach', 'Athletics, Football, Kabaddi & Kho-Kho', '13 Years', 'sports@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Grooms high-endurance young athletes and champions across Solapur district school tournaments.', 6, 1),
(7, 5, 'Mrs. Manisha V. Kulkarni', 'Computer Science & AI Educator', 'MCA, B.Ed., Certified AI Teacher', 'Python, Scratch Coding & Robotics', '9 Years', 'computer@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Guides students into 21st-century coding literacy, robotics assembly, and cyber safety.', 7, 1),
(8, 3, 'Mr. Anand G. Deshmukh', 'Social Sciences & Heritage Teacher', 'M.A. History, B.Ed.', 'Indian History, Civics & Geography', '12 Years', 'social@karmayogividyaniketan.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Connects historical narratives and geographical wonders with real-world civic awareness.', 8, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------
-- Academic Grades & Wings (Courses table)
-- --------------------------------------------------------
INSERT INTO `courses` (`id`, `code`, `name`, `degree_level`, `duration`, `eligibility`, `intake`, `fees`, `description`, `status`, `order_index`) VALUES
(1, 'PRE-PRIMARY', 'Pre-Primary Wing (Nursery, Jr. KG, Sr. KG)', 'Foundational', '3 Years (Ages 3 to 6)', 'Minimum 3 years of age for Nursery as of 31st December', 'Small Batches', 'Transparent & Affordable', 'Joyful foundational stage emphasizing phonics, motor skills, sensory play, and early socialization.', 'Active', 1),
(2, 'PRIMARY', 'Primary School (Grades 1 to 5)', 'Preparatory', '5 Years (Grades 1 to 5)', 'Age 6+ for Grade 1 / Promotion from preceding grade', 'Multiple Sections', 'Transparent & Affordable', 'Strong grounding in reading, writing, mathematical fluency, environmental curiosity, and creative arts.', 'Active', 2),
(3, 'SECONDARY', 'Secondary School (Grades 6 to 10)', 'Secondary', '5 Years (Grades 6 to 10)', 'Pass certificate / Transfer Certificate from recognized school', 'Multiple Sections', 'Transparent & Affordable', 'Analytical thinking, science laboratories, computer coding, STEM robotics, and board exam distinction.', 'Active', 3)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- --------------------------------------------------------
-- School Notices
-- --------------------------------------------------------
INSERT INTO `notices` (`id`, `title`, `category`, `body`, `file_url`, `notice_date`, `expiry_date`, `is_published`, `is_featured`) VALUES
(1, 'Admissions Open for Academic Session 2026–27 (Nursery to Grade 10)', 'Admissions', 'Applications are invited for admissions into Pre-Primary (Nursery, Jr. & Sr. KG), Primary (Grades 1-5), and Secondary School (Grades 6-10). Prospectus available at both Isbavi and Shelve campus admission desks.', NULL, '2026-02-01', '2026-08-31', 1, 1),
(2, 'Term-1 Evaluation & Continuous Assessment Schedule', 'Academics', 'The schedule for Term-1 pen-and-paper assessments and internal continuous evaluation (CCE) portfolio checks for Grades 1 to 10 has been finalized. Parents are requested to review datesheets in school diaries.', NULL, '2026-09-12', '2026-10-31', 1, 1),
(3, 'Inter-School Science Olympiad & Talent Search Registration', 'Competitions', 'Students from Grades 3 to 10 interested in participating in the State Science Olympiad can register their names with the STEM wing coordinator before the closing date.', NULL, '2026-06-08', '2026-07-15', 1, 0),
(4, 'School Bus Route Updates & Transport Safety Verification', 'Transport', 'GPS sensor and speed governor safety audits for all school buses serving Pandharpur, Korti, Gadegaon, and surrounding feeder routes have been certified for the academic year.', NULL, '2026-06-01', '2026-07-31', 1, 0),
(5, 'Celebration of International Yoga Day & Morning Wellness Drill', 'Events', 'Students from Kindergarten through Grade 10 along with faculty will participate in the mass Yoga & Surya Namaskar demonstration on 21st June from 07:00 AM at the sports arena.', NULL, '2026-06-20', '2026-06-25', 1, 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- School Events
-- --------------------------------------------------------
INSERT INTO `events` (`id`, `title`, `event_type`, `date`, `time`, `venue`, `description`, `image_url`, `is_published`) VALUES
(1, 'Karmotsav 2026 - Annual Sports & Athletic Meet', 'Sports', '2026-12-18', '08:00 AM - 04:30 PM', 'Shelve Campus Main Athletic Ground', 'Grand 3-day annual athletic championship featuring march-past by all four houses, track and field finals, and championship trophy award ceremony.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=640&q=80', 1),
(2, 'Science, STEM & Robotics Innovation Expo', 'Academic', '2026-11-10', '09:30 AM - 03:30 PM', 'Raman Science & AI Laboratories, Both Campuses', 'Showcase of inventive student projects, working robotics models, DIY sensor circuits, and eco-friendly technological solutions by Grades 3 to 10.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=640&q=80', 1),
(3, 'Student Council Investiture Ceremony', 'Leadership', '2026-07-15', '10:00 AM - 12:30 PM', 'Main School Auditorium, Shelve', 'Formal swearing-in ceremony of Head Boy, Head Girl, House Captains, and student prefects, handing over official badges and house flags.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=640&q=80', 1),
(4, 'Parent-Teacher Orientation & Progress Forum (PTM)', 'Meeting', '2026-09-05', '09:00 AM - 01:00 PM', 'Isbavi (Primary) & Shelve (High School)', 'Collaborative parent-teacher consultation to review student learning growth, developmental milestones, and individualized academic goals.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=640&q=80', 1),
(5, 'Annual Cultural Gathering & Kalotsav Prize Distribution', 'Cultural', '2027-01-22', '05:00 PM - 09:30 PM', 'Shri Pandurang Pratishthan Cultural Amphitheatre', 'Enthralling multi-cultural stage presentations including traditional folk dances, theatrical plays, orchestral music, and academic awards.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=640&q=80', 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- Gallery Categories
-- --------------------------------------------------------
INSERT INTO `gallery_categories` (`id`, `name`, `slug`) VALUES
(1, 'Campus & Architecture', 'campus'),
(2, 'Smart Classrooms', 'classrooms'),
(3, 'Laboratories & STEM', 'laboratories'),
(4, 'Sports & Athletics', 'sports'),
(5, 'Events & Celebrations', 'events'),
(6, 'Cultural Activities', 'cultural-activities'),
(7, 'Transportation & Fleet', 'transport')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------
-- Gallery Items
-- --------------------------------------------------------
INSERT INTO `gallery` (`id`, `category_id`, `title`, `description`, `image_url`, `order_index`, `is_published`) VALUES
(1, 1, 'Shelve High School Campus', 'Sprawling green school campus and modern academic building', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', 1, 1),
(2, 2, 'Interactive Smart Classroom', 'Multimedia digital boards fostering active student learning', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', 2, 1),
(3, 3, 'Science Experimentation Laboratory', 'Hands-on practical physics and chemistry investigations', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', 3, 1),
(4, 3, 'AI & Robotics Tinkering Studio', 'Students assembling electronic microcontroller models', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 4, 1),
(5, 4, 'Annual Track & Field Sports Day', 'Spirited 100m sprint race on grass athletic tracks', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', 5, 1),
(6, 4, 'Football & Cricket Nets', 'Students engaged in coached outdoor team sports', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', 6, 1),
(7, 5, 'Independence Day Tricolor Flag Hoisting', 'Solemn parade by student prefects and scout guides', 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80', 7, 1),
(8, 6, 'Annual Gathering Karmotsav Performances', 'Traditional folk dance and cultural presentations', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 8, 1),
(9, 7, 'School Bus Transportation Fleet', 'GPS-monitored yellow school buses serving Pandharpur and neighboring routes', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 9, 1),
(10, 1, 'Isbavi Foundation & Primary Campus', 'Serene child-friendly campus on Link Road, Pandharpur', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 10, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- School Facilities
-- --------------------------------------------------------
INSERT INTO `facilities` (`id`, `title`, `slug`, `category`, `description`, `image_url`, `order_index`, `is_active`) VALUES
(1, 'Smart Classrooms', 'smart-classrooms', 'Academic', 'Equipped with interactive smart boards, digital audio-visual resources, and ergonomic seating.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=640&q=80', 1, 1),
(2, 'Science Laboratories', 'science-labs', 'Academic', 'Dedicated, well-equipped physics, chemistry, and biology laboratories for safe practical experiments.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=640&q=80', 2, 1),
(3, 'AI & Robotics Lab', 'stem-robotics', 'Innovation', 'State-of-the-art computational studio with Arduino kits, microcontrollers, and coding software.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640&q=80', 3, 1),
(4, 'Sports Grounds & Outdoor Arenas', 'sports', 'Campus', 'Multi-lane running tracks, football ground, cricket nets, kabaddi mud courts, and volleyball setups.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=640&q=80', 4, 1),
(5, 'Central School Library', 'library', 'Academic', 'Rich collection of over 8,000 curriculum texts, reference encyclopedias, and quiet reading zones.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=640&q=80', 5, 1),
(6, 'Digital Media & AV Hall', 'digital-av-hall', 'Academic', 'Spacious audio-visual hall for seminars, educational screenings, storytelling, and student assemblies.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=640&q=80', 6, 1),
(7, 'School Bus Transportation', 'transport', 'Campus', 'Fleet of GPS-monitored yellow school buses with female attendants connecting Pandharpur and nearby towns.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=640&q=80', 7, 1)
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`);

-- --------------------------------------------------------
-- Admissions Content
-- --------------------------------------------------------
INSERT INTO `admissions` (`id`, `section_key`, `title`, `content`, `meta_data`, `order_index`) VALUES
(1, 'process', 'Admission Process', 'Admissions to Karmayogi Vidyaniketan / Karmayogi Public School are open for Nursery through Grade 10. Parents can collect the prospectus and admission forms from either the Isbavi or Shelve campus office or apply online.', '{"steps": ["Step 1: Submit online or campus enquiry", "Step 2: Collect & fill admission form", "Step 3: Document verification (TC, Birth Certificate, Aadhaar)", "Step 4: Informal student interaction / readiness assessment", "Step 5: Fee payment & enrollment confirmation"]}', 1),
(2, 'eligibility', 'Age & Grade Eligibility Criteria', 'Clear age and promotional requirements as per Government and Board education directives.', '{"nursery": "Age 3+ as on 31st December", "junior_kg": "Age 4+ as on 31st December", "senior_kg": "Age 5+ as on 31st December", "grade_1": "Age 6+ completed as on 31st December", "grades_2_to_10": "Promotion certificate & Transfer Certificate (TC) from recognized school"}', 2),
(3, 'dates', 'Key Admission Schedule', 'Key schedule milestones for the upcoming 2026–27 school academic session.', '{"events": [{"label": "Admissions Desk Opens", "date": "1st February 2026"}, {"label": "Interaction & Campus Tours", "date": "February – May 2026"}, {"label": "School Term Reopening", "date": "June 2026"}]}', 3),
(4, 'fees', 'Fee Structure & Transparency', 'Karmayogi Vidyaniketan maintains an affordable, transparent fee structure approved by school management without capitation fees or hidden charges. Installment payment facilities and government scholarship assistance are available.', '{"transparent_fees": true, "installments_available": true}', 4)
ON DUPLICATE KEY UPDATE `section_key` = VALUES(`section_key`);

-- --------------------------------------------------------
-- Sample School Contact Message
-- --------------------------------------------------------
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 'Ramesh Patil', 'ramesh.patil@example.com', '+91 98765 43210', 'Inquiry regarding Grade 5 Admission & Bus Transportation', 'Hello, we would like to know the admission process and bus transportation details for our son for the upcoming academic year 2026-27.', 'unread')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);
