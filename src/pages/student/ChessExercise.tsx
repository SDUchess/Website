import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import '@/css/ChessBoard.css' // 棋盘样式

import { rules } from '@/utils/ChessRules'
import { baseURL, useMedia } from '@/utils/Utils'
import Switch from '@/components/Switch.tsx'
import { Chess, ChessBoard, ChessBoardInfo, ChessMove } from '@/types/Chess.ts'
import ChessSquare from '@/components/ChessSquare.tsx'
import ChessPiece from '@/components/ChessPiece.tsx'
import Dot from '@/components/Dot.tsx'
import { pieceNames } from '@/images/piece-images.ts'

const ChessExercise = () => {
  const {chessboardId} = useParams() // 获取路由参数中的 chessboardId
  const userRole = localStorage.getItem('userRole')
  if (!userRole) {
    alert('登录已过期, 请重新登录')
    return null
  }

  const [board, setBoard] = useState<ChessBoard>([])
  const [boardInfo, setBoardInfo] = useState<ChessBoardInfo>()
  const [correctMoves, setCorrectMoves] = useState<ChessMove[]>([])
  const [selectedPiece, setSelectedPiece] = useState<{type: Chess, x: number, y: number}>()
  const [validMoves, setValidMoves] = useState<number[][]>([])
  const moveIndex = useRef<number>(0)
  const [hintUsed, setHintUsed] = useState(false)

  useEffect(() => {
    const fetchChessboardData = async () => {
      try {
        const response = await fetch(
          `${baseURL}/chessboard/${chessboardId}`
        )
        const chessboard = await response.json()
        setBoardInfo(chessboard)
        setBoard(JSON.parse(chessboard.initialBoard))

        // 获取挑战的正确答案
        const movesResponse = await fetch(
          `${baseURL}/chessboard/${chessboardId}/moves`
        )
        const moves = await movesResponse.json()
        setCorrectMoves(moves)
      } catch (error) {
        console.error('获取挑战数据错误:', error)
      }
    }

    fetchChessboardData().then()
  }, [chessboardId])

  const handlePieceClick = (x: number, y: number) => {
    const piece = board[y][x]
    if (piece) {
      setSelectedPiece({type: piece, x, y})
      const moves = calculateValidMoves(piece, x, y, board)
      setValidMoves(moves)
      setHintUsed(false)
    }
  }

  /**
   * 点击可行点, 判断是否要移动棋子 <br>
   * auto: 是否为自动走棋
   */
  const handleDotClick = async (x: number, y: number) => {
    if (selectedPiece) {
      const {x: oldX, y: oldY} = selectedPiece
      const correctMove = correctMoves[moveIndex.current]

      // 检查是否为正确的移动
      const moveStr = `${oldX},${oldY}->${x},${y}`
      if (moveStr === correctMove.move) {
        const newBoard = board.map((row) => row.slice())
        newBoard[y][x] = newBoard[oldY][oldX]
        newBoard[oldY][oldX] = null
        setBoard(newBoard)
        setSelectedPiece(undefined)
        setValidMoves([])
        if (enableAutoMove) {
          setTimeout(() => autoMove(moveIndex.current), 500)
        }
        moveIndex.current++

        // 检查是否完成所有移动
        if (moveIndex.current + 1 >= correctMoves.length) {
          if (userRole === 'teacher' || userRole === 'admin') {
            alert('挑战已完成')
            return
          }
          const studentId = localStorage.getItem('studentId')
          // 发送请求完成挑战
          const res = await fetch(`${baseURL}/chessboard/finish`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              student: { id: studentId },
              chessBoard: { id: chessboardId }
            })
          })
          if (res.ok) {
            alert('恭喜完成挑战!')
          } else {
            alert('挑战记录失败, 请稍后重试')
          }
        }
      } else {
        alert('做题错误，请重试')
        setSelectedPiece(undefined)
        setValidMoves([])
      }
    }
  }

  const handleHintClick = () => {
    if (hintUsed) {
      setHintUsed(false)
      setValidMoves([])
    } else if (correctMoves[moveIndex.current]) {
      const correctMove = correctMoves[moveIndex.current].move.split('->')[1]
      const [correctX, correctY] = correctMove.split(',').map(Number)
      setValidMoves([[correctX, correctY]])
      setHintUsed(true)
    }
  }

  // 自动走棋, 执行下一步正确答案
  const autoMove = (index: number) => {
    if (correctMoves[index]) {
      const correctMove = correctMoves[index].move.split('->')
      const [oldX, oldY] = correctMove[0].split(',').map(Number)
      const [newX, newY] = correctMove[1].split(',').map(Number)
      // 用函数更新state, 避免闭包陷阱(board总是为旧值)
      setBoard(oldBoard => {
        const newBoard = oldBoard.map((row) => row.slice())
        newBoard[newY][newX] = newBoard[oldY][oldX]
        newBoard[oldY][oldX] = null
        return newBoard
      })
      setSelectedPiece(undefined)
      moveIndex.current++
    }
  }

  // 是否开启自动走棋
  const [enableAutoMove, setEnableAutoMove] = useState<boolean>(true)

  // 媒体查询, 屏幕宽度小于 460px 时, 棋子大小减小
  const isSmallScreen = useMedia('(max-width: 460px)')
  const [size, setSize] = useState(40)
  useEffect(() => {
    if (isSmallScreen) {
      setSize(30)
    } else {
      setSize(40)
    }
  }, [isSmallScreen])

  // 获取棋盘内指定位置棋子的label
  const getPieceLabel = (x: number, y: number) => {
    const piece = board[y][x]
    if (piece) {
      return pieceNames[piece]
    }
    return '空'
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}}/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header/>
        <main className="grow p-8 w-full max-w-9xl mx-auto">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            挑战练习
          </h1>
          <div className="flex flex-col flex-wrap space-y-4 justify-between items-center mt-4">
            <div className="relative w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 p-6 shadow-lg rounded-lg">
              <div
                className="bg-white mb-2 dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="sm:flex sm:justify-between sm:items-start">
                  <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{boardInfo?.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {boardInfo?.description || '暂无文字描述'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">题目分值: {boardInfo?.score || 0}</div>
                  </div>
                </div>
              </div>
              <div className="relative chessboard mx-auto">
                {board.map((row, y) =>
                  row.map((piece, x) => (
                    <ChessSquare key={`${x}-${y}`} size={size} x={x} y={y}>
                      {piece && (
                        <ChessPiece
                          type={piece}
                          onClick={() => handlePieceClick(x, y)}
                        />
                      )}
                      {validMoves.some(
                        (move) => move[0] === x && move[1] === y
                      ) && (
                        <Dot
                          key={`dot-${x}-${y}`}
                          hintUsed={hintUsed}
                          onClick={() => handleDotClick(x, y)}
                        />
                      )}
                    </ChessSquare>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <button
                className="btn mr-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={handleHintClick}>
                提示
              </button>
              <Switch checked={enableAutoMove} onChange={checked => setEnableAutoMove(checked)} label={'自动走棋'}/>
            </div>
          </div>
          {/* 教师才能看到的挑战信息, 目前展示每一步棋子移动的信息的表格 */}
          {(userRole === 'teacher' || userRole === 'admin') && <>
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">挑战信息</h1>
            <div
                className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4 mt-4">
              <h2 className="text-xl font-semibold mb-4">正确答案</h2>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">步数</th>
                    <th className="px-4 py-2">移动</th>
                  </tr>
                </thead>
                <tbody>
                  {correctMoves.map((move, index) => (
                    // 根据moveIndex.current, 高亮显示当前补数对应的数据行
                    <tr key={move.id} className={index === moveIndex.current ? 'bg-slate-200 dark:bg-slate-600' : ''}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {(() => {
                          const [from, to] = move.move.split('->')
                          const [fromX, fromY] = from.split(',').map(Number)
                          const [toX, toY] = to.split(',').map(Number)
                          return (
                            <span>
                            {`${getPieceLabel(fromX, fromY)}(${fromY + 1},${fromX + 1}) -> (${toY + 1},${toX + 1})`}
                          </span>
                          )
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}
        </main>
      </div>
    </div>
  )
}

const calculateValidMoves = (piece: Chess, x: number, y: number, board: ChessBoard) => {
  if (!piece) return []

  const my = piece[0] // 获取棋子颜色 'r' 或 'b'
  const type = piece[2] // 获取棋子类型 'c', 'm', 'x', 's', 'j', 'p', 'z'

  if (rules[type]) {
    return rules[type](x, y, board, my)
  }

  return []
}

export default ChessExercise
