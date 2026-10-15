import React, { useState } from 'react'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useChangePasswordMutation } from '../store/api/userApi'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitChangePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    try {
      const response = await changePassword({
        currentPassword,
        newPassword
      }).unwrap()

      if (response.success) {
        toast.success('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      <div className="w-[92%] max-w-md mx-auto">
        <div className="flex gap-4 items-center mb-6">
          <ArrowLeft className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
        </div>

        <form onSubmit={submitChangePassword} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Update your password</h2>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 p-2.5 rounded-lg text-white text-sm font-semibold ${isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword;
