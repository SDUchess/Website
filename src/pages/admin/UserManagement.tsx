
/* 用户管理 */
import Sidebar from '@/partials/Sidebar.tsx'
import Header from '@/partials/Header.tsx'
import { useEffect, useRef, useState } from 'react'
import { User, UserRole } from '@/types/User.ts'
import { baseURL } from '@/utils/Utils.ts'
import ModalBlank from '@/components/ModalBlank'

// 用户角色的tabs
const roles: UserRole[] = ['student', 'teacher', 'admin']

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  // 当前选中的用户角色tab
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  // selectedRole对应的用户列表
  const [userList, setUserList] = useState<User[]>([])

  const fetchUserList = async () => {
    const res = await fetch(`${baseURL}/users/admin/getUser?role=${selectedRole}`)
    if (res.ok) {
      const data = await res.json()
      setUserList(data)
    } else {
      console.error('获取用户列表失败')
      alert('获取用户列表失败')
    }
  }

  // 当前选中的用户
  const currentUser = useRef<User>()
  // 删除用户的Modal
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false)
  const deleteUser = async () => {
    if (!currentUser.current) {
      console.error('未选中用户')
      return
    }
    const res = await fetch(`${baseURL}/users/admin/deleteById?id=${currentUser.current.id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      console.log('删除用户成功')
      alert('已删除用户')
      setOpenDeleteUser(false)
      fetchUserList().then()
    } else {
      console.error('删除用户失败')
      alert('删除用户失败')
    }
  }

  // 根据selectedRole获取用户列表
  useEffect(() => {
    fetchUserList().then()
  }, [selectedRole])

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  用户管理
                </h1>
              </div>
            </div>
            <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">已管理的用户</h2>
                <button
                  className="btn bg-green-500 hover:bg-green-600 text-white"
                >新增用户
                </button>
              </div>
              {/* 顶部用户角色的tabs */}
              <div className="relative mb-1">
                <div className="absolute bottom-0 w-full h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
                <ul
                  className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                  {roles.map(role => (
                    <li
                      key={role}
                      className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
                      onClick={() => setSelectedRole(role)}
                    >
                      <span className={
                        `block pb-3 cursor-pointer whitespace-nowrap ${role === selectedRole ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`
                      }>{role === 'teacher' ? '教师' : role === 'student' ? '学生' : '管理员'}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {userList.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">用户名</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map(user => (
                      <tr key={user.id}>
                        <td className="border px-4 py-2">{user.id}</td>
                        <td className="border px-4 py-2">{user.username}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-4">
                            <button
                              className="btn bg-blue-500 text-white"
                            >修改
                            </button>
                            <button
                              className="btn bg-red-500 hover:bg-red-600 text-white"
                              aria-controls="modal-delete-user"
                              onClick={e => {
                                e.stopPropagation()
                                currentUser.current = user
                                setOpenDeleteUser(true)
                              }}
                            >删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-2">暂无用户信息</p>
              )}
            </div>
          </div>
        </main>
        {/* 删除用户的Modal */}
        <ModalBlank id="modal-delete-user" modalOpen={openDeleteUser} setModalOpen={setOpenDeleteUser}>
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
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">删除用户</div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-10">
                <div className="space-y-2">
                  <p>是否确认要删除此用户 {currentUser.current?.username} ?</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setOpenDeleteUser(false); }}>取消</button>
                <button onClick={deleteUser} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">确认删除</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  )
}
