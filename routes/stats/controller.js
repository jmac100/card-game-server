import Stat from './model.js';

export const statController = {
   save: async (req, res, next) => {
      try {
         const { userId, gameId, win, descriptor } = req.body;
         let stat = await Stat.find({ user: userId, game: gameId });

         if (stat.length) {
            stat[0].totalPlayed += 1;
            stat[0].totalWon = win ? stat[0].totalWon + 1 : stat[0].totalWon;
            await stat[0].save();
         } else {
            stat = new Stat({
               user: userId,
               game: gameId,
               totalPlayed: 1,
               totalWon: win ? 1 : 0,
               descriptor
            });
            await stat.save();
         }
         return res.status(201).json({
            success: true,
            stat
         });
      } catch (error) {
         next(error);
      }
   },
   list: async (req, res, next) => {
      try {
         const stats = await Stat.find({ user: req.user._id }).populate('game').populate('user', '-password');
         return res.status(201).json({
            success: true,
            stats
         });
      } catch (error) {
         next(error);
      }
   }
};
