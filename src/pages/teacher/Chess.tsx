import { useEffect, useState } from 'react'
import Sidebar from '../../partials/Sidebar'
import Header from '../../partials/Header'
import '../../css/ChessBoard.css' // 棋盘样式
import r_c from '../../images/chess/r_c.png'
import r_m from '../../images/chess/r_m.png'
import r_x from '../../images/chess/r_x.png'
import r_s from '../../images/chess/r_s.png'
import r_j from '../../images/chess/r_j.png'
import r_p from '../../images/chess/r_p.png'
import r_z from '../../images/chess/r_z.png'
import b_c from '../../images/chess/b_c.png'
import b_m from '../../images/chess/b_m.png'
import b_x from '../../images/chess/b_x.png'
import b_s from '../../images/chess/b_s.png'
import b_j from '../../images/chess/b_j.png'
import b_p from '../../images/chess/b_p.png'
import b_z from '../../images/chess/b_z.png'

import dotImg from '../../images/chess/dot.png'
import { rules } from '../../utils/ChessRules'
import { baseURL, useMedia } from '../../utils/Utils'
import { Chess, ChessBoard } from '@/types/Chess.ts'

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

const pieceNames = {
  r_c: '车',
  r_m: '马',
  r_x: '相',
  r_s: '仕',
  r_j: '将',
  r_p: '炮',
  r_z: '卒',
  b_c: '车',
  b_m: '马',
  b_x: '象',
  b_s: '士',
  b_j: '帅',
  b_p: '炮',
  b_z: '兵'
}

// 初始棋盘布局
const initialBoard: ChessBoard = [
  ['b_c', 'b_m', 'b_x', 'b_s', 'b_j', 'b_s', 'b_x', 'b_m', 'b_c'],
  [null, null, null, null, null, null, null, null, null],
  [null, 'b_p', null, null, null, null, null, 'b_p', null],
  ['b_z', null, 'b_z', null, 'b_z', null, 'b_z', null, 'b_z'],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  ['r_z', null, 'r_z', null, 'r_z', null, 'r_z', null, 'r_z'],
  [null, 'r_p', null, null, null, null, null, 'r_p', null],
  [null, null, null, null, null, null, null, null, null],
  ['r_c', 'r_m', 'r_x', 'r_s', 'r_j', 'r_s', 'r_x', 'r_m', 'r_c']
]

// 初始棋子数量
const initialCounts = {
  r_c: 2,
  r_m: 2,
  r_x: 2,
  r_s: 2,
  r_j: 1,
  r_p: 2,
  r_z: 5,
  b_c: 2,
  b_m: 2,
  b_x: 2,
  b_s: 2,
  b_j: 1,
  b_p: 2,
  b_z: 5
}

const ChessBoardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [board, setBoard] = useState<ChessBoard>(initialBoard)
  const [selectedPiece, setSelectedPiece] = useState<{type: Chess, x: number, y: number}>()
  const [validMoves, setValidMoves] = useState([])
  const [pieceCounts, setPieceCounts] = useState(initialCounts)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [moveHistory, setMoveHistory] = useState([])
  const [chessboardId, setChessboardId] = useState(null) // 用于保存录制的棋盘ID

  const handlePieceClick = (x: number, y: number) => {
    const piece: Chess = board[y][x]
    if (isEditMode) {
      // 编辑模式下，选中棋子用于放置
      if (piece && selectedPiece) {
        const newBoard = board.map((row) => row.slice())
        newBoard[y][x] = selectedPiece.type
        setBoard(newBoard)
        setPieceCounts((prev) => ({
          ...prev,
          [selectedPiece.type]: prev[selectedPiece.type] - 1
        }))
        setSelectedPiece(null)
      } else if (!piece && selectedPiece) {
        const newBoard = board.map((row) => row.slice())
        newBoard[y][x] = selectedPiece.type
        setBoard(newBoard)
        setPieceCounts((prev) => ({
          ...prev,
          [selectedPiece.type]: prev[selectedPiece.type] - 1
        }))
        setSelectedPiece(null)
        setValidMoves([])
      } else if (piece && !selectedPiece) {
        setSelectedPiece({type: piece, x, y})
        const newBoard = board.map((row) => row.slice())
        newBoard[y][x] = null
        setBoard(newBoard)
        setPieceCounts((prev) => ({
          ...prev,
          [piece]: prev[piece] + 1
        }))
      }
    } else {
      // 移动模式下处理棋子移动
      if (piece) {
        setSelectedPiece({type: piece, x, y})
        const moves = calculateValidMoves(piece, x, y, board)
        setValidMoves(moves)
      }
    }
  }

  const handleDotClick = (x, y) => {
    if (selectedPiece && isEditMode) {
      const newBoard = board.map((row) => row.slice())
      newBoard[y][x] = selectedPiece.type
      setBoard(newBoard)
      setPieceCounts((prev) => ({
        ...prev,
        [selectedPiece.type]: prev[selectedPiece.type] - 1
      }))
      setSelectedPiece(null)
      setValidMoves([])
    } else if (selectedPiece && !isEditMode) {
      const {x: oldX, y: oldY} = selectedPiece
      const newBoard = board.map((row) => row.slice())
      newBoard[y][x] = newBoard[oldY][oldX]
      newBoard[oldY][oldX] = null
      setBoard(newBoard)

      // 录制每一步棋子移动
      if (isRecording) {
        const move = `${oldX},${oldY}->${x},${y}`
        setMoveHistory((prevHistory) => [...prevHistory, move])
      }

      setSelectedPiece(null)
      setValidMoves([])
    }
  }

  const calculatePieceCounts = () => {
    const counts = {...initialCounts}
    board.forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          counts[piece] -= 1
        }
      })
    })
    setPieceCounts(counts)
  }

  const toggleEditMode = () => {
    if (!isEditMode) {
      calculatePieceCounts() // 进入编辑模式时更新棋子数量
    }
    setIsEditMode(!isEditMode)
    setSelectedPiece(null)
    setValidMoves([])
  }

  const clearBoard = () => {
    setBoard(Array(10).fill(Array(9).fill(null)))
    setPieceCounts(initialCounts) // 重置为最大值
  }

  const resetBoard = () => {
    setBoard(initialBoard)
    setTimeout(() => calculatePieceCounts(), 0)
  }

  const handleSelectPiece = (type) => {
    if (pieceCounts[type] > 0 && isEditMode) {
      setSelectedPiece({type})
      // 生成所有可放置的位置 (即当前棋盘上为空的格子)
      const validPositions = []
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          if (!board[y][x]) {
            validPositions.push([x, y])
          }
        }
      }
      setValidMoves(validPositions)
    }
  }

  // 残局题目, 描述文字
  const [chessboardName, setChessboardName] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const startRecording = async () => {
    setIsRecording(true)
    setMoveHistory([]) // 清空之前的录制历史

    if (chessboardName) {
      // 获取 teacherId
      const teacherId = localStorage.getItem('teacherId')

      const chessboardData = {
        name: chessboardName,
        initialBoard: JSON.stringify(board),
        teacherId: teacherId, // 将 teacherId 添加到数据中
        description
      }

      try {
        // 先保存棋盘初始状态，并获取其 ID
        const response = await fetch(
          `${baseURL}/chessboard/save`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(chessboardData)
          }
        )

        const savedBoard = await response.json()
        setChessboardId(savedBoard.id) // 保存棋盘 ID 以用于保存棋子移动
        alert('残局录制开始！')
      } catch (error) {
        console.error('Error saving chessboard:', error)
        alert('保存棋盘初始状态失败，请重试。')
        setIsRecording(false)
      }
    } else {
      alert('请填写残局题目名称')
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    setIsRecording(false)

    if (chessboardId && moveHistory.length > 0) {
      const movesData = moveHistory.map((move, index) => ({
        chessboardId: chessboardId,
        moveOrder: index + 1,
        move: move
      }))

      try {
        // 保存棋子移动记录
        const response = await fetch(
          `${baseURL}/chessboard/moves/save`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(movesData)
          }
        )

        if (response.ok) {
          alert('残局保存成功！')
        } else {
          alert('残局保存失败，请重试。')
        }
      } catch (error) {
        console.error('Error saving chess moves:', error)
        alert('请求失败，请检查网络连接。')
      }
    } else {
      alert('没有录制到任何棋子移动或棋盘未保存，请重试。')
    }
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
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <main className="grow p-8 w-full max-w-9xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              残局录制
            </h1>
            <div className="flex space-x-4">
              <button
                className="btn bg-green-500 text-white"
                onClick={toggleEditMode}>
                {isEditMode ? '退出编辑' : '编辑棋盘'}
              </button>
              {isEditMode && (
                <>
                  <button
                    className="btn bg-red-500 text-white"
                    onClick={clearBoard}>
                    清屏
                  </button>
                  <button
                    className="btn bg-blue-500 text-white"
                    onClick={resetBoard}>
                    初始化
                  </button>
                </>
              )}
              {!isEditMode && !isRecording && (
                <button
                  className="btn bg-yellow-500 text-white"
                  onClick={startRecording}>
                  录制残局
                </button>
              )}
              {isRecording && (
                <button
                  className="btn bg-yellow-500 text-white"
                  onClick={stopRecording}>
                  停止录制
                </button>
              )}
            </div>
          </div>
          {/* 棋盘 */}
          <div className="relative w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 p-6 shadow-lg rounded-lg">
            <div className="grid gap-6 mb-2 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">残局题目</label>
                <input type="text" id="first_name"
                       value={chessboardName}
                       onChange={(e) => setChessboardName(e.target.value)}
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="指定残局的题目..."/>
              </div>
            </div>
            <label htmlFor="message"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">残局描述</label>
            <textarea id="message" rows={4}
                      className="block mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="残局题目的介绍文字..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
            />
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
                        onClick={() => handleDotClick(x, y)}
                      />
                    )}
                  </ChessSquare>
                ))
              )}
            </div>
            {isEditMode && (
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex justify-center space-x-2">
                  {Object.keys(pieceImages)
                    .filter((type) => type.startsWith('r'))
                    .map((type) => (
                      <div key={type} className="flex flex-col items-center">
                        <img
                          src={pieceImages[type]}
                          alt={type}
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => handleSelectPiece(type)}
                        />
                        <span className="text-lg font-semibold">
                        {pieceNames[type]} ({pieceCounts[type]})
                      </span>
                      </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-2">
                  {Object.keys(pieceImages)
                    .filter((type) => type.startsWith('b'))
                    .map((type) => (
                      <div key={type} className="flex flex-col items-center">
                        <img
                          src={pieceImages[type]}
                          alt={type}
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => handleSelectPiece(type)}
                        />
                        <span className="text-lg font-semibold">
                        {pieceNames[type]} ({pieceCounts[type]})
                      </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

/**
 * size: 棋盘格子定位基本单位(棋子大小), 单位px
 */
const ChessSquare = ({
                       x, y, children, size
                     }) => {
  return (
    <div className={'chess-square'} style={{left: x * size, top: y * size}}>
      {children}
    </div>
  )
}

const ChessPiece = ({
                      type, onClick
                    }) => {
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

const Dot = ({
               x, y, onClick
             }) => {
  return <img src={dotImg} alt="dot" className="dot" onClick={onClick}/>
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

export default ChessBoardPage
