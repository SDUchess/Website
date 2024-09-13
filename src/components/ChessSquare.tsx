import { ReactNode } from 'react'

/**
 * size: 棋盘格子定位基本单位(棋子大小), 单位px
 */
export default function ChessSquare({x, y, children, size}: {x: number, y: number, children: ReactNode, size: number}) {
  return (
    <div className={'chess-square'} style={{left: x * size, top: y * size}}>
      {children}
    </div>
  )
}
