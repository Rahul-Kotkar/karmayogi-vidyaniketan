// School Curriculum & Academic Subjects Dataset for Karmayogi Vidyaniketan / Karmayogi Public School
// Comprehensive education from Nursery to Grade 10 (CBSE & State Board Tracks)
// Shri Pandurang Pratishthan, Pandharpur

export const SCHOOL_LEVELS = [
  {
    key: "all",
    label: "All Levels (Nursery to Grade 10)",
    shortLabel: "All",
    count: 24,
    description: "Complete continuum of child development from early childhood foundational learning through Grade 10 board tracks."
  },
  {
    key: "pre-primary",
    label: "Pre-Primary Wing (Nursery, Jr. KG, Sr. KG)",
    shortLabel: "Pre-Primary",
    count: 5,
    academicYear: "Foundational Stage",
    description: "Activity-based, play-way foundational learning focusing on curiosity, motor coordination, early phonics, and socialization."
  },
  {
    key: "primary",
    label: "Primary School (Grades 1 to 5)",
    shortLabel: "Primary (1-5)",
    count: 7,
    academicYear: "Preparatory Stage",
    description: "Focus on strong reading, writing, mathematical fundamentals, environmental curiosity, communication, and creative expression."
  },
  {
    key: "middle",
    label: "Middle School (Grades 6 to 8)",
    shortLabel: "Middle (6-8)",
    count: 6,
    academicYear: "Middle Stage",
    description: "Experiential science, mathematics, social studies, computational thinking, and multilingual learning across English, Marathi & Hindi."
  },
  {
    key: "secondary",
    label: "Secondary School (Grades 9 & 10)",
    shortLabel: "Secondary (9-10)",
    count: 6,
    academicYear: "Secondary Stage",
    description: "Structured academic preparation for CBSE & State Board examinations, lab investigations, AI & Robotics, and leadership development."
  }
];

export const SCHOOL_SUBJECTS = [
  // ==========================================
  // PRE-PRIMARY WING (FOUNDATIONAL LEARNING)
  // ==========================================
  {
    id: "early-phonics",
    order: 1,
    name: "Early English Literacy & Phonics",
    abbr: "ENG-PP",
    yearKey: "pre-primary",
    yearLabel: "Pre-Primary Wing",
    description: "Introduces letter sounds, sight words, storytelling, and phonemic awareness through rhymes, flashcards, and interactive oral activities.",
    keyTopics: [
      "Phonic sounds & alphabet recognition",
      "Story listening & picture comprehension",
      "Vocabulary building & nursery rhymes",
      "Pre-writing patterns & fine-motor coordination",
      "Expressive communication & daily greetings"
    ]
  },
  {
    id: "early-math",
    order: 2,
    name: "Foundational Numeracy & Logic",
    abbr: "NUM-PP",
    yearKey: "pre-primary",
    yearLabel: "Pre-Primary Wing",
    description: "Builds number sense, counting, spatial relations, shapes, and sorting through Montessori-inspired manipulative kits and interactive games.",
    keyTopics: [
      "Number recognition & counting 1 to 50",
      "Shapes, patterns, and color sorting",
      "Concept of size, weight, and comparison",
      "Basic spatial relations (in/out, up/down)",
      "Hands-on counting beads and block puzzles"
    ]
  },
  {
    id: "discovery-evs",
    order: 3,
    name: "World Around Us & Nature Discovery",
    abbr: "EVS-PP",
    yearKey: "pre-primary",
    yearLabel: "Pre-Primary Wing",
    description: "Fosters keen observation of nature, animals, plants, seasons, community helpers, and good personal hygiene in an engaging format.",
    keyTopics: [
      "My self, family, and home environment",
      "Plants, animals, and natural surroundings",
      "Weather, seasons, and day/night cycle",
      "Community helpers & safety awareness",
      "Healthy habits, clean food, and handwashing"
    ]
  },
  {
    id: "creative-arts-pp",
    order: 4,
    name: "Visual Arts, Craft & Sensory Play",
    abbr: "ART-PP",
    yearKey: "pre-primary",
    yearLabel: "Pre-Primary Wing",
    description: "Encourages creative exploration and sensory integration through clay modeling, finger painting, paper origami, and tactile play.",
    keyTopics: [
      "Color recognition & freehand drawing",
      "Clay modeling & paper folding (origami)",
      "Sensory sand, water, and texture play",
      "Scissor skills & paper tearing collage",
      "Rhythm, dance movements, and action songs"
    ]
  },
  {
    id: "physical-motor-pp",
    order: 5,
    name: "Gross Motor Development & Yoga",
    abbr: "PE-PP",
    yearKey: "pre-primary",
    yearLabel: "Pre-Primary Wing",
    description: "Daily outdoor play, balance beam navigation, fundamental movement skills, and kid-friendly yoga stretches to build strength and posture.",
    keyTopics: [
      "Running, hopping, skipping, and balancing",
      "Ball throwing, catching, and kicking",
      "Fun kids' yoga and breathing exercises",
      "Team games and turn-taking socialization",
      "Body posture and spatial awareness"
    ]
  },

  // ==========================================
  // PRIMARY SCHOOL (GRADES 1 TO 5)
  // ==========================================
  {
    id: "english-primary",
    order: 6,
    name: "English Language & Literature",
    abbr: "ENG-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Comprehensive English language proficiency encompassing grammar, reading comprehension, creative writing, poetry appreciation, and spoken fluency.",
    keyTopics: [
      "Grammar essentials, tenses, and parts of speech",
      "Prose and poetry reading with intonation",
      "Creative paragraph writing, diary entries & letters",
      "Vocabulary building, antonyms, synonyms & idioms",
      "Public speaking, recitation & storytelling"
    ]
  },
  {
    id: "mathematics-primary",
    order: 7,
    name: "Primary Mathematics & Mental Math",
    abbr: "MATH-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Core arithmetic operations, geometry, measurement, fractions, data handling, and mental calculation techniques developing sharp problem-solving skills.",
    keyTopics: [
      "Addition, subtraction, multiplication & division",
      "Fractions, decimals, and place value systems",
      "Measurement of length, weight, capacity & time",
      "2D and 3D shapes, perimeter, and area basics",
      "Mental math speed calculations and word problems"
    ]
  },
  {
    id: "evs-primary",
    order: 8,
    name: "Environmental Studies & General Science",
    abbr: "EVS-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Integrated study of biological and physical science concepts, ecological balance, energy conservation, health, water conservation, and community life.",
    keyTopics: [
      "Plant and animal life cycles and habitats",
      "Human body systems, nutrition, and wellness",
      "Natural resources, air, water, and soil conservation",
      "Solar system, weather patterns, and landforms",
      "Hands-on junior science experiments"
    ]
  },
  {
    id: "marathi-primary",
    order: 9,
    name: "Marathi Language (मातृभाषा व राज्यभाषा)",
    abbr: "MAR-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Rigorous training in the state language of Maharashtra covering Devanagari script, Marathi grammar, classical stories, poetry, and conversation.",
    keyTopics: [
      "मराठी वर्णमाला, बाराखडी व शुद्धलेखन",
      "व्याकरण (नाम, सर्वनाम, क्रियापद, लिंग, वचन)",
      "गोष्टी, कविता व सुविचार वाचन",
      "संभाषण कौशल्य व दैनंदिन संवाद",
      "निबंधलेखन व पत्रलेखनाचा सराव"
    ]
  },
  {
    id: "hindi-primary",
    order: 10,
    name: "Hindi Language (हिंदी भाषा)",
    abbr: "HIN-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "National language study fostering fluent reading, writing, comprehension, grammar, and rich cultural appreciation of Hindi literature.",
    keyTopics: [
      "हिंदी वर्णमाला, मात्रा ज्ञान व वर्तनी",
      "व्याकरण के मूलभूत नियम व शब्द भंडार",
      "गद्य व पद्य पाठों का सस्वर वाचन",
      "सरल निबंध, संवाद व चित्र वर्णन",
      "नैतिक कथाएं व राष्ट्रभक्ति कविताएं"
    ]
  },
  {
    id: "computer-primary",
    order: 11,
    name: "Computer Science & Digital Literacy",
    abbr: "CS-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Introduces computer components, operating systems, MS Office tools, touch typing, digital citizenship, and foundational block-based coding.",
    keyTopics: [
      "Computer hardware, keyboard, and mouse mastery",
      "MS Paint, Word processing, and presentation slides",
      "Safe internet browsing and digital ethics",
      "Introduction to Scratch block coding",
      "Logical reasoning, algorithms, and flowcharts"
    ]
  },
  {
    id: "pe-arts-primary",
    order: 12,
    name: "Physical Education, Yoga & Fine Arts",
    abbr: "PE-ART-PRI",
    yearKey: "primary",
    yearLabel: "Primary School (Grades 1-5)",
    description: "Structured athletics, team sports (kho-kho, kabaddi, football), classical & folk music, dance, drawing, and daily Surya Namaskar.",
    keyTopics: [
      "Athletics running, jumping, and relay races",
      "Traditional Indian sports: Kabaddi & Kho-Kho",
      "Football, badminton, and cricket basics",
      "Classical Surya Namaskar and Pranayama",
      "Drawing, watercolor painting & craft exhibitions"
    ]
  },

  // ==========================================
  // MIDDLE SCHOOL (GRADES 6 TO 8)
  // ==========================================
  {
    id: "science-middle",
    order: 13,
    name: "General Science (Physics, Chemistry, Biology)",
    abbr: "SCI-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "Laboratory-based experiential learning covering mechanics, light, electricity, chemical reactions, cell biology, plant physiology, and ecosystem dynamics.",
    keyTopics: [
      "Matter, chemical reactions, acids, bases & salts",
      "Motion, force, pressure, light, and electricity",
      "Cell structure, plant reproduction & human organs",
      "Microorganisms, food production, and conservation",
      "Weekly hands-on science laboratory experiments"
    ]
  },
  {
    id: "math-middle",
    order: 14,
    name: "Mathematics & Pre-Algebra",
    abbr: "MATH-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "Deductive geometric proofs, algebraic equations, integers, ratios, percentages, statistics, probability, and mensuration.",
    keyTopics: [
      "Integers, rational numbers & exponents",
      "Linear equations and algebraic expressions",
      "Triangles, quadrilaterals, circles & geometric constructions",
      "Commercial mathematics: profit, loss & simple interest",
      "Data handling, bar graphs, and probability basics"
    ]
  },
  {
    id: "social-science-middle",
    order: 15,
    name: "Social Science (History, Civics, Geography)",
    abbr: "SST-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "Explores ancient & medieval Indian history, national freedom movement, Indian constitution, parliamentary governance, world geography, and resources.",
    keyTopics: [
      "Ancient, Medieval & Modern Indian History",
      "Maratha Empire and the vision of Chhatrapati Shivaji Maharaj",
      "Indian Constitution, Fundamental Rights, and Parliament",
      "Physical geography of India & Maharashtra",
      "Resources, agriculture, industries & environmental management"
    ]
  },
  {
    id: "stem-robotics-middle",
    order: 16,
    name: "STEM, AI & Robotics Foundation",
    abbr: "STEM-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "Hands-on engineering projects using Arduino microcontrollers, sensors, 3D spatial thinking, basic Python programming, and robotic car assemblies.",
    keyTopics: [
      "Introduction to robotics, sensors, and actuators",
      "Block & text-based Python programming",
      "Arduino circuit building and LED/buzzer logic",
      "Design thinking and STEM project prototypes",
      "Introduction to Artificial Intelligence concepts"
    ]
  },
  {
    id: "english-literature-middle",
    order: 17,
    name: "English Language & Communicative Arts",
    abbr: "ENG-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "Formal essay writing, debate, speech presentation, comprehension analysis, report writing, and appreciation of world literature classics.",
    keyTopics: [
      "Advanced grammar, clauses, voice & direct-indirect speech",
      "Formal letter writing, notice drafting, and news reports",
      "Literary analysis of short stories and poems",
      "Extempore speaking, parliamentary debates & MUN orientation",
      "Creative writing and book review competitions"
    ]
  },
  {
    id: "languages-middle",
    order: 18,
    name: "Regional & Classical Languages (Marathi & Hindi)",
    abbr: "LANG-MID",
    yearKey: "middle",
    yearLabel: "Middle School (Grades 6-8)",
    description: "In-depth study of regional literature, poetry recitation, formal letter writing, grammar, and cultural traditions of Maharashtra and India.",
    keyTopics: [
      "संत साहित्य (संत ज्ञानेश्वर, संत तुकाराम महाराज)",
      "प्रगत मराठी व्याकरण, अलंकार व वाक्यप्रचार",
      "हिंदी गद्य-पद्य साहित्य व मुहावरे",
      "वैचारिक निबंध, संवाद व पत्रलेखन",
      "नाट्य अभिवाचन व वक्तृत्व स्पर्धा"
    ]
  },

  // ==========================================
  // SECONDARY SCHOOL (GRADES 9 & 10)
  // ==========================================
  {
    id: "science-secondary",
    order: 19,
    name: "Science & Technology (Physics, Chemistry, Biology)",
    abbr: "SCI-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "Rigorous curriculum aligned with CBSE and Maharashtra State Board standards. Complete laboratory practicals, chemical titration, optics, mechanics, and genetics.",
    keyTopics: [
      "Chemical reactions, periodic classification & carbon compounds",
      "Electricity, magnetic effects of current, light reflection & refraction",
      "Life processes, control & coordination, heredity & evolution",
      "Sources of energy, management of natural resources",
      "Comprehensive lab practicals, viva & project record books"
    ]
  },
  {
    id: "mathematics-secondary",
    order: 20,
    name: "Mathematics (Algebra & Geometry)",
    abbr: "MATH-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "Advanced algebraic formulations, quadratic equations, trigonometry, coordinate geometry, surface areas, volumes, statistics, and circles.",
    keyTopics: [
      "Real numbers, polynomials & quadratic equations",
      "Arithmetic progressions (AP) & linear equations in two variables",
      "Introduction to trigonometry and applications of trigonometry",
      "Circles, coordinate geometry & geometric constructions",
      "Surface areas and volumes of combinations of solids & statistics"
    ]
  },
  {
    id: "social-science-secondary",
    order: 21,
    name: "Social Science (History, Civics, Geography, Economics)",
    abbr: "SST-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "Critical inquiry into modern Indian nationalism, world wars, democratic politics, federalism, economic development, money and credit, and sustainable geography.",
    keyTopics: [
      "Nationalism in Europe & Nationalism in India",
      "Power sharing, federalism, gender, religion & caste in politics",
      "Resources and development, agriculture, manufacturing industries",
      "Development economics, sectors of the Indian economy, globalization",
      "Map pointing skills, case studies & project dossiers"
    ]
  },
  {
    id: "english-secondary",
    order: 22,
    name: "English Language & Literature",
    abbr: "ENG-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "High-order reading comprehension, discursive essays, analytical paragraph writing, formal editorial letters, and classical drama appreciation.",
    keyTopics: [
      "Board-pattern reading comprehension (factual & discursive passages)",
      "Analytical paragraph writing based on charts, graphs & cues",
      "Formal letters to editors, business enquiries & complaints",
      "In-depth analysis of prose, drama & poetry texts",
      "Oral listening and speaking assessments (ASL)"
    ]
  },
  {
    id: "regional-language-secondary",
    order: 23,
    name: "Second Language (Marathi / Hindi)",
    abbr: "LANG-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "Thorough board examination preparation with extensive grammar drills, unread passages, prose, poetry, and expressive essay compositions.",
    keyTopics: [
      "बोर्ड परीक्षा आधारित गद्य, पद्य व स्थूलवाचन",
      "व्याकरण (समास, वृत्त, शब्दसिद्धी, वाक्प्रचार)",
      "उपयोजित लेखन (निबंध, बातमी लेखन, जाहिरात लेखन)",
      "कथालेखन, संवाद लेखन व सारांश लेखन",
      "मागील वर्षांच्या प्रश्नपत्रिकांचा सराव"
    ]
  },
  {
    id: "it-robotics-secondary",
    order: 24,
    name: "Information Technology & AI Applications",
    abbr: "IT-AI-SEC",
    yearKey: "secondary",
    yearLabel: "Secondary School (Grades 9-10)",
    description: "Advanced digital skills including RDBMS database management, HTML/CSS web design, Python programming, AI computer vision models, and cybersecurity.",
    keyTopics: [
      "Database management with LibreOffice Base / MySQL",
      "Web development fundamentals (HTML5 & CSS)",
      "Python programming fundamentals and automation scripts",
      "Computer vision and Natural Language Processing concepts",
      "Cyber safety, digital footprints, and ethical hacking basics"
    ]
  }
];

// Backwards compatibility aliases
export const BPT_YEARS = SCHOOL_LEVELS;
export const BPT_SUBJECTS = SCHOOL_SUBJECTS;
