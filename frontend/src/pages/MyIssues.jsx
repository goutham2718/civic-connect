import React from 'react'
import { ArrowLeft, MapPin, Plus, Trash2Icon, TriangleAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetMyIssuesQuery, useDeleteIssueMutation } from '../store/api/issueApi'
import { useScrollNavigation } from '../hooks/useScrollNavigation'
import { displayDate } from '../utils/dateUtils'

const MyIssues = () => {

  const navigate = useNavigate()
  const { handleReportClick } = useScrollNavigation()

  const { data: issues = [], isLoading: loading } = useGetMyIssuesQuery()
  const [deleteIssueMutation] = useDeleteIssueMutation()

  const deleteIssue = async (id) => {
    try {
      await deleteIssueMutation(id).unwrap()
      toast.success('Issue deleted')
    } catch (error) {
      console.error(error.data || error.message)
      toast.error(error.data?.message || 'Failed to delete issue')
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {

      case 'reported':
        return 'bg-slate-100 text-slate-600 border-slate-200'

      case 'acknowledged':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200'

      case 'in-progress':
        return 'bg-blue-50 text-blue-600 border-blue-200'

      case 'resolved':
        return 'bg-green-50 text-green-600 border-green-200'

      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading your issues...
        </p>
      </div>
    )
  }

  return (

    <div className="w-full bg-slate-50 min-h-screen py-8">
      <div className="w-[92%] max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className='flex gap-4 items-center'>
              <ArrowLeft className='w-4 h-4 text-gray-500 cursor-pointer' onClick={()=>{navigate(-1)}} />
              <h1 className="text-2xl font-bold text-slate-900">
                My Reported Issues
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Track the civic issues you have reported.
            </p>
          </div>
          <button
            onClick={handleReportClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Report Issue
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Reported Issues</h2>
            </div>
            <span className="text-sm text-slate-500">{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
          </div>

          {issues.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50">
                <TriangleAlert className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No issues reported yet
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Report a civic issue to help improve your community.
              </p>
              <button
                onClick={handleReportClick}
                className="mt-5 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Report an Issue
              </button>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Issue
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Location
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Reported
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="hover:bg-slate-50 transition"
                    >
                      {/* Issue */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {issue.photoUrl ? (
                            <img
                              src={issue.photoUrl}
                              alt={issue.title}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                              <TriangleAlert className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                          <div className="max-w-[220px]">
                            <p className="font-semibold text-sm text-slate-900 truncate">
                              {issue.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              #{issue._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                          {issue.category}
                        </span>
                      </td>
                      {/* Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="max-w-[150px] truncate">
                            {issue.localbody?.name || 'Palakkad'}
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(issue.status)}`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {displayDate(issue.createdAt)}
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4 text-right">

                        <button
                          onClick={() => {deleteIssue(issue._id)}}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyIssues