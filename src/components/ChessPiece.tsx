import { pieceImages } from '@/images/piece-images.ts'
import { ChessType } from '@/types/Chess.ts'

export default function ChessPiece({type, onClick}: {type: ChessType, onClick: () => void}) {
  return (
    <img
      src={pieceImages[type]}
      alt={type}
      className="chess-piece"
      onClick={onClick}
      style={{position: 'absolute'}}
    />
  )
}
