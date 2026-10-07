import React from 'react'
import AdminPageContentEditor from '../../components/AdminPageContentEditor.jsx'

export default function AdminHospital() {
  const defaultHtml = `<p>
  Karmayogi College of Physiotherapy is attached to the multi-speciality hospital of
  Shri Pandurang Pratishthan at Shelve, Pandharpur, providing students with direct, daily
  hands-on clinical exposure to inpatient (IPD) and outpatient (OPD) populations from the very first year.
</p>
<h3 id="opd">Physiotherapy Outpatient Department (OPD)</h3>
<p>
  The outpatient department caters to hundreds of patients every month presenting with musculoskeletal
  disorders, sports injuries, neurological conditions and post-surgical rehabilitation requirements.
  OPD services include electrotherapy, manual therapy, therapeutic exercise protocols and ergonomic advice.
</p>
<h3 id="clinical">Clinical Postings &amp; Bedside Training</h3>
<p>
  Students rotate through major clinical hospital wards: Orthopaedics, General Surgery, Medicine,
  Paediatrics, Intensive Care Unit (ICU), and Burns Ward under the direct bedside supervision of
  experienced clinical instructors and medical specialists.
</p>
<h3 id="departments">Hospital Clinical Departments</h3>
<ul>
  <li>Orthopaedic &amp; Joint Replacement Ward</li>
  <li>Neurology &amp; Stroke Rehabilitation Unit</li>
  <li>Cardiorespiratory Care &amp; Intensive Care Unit (ICU)</li>
  <li>Paediatric &amp; Neonatal Rehabilitation Care</li>
  <li>Obstetrics &amp; Gynaecological Postings (Antenatal/Postnatal Care)</li>
  <li>Rural Community Outreach &amp; Diagnostic Camps</li>
</ul>
<h3 id="patient">Patient Services &amp; Community Care</h3>
<p>
  The physiotherapy hospital division provides accessible, high-quality, and highly subsidized rehabilitation
  care to the rural and semi-urban population of Pandharpur, Solapur, and neighboring districts.
</p>`

  return (
    <AdminPageContentEditor
      slug="hospital"
      defaultTitle="Hospital & Clinical Facilities"
      defaultContent={defaultHtml}
      subtitle="Manage attached hospital clinical facilities, OPD/IPD department details, clinical postings, and community patient services."
    />
  )
}
