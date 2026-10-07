-- ========================================================
-- Cleaned & Fixed Database Export for Hostinger phpMyAdmin
-- ========================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- phpMyAdmin SQL Dump
-- -------------------------------------------------------- version 5.2.2
-- -------------------------------------------------------- https://www.phpmyadmin.net/
-- --------------------------------------------------------
-- -------------------------------------------------------- Host: 127.0.0.1:3306
-- -------------------------------------------------------- Generation Time: Sep 26, 2026 at 12:58 PM
-- -------------------------------------------------------- Server version: 11.8.9-MariaDB-log
-- -------------------------------------------------------- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- -------------------------------------------------------- Database: `u495202283_phydb`
-- --------------------------------------------------------

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `admissions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `admissions`;
CREATE TABLE `admissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `section_key` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` mediumtext NOT NULL,
  `meta_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_data`)),
  `order_index` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `admissions`
-- --------------------------------------------------------

INSERT INTO `admissions` (`id`, `section_key`, `title`, `content`, `meta_data`, `order_index`, `updated_at`) VALUES
(1, 'process', 'Admission Process', 'Admissions to the Bachelor of Physiotherapy (BPT) program are conducted through the centralized admission process of the Government of Maharashtra as per NEET-UG merit. MPT admissions are conducted through the respective entrance process. Candidates must complete the online application and document verification as per the official schedule.', '{\"steps\": [\"Register online on State CET Cell portal\", \"Attend document verification at designated centre\", \"Fill college options preferences\", \"Report to college on seat allotment with original documents\"]}', 1, '2026-09-23 06:48:47'),
(2, 'eligibility', 'Eligibility Criteria', 'Detailed eligibility criteria for prospective candidates across all programs.', '{\"bpt\": \"10+2 with Physics, Chemistry and Biology with NEET-UG qualification.\", \"mpt\": \"BPT degree with minimum 50% aggregate and completion of compulsory 6-month rotating internship.\", \"phd\": \"MPT degree with valid university entrance test clearance or equivalent.\"}', 2, '2026-09-23 06:48:47'),
(3, 'dates', 'Important Dates', 'Key schedule milestones for the upcoming admission session.', '{\"events\": [{\"label\": \"Application forms available\", \"date\": \"From 1st June 2026\"}, {\"label\": \"Document verification\", \"date\": \"June – July 2026\"}, {\"label\": \"Commencement of classes\", \"date\": \"1st August 2026\"}]}', 3, '2026-09-23 06:48:47'),
(4, 'fees', 'Fee Structure', 'The fee structure is prescribed by the Fee Regulating Authority (FRA), Maharashtra, and revised periodically. The detailed fee breakdown including tuition, library, gymkhana, and exam fees is published annually.', '{\"fra_approved\": true, \"brochure_available\": true}', 4, '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `contact_messages`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `contact_messages`
-- --------------------------------------------------------

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43210', 'Inquiry regarding BPT 2026-27 Admission Process', 'Hello, I have passed 12th PCB and qualified NEET-UG. Could you please provide information regarding hostel facilities and admission schedule?', 'unread', NULL, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `courses`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `degree_level` enum('UG','PG','PhD','Certificate') NOT NULL DEFAULT 'UG',
  `duration` varchar(100) NOT NULL,
  `eligibility` text NOT NULL,
  `intake` varchar(100) NOT NULL DEFAULT 'As per sanctioned intake',
  `fees` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `syllabus_file` varchar(255) DEFAULT NULL,
  `status` enum('Active','Upcoming','Archived') NOT NULL DEFAULT 'Active',
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `courses`
-- --------------------------------------------------------

INSERT INTO `courses` (`id`, `code`, `name`, `degree_level`, `duration`, `eligibility`, `intake`, `fees`, `description`, `syllabus_file`, `status`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 'BPT', 'Bachelor of Physiotherapy (BPT)', 'UG', '4 Years + 6 Months Internship', '10+2 (PCB) with NEET-UG qualification', '60 Seats', 'As per FRA norms', 'A comprehensive undergraduate program covering musculoskeletal, neurological, cardiopulmonary and community physiotherapy with extensive clinical exposure.', NULL, 'Active', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(2, 'MPT', 'Master of Physiotherapy (MPT)', 'PG', '2 Years', 'BPT with 50% aggregate & internship completion', '15 Seats', 'As per FRA norms', 'Postgraduate specialization in Orthopaedics, Neurology, Cardiopulmonary and Sports Physiotherapy with research dissertation.', NULL, 'Active', 2, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 'PHD', 'Ph.D. in Physiotherapy (Research)', 'PhD', '3–5 Years', 'MPT with valid entrance qualification', 'As per guide availability', 'As per University norms', 'Doctoral research program in movement sciences, rehabilitation and clinical physiotherapy under recognized guides.', NULL, 'Active', 3, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'CERT', 'Certificate & Short-term Courses', 'Certificate', '3–6 Months', 'As per course norms', '30 Seats', 'Nominal Course Fee', 'Value-added certificate courses in manual therapy, electrotherapy and rehabilitation techniques for students and practitioners.', NULL, 'Active', 4, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `departments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `head` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `departments`
-- --------------------------------------------------------

