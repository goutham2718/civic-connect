import React from 'react'
import { Link } from 'react-router-dom'
import { X, MapPin, ThumbsUp, AlertTriangle } from 'lucide-react'

const DuplicateIssuesModal = ({ issues, onContinueAnyway, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Similar issues nearby</h3>
              <p className="text-xs text-slate-500">
                {issues.length} similar {issues.length === 1 ? 'issue was' : 'issues were'} already reported close by
              </p>
            </div>
          </div>
          <X className="w-5 h-5 text-slate-400 cursor-pointer shrink-0" onClick={onClose} />
        </div>

        <p className="text-sm text-slate-500 mt-3 mb-4">
          Upvoting an existing report helps prioritize it faster than creating a duplicate.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issue/${issue._id}`}
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
            >
              {issue.photoUrl ? (
                <img src={issue.photoUrl} alt={issue.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{issue.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">~{issue.distanceMeters}m away · {issue.status}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-500 shrink-0">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{issue.upvoteCount}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel & go upvote instead
          </button>
          <button
            onClick={onContinueAnyway}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            This is a different issue - Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default DuplicateIssuesModal