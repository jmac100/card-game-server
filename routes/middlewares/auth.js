import jwt from 'jsonwebtoken';
import User from '../auth/model.js';

export const auth = async (req, res, next) => {
   const authToken = req.cookies && req.cookies[process.env.TOKEN_NAME];

   if (!authToken)
      return res.status(200).json({
         auth: false
      });

   try {
      const decodedToken = jwt.verify(authToken, process.env.SECRET);
      if (!decodedToken)
         return res.status(401).json({
            auth: false,
            msg: 'You must be logged in to perform this action'
         });

      const user_id = decodedToken.id;
      const user = await User.findById(user_id).select('-password');
      if (!user) {
         return res.status(401).json({
            auth: false,
            msg: 'You must be logged in to perform this action'
         });
      }

      req.user = user;

      next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         auth: false,
         msg: 'Invalid token'
      });
   }
};
