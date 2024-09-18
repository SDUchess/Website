import { FormEvent, useEffect, useState } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { ChessBoardInfo } from '@/types/Chess.ts'
import { useNavigate } from 'react-router-dom'
import { StudentClass } from '@/types/User.ts'
import ModalBasic from '@/components/ModalBasic'
import ModalBlank from '@/components/ModalBlank'

function ChessboardManagement() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  // 所有挑战列表
  const [chessboardList, setChessboardList] = useState<ChessBoardInfo[]>([])
  // 班级selectedClass下的挑战列表
  const [boardInClass, setBoardInClass] = useState<ChessBoardInfo[]>([])

  // 已管理的班级列表
  const [managedClass, setManagedClass] = useState<StudentClass[]>([])
  // 当前选中的班级
  const [selectedClass, setSelectedClass] = useState<StudentClass>()
  // 当前选中的残局信息
  const [selectedBoard, setSelectedBoard] = useState<ChessBoardInfo>()

  // 获取 teacherId，确保 localStorage 中有这个值
  const teacherId = localStorage.getItem('teacherId')

  if (!teacherId) {
    alert('登录已过期, 请重新登录')
    return null
  }

  // 获取所有挑战
  const fetchChessboard = async () => {
    const res = await fetch(`${baseURL}/chessboard/all`)
    if (res.ok) {
      const data = await res.json()
      setChessboardList(data)
    } else {
      alert('获取挑战列表失败')
    }
  }

  // 获取班级下的所有挑战
  const fetchChessboardByClass = async () => {
    if (!selectedClass) {
      return
    }
    const response = await fetch(`${baseURL}/class/get/chessboardByClassId?id=${selectedClass.id}`)
    if (response.ok) {
      const data = await response.json()
      setBoardInClass(data)
    } else {
      alert('获取挑战列表失败')
    }
  }

  // 获取教师管理的班级
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

  // 添加挑战到班级
  const [openAddToClass, setOpenAddToClass] = useState<boolean>(false)
  const addBoardToClass = async (e: FormEvent<HTMLFormElement>)  => {
    e.preventDefault()
    if (!selectedBoard) {
      alert('未选中任何残局')
      return
    }
    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch(`${baseURL}/class/add/ChessBoardToClass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classesIds: [formData.classId],
        chessBoardId: selectedBoard.id
      })
    })
    if (res.ok) {
      alert('添加成功')
      await fetchChessboardByClass()
      setOpenAddToClass(false)
    } else {
      alert('添加失败')
    }
  }

  // 删除挑战
  const handleDeleteChessboard = async (chessboardId: number) => {
    const response = await fetch(
      `${baseURL}/chessboard/${chessboardId}`,
      {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      alert('挑战已成功删除')
      await fetchChessboard() // 更新挑战列表
    } else {
      alert('删除挑战失败')
    }
  }

  // 从班级删除挑战
  const [openDeleteBoard, setOpenDeleteBoard] = useState<boolean>(false)
  const deleteBoardFromClass = async () => {
    if (!selectedBoard || !selectedClass) {
      alert('未选中任何残局')
      return
    }
    const res = await fetch(`${baseURL}/class/delete/classWithBoard?classId=${selectedClass.id}&chessId=${selectedBoard.id}`,
      {
      method: 'DELETE'
    })
    if (res.ok) {
      alert('已从班级删除对应挑战')
      await fetchChessboardByClass()
      setOpenDeleteBoard(false)
    } else {
      alert('删除失败')
    }
  }

  // 教师查看挑战信息
  const viewChessboard = (chessboardId: number) => {
    navigate(`/teacher/chessboard/${chessboardId}`)
  }

  useEffect(() => {
    fetchChessboard().then()
    fetchManagedClass().then()
  }, [])

  useEffect(() => {
    fetchChessboardByClass().then()
  }, [selectedClass])

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
                  挑战管理
                </h1>
              </div>
            </div>

            {/* Chessboard Management Table */}
            <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              {/* 班级selectedClass下的挑战 */}
              <h2 className="text-xl font-semibold mb-4">班级挑战</h2>
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
              {boardInClass.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">名称</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardInClass.map((chessboard) => (
                      <tr key={chessboard.id}>
                        <td className="border px-4 py-2">{chessboard.id}</td>
                        <td className="border px-4 py-2">{chessboard.name}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-4">
                            <button
                              className="btn bg-blue-500 text-white"
                              onClick={() => viewChessboard(chessboard.id)}
                            >查看
                            </button>
                            <button
                              className="btn bg-violet-700 hover:bg-red-600 text-white"
                              aria-controls="modal-delete-board-fromClass"
                              onClick={e => {
                                e.stopPropagation()
                                setSelectedBoard(chessboard)
                                setOpenDeleteBoard(true)
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
                <p className="mt-2">该班级下暂无挑战</p>
              )}
              {/* 所有挑战 */}
              <h2 className="text-xl font-semibold mt-6">所有挑战</h2>
              {chessboardList.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">名称</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chessboardList.map((chessboard) => (
                      <tr key={chessboard.id}>
                        <td className="border px-4 py-2">{chessboard.id}</td>
                        <td className="border px-4 py-2">{chessboard.name}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-4">
                            <button
                              className="btn bg-blue-500 text-white"
                              onClick={() => viewChessboard(chessboard.id)}
                            >查看
                            </button>
                            <button
                              className="btn bg-blue-500 text-white"
                              aria-controls="modal-add-board-toclass"
                              onClick={e => {
                                e.stopPropagation()
                                setSelectedBoard(chessboard)
                                setOpenAddToClass(true)
                              }}
                            >发布到班级
                            </button>
                            <button
                              className="btn bg-red-500 hover:bg-red-600 text-white"
                              onClick={() =>
                                handleDeleteChessboard(chessboard.id)
                              }
                            >删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-2">暂无挑战</p>
              )}
            </div>
          </div>
        </main>
        {/* 发布挑战到班级的Modal */}
        <ModalBasic id="modal-add-board-toclass" modalOpen={openAddToClass} setModalOpen={setOpenAddToClass} title="发布挑战到班级">
          {/* Modal content */}
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-100 mb-3">指定要添加到的班级</div>
            </div>
            <form id="add-form" className="space-y-3" onSubmit={addBoardToClass}>
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
                  setOpenAddToClass(false)
                }}>取消
              </button>
              <button type="submit" form="add-form"
                      className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">确认添加
              </button>
            </div>
          </div>
        </ModalBasic>
        {/* 从班级删除挑战的Modal */}
        <ModalBlank id="modal-delete-board-fromClass" modalOpen={openDeleteBoard} setModalOpen={setOpenDeleteBoard}>
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
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">删除挑战</div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-10">
                <div className="space-y-2">
                  <p>是否确认要从班级删除该挑战?</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setOpenDeleteBoard(false); }}>取消</button>
                <button onClick={deleteBoardFromClass} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">确认删除</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  )
}

export default ChessboardManagement
