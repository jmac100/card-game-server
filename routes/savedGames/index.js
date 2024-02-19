import express from 'express'
import { savedGameController } from './controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', auth, savedGameController.list)
router.get('/:id', auth, savedGameController.load)
router.post('/', auth, savedGameController.save)
router.post('/update/:id', auth, savedGameController.update)
router.delete('/:id', auth, savedGameController.delete)

export default router