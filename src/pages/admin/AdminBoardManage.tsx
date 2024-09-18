import { useEffect, useState } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { ChessBoardInfo } from '@/types/Chess.ts'
import { useNavigate } from 'react-router-dom'

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
    const res = await fetch(`${baseURL}/chessboard/admin/all`)
    if (res.ok) {
      const data = await res.json()
      setChessboardList(data)
    } else {
      alert('获取挑战列表失败')
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

  // 查看挑战信息
  const viewChessboard = (chessboardId: number) => {
    navigate(`/admin/chessboard/${chessboardId}`)
  }

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
      </div>
    </div>
  )
}

export default ChessboardManagement
