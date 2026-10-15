import React, { useState } from 'react'
import { ArrowLeft, MapPin, RefreshCcw, TriangleAlert, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetMeQuery } from '../store/api/userApi'
import {
  useGetAdminIssuesQuery,
  useUpdateIssueStatusMutation,
  useReassignRoadTypeMutation
} from '../store/api/issueApi'
import { displayDate } from '../utils/dateUtils'

const STATUS_OPTIONS = ['reported', 'acknowledged', 'in-progress', 'resolved']

const getStatusStyle = (status) => {
  switch (status) {
    case 'reported': return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'acknowledged': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'resolved': return 'bg-green-50 text-green-600 border-green-200'
    default: return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  const { data: meData } = useGetMeQuery()
  const user = meData?.data

  const { data: issues = [], isLoading: loading, refetch } = useGetAdminIssuesQuery()
  const [updateStatusMutation] = useUpdateIssueStatusMutation()
  const [reassignRoadTypeMutation] = useReassignRoadTypeMutation()

  const [activeIssue, setActiveIssue] = useState(null) // issue being updated via modal
  const [statusInput, setStatusInput] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const openUpdateModal = (issue) => {
    setActiveIssue(issue)
    setStatusInput(issue.status)
    setNoteInput('')
  }

  const closeModal = () => {
    setActiveIssue(null)
    setStatusInput('')
    setNoteInput('')
  }

  const submitStatusUpdate = async () => {
    if (!activeIssue) return
    try {
      setSubmitting(true)
      await updateStatusMutation({ id: activeIssue._id, status: statusInput, note: noteInput }).unwrap()
      toast.success('Status updated')
      closeModal()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update status')
    } finally {
      setSubmitting(false)
    }
  }

  const reassignRoadType = async (issue) => {
    const targetLabel = issue.roadType === 'local' ? 'PWD' : 'LSGI'
    const confirmed = window.confirm(
      `Reassign this issue to ${targetLabel}? It will move out of your queue.`
    )
    if (!confirmed) return

    try {
      const response = await reassignRoadTypeMutation({
        id: issue._id,
        note: `Reassigned by ${user?.name}`
      }).unwrap()
      toast.success(response.message)
      // RTK Query's invalidatesTags on this mutation automatically refetches
      // getAdminIssues, so the list updates (or removes the issue) on its own —
      // no manual setIssues() needed here.
    } catch (error) {
      toast.error(error.data?.message || 'Failed to reassign')
    }
  }

  // Only lsgi/pwd admins on pothole issues get the reassign option; super_admin sees it too
  const canReassign = (issue) => {
    if (issue.category !== 'pothole') return false
    if (user?.role === 'super_admin') return true
    return user?.authorityType === 'lsgi' || user?.authorityType === 'pwd'
  }

  const roleLabel = () => {
    if (user?.role === 'super_admin') return 'Super Admin — All Departments'
    if (user?.authorityType === 'lsgi') return `LSGI Admin — ${user?.localBody?.name || 'Local Body'}`
    if (user?.authorityType === 'pwd') return 'PWD — District Wide'
    if (user?.authorityType === 'kwa') return 'Kerala Water Authority — District Wide'
    return 'Department Admin'
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading issue queue...</p>
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
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">{roleLabel()}</p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Assigned Issues</h2>
            </div>
            <span className="text-sm text-slate-500">{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
          </div>

          {issues.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50">
                <TriangleAlert className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">No issues in your queue</h3>
              <p className="text-sm text-slate-500 mt-1">Nothing assigned to your department right now.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Issue</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Local Body</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Reported</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {issue.photoUrl ? (
                            <img src={issue.photoUrl} alt={issue.title} className="w-11 h-11 rounded-lg object-cover border border-slate-200" />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                              <TriangleAlert className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                          <div className="max-w-[220px]">
                            <p className="font-semibold text-sm text-slate-900 truncate">{issue.title}</p>
                            <p className="text-xs text-slate-400 mt-1">#{issue._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 capitalize">
                          {issue.category}
                          {issue.category === 'pothole' && issue.roadType && (
                            <span className="ml-1 text-slate-400">· {issue.roadType.toUpperCase()}</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="max-w-[150px] truncate">{issue.localbody?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{displayDate(issue.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openUpdateModal(issue)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                          >
                            Update
                          </button>
                          {canReassign(issue) && (
                            <button
                              onClick={() => reassignRoadType(issue)}
                              className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition"
                              title={`Move to ${issue.roadType === 'local' ? 'PWD' : 'LSGI'}`}
                            >
                              Reassign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {activeIssue && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Update Status</h3>
              <X className="w-5 h-5 text-slate-400 cursor-pointer" onClick={closeModal} />
            </div>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{activeIssue.title}</p>

            <label className="text-sm font-medium text-slate-600">Status</label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
              className="mt-1 mb-4 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>

            <label className="text-sm font-medium text-slate-600">Note (optional)</label>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Site inspection scheduled for tomorrow"
              className="mt-1 mb-4 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={submitStatusUpdate}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${submitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard