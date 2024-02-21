import Stat from './model.js'

export const statController = {
   save: async (req, res, next) => {
      try {
         const { userId, gameId, win } = req.body
         let stat = await Stat.find({ user: userId, game: gameId })
         
         if (stat.length) {
            stat[0].totalPlayed += 1
            stat[0].totalWon = win ? stat[0].totalWon + 1 : stat[0].totalWon
            await stat[0].save()
         } else {
            stat = new Stat({
               user: userId,
               game: gameId,
               totalPlayed: 1,
               totalWon: win ? 1 : 0
            })
            await stat.save()
         }
         return res.status(201).json({
            success: true,
            stat
         })
      } catch (error) {
         next(error)
      }
   }
}
