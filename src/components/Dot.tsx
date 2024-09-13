import dotImg from '@/images/chess/dot.png'
import dot2Img from '@/images/chess/dot2.png'

export default function Dot({onClick, hintUsed}: {onClick: () => void, hintUsed?: boolean}) {
  return <img src={hintUsed ? dot2Img : dotImg} alt="dot" className="dot" onClick={onClick}/>
}
