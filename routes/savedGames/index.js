import express from 'express'
import { savedGameController } from './controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', auth, savedGameController.save)

export default router