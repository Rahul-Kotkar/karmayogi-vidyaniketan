// BPT Curriculum & Subjects Dataset
// 34 Subjects prescribed under the Bachelor of Physiotherapy curriculum
// Grouped into First Year (10), Second Year (9), Third Year (8), and Final Year (7)

export const BPT_YEARS = [
  {
    key: "all",
    label: "All Years",
    shortLabel: "All",
    count: 34,
    description: "Complete 4-Year Bachelor of Physiotherapy didactic and clinical subjects catalogue."
  },
  {
    key: "year-1",
    label: "First Year BPT",
    shortLabel: "1st Year",
    count: 10,
    academicYear: "Year I",
    description: "Foundational human anatomy, physiology, biochemistry, introductory exercise modalities, electro physical agents, and clinical orientation."
  },
  {
    key: "year-2",
    label: "Second Year BPT",
    shortLabel: "2nd Year",
    count: 9,
    academicYear: "Year II",
    description: "Pathological processes, pharmacology, public health, therapeutic exercise, electrotherapy modalities, and applied biomechanics."
  },
  {
    key: "year-3",
    label: "Third Year BPT",
    shortLabel: "3rd Year",
    count: 8,
    academicYear: "Year III",
    description: "General medicine, pediatric illnesses, general surgery, orthopedics, physical diagnosis, research methodology, and clinical education."
  },
  {
    key: "year-4",
    label: "Final Year BPT",
    shortLabel: "Final Year",
    count: 7,
    academicYear: "Year IV",
    description: "Advanced clinical physiotherapy in neurological, cardiothoracic, sports conditions, healthcare ethics, and community rehabilitation."
  }
];

