export type ChessBoardInfo = {
  id: number,
  name: string,
  moveCount: number,
  description: string,
  score: number,
  /**
   * 是否完成该挑战. 学生用户才会用到这个字段, 其他用户为undefined
   */
  finished: boolean
}

export type ChessType =
  'r_c' | 'r_m' | 'r_x' | 'r_s' | 'r_j' | 'r_p' | 'r_z' |
  'b_c' | 'b_m' | 'b_x' | 'b_s' | 'b_j' | 'b_p' | 'b_z'

export type Chess = ChessType | null

export type ChessMove = {
  id: number,
  chessboardId: number,
  moveOrder: number,
  move: string // string like "6,7->6,6"
}

export type ChessBoard = Chess[][]
