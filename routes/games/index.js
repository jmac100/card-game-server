import express from 'express'
import { gameController } from './controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', auth, gameController.list)
router.post('/', auth, gameController.save)

export default router