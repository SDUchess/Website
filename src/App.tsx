import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import '@/css/style.css'

// Import pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentChessboards from './pages/student/StudentChessboards'
import ChessExercise from './pages/student/ChessExercise.tsx'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentManagement from './pages/teacher/StudentManagement.tsx'
import Chess from './pages/teacher/Chess'
import ChessboardManagement from './pages/teacher/ChessboardManagement'
import PageNotFound from './pages/utility/PageNotFound'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Test from '@/pages/Test.tsx'
import ClassManagement from '@/pages/teacher/ClassManagement.tsx'
import AdminBoardManage from '@/pages/admin/AdminBoardManage.tsx'
import BasicChessboard from '@/pages/student/BasicChessboard.tsx'
import ScoreRank from '@/pages/common/ScoreRank.tsx'

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
            <Route path="/teacher/class" element={<StudentManagement />} />
            <Route path="/teacher/chess" element={<Chess />} />
            <Route path="/teacher/chessboardmanagement" element={<ChessboardManagement />}/>
            <Route path="/teacher/chessboard/:chessboardId" element={<ChessExercise/>} />
            <Route path="/teacher/class-manage" element={<ClassManagement/>} />
            <Route path="/teacher/view-rank" element={<ScoreRank/>} />
          </>
        )}

        {userRole === 'student' && (
          <>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/chessboard" element={<StudentChessboards />}/>
            <Route path="/student/basicChessboard" element={<BasicChessboard />}/>
            <Route path="/student/exercise/:chessboardId" element={<ChessExercise />}/>
            <Route path="/student/score-rank" element={<ScoreRank />}/>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <Route path="/admin/chessboard" element={<AdminBoardManage/>} />
            <Route path="/admin/chess" element={<Chess/>} />
            <Route path="/admin/chessboard/:chessboardId" element={<ChessExercise/>} />
            <Route path="/admin/view-rank" element={<ScoreRank/>} />
          </>
        )}

        <Route path="/test" element={<Test/>} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
