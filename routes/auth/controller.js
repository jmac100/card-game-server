import jwt from 'jsonwebtoken';
import User from './model.js';

export const authController = {
   register: async (req, res, next) => {
      let user = new model(req.body);

      try {
         const newUser = await user.save();
         let token = jwt.sign({ id: newUser._id }, process.env.SECRET);

         res.cookie(process.env.TOKEN_NAME, token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
         });

         res.status(200).json({ auth: true });
      } catch (error) {
         if (error.code === 11000) {
            return res.json({
               auth: false,
               message: 'That username is already taken'
            });
         }
         next(error);
      }
   },
   login: async (req, res) => {
      try {
         const user = await User.findOne({ username: { $regex: new RegExp(req.body.username, 'i') } });

         if (!user) return res.status(401).json({ auth: false, msg: 'Login Failed' });

         user.comparePasswords(req.body.password, (error, isMatch) => {
            if (error) {
               return res.status(401).json({ auth: false, msg: 'Login Failed' });
            }

            if (isMatch) {
               let token = jwt.sign({ id: user._id }, process.env.SECRET);

               res.cookie(process.env.TOKEN_NAME, token, {
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000,
                  secure: process.env.NODE_ENV === 'production'
               });

               return res.status(200).json({
                  auth: true
               });
            } else {
               return res.status(200).json({ auth: false, msg: 'Login Failed' });
            }
         });
      } catch (error) {
         return res.status(200).json({ auth: false, msg: 'Login Failed' });
      }
   },
   updateUser: async (req, res, next) => {
      try {
         const user = req.body.user;

         let existingUser = await User.findById(req.user._id);
         if (!existingUser) {
            return res.status(404).json({
               success: false,
               msg: `User ${req.user._id} not found`
            });
         }

         const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
               $set: {
                  displayname: user.displayname,
                  username: user.username
               }
            },
            { new: true }
         );

         let token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
            expiresIn: '30d'
         });

         const auth_user = {
            id: updatedUser._id,
            displayname: updatedUser.displayname,
            username: updatedUser.username
         };

         return res.json({
            auth: true,
            user: auth_user,
            token
         });
      } catch (error) {
         next(error);
      }
   },
   changePassword: async (req, res, next) => {
      try {
         const { auth } = req.body;
         const { id } = req.params;

         let user = await User.findById(id);

         if (!user) {
            return res.status(404).json({
               success: false,
               msg: `User ${user._id} not found`
            });
         }

         user.comparePasswords(auth.currentPassword, async (error, isMatch) => {
            if (error) {
               return res.status(200).json({ auth: false, msg: 'Invalid credentials' });
            }

            if (isMatch) {
               user.password = auth.newPassword;
               await user.save();

               return res.json({
                  success: true
               });
            } else {
               return res.status(200).json({
                  auth: false,
                  msg: 'Invalid credentials'
               });
            }
         });
      } catch (error) {
         next(error);
      }
   },
   validateUser: async (req, res, next) => {
      try {
         res.send({ user: req.user });
      } catch (error) {
         next(error);
      }
   },
   logout: async (req, res, next) => {
      try {
         const user = await User.findById(req.user._id);

         if (!user) {
            return res.status(404).json({
               success: false,
               message: `User ${id} not found`
            });
         }

         res.clearCookie(process.env.TOKEN_NAME);
         res.send({ auth: false });
      } catch (error) {
         next(error);
      }
   }
};
