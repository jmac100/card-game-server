import SavedGame from './model.js'

export const savedGameController = {
   save: async (req, res, next) => {
      try {
         const savedGame = new SavedGame(req.body)
         await savedGame.save()
         return res.status(201).json({
            success: true,
            savedGame
         })
      } catch (error) {
         next(error)
      }
   },
   update: async (req, res, next) => {
      try {
         const { id } = req.params
         const game = req.body

         const existingGame = await SavedGame.findById(id)
         if (!existingGame) {
            return res.status(404).json({ success: false, msg: `Game not found with id of ${id}` })
         }

         existingGame.playerCards = game.playerCards
         existingGame.computerCards = game.computerCards

         await existingGame.save()

         res.status(200).json({ success: true, data: existingGame })
      } catch (error) {
         next(error)
      }
   },
   list: async (req, res, next) => {
      try {
         const savedGames = await SavedGame.find({ user: req.user._id }).populate('game').populate('user')

         return res.status(200).json({
            success: true,
            savedGames
         })
      } catch (error) {
         next(error)
      }
   },
   load: async (req, res, next) => {
      try {
         const { id } = req.params
         const savedGame = await SavedGame.findById(id)

         return res.status(200).json({
            success: true,
            savedGame
         })
      } catch (error) {
         next(error)
      }
   },
   delete: async (req, res, next) => {
      try {
         const { id } = req.params
         await SavedGame.deleteOne({ _id: id })
         res.status(200).json({
            success: true
         })
      } catch (error) {
         next(error)
      }
   }
}