INSERT INTO `departments` (`id`, `name`, `slug`, `head`, `description`, `image_url`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Musculoskeletal Physiotherapy', 'msk', 'Dr. A. B. Deshmukh', 'Specialized training in orthopaedic and musculoskeletal rehabilitation, manual therapy and sports injury management.', 'https://picsum.photos/seed/copmsk/640/420', 1, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(2, 'Neurological Physiotherapy', 'neuro', 'Dr. S. K. Patil', 'Rehabilitation of stroke, spinal cord injury, Parkinson\'s disease and pediatric neurological conditions.', 'https://picsum.photos/seed/copneuro/640/420', 2, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 'Cardiopulmonary Physiotherapy', 'cardio', 'Dr. M. R. Jadhav', 'Cardiac and pulmonary rehabilitation, ICU physiotherapy and post-operative respiratory care.', 'https://picsum.photos/seed/copcardio/640/420', 3, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'Sports Physiotherapy', 'sports', 'Dr. P. N. Kale', 'Sports injury prevention, on-field management and rehabilitation of athletes at all levels.', 'https://picsum.photos/seed/copsportsdept/640/420', 4, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(5, 'Community Physiotherapy', 'community', 'Dr. V. S. More', 'Community outreach programs, health camps and physiotherapy services in rural areas.', 'https://picsum.photos/seed/copcommdept/640/420', 5, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `events`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_type` varchar(100) NOT NULL DEFAULT 'Event',
  `date` date NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `venue` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `events`
-- --------------------------------------------------------

INSERT INTO `events` (`id`, `title`, `event_type`, `date`, `time`, `venue`, `description`, `image_url`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'National Conference on Advances in Physiotherapy', 'Conference', '2026-10-05', '09:00 AM - 05:00 PM', 'College Auditorium', 'Two-day national conference on recent advances in physiotherapy and rehabilitation sciences.', 'https://picsum.photos/seed/copevent1/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(2, 'Workshop on Manual Therapy Techniques', 'Workshop', '2026-10-14', '10:00 AM - 04:00 PM', 'Exercise Therapy Lab', 'Hands-on workshop on evidence-based manual therapy techniques for musculoskeletal conditions.', 'https://picsum.photos/seed/copevent2/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 'Guest Lecture: Sports Injury Rehabilitation', 'Guest Lecture', '2026-10-21', '11:00 AM - 01:00 PM', 'Seminar Hall', 'Guest lecture by eminent sports physiotherapist on modern rehabilitation protocols.', 'https://picsum.photos/seed/copevent3/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'World Physiotherapy Day Celebrations', 'Event', '2026-11-02', '08:30 AM - 04:30 PM', 'College Campus', 'Awareness rally, free health check-up camp and community physiotherapy drive.', 'https://picsum.photos/seed/copevent4/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(5, 'Inter-Collegiate Physiotherapy Quiz', 'Competition', '2026-11-18', '10:00 AM - 03:00 PM', 'College Auditorium', 'Annual inter-collegiate quiz competition on physiotherapy sciences.', 'https://picsum.photos/seed/copevent5/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(6, 'Alumni Meet 2026', 'Event', '2026-12-09', '11:00 AM - 05:00 PM', 'College Campus', 'Annual alumni meet to strengthen the bond between alumni and institution.', 'https://picsum.photos/seed/copevent6/640/400', 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `facilities`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `facilities`;
CREATE TABLE `facilities` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Academic',
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `facilities`
-- --------------------------------------------------------

INSERT INTO `facilities` (`id`, `title`, `slug`, `category`, `description`, `image_url`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Physiotherapy Laboratories', 'labs', 'Academic', 'Well-equipped electrotherapy, exercise therapy and hydrotherapy labs with modern physiotherapy equipment.', '/uploads/facilities/slider2_de916e195a34.png', 0, 1, '2026-09-23 06:48:47', '2026-09-23 15:01:36'),
(2, 'Central Library', 'library', 'Academic', 'Rich collection of physiotherapy and medical textbooks, national and international journals with digital access.', '/uploads/facilities/library_ce561cd48a7f.webp', 0, 1, '2026-09-23 06:48:47', '2026-09-24 04:30:50'),
(3, 'Clinical Training Facilities', 'clinical', 'Clinical', 'Clinical postings at Dr. Vithalrao Vikhe Patil Hospital and affiliated hospitals for hands-on patient care.', 'https://picsum.photos/seed/copclin/640/420', 3, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'Classrooms', 'classrooms', 'Academic', 'Spacious, ventilated lecture halls with audio-visual aids for effective teaching-learning.', '/uploads/facilities/slider3_0568817aca60.png', 0, 1, '2026-09-23 06:48:47', '2026-09-23 15:02:43'),
(5, 'Computer Laboratory', 'computer', 'Academic', 'Computer lab with internet facility, e-learning resources and research software support.', '/uploads/facilities/computer_lab_7923a2854722.webp', 0, 1, '2026-09-23 06:48:47', '2026-09-24 04:31:03'),
(6, 'Sports Facilities', 'sports', 'Campus', 'Indoor and outdoor sports facilities promoting physical fitness and all-round development.', 'https://picsum.photos/seed/copsport/640/420', 0, 1, '2026-09-23 06:48:47', '2026-09-23 15:00:35'),
(7, 'Hostel', 'hostel', 'Residential', 'Separate, secure hostel accommodation for boys and girls with mess and recreational facilities.', 'https://picsum.photos/seed/cophostel/640/420', 0, 1, '2026-09-23 06:48:47', '2026-09-23 15:00:55'),
(8, 'Hospital / Clinical Facilities', 'hospital', 'Clinical', 'Attached hospital with OPD, IPD and specialized physiotherapy services for community care.', 'https://picsum.photos/seed/cophosp/640/420', 8, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `faculty`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE `faculty` (
  `id` int(10) UNSIGNED NOT NULL,
  `department_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `experience` varchar(100) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `profile_description` text DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `faculty`
-- --------------------------------------------------------

INSERT INTO `faculty` (`id`, `department_id`, `name`, `designation`, `qualification`, `specialization`, `experience`, `email`, `phone`, `photo`, `profile_description`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Dr. Shiv Ganesh', 'Principal & Professor', 'MPT (Orthopaedics), Ph.D.', 'Orthopaedic Rehabilitation', '28 years', 'principalkcop@karmayogi.org.in', '', 'https://picsum.photos/seed/principal/500/600', 'Eminent academician and researcher leading the institution since inception.', 1, 1, '2026-09-23 06:48:47', '2026-09-24 05:14:57'),
(2, 1, 'Dr. A. B. Deshmukh', 'Professor & HOD', 'MPT (Ortho), PGDMT', 'Musculoskeletal & Manual Therapy', '22 years', 'deshmukhkcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty1/500/600', 'Specialist in spine and peripheral joint manual therapy and research.', 2, 1, '2026-09-23 06:48:47', '2026-09-24 05:12:09'),
(3, 2, 'Dr. S. K. Patil', 'Professor & HOD', 'MPT (Neuro), Ph.D.', 'Neurological Rehabilitation', '20 years', 'spatilkcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty2/500/600', 'Extensive experience in stroke rehabilitation and neuro-developmental therapy.', 3, 1, '2026-09-23 06:48:47', '2026-09-24 05:12:22'),
(4, 3, 'Dr. M. R. Jadhav', 'Associate Professor', 'MPT (Cardio-Pulmonary)', 'Critical Care & Pulmonary Rehab', '16 years', 'jadhavkcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty3/500/600', 'Expert in cardiac rehabilitation and intensive care physiotherapy management.', 4, 1, '2026-09-23 06:48:47', '2026-09-24 05:12:35'),
(5, 4, 'Dr. P. N. Kale', 'Associate Professor', 'MPT (Sports), Ph.D. (pursuing)', 'Sports Injuries & Biomechanics', '14 years', 'kalekcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty4/500/600', 'Consultant sports physiotherapist for university and state athletic teams.', 5, 1, '2026-09-23 06:48:47', '2026-09-24 05:12:46'),
(6, 5, 'Dr. V. S. More', 'Assistant Professor', 'MPT (Community)', 'Geriatric & Community Health', '11 years', 'morekcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty5/500/600', 'Coordinator for rural community health outreach programs and health camps.', 6, 1, '2026-09-23 06:48:47', '2026-09-24 05:12:57'),
(7, 1, 'Dr. K. A. Shinde', 'Assistant Professor', 'MPT (Orthopaedics)', 'Joint Mobilization & Ergonomics', '9 years', 'shindekcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty6/500/600', 'Focuses on clinical biomechanics and post-surgical rehabilitation.', 7, 1, '2026-09-23 06:48:47', '2026-09-24 05:13:08'),
(8, 2, 'Dr. N. D. Pawar', 'Lecturer', 'MPT (Neuro)', 'Pediatric Physiotherapy', '7 years', 'pawarkcop@karmayogi.org.in', '', 'https://picsum.photos/seed/faculty7/500/600', 'Dedicated clinician in cerebral palsy and pediatric movement disorders.', 8, 1, '2026-09-23 06:48:47', '2026-09-24 05:13:16');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `gallery`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `gallery`
-- --------------------------------------------------------

INSERT INTO `gallery` (`id`, `category_id`, `title`, `description`, `image_url`, `order_index`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'Main Building', 'College administrative and academic complex', 'https://picsum.photos/seed/campus1/800/600', 1, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(2, 2, 'Lecture Session', 'Interactive classroom session with digital aids', 'https://picsum.photos/seed/acad1/800/600', 2, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 3, 'Clinical Posting', 'Students examining patients at attached hospital', 'https://picsum.photos/seed/clin1/800/600', 3, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 4, 'Annual Day', 'Cultural performances at annual college gathering', 'https://picsum.photos/seed/event1/800/600', 4, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(5, 5, 'Student Volunteers', 'Student council conducting health camp', 'https://picsum.photos/seed/stud1/800/600', 5, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(6, 6, 'Manual Therapy Workshop', 'Practical spine mobilization demonstration', 'https://picsum.photos/seed/wksp1/800/600', 6, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(7, 7, 'Annual Sports Meet', 'Inter-batch cricket and athletics tournament', 'https://picsum.photos/seed/sport1/800/600', 7, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(8, 1, 'Library Block', 'Quiet reading hall and reference section', 'https://picsum.photos/seed/campus2/800/600', 8, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(9, 2, 'Seminar Presentation', 'Postgraduate dissertation defense presentation', 'https://picsum.photos/seed/acad2/800/600', 9, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(10, 3, 'OPD Training', 'Outpatient department hands-on patient rehabilitation', 'https://picsum.photos/seed/clin2/800/600', 10, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(11, 4, 'Convocation', 'Graduation ceremony celebrating outgoing batch', 'https://picsum.photos/seed/event2/800/600', 11, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(12, 6, 'Electrotherapy Demo', 'Hands-on training with latest ultrasound and laser units', 'https://picsum.photos/seed/wksp2/800/600', 12, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `gallery_albums`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery_albums`;
CREATE TABLE `gallery_albums` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `gallery_albums`
-- --------------------------------------------------------

INSERT INTO `gallery_albums` (`id`, `category_id`, `title`, `description`, `cover_image`, `order_index`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'Campus & Infrastructure', 'State-of-the-art campus buildings, lecture halls, and facilities.', 'https://picsum.photos/seed/campus1/800/600', 1, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34'),
(2, 2, 'Academic Activities & Sessions', 'Interactive lectures, seminars, and academic discussions.', 'https://picsum.photos/seed/acad1/800/600', 2, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34'),
(3, 3, 'Clinical & Hospital Training', 'Hands-on OPD and inpatient clinical postings at the attached hospital.', 'https://picsum.photos/seed/clin1/800/600', 3, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34'),
(4, 4, 'Annual Events & Celebrations', 'Convocation ceremonies, cultural festivals, and annual functions.', 'https://picsum.photos/seed/event1/800/600', 4, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34'),
(5, 6, 'Hands-on Workshops & Demos', 'Manual therapy workshops, electrotherapy demos, and practical training.', 'https://picsum.photos/seed/wksp1/800/600', 5, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34'),
(6, 7, 'Sports Meet & Athletics', 'Annual inter-collegiate sports and recreational activities.', 'https://picsum.photos/seed/sport1/800/600', 6, 1, '2026-09-23 14:52:34', '2026-09-23 14:52:34');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `gallery_categories`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery_categories`;
CREATE TABLE `gallery_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `gallery_categories`
-- --------------------------------------------------------

INSERT INTO `gallery_categories` (`id`, `name`, `slug`, `created_at`) VALUES
(1, 'Campus', 'campus', '2026-09-23 06:48:47'),
(2, 'Academic Activities', 'academic-activities', '2026-09-23 06:48:47'),
(3, 'Clinical Training', 'clinical-training', '2026-09-23 06:48:47'),
(4, 'Events', 'events', '2026-09-23 06:48:47'),
(5, 'Students', 'students', '2026-09-23 06:48:47'),
(6, 'Workshops', 'workshops', '2026-09-23 06:48:47'),
(7, 'Sports', 'sports', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `gallery_photos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery_photos`;
CREATE TABLE `gallery_photos` (
  `id` int(10) UNSIGNED NOT NULL,
  `album_id` int(10) UNSIGNED NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `gallery_photos`
-- --------------------------------------------------------

INSERT INTO `gallery_photos` (`id`, `album_id`, `image_url`, `caption`, `order_index`, `created_at`) VALUES
(1, 1, 'https://picsum.photos/seed/campus1/800/600', 'Main Building', 1, '2026-09-23 14:52:34'),
(2, 2, 'https://picsum.photos/seed/acad1/800/600', 'Lecture Session', 2, '2026-09-23 14:52:34'),
(3, 3, 'https://picsum.photos/seed/clin1/800/600', 'Clinical Posting', 3, '2026-09-23 14:52:34'),
(4, 4, 'https://picsum.photos/seed/event1/800/600', 'Annual Day', 4, '2026-09-23 14:52:34'),
(5, 5, 'https://picsum.photos/seed/stud1/800/600', 'Student Volunteers', 5, '2026-09-23 14:52:34'),
(6, 5, 'https://picsum.photos/seed/wksp1/800/600', 'Manual Therapy Workshop', 6, '2026-09-23 14:52:34'),
(7, 6, 'https://picsum.photos/seed/sport1/800/600', 'Annual Sports Meet', 7, '2026-09-23 14:52:34'),
(8, 1, 'https://picsum.photos/seed/campus2/800/600', 'Library Block', 8, '2026-09-23 14:52:34'),
(9, 2, 'https://picsum.photos/seed/acad2/800/600', 'Seminar Presentation', 9, '2026-09-23 14:52:34'),
(10, 3, 'https://picsum.photos/seed/clin2/800/600', 'OPD Training', 10, '2026-09-23 14:52:34'),
(11, 4, 'https://picsum.photos/seed/event2/800/600', 'Convocation', 11, '2026-09-23 14:52:34'),
(12, 5, 'https://picsum.photos/seed/wksp2/800/600', 'Electrotherapy Demo', 12, '2026-09-23 14:52:34');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `migrations`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `executed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `migrations`
-- --------------------------------------------------------

INSERT INTO `migrations` (`id`, `migration`, `executed_at`) VALUES
(1, '001_initial_schema.sql', '2026-09-23 06:48:47'),
(2, '002_initial_seed.sql', '2026-09-23 06:48:47'),
(3, '003_system_media_storage.sql', '2026-09-23 06:48:47'),
(4, '004_gallery_albums.sql', '2026-09-23 14:52:34');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `notices`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `notices`;
CREATE TABLE `notices` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'General',
  `body` text NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `notice_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `notices`
-- --------------------------------------------------------

INSERT INTO `notices` (`id`, `title`, `category`, `body`, `file_url`, `notice_date`, `expiry_date`, `is_published`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 'Admission Notification – BPT A.Y. 2026–27', 'Admission', 'Applications are invited for admission to the Bachelor of Physiotherapy program for the academic year 2026–27. Candidates must have qualified NEET-UG. Prospectus and application forms are available at the college office.', NULL, '2026-09-22', '2026-11-30', 1, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(2, 'Academic Calendar – Odd Semester 2026', 'Academic', 'The academic calendar for the odd semester of A.Y. 2026–27 has been released. Classes commence from 1st July 2026. Internal assessments and term-end examinations are scheduled as per the MUHS directives.', NULL, '2026-09-15', '2026-12-31', 1, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 'Examination Notice – MUHS Winter 2026', 'Examination', 'The examination forms for MUHS Winter 2026 session are open. Last date for form submission without fine is 10th October 2026. Students are advised to confirm their hall ticket details with the examination cell.', NULL, '2026-09-08', '2026-10-15', 1, 0, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'University Circular – Internship Guidelines', 'University', 'MUHS Nashik has issued updated internship guidelines for BPT students. All final year students must complete a compulsory 6-month rotating internship as per the revised schedule.', NULL, '2026-09-02', '2026-12-31', 1, 0, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(5, 'Student Notice – Anti-Ragging Committee Formation', 'Student', 'The Anti-Ragging Committee and Squad for A.Y. 2026–27 have been constituted as per UGC regulations. Students are directed to report any ragging incident to the committee immediately.', NULL, '2026-08-25', '2027-06-30', 1, 0, '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(6, 'Important Announcement – NAAC Peer Team Visit', 'Announcement', 'The NAAC peer team visit is scheduled for October 2026. All departments are requested to update their records, files and portfolios well in advance.', NULL, '2026-08-18', '2026-10-31', 1, 1, '2026-09-23 06:48:47', '2026-09-23 06:48:47');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `pages`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(150) NOT NULL,
  `title` varchar(200) NOT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content_html` longtext NOT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `pages`
-- --------------------------------------------------------

INSERT INTO `pages` (`id`, `slug`, `title`, `banner_url`, `excerpt`, `content_html`, `meta_title`, `meta_description`, `updated_at`) VALUES
(1, 'about', 'About Karmayogi Institute of Physiotherapy', NULL, NULL, '{\"institute_tag\":\"Shri Pandurang Pratishthan\",\"institute_title\":\"About Karmayogi Institute of Physiotherapy\",\"institute_subtitle\":\"Shelve, Pandharpur, Dist: Solapur (MS) — 413304 | Approved by Govt. of Maharashtra & DMER Mumbai, Affiliated to MUHS Nashik\",\"institute_photo_url\":\"/uploads/about/institute_image_8e718df4be04.jpg\",\"institute_photo_caption\":\"Campus & Teaching Hospital Building, Pandharpur\",\"institute_p1\":\"Shri Pandurang Pratishthan\'s Karmayogi Institute of Physiotherapy was founded with an enduring commitment to bring world-class physical healthcare education and clinical rehabilitation to rural and semi-urban communities across Maharashtra. Located in the sacred temple town of Pandharpur, the institution is built upon the philanthropic ethos of holistic community empowerment through education, compassionate medical care, and professional excellence.\",\"institute_p2\":\"The institute provides the comprehensive Bachelor of Physiotherapy (BPT) degree program, equipped with modern lecture halls, digital anatomy software, advanced electrotherapy modalities, kinesiology gymnasiums, biomechanics laboratories, and specialized cardiopulmonary assessment units. Attached to a multi-specialty teaching hospital, students gain intensive hands-on bedside clinical posting experience right from the foundational years, nurturing their confidence, empathy, and evidence-based diagnostic abilities.\",\"vm_tag\":\"Institutional Blueprint\",\"vm_title\":\"Vision & Mission\",\"vm_subtitle\":\"Guiding principles shaping future leaders in healthcare and clinical rehabilitation\",\"vision_title\":\"Our Vision\",\"vision_text\":\"Excellence and Innovation in Medical Education, clinical practice and research in physiotherapy, through strong academic, health care & Community partnership\",\"mission_title\":\"Our Mission\",\"mission_points\":[\"To Prepare the Students to face the Global health Care Needs.\",\"To identify the Current Needs for Research promotion.\",\"To inculcate Professional Competence in Students through Education.\",\"To Foster social engagement and development through relationship.\",\"To Provide quality Physiotherapist well Equipped with Cognitive, psychomotor and effective skills.\",\"To Develop Future Leaders Committed to Accountable Patient Care.\"],\"qp_tag\":\"Quality Assurance\",\"qp_title\":\"Quality Policy\",\"qp_text\":\"Karmayogi institute of physiotherapy is committed to impart quality education and training which aims to pursue global standards of excellence in all our endeavors like teaching, research clinical training and continue education we measure quality process through feedback from various stake holders to remain accountable in line with our vision mission of the Institution.\",\"leadership_tag\":\"Governance & Executive Leadership\",\"leadership_title\":\"Leadership & Institutional Desks\",\"leadership_subtitle\":\"Visionary guidance driving our academic journey and medical mission\",\"leaders\":[{\"name\":\"Late Shri Audumbar Anna Patil\",\"role\":\"Visionary Founder & Inspiration\",\"message\":\"His enduring vision for widespread rural education, healthcare upliftment, and philanthropic service continues to guide Shri Pandurang Pratishthan\'s educational institutions to achieve higher summits of social contribution.\"},{\"name\":\"Hon. Shri Rohan R. Patil\",\"role\":\"President, Shri Pandurang Pratishthan\",\"message\":\"\\\"Our mission is to foster an ecosystem where students from diverse backgrounds discover their highest potential in healthcare, backed by world-class infrastructure, experienced mentors, and ethical clinical values.\\\"\"},{\"name\":\"Principal & Professor\",\"role\":\"Head of the Institution\",\"message\":\"\\\"We mentor our students to master therapeutic skills with clinical precision and compassionate care. Our clinical postings, research seminars, and community health camps groom future leaders in physiotherapy.\\\"\"}],\"council_tag\":\"Institutional Administration\",\"council_title\":\"Governing Council & Advisory Board\",\"council_subtitle\":\"Constituent management body responsible for statutory compliance, academic strategy, and quality monitoring\",\"council_description\":\"The Governing Council of Karmayogi Institute of Physiotherapy functions in full alignment with the statutory norms established by the Maharashtra University of Health Sciences (MUHS), Nashik, and the Directorate of Medical Education and Research (DMER), Mumbai.\",\"council_members\":[{\"sr_no\":\"1\",\"name\":\"Hon. Shri Rohan R. Patil\",\"designation\":\"President / Chairman\",\"representation\":\"Management Representative\"},{\"sr_no\":\"2\",\"name\":\"Trust Nominee Member\",\"designation\":\"Secretary / Trustee\",\"representation\":\"Shri Pandurang Pratishthan\"},{\"sr_no\":\"3\",\"name\":\"Principal\",\"designation\":\"Member Secretary\",\"representation\":\"Head of the Institution\"},{\"sr_no\":\"4\",\"name\":\"Senior Professor / Academic Dean\",\"designation\":\"Member\",\"representation\":\"Teaching Faculty Representative\"},{\"sr_no\":\"5\",\"name\":\"MUHS University Nominee\",\"designation\":\"Member\",\"representation\":\"Affiliating University Representative\"},{\"sr_no\":\"6\",\"name\":\"Medical Director / Superintendent\",\"designation\":\"Member\",\"representation\":\"Attached Hospital Representative\"},{\"sr_no\":\"7\",\"name\":\"Healthcare Industry / Community Expert\",\"designation\":\"Member\",\"representation\":\"Public Health & Clinical Expert\"}],\"approvals_tag\":\"Statutory Recognitions\",\"approvals_title\":\"Affiliations & Government Approvals\",\"approvals_subtitle\":\"Recognized educational credentials ensuring statutory validity and clinical licensing eligibility\",\"approvals\":[{\"badge\":\"Affiliating University\",\"title\":\"Maharashtra University of Health Sciences (MUHS)\",\"description\":\"Affiliated to MUHS, Nashik for conducting the Bachelor of Physiotherapy (BPT) degree program.\"},{\"badge\":\"State Regulatory Authority\",\"title\":\"DMER Mumbai\",\"description\":\"Approved by Directorate of Medical Education and Research, Government of Maharashtra, Mumbai.\"},{\"badge\":\"State Government Approval\",\"title\":\"Government of Maharashtra\",\"description\":\"Approved and sanctioned by the Department of Medical Education and Drugs, Govt. of Maharashtra.\"}]}', 'About Karmayogi Institute of Physiotherapy | Karmayogi College of Physiotherapy', 'Shelve, Pandharpur, Dist: Solapur (MS) — 413304 | Approved by Govt. of Maharashtra & DMER Mumbai, Affiliated to MUHS Nashik', '2026-09-23 13:32:12'),
(2, 'academics', 'Academic Programs & Curriculum', 'https://picsum.photos/seed/copacad/1600/400', 'Accredited undergraduate and postgraduate programs under Maharashtra University of Health Sciences.', '<p>The college offers comprehensive education adhering to the latest curriculum framed by Maharashtra University of Health Sciences (MUHS), Nashik. With structured credit-based curricula, semester assessments, and comprehensive practical postings, our students attain rigorous clinical competence.</p><h3>Curriculum & Syllabus</h3><p>The BPT curriculum integrates core biomedical sciences with clinical physiotherapy including Musculoskeletal, Neurology, Cardio-Respiratory, and Community health.</p><h3>Academic Calendar</h3><p>The academic term begins in July and concludes with the university examinations in winter and summer sessions.</p>', 'Academics | College of Physiotherapy', 'Academic programs, curriculum, calendar and exam structure.', '2026-09-23 06:48:47'),
(3, 'research', 'Research & Development', 'https://picsum.photos/seed/copresearch/1600/400', 'Promoting evidence-based clinical research in rehabilitation and movement sciences.', '<p>The Research & Development cell fosters a culture of scientific inquiry among faculty and students. The department actively encourages publications in indexed journals, clinical trials, and inter-institutional research collaborations.</p><h3>Key Research Areas</h3><ul><li>Biomechanics and Gait Analysis in Neurological Disorders</li><li>Evidence-Based Manual Therapy in Chronic Musculoskeletal Conditions</li><li>Early Mobilization Protocols in Critical Care (ICU)</li><li>Ergonomic Assessments and Interventions for Rural Agricultural Workers</li></ul>', 'Research | College of Physiotherapy', 'Research activities, publications and clinical investigations.', '2026-09-23 06:48:47'),
(4, 'student-corner', 'Student Corner', 'https://picsum.photos/seed/copstudent/1600/400', 'Student life, council, anti-ragging cell, and extracurricular activities.', '<p>The college encourages holistic student growth through academic clubs, sports events, cultural festivals, and community outreach drives.</p><h3>Anti-Ragging Committee</h3><p>Zero tolerance policy against ragging. Any harassment will lead to immediate suspension and criminal prosecution as per UGC and State laws.</p><h3>Scholarships</h3><p>Eligible students can avail Government of Maharashtra scholarships, MahaDBT schemes, and merit-cum-means assistance.</p>', 'Student Corner | College of Physiotherapy', 'Student support, activities, scholarships and anti-ragging cell.', '2026-09-23 06:48:47'),
(5, 'training-placement', 'Training & Placement', 'https://picsum.photos/seed/copplacement/1600/400', 'Internships, career counseling and hospital recruitment opportunities.', '<p>Our dedicated Training & Placement Cell guides graduates into rewarding careers across leading multi-speciality hospitals, rehabilitation centres, sports academies, and academic institutions worldwide.</p><h3>Internship Postings</h3><p>Compulsory 6-month rotating internship conducted across Orthopaedics, Neurology, Intensive Care, Outpatient, and Rural Community centres.</p>', 'Training & Placement | College of Physiotherapy', 'Internship postings and career placements for physiotherapy students.', '2026-09-23 06:48:47'),
(6, 'iqac-naac', 'IQAC & NAAC Accreditation', 'https://picsum.photos/seed/copiqac/1600/400', 'Accredited with NAAC Grade \'A\' (CGPA 3.02) reflecting sustained institutional quality.', '<p>The Internal Quality Assurance Cell (IQAC) continuously benchmarks institutional quality across curriculum delivery, faculty development, research output, student performance, and clinical infrastructure.</p><h3>NAAC Grade \'A\'</h3><p>The institution is proudly accredited by the National Assessment and Accreditation Council (NAAC) with Grade \'A\' and a CGPA of 3.02.</p>', 'IQAC & NAAC | College of Physiotherapy', 'Quality assurance initiatives and NAAC accreditation documentation.', '2026-09-23 06:48:47'),
(7, 'hospital', 'Hospital & Clinical Services', 'https://picsum.photos/seed/cophosp2/1600/400', 'Direct clinical integration with Shri Pandurang Pratishthan Teaching Hospital at Shelve, Pandharpur.', '<p>The College of Physiotherapy functions in direct synergy with the attached multi-speciality hospital of Shri Pandurang Pratishthan, offering students unmatched hands-on clinical exposure from the first year onwards.</p><h3>Departments in Hospital</h3><ul><li>Musculoskeletal & Orthopaedic Rehabilitation OPD</li><li>Neuro-Physiotherapy & Stroke Rehabilitation Clinic</li><li>Cardiorespiratory ICU & Step-Down Care</li><li>Pediatric Rehabilitation & Child Guidance Unit</li><li>Community Outreach & Mobile Physiotherapy Van</li></ul>', 'Hospital & Clinical Services | College of Physiotherapy', 'Hands-on hospital training and clinical facilities.', '2026-09-23 06:48:47'),
(8, 'mandatory-disclosures', 'Mandatory Disclosures & Approvals', 'https://picsum.photos/seed/copdisc/1600/400', 'Statutory approvals, council affiliations and governance transparency.', '<p>In compliance with statutory requirements from UGC, MUHS Nashik, and Government of Maharashtra, institutional disclosures and affiliation documents are made publicly accessible.</p><ul><li>Affiliation Letter: MUHS Nashik</li><li>Approval: Govt. of Maharashtra</li><li>Approval: DMER, Mumbai</li><li>NAAC Certificate: Grade \'A\' (CGPA 3.02)</li><li>UGC 2(f) Recognition Order</li></ul>', 'Mandatory Disclosures | College of Physiotherapy', 'Statutory affiliations, council approvals and regulatory disclosures.', '2026-09-23 06:48:47'),
(9, 'home', 'Homepage All Elements & Slider', NULL, NULL, '{\"hero_slides\":[{\"id\":1,\"tag\":\"HEAL | LEARN | SERVE | GROW\",\"title\":\"Building Healthier Lives Through Physiotherapy\",\"description\":\"Karmayogi College of Physiotherapy is dedicated to excellence in physiotherapy education, research and community service.\",\"quote\":\"Movement for a Better Tomorrow\",\"image\":\"/uploads/banners/institute_image_4f89f9228a0f.jpg\",\"primaryBtn\":{\"text\":\"Explore Our Programs →\",\"link\":\"/academics\"},\"secondaryBtn\":{\"text\":\"About Our College\",\"link\":\"/about\"}},{\"id\":2,\"tag\":\"CLINICAL EXCELLENCE | MODERN LABS\",\"title\":\"World-Class Hands-on Training & Rehabilitation\",\"description\":\"Comprehensive practical exposure in electrotherapy, kinesiology, neurology and multi-specialty clinical postings.\",\"quote\":\"Excellence in Physical Healthcare\",\"image\":\"/uploads/banners/slider2_12e633ab5c39.png\",\"primaryBtn\":{\"text\":\"View Facilities →\",\"link\":\"/facilities\"},\"secondaryBtn\":{\"text\":\"Hospital & OPD\",\"link\":\"/hospital\"}},{\"id\":3,\"tag\":\"RESEARCH | INNOVATION | DEDICATION\",\"title\":\"Empowering Next-Gen Healthcare Leaders\",\"description\":\"Affiliated to MUHS Nashik with state-of-the-art campus, dedicated faculty mentors and outstanding career placement track records.\",\"quote\":\"Service to Humanity is Service to God\",\"image\":\"/uploads/banners/slider3_5badf2ff8ee5.png\",\"primaryBtn\":{\"text\":\"Admissions 2026–27 →\",\"link\":\"/admissions\"},\"secondaryBtn\":{\"text\":\"Student Corner\",\"link\":\"/student-corner\"}}],\"hero_slide_duration\":5,\"about_sub\":\"About Us\",\"about_title\":\"About the College\",\"about_p1\":\"Shri Pandurang Pratishthan\'s Karmayogi College of Physiotherapy, Shelve, Pandharpur, was established with the vision of providing high-quality physiotherapy education and healthcare services to the community. The college is affiliated to the Maharashtra University of Health Sciences, Nashik, and is approved by the Government of Maharashtra.\",\"about_p2\":\"Approved by the Directorate of Medical Education and Research (DMER), Mumbai, the institution offers state-of-the-art laboratories, extensive clinical postings, and a dedicated academic faculty.\",\"about_p3\":\"With experienced faculty, modern laboratories, an attached hospital and a strong research culture, the institution trains competent, compassionate physiotherapists who serve communities across the region and the country.\",\"about_btn_text\":\"Read More\",\"about_btn_link\":\"/about\",\"stat_1_val\":\"25+\",\"stat_1_lbl\":\"Years of Excellence\",\"stat_2_val\":\"1500+\",\"stat_2_lbl\":\"Alumni Physiotherapists\",\"stat_3_val\":\"30+\",\"stat_3_lbl\":\"Experienced Faculty\",\"stat_4_val\":\"Grade A\",\"stat_4_lbl\":\"Accreditation & Recognition\",\"principal_sub\":\"From the Desk of\",\"principal_title\":\"Principal\'s Message\",\"principal_name\":\"Dr. D. SivaganesaBalasubramaniyan\",\"principal_designation\":\"Principal, MPT Cardio-respiratory, Ph.D \\nKarmayogi Institute of Physiotherapy\",\"principal_photo_url\":\"/uploads/faculty/physioprincipal_d5d484415d9d.png\",\"principal_btn_text\":\"Read More →\",\"principal_btn_link\":\"/about\",\"principal_message\":\"Dear Students,\\nWelcome to KARMAYOEI INSTITUTE OF\\nPHYSIOTHERAPY, Pandharpur, The Aim of College is to enrich\\nStudents with the profound Knowledge of Academics clinical,\\nInterdisciplinary medical Subjects and Research Excellence and\\nto provide unmatched quality Education per Excellence, to\\ndevelop the Best minds that has to Explore and revel in the joy of\\nthe Learning.\\nWe are fortunate to have a Talented,\\nExperienced, highly Committed Teaching and supporting staff\\nhere. Who ensure a positive learning environment of our Students\\nWe feel proud to provide quality education by Equipping our\\nStudents with their Confidence, and a Positive approach with an\\nall-around development. Our Management is looking forward and\\nwants Our College to be known as a positive Institute of\\nExcellence.\",\"facilities_sub\":\"Campus\",\"facilities_title\":\"Facilities\",\"notices_sub\":\"Notice Board\",\"notices_title\":\"Latest Notices\",\"events_sub\":\"Calendar\",\"events_title\":\"Upcoming Events\",\"news_sub\":\"Media\",\"news_title\":\"College News\",\"achievements_sub\":\"Proud Moments\",\"achievements_title\":\"Student Achievements\",\"gallery_sub\":\"Campus Life\",\"gallery_title\":\"Photo Gallery\",\"news_list\":[{\"id\":2,\"date\":\"2026-08-28\",\"title\":\"MoU signed with reputed rehabilitation centre\",\"desc\":\"An MoU was signed with a leading rehabilitation centre in Nashik for student training and collaborative research.\",\"tag\":\"ACCREDITATION\",\"image\":\"/uploads/news/rehabitation_center_8f55c3da76b2.webp\",\"link\":\"/about\"},{\"id\":1,\"date\":\"2026-09-10\",\"title\":\"College secures NAAC Grade \'A\' (CGPA 3.02)\",\"desc\":\"The college has been accredited with NAAC Grade \'A\' with a CGPA of 3.02, a testament to its academic and institutional excellence.\",\"tag\":\"ACCREDITATION\",\"image\":\"/uploads/news/naac_2921ee9e42e3.webp\",\"link\":\"/about\"},{\"id\":3,\"date\":\"2026-08-12\",\"title\":\"Students win prizes at state-level physiotherapy quiz\",\"desc\":\"Our students secured first prize at the state-level inter-collegiate physiotherapy quiz competition.\",\"tag\":\"ACCREDITATION\",\"image\":\"/uploads/news/quiz_707de7e19e25.png\",\"link\":\"/about\"},{\"id\":4,\"date\":\"2026-07-30\",\"title\":\"New hydrotherapy unit inaugurated\",\"desc\":\"A modern hydrotherapy unit was inaugurated at the college hospital to enhance clinical training facilities.\",\"tag\":\"ACCREDITATION\",\"image\":\"/uploads/news/hydrotheraphy_d6089f3a538f.webp\",\"link\":\"/about\"},{\"id\":1790220809764,\"title\":\"test\",\"tag\":\"TEST\",\"date\":\"2026-09-24\",\"desc\":\"asdfghjkl\",\"image\":\"/uploads/news/gathering-1_d3a7a94dca6b.webp\",\"link\":\"/About\"}],\"achievements_list\":[{\"title\":\"First Prize – State Physiotherapy Quiz 2026\",\"detail\":\"Team of three BPT students won the state-level quiz organized by IAP Maharashtra branch.\"},{\"title\":\"Best Paper Award – National Conference\",\"detail\":\"A faculty member received the best paper award at the national physiotherapy conference.\"},{\"title\":\"100% Internship Placement\",\"detail\":\"All final year students secured internship placements in reputed hospitals and rehabilitation centres.\"},{\"title\":\"University Merit Rankers\",\"detail\":\"Students secured merit ranks in MUHS examinations consistently over the last five years.\"}],\"courses_sub\":\"Programs\",\"courses_title\":\"Academic Programs\",\"hero_tag\":\"HEAL | LEARN | SERVE | GROW\",\"hero_title\":\"Building Healthier Lives Through Physiotherapy\",\"hero_tagline\":\"Excellence in Movement Sciences, Clinical Rehabilitation and Healthcare\",\"hero_sub\":\"Empowering future physiotherapists with comprehensive academic education, advanced clinical training and ethical practice at Pandharpur.\",\"hero_image_url\":\"/uploads/banners/institute_image_5fbd76c36b8e.png\",\"hero_btn1_text\":\"Explore Our Programs →\",\"hero_btn1_link\":\"/academics\",\"hero_btn2_text\":\"About Our College\",\"hero_btn2_link\":\"/about\",\"news_eyebrow\":\"— NEWS & EVENTS\",\"news_subtitle\":\"Stay informed about the latest happenings, initiatives and milestones at our college.\",\"news_view_all_link\":\"/news\"}', NULL, NULL, '2026-09-25 08:24:45');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `settings`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `settings`
-- --------------------------------------------------------

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'college_name', 'KARMAYOGI INSTITUTE OF PHYSIOTHERAPY', '2026-09-23 06:48:47', '2026-09-23 13:33:18'),
(2, 'foundation_name', 'Shri Pandurang Pratishthan\'s', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(3, 'college_address', 'Gat No. 124, 125, A/P: Shelve, Taluka: Pandharpur, Dist: Solapur (MS), India - 413304', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(4, 'college_phone', '+91 2186 216 000', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(5, 'college_email', 'kcop@karmayogi.org.in', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(6, 'college_website', 'www.karmayogiphysio.org.in', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(7, 'affiliation_line_1', 'Affiliated to Maharashtra University of Health Sciences, Nashik, Approved by Govt. of Maharashtra', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(8, 'affiliation_line_2', '', '2026-09-23 06:48:47', '2026-09-23 14:34:05'),
(9, 'affiliation_line_3', '', '2026-09-23 06:48:47', '2026-09-23 14:34:05'),
(10, 'affiliation_line_4', '', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(11, 'affiliation_line_5', '', '2026-09-23 06:48:47', '2026-09-23 06:48:47'),
(14, 'trust_logo_url', '/uploads/logos/college_logo-d5vwkelh_65fe2b658215.png', '2026-09-23 13:33:18', '2026-09-23 14:31:22'),
(15, 'college_logo_url', '/uploads/logos/chatgpt_image_sep_24__2026__12_40_17_am_a067f5d124cd.png', '2026-09-23 13:33:18', '2026-09-23 19:10:50');

-- -------------------------------------------------------- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `system_media_storage`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `system_media_storage`;
CREATE TABLE `system_media_storage` (
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL DEFAULT 'application/octet-stream',
  `file_data` longblob NOT NULL,
  `file_size` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `system_media_storage`
-- --------------------------------------------------------

-- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- -------------------------------------------------------- Dumping data for table `users`
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'System Administrator', 'admin@vikhepatil.org', '$2y$10$k0I.ajd58X6FFzQSnusDJePPeOTOrPkPArlEuPRUFIRwVaI1sP2OS', 'admin', 1, '2026-09-24 08:58:55', '2026-09-23 06:48:47', '2026-09-24 03:28:55');

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for dumped tables
-- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `admissions`
-- --------------------------------------------------------
ALTER TABLE `admissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`),
  ADD KEY `idx_admissions_key` (`section_key`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `contact_messages`
-- --------------------------------------------------------
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_status` (`status`),
  ADD KEY `idx_contact_created` (`created_at`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `courses`
-- --------------------------------------------------------
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_courses_code` (`code`),
  ADD KEY `idx_courses_status` (`status`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `departments`
-- --------------------------------------------------------
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_dept_slug` (`slug`),
  ADD KEY `idx_dept_order` (`order_index`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `events`
-- --------------------------------------------------------
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_events_date` (`date`),
  ADD KEY `idx_events_pub` (`is_published`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `facilities`
-- --------------------------------------------------------
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_facilities_slug` (`slug`),
  ADD KEY `idx_facilities_active` (`is_active`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `faculty`
-- --------------------------------------------------------
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faculty_dept` (`department_id`),
  ADD KEY `idx_faculty_order` (`order_index`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `gallery`
-- --------------------------------------------------------
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_gallery_cat` (`category_id`),
  ADD KEY `idx_gallery_pub` (`is_published`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `gallery_albums`
-- --------------------------------------------------------
ALTER TABLE `gallery_albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_album_cat` (`category_id`),
  ADD KEY `idx_album_pub` (`is_published`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `gallery_categories`
-- --------------------------------------------------------
ALTER TABLE `gallery_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `gallery_photos`
-- --------------------------------------------------------
ALTER TABLE `gallery_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_photo_album` (`album_id`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `migrations`
-- --------------------------------------------------------
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `migration` (`migration`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `notices`
-- --------------------------------------------------------
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notices_date` (`notice_date`),
  ADD KEY `idx_notices_pub` (`is_published`),
  ADD KEY `idx_notices_cat` (`category`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `pages`
-- --------------------------------------------------------
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_pages_slug` (`slug`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `settings`
-- --------------------------------------------------------
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_settings_key` (`setting_key`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `system_media_storage`
-- --------------------------------------------------------
ALTER TABLE `system_media_storage`
  ADD PRIMARY KEY (`file_path`),
  ADD KEY `idx_sms_mime` (`mime_type`);

-- --------------------------------------------------------
-- -------------------------------------------------------- Indexes for table `users`
-- --------------------------------------------------------
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for dumped tables
-- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `admissions`
-- --------------------------------------------------------
ALTER TABLE `admissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `contact_messages`
-- --------------------------------------------------------
ALTER TABLE `contact_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `courses`
-- --------------------------------------------------------
ALTER TABLE `courses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `departments`
-- --------------------------------------------------------
ALTER TABLE `departments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `events`
-- --------------------------------------------------------
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `facilities`
-- --------------------------------------------------------
ALTER TABLE `facilities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `faculty`
-- --------------------------------------------------------
ALTER TABLE `faculty`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `gallery`
-- --------------------------------------------------------
ALTER TABLE `gallery`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `gallery_albums`
-- --------------------------------------------------------
ALTER TABLE `gallery_albums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `gallery_categories`
-- --------------------------------------------------------
ALTER TABLE `gallery_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `gallery_photos`
-- --------------------------------------------------------
ALTER TABLE `gallery_photos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `migrations`
-- --------------------------------------------------------
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `notices`
-- --------------------------------------------------------
ALTER TABLE `notices`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `pages`
-- --------------------------------------------------------
ALTER TABLE `pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `settings`
-- --------------------------------------------------------
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

-- --------------------------------------------------------
-- -------------------------------------------------------- AUTO_INCREMENT for table `users`
-- --------------------------------------------------------
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- --------------------------------------------------------
-- -------------------------------------------------------- Constraints for dumped tables
-- --------------------------------------------------------

-- --------------------------------------------------------
-- -------------------------------------------------------- Constraints for table `faculty`
-- --------------------------------------------------------
ALTER TABLE `faculty`
  ADD CONSTRAINT `faculty_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- --------------------------------------------------------
-- -------------------------------------------------------- Constraints for table `gallery`
-- --------------------------------------------------------
ALTER TABLE `gallery`
  ADD CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- --------------------------------------------------------
-- -------------------------------------------------------- Constraints for table `gallery_albums`
-- --------------------------------------------------------
ALTER TABLE `gallery_albums`
  ADD CONSTRAINT `gallery_albums_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- --------------------------------------------------------
-- -------------------------------------------------------- Constraints for table `gallery_photos`
-- --------------------------------------------------------
ALTER TABLE `gallery_photos`
  ADD CONSTRAINT `gallery_photos_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `gallery_albums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
