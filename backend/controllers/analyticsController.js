import Issue from '../models/IssueModel.js'
import StatusUpdate from '../models/statusUpdateModel.js'

// GET /api/analytics/overview
// GET /api/analytics/overview
export const getOverviewAnalytics = async (req, res) => {
  try {
    // 1. Fetch raw documents with error-safe population
    const issues = await Issue.find().populate('localbody', 'name type').lean()

    const totalIssues = issues.length
    if (totalIssues === 0) {
      return res.json({
        success: true,
        data: {
          totalIssues: 0,
          resolvedIssues: 0,
          resolutionRate: 0,
          statusBreakdown: [],
          categoryBreakdown: [],
          localBodyBreakdown: []
        }
      })
    }

    // 2. Safely aggregate counts
    const statusCounts = {}
    const categoryCounts = {}
    const localBodyCounts = {}
    let resolvedIssues = 0

    issues.forEach((issue) => {
      // Status breakdown
      if (issue.status) {
        statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1
        if (issue.status === 'resolved') resolvedIssues++
      }

      // Category breakdown
      if (issue.category) {
        categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1
      }

      // Local body breakdown (safely optional)
      if (issue.localbody && issue.localbody._id) {
        const key = issue.localbody._id.toString()
        if (!localBodyCounts[key]) {
          localBodyCounts[key] = {
            name: issue.localbody.name || 'Unknown',
            type: issue.localbody.type || 'N/A',
            count: 0
          }
        }
        localBodyCounts[key].count++
      }
    })

    // 3. Format and sort arrays
    const statusBreakdown = Object.keys(statusCounts)
      .map((key) => ({ _id: key, count: statusCounts[key] }))
      .sort((a, b) => b.count - a.count)

    const categoryBreakdown = Object.keys(categoryCounts)
      .map((key) => ({ _id: key, count: categoryCounts[key] }))
      .sort((a, b) => b.count - a.count)

    const localBodyBreakdown = Object.values(localBodyCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const resolutionRate = Number(((resolvedIssues / totalIssues) * 100).toFixed(1))

    return res.json({
      success: true,
      data: {
        totalIssues,
        resolvedIssues,
        resolutionRate,
        statusBreakdown,
        categoryBreakdown,
        localBodyBreakdown
      }
    })
  } catch (err) {
    console.error('Analytics Overview Error:', err) // Print full error to Node console
    return res.status(500).json({
      success: false,
      message: 'Failed to compute analytics overview'
    })
  }
}

// GET /api/analytics/resolution-time
export const getResolutionTimeAnalytics = async (req, res) => {
  try {
    // 1. Fetch resolved status updates with issue details
    const updates = await StatusUpdate.find({ status: 'resolved' })
      .populate('issueId', 'category createdAt')
      .lean()

    // 2. Track earliest resolution time per issue
    const issueResolvedMap = {}
    updates.forEach((update) => {
      if (!update.issueId) return
      const id = update.issueId._id.toString()
      const time = new Date(update.createdAt).getTime()
      if (!issueResolvedMap[id] || time < issueResolvedMap[id].resolvedAt) {
        issueResolvedMap[id] = {
          category: update.issueId.category,
          createdAt: new Date(update.issueId.createdAt).getTime(),
          resolvedAt: time
        }
      }
    })

    const resolvedItems = Object.values(issueResolvedMap)
    if (resolvedItems.length === 0) {
      return res.json({
        success: true,
        data: {
          overallAvgResolutionHours: null,
          overallAvgResolutionDays: null,
          byCategory: []
        }
      })
    }

    // 3. Calculate resolution times per category
    const categoryStats = {}
    let totalOverallHours = 0

    resolvedItems.forEach((item) => {
      const hours = (item.resolvedAt - item.createdAt) / (1000 * 60 * 60)
      totalOverallHours += hours

      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { totalHours: 0, count: 0 }
      }
      categoryStats[item.category].totalHours += hours
      categoryStats[item.category].count++
    })

    // 4. Format outputs
    const byCategory = Object.keys(categoryStats)
      .map((cat) => {
        const avgHours = categoryStats[cat].totalHours / categoryStats[cat].count
        return {
          category: cat,
          avgResolutionHours: Number(avgHours.toFixed(1)),
          avgResolutionDays: Number((avgHours / 24).toFixed(1)),
          resolvedCount: categoryStats[cat].count
        }
      })
      .sort((a, b) => a.avgResolutionHours - b.avgResolutionHours)

    const overallAvgHours = totalOverallHours / resolvedItems.length

    res.json({
      success: true,
      data: {
        overallAvgResolutionHours: Number(overallAvgHours.toFixed(1)),
        overallAvgResolutionDays: Number((overallAvgHours / 24).toFixed(1)),
        byCategory
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute resolution time analytics'
    })
  }
}