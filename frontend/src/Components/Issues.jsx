import React, { useState } from 'react'
import Issue from './Issue'
import SearchableSelect from './SearchableSelect'
import { Filter, RotateCcw, ArrowDownUp } from 'lucide-react'
import { useGetIssuesQuery } from '../store/api/issueApi'
import { useGetLocalBodiesQuery } from '../store/api/localBodyApi'
import { useGetMyVotesQuery } from '../store/api/voteApi'
import { useSelector } from 'react-redux'

const CATEGORIES = ['pothole', 'streetlight', 'garbage', 'water', 'drainage', 'sanitation', 'other']

const STATUS_ITEMS = [
  { id: 'All', label: 'All Issues' },
  { id: 'reported', label: 'Reported' },
  { id: 'acknowledged', label: 'Acknowledged' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' }
]

const categoryOptions = [
  { _id: '', name: 'All categories' },
  ...CATEGORIES.map((cat) => ({
    _id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
  })),
]

const Issues = () => {
  const token = useSelector((state) => state.auth.token)

  const [menu, setMenu] = useState('All')
  const [category, setCategory] = useState('')
  const [localbody, setLocalbody] = useState('')
  const [sort, setSort] = useState('recent')

  // Params object changes when category/localbody/sort change,
  // which RTK Query automatically detects and refetches for.
  const { data: issues = [] } = useGetIssuesQuery({ category, localbody, sort })
  const { data: localBodies = [] } = useGetLocalBodiesQuery()
  const { data: votedIssues = [] } = useGetMyVotesQuery(undefined, { skip: !token })

  const filteredIssues = issues.filter((issue) => menu === 'All' || menu === issue.status)

  const clearFilters = () => {
    setMenu('All')
    setCategory('')
    setLocalbody('')
    setSort('recent')
  }

  const hasActiveFilters =
    menu !== 'All' ||
    category !== '' ||
    localbody !== '' ||
    sort !== 'recent'

  return (
    <section id="issues" className="w-full px-4 sm:px-6 lg:px-10 py-8">

       <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 tracking-tight">
          Community Issues
        </h2>

        <p className="mt-2 text-xs md:text-base text-slate-500 leading-relaxed">
          Explore reported issues in your community, track their progress,
          and help bring important civic problems to the attention of local authorities.
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {STATUS_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMenu(id)}
              className={`px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                menu === id
                  ? 'bg-slate-800 text-blue-400 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Area */}
      <div className="max-w-5xl mx-auto mb-8">

        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">

          {/* Filter Header */}
          <div className="flex items-center justify-between gap-4 mb-4">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Filter className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Refine issues
                </p>
                <p className="text-xs text-slate-400">
                  Filter by category, local body or popularity
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-red-500 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_auto] gap-3">

            {/* Category */}
           {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              CATEGORY
            </label>

            <SearchableSelect
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="Select category..."
            />
          </div>
            {/* Local Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                LOCAL BODY
              </label>

              <SearchableSelect
                options={localBodies}
                value={localbody}
                onChange={setLocalbody}
                placeholder="Search panchayat or municipality..."
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                SORT BY
              </label>

              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">

                <button
                  onClick={() => setSort('recent')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition ${
                    sort === 'recent'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Recent
                </button>

                <button
                  onClick={() => setSort('upvotes')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition ${
                    sort === 'upvotes'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Popular
                </button>

              </div>
            </div>

          </div>

          {/* Active filter summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">

              <span className="text-xs text-slate-400">
                Showing:
              </span>

              {menu !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  {menu}
                </span>
              )}

              {category && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  {category}
                </span>
              )}

              {localbody && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  {localbody}
                </span>
              )}

              {sort === 'upvotes' && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium flex items-center gap-1">
                  <ArrowDownUp className="w-3 h-3" />
                  Most upvoted
                </span>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Issues / Empty State */}
      <div className="max-w-7xl mx-auto">

        {filteredIssues.length === 0 ? (

          <div className="flex flex-col min-h-[40vh] items-center justify-center text-center">

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-slate-400" />
            </div>

            <p className="text-lg font-semibold text-slate-700">
              No issues found
            </p>

            <p className="mt-1 text-sm text-slate-400 max-w-sm">
              {menu === 'All'
                ? 'No issues match your current filters.'
                : `There are currently no ${menu} issues matching your filters.`}
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-5 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
              >
                Clear all filters
              </button>
            )}

          </div>

        ) : (

          <>
            <div className="flex justify-between items-center mb-5 px-1">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">
                  {filteredIssues.length}
                </span>{' '}
                {filteredIssues.length === 1 ? 'issue found' : 'issues found'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">

              {filteredIssues.map((issue) => (
                <Issue
                  key={issue._id}
                  {...issue}
                  type="card"
                  isVoted={votedIssues.includes(issue._id)}
                />
              ))}

            </div>
          </>

        )}

      </div>

    </section>
  )
}

export default Issues