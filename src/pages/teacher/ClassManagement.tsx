/* 教师管理班级 */
import { FormEvent, useEffect, useRef, useState } from 'react'
import { StudentClass, User } from '@/types/User.ts'
import { baseURL } from '@/utils/Utils.ts'
import Sidebar from '@/partials/Sidebar.tsx'
import Header from '@/partials/Header.tsx'
import ModalBasic from '@/components/ModalBasic'
import ModalBlank from '@/components/ModalBlank'

export default function ClassManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([]) // 搜索结果
  const [managedClass, setManagedClass] = useState<StudentClass[]>([]) // 已管理的班级列表
  const [_selectedStudent, setSelectedStudent] = useState<User>() // 选中的学生

  // 获取 teacherId，确保 localStorage 中有这个值
  const teacherId = localStorage.getItem('teacherId')

  if (!teacherId) {
    alert('登录已过期, 请重新登录')
    return null
  }

  // 添加班级的Modal
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const handleAddClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const addForm = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch(`${baseURL}/class/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classes: addForm, teacher: { id: teacherId } }),
    })
    if (res.ok) {
      alert('添加班级成功')
      setShowAddClassModal(false)
      const newClass = await res.json()
      setManagedClass([...managedClass, newClass])
    } else {
      alert('添加班级失败, 请稍后重试')
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
        await fetchManagedClass() // 更新已管理学生列表
        setSearchResults([]) // 清空搜索结果
        setSearchTerm('') // 清空搜索框
      } else {
        response.text().then(text => alert(text))
      }
    } catch (error) {
      console.error('添加班级错误:', error)
    }
  }

  const fetchManagedClass = async () => {
    try {
      const response = await fetch(
        `${baseURL}/class/get/classByTeacherId?id=${teacherId}`
      )
      if (response.ok) {
        const data = await response.json()
        setManagedClass(data)
      } else {
        alert('获取班级列表失败')
      }
    } catch (error) {
      console.error('获取班级列表错误:', error)
    }
  }

  // 删除班级
  const [openDeleteClass, setOpenDeleteClass] = useState<boolean>(false)
  // 当前要删除的班级
  const currentClass = useRef<StudentClass>({} as StudentClass)
  const handleDeleteClass = async (classId: number) => {
    const response = await fetch(
      `${baseURL}/class/delete/${classId}`,
      {
        method: 'DELETE',
      }
    )

    if (response.ok) {
      alert('已删除班级')
      setOpenDeleteClass(false)
      await fetchManagedClass() // 更新已管理学生列表
    } else {
      alert('删除班级失败')
    }
  }

  useEffect(() => {
    fetchManagedClass().then() // 加载已管理学生列表
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
                  管理班级
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="flex mb-4">
                <button
                  className="btn bg-emerald-500 hover:bg-emerald-600 text-white mr-3 whitespace-nowrap"
                  onClick={e => {e.stopPropagation(); setShowAddClassModal(true)}}
                  aria-controls="modal-add-class"
                >
                  添加班级
                </button>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="输入班级名称进行搜索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
                >
                  搜索
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
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
              <h2 className="text-xl font-semibold mb-4">已管理的班级</h2>
              {managedClass.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">班级名</th>
                      <th className="px-4 py-2">介绍</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managedClass.map((studentClass) => (
                      <tr key={studentClass.id}>
                        <td className="border px-4 py-2">{studentClass.id}</td>
                        <td className="border px-4 py-2">{studentClass.name}</td>
                        <td className="border px-4 py-2">{studentClass.description}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                            aria-controls="modal-delete-class"
                            onClick={e => {
                              e.stopPropagation()
                              currentClass.current = studentClass
                              setOpenDeleteClass(true)
                            }}>
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>暂无管理的班级</p>
              )}
            </div>
          </div>
        </main>
        {/* 添加班级的Modal */}
        <ModalBasic id="modal-add-class" modalOpen={showAddClassModal} setModalOpen={setShowAddClassModal} title="添加班级">
          {/* Modal content */}
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-100 mb-3">指定要添加的班级的信息</div>
            </div>
            <form id="add-form" className="space-y-3" onSubmit={handleAddClass}>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">班级名称</label>
                <input name="name" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">班级介绍</label>
                <input name="description" className="form-input w-full px-2 py-1" type="text" required />
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap justify-end space-x-2">
              <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setShowAddClassModal(false); }}>取消</button>
              <button type="submit" form="add-form" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">确认添加</button>
            </div>
          </div>
        </ModalBasic>
        {/* 删除班级的Modal */}
        <ModalBlank id="modal-delete-class" modalOpen={openDeleteClass} setModalOpen={setOpenDeleteClass}>
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
              <svg className="w-4 h-4 shrink-0 fill-current text-rose-500" viewBox="0 0 16 16">
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1">
              {/* Modal header */}
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">删除班级</div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-10">
                <div className="space-y-2">
                  <p>是否确认要删除班级 {currentClass.current.name} ?</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setOpenDeleteClass(false); }}>取消</button>
                <button onClick={() => handleDeleteClass(currentClass.current.id)} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">确认删除</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  )
}
