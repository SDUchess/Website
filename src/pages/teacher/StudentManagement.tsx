import { useState, useEffect } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { User } from '@/types/User.ts'

function StudentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([]) // 搜索结果
  const [managedStudents, setManagedStudents] = useState<User[]>([]) // 已管理的学生列表
  const [_selectedStudent, setSelectedStudent] = useState<User>() // 选中的学生

  // 获取 teacherId，确保 localStorage 中有这个值
  const teacherId = localStorage.getItem('teacherId')

  if (!teacherId) {
    console.error('Teacher ID is missing. Please log in.')
    alert('Teacher ID is missing. Please log in.')
    return null // 或者根据你的需求进行进一步处理，比如重定向到登录页面
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${baseURL}/users/students?username=${searchTerm}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        alert('搜索失败，请重试')
      }
    } catch (error) {
      console.error('搜索错误:', error)
    }
  }

  const handleAddStudent = async (studentId: number) => {
    console.log(teacherId, studentId)
    try {
      const response = await fetch(
        `${baseURL}/users/addStudentToTeacher?teacherId=${teacherId}&studentId=${studentId}`,
        {
          method: 'POST',
        }
      )

      if (response.ok) {
        alert('学生已成功加入管理列表')
        await fetchManagedStudents() // 更新已管理学生列表
        setSearchResults([]) // 清空搜索结果
        setSearchTerm('') // 清空搜索框
      } else {
        response.text().then(text => alert(text))
      }
    } catch (error) {
      console.error('添加学生错误:', error)
    }
  }

  const fetchManagedStudents = async () => {
    try {
      const response = await fetch(
        `${baseURL}/users/teacher/${teacherId}/students`
      )
      if (response.ok) {
        const data = await response.json()
        setManagedStudents(data)
      } else {
        alert('获取学生列表失败')
      }
    } catch (error) {
      console.error('获取学生列表错误:', error)
    }
  }

  const handleDeleteStudent = async (studentId: number) => {
    try {
      const response = await fetch(
        `${baseURL}/users/teacher/${teacherId}/student/${studentId}`,
        {
          method: 'DELETE',
        }
      )

      if (response.ok) {
        alert('学生已成功从管理列表中删除')
        await fetchManagedStudents() // 更新已管理学生列表
      } else {
        alert('删除学生失败')
      }
    } catch (error) {
      console.error('删除学生错误:', error)
    }
  }

  useEffect(() => {
    fetchManagedStudents().then() // 加载已管理学生列表
  }, [])

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  管理学生
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="flex mb-4">
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="输入学生用户名进行搜索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
                  onClick={handleSearch}>
                  搜索
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
                  <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
                  <ul>
                    {searchResults.map((student) => (
                      <li
                        key={student.id}
                        className="p-2 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 flex justify-between items-center"
                        onClick={() => setSelectedStudent(student)}>
                        {student.username}
                        <button
                          className="btn bg-green-500 hover:bg-green-600 text-white ml-3"
                          onClick={() => handleAddStudent(student.id)}>
                          添加
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Managed Students Table */}
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              <h2 className="text-xl font-semibold mb-4">已管理的学生</h2>
              {managedStudents.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">用户名</th>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managedStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="border px-4 py-2">{student.username}</td>
                        <td className="border px-4 py-2">{student.id}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDeleteStudent(student.id)}>
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>暂无管理的学生。</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentManagement
