import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('userRole')

  if (!userRole) {
    // 如果没有用户角色，重定向到登录页面
    return <Navigate to="/" />
  }

  if (userRole !== role) {
    // 如果角色不匹配，重定向到对应的 dashboard
    return <Navigate to={`/${userRole}/dashboard`} />
  }

  return children
}

export default ProtectedRoute
