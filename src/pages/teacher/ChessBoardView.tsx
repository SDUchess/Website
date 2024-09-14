/* 教师查看自己的残局题目 */
import { useParams } from 'react-router-dom'

export default function ChessBoardView() {

  const params = useParams()
  console.log('params = ', params)

  return (
    <div>ChessBoardView.tsx</div>
  )
}
