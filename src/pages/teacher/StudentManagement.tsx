import { useState, useEffect, FormEvent } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { StudentClass, User } from '@/types/User.ts'
import ModalBasic from '@/components/ModalBasic'
import ModalBlank from '@/components/ModalBlank'

function StudentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([]) // 搜索结果
  const [managedStudents, setManagedStudents] = useState<User[]>([]) // 已管理的学生列表
  // 已管理的班级列表
  const [managedClass, setManagedClass] = useState<StudentClass[]>([])
  // 当前选中的班级
  const [selectedClass, setSelectedClass] = useState<StudentClass>()

  // 获取 teacherId，确保 localStorage 中有这个值
  const teacherId = localStorage.getItem('teacherId')

  if (!teacherId) {
    alert('登录已过期, 请重新登录')
    return null
  }

  const handleSearch = async () => {
    const response = await fetch(
      `${baseURL}/users/students?username=${searchTerm}`
    )
    if (response.ok) {
      const data = await response.json()
      setSearchResults(data)
    } else {
      alert('搜索失败，请重试')
    }
  }

  // 添加学生到班级
  // 当前选中的学生
  const [selectedStudent, setSelectedStudent] = useState<User>()
  const [openAddStudent, setOpenAddStudent] = useState<boolean>(false)
  const handleAddStudent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const addForm = Object.fromEntries(new FormData(e.currentTarget))
    const response = await fetch(
      `${baseURL}/class/add/StudentToClass?classesId=${addForm.classId}&studentId=${selectedStudent?.id}`,
      {
        method: 'POST',
      }
    )
    if (response.ok) {
      alert('学生已成功加入对应班级')
      await fetchStudentsByClass() // 更新已管理学生列表
      setOpenAddStudent(false)
      // 清空搜索结果和搜索框
      setSearchResults([])
      setSearchTerm('')
    } else {
      response.text().then(text => alert(text))
    }
  }

  const fetchManagedClass = async () => {
    const response = await fetch(
      `${baseURL}/class/get/classByTeacherId?id=${teacherId}`
    )
    if (response.ok) {
      const data = await response.json()
      setManagedClass(data)
      if (data.length > 0) {
        // 默认选中第一个班级
        setSelectedClass(data[0])
      }
    } else {
      alert('获取班级列表失败')
    }
  }

  // 获取selectedClass下的学生列表
  const fetchStudentsByClass = async () => {
    if (!selectedClass) {
      return
    }
    const response = await fetch(
      `${baseURL}/class/get/studentByClassId?id=${selectedClass.id}`
    )
    if (response.ok) {
      const data = await response.json()
      setManagedStudents(data)
    } else {
      alert('获取班级学生列表失败')
    }
  }

  // 从班级删除学生
  const [openDeleteStudent, setOpenDeleteStudent] = useState<boolean>(false)
  const handleDeleteStudent = async () => {
    if (!selectedClass || !selectedStudent) {
      alert('未选中班级或学生')
      return
    }
    const response = await fetch(
      `${baseURL}/class/delete/classWithStudent?classId=${selectedClass.id}&studentId=${selectedStudent.id}`,
      {
        method: 'DELETE',
      }
    )

    if (response.ok) {
      alert('学生已成功从对应班级中删除')
      await fetchStudentsByClass() // 更新已管理学生列表
      setOpenDeleteStudent(false)
    } else {
      alert('删除学生失败')
    }
  }

  useEffect(() => {
    fetchStudentsByClass().then() // 加载已管理学生列表
    fetchManagedClass().then() // 加载已管理班级列表
  }, [])

  useEffect(() => {
    fetchStudentsByClass().then()
  }, [selectedClass])

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
                      >
                        {student.username}
                        <button
                          className="btn bg-green-500 hover:bg-green-600 text-white ml-3"
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedStudent(student)
                            setOpenAddStudent(true)
                          }}
                          aria-controls="modal-add-student"
                        >
                          添加至班级
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              <h2 className="text-xl font-semibold mb-4">已管理的学生</h2>
              {/* 顶部班级的tabs */}
              <div className="relative mb-1">
                <div className="absolute bottom-0 w-full h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
                <ul
                  className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                  {managedClass.map(clazz => (
                    <li
                      key={clazz.id}
                      className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
                      onClick={() => setSelectedClass(clazz)}
                    >
                      <span className={
                        `block pb-3 cursor-pointer whitespace-nowrap ${clazz === selectedClass ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`
                      }>{clazz.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* 表格 */}
              {managedStudents.length ? (
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
                            aria-controls="modal-delete-student"
                            onClick={e => {
                              e.stopPropagation()
                              setOpenDeleteStudent(true)
                              setSelectedStudent(student)
                            }}>
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-2">该班级下暂无管理的学生</p>
              )}
            </div>
          </div>
        </main>
        {/* 添加学生到班级的Modal */}
        <ModalBasic id="modal-add-student" modalOpen={openAddStudent} setModalOpen={setOpenAddStudent} title="添加班级">
          {/* Modal content */}
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-100 mb-3">指定要添加到的班级</div>
            </div>
            <form id="add-form" className="space-y-3" onSubmit={handleAddStudent}>
              <select name="classId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {managedClass.map(clazz => (
                  <option key={clazz.id} value={clazz.id}>{clazz.name}</option>
                ))}
              </select>
            </form>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={e => {
                  e.stopPropagation()
                  setOpenAddStudent(false)
                }}>取消
              </button>
              <button type="submit" form="add-form"
                      className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">确认添加
              </button>
            </div>
          </div>
        </ModalBasic>
        {/* 从班级删除学生的Modal */}
        <ModalBlank id="modal-delete-student" modalOpen={openDeleteStudent} setModalOpen={setOpenDeleteStudent}>
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
                  <p>是否确认要从班级删除该学生?</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setOpenDeleteStudent(false); }}>取消</button>
                <button onClick={handleDeleteStudent} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">确认删除</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  )
}

export default StudentManagement
