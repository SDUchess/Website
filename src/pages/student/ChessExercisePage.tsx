import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '@/partials/Sidebar'
import Header from '@/partials/Header'
import '@/css/ChessBoard.css' // 棋盘样式
import r_c from '@/images/chess/r_c.png'
import r_m from '@/images/chess/r_m.png'
import r_x from '@/images/chess/r_x.png'
import r_s from '@/images/chess/r_s.png'
import r_j from '@/images/chess/r_j.png'
import r_p from '@/images/chess/r_p.png'
import r_z from '@/images/chess/r_z.png'
import b_c from '@/images/chess/b_c.png'
import b_m from '@/images/chess/b_m.png'
import b_x from '@/images/chess/b_x.png'
import b_s from '@/images/chess/b_s.png'
import b_j from '@/images/chess/b_j.png'
import b_p from '@/images/chess/b_p.png'
import b_z from '@/images/chess/b_z.png'

import dotImg from '@/images/chess/dot.png'
import dot2Img from '@/images/chess/dot2.png'
import { rules } from '@/utils/ChessRules'
import { baseURL, useMedia } from '@/utils/Utils'

// 棋子图片映射
const pieceImages = {
  r_c,
  r_m,
  r_x,
  r_s,
  r_j,
  r_p,
  r_z,
  b_c,
  b_m,
  b_x,
  b_s,
  b_j,
  b_p,
  b_z
}

const ChessExercisePage = () => {
  const {chessboardId} = useParams() // 获取路由参数中的 chessboardId
  const navigate = useNavigate()
  const [board, setBoard] = useState<(string | null)[][]>([])
  const [correctMoves, setCorrectMoves] = useState([])
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState<number[][]>([])
  const [moveIndex, setMoveIndex] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)

  useEffect(() => {
    const fetchChessboardData = async () => {
      try {
        const response = await fetch(
          `${baseURL}/chessboard/${chessboardId}`
        )
        const chessboard = await response.json()
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

  const handlePieceClick = (x, y) => {
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
  const handleDotClick = (x, y) => {
    if (selectedPiece) {
      const {x: oldX, y: oldY} = selectedPiece
      const correctMove = correctMoves[moveIndex]

      // 检查是否为正确的移动
      const moveStr = `${oldX},${oldY}->${x},${y}`
      if (moveStr === correctMove.move) {
        const newBoard = board.map((row) => row.slice())
        console.log('board = ', board)
        console.log('newBoard = ', newBoard)
        newBoard[y][x] = newBoard[oldY][oldX]
        newBoard[oldY][oldX] = null
        setBoard(newBoard)
        setSelectedPiece(null)
        setValidMoves([])
        setMoveIndex(moveIndex + 1)

        // 检查是否完成所有移动
        if (moveIndex + 1 === correctMoves.length) {
          alert('恭喜完成！')
          navigate('/student/chessboard') // 导航回残局列表页面
        }
      } else {
        alert('做题错误，请重试')
        setSelectedPiece(null)
        setValidMoves([])
      }
    }
  }

  const handleHintClick = () => {
    if (hintUsed) {
      setHintUsed(false)
      setValidMoves([])
    } else if (correctMoves[moveIndex]) {
      const correctMove = correctMoves[moveIndex].move.split('->')[1]
      const [correctX, correctY] = correctMove.split(',').map(Number)
      setValidMoves([[correctX, correctY]])
      setHintUsed(true)
    }
  }

  // 自动走棋
  const autoMoveInterval = useRef<number>()
  const autoMove = () => {
    if (autoMoveInterval.current) {
      clearInterval(autoMoveInterval.current)
      return
    }
    let autoMoveIndex: number = moveIndex
    autoMoveInterval.current = setInterval(() => {
      if (correctMoves[autoMoveIndex]) {
        const correctMove = correctMoves[autoMoveIndex].move.split('->')
        const [oldX, oldY] = correctMove[0].split(',').map(Number)
        const [newX, newY] = correctMove[1].split(',').map(Number)
        // 用函数更新state, 避免闭包陷阱(board总是为旧值)
        setBoard(oldBoard => {
          const newBoard = oldBoard.map((row) => row.slice())
          newBoard[newY][newX] = newBoard[oldY][oldX]
          newBoard[oldY][oldX] = null
          return newBoard
        })
        setSelectedPiece(null)
        autoMoveIndex++
        setMoveIndex(autoMoveIndex)
      } else {
        clearInterval(autoMoveInterval.current)
        autoMoveInterval.current = undefined
        alert('自动走棋结束, 可以自己尝试一下~')
      }
    }, 1000) as unknown as number
  }

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
      <Sidebar/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header/>
        <main className="grow p-8 w-full max-w-9xl mx-auto">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            残局练习
          </h1>
          <div className="flex flex-wrap justify-between items-center mt-4">
            <div className="relative w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 p-6 shadow-lg rounded-lg">
              <div className="relative chessboard mx-auto">
                {board.map((row, y) =>
                  row.map((piece, x) => (
                    <ChessSquare key={`${x}-${y}`} size={size} x={x} y={y}>
                      {piece && (
                        <ChessPiece
                          type={piece}
                          x={x}
                          y={y}
                          onClick={() => handlePieceClick(x, y)}
                        />
                      )}
                      {validMoves.some(
                        (move) => move[0] === x && move[1] === y
                      ) && (
                        <Dot
                          key={`dot-${x}-${y}`}
                          x={x}
                          y={y}
                          hintUsed={hintUsed}
                          onClick={() => handleDotClick(x, y)}
                        />
                      )}
                    </ChessSquare>
                  ))
                )}
              </div>
            </div>
            <div className="ml-8">
              <button
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={handleHintClick}>
                提示
              </button>
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white ml-4"
                onClick={autoMove}
              >
                自动走棋
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const ChessSquare = ({x, y, children, size}) => {
  return <div className={'chess-square'} style={{left: x * size, top: y * size}}>{children}</div>
}

const ChessPiece = ({type, onClick}) => {
  const src = pieceImages[type]

  return (
    <img
      src={src}
      alt={type}
      className="chess-piece"
      onClick={onClick}
      style={{position: 'absolute'}}
    />
  )
}

const Dot = ({x, y, onClick, hintUsed}) => {
  return (
    <img
      src={hintUsed ? dot2Img : dotImg}
      alt="dot"
      className="dot"
      onClick={onClick}
    />
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
