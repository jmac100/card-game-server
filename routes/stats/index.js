import express from 'express'
import { statController } from './controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', auth, statController.save)

export default router