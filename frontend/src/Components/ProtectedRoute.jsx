import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetMeQuery } from '../store/api/userApi'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.auth.token)
  const { data, isLoading } = useGetMeQuery(undefined, { skip: !token })
  const user = data?.data

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking access...</p>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute