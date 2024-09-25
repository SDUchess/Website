import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { ChessBoardInfo } from '@/types/Chess.ts'
import { useNavigate } from 'react-router-dom'
import ModalBlank from '@/components/ModalBlank'

function ChessboardManagement() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  // 所有挑战列表
  const [chessboardList, setChessboardList] = useState<ChessBoardInfo[]>([])

  // 获取 adminId，确保 localStorage 中有这个值
  const adminId = localStorage.getItem('adminId')

  if (!adminId) {
    alert('登录已过期, 请重新登录')
    return null
  }

  // 获取所有基础挑战
  const fetchChessboard = async () => {
    const res = await fetch(`${baseURL}/chessboard/basic/all?role=admin`)
    if (res.ok) {
      const data = await res.json()
      setChessboardList(data)
    } else {
      alert('获取挑战列表失败')
    }
  }

  // 删除挑战
  const handleDeleteChessboard = async () => {
    if (!currentBoard.current) {
      alert('未选择挑战')
      return
    }
    const response = await fetch(
      `${baseURL}/chessboard/${currentBoard.current.id}`,
      {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      alert('挑战已成功删除')
      await fetchChessboard() // 更新挑战列表
      setOpenDeleteBoard(false)
    } else {
      alert('删除挑战失败')
    }
  }

  // 查看挑战信息
  const viewChessboard = (chessboardId: number) => {
    navigate(`/admin/chessboard/${chessboardId}`)
  }

  // 删除挑战的Modal
  const [openDeleteBoard, setOpenDeleteBoard] = useState<boolean>(false)
  const currentBoard = useRef<ChessBoardInfo>()

  useEffect(() => {
    fetchChessboard().then()
  }, [])

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
                  基础挑战管理
                </h1>
              </div>
            </div>

            {/* Chessboard Management Table */}
            <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              {/* 所有挑战 */}
              <h2 className="text-xl font-semibold mt-2">所有基础挑战</h2>
              {chessboardList.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">名称</th>
                      <th className="px-4 py-2">分数</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chessboardList.map((chessboard, index) => (
                      <tr key={chessboard.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{chessboard.name}</td>
                        <td className="border px-4 py-2">{chessboard.score}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-4">
                            <button
                              className="btn bg-blue-500 text-white"
                              onClick={() => viewChessboard(chessboard.id)}
                            >查看
                            </button>
                            <button
                              className="btn bg-red-500 hover:bg-red-600 text-white"
                              aria-controls="modal-delete-board"
                              onClick={e => {
                                e.stopPropagation()
                                currentBoard.current = chessboard
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
                <p className="mt-2">暂无挑战</p>
              )}
            </div>
          </div>
        </main>
        {/* 删除挑战的Modal */}
        <ModalBlank id="modal-delete-board" modalOpen={openDeleteBoard} setModalOpen={setOpenDeleteBoard}>
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
                  <p>是否确认删除该挑战?</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setOpenDeleteBoard(false); }}>取消</button>
                <button onClick={handleDeleteChessboard} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">确认删除</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  )
}

export default ChessboardManagement