export const BPT_SUBJECTS = [
  // ==========================================
  // FIRST YEAR BPT (10 SUBJECTS)
  // ==========================================
  {
    id: "ha",
    order: 1,
    name: "Human Anatomy",
    abbr: "HA",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Introduces the structure and organization of the human body, including bones, muscles, joints, organs, nerves, and anatomical relationships. Explains their relevance to movement and rehabilitation.",
    keyTopics: [
      "Skeletal system",
      "Muscular system",
      "Joints",
      "Organs",
      "Nervous system"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Essential for surface anatomy palpation, musculoskeletal palpation, nerve distribution assessment, and functional kinesiology.",
    verificationNote: "Introductory subject overview. Confirm exact syllabus code, hours, and practical evaluation scheme against official college syllabus."
  },
  {
    id: "hp",
    order: 2,
    name: "Human Physiology",
    abbr: "HP",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Explains how the body's systems function, including the nervous, cardiovascular, respiratory, muscular, and endocrine systems.",
    keyTopics: [
      "Body systems",
      "Muscle function",
      "Circulation",
      "Respiration",
      "Homeostasis"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Establishes vital physiological benchmarks for exercise tolerance, autonomic control, cardiac output, and neuromuscular physiology.",
    verificationNote: "Introductory subject overview. Confirm exact syllabus code, hours, and practical evaluation scheme against official college syllabus."
  },
  {
    id: "bc",
    order: 3,
    name: "Biochemistry",
    abbr: "BC",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Covers biomolecules, enzymes, metabolism, and biochemical processes involved in normal health and disease.",
    keyTopics: [
      "Proteins",
      "Carbohydrates",
      "Lipids",
      "Enzymes",
      "Metabolism"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Provides biochemical understanding of energy pathways during muscular exertion, muscle fatigue, lactate accumulation, and inflammatory markers.",
    verificationNote: "Introductory subject overview. Confirm exact syllabus code, hours, and practical evaluation scheme against official college syllabus."
  },
  {
    id: "foem",
    order: 4,
    name: "Fundamentals of Exercise Modalities",
    abbr: "FoEM",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Introduces foundational exercise approaches and physical modalities used in rehabilitation. Confirm the exact terminology against the approved syllabus.",
    keyTopics: [
      "Basic exercise principles",
      "Therapeutic movement",
      "Introductory rehabilitation techniques"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Foundational training in starting positions, active, passive, and resisted joint movements, stretching fundamentals, and basic therapeutic handling.",
    verificationNote: "Flagged for college review: Confirm exact terminology (e.g. Fundamentals of Kinesiotherapy / Exercise Modalities) against the approved MUHS syllabus."
  },
  {
    id: "foea",
    order: 5,
    name: "Fundamentals of Electro Physical Agents",
    abbr: "FoEA",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Introduces the principles, therapeutic applications, precautions, and safety of electro physical agents.",
    keyTopics: [
      "Physical agents",
      "Basic principles",
      "Indications",
      "Contraindications",
      "Safety"
    ],
    departmentSlug: "electrotherapy-physical-agents",
    departmentName: "Department of Electrotherapy & Physical Agents",
    clinicalRelevance: "Covers electrical currents, light therapy, thermotherapy, cryotherapy safety, circuit safety, and skin sensation testing.",
    verificationNote: "Introductory subject overview. Confirm exact abbreviation and syllabus nomenclature against official college documentation."
  },
  {
    id: "ps",
    order: 6,
    name: "Psychology and Sociology",
    abbr: "PS",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Explores human behaviour, psychological wellbeing, social influences, and their effects on illness and rehabilitation.",
    keyTopics: [
      "Behaviour",
      "Motivation",
      "Communication",
      "Social factors",
      "Patient care"
    ],
    departmentSlug: "community-physiotherapy",
    departmentName: "Department of Community Physiotherapy and Rehabilitation",
    clinicalRelevance: "Essential for establishing patient rapport, addressing chronic pain behaviors, emotional distress, and societal barriers to rehabilitation.",
    verificationNote: "Introductory subject overview. Verify combined vs separate examination scheme with college academic office."
  },
  {
    id: "fohs",
    order: 7,
    name: "Fundamentals of Healthcare Delivery System in India",
    abbr: "FoHS",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Introduces India's healthcare structure, levels of care, healthcare services, and the role of physiotherapy.",
    keyTopics: [
      "Healthcare delivery",
      "Health services",
      "Primary care",
      "Healthcare system in India"
    ],
    departmentSlug: "community-physiotherapy",
    departmentName: "Department of Community Physiotherapy and Rehabilitation",
    clinicalRelevance: "Provides an orientation to rural and urban health missions, PHCs, district hospitals, Ayushman Bharat, and physical therapy outreach.",
    verificationNote: "Introductory subject overview. Confirm official curriculum module title and credits."
  },
  {
    id: "eg",
    order: 8,
    name: "English",
    abbr: "EG",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Develops professional communication, reading, writing, comprehension, and language skills for healthcare and academic settings.",
    keyTopics: [
      "Communication",
      "Grammar",
      "Writing",
      "Comprehension",
      "Professional English"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Refines clinical note-taking, discharge summaries, formal doctor-physiotherapist communication, and medical presentation skills.",
    verificationNote: "Institutional requirement / qualifying subject. Confirm syllabus guidelines."
  },
  {
    id: "it",
    order: 9,
    name: "Information Technology",
    abbr: "IT",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Covers basic computer skills, digital tools, information management, and technology used in healthcare and education.",
    keyTopics: [
      "Computer fundamentals",
      "Digital literacy",
      "Software",
      "Information management"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Supports electronic medical records (EMR), telehealth applications, digital health documentation, and medical literature search.",
    verificationNote: "Institutional practical subject. Confirm exam/evaluation module details."
  },
  {
    id: "cor",
    order: 10,
    name: "Clinical Orientation",
    abbr: "Cor",
    yearKey: "year-1",
    yearLabel: "First Year BPT",
    description: "Introduces clinical environments, professional conduct, patient interaction, observation, confidentiality, and basic healthcare procedures.",
    keyTopics: [
      "Clinical settings",
      "Communication",
      "Professional behaviour",
      "Patient safety"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Early hospital and physiotherapy OPD exposure, emphasizing hospital etiquette, hygiene precautions, and patient comfort.",
    verificationNote: "Introductory subject overview. Confirm practical logbook and evaluation structure."
  },

  // ==========================================
  // SECOND YEAR BPT (9 SUBJECTS)
  // ==========================================
  {
    id: "pm",
    order: 11,
    name: "Pathology and Microbiology",
    abbr: "PM",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Introduces disease processes, tissue changes, microorganisms, infection, and infection prevention.",
    keyTopics: [
      "Pathological changes",
      "Microorganisms",
      "Infection control",
      "Disease processes"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Helps therapists understand inflammatory phases, wound healing, tissue repair, nosocomial infections, and sterilization in clinical OPDs.",
    verificationNote: "Introductory subject overview. Confirm subject division and exam marks with MUHS syllabus."
  },
  {
    id: "pc",
    order: 12,
    name: "Pharmacology",
    abbr: "PC",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Explains medicines, their actions, therapeutic uses, side effects, and precautions relevant to physiotherapy practice.",
    keyTopics: [
      "Drug actions",
      "Drug classes",
      "Adverse effects",
      "Medication precautions"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Essential for recognizing drug-exercise interactions, timing therapy around analgesics/muscle relaxants, and observing autonomic side effects.",
    verificationNote: "Introductory subject overview. Verify university exam pattern."
  },
  {
    id: "ph",
    order: 13,
    name: "Public Health and Health Promotion",
    abbr: "PH",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Covers disease prevention, health education, community health, and strategies to promote wellbeing.",
    keyTopics: [
      "Public health",
      "Prevention",
      "Health education",
      "Health promotion"
    ],
    departmentSlug: "community-physiotherapy",
    departmentName: "Department of Community Physiotherapy and Rehabilitation",
    clinicalRelevance: "Trains students to organize ergonomic awareness drives, workplace health interventions, and primary disability prevention.",
    verificationNote: "Introductory subject overview. Confirm syllabus credit hours."
  },
  {
    id: "ecls",
    order: 14,
    name: "Emergency Care and Life Support Skills",
    abbr: "ECLS",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Introduces emergency assessment, first aid, basic life support, and appropriate responses to medical emergencies.",
    keyTopics: [
      "Emergency response",
      "First aid",
      "Basic life support",
      "Patient safety"
    ],
    departmentSlug: "cardiopulmonary-physiotherapy",
    departmentName: "Department of Cardiopulmonary Physiotherapy",
    clinicalRelevance: "Prepares physiotherapists for cardiopulmonary resuscitation (CPR), AED operation, handling syncope, and managing acute clinic emergencies.",
    verificationNote: "Introductory subject overview. Confirm certification and practical assessment details."
  },
  {
    id: "ext",
    order: 15,
    name: "Exercise Therapy",
    abbr: "ExT",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Studies therapeutic exercises for improving strength, flexibility, range of motion, balance, coordination, mobility, and function.",
    keyTopics: [
      "Strengthening",
      "Stretching",
      "Mobility",
      "Balance",
      "Posture",
      "Functional exercises"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Core clinical pillar involving manual resistance, suspension therapy, hydrotherapy, group exercises, and functional restoration.",
    verificationNote: "Core practical subject. Confirm exact syllabus curriculum wording."
  },
  {
    id: "et",
    order: 16,
    name: "Electrotherapy",
    abbr: "ET",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Covers therapeutic electrical and physical agents, their principles, clinical applications, precautions, and safety.",
    keyTopics: [
      "Electrotherapy principles",
      "Treatment applications",
      "Indications",
      "Contraindications",
      "Safety"
    ],
    departmentSlug: "electrotherapy-physical-agents",
    departmentName: "Department of Electrotherapy & Physical Agents",
    clinicalRelevance: "Hands-on application of TENS, IFT, ultrasound, shortwave diathermy, laser, and electrical stimulation for pain and muscle re-education.",
    verificationNote: "Core practical subject. Verify university theory and practical examination scheme."
  },
  {
    id: "bk",
    order: 17,
    name: "Biomechanics and Kinesiology",
    abbr: "BK",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Examines forces acting on the body, joint movement, posture, gait, muscle action, and functional movement.",
    keyTopics: [
      "Mechanics",
      "Joint motion",
      "Muscle function",
      "Posture",
      "Gait"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Detailed mechanical analysis of normal and pathological gait, spinal loads, lever systems, and joint kinematics.",
    verificationNote: "Core subject. Confirm curriculum hours and practical evaluation details."
  },
  {
    id: "yog",
    order: 18,
    name: "Yoga and Systems of Medicine",
    abbr: "YoG",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Introduces yoga practices and relevant systems of medicine, including their principles and potential role in health and wellbeing.",
    keyTopics: [
      "Yoga principles",
      "Postures",
      "Breathing practices",
      "Systems of medicine"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Integrates therapeutic asanas, pranayama breathing, and holistic postural hygiene into physical rehabilitation programs.",
    verificationNote: "Introductory subject overview. Confirm syllabus module boundaries."
  },
  {
    id: "co",
    order: 19,
    name: "Clinical Observation",
    abbr: "CO",
    yearKey: "year-2",
    yearLabel: "Second Year BPT",
    description: "Develops observational skills through supervised exposure to clinical environments, patient care, and physiotherapy practice.",
    keyTopics: [
      "Clinical observation",
      "Patient interaction",
      "Professional conduct",
      "Clinical settings"
    ],
    departmentSlug: "musculoskeletal-physiotherapy",
    departmentName: "Department of Musculoskeletal Physiotherapy",
    clinicalRelevance: "Hands-on clinical posting in hospital OPD and in-patient wards, building clinical case history taking and observational skills.",
    verificationNote: "Clinical posting subject. Confirm mandatory clinical hours and logbook verification."
  },

  // ==========================================
  // THIRD YEAR BPT (8 SUBJECTS)
  // ==========================================
  {
    id: "gmp",
    order: 20,
    name: "General Medicine and Pediatrics",
    abbr: "GMP",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Introduces common medical conditions and childhood illnesses relevant to patient assessment, treatment precautions, and rehabilitation.",
    keyTopics: [
      "General medical conditions",
      "Pediatric illnesses",
      "Clinical signs",
      "Precautions"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Understanding systemic pathologies (diabetes, hypertension, rheumatoid diseases, pediatric developmental delays) for safe therapy planning.",
    verificationNote: "Introductory subject overview. Confirm syllabus distribution between adult medicine and pediatrics."
  },
  {
    id: "gs",
    order: 21,
    name: "General Surgery",
    abbr: "GS",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Covers surgical conditions, basic surgical principles, postoperative recovery, and physiotherapy considerations.",
    keyTopics: [
      "Surgical conditions",
      "Postoperative care",
      "Recovery",
      "Rehabilitation precautions"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Post-operative chest clearance, preventing deep vein thrombosis (DVT), early mobilization after abdominal and thoracic surgeries.",
    verificationNote: "Introductory subject overview. Confirm university exam pattern with academic office."
  },
  {
    id: "or",
    order: 22,
    name: "Orthopedics",
    abbr: "OR",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Introduces musculoskeletal disorders, fractures, joint conditions, spinal disorders, and orthopedic assessment and management.",
    keyTopics: [
      "Bone and joint disorders",
      "Fractures",
      "Spinal conditions",
      "Orthopedic care"
    ],
    departmentSlug: "musculoskeletal-physiotherapy",
    departmentName: "Department of Musculoskeletal Physiotherapy",
    clinicalRelevance: "Clinical pathology and medical management of fractures, dislocations, arthroplasty, ligament reconstructions, and degenerative spine.",
    verificationNote: "Core medical subject. Confirm syllabus guidelines."
  },
  {
    id: "tpms",
    order: 23,
    name: "Physiotherapy in Adult and Pediatric Medical and Surgical Conditions",
    abbr: "TPMS",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Covers physiotherapy assessment and rehabilitation for adults and children with relevant medical and surgical conditions.",
    keyTopics: [
      "Patient assessment",
      "Treatment planning",
      "Rehabilitation",
      "Precautions"
    ],
    departmentSlug: "cardiopulmonary-physiotherapy",
    departmentName: "Department of Cardiopulmonary Physiotherapy",
    clinicalRelevance: "Design and execution of therapeutic protocols for post-surgical recovery, burns, intensive care mobilization, and pediatric medical cases.",
    verificationNote: "Core clinical PT subject. Confirm exact nomenclature and syllabus code in MUHS documents."
  },
  {
    id: "pto",
    order: 24,
    name: "Physiotherapy in Adult and Pediatric Orthopedic Conditions",
    abbr: "PTO",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Focuses on assessment, treatment planning, and rehabilitation for orthopedic conditions across age groups.",
    keyTopics: [
      "Orthopedic assessment",
      "Therapeutic interventions",
      "Functional recovery",
      "Rehabilitation"
    ],
    departmentSlug: "musculoskeletal-physiotherapy",
    departmentName: "Department of Musculoskeletal Physiotherapy",
    clinicalRelevance: "Application of manual therapy, joint mobilizations, functional exercise regimes, and post-fracture rehabilitation protocols.",
    verificationNote: "Core clinical PT subject. Verify university practical examination pattern."
  },
  {
    id: "pfp",
    order: 25,
    name: "Physical and Functional Diagnosis and Prescription",
    abbr: "PFP",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Develops skills in physical examination, functional assessment, identifying movement limitations, and planning appropriate physiotherapy interventions.",
    keyTopics: [
      "Physical examination",
      "Functional assessment",
      "Clinical reasoning",
      "Treatment prescription"
    ],
    departmentSlug: "kinesiotherapy-biomechanics",
    departmentName: "Department of Kinesiotherapy & Biomechanics",
    clinicalRelevance: "Comprehensive diagnostic framework covering special orthopedic tests, neurological screening, goniometry, muscle testing, and exercise dosage.",
    verificationNote: "Core diagnostic subject. Confirm exact curriculum wording."
  },
  {
    id: "rmb",
    order: 26,
    name: "Research Methodology, Biostatistics and Evidence-Based Practice",
    abbr: "RMB",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Introduces research design, biostatistics, critical appraisal, and applying scientific evidence to physiotherapy practice.",
    keyTopics: [
      "Research methods",
      "Study design",
      "Statistics",
      "Literature review",
      "Evidence-based practice"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Prepares undergraduate students for clinical audit, literature critique, dissertation methodology, and evidence-informed therapy.",
    verificationNote: "Introductory subject overview. Confirm dissertation requirements."
  },
  {
    id: "ed",
    order: 27,
    name: "Clinical Education",
    abbr: "Ed",
    yearKey: "year-3",
    yearLabel: "Third Year BPT",
    description: "Supports supervised clinical learning, patient assessment, professional communication, documentation, and application of theoretical knowledge.",
    keyTopics: [
      "Clinical skills",
      "Patient interaction",
      "Documentation",
      "Supervised practice"
    ],
    departmentSlug: "musculoskeletal-physiotherapy",
    departmentName: "Department of Musculoskeletal Physiotherapy",
    clinicalRelevance: "Supervised in-patient ward postings, bedside case presentations, clinical problem-solving, and logbook evaluation.",
    verificationNote: "Clinical posting subject. Confirm mandatory clinical hours and evaluation rubric."
  },

  // ==========================================
  // FINAL YEAR BPT (7 SUBJECTS)
  // ==========================================
  {
    id: "npns",
    order: 28,
    name: "Neurology, Psychiatry and Neurosurgery",
    abbr: "NPNS",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Introduces neurological, psychiatric, and neurosurgical conditions relevant to function, disability, assessment, and rehabilitation.",
    keyTopics: [
      "Neurological disorders",
      "Psychiatric conditions",
      "Neurosurgical conditions",
      "Functional impact"
    ],
    departmentSlug: "neurological-physiotherapy",
    departmentName: "Department of Neurological Physiotherapy",
    clinicalRelevance: "In-depth understanding of stroke, traumatic brain injury, spinal cord injury, Parkinson's disease, and post-craniotomy care.",
    verificationNote: "Core medical specialty subject. Confirm university exam pattern."
  },
  {
    id: "ptn",
    order: 29,
    name: "Physiotherapy in Adult and Pediatric Neurological and Neurosurgical Conditions",
    abbr: "PTN",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Focuses on neurological assessment and rehabilitation for adults and children with movement, balance, coordination, and functional difficulties.",
    keyTopics: [
      "Neurological assessment",
      "Motor control",
      "Balance",
      "Coordination",
      "Functional rehabilitation"
    ],
    departmentSlug: "neurological-physiotherapy",
    departmentName: "Department of Neurological Physiotherapy",
    clinicalRelevance: "Advanced neuro-rehabilitation techniques: NDT/Bobath, PNF, MRP, gait retraining, balance platforms, and pediatric cerebral palsy management.",
    verificationNote: "Core final-year practical subject. Verify university theory and practical examination pattern."
  },
  {
    id: "ctd",
    order: 30,
    name: "Cardiothoracic Diseases and Surgeries",
    abbr: "CTD",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Covers cardiac and respiratory diseases, cardiothoracic surgery, clinical presentation, and relevant precautions.",
    keyTopics: [
      "Cardiovascular disorders",
      "Respiratory disorders",
      "Surgery",
      "Clinical assessment"
    ],
    departmentSlug: "cardiopulmonary-physiotherapy",
    departmentName: "Department of Cardiopulmonary Physiotherapy",
    clinicalRelevance: "Pathology and medical-surgical interventions in CABG, valve replacements, COPD, bronchiectasis, and chest trauma.",
    verificationNote: "Core medical specialty subject. Confirm university exam scheme."
  },
  {
    id: "ptc",
    order: 31,
    name: "Physiotherapy in Adult and Pediatric Cardiothoracic Conditions and Surgical Conditions",
    abbr: "PTC",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Covers cardiac and respiratory assessment, breathing techniques, exercise-based rehabilitation, and recovery after relevant surgery.",
    keyTopics: [
      "Respiratory physiotherapy",
      "Breathing exercises",
      "Cardiac rehabilitation",
      "Postoperative recovery"
    ],
    departmentSlug: "cardiopulmonary-physiotherapy",
    departmentName: "Department of Cardiopulmonary Physiotherapy",
    clinicalRelevance: "ICU chest physiotherapy, airway clearance, mechanical ventilation weaning, phase-I & phase-II cardiac rehabilitation protocols.",
    verificationNote: "Core clinical PT subject. Verify university practical assessment scheme."
  },
  {
    id: "pts",
    order: 32,
    name: "Sports Physiotherapy and Exercise Prescription",
    abbr: "PTS",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Focuses on sports injury management, injury prevention, physical conditioning, exercise prescription, and return-to-sport planning.",
    keyTopics: [
      "Sports injuries",
      "Prevention",
      "Conditioning",
      "Rehabilitation",
      "Exercise prescription"
    ],
    departmentSlug: "sports-physiotherapy",
    departmentName: "Department of Sports Physiotherapy",
    clinicalRelevance: "On-field emergency triage, kinesio taping, functional movement screening (FMS), plyometrics, and athletic return-to-play testing.",
    verificationNote: "Core specialty subject. Confirm syllabus code and practical guidelines."
  },
  {
    id: "ptlm",
    order: 33,
    name: "Ethics, Medico-Legal Aspects, Management and Administration",
    abbr: "PTLM",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Introduces professional ethics, patient rights, legal responsibilities, healthcare management, and administration.",
    keyTopics: [
      "Ethics",
      "Medico-legal responsibilities",
      "Healthcare management",
      "Administration"
    ],
    departmentSlug: "foundational-medical-sciences",
    departmentName: "Department of Foundational Medical Sciences",
    clinicalRelevance: "Professional code of conduct, informed consent, clinical clinic setup, consumer protection act, and biomedical waste management.",
    verificationNote: "Introductory subject overview. Confirm statutory examination requirements."
  },
  {
    id: "cptr",
    order: 34,
    name: "Community Physiotherapy and Rehabilitation",
    abbr: "CPTR",
    yearKey: "year-4",
    yearLabel: "Final Year BPT",
    description: "Covers community-based rehabilitation, disability prevention, health promotion, accessibility, and rehabilitation in community settings.",
    keyTopics: [
      "Community rehabilitation",
      "Disability prevention",
      "Health promotion",
      "Outreach"
    ],
    departmentSlug: "community-physiotherapy",
    departmentName: "Department of Community Physiotherapy and Rehabilitation",
    clinicalRelevance: "Community disability surveys, rural outreach camps, industrial ergonomics, geriatric balance screening, and assistive device prescription.",
    verificationNote: "Core practical subject. Verify community field posting and university exam pattern."
  }
];

// Helper functions for subjects
export function getSubjectsByYear(yearKey) {
  if (!yearKey || yearKey === 'all') return BPT_SUBJECTS;
  return BPT_SUBJECTS.filter(s => s.yearKey === yearKey);
}

export function getSubjectById(id) {
  return BPT_SUBJECTS.find(s => s.id === id);
}

export function getSubjectsByDepartment(deptSlug) {
  return BPT_SUBJECTS.filter(s => s.departmentSlug === deptSlug);
}
