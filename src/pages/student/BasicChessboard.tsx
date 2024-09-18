import { useEffect, useState } from 'react'
import { ChessBoardInfo } from '@/types/Chess.ts'
import { StudentClass } from '@/types/User.ts'
import { useNavigate } from 'react-router-dom'
import { baseURL } from '@/utils/Utils.ts'
import Sidebar from '@/partials/Sidebar.tsx'
import Header from '@/partials/Header.tsx'

export default function BasicChessboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chessboards, setChessboards] = useState<ChessBoardInfo[]>([])
  const navigate = useNavigate()

  const studentId = localStorage.getItem('studentId')
  if (!studentId) {
    alert('登录已过期, 请重新登录')
    return null
  }

  useEffect(() => {
    fetchChessboards().then()
  }, [])

  const fetchChessboards = async () => {

    const response = await fetch(
      `${baseURL}/chessboard/admin/all`
    )
    if (response.ok) {
      const data = await response.json()
      setChessboards(data)
    } else {
      console.error('获取挑战数据失败')
    }
  }

  const handleDoExercise = (chessboardId: number) => {
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
              <p>暂无挑战数据</p>
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
              基础挑战
            </h2>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4 mt-8">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">名称</th>
                    <th className="px-4 py-2">描述</th>
                    <th className="px-4 py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {chessboards.map((chessboard) => (
                    <tr key={chessboard.id}>
                      <td className="border px-4 py-2">{chessboard.id}</td>
                      <td className="border px-4 py-2">{chessboard.name}</td>
                      <td className="border px-4 py-2">{chessboard.description || '暂无文字描述'}</td>
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
