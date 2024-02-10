import express from 'express'
import { authController } from './controller.js'
import { register } from '../middlewares/register.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register, authController.register)
router.post('/login', authController.login)
router.post('/user/update', auth, authController.updateUser)
router.post('/user/:id/pwd', auth, authController.changePassword)

export default router