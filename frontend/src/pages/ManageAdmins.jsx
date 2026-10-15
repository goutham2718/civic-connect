import React, { useState } from 'react'
import { ArrowLeft, Pencil, Plus, Shield, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useGetAllAdminsQuery,
  useCreateDeptAdminMutation,
  useUpdateAdminDepartmentsMutation,
  useDeleteAdminMutation
} from '../store/api/adminApi'
import { useGetLocalBodiesQuery } from '../store/api/localBodyApi'

const DEPARTMENT_CATEGORIES = ['pothole', 'streetlight', 'garbage', 'drainage', 'water', 'sanitation', 'other']

const ManageAdmins = () => {
  const navigate = useNavigate()

  const { data: admins = [], isLoading: loading } = useGetAllAdminsQuery()
  const { data: localBodies = [] } = useGetLocalBodiesQuery()

  const [createDeptAdmin, { isLoading: submitting }] = useCreateDeptAdminMutation()
  const [updateAdminDepartments, { isLoading: editSubmitting }] = useUpdateAdminDepartmentsMutation()
  const [deleteAdminMutation] = useDeleteAdminMutation()

  const [showForm, setShowForm] = useState(false)

  // Edit modal state
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [editDepartments, setEditDepartments] = useState([])

  // Delete state
  const [deletingId, setDeletingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    authorityType: 'lsgi',
    localBody: '',
    department: []
  })

  const onChangeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      department: prev.department.includes(dept)
        ? prev.department.filter(d => d !== dept)
        : [...prev.department, dept]
    }))
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', authorityType: 'lsgi', localBody: '', department: [] })
    setShowForm(false)
  }

  const submitNewAdmin = async (e) => {
    e.preventDefault()

    if (formData.department.length === 0) {
      toast.error('Select at least one department/category')
      return
    }
    if (formData.authorityType === 'lsgi' && !formData.localBody) {
      toast.error('Select a local body for an LSGI admin')
      return
    }

    try {
      const payload = { ...formData }
      if (payload.authorityType !== 'lsgi') delete payload.localBody

      await createDeptAdmin(payload).unwrap()
      toast.success('Department admin created')
      resetForm()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create admin')
    }
  }

  // ---- Edit departments ----
  const openEditModal = (admin) => {
    setEditingAdmin(admin)
    setEditDepartments(admin.department || [])
  }

  const closeEditModal = () => {
    setEditingAdmin(null)
    setEditDepartments([])
  }

  const toggleEditDepartment = (dept) => {
    setEditDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    )
  }

  const submitEditDepartments = async () => {
    if (editDepartments.length === 0) {
      toast.error('Select at least one department/category')
      return
    }

    try {
      await updateAdminDepartments({ id: editingAdmin._id, department: editDepartments }).unwrap()
      toast.success('Departments updated')
      closeEditModal()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update departments')
    }
  }

  // ---- Delete admin ----
  const handleDeleteAdmin = async (admin) => {
    const confirmed = window.confirm(
      `Remove ${admin.name} (${admin.email})? This cannot be undone.`
    )
    if (!confirmed) return

    try {
      setDeletingId(admin._id)
      await deleteAdminMutation(admin._id).unwrap()
      toast.success('Department admin removed')
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete admin')
    } finally {
      setDeletingId(null)
    }
  }

  const authorityBadge = (admin) => {
    if (admin.role === 'super_admin') return { label: 'Super Admin', style: 'bg-purple-50 text-purple-600 border-purple-200' }
    if (admin.authorityType === 'lsgi') return { label: `LSGI · ${admin.localBody?.name || '—'}`, style: 'bg-blue-50 text-blue-600 border-blue-200' }
    if (admin.authorityType === 'pwd') return { label: 'PWD', style: 'bg-amber-50 text-amber-600 border-amber-200' }
    if (admin.authorityType === 'kwa') return { label: 'KWA', style: 'bg-cyan-50 text-cyan-600 border-cyan-200' }
    return { label: admin.role, style: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading admins...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      <div className="w-[92%] max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className='flex gap-4 items-center'>
              <ArrowLeft className='w-4 h-4 text-gray-500 cursor-pointer' onClick={() => navigate(-1)} />
              <h1 className="text-2xl font-bold text-slate-900">Manage Department Admins</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">Create and oversee LSGI, PWD, and KWA accounts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            New Admin
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">All Admins ({admins.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Authority</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Departments</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => {
                  const badge = authorityBadge(admin)
                  const isSuperAdminRow = admin.role === 'super_admin'
                  return (
                    <tr key={admin._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-sm text-slate-900">{admin.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{admin.email}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${badge.style}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {admin.department?.map(d => (
                            <span key={d} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">{d}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Super admin has no editable departments and shouldn't be deletable from here */}
                        {!isSuperAdminRow && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(admin)}
                              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                              title="Edit departments"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
                              disabled={deletingId === admin._id}
                              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition disabled:opacity-50"
                              title="Remove admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Admin Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={submitNewAdmin} className="bg-white rounded-2xl w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Create Department Admin</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={resetForm} />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Name</label>
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={onChangeHandler}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={onChangeHandler}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Password</label>
                <input
                  type="password" name="password" required minLength={8}
                  value={formData.password} onChange={onChangeHandler}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Authority Type</label>
                <select
                  name="authorityType" value={formData.authorityType} onChange={onChangeHandler}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="lsgi">LSGI (Panchayat / Municipality)</option>
                  <option value="pwd">PWD (Public Works Department)</option>
                  <option value="kwa">KWA (Kerala Water Authority)</option>
                </select>
              </div>

              {formData.authorityType === 'lsgi' && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Local Body</label>
                  <select
                    name="localBody" value={formData.localBody} onChange={onChangeHandler}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select Panchayat/Municipality</option>
                    {localBodies.map(lb => (
                      <option key={lb._id} value={lb._id}>{lb.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-600">Departments / Categories</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DEPARTMENT_CATEGORIES.map(dept => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => toggleDepartment(dept)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition ${
                        formData.department.includes(dept)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                type="submit" disabled={submitting}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${submitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitting ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Departments Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Edit Departments</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={closeEditModal} />
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {editingAdmin.name} <span className="text-slate-400">· {editingAdmin.email}</span>
            </p>

            <label className="text-sm font-medium text-slate-600">Departments / Categories</label>
            <div className="mt-2 mb-6 flex flex-wrap gap-2">
              {DEPARTMENT_CATEGORIES.map(dept => (
                <button
                  type="button"
                  key={dept}
                  onClick={() => toggleEditDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition ${
                    editDepartments.includes(dept)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closeEditModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={submitEditDepartments}
                disabled={editSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${editSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {editSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageAdmins