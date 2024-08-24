import React, { useState } from 'react'
import Sidebar from '../../partials/Sidebar'
import Header from '../../partials/Header'

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const tasks = [
    {
      id: 1,
      title: '查看残局教学',
      description: '查看教师发布的残局教学，并开始练习。',
    },
    {
      id: 2,
      title: '练习残局',
      description: '按照教师的步骤一步步完成残局练习。',
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
              {tasks.map((task) => (
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
