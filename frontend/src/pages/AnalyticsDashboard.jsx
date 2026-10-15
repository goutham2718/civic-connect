import React from 'react'
import { ArrowLeft, BarChart3, CheckCircle2, Clock, MapPin, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAnalyticsOverviewQuery, useGetResolutionTimeAnalyticsQuery } from '../store/api/analyticsApi'

const STATUS_COLORS = {
  reported: 'bg-slate-400',
  acknowledged: 'bg-yellow-400',
  'in-progress': 'bg-blue-400',
  resolved: 'bg-green-500'
}

const CATEGORY_LABELS = {
  pothole: 'Pothole',
  streetlight: 'Street Light',
  garbage: 'Waste Disposal',
  drainage: 'Drainage',
  water: 'Water',
  sanitation: 'Sanitation',
  other: 'Other'
}

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  </div>
)

const BarRow = ({ label, count, max, colorClass = 'bg-blue-500' }) => {
  const percentage = max > 0 ? (count / max) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700 capitalize">{label}</span>
        <span className="text-sm text-slate-500">{count}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

const AnalyticsDashboard = () => {
  const navigate = useNavigate()
  const { data: overview, isLoading: loadingOverview, error: overviewError } = useGetAnalyticsOverviewQuery()
  const { data: resolutionData, isLoading: loadingResolution, error: resolutionError } = useGetResolutionTimeAnalyticsQuery()

  if (loadingOverview || loadingResolution) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading analytics...</p>
      </div>
    )
  }

  if (overviewError || resolutionError || !overview) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-red-500 font-medium">Failed to load analytics data. Please try again later.</p>
      </div>
    )
  }

  const statusBreakdown = overview?.statusBreakdown || []
  const categoryBreakdown = overview?.categoryBreakdown || []
  const localBodyBreakdown = overview?.localBodyBreakdown || []
  const byCategory = resolutionData?.byCategory || []

  const maxStatusCount = Math.max(...statusBreakdown.map(s => s.count), 1)
  const maxCategoryCount = Math.max(...categoryBreakdown.map(c => c.count), 1)
  const maxLocalBodyCount = Math.max(...localBodyBreakdown.map(l => l.count), 1)
  const maxResolutionHours = Math.max(...byCategory.map(c => c.avgResolutionHours), 1)

  return (
    <div id='analytics' className="w-full bg-slate-50 min-h-screen py-8">
      <div className="w-[92%] max-w-6xl mx-auto">

        <div className="mb-8">
          <div className='flex gap-4 items-center'>
            <ArrowLeft className='w-4 h-4 text-gray-500 cursor-pointer' onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold text-slate-900">Public Analytics</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Transparency dashboard — how civic issues in Palakkad are being reported and resolved.
          </p>
        </div>

        {/* Top-level stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Total Issues Reported" value={overview.totalIssues ?? 0} accent="bg-blue-500" />
          <StatCard icon={CheckCircle2} label="Resolved Issues" value={overview.resolvedIssues ?? 0} accent="bg-green-500" />
          <StatCard icon={TrendingUp} label="Resolution Rate" value={`${overview.resolutionRate ?? 0}%`} accent="bg-purple-500" />
          <StatCard
            icon={Clock}
            label="Avg. Resolution Time"
            value={resolutionData?.overallAvgResolutionDays ? `${resolutionData.overallAvgResolutionDays}d` : 'N/A'}
            accent="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Status Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Issues by Status</h2>
            <div className="flex flex-col gap-4">
              {statusBreakdown.map((item) => (
                <BarRow
                  key={item._id}
                  label={item._id}
                  count={item.count}
                  max={maxStatusCount}
                  colorClass={STATUS_COLORS[item._id] || 'bg-slate-400'}
                />
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Issues by Category</h2>
            <div className="flex flex-col gap-4">
              {categoryBreakdown.map((item) => (
                <BarRow
                  key={item._id}
                  label={CATEGORY_LABELS[item._id] || item._id}
                  count={item.count}
                  max={maxCategoryCount}
                  colorClass="bg-blue-500"
                />
              ))}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Local Bodies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Top Panchayats / Municipalities</h2>
            </div>
            <div className="flex flex-col gap-4">
              {localBodyBreakdown.length === 0 ? (
                <p className="text-sm text-slate-400">No data yet.</p>
              ) : (
                localBodyBreakdown.map((item, idx) => (
                  <BarRow
                    key={idx}
                    label={item.name}
                    count={item.count}
                    max={maxLocalBodyCount}
                    colorClass="bg-cyan-500"
                  />
                ))
              )}
            </div>
          </div>

          {/* Resolution Time by Category */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="font-semibold text-slate-900">Avg. Resolution Time by Category</h2>
            </div>
            <div className="flex flex-col gap-4">
              {byCategory.length === 0 ? (
                <p className="text-sm text-slate-400">No resolved issues yet.</p>
              ) : (
                byCategory.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-sm text-slate-500">{item.avgResolutionDays}d avg</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${(item.avgResolutionHours / maxResolutionHours) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.resolvedCount} resolved</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AnalyticsDashboard