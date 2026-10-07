// Central Department Data for Karmayogi College of Physiotherapy, Shelve, Pandharpur
// Consolidated clinical and academic departments adhering to MUHS/DMER standards.
// All faculty, lab equipment, and affiliations feature explicit editable placeholders awaiting final college verification.

export const DEPARTMENTS_DATA = [
  {
    id: "msk",
    slug: "musculoskeletal-physiotherapy",
    name: "Department of Musculoskeletal Physiotherapy",
    shortName: "Musculoskeletal Physiotherapy",
    academic_year: "year-3",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    subject_count: 4,
    tagline: "Specialized Orthopedic Assessment, Joint Mobilization & Musculoskeletal Rehabilitation",
    icon: "bone",
    bannerImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. A. B. Deshmukh",
    headDesignation: "Professor & Head of Department",
    headQualification: "MPT (Orthopaedics), PGDMT",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Musculoskeletal Physiotherapy is dedicated to advancing the clinical diagnosis, manual therapy, and therapeutic rehabilitation of conditions affecting the musculoskeletal system. From acute trauma, fractures, and spinal disorders to degenerative arthritis and post-surgical arthroplasty, the department bridges rigorous biomechanical rationale with compassionate patient-centric physical rehabilitation.",
    
    vision: "To be a center of clinical distinction in orthopedic physical rehabilitation, recognized for evidence-informed manual therapy, cutting-edge functional restoration, and empathetic patient care.",
    
    objectives: [
      "Develop high-order clinical reasoning skills in evaluating spinal and peripheral joint pathologies.",
      "Impart mastery in evidence-based manual therapy interventions including Maitland, Mulligan, and neurodynamic mobilizations.",
      "Instill comprehensive post-operative rehabilitation protocols for joint replacements, ligament repairs, and spinal stabilization.",
      "Cultivate clinical research acumen focused on musculoskeletal pain management and conservative functional recovery."
    ],

    scopeImportance: "Musculoskeletal disorders account for the vast majority of physical disabilities, work-related pain, and chronic functional limitations globally. In physiotherapy practice, musculoskeletal competence forms the bedrock of outpatient and inpatient clinical care. Mastering orthopedic assessment, palpation, and biomechanically sound exercise progression ensures patients regain independent mobility, postural ergonomics, and enhanced quality of life.",

    specializations: [
      "Spinal Assessment & Manual Therapy (Cervical, Thoracic & Lumbo-Pelvic)",
      "Peripheral Joint Mobilization & Manipulation",
      "Post-Surgical Orthopedic Rehabilitation (TKR, THR, Arthroscopy, Fracture Fixation)",
      "Soft Tissue Techniques, Myofascial Release & Trigger Point Therapy",
      "Conservative Management of Tendinopathies & Degenerative Joint Diseases",
      "Postural Analysis & Ergonomic Correction"
    ],

    practicalLearning: "Practical learning is delivered through rigorous bedside evaluation and simulation sessions in the attached teaching hospital. Students practice joint play palpation, special clinical orthopedic tests, manual traction, and customized progressive resistance training under direct faculty supervision.",

    faculty: [
      {
        name: "Dr. A. B. Deshmukh",
        designation: "Professor & HOD",
        qualification: "MPT (Ortho), PGDMT",
        experience: "22 years (Teaching & Clinical)",
        email: "hod.msk@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "Dr. K. A. Shinde",
        designation: "Assistant Professor",
        qualification: "MPT (Orthopaedics)",
        experience: "9 years (Clinical)",
        email: "shinde.msk@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Clinical Tutor / Resident",
        qualification: "BPT / MPT (Pursuing)",
        experience: "3+ years",
        email: "dept.msk@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Musculoskeletal & Manual Therapy Lab",
        description: "Equipped with variable-height treatment mobilization plinths, traction units, joint models, and palpation stations.",
        equipment: [
          "Electric & Hydraulic Manual Therapy Plinths",
          "Digital Cervical & Lumbar Traction Units",
          "Comprehensive Orthopedic Goniometer Sets & Inclinometers",
          "Anatomical Joint & Spinal Pathological Models",
          "Theraband Stations, Dumbbells & Weight Cuffs",
          "Mobilization Belts & Wedge Blocks"
        ]
      }
    ],

    clinicalExposure: "Students are posted in the attached hospital's Orthopedic Outpatient Department (OPD), Inpatient Surgical Wards, and Trauma Units. Under faculty mentorship, trainees participate in pre-operative counseling, immediate post-op mobility rounds, long-term rehabilitation case presentations, and community bone-health camps across the Pandharpur region.",

    learningOutcomes: [
      "Independently conduct structured subjective and physical examinations of the musculoskeletal system.",
      "Formulate precise, patient-tailored short-term and long-term functional rehabilitation goals.",
      "Safely execute joint mobilizations, therapeutic muscle energy techniques, and exercise progressions.",
      "Interpret radiological reports (X-rays, MRIs, CT scans) in clinical context to guide physiotherapy precautions."
    ],

    relatedSubjectIds: ["or", "pto", "co", "ed"]
  },

  {
    id: "neuro",
    slug: "neurological-physiotherapy",
    name: "Department of Neurological Physiotherapy",
    shortName: "Neurological Physiotherapy",
    academic_year: "year-3",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    subject_count: 3,
    tagline: "Pioneering Neuro-Rehabilitation, Motor Control Restoration & Pediatric Development",
    icon: "brain",
    bannerImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. S. K. Patil",
    headDesignation: "Professor & Head of Department",
    headQualification: "MPT (Neurosciences), Ph.D.",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Neurological Physiotherapy focuses on the comprehensive rehabilitation of patients with central and peripheral nervous system disorders across all age groups. Combining neuroplasticity principles, motor learning theory, and evidence-based clinical handling, the department prepares students to manage stroke, traumatic brain injuries, spinal cord lesions, movement disorders, and pediatric neuro-developmental challenges.",
    
    vision: "To lead advancements in neuro-rehabilitation and pediatric physiotherapy through compassionate clinical practice, neuro-technological integration, and patient empowerment.",
    
    objectives: [
      "Master neuro-developmental therapy (NDT), Bobath concept, and proprioceptive neuromuscular facilitation (PNF) techniques.",
      "Understand neurological mechanisms of tone abnormalities, spasticity management, and compensatory movement patterns.",
      "Train students in pediatric sensory integration, developmental delay milestones, and cerebral palsy habilitation.",
      "Facilitate early mobilization and long-term community reintegration for individuals with neurological disabilities."
    ],

    scopeImportance: "Neurological conditions often result in profound physical and cognitive changes that impact autonomy and dignity. Physiotherapy plays a decisive role in stimulating neuro-repair, rewiring motor pathways, preventing secondary contractures, and restoring purposeful mobility, balance, and fine motor coordination in both pediatric and adult populations.",

    specializations: [
      "Adult Stroke & Hemiplegia Rehabilitation",
      "Spinal Cord Injury (Paraplegia & Tetraplegia) Functional Training",
      "Traumatic Brain Injury & Coma Stimulation Protocols",
      "Parkinson's Disease, Ataxia & Movement Disorder Therapy",
      "Pediatric Physiotherapy (Cerebral Palsy, Spina Bifida, Developmental Delays)",
      "Vestibular Rehabilitation & Dynamic Balance Retraining"
    ],

    practicalLearning: "Students receive intensive practical instruction in the Neuro-Rehab Gymnasium, mastering mat activities, transfer techniques, balance board training, body-weight supported gait retraining, and orthotic assessment for upper and lower extremities.",

    faculty: [
      {
        name: "Dr. S. K. Patil",
        designation: "Professor & HOD",
        qualification: "MPT (Neurosciences), Ph.D.",
        experience: "20 years (Teaching & Research)",
        email: "hod.neuro@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "Dr. N. D. Pawar",
        designation: "Lecturer / Assistant Professor",
        qualification: "MPT (Neurosciences)",
        experience: "7 years (Clinical)",
        email: "pawar.neuro@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Pediatric PT Specialist",
        qualification: "MPT (Pediatrics / Neuro)",
        experience: "4+ years",
        email: "dept.neuro@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Neurosciences & Pediatric Physiotherapy Gymnasium",
        description: "Specialized rehabilitation area equipped with neurological mats, sensory equipment, balance platforms, and developmental stimulation tools.",
        equipment: [
          "Large Wooden Bobath Neurological Mat Tables",
          "Swiss Exercise Balls, Bolsters & Wedges",
          "Dynamic Balance Trainer & Tilt Table",
          "Parallel Bars with Posture Correction Mirrors",
          "Pediatric Multi-Sensory Swings & Balance Beams",
          "Suspension Gait Harness Unit & Ankle-Foot Orthoses"
        ]
      }
    ],

    clinicalExposure: "Clinical postings encompass the Neurology Outpatient Clinic, Neuro-ICU, Inpatient Stroke Unit, and the Attached Pediatric Rehabilitation Center. Students observe EMG/NCV electrodiagnostics and engage directly in long-term therapy sessions with patients and caregivers.",

    learningOutcomes: [
      "Perform detailed neurological assessments including cranial nerve examination, tone scaling (MAS), reflex testing, and sensory mapping.",
      "Design task-oriented motor retraining plans utilizing principles of neuroplasticity and motor learning.",
      "Evaluate pediatric developmental milestones and prescribe appropriate early developmental interventions.",
      "Safely utilize assistive devices, wheelchairs, and orthotic braces to maximize functional independence."
    ],

    relatedSubjectIds: ["npns", "ptn", "gmp"]
  },

  {
    id: "cardio",
    slug: "cardiopulmonary-physiotherapy",
    name: "Department of Cardiopulmonary Physiotherapy",
    shortName: "Cardiopulmonary Physiotherapy",
    academic_year: "year-4",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    subject_count: 4,
    tagline: "Critical Care Resuscitation, Airway Clearance & Cardiorespiratory Conditioning",
    icon: "heart",
    bannerImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. M. R. Jadhav",
    headDesignation: "Associate Professor & Head of Department",
    headQualification: "MPT (Cardio-Pulmonary Physiotherapy)",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Cardiopulmonary Physiotherapy specializes in the assessment, therapeutic conditioning, and critical care management of acute and chronic cardiac and respiratory disorders. Working in close tandem with the medical and surgical intensive care units (ICUs) and cardiothoracic wards, the department equips students to preserve lung function, clear secretions, and enhance cardiovascular endurance.",
    
    vision: "To excel in intensive cardiopulmonary care and exercise prescription, promoting optimal cardiorespiratory health and early recovery from critical medical illness.",
    
    objectives: [
      "Cultivate clinical expertise in intensive care monitoring, ventilator mechanics, and pulmonary toilet techniques.",
      "Develop competency in Phase-I, Phase-II, and Phase-III cardiac rehabilitation exercise prescription.",
      "Train students in spirometric assessment, arterial blood gas (ABG) interpretation, and chest radiography reading.",
      "Equip graduates to handle emergency life support protocols and respiratory therapy interventions."
    ],

    scopeImportance: "Cardiovascular and chronic respiratory conditions (including COPD, asthma, coronary artery disease, and post-thoracotomy states) represent major contributors to mortality and exercise intolerance. Cardiopulmonary physiotherapists play a vital life-saving role in intensive care units, post-operative surgical suites, and chronic disease rehabilitation centers.",

    specializations: [
      "Medical & Surgical Intensive Care Unit (ICU) Physiotherapy",
      "Post-CABG & Open Heart Surgery Cardiac Rehabilitation",
      "Pulmonary Rehabilitation in COPD, Bronchiectasis & Interstitial Lung Disease",
      "Airway Clearance Techniques & Chest Physical Therapy",
      "Exercise Testing, 6-Minute Walk Test & Spirometry Evaluation",
      "Incentive Spirometry, Flutter Valve & Acapella Therapy"
    ],

    practicalLearning: "Practical coursework incorporates diagnostic auscultation with stethoscopes, chest percussion and vibration techniques, postural drainage positioning, and structured submaximal exercise stress testing using treadmills and cycle ergometers.",

    faculty: [
      {
        name: "Dr. M. R. Jadhav",
        designation: "Associate Professor & HOD",
        qualification: "MPT (Cardio-Pulmonary)",
        experience: "16 years (Clinical & Critical Care)",
        email: "hod.cardio@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Assistant Professor",
        qualification: "MPT (Cardiopulmonary)",
        experience: "6+ years",
        email: "dept.cardio@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Clinical Instructor]",
        designation: "ICU Clinical Supervisor",
        qualification: "BPT / MPT (Pursuing)",
        experience: "3+ years",
        email: "icu.cardio@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Cardiopulmonary Fitness & Pulmonary Function Lab",
        description: "Equipped for pulmonary function assessment, diagnostic chest evaluations, and supervised aerobic conditioning.",
        equipment: [
          "Computerized Diagnostic Spirometer (PFT)",
          "Graded Exercise Treadmill & Cycle Ergometer",
          "Automated External Defibrillator (AED) Training Unit",
          "Digital 12-Lead ECG Monitors & Pulse Oximeters",
          "Chest Clearance Devices (Acapella, Flutter, PEP Masks)",
          "Incentive Spirometers & Peak Flow Meters"
        ]
      }
    ],

    clinicalExposure: "Clinical postings are conducted across the Medical ICU, Surgical ICU, Neonatal/Pediatric ICU, and Cardiothoracic Post-Operative Wards of the attached hospital. Students conduct supervised patient rounds, chest clearance maneuvers, and monitored walking programs.",

    learningOutcomes: [
      "Interpret clinical signs of respiratory distress, abnormal breath sounds, and ABG blood reports accurately.",
      "Execute effective postural drainage, manual chest percussions, and suctioning protocols safely.",
      "Formulate individualized Phase-II cardiac rehabilitation protocols based on heart rate reserves and MET values.",
      "Identify indications and contraindications for early bedside mobilization in hemodynamically unstable patients."
    ],

    relatedSubjectIds: ["ctd", "ptc", "tpms", "ecls"]
  },

  {
    id: "community",
    slug: "community-physiotherapy",
    name: "Department of Community Physiotherapy and Rehabilitation",
    shortName: "Community Physiotherapy",
    academic_year: "year-4",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    subject_count: 4,
    tagline: "Empowering Rural Health, Disability Prevention, Geriatrics & Workplace Ergonomics",
    icon: "users",
    bannerImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. V. S. More",
    headDesignation: "Assistant Professor & Head of Department",
    headQualification: "MPT (Community Physiotherapy)",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Community Physiotherapy and Rehabilitation is dedicated to extending physiotherapy services beyond tertiary hospital walls into rural communities, schools, geriatric centers, and agricultural and industrial workplaces. Rooted in Pandharpur's unique semi-urban and rural setting, the department emphasizes community-based rehabilitation (CBR), preventive public health, and women's health.",
    
    vision: "To achieve equitable access to rehabilitation for rural and underserved populations through participatory community health, functional autonomy, and disability prevention.",
    
    objectives: [
      "Instill the ethos of Community-Based Rehabilitation (CBR) matrix in physical therapy delivery.",
      "Train students in geriatric fall risk mitigation, balance screening, and healthy active aging protocols.",
      "Address women's health concerns including antenatal/postnatal conditioning and pelvic floor rehabilitation.",
      "Conduct ergonomic risk evaluations and musculoskeletal screenings for rural agricultural and industrial workers."
    ],

    scopeImportance: "A significant proportion of patients with physical disabilities in rural Maharashtra face logistical and economic hurdles in reaching tertiary hospitals. Community physiotherapy trains healthcare leaders who bring low-cost, high-impact therapeutic interventions directly to the doorstep of those who need them most.",

    specializations: [
      "Community-Based Rehabilitation (CBR) & Rural Outreach",
      "Geriatric Rehabilitation & Frailty Prevention",
      "Women's Health (Antenatal, Postnatal & Pelvic Health Physiotherapy)",
      "Occupational Health & Ergonomic Workstation Assessment",
      "Disability Evaluation & Assistive Device Distribution",
      "Public Health Education & Chronic Disease Screening"
    ],

    practicalLearning: "Practical field training takes place through organized rural health camps, visits to Primary Health Centres (PHCs), old-age homes, and local industrial/agricultural sites in and around Solapur district.",

    faculty: [
      {
        name: "Dr. V. S. More",
        designation: "Assistant Professor & HOD",
        qualification: "MPT (Community Physiotherapy)",
        experience: "11 years (Public Health & Clinical)",
        email: "hod.community@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Assistant Professor",
        qualification: "MPT (Community / Women's Health)",
        experience: "5+ years",
        email: "dept.community@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Field Officer]",
        designation: "Community Outreach Coordinator",
        qualification: "MSW / BPT",
        experience: "4+ years",
        email: "outreach@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Ergonomics & Community Rehabilitation Unit",
        description: "Equipped for ergonomic posture analysis, geriatric balance assessment, and assistive mobility device fitting.",
        equipment: [
          "Digital Inclinometers & Anthropometric Measurement Kits",
          "Hand-Grip & Pinch Dynamometers",
          "Berg Balance Scale & Tinetti Mobility Assessment Kits",
          "Assistive Mobility Aids (Crutches, Walkers, Canes, Wheelchairs)",
          "Ergonomic Workplace Simulator & Posture Software",
          "Rural Community Camp Mobile Treatment Kits"
        ]
      }
    ],

    clinicalExposure: "Students rotate through rural and urban health training centres affiliated with the institution, conducting epidemiological surveys, screening school children for spinal deformities, and organizing maternal health exercise classes.",

    learningOutcomes: [
      "Assess community health needs and design targeted community-based rehabilitation programs.",
      "Conduct comprehensive geriatric multi-factorial fall risk assessments and group exercise sessions.",
      "Perform ergonomic risk screenings using REBA/RULA tools and recommend low-cost modifications.",
      "Prescribe, modify, and train patients in the use of assistive mobility devices tailored to rural terrain."
    ],

    relatedSubjectIds: ["cptr", "ph", "ps", "fohs"]
  },

  {
    id: "sports",
    slug: "sports-physiotherapy",
    name: "Department of Sports Physiotherapy",
    shortName: "Sports Physiotherapy",
    academic_year: "year-4",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    subject_count: 2,
    tagline: "Athletic Conditioning, Injury Prevention, On-Field Triage & Return-to-Play Rehabilitation",
    icon: "activity",
    bannerImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. P. N. Kale",
    headDesignation: "Associate Professor & Head of Department",
    headQualification: "MPT (Sports), Ph.D. (pursuing)",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Sports Physiotherapy specializes in the scientific prevention, acute emergency management, and high-performance rehabilitation of athletic injuries. Through evidence-based exercise physiology, biomechanical analysis, and targeted conditioning, the department trains future sports physiotherapists to optimize athletic potential and safely guide athletes back to competitive play.",
    
    vision: "To be recognized as a premier center for sports rehabilitation and athletic performance sciences, championing clean sport, injury mitigation, and athletic wellness.",
    
    objectives: [
      "Develop competency in on-field emergency trauma management and sports triage.",
      "Master specialized athletic assessment protocols, functional movement screens (FMS), and agility testing.",
      "Instruct students in athletic taping techniques (kinesiology, rigid strapping) and protective equipment.",
      "Formulate periodized strength, conditioning, and plyometric exercise regimens for athletic rehabilitation."
    ],

    scopeImportance: "As participation in competitive sports, school athletics, and recreational fitness expands across India, the demand for specialized sports physiotherapists has surged. Sports physiotherapists work directly with sports academies, teams, tournaments, and individual athletes to mitigate injury risks and optimize biomechanical efficiency.",

    specializations: [
      "Acute On-Field Sports Injury Management & Triage",
      "ACL & Multi-Ligament Knee Rehabilitation",
      "Overhead Thrower's Shoulder & Rotator Cuff Conditioning",
      "Kinesiology Taping & Rigid Biomechanical Strapping",
      "Functional Movement Screening (FMS) & Y-Balance Testing",
      "Plyometrics, Core Stabilization & Return-to-Play Testing"
    ],

    practicalLearning: "Hands-on learning is integrated with campus sporting events, local athletic tournaments, and state championships. Students practice pitch-side taping, acute trauma management, and progressive agility drills on the college's athletic facilities.",

    faculty: [
      {
        name: "Dr. P. N. Kale",
        designation: "Associate Professor & HOD",
        qualification: "MPT (Sports), Ph.D. (pursuing)",
        experience: "14 years (Sports & Athletic Rehab)",
        email: "hod.sports@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Assistant Professor",
        qualification: "MPT (Sports Physiotherapy)",
        experience: "5+ years",
        email: "dept.sports@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Strength Coach]",
        designation: "Sports Conditioning Specialist",
        qualification: "CSCS / BPT",
        experience: "3+ years",
        email: "athletics@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Sports Performance & Athletic Rehabilitation Center",
        description: "Equipped with strength testing equipment, agility cones, plyometric boxes, and sports recovery tools.",
        equipment: [
          "Isokinetic Dynamometer / Strength Testing Load Cells",
          "Functional Movement Screening (FMS) Test Kits",
          "Plyometric Wooden Jump Boxes & Agility Ladders",
          "Pneumatic Compression Recovery Boots",
          "Kinesiology & Rigid Athletic Taping Stations",
          "Speed Radar & Dual Timing Gate Sensors"
        ]
      }
    ],

    clinicalExposure: "Clinical postings encompass on-campus student athletic clinics, tie-ups with district sports clubs, inter-collegiate tournaments, and marathon medical support teams.",

    learningOutcomes: [
      "Conduct rapid on-field evaluations of acute soft tissue, ligamentous, and head/concussion injuries.",
      "Apply customized athletic taping to stabilize vulnerable joints without impairing functional mobility.",
      "Formulate criterion-based return-to-sport testing protocols following orthopedic surgical repairs.",
      "Design sport-specific conditioning programs that integrate speed, power, agility, and injury prevention."
    ],

    relatedSubjectIds: ["pts", "bk"]
  },

  {
    id: "electro",
    slug: "electrotherapy-physical-agents",
    name: "Department of Electrotherapy & Physical Agents",
    shortName: "Electrotherapy & Physical Agents",
    academic_year: "year-2",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    subject_count: 2,
    tagline: "Therapeutic Modalities, Biophysical Stimulation & Non-Invasive Pain Management",
    icon: "zap",
    bannerImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. K. A. Shinde",
    headDesignation: "Assistant Professor & In-Charge",
    headQualification: "MPT (Orthopaedics), Certified Electrotherapist",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Electrotherapy & Physical Agents trains physiotherapy undergraduates in the physical principles, therapeutic physiological effects, clinical indications, and absolute contraindications of electrical, thermal, magnetic, and acoustic modalities. The department emphasizes patient safety, precise dosage calculation, and clinical reasoning in pain relief and tissue healing.",
    
    vision: "To excel in biophysical agent education and research, establishing safest standards for therapeutic electro-physical applications in restorative medicine.",
    
    objectives: [
      "Instill comprehensive theoretical understanding of electromagnetic spectrum, electrical currents, and acoustic physics.",
      "Master practical operational protocols for low, medium, and high-frequency electrotherapeutic apparatus.",
      "Train students in rigorous electrical safety checks, skin sensation testing, and burn hazard prevention.",
      "Foster research into modern electro-physical modalities for tissue regeneration and non-pharmacological analgesia."
    ],

    scopeImportance: "Electro-physical modalities are indispensable adjuncts in physiotherapy practice for acute and chronic pain reduction, deep tissue heating, edema resolution, wound healing stimulation, and neuromuscular electrical stimulation for denervated and paretic muscles.",

    specializations: [
      "Low Frequency Currents (Galvanic, Faradic, TENS, Diadynamic)",
      "Medium Frequency Currents (Interferential Therapy - IFT, Russian Current)",
      "High Frequency Thermal Modalities (Shortwave Diathermy - SWD, Microwave)",
      "Therapeutic Ultrasound & Phonophoresis",
      "Phototherapy & Low-Level Laser Therapy (LLLT)",
      "Cryotherapy, Hydrocollator Hot Packs & Contrast Bath Therapy"
    ],

    practicalLearning: "Students spend extensive practical hours in the Electrotherapy Lab performing apparatus calibrations, electrode placements, dosage titrations, and simulation trials on peers before proceeding to real patient therapy under supervision.",

    faculty: [
      {
        name: "Dr. K. A. Shinde",
        designation: "Assistant Professor & In-Charge",
        qualification: "MPT, Cert. Electrotherapist",
        experience: "9 years (Academic & Clinical)",
        email: "hod.electro@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Assistant Professor",
        qualification: "MPT (Physiotherapy)",
        experience: "4+ years",
        email: "dept.electro@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Electrotherapy Clinical Demonstration Laboratory",
        description: "Equipped with individual electrotherapy workbenches with multi-waveform stimulators, diathermy units, and ultrasound machines.",
        equipment: [
          "Microprocessor-controlled Multi-current Stimulator Units (TENS / IFT / Russian)",
          "Continuous & Pulsed Therapeutic Ultrasound Machines (1 MHz & 3 MHz)",
          "Shortwave Diathermy (SWD) Continuous & Pulsed Apparatus",
          "Low-Level Laser Therapy (LLLT) Class 3B / 4 Units",
          "Hydrocollator Heating Units & Cold Pack Freezer Baths",
          "Paraffin Wax Bath (PWB) Units with Medical Grade Wax"
        ]
      }
    ],

    clinicalExposure: "Clinical postings in the Attached Hospital Electrotherapy OPD allow students to administer prescribed electro-physical modalities for diverse pain syndromes, Bell's palsy, diabetic neuropathies, and athletic sprains.",

    learningOutcomes: [
      "Perform sensory testing and skin inspection before applying any thermal or electrical modality.",
      "Calculate and configure appropriate frequency, pulse width, intensity, and duration parameters.",
      "Safely execute nerve-muscle stimulation tests (SD Curve plotting) for diagnostic confirmation.",
      "Adhere strictly to equipment safety guidelines, ground fault protection, and emergency stop protocols."
    ],

    relatedSubjectIds: ["foea", "et"]
  },

  {
    id: "kinesiology",
    slug: "kinesiotherapy-biomechanics",
    name: "Department of Kinesiotherapy & Biomechanics",
    shortName: "Kinesiotherapy & Biomechanics",
    academic_year: "year-1",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    subject_count: 6,
    tagline: "Movement Science, Joint Kinematics, Therapeutic Exercise & Functional Diagnosis",
    icon: "compass",
    bannerImage: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80",
    head: "Dr. N. D. Pawar",
    headDesignation: "Lecturer & Head In-Charge",
    headQualification: "MPT (Neurosciences / Movement Science)",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Kinesiotherapy & Biomechanics forms the core foundation of physiotherapy education, analyzing human movement from mechanical, anatomical, and physiological perspectives. From foundational starting positions and manual muscle testing to complex gait analysis and diagnostic exercise prescription, the department transforms scientific physics into therapeutic healing motion.",
    
    vision: "To cultivate profound expertise in biomechanical analysis and therapeutic movement science, producing clinicians who prescribe exercise with surgical precision.",
    
    objectives: [
      "Master mechanical principles (levers, torque, moments of force, center of gravity) governing human movement.",
      "Impart standardized methodologies of manual muscle testing (MMT) and joint goniometry.",
      "Instruct students in suspension therapy, hydrotherapy principles, and progressive resistance exercise (PRE).",
      "Develop skills in functional diagnostic prescription and therapeutic movement planning."
    ],

    scopeImportance: "Movement is medicine. Kinesiotherapy and Biomechanics empower the physiotherapist to diagnose faulty movement mechanics, muscle imbalances, and joint restrictions, providing the exact scientific prescription needed to restore pain-free, efficient movement.",

    specializations: [
      "Applied Biomechanics of Human Movement & Normal Gait Analysis",
      "Standardized Goniometry & Joint Range of Motion (ROM) Assessment",
      "Manual Muscle Testing (MMT) & Muscle Strength Grading (MRC Scale)",
      "Suspension Therapy (Axial & Vertical Suspension)",
      "Hydrotherapy & Aquatic Exercise Fundamentals",
      "Therapeutic Yoga, Breathing Techniques & Postural Re-Education"
    ],

    practicalLearning: "In the Kinesiotherapy Gymnasium, students practice manual muscle testing across all major muscle groups, perform comprehensive goniometric evaluations, rig suspension pulleys, and formulate progressive exercise dosages.",

    faculty: [
      {
        name: "Dr. N. D. Pawar",
        designation: "Lecturer & Head In-Charge",
        qualification: "MPT, Movement Specialist",
        experience: "7 years (Academic & Biomechanics)",
        email: "hod.kinesiology@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Vacant / Faculty Nominee]",
        designation: "Assistant Professor",
        qualification: "MPT (Kinesiotherapy / Biomechanics)",
        experience: "5+ years",
        email: "dept.kinesiology@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Kinesiotherapy & Biomechanics Gymnasium",
        description: "Full-scale movement laboratory with exercise apparatus, pulleys, traction, suspension frames, and posture grids.",
        equipment: [
          "Complete Guthrie-Smith Suspension Frame with Slings & Ropes",
          "Shoulder Wheels, Wall Ladders & Overhead Pulley Systems",
          "Quadriceps Exercise Tables & Delorme Progressive Resistance Boot",
          "Standardized Full-Body Posture Evaluation Grid & Plumb Lines",
          "Universal, Finger & Spinal Goniometers with Gravity Inclinometers",
          "Medicine Balls, Therabands, Resistance Tubes & Wobble Boards"
        ]
      }
    ],

    clinicalExposure: "Clinical postings in exercise therapy suites and rehabilitation gyms where students execute therapeutic exercise plans under real-time faculty critique.",

    learningOutcomes: [
      "Analyze human gait phases, identify common pathological deviations, and determine underlying muscular causes.",
      "Accurately grade muscle strength using Oxford / MRC criteria for all peripheral and spinal muscles.",
      "Design progressive resistance exercise programs utilizing Delorme, Oxford, and DAPRE loading protocols.",
      "Execute passive, active-assisted, and active exercise regimens adhering to joint lubrication and safety guidelines."
    ],

    relatedSubjectIds: ["foem", "ext", "bk", "pfp", "yog", "cor"]
  },

  {
    id: "foundations",
    slug: "foundational-medical-sciences",
    name: "Department of Foundational Medical Sciences",
    shortName: "Foundational Medical Sciences",
    academic_year: "year-1",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    subject_count: 11,
    tagline: "Human Anatomy, Physiology, Biochemistry, Pathology, Pharmacology & General Medicine",
    icon: "book-open",
    bannerImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    head: "Senior Medical Faculty Nominee",
    headDesignation: "Professor & Academic Coordinator",
    headQualification: "MD / MS / MPT / Ph.D.",
    isPlaceholderHead: true,
    verificationStatus: "Preliminary / Subject to College Verification",
    
    overview: "The Department of Foundational Medical Sciences coordinates teaching in basic biomedical and clinical medical specialties for physiotherapy students. Encompassing Human Anatomy, Physiology, Biochemistry, Pathology, Microbiology, Pharmacology, General Medicine, General Surgery, and Research Methodology, this interdisciplinary division establishes the rigorous scientific foundation required for clinical diagnosis.",
    
    vision: "To provide world-class medical foundation education that develops academically sound, scientifically inquisitive, and ethically grounded physiotherapists.",
    
    objectives: [
      "Provide in-depth understanding of human macroscopic anatomy through cadaveric dissection, models, and surface palpation.",
      "Impart deep comprehension of systemic human physiology, homeostatic mechanisms, and biochemical pathways.",
      "Ensure students recognize pathological disease processes, surgical interventions, and pharmacological implications.",
      "Equip students with scientific research methodologies, bioethics, and biostatistical literacy."
    ],

    scopeImportance: "A thorough grasp of foundational medical sciences is what elevates physiotherapy into an autonomous, evidence-driven healthcare profession. Understanding disease etiology, tissue pathology, surgical incisions, and drug interactions protects patient safety and informs clinical decision-making.",

    specializations: [
      "Gross Human Anatomy, Neuro-Anatomy & Histology",
      "Systemic Physiology (Cardiovascular, Respiratory, Neuro, Muscular)",
      "Clinical Biochemistry, Metabolic Energetics & Biomolecules",
      "General Pathology, Microbiology & Infection Control",
      "Clinical Pharmacology & Drug-Exercise Interactions",
      "General Medicine, General Surgery & Research Methodology"
    ],

    practicalLearning: "Practical sessions are conducted in dedicated anatomy dissection halls, histology microscopes suites, physiology hematology labs, and biochemistry demonstration stations.",

    faculty: [
      {
        name: "[Medical Faculty Coordinator]",
        designation: "Professor & Academic Coordinator",
        qualification: "MD / MS / Ph.D.",
        experience: "18+ years (Medical Education)",
        email: "foundations@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Visiting Medical Specialist]",
        designation: "Associate Professor (General Medicine)",
        qualification: "MD (Medicine)",
        experience: "12+ years",
        email: "medicine@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      },
      {
        name: "[Visiting Surgical Specialist]",
        designation: "Associate Professor (General Surgery)",
        qualification: "MS (General Surgery)",
        experience: "15+ years",
        email: "surgery@karmayogiphysiotherapy.edu.in",
        status: "Placeholder / College Verification Required"
      }
    ],

    laboratories: [
      {
        name: "Anatomy Dissection & Specimen Museum",
        description: "Anatomical bone banks, articulated skeletons, wet specimen tanks, and cross-sectional neuro-anatomy models.",
        equipment: [
          "Full Articulated & Disarticulated Human Bone Sets",
          "Formalin-Preserved Organ & Extremity Dissected Specimens",
          "High-Resolution Torso & Neuro-Anatomical Teaching Models",
          "Histological Slide Collections & Binocular Microscopes",
          "Digital Human Anatomy 3D Visualization Software",
          "Cadaveric Dissection Tables with Protective Exhaust System"
        ]
      },
      {
        name: "Physiology & Biochemistry Laboratory",
        description: "Equipped for hematological tests, nerve-muscle preparations simulation, and biochemical assays.",
        equipment: [
          "Compound Medical Microscopes & Hemocytometers",
          "Digital Blood Pressure Sphygmomanometers & Stethoscopes",
          "Centrifuge Machines, Water Baths & Spectrophotometers",
          "Chemical Reagent Racks for Protein and Carbohydrate Analysis"
        ]
      }
    ],

    clinicalExposure: "Students observe surgical procedures in hospital operation theaters, attend medical bed rounds, and review clinical pathology and blood analysis reports.",

    learningOutcomes: [
      "Demonstrate thorough knowledge of human musculoskeletal, vascular, and nervous anatomy.",
      "Explain physiological mechanisms of cardio-respiratory endurance, autonomic balance, and muscle fatigue.",
      "Understand the pathology of systemic diseases and their impact on physical rehabilitation.",
      "Formulate ethically approved research designs, analyze medical literature, and apply biostatistics."
    ],

    relatedSubjectIds: ["ha", "hp", "bc", "pm", "pc", "gs", "gmp", "rmb", "eg", "it", "ptlm"]
  }
];

// Helper functions for departments
export function getAllDepartments() {
  return DEPARTMENTS_DATA;
}

export function getDepartmentBySlug(slug) {
  if (!slug) return null;
  let cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug === 'neurosciences-physiotherapy' || cleanSlug === 'neuro') cleanSlug = 'neurological-physiotherapy';
  if (cleanSlug === 'cardio-respiratory-physiotherapy' || cleanSlug === 'cardio') cleanSlug = 'cardiopulmonary-physiotherapy';
  if (cleanSlug === 'msk') cleanSlug = 'musculoskeletal-physiotherapy';
  if (cleanSlug === 'sports') cleanSlug = 'sports-physiotherapy';
  if (cleanSlug === 'community') cleanSlug = 'community-physiotherapy';
  return DEPARTMENTS_DATA.find(d => d.slug === cleanSlug || d.id === cleanSlug) || null;
}

