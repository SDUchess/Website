import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 引入 useNavigate
import Sidebar from '../../partials/Sidebar'
import Header from '../../partials/Header'

function StudentChessboards() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chessboards, setChessboards] = useState([])
  const navigate = useNavigate() // 使用 useNavigate 代替 useHistory

  useEffect(() => {
    const fetchChessboards = async () => {
      try {
        const studentId = localStorage.getItem('studentId')
        const response = await fetch(
          `http://localhost:8080/api/chessboard/student/${studentId}`
        )
        if (response.ok) {
          const data = await response.json()
          setChessboards(data)
        } else {
          console.error('Failed to fetch chessboards')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchChessboards()
  }, [])

  const handleDoExercise = (chessboardId) => {
    // 使用 navigate 跳转到 ChessExercisePage
    navigate(`/student/exercise/${chessboardId}`)
  }

  if (!chessboards || chessboards.length === 0) {
    return (
      <div className="flex h-[100dvh] overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <p>暂无残局数据。</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              我的残局
            </h2>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4 mt-8">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">名称</th>
                    <th className="px-4 py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {chessboards.map((chessboard) => (
                    <tr key={chessboard.id}>
                      <td className="border px-4 py-2">{chessboard.id}</td>
                      <td className="border px-4 py-2">{chessboard.name}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="btn bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleDoExercise(chessboard.id)}>
                          做题
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentChessboards
