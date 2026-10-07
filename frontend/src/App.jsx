import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './hooks/useAuth.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

// Public Pages
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import VisionMission from './pages/VisionMission.jsx'
import PrincipalMessage from './pages/PrincipalMessage.jsx'
import Academics from './pages/Academics.jsx'
import PrePrimary from './pages/PrePrimary.jsx'
import PrimarySchool from './pages/PrimarySchool.jsx'
import SecondarySchool from './pages/SecondarySchool.jsx'
import Curriculum from './pages/Curriculum.jsx'
import AcademicsSubjects from './pages/AcademicsSubjects.jsx'
import Admissions from './pages/Admissions.jsx'
import AdmissionProcess from './pages/AdmissionProcess.jsx'
import FeeStructure from './pages/FeeStructure.jsx'
import Facilities from './pages/Facilities.jsx'
import Infrastructure from './pages/Infrastructure.jsx'
import Labs from './pages/Labs.jsx'
import Sports from './pages/Sports.jsx'
import StudentLife from './pages/StudentLife.jsx'
import Transportation from './pages/Transportation.jsx'
import Faculty from './pages/Faculty.jsx'
import StudentCorner from './pages/StudentCorner.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import Notices from './pages/Notices.jsx'
import News from './pages/News.jsx'
import Events from './pages/Events.jsx'
import Contact from './pages/Contact.jsx'
import IQAC from './pages/IQAC.jsx'
import MandatoryDisclosures from './pages/MandatoryDisclosures.jsx'
import Committees from './pages/Committees.jsx'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminHome from './pages/admin/AdminHome.jsx'
import AdminAbout from './pages/admin/AdminAbout.jsx'
import AdminFaculty from './pages/admin/AdminFaculty.jsx'
import AdminGallery from './pages/admin/AdminGallery.jsx'
import AdminNotices from './pages/admin/AdminNotices.jsx'
import AdminContact from './pages/admin/AdminContact.jsx'
import AdminAcademics from './pages/admin/AdminAcademics.jsx'
import AdminAdmissions from './pages/admin/AdminAdmissions.jsx'
import AdminDepartments from './pages/admin/AdminDepartments.jsx'
import AdminStudentCorner from './pages/admin/AdminStudentCorner.jsx'
import AdminResearch from './pages/admin/AdminResearch.jsx'
import AdminFacilities from './pages/admin/AdminFacilities.jsx'
import AdminTrainingPlacement from './pages/admin/AdminTrainingPlacement.jsx'
import AdminRnd from './pages/admin/AdminRnd.jsx'
import AdminIQAC from './pages/admin/AdminIQAC.jsx'
import AdminHospital from './pages/admin/AdminHospital.jsx'
import AdminMandatoryDisclosures from './pages/admin/AdminMandatoryDisclosures.jsx'
import AdminEvents from './pages/admin/AdminEvents.jsx'
import AdminCourses from './pages/admin/AdminCourses.jsx'
import AdminPages from './pages/admin/AdminPages.jsx'
import AdminMessages from './pages/admin/AdminMessages.jsx'
import AdminRBAC from './pages/admin/AdminRBAC.jsx'
import AdminMigrations from './pages/admin/AdminMigrations.jsx'
import AdminAccessGuard from './components/AdminAccessGuard.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminNews from './pages/admin/AdminNews.jsx'
import AdminAchievements from './pages/admin/AdminAchievements.jsx'
import AdminCommittees from './pages/admin/AdminCommittees.jsx'
import AdminActivityLogs from './pages/admin/AdminActivityLogs.jsx'
import AdminNavigationVisibility from './pages/admin/AdminNavigationVisibility.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Admin Login (Standalone) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Developer Control Hub (DevAdmin Only) */}
          <Route path="rbac" element={<AdminAccessGuard devOnly><AdminRBAC /></AdminAccessGuard>} />
          <Route path="migrations" element={<AdminAccessGuard devOnly><AdminMigrations /></AdminAccessGuard>} />
          <Route path="users" element={<AdminAccessGuard devOnly><AdminRBAC /></AdminAccessGuard>} />
          <Route path="logs" element={<AdminAccessGuard permissionId="activity_logs"><AdminActivityLogs /></AdminAccessGuard>} />
          <Route path="activity-logs" element={<AdminAccessGuard permissionId="activity_logs"><AdminActivityLogs /></AdminAccessGuard>} />

          {/* Main Dashboard */}
          <Route path="dashboard" element={<AdminAccessGuard permissionId="dashboard"><AdminDashboard /></AdminAccessGuard>} />

          {/* Website Primary Nav Admins (Row 1) */}
          <Route path="home" element={<AdminAccessGuard permissionId="home"><AdminHome /></AdminAccessGuard>} />
          <Route path="news" element={<AdminAccessGuard permissionId="news"><AdminNews /></AdminAccessGuard>} />
          <Route path="achievements" element={<AdminAccessGuard permissionId="news"><AdminAchievements /></AdminAccessGuard>} />
          <Route path="about" element={<AdminAccessGuard permissionId="about"><AdminAbout /></AdminAccessGuard>} />
          <Route path="faculty" element={<AdminAccessGuard permissionId="faculty"><AdminFaculty /></AdminAccessGuard>} />
          <Route path="gallery" element={<AdminAccessGuard permissionId="gallery"><AdminGallery /></AdminAccessGuard>} />
          <Route path="notices" element={<AdminAccessGuard permissionId="notices"><AdminNotices /></AdminAccessGuard>} />
          <Route path="contact" element={<AdminAccessGuard permissionId="messages"><AdminContact /></AdminAccessGuard>} />

          {/* Website Secondary Nav Admins (Row 2) */}
          <Route path="academics" element={<AdminAccessGuard permissionId="academics"><AdminAcademics /></AdminAccessGuard>} />
          <Route path="admissions" element={<AdminAccessGuard permissionId="admissions"><AdminAdmissions /></AdminAccessGuard>} />
          <Route path="departments" element={<AdminAccessGuard permissionId="departments"><AdminDepartments /></AdminAccessGuard>} />
          <Route path="student-corner" element={<AdminAccessGuard permissionId="student_corner"><AdminStudentCorner /></AdminAccessGuard>} />
          <Route path="research" element={<AdminAccessGuard permissionId="research"><AdminResearch /></AdminAccessGuard>} />
          <Route path="facilities" element={<AdminAccessGuard permissionId="facilities"><AdminFacilities /></AdminAccessGuard>} />
          <Route path="training-placement" element={<AdminAccessGuard permissionId="placement"><AdminTrainingPlacement /></AdminAccessGuard>} />
          <Route path="committees" element={<AdminAccessGuard permissionId="committees"><AdminCommittees /></AdminAccessGuard>} />
          <Route path="rnd" element={<AdminAccessGuard permissionId="research"><AdminRnd /></AdminAccessGuard>} />
          <Route path="iqac-naac" element={<AdminAccessGuard permissionId="iqac_naac"><AdminIQAC /></AdminAccessGuard>} />
          <Route path="navigation" element={<AdminAccessGuard permissionId="navigation_visibility"><AdminNavigationVisibility /></AdminAccessGuard>} />
          <Route path="hospital" element={<AdminAccessGuard permissionId="facilities"><AdminHospital /></AdminAccessGuard>} />
          <Route path="mandatory-disclosures/*" element={<AdminAccessGuard permissionId="mandatory_disclosures"><AdminMandatoryDisclosures /></AdminAccessGuard>} />

          {/* Admin Management Utilities */}
          <Route path="events" element={<AdminAccessGuard permissionId="events"><AdminEvents /></AdminAccessGuard>} />
          <Route path="courses" element={<AdminAccessGuard permissionId="academics"><AdminCourses /></AdminAccessGuard>} />
          <Route path="pages" element={<AdminAccessGuard permissionId="settings"><AdminPages /></AdminAccessGuard>} />
          <Route path="messages" element={<AdminAccessGuard permissionId="messages"><AdminMessages /></AdminAccessGuard>} />
          <Route path="settings" element={<AdminAccessGuard permissionId="settings"><AdminSettings /></AdminAccessGuard>} />
        </Route>

        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          
          {/* Academic Routes */}
          <Route path="/academics" element={<Academics />} />
          <Route path="/academics/subjects" element={<AcademicsSubjects />} />
          <Route path="/academics/:subpage" element={<Academics />} />
          <Route path="/pre-primary" element={<PrePrimary />} />
          <Route path="/primary" element={<PrimarySchool />} />
          <Route path="/secondary" element={<SecondarySchool />} />
          <Route path="/curriculum" element={<Curriculum />} />

          {/* Admissions Routes */}
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/admission-process" element={<AdmissionProcess />} />
          <Route path="/fees" element={<FeeStructure />} />

          {/* Facilities & Infrastructure Routes */}
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:subpage" element={<Facilities />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/hostel" element={<Navigate to="/facilities" replace />} />
          <Route path="/transport" element={<Transportation />} />

          {/* Faculty, Student & Community */}
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/committees" element={<Committees />} />
          <Route path="/committees/:subpage" element={<Committees />} />
          <Route path="/student-corner" element={<StudentLife />} />
          <Route path="/student-corner/:subpage" element={<StudentLife />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mandatory-disclosures" element={<MandatoryDisclosures />} />
          <Route path="/mandatory-disclosures/:subpage" element={<MandatoryDisclosures />} />

          {/* Legacy Medical / Physiotherapy Route Redirects to School Equivalents */}
          <Route path="/departments" element={<Navigate to="/academics" replace />} />
          <Route path="/departments/:slug" element={<Navigate to="/academics" replace />} />
          <Route path="/hospital" element={<Navigate to="/facilities" replace />} />
          <Route path="/research" element={<Navigate to="/labs" replace />} />
          <Route path="/research/:subpage" element={<Navigate to="/labs" replace />} />
          <Route path="/r-and-d" element={<Navigate to="/labs" replace />} />
          <Route path="/r-and-d/:subpage" element={<Navigate to="/labs" replace />} />
          <Route path="/training-placement" element={<Navigate to="/student-life" replace />} />
          <Route path="/training-placement/:subpage" element={<Navigate to="/student-life" replace />} />
          <Route path="/iqac-naac" element={<Navigate to="/about" replace />} />
          <Route path="/iqac-naac/:subpage" element={<Navigate to="/about" replace />} />

          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
