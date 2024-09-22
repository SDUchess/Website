import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Transition from '../utils/Transition.jsx'

import UserAvatar from '@/images/user-avatar-32.png'
import { baseURL } from '@/utils/Utils.ts'
import { StudentClass } from '@/types/User.ts'

function DropdownProfile({ align }: { align: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const dropdown = useRef<HTMLDivElement>(null)
  const [studentClass, setStudentClass] = useState<StudentClass>()
  const navigate = useNavigate()

  const username = localStorage.getItem('username')
  const role = localStorage.getItem('userRole')

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }) => {
      if (!dropdown.current) return

      if (
        !dropdownOpen ||
        dropdown.current!.contains(target as Node) ||
        trigger.current!.contains(target as Node)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    const studentId = localStorage.getItem('studentId')
    if (!studentId) {
      return
    }
    getClassInfo(Number(studentId)).then((data) => {
      if (!data) {
        return
      }
      setStudentClass(data)
    })
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    localStorage.removeItem('studentId')
    localStorage.removeItem('teacherId')
    localStorage.removeItem('adminId')
    setDropdownOpen(false)
    navigate('/')
  }

  const getClassInfo = async (studentId: number) => {
    const res = await fetch(`${baseURL}/class/get/classByStudentId?id=${studentId}`)
    if (res.ok) {
      return await res.json()
    } else {
      res.text().then(console.error)
      return null
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        ref={ trigger }
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={ () => setDropdownOpen(!dropdownOpen) }
        aria-expanded={ dropdownOpen }>
        <img
          className="w-8 h-8 rounded-full"
          src={ UserAvatar }
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span
            className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            { username }
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"/>
          </svg>
        </div>
      </button>

      <Transition
        className={ `origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === 'right' ? 'right-0' : 'left-0'
        }` }
        show={ dropdownOpen }
        appear
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0">
        <div
          ref={ dropdown }
          onFocus={ () => setDropdownOpen(true) }
          onBlur={ () => setDropdownOpen(false) }>
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700">
            <div className="font-medium text-slate-800 dark:text-slate-100">
              { username }
            </div>
            {/* role是学生时显示班级 */}
            {role === 'student' && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                { studentClass?.name || '暂无班级信息' }
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400 italic">
              { role }
            </div>
          </div>
          <ul>
            <li>
              <button
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3 w-full text-left"
                onClick={ handleSignOut }>
                退出登录
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownProfile
