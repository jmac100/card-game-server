import jwt from 'jsonwebtoken'
import User from '../auth/model.js'

export const auth = async (req, res, next) => {
   const authToken = req.header('Authorization')
   if (!authToken)
      return res.status(401).json({
         auth: false,
         msg: 'You must be logged in to perform this action'
      })

   try {
      const token = authToken.split(' ')
      if (token.length <= 1) {
         return res.status(401).json({
            auth: false,
            msg: 'Invalid token format'
         })
      }
      const decodedToken = jwt.verify(token[1], process.env.SECRET)
      if (!decodedToken)
         return res.status(401).json({
            auth: false,
            msg: 'You have been logged out due to inactivity'
         })

      const user_id = decodedToken.id
      const user = await User.findById(user_id).select('-password')
      if (!user) {
         return res.status(401).json({
            auth: false,
            msg: 'You must be logged in to perform this action'
         })
      }

      req.user = user

      next()
   } catch (error) {
      let msg = 'An unknown error occurred while logging in'
      if (typeof error === 'object') {
         if (error.name === 'TokenExpiredError') 
            msg = 'You have been logged out due to inactivity'
         else
            msg = error.message
      }
      return res.status(401).json({
         auth: false,
         msg
      })
   }
}