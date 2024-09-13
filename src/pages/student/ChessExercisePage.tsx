import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

const ChessExercisePage = () => {
  const {chessboardId} = useParams() // 获取路由参数中的 chessboardId
  const navigate = useNavigate()
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

        // 获取残局的正确答案
        const movesResponse = await fetch(
          `${baseURL}/chessboard/${chessboardId}/moves`
        )
        const moves = await movesResponse.json()
        setCorrectMoves(moves)
      } catch (error) {
        console.error('获取残局数据错误:', error)
      }
    }

    fetchChessboardData()
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
  const handleDotClick = (x: number, y: number) => {
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
        if (moveIndex.current + 1 === correctMoves.length) {
          alert('恭喜完成！')
          navigate('/student/chessboard') // 导航回残局列表页面
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

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}}/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header/>
        <main className="grow p-8 w-full max-w-9xl mx-auto">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            残局练习
          </h1>
          <div className="flex flex-col flex-wrap justify-between items-center mt-4">
            <div className="relative w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 p-6 shadow-lg rounded-lg">
              <div className="bg-white mb-2 dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="sm:flex sm:justify-between sm:items-start">
                  <div className="grow mt-0.5 mb-3 sm:mb-0 space-y-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">题目描述</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {boardInfo?.description || '暂无文字描述'}
                    </div>
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
        </main>
      </div>
    </div>
  )
}

const calculateValidMoves = (piece, x, y, board) => {
  if (!piece) return []

  const my = piece[0] // 获取棋子颜色 'r' 或 'b'
  const type = piece[2] // 获取棋子类型 'c', 'm', 'x', 's', 'j', 'p', 'z'

  if (rules[type]) {
    return rules[type](x, y, board, my)
  }

  return []
}

export default ChessExercisePage
