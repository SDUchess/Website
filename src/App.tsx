import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import '@/css/style.css'

// Import pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentChessboards from './pages/student/StudentChessboards'
import ChessExercisePage from './pages/student/ChessExercisePage'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import Class from './pages/teacher/Class'
import Chess from './pages/teacher/Chess'
import ChessboardManagement from './pages/teacher/ChessboardManagement'
import PageNotFound from './pages/utility/PageNotFound'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

function App() {
  const location = useLocation()
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'))

  useEffect(() => {
    document.querySelector('html')!.style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html')!.style.scrollBehavior = ''
  }, [location.pathname])

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    const username = localStorage.getItem('username')
    if (role && username) {
      setUserRole(role)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Signin setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/utility/404" element={<PageNotFound />} />

        {userRole === 'teacher' && (
          <>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/class" element={<Class />} />
            <Route path="/teacher/chess" element={<Chess />} />
            <Route
              path="/teacher/chessboardmanagement"
              element={<ChessboardManagement />}
            />
          </>
        )}

        {userRole === 'student' && (
          <>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/chessboard"
              element={<StudentChessboards />}
            />
            <Route
              path="/student/exercise/:chessboardId"
              element={<ChessExercisePage />}
            />
            {/* 其他学生的路由 */}
          </>
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