export const BPT_YEARS = [
  {
    key: "year-1",
    label: "First Year BPT",
    shortLabel: "1st Year BPT",
    roman: "Year I",
    subtitle: "Foundations of Human Biology, Movement Science & Anatomy",
    order_index: 1
  },
  {
    key: "year-2",
    label: "Second Year BPT",
    shortLabel: "2nd Year BPT",
    roman: "Year II",
    subtitle: "Pathological Sciences, Biophysical Agents & Electrotherapy",
    order_index: 2
  },
  {
    key: "year-3",
    label: "Third Year BPT",
    shortLabel: "3rd Year BPT",
    roman: "Year III",
    subtitle: "Clinical Medicine, Musculoskeletal & Neurological Physical Rehabilitation",
    order_index: 3
  },
  {
    key: "year-4",
    label: "Fourth Year BPT (Final Year)",
    shortLabel: "Final Year BPT",
    roman: "Year IV",
    subtitle: "Cardiopulmonary Critical Care, Community Health & Sports Sciences",
    order_index: 4
  }
];

export const DEFAULT_ACADEMIC_YEARS = BPT_YEARS;

export function enrichDepartment(raw) {
  if (!raw) return null;
  const slug = String(raw.slug || raw.id || '').toLowerCase();
  const name = String(raw.name || '').toLowerCase();
  
  // Find matching master data
  const master = DEPARTMENTS_DATA.find(d => 
    d.slug === slug || 
    d.id === slug || 
    (slug && (slug.includes(d.id) || d.id.includes(slug))) ||
    (name && d.name.toLowerCase().includes(name))
  );

  const isBareDbRow = !raw.tagline && (!raw.specializations || (Array.isArray(raw.specializations) && raw.specializations.length === 0));
  const academicYear = raw.academic_year !== undefined && raw.academic_year !== null
    ? String(raw.academic_year)
    : (raw.yearKey !== undefined && raw.yearKey !== null
      ? String(raw.yearKey)
      : (isBareDbRow && master?.academic_year
        ? master.academic_year
        : (raw.year === 1 || raw.year === '1' ? 'year-1' : raw.year === 2 || raw.year === '2' ? 'year-2' : raw.year === 3 || raw.year === '3' ? 'year-3' : raw.year === 4 || raw.year === '4' ? 'year-4' : (master?.academic_year || ''))));

  const code = raw.code || (raw.id && isNaN(raw.id) && String(raw.id).length <= 8 ? String(raw.id).toUpperCase() : (master?.id?.toUpperCase() || 'DEPT'));

  const specializations = (Array.isArray(raw.specializations) && raw.specializations.length > 0)
    ? raw.specializations
    : (typeof raw.specializations === 'string' && raw.specializations.trim().length > 0)
      ? raw.specializations.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : (master?.specializations || []);

  const subjectCount = Number(raw.subject_count) || (raw.relatedSubjectIds?.length) || (master?.subject_count) || (master?.relatedSubjectIds?.length) || 4;

  const rawTitle = raw.name || master?.name || 'Department';
  const cleanTitle = /^Department of /i.test(rawTitle) ? rawTitle : `Department of ${rawTitle}`;

  return {
    ...master,
    ...raw,
    id: raw.id || master?.id || slug,
    slug: raw.slug || master?.slug || slug,
    code,
    name: cleanTitle,
    shortName: cleanTitle.replace(/^Department of\s+/i, ''),
    academic_year: academicYear,
    yearKey: academicYear,
    tagline: raw.tagline || master?.tagline || '',
    subject_count: subjectCount,
    specializations,
    overview: raw.overview || raw.description || master?.overview || '',
    description: raw.description || raw.overview || master?.overview || '',
    desc: raw.tagline || master?.tagline || master?.overview || '',
    head: raw.head || master?.head || 'To be announced',
    order_index: Number(raw.order_index) || master?.order_index || 0
  };
}

