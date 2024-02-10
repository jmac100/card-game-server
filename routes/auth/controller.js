import jwt from 'jsonwebtoken'
import User from './model.js'

export const authController = {
   register: async (req, res, next) => {
      let user = new User(req.body)
      try {
         const newUser = await user.save()
         let token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
            expiresIn: '30d'
         })
         const auth_user = {
            _id: newUser._id,
            username: newUser.username,
            displayName: newUser.displayname
         }
         res.status(200).json({ auth: true, user: auth_user, token })
      } catch (error) {
         if (error.code === 11000) {
            return res.json({ auth: false, msg: 'That username is already taken' })
         }
         next(error)
      }
   },
   login: async (req, res) => {
      try {
         const user = await User.findOne({ username: { $regex: new RegExp(req.body.username, 'i') } })

         if (!user) return res.status(401).json({ auth: false, msg: 'Login Failed' })

         user.comparePasswords(req.body.password, (error, isMatch) => {
            if (error) {
               return res.status(401).json({ auth: false, msg: 'Login Failed' })
            }

            if (isMatch) {
               let token = jwt.sign({ id: user._id }, process.env.SECRET, {
                  expiresIn: '30d'
               })

               const auth_user = {
                  id: user._id,
                  displayname: user.displayname,
                  username: user.username
               }

               return res.status(200).json({
                  auth: true,
                  user: auth_user,
                  token
               })
            } else {
               return res.status(401).json({ auth: false, msg: 'Login Failed' })
            }
         })
      } catch (error) {
         return res.status(401).json({ auth: false, msg: 'Login Failed' })
      }
   },
   updateUser: async (req, res, next) => {
      try {
         const user = req.body.user

         let existingUser = await User.findById(req.user._id)
         if (!existingUser) {
            return res.status(404).json({ 
               success: false, 
               msg: `User ${ req.user._id } not found` 
            })
         }

         const updatedUser = await User.findOneAndUpdate({ _id: req.user._id },
            {
               $set: {
                  displayname: user.displayname,
                  username: user.username
               }
            }, { new: true })

         let token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
            expiresIn: '30d'
         })

         const auth_user = {
            id: updatedUser._id,
            displayname: updatedUser.displayname,
            username: updatedUser.username
         }

         return res.json({
            auth: true,
            user: auth_user,
            token
         })
      } catch (error) {
         next(error)
      }
   },
   changePassword: async (req, res, next) => {
      try {
         const { auth } = req.body
         const { id } = req.params

         let user = await User.findById(id)

         if (!user) {
            return res.status(404).json({ 
               success: false, 
               msg: `User ${ user._id } not found` 
            })
         }

         user.comparePasswords(auth.currentPassword, async (error, isMatch) => {
            if (error) {
               return res
                  .status(200)
                  .json({ auth: false, msg: 'Invalid credentials' })
            }

            if (isMatch) {
               user.password = auth.newPassword
               await user.save()

               return res.json({
                  success: true
               })
            } else {
               return res.status(200).json({
                  auth: false,
                  msg: 'Invalid credentials'
               })
            }
         })
      } catch (error) {
         next(error)
      }
   }
}
