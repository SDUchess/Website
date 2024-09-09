import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { baseURL } from '../utils/Utils'

function Signin({ setUserRole }) {
  // 从 props 中接收 setUserRole
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('username', data.username)

        setUserRole(data.role) // 设置用户角色

        // 根据角色导航
        if (data.role === 'student') {
          localStorage.setItem('studentId', data.id)
          navigate('/student/dashboard')
        } else if (data.role === 'teacher') {
          localStorage.setItem('teacherId', data.id)
          navigate('/teacher/dashboard')
        }
      } else {
        alert('用户名或密码错误')
      }
    } catch (error) {
      console.error('登录错误:', error)
    }
  }

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
          欢迎回来！✨
        </h1>
        <form onSubmit={handleLogin}>
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
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              type="submit"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white w-auto">
              登录
            </button>
          </div>
        </form>
        <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm">
            还没有账号？{' '}
            <a
              className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              href="/signup">
              注册
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Signin
