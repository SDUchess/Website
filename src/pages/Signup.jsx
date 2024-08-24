import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Transition from '../utils/Transition'

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 默认角色为学生
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const trigger = useRef(null)
  const dropdown = useRef(null)

  // 关闭下拉菜单时的事件处理
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // 按下 ESC 键关闭下拉菜单
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      })

      if (response.ok) {
        alert('注册成功，欢迎您')
        navigate('/')
      } else {
        alert('注册失败，请重试')
      }
    } catch (error) {
      console.error('注册错误:', error)
    }
  }

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
          创建您的账户 ✨
        </h1>
        {/* Form */}
        <form onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="username">
                用户名
              </label>
              <input
                id="username"
                className="form-input w-full"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password">
                密码
              </label>
              <input
                id="password"
                className="form-input w-full"
                type="password"
                autoComplete="on"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="role">
                角色
              </label>
              <div className="relative inline-flex">
                <button
                  ref={trigger}
                  type="button"
                  className="btn justify-between min-w-44 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
                  aria-label="Select role"
                  aria-haspopup="true"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}>
                  <span className="flex items-center">
                    <span>{role === 'student' ? '学生' : '老师'}</span>
                  </span>
                  <svg
                    className="shrink-0 ml-1 fill-current text-slate-400"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7">
                    <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
                  </svg>
                </button>
                <Transition
                  show={dropdownOpen}
                  tag="div"
                  className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                  enter="transition ease-out duration-100 transform"
                  enterStart="opacity-0 -translate-y-2"
                  enterEnd="opacity-100 translate-y-0"
                  leave="transition ease-out duration-100"
                  leaveStart="opacity-100"
                  leaveEnd="opacity-0">
                  <div
                    ref={dropdown}
                    className="font-medium text-sm text-slate-600 dark:text-slate-300"
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)}>
                    {['student', 'teacher'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        tabIndex="0"
                        className={`flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 cursor-pointer ${
                          option === role && 'text-indigo-500'
                        }`}
                        onClick={() => {
                          setRole(option)
                          setDropdownOpen(false)
                        }}>
                        <svg
                          className={`shrink-0 mr-2 fill-current text-indigo-500 ${
                            option !== role && 'invisible'
                          }`}
                          width="12"
                          height="9"
                          viewBox="0 0 12 9">
                          <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                        </svg>
                        <span>{option === 'student' ? '学生' : '老师'}</span>
                      </button>
                    ))}
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              type="submit"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white w-auto">
              注册
            </button>
          </div>
        </form>
        {/* Footer */}
        <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm">
            已有账户？{' '}
            <Link
              className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              to="/signin">
              登录
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Signup
