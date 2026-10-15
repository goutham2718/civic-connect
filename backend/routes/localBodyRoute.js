import express from 'express'
import { createLocalBody, getLocalBodies } from '../controllers/localBodyController.js'

const localBodyRouter = express.Router()

localBodyRouter.get('/',getLocalBodies);
localBodyRouter.post('/',createLocalBody);

export default localBodyRouter;