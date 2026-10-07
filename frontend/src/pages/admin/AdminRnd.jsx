import React from 'react'
import AdminPageContentEditor from '../../components/AdminPageContentEditor.jsx'

export default function AdminRnd() {
  const defaultHtml = `<h3>Research &amp; Development Cell</h3>
<p>
  The R&amp;D Cell at Karmayogi College of Physiotherapy promotes innovative clinical investigations,
  interdisciplinary rehabilitation research, and publication in high-impact medical journals.
</p>
<h3>R&amp;D Objectives</h3>
<ul>
  <li>Encourage faculty and undergraduate/postgraduate students to undertake clinical research projects.</li>
  <li>Facilitate grant applications to government funding agencies (ICMR, DST, MUHS Research Cell).</li>
  <li>Organize continuing medical education (CME) seminars, national conferences, and practical workshops.</li>
  <li>Establish clinical collaborations with national and international rehabilitation centres.</li>
</ul>
<h3>Key Thrust Areas</h3>
<ul>
  <li>Evidence-Based Manual Therapy &amp; Biomechanical Motion Analysis</li>
  <li>Neurological Neuro-Rehabilitation &amp; Assistive Technologies</li>
  <li>Community-Based Geriatric Health &amp; Fall Risk Interventions in Rural Maharashtra</li>
  <li>Cardiorespiratory Early Mobilization Protocols in Critical Care (ICU)</li>
</ul>`

  return (
    <AdminPageContentEditor
      slug="rnd"
      defaultTitle="R&D Cell"
      defaultContent={defaultHtml}
      subtitle="Manage R&D cell initiatives, research grants, conference announcements, and institutional collaborations."
    />
  )
}
