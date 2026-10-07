-- ========================================================
-- College of Physiotherapy - Database Seeds
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB 10.3+
-- Default Admin Account: admin@vikhepatil.org / Admin@2026#
-- ========================================================

SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Users (Admin)
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`) VALUES
(1, 'System Administrator', 'admin@vikhepatil.org', '$2y$10$k0I.ajd58X6FFzQSnusDJePPeOTOrPkPArlEuPRUFIRwVaI1sP2OS', 'admin', 1)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- --------------------------------------------------------
-- Settings
-- --------------------------------------------------------
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('college_name', 'KARMAYOGI COLLEGE OF PHYSIOTHERAPY'),
('foundation_name', 'Shri Pandurang Pratishthan\'s'),
('college_address', 'Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS), India - 413304'),
('college_phone', '+91 2186 216 000'),
('college_email', 'kcop@karmayogi.org.in'),
('college_website', 'www.karmayogiphysio.org.in'),
('affiliation_line_1', 'Affiliated to Maharashtra University of Health Sciences, Nashik, Approved by Govt. of Maharashtra'),
('affiliation_line_2', 'Approved by Directorate of Medical Education and Research (DMER), Mumbai'),
('affiliation_line_3', 'Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS) - 413304.'),
('affiliation_line_4', ''),
('affiliation_line_5', '')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- --------------------------------------------------------
-- Departments
-- --------------------------------------------------------
INSERT INTO `departments` (`id`, `name`, `slug`, `head`, `academic_year`, `tagline`, `description`, `specializations`, `subject_count`, `image_url`, `order_index`, `is_active`) VALUES
(1, 'Department of Foundational Medical Sciences', 'foundational-medical-sciences', 'Senior Medical Faculty Nominee', 'year-1', 'Human Anatomy, Physiology, Biochemistry, General Pathology & Foundational Sciences', 'Comprehensive preclinical education in human anatomy, physiology, and basic clinical sciences, forming the bedrock for diagnostic and rehabilitative competence.', '["Gross Human Anatomy & Histology", "Cardiovascular & Respiratory Physiology", "Exercise & Muscle Physiology", "General Pathology & Microbiology Foundations"]', 4, 'https://picsum.photos/seed/copfoundations/640/420', 1, 1),
(2, 'Department of Kinesiotherapy & Biomechanics', 'kinesiotherapy-biomechanics', 'Dr. N. D. Pawar', 'year-1', 'Human Movement Analysis, Joint Kinetics, Muscle Testing & Exercise Therapy', 'Dedicated to advancing understanding of human kinematics, kinesiological analysis, and therapeutic exercise prescription.', '["Kinematic & Kinetic Motion Analysis", "Manual Muscle Testing (MMT) & Goniometry", "Therapeutic Exercise Prescription & Progression", "Postural Alignment & Gait Cycle Assessment"]', 4, 'https://picsum.photos/seed/copkinesio/640/420', 2, 1),
(3, 'Department of Electrotherapy & Physical Agents', 'electrotherapy-physical-agents', 'Dr. K. A. Shinde', 'year-2', 'Therapeutic Modalities, Low/Medium/High Frequency Currents & Biophysical Radiation', 'Focuses on the physiological mechanisms, dosimetric parameters, and clinical applications of electrical stimulation, ultrasound, laser, and thermal agents.', '["Low Frequency Neuromuscular Stimulation (Faradic & Galvanic)", "Medium Frequency Therapy (Interferential Therapy - IFT)", "High Frequency & Thermal Modalities (SWD, Microwave & Therapeutic Ultrasound)", "Phototherapy (Class 3B/4 Laser Therapy & Infrared Irradiation)"]', 4, 'https://picsum.photos/seed/copelectro/640/420', 3, 1),
(4, 'Department of Musculoskeletal Physiotherapy', 'musculoskeletal-physiotherapy', 'Dr. A. B. Deshmukh', 'year-3', 'Specialized Orthopedic Assessment, Joint Mobilization & Musculoskeletal Rehabilitation', 'Dedicated to advancing the clinical diagnosis, manual therapy, and therapeutic rehabilitation of conditions affecting the musculoskeletal system.', '["Spinal Assessment & Manual Therapy (Cervical, Thoracic & Lumbo-Pelvic)", "Peripheral Joint Mobilization & Manipulation", "Post-Surgical Orthopedic Rehabilitation (TKR, THR, Arthroscopy, Fracture Fixation)", "Soft Tissue Techniques, Myofascial Release & Trigger Point Therapy"]', 4, 'https://picsum.photos/seed/copmsk/640/420', 4, 1),
(5, 'Department of Neurological Physiotherapy', 'neurological-physiotherapy', 'Dr. S. K. Patil', 'year-3', 'Neuro-Rehabilitation, Stroke Recovery, Motor Control & Pediatric Neurology', 'Specializing in evidence-based rehabilitation of acute, subacute, and chronic conditions of the central and peripheral nervous systems.', '["Adult Neuro-Rehabilitation (Stroke, Traumatic Brain Injury & Spinal Cord Injury)", "Neuro-Developmental Therapy (NDT / Bobath) & PNF Techniques", "Movement Disorders Rehabilitation (Parkinson\'s Disease, Ataxia, Motor Neuron Diseases)", "Pediatric Physical Therapy (Cerebral Palsy, Spina Bifida & Developmental Delays)"]', 4, 'https://picsum.photos/seed/copneuro/640/420', 5, 1),
(6, 'Department of Cardiopulmonary Physiotherapy', 'cardiopulmonary-physiotherapy', 'Dr. M. R. Jadhav', 'year-4', 'Cardiorespiratory Care, ICU Physical Rehabilitation, Pulmonary Rehab & Critical Care', 'Dedicated to the prevention, acute management, and long-term rehabilitation of cardiac, vascular, and pulmonary disorders.', '["Intensive Care Unit (ICU) Chest Physiotherapy & Early Mobilization", "Phase I–IV Comprehensive Cardiac Rehabilitation", "Pulmonary Rehabilitation for COPD, Bronchial Asthma & Interstitial Lung Diseases", "Post-Operative Thoracic & Upper Abdominal Surgical Care"]', 4, 'https://picsum.photos/seed/copcardio/640/420', 6, 1),
(7, 'Department of Community Physiotherapy and Rehabilitation', 'community-physiotherapy', 'Dr. V. S. More', 'year-4', 'Community-Based Rehabilitation (CBR), Geriatric Care, Ergonomics & Rural Health Outreach', 'Bridges hospital-based medicine and public health, delivering preventive, curative, and rehabilitative physiotherapy to rural, semi-urban, and underserved populations.', '["Community-Based Rehabilitation (CBR) in Rural Maharashtra", "Geriatric Physical Therapy, Fall Prevention & Balance Retraining", "Occupational Health, Agricultural Ergonomics & Musculoskeletal Screening", "Women\'s Health, Antenatal/Postnatal Exercise & Pelvic Floor Rehabilitation"]', 4, 'https://picsum.photos/seed/copcommdept/640/420', 7, 1),
(8, 'Department of Sports Physiotherapy', 'sports-physiotherapy', 'Dr. P. N. Kale', 'year-4', 'Athletic Performance Enhancement, Sports Injury Prevention, On-Field Management & RTS', 'Specializes in the prevention, emergency on-field management, acute treatment, and progressive rehabilitation of injuries in competitive athletes.', '["On-Field Emergency Management, Taping & Acute Sports Trauma Protocol", "ACL & Complex Knee Ligament Reconstruction Rehabilitation", "Shoulder Rotator Cuff & Overhead Athlete Biomechanical Conditioning", "High-Performance Return-to-Sport (RTS) Testing & Functional Movement Screening"]', 4, 'https://picsum.photos/seed/copsportsdept/640/420', 8, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `academic_year` = VALUES(`academic_year`), `head` = VALUES(`head`), `tagline` = VALUES(`tagline`), `description` = VALUES(`description`), `specializations` = VALUES(`specializations`);

-- --------------------------------------------------------
-- Faculty
-- --------------------------------------------------------
INSERT INTO `faculty` (`id`, `department_id`, `name`, `designation`, `qualification`, `specialization`, `experience`, `email`, `photo`, `profile_description`, `order_index`, `is_active`) VALUES
(1, 1, 'Dr. R. V. Vikhe Patil', 'Principal & Professor', 'MPT (Orthopaedics), Ph.D.', 'Orthopaedic Rehabilitation', '28 years', 'principal@vikhepatil.org', 'https://picsum.photos/seed/principal/500/600', 'Eminent academician and researcher leading the institution since inception.', 1, 1),
(2, 1, 'Dr. A. B. Deshmukh', 'Professor & HOD', 'MPT (Ortho), PGDMT', 'Musculoskeletal & Manual Therapy', '22 years', 'deshmukh@vikhepatil.org', 'https://picsum.photos/seed/faculty1/500/600', 'Specialist in spine and peripheral joint manual therapy and research.', 2, 1),
(3, 2, 'Dr. S. K. Patil', 'Professor & HOD', 'MPT (Neuro), Ph.D.', 'Neurological Rehabilitation', '20 years', 'spatil@vikhepatil.org', 'https://picsum.photos/seed/faculty2/500/600', 'Extensive experience in stroke rehabilitation and neuro-developmental therapy.', 3, 1),
(4, 3, 'Dr. M. R. Jadhav', 'Associate Professor', 'MPT (Cardio-Pulmonary)', 'Critical Care & Pulmonary Rehab', '16 years', 'jadhav@vikhepatil.org', 'https://picsum.photos/seed/faculty3/500/600', 'Expert in cardiac rehabilitation and intensive care physiotherapy management.', 4, 1),
(5, 4, 'Dr. P. N. Kale', 'Associate Professor', 'MPT (Sports), Ph.D. (pursuing)', 'Sports Injuries & Biomechanics', '14 years', 'kale@vikhepatil.org', 'https://picsum.photos/seed/faculty4/500/600', 'Consultant sports physiotherapist for university and state athletic teams.', 5, 1),
(6, 5, 'Dr. V. S. More', 'Assistant Professor', 'MPT (Community)', 'Geriatric & Community Health', '11 years', 'more@vikhepatil.org', 'https://picsum.photos/seed/faculty5/500/600', 'Coordinator for rural community health outreach programs and health camps.', 6, 1),
(7, 1, 'Dr. K. A. Shinde', 'Assistant Professor', 'MPT (Orthopaedics)', 'Joint Mobilization & Ergonomics', '9 years', 'shinde@vikhepatil.org', 'https://picsum.photos/seed/faculty6/500/600', 'Focuses on clinical biomechanics and post-surgical rehabilitation.', 7, 1),
(8, 2, 'Dr. N. D. Pawar', 'Lecturer', 'MPT (Neuro)', 'Pediatric Physiotherapy', '7 years', 'pawar@vikhepatil.org', 'https://picsum.photos/seed/faculty7/500/600', 'Dedicated clinician in cerebral palsy and pediatric movement disorders.', 8, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------
-- Courses
-- --------------------------------------------------------
INSERT INTO `courses` (`id`, `code`, `name`, `degree_level`, `duration`, `eligibility`, `intake`, `fees`, `description`, `status`, `order_index`) VALUES
(1, 'BPT', 'Bachelor of Physiotherapy (BPT)', 'UG', '4 Years + 6 Months Internship', '10+2 (PCB) with NEET-UG qualification', '60 Seats', 'As per FRA norms', 'A comprehensive undergraduate program covering musculoskeletal, neurological, cardiopulmonary and community physiotherapy with extensive clinical exposure.', 'Active', 1),
(2, 'MPT', 'Master of Physiotherapy (MPT)', 'PG', '2 Years', 'BPT with 50% aggregate & internship completion', '15 Seats', 'As per FRA norms', 'Postgraduate specialization in Orthopaedics, Neurology, Cardiopulmonary and Sports Physiotherapy with research dissertation.', 'Active', 2),
(3, 'PHD', 'Ph.D. in Physiotherapy (Research)', 'PhD', '3–5 Years', 'MPT with valid entrance qualification', 'As per guide availability', 'As per University norms', 'Doctoral research program in movement sciences, rehabilitation and clinical physiotherapy under recognized guides.', 'Active', 3),
(4, 'CERT', 'Certificate & Short-term Courses', 'Certificate', '3–6 Months', 'As per course norms', '30 Seats', 'Nominal Course Fee', 'Value-added certificate courses in manual therapy, electrotherapy and rehabilitation techniques for students and practitioners.', 'Active', 4)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- --------------------------------------------------------
-- Notices
-- --------------------------------------------------------
INSERT INTO `notices` (`id`, `title`, `category`, `body`, `file_url`, `notice_date`, `expiry_date`, `is_published`, `is_featured`) VALUES
(1, 'Admission Notification – BPT A.Y. 2026–27', 'Admission', 'Applications are invited for admission to the Bachelor of Physiotherapy program for the academic year 2026–27. Candidates must have qualified NEET-UG. Prospectus and application forms are available at the college office.', NULL, '2026-09-22', '2026-11-30', 1, 1),
(2, 'Academic Calendar – Odd Semester 2026', 'Academic', 'The academic calendar for the odd semester of A.Y. 2026–27 has been released. Classes commence from 1st July 2026. Internal assessments and term-end examinations are scheduled as per the MUHS directives.', NULL, '2026-09-15', '2026-12-31', 1, 1),
(3, 'Examination Notice – MUHS Winter 2026', 'Examination', 'The examination forms for MUHS Winter 2026 session are open. Last date for form submission without fine is 10th October 2026. Students are advised to confirm their hall ticket details with the examination cell.', NULL, '2026-09-08', '2026-10-15', 1, 0),
(4, 'University Circular – Internship Guidelines', 'University', 'MUHS Nashik has issued updated internship guidelines for BPT students. All final year students must complete a compulsory 6-month rotating internship as per the revised schedule.', NULL, '2026-09-02', '2026-12-31', 1, 0),
(5, 'Student Notice – Anti-Ragging Committee Formation', 'Student', 'The Anti-Ragging Committee and Squad for A.Y. 2026–27 have been constituted as per UGC regulations. Students are directed to report any ragging incident to the committee immediately.', NULL, '2026-08-25', '2027-06-30', 1, 0),
(6, 'Important Announcement – NAAC Peer Team Visit', 'Announcement', 'The NAAC peer team visit is scheduled for October 2026. All departments are requested to update their records, files and portfolios well in advance.', NULL, '2026-08-18', '2026-10-31', 1, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- Events
-- --------------------------------------------------------
INSERT INTO `events` (`id`, `title`, `event_type`, `date`, `time`, `venue`, `description`, `image_url`, `is_published`) VALUES
(1, 'National Conference on Advances in Physiotherapy', 'Conference', '2026-10-05', '09:00 AM - 05:00 PM', 'College Auditorium', 'Two-day national conference on recent advances in physiotherapy and rehabilitation sciences.', 'https://picsum.photos/seed/copevent1/640/400', 1),
(2, 'Workshop on Manual Therapy Techniques', 'Workshop', '2026-10-14', '10:00 AM - 04:00 PM', 'Exercise Therapy Lab', 'Hands-on workshop on evidence-based manual therapy techniques for musculoskeletal conditions.', 'https://picsum.photos/seed/copevent2/640/400', 1),
(3, 'Guest Lecture: Sports Injury Rehabilitation', 'Guest Lecture', '2026-10-21', '11:00 AM - 01:00 PM', 'Seminar Hall', 'Guest lecture by eminent sports physiotherapist on modern rehabilitation protocols.', 'https://picsum.photos/seed/copevent3/640/400', 1),
(4, 'World Physiotherapy Day Celebrations', 'Event', '2026-11-02', '08:30 AM - 04:30 PM', 'College Campus', 'Awareness rally, free health check-up camp and community physiotherapy drive.', 'https://picsum.photos/seed/copevent4/640/400', 1),
(5, 'Inter-Collegiate Physiotherapy Quiz', 'Competition', '2026-11-18', '10:00 AM - 03:00 PM', 'College Auditorium', 'Annual inter-collegiate quiz competition on physiotherapy sciences.', 'https://picsum.photos/seed/copevent5/640/400', 1),
(6, 'Alumni Meet 2026', 'Event', '2026-12-09', '11:00 AM - 05:00 PM', 'College Campus', 'Annual alumni meet to strengthen the bond between alumni and institution.', 'https://picsum.photos/seed/copevent6/640/400', 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- Gallery Categories
-- --------------------------------------------------------
INSERT INTO `gallery_categories` (`id`, `name`, `slug`) VALUES
(1, 'Campus', 'campus'),
(2, 'Academic Activities', 'academic-activities'),
(3, 'Clinical Training', 'clinical-training'),
(4, 'Events', 'events'),
(5, 'Students', 'students'),
(6, 'Workshops', 'workshops'),
(7, 'Sports', 'sports')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------
-- Gallery Items
-- --------------------------------------------------------
INSERT INTO `gallery` (`id`, `category_id`, `title`, `description`, `image_url`, `order_index`, `is_published`) VALUES
(1, 1, 'Main Building', 'College administrative and academic complex', 'https://picsum.photos/seed/campus1/800/600', 1, 1),
(2, 2, 'Lecture Session', 'Interactive classroom session with digital aids', 'https://picsum.photos/seed/acad1/800/600', 2, 1),
(3, 3, 'Clinical Posting', 'Students examining patients at attached hospital', 'https://picsum.photos/seed/clin1/800/600', 3, 1),
(4, 4, 'Annual Day', 'Cultural performances at annual college gathering', 'https://picsum.photos/seed/event1/800/600', 4, 1),
(5, 5, 'Student Volunteers', 'Student council conducting health camp', 'https://picsum.photos/seed/stud1/800/600', 5, 1),
(6, 6, 'Manual Therapy Workshop', 'Practical spine mobilization demonstration', 'https://picsum.photos/seed/wksp1/800/600', 6, 1),
(7, 7, 'Annual Sports Meet', 'Inter-batch cricket and athletics tournament', 'https://picsum.photos/seed/sport1/800/600', 7, 1),
(8, 1, 'Library Block', 'Quiet reading hall and reference section', 'https://picsum.photos/seed/campus2/800/600', 8, 1),
(9, 2, 'Seminar Presentation', 'Postgraduate dissertation defense presentation', 'https://picsum.photos/seed/acad2/800/600', 9, 1),
(10, 3, 'OPD Training', 'Outpatient department hands-on patient rehabilitation', 'https://picsum.photos/seed/clin2/800/600', 10, 1),
(11, 4, 'Convocation', 'Graduation ceremony celebrating outgoing batch', 'https://picsum.photos/seed/event2/800/600', 11, 1),
(12, 6, 'Electrotherapy Demo', 'Hands-on training with latest ultrasound and laser units', 'https://picsum.photos/seed/wksp2/800/600', 12, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- --------------------------------------------------------
-- Facilities
-- --------------------------------------------------------
INSERT INTO `facilities` (`id`, `title`, `slug`, `category`, `description`, `image_url`, `order_index`, `is_active`) VALUES
(1, 'Physiotherapy Laboratories', 'labs', 'Academic', 'Well-equipped electrotherapy, exercise therapy and hydrotherapy labs with modern physiotherapy equipment.', 'https://picsum.photos/seed/coplab/640/420', 1, 1),
(2, 'Central Library', 'library', 'Academic', 'Rich collection of physiotherapy and medical textbooks, national and international journals with digital access.', 'https://picsum.photos/seed/coplib/640/420', 2, 1),
(3, 'Clinical Training Facilities', 'clinical', 'Clinical', 'Clinical postings at Dr. Vithalrao Vikhe Patil Hospital and affiliated hospitals for hands-on patient care.', 'https://picsum.photos/seed/copclin/640/420', 3, 1),
(4, 'Classrooms', 'classrooms', 'Academic', 'Spacious, ventilated lecture halls with audio-visual aids for effective teaching-learning.', 'https://picsum.photos/seed/copclass/640/420', 4, 1),
(5, 'Computer Laboratory', 'computer', 'Academic', 'Computer lab with internet facility, e-learning resources and research software support.', 'https://picsum.photos/seed/copcomp/640/420', 5, 1),
(6, 'Sports Facilities', 'sports', 'Campus', 'Indoor and outdoor sports facilities promoting physical fitness and all-round development.', 'https://picsum.photos/seed/copsport/640/420', 6, 1),
(7, 'Hostel', 'hostel', 'Residential', 'Separate, secure hostel accommodation for boys and girls with mess and recreational facilities.', 'https://picsum.photos/seed/cophostel/640/420', 7, 1),
(8, 'Hospital / Clinical Facilities', 'hospital', 'Clinical', 'Attached hospital with OPD, IPD and specialized physiotherapy services for community care.', 'https://picsum.photos/seed/cophosp/640/420', 8, 1)
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`);

-- --------------------------------------------------------
-- Admissions Content
-- --------------------------------------------------------
INSERT INTO `admissions` (`id`, `section_key`, `title`, `content`, `meta_data`, `order_index`) VALUES
(1, 'process', 'Admission Process', 'Admissions to the Bachelor of Physiotherapy (BPT) program are conducted through the centralized admission process of the Government of Maharashtra as per NEET-UG merit. MPT admissions are conducted through the respective entrance process. Candidates must complete the online application and document verification as per the official schedule.', '{"steps": ["Register online on State CET Cell portal", "Attend document verification at designated centre", "Fill college options preferences", "Report to college on seat allotment with original documents"]}', 1),
(2, 'eligibility', 'Eligibility Criteria', 'Detailed eligibility criteria for prospective candidates across all programs.', '{"bpt": "10+2 with Physics, Chemistry and Biology with NEET-UG qualification.", "mpt": "BPT degree with minimum 50% aggregate and completion of compulsory 6-month rotating internship.", "phd": "MPT degree with valid university entrance test clearance or equivalent."}', 2),
(3, 'dates', 'Important Dates', 'Key schedule milestones for the upcoming admission session.', '{"events": [{"label": "Application forms available", "date": "From 1st June 2026"}, {"label": "Document verification", "date": "June – July 2026"}, {"label": "Commencement of classes", "date": "1st August 2026"}]}', 3),
(4, 'fees', 'Fee Structure', 'The fee structure is prescribed by the Fee Regulating Authority (FRA), Maharashtra, and revised periodically. The detailed fee breakdown including tuition, library, gymkhana, and exam fees is published annually.', '{"fra_approved": true, "brochure_available": true}', 4)
ON DUPLICATE KEY UPDATE `section_key` = VALUES(`section_key`);

-- --------------------------------------------------------
-- CMS Pages
-- --------------------------------------------------------
INSERT INTO `pages` (`id`, `slug`, `title`, `banner_url`, `excerpt`, `content_html`, `meta_title`, `meta_description`) VALUES
(1, 'about', 'About the College', 'https://picsum.photos/seed/copabout/1600/400', 'Established under Shri Pandurang Pratishthan with the vision of providing excellence in physiotherapy education and healthcare.', '<p>Shri Pandurang Pratishthan\'s Karmayogi College of Physiotherapy, Shelve, Pandharpur, Dist. Solapur, was established with the vision of providing high-quality physiotherapy education and healthcare to the region. The college is affiliated to the Maharashtra University of Health Sciences, Nashik, and is approved by the Government of Maharashtra.</p><p>Approved by the Directorate of Medical Education and Research (DMER), Mumbai, the institution provides world-class academic training, advanced clinical laboratories, and comprehensive clinical exposure.</p><h3>Vision</h3><p>To be a premier institute of excellence in physiotherapy education, evidence-based clinical rehabilitation, and community healthcare.</p><h3>Mission</h3><p>To impart state-of-the-art physiotherapy training, nurture ethical medical professionals, and deliver compassionate, accessible rehabilitation services to all sections of society.</p>', 'About Us | Karmayogi College of Physiotherapy', 'Learn about Shri Pandurang Pratishthan\'s Karmayogi College of Physiotherapy, Shelve, Pandharpur.'),
(2, 'academics', 'Academic Programs & Curriculum', 'https://picsum.photos/seed/copacad/1600/400', 'Accredited undergraduate and postgraduate programs under Maharashtra University of Health Sciences.', '<p>The college offers comprehensive education adhering to the latest curriculum framed by Maharashtra University of Health Sciences (MUHS), Nashik. With structured credit-based curricula, semester assessments, and comprehensive practical postings, our students attain rigorous clinical competence.</p><h3>Curriculum & Syllabus</h3><p>The BPT curriculum integrates core biomedical sciences with clinical physiotherapy including Musculoskeletal, Neurology, Cardio-Respiratory, and Community health.</p><h3>Academic Calendar</h3><p>The academic term begins in July and concludes with the university examinations in winter and summer sessions.</p>', 'Academics | College of Physiotherapy', 'Academic programs, curriculum, calendar and exam structure.'),
(3, 'research', 'Research & Development', 'https://picsum.photos/seed/copresearch/1600/400', 'Promoting evidence-based clinical research in rehabilitation and movement sciences.', '<p>The Research & Development cell fosters a culture of scientific inquiry among faculty and students. The department actively encourages publications in indexed journals, clinical trials, and inter-institutional research collaborations.</p><h3>Key Research Areas</h3><ul><li>Biomechanics and Gait Analysis in Neurological Disorders</li><li>Evidence-Based Manual Therapy in Chronic Musculoskeletal Conditions</li><li>Early Mobilization Protocols in Critical Care (ICU)</li><li>Ergonomic Assessments and Interventions for Rural Agricultural Workers</li></ul>', 'Research | College of Physiotherapy', 'Research activities, publications and clinical investigations.'),
(4, 'student-corner', 'Student Corner', 'https://picsum.photos/seed/copstudent/1600/400', 'Student life, council, anti-ragging cell, and extracurricular activities.', '<p>The college encourages holistic student growth through academic clubs, sports events, cultural festivals, and community outreach drives.</p><h3>Anti-Ragging Committee</h3><p>Zero tolerance policy against ragging. Any harassment will lead to immediate suspension and criminal prosecution as per UGC and State laws.</p><h3>Scholarships</h3><p>Eligible students can avail Government of Maharashtra scholarships, MahaDBT schemes, and merit-cum-means assistance.</p>', 'Student Corner | College of Physiotherapy', 'Student support, activities, scholarships and anti-ragging cell.'),
(5, 'training-placement', 'Training & Placement', 'https://picsum.photos/seed/copplacement/1600/400', 'Internships, career counseling and hospital recruitment opportunities.', '<p>Our dedicated Training & Placement Cell guides graduates into rewarding careers across leading multi-speciality hospitals, rehabilitation centres, sports academies, and academic institutions worldwide.</p><h3>Internship Postings</h3><p>Compulsory 6-month rotating internship conducted across Orthopaedics, Neurology, Intensive Care, Outpatient, and Rural Community centres.</p>', 'Training & Placement | College of Physiotherapy', 'Internship postings and career placements for physiotherapy students.'),
(6, 'iqac-naac', 'IQAC & NAAC Accreditation', 'https://picsum.photos/seed/copiqac/1600/400', 'Accredited with NAAC Grade \'A\' (CGPA 3.02) reflecting sustained institutional quality.', '<p>The Internal Quality Assurance Cell (IQAC) continuously benchmarks institutional quality across curriculum delivery, faculty development, research output, student performance, and clinical infrastructure.</p><h3>NAAC Grade \'A\'</h3><p>The institution is proudly accredited by the National Assessment and Accreditation Council (NAAC) with Grade \'A\' and a CGPA of 3.02.</p>', 'IQAC & NAAC | College of Physiotherapy', 'Quality assurance initiatives and NAAC accreditation documentation.'),
(7, 'hospital', 'Hospital & Clinical Services', 'https://picsum.photos/seed/cophosp2/1600/400', 'Direct clinical integration with Shri Pandurang Pratishthan Teaching Hospital at Shelve, Pandharpur.', '<p>The College of Physiotherapy functions in direct synergy with the attached multi-speciality hospital of Shri Pandurang Pratishthan, offering students unmatched hands-on clinical exposure from the first year onwards.</p><h3>Departments in Hospital</h3><ul><li>Musculoskeletal & Orthopaedic Rehabilitation OPD</li><li>Neuro-Physiotherapy & Stroke Rehabilitation Clinic</li><li>Cardiorespiratory ICU & Step-Down Care</li><li>Pediatric Rehabilitation & Child Guidance Unit</li><li>Community Outreach & Mobile Physiotherapy Van</li></ul>', 'Hospital & Clinical Services | College of Physiotherapy', 'Hands-on hospital training and clinical facilities.'),
(8, 'mandatory-disclosures', 'Mandatory Disclosures & Approvals', 'https://picsum.photos/seed/copdisc/1600/400', 'Statutory approvals, council affiliations and governance transparency.', '<p>In compliance with statutory requirements from UGC, MUHS Nashik, and Government of Maharashtra, institutional disclosures and affiliation documents are made publicly accessible.</p><ul><li>Affiliation Letter: MUHS Nashik</li><li>Approval: Govt. of Maharashtra</li><li>Approval: DMER, Mumbai</li><li>NAAC Certificate: Grade \'A\' (CGPA 3.02)</li><li>UGC 2(f) Recognition Order</li></ul>', 'Mandatory Disclosures | College of Physiotherapy', 'Statutory affiliations, council approvals and regulatory disclosures.')
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`);

-- --------------------------------------------------------
-- Sample Contact Message
-- --------------------------------------------------------
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43210', 'Inquiry regarding BPT 2026-27 Admission Process', 'Hello, I have passed 12th PCB and qualified NEET-UG. Could you please provide information regarding hostel facilities and admission schedule?', 'unread')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);
