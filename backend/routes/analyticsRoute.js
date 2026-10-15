import express from 'express'
import { getOverviewAnalytics, getResolutionTimeAnalytics } from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()

// Public — no authentication required, this is meant to be a transparency dashboard
analyticsRouter.get('/overview', getOverviewAnalytics)
analyticsRouter.get('/resolution-time', getResolutionTimeAnalytics)

export default analyticsRouter