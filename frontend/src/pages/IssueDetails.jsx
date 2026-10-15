import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThumbsUp, MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import ResolutionTimeline from '../Components/ResolutionTimeline'
import Issue from '../Components/Issue'
import IssueLocationView from '../Components/IssueLocationView'
import { useGetIssueByIdQuery } from '../store/api/issueApi'
import {
  useGetMyVotesQuery,
  useRemoveUpvoteMutation,
  useUpvoteIssueMutation
} from '../store/api/voteApi'

const IssueDetails = () => {
  const { id } = useParams()
  const token = useSelector((state) => state.auth.token)

  const { data, isLoading, isError } = useGetIssueByIdQuery(id)
  const { data: votedIssues = [], isLoading: isVotesIssuesLoading } =
    useGetMyVotesQuery(undefined, { skip: !token })

  const [upvoteIssue, { isLoading: isUpvoting }] = useUpvoteIssueMutation()
  const [removeUpvote, { isLoading: isRemovingUpvote }] = useRemoveUpvoteMutation()
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    if (data?.issue?.upvoteCount !== undefined) {
      setVoteCount(data.issue.upvoteCount)
    }
  }, [data?.issue?.upvoteCount])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading issue...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">Failed to load issue.</p>
      </div>
    )
  }

  const issue = data.issue
  const history = data.history || []
  const vote = votedIssues.includes(id)

  const handleIssueVote = async () => {
    if (!token) {
      toast.error('Please login first to vote for an issue')
      return
    }
    // ignore clicks while a request is in flight
    if (isUpvoting || isRemovingUpvote) return

    const previousCount = voteCount
    // optimistic: change the count immediately
    setVoteCount(vote ? previousCount - 1 : previousCount + 1)

    try {
      const response = vote
        ? await removeUpvote(id).unwrap()
        : await upvoteIssue(id).unwrap()

      if (!response.success) {
        setVoteCount(previousCount) // roll back
        toast.error(response.message || 'Failed to vote')
        return
      }
      if (response.upvoteCount !== undefined) {
        setVoteCount(response.upvoteCount)
      }
    } catch (error) {
      setVoteCount(previousCount) // roll back
      toast.error(error?.data?.message || 'Failed to vote')
    }
  }

  return (
    <div className="w-full pb-12">
      <div className="w-[92%] max-w-6xl mx-auto space-y-6">
        <Link to="/" className="pt-6 block">
          <button className="text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-4">
            ← Back to home
          </button>
        </Link>

        <section>
          <Issue {...issue} />
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] items-stretch">
            <div className="p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      Issue Location
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Reported location of this issue
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-1.5 leading-relaxed">
                    {issue.location?.address || issue.location?.localbody || 'Palakkad'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <a
                  href={`https://www.google.com/maps?q=${issue.location.coordinates.lat},${issue.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="w-full h-full min-h-[280px] sm:min-h-[320px] px-4 flex items-center justify-center">
              <div className="w-full h-[250px] sm:h-[280px]">
                <IssueLocationView coordinates={issue.location.coordinates} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="min-w-0">
            <ResolutionTimeline history={history} />
          </div>

          <div className="md:sticky md:top-24 self-start">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">
                  Are you experiencing this too?
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Support this report by adding your vote.
                </p>
              </div>

              <div className="flex flex-col items-center my-6">
                <span className="text-4xl font-bold text-slate-900">
                  {voteCount}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-1">
                  {voteCount === 1 ? 'upvote' : 'upvotes'}
                </span>
              </div>

              <button
                onClick={handleIssueVote}
                disabled={isVotesIssuesLoading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 ${
                  vote
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp
                  className="w-4 h-4"
                  fill={vote ? 'currentColor' : 'none'}
                />
                {isVotesIssuesLoading
                  ? 'Loading...'
                  : vote
                    ? 'Upvoted'
                    : 'Upvote this issue'}
              </button>

              <p className="text-[11px] leading-relaxed text-slate-400 text-center mt-3">
                Your vote helps bring more attention to this issue.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default IssueDetails