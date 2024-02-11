import Game from './model.js'

export const gameController = {
   list: async (req, res, next) => {
      try {
         const games = await Game.find()
         return res.status(200).json({
            success: true,
            games
         })
      } catch (error) {
         next(error)
      }
   },
   save: async (req, res, next) => {
      try {
         const game = new Game(req.body)         
         await game.save()
         res.status(201).json({
            success: true,
            game
         })
      } catch (error) {
         next(error)
      }
   }
}