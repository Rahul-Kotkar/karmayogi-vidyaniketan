import React from 'react'
import AdminCurriculum from './AdminCurriculum.jsx'

/**
 * AdminCourses alias: redirects / aliases to AdminCurriculum
 * Ensures legacy /admin/courses URL and imports render the comprehensive School Curriculum manager
 */
export default function AdminCourses(props) {
  return <AdminCurriculum {...props} />
}
