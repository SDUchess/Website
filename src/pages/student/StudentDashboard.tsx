import React, { useEffect, useState } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [score, setScore] = useState<number>(0)
  const studentId = localStorage.getItem('studentId')
  if (!studentId) {
    alert('登录已过期, 请重新登录')
    return null
  }
  const getStudentScore = async () => {
    const res = await fetch(`${baseURL}/users/student/getScoreById?studentId=${studentId}`)
    if (res.ok) {
      const data = await res.json()
      setScore(data)
    } else {
      console.error('获取学生积分失败')
    }
  }

  useEffect(() => {
    getStudentScore().then()
  }, [])

  const description = [
    {
      id: 1,
      title: '查看挑战教学',
      description: '查看教师发布的挑战教学，并开始练习。',
    },
    {
      id: 2,
      title: '练习挑战',
      description: '按照教师的步骤一步步完成挑战练习。',
    },
    {
      id: 3,
      title: '查看练习记录',
      description: '查看自己的练习记录，了解完成情况和教师的反馈。',
    },
  ]

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                学生仪表板 🎓
              </h1>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              <div
                className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="sm:flex sm:justify-between sm:items-start">
                  <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      我的积分: {score}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      完成挑战教学可以获得积分哦!
                    </div>
                  </div>
                </div>
              </div>
              {description.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
                  <div className="sm:flex sm:justify-between sm:items-start">
                    <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {task.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {task.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard
