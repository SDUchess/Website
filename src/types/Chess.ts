export type ChessBoardInfo = {
  id: number,
  name: string,
  moveCount: number,
  description: string
}

export type ChessType =
  'r_c' | 'r_m' | 'r_x' | 'r_s' | 'r_j' | 'r_p' | 'r_z' |
  'b_c' | 'b_m' | 'b_x' | 'b_s' | 'b_j' | 'b_p' | 'b_z'

export type Chess = ChessType | null

export type ChessBoard = Chess[][]
