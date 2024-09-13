import r_c from './chess/r_c.png'
import r_m from './chess/r_m.png'
import r_x from './chess/r_x.png'
import r_s from './chess/r_s.png'
import r_j from './chess/r_j.png'
import r_p from './chess/r_p.png'
import r_z from './chess/r_z.png'
import b_c from './chess/b_c.png'
import b_m from './chess/b_m.png'
import b_x from './chess/b_x.png'
import b_s from './chess/b_s.png'
import b_j from './chess/b_j.png'
import b_p from './chess/b_p.png'
import b_z from './chess/b_z.png'
import { ChessType } from '@/types/Chess.ts'

export const pieceImages: { [K in ChessType]: string } = {
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

export const pieceNames: { [K in ChessType]: string } = {
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
