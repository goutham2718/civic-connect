import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  UserRound,
  Tag,
  ThumbsUp
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useUpvoteIssueMutation, useRemoveUpvoteMutation } from '../store/api/voteApi'
import { displayDate } from '../utils/dateUtils'

const Issue = ({title,category,_id,description,localbody,createdAt,upvoteCount,photoUrl,status,createdBy,type,isVoted}) => {

  const token = useSelector((state) => state.auth.token)
  const [upvoteIssue, { isLoading: isUpvoting }] = useUpvoteIssueMutation()
  const [removeUpvote, { isLoading: isRemoving }] = useRemoveUpvoteMutation()

  const vote = isVoted
  const [voteCount, setVoteCount] = useState(upvoteCount)

  const handleIssueVote = async () => {
    if (!token) {
      toast.error('Please login first to vote for an issue')
      return
    }
    // ignore clicks while a request is in flight (prevents double votes)
    if (isUpvoting || isRemoving) return

    const previousCount = voteCount
    // optimistic: change the count immediately
    setVoteCount(vote ? previousCount - 1 : previousCount + 1)

    try {
      const response = vote
        ? await removeUpvote(_id).unwrap()
        : await upvoteIssue(_id).unwrap()

      if (!response.success) {
        setVoteCount(previousCount) // roll back
        toast.error(response.message || 'Failed to vote')
        return
      }
      if (response.upvoteCount !== undefined) {
        setVoteCount(response.upvoteCount) // sync with the real value
      }
    } catch (error) {
      setVoteCount(previousCount) // roll back
      toast.error(error?.data?.message || 'Failed to vote')
    }
  }

  if (type === 'card') {
    return (
      <div className="relative flex flex-col w-full mx-auto max-w-[300px] overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Link to={`/issue/${_id}`}>
          <div className="w-full h-[180px] overflow-hidden">
            <img src={photoUrl} className="w-full h-full object-cover" alt={title}/>
          </div>
        </Link>
        <div className="absolute top-4 left-4">
          <p className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white/90 backdrop-blur-sm rounded-full">{status}</p>
        </div>
        <div className="flex flex-col px-4 pt-3">
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-200 rounded-lg">
              <Tag className="w-4 h-4 text-slate-400" />
              {category}
            </p>
            <p className="flex items-center gap-1 text-xs font-medium text-slate-500 truncate">
              <MapPin className="w-4 h-4 text-slate-400" />
              {localbody?.name || 'Palakkad'}</p>
          </div>
          <Link to={`/issue/${_id}`}>
            <h2 className="mt-2 font-semibold text-slate-900 line-clamp-1">{title}</h2>
          </Link>
          <p className="mt-1 text-sm text-slate-600">{description?.length > 70? `${description.slice(0, 70)}...` : description}</p>
          <hr className="w-full my-4 border-slate-100" />
          <div className="flex items-center justify-between pb-4">
            <p className="text-xs text-slate-500">{displayDate(createdAt)}</p>
            <button onClick={() => handleIssueVote()} className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-lg border transition ${vote? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-gray-300 text-slate-600'}`}>
              <ThumbsUp width={15} fill={vote ? 'currentColor' : 'none'}/>
              <p className="text-xs font-semibold">{voteCount}</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

// ISSUE DETAILS - BIG CARD
return (
  <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-[42%] h-[280px] sm:h-[350px] lg:h-auto lg:min-h-[420px] bg-slate-100">
        <img src={photoUrl} alt={title} className="w-full h-full object-cover"/>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full lg:w-[58%] p-6 sm:p-8">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-slate-900">
              {title}
            </h1>
          </div>

          {/* Status */}
          <span
            className={`
              self-start shrink-0
              px-3.5 py-1.5
              rounded-full
              text-xs font-semibold
              border
              ${
                status === 'resolved'
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : status === 'in-progress'
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : status === 'acknowledged'
                  ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                  : 'text-slate-600 bg-slate-50 border-slate-200'
              }
            `}
          >
            {status
              ?.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </span>

        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2.5 mt-5">

          <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
            <Tag className="w-4 h-4 text-slate-400" />
            <span>{category}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{localbody?.name || 'Palakkad'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
            <UserRound className="w-4 h-4 text-slate-400" />
            <span>{createdBy?.name}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span>{displayDate(createdAt)}</span>
          </div>

        </div>

        <div className="my-6 border-t border-slate-100" />

        {/* Description */}
        <div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {description}
          </p>
        </div>

      </div>
    </div>
  </div>
)}

export default Issue;