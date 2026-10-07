// Central structured data for IQAC & NAAC Accreditation
// Matches the 5 user-facing subpages:
// 1. Internal Quality Assurance Cell (iqac)
// 2. NAAC Accreditation (naac)
// 3. Minutes of IQAC (minutes)
// 4. Quality Initiatives (initiatives)
// 5. Annual Quality Reports (AQAR) (aqar)

export const DEFAULT_IQAC_DATA = {
  // General Overview Hub info
  overview: {
    title: "Internal Quality Assurance Cell (IQAC) & NAAC Accreditation",
    lead: "Developing a systemic mechanism for conscious, consistent, and catalytic quality improvement across all academic, clinical, research, and administrative spheres at Karmayogi College of Physiotherapy."
  },

  // Submenu 1: Internal Quality Assurance Cell (IQAC)
  iqac: {
    title: "Internal Quality Assurance Cell (IQAC)",
    intro: "The IQAC was formally established in accordance with NAAC guidelines to institutionalize quality culture, coordinate quality-related pedagogical activities, and disseminate best healthcare education practices.",
    objectives: [
      "To develop realistic benchmarks for academic and administrative activities.",
      "To facilitate a learner-centric clinical environment conducive to quality education.",
      "To arrange feedback responses from students, parents, and alumni on quality-related processes.",
      "To organize inter- and intra-institutional workshops, seminars on quality themes."
    ],
    functions: [
      "Development and application of quality benchmarks in clinical examinations.",
      "Documentation of various programs and activities leading to quality enhancement.",
      "Preparation of the Annual Quality Assurance Report (AQAR) for NAAC.",
      "Conduct of periodic Academic and Administrative Audits (AAA) and their follow-up."
    ]
  },

  // Submenu 2: NAAC Accreditation
  naac: {
    title: "National Assessment and Accreditation Council (NAAC)",
    intro: "The college has been accredited with Grade 'A' (CGPA 3.02 on a 4-point scale) by NAAC, Bengaluru, testifying to our high benchmarks in curriculum delivery, student-centric teaching, research output, hospital infrastructure, and institutional values.",
    grade: "Grade 'A'",
    cgpa: "3.02",
    cycle: "Cycle 1",
    recognition: "Sec 2(f)",
    commendations: "Appreciation recorded for state-of-the-art physiotherapy labs, dedicated multispecialty hospital attachments, community outreach programs in Solapur district, and disciplined academic administration."
  },

  // Submenu 3: Minutes of IQAC
  minutes: [
    {
      id: "min-1",
      date: "18-Jul-2026",
      agenda: "Review of odd semester curriculum completion, OSCE evaluation structure, and hospital posting logbooks.",
      status: "Implemented",
      file_url: ""
    },
    {
      id: "min-2",
      date: "14-Apr-2026",
      agenda: "Faculty Development Program on Biostatistics, Delnet digital library subscription renewal, and research ethics.",
      status: "Completed",
      file_url: ""
    },
    {
      id: "min-3",
      date: "12-Jan-2026",
      agenda: "Preparation for MUHS Winter practical exams, internal grievance review, and green audit report submission.",
      status: "Resolved",
      file_url: ""
    },
    {
      id: "min-4",
      date: "15-Oct-2025",
      agenda: "Annual student feedback analysis, hostel sanitation inspection, and World Physiotherapy Day report compilation.",
      status: "Action Taken",
      file_url: ""
    }
  ],

  // Submenu 4: Quality Initiatives
  initiatives: [
    {
      id: "init-1",
      title: "Faculty Development Programs (FDP)",
      description: "Annual training sessions on advanced physiotherapy assessment tools, educational technology, objective structured clinical examination (OSCE), and scientific manuscript writing."
    },
    {
      id: "init-2",
      title: "Academic and Administrative Audit (AAA)",
      description: "Annual internal and external audits evaluating course file maintenance, lesson planning, student performance tracking, and departmental record keeping."
    },
    {
      id: "init-3",
      title: "Green & Energy Audits",
      description: "Periodic environmental, energy, and biomedical waste audits ensuring eco-friendly campus operations, solar water heating, and rainwater harvesting."
    },
    {
      id: "init-4",
      title: "Comprehensive Stakeholder Feedback",
      description: "Structured online feedback collection from students, teachers, employers, and alumni on curriculum design, library resources, and hospital clinical exposure."
    }
  ],

  // Submenu 5: Annual Quality Reports (AQAR)
  aqar: [
    {
      id: "aqar-1",
      year: "2025–26",
      focus: "Annual progress in digital teaching, outpatient hospital clinical volume, and postgraduate research.",
      status: "Submitted",
      file_url: ""
    },
    {
      id: "aqar-2",
      year: "2024–25",
      focus: "Institutional achievements in MUHS examinations, faculty publications, and sports facilities expansion.",
      status: "Approved by NAAC",
      file_url: ""
    },
    {
      id: "aqar-3",
      year: "2023–24",
      focus: "Infrastructure modernization, smart lecture halls installation, and rural outreach health camps.",
      status: "Approved by NAAC",
      file_url: ""
    }
  ]
}
