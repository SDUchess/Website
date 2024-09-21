import { useEffect, useState } from 'react'
import { Student } from '@/types/User.ts'
import { baseURL } from '@/utils/Utils.ts'
import Sidebar from '@/partials/Sidebar.tsx'
import Header from '@/partials/Header.tsx'

/* 学生积分排行榜 */
export default function ScoreRank() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rank, setRank] = useState<Student[]>([])

  const userRole = localStorage.getItem('userRole')
  const studentId = localStorage.getItem('studentId')
  if (!userRole) {
    alert('登录已过期, 请重新登录')
    return null
  }

  const fetchRank = async () => {
    const res = await fetch(`${baseURL}/chessboard/rank`)
    if (res.ok) {
      const data = await res.json()
      setRank(data)
    } else {
      console.error('获取排行榜数据失败')
      alert('获取排行榜数据失败')
    }
  }

  useEffect(() => {
    fetchRank().then()
  }, [])

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              积分排行榜
            </h2>
            {userRole === 'student' && <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4 mt-8">
              我的排名: {rank.findIndex(student => student.id === Number(studentId)) + 1}
            </div>}
            <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4 mt-4">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">姓名</th>
                    <th className="px-4 py-2">总积分</th>
                    <th className="px-4 py-2">排名</th>
                  </tr>
                </thead>
                <tbody>
                  {rank.map((student, index) => (
                    <tr key={student.id} className={(userRole === 'student' && student.id === Number(studentId)) ? 'bg-slate-200 dark:bg-slate-600' : ''}>
                      <td className="border px-4 py-2">{student.username}</td>
                      <td className="border px-4 py-2">{student.totalScore}</td>
                      <td className="border px-4 py-2">{index + 1}</td>
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
