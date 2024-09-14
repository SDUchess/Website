import React, { useState, useEffect } from 'react'
import Sidebar from '../../partials/Sidebar'
import Header from '../../partials/Header'

function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const tasks = [
    {
      id: 1,
      title: '发布挑战教学',
      description: '在空白棋盘上摆放棋子并录制解法，然后发布给学生。',
    },
    {
      id: 2,
      title: '管理学生',
      description: '通过搜索用户名添加学生，查看和管理学生列表。',
    },
    {
      id: 3,
      title: '查看学生练习情况',
      description: '查看学生的练习记录，提供反馈和评分。',
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
                教师仪表板 📚
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

export default TeacherDashboard
