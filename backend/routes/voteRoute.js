import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { getVotes, removeUpvote, upVote } from '../controllers/voteController.js'

const voteRouter = express.Router()

voteRouter.post('/upvote',authenticate,upVote)
voteRouter.delete('/upvote',authenticate,removeUpvote)
voteRouter.get('/myVotes',authenticate,getVotes)

export default voteRouter;