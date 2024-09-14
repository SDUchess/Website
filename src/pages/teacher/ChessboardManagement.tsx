import { useEffect, useState } from 'react'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import { baseURL } from '@/utils/Utils.ts'
import { ChessBoardInfo } from '@/types/Chess.ts'
import { useNavigate } from 'react-router-dom'

function ChessboardManagement() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [chessboards, setChessboards] = useState<ChessBoardInfo[]>([]) // 保存从后端获取的残局数据

  // 获取所有残局
  const fetchChessboards = async () => {
    try {
      const response = await fetch(`${baseURL}/chessboard/all`)
      if (response.ok) {
        const data = await response.json()
        setChessboards(data)
      } else {
        alert('获取残局列表失败')
      }
    } catch (error) {
      console.error('获取残局列表错误:', error)
    }
  }

  // 删除残局
  const handleDeleteChessboard = async (chessboardId: number) => {
    console.log(chessboardId)
    try {
      const response = await fetch(
        `${baseURL}/chessboard/${chessboardId}`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        alert('残局已成功删除')
        await fetchChessboards() // 更新残局列表
      } else {
        alert('删除残局失败')
      }
    } catch (error) {
      console.error('删除残局错误:', error)
    }
  }

  // 教师查看残局信息
  const viewChessboard = (chessboardId: number) => {
    navigate(`/teacher/chessboard/${chessboardId}`)
  }

  useEffect(() => {
    fetchChessboards().then() // 页面加载时获取残局列表
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
                  残局管理
                </h1>
              </div>
            </div>

            {/* Chessboard Management Table */}
            <div
              className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
              <h2 className="text-xl font-semibold mb-4">所有残局</h2>
              {chessboards.length > 0 ? (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">名称</th>
                      <th className="px-4 py-2">步数</th>
                      <th className="px-4 py-2">描述</th>
                      <th className="px-4 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chessboards.map((chessboard) => (
                      <tr key={chessboard.id}>
                        <td className="border px-4 py-2">{chessboard.id}</td>
                        <td className="border px-4 py-2">{chessboard.name}</td>
                        <td className="border px-4 py-2">
                          {chessboard.moveCount}
                        </td>
                        <td className="border px-4 py-2">{chessboard.description || '暂无文字描述'}</td>
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
                <p>暂无残局。</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChessboardManagement
