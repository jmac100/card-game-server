import SavedGame from './model.js'

export const savedGameController = {
   save: async (req, res, next) => {
      try {
         const savedGame = new SavedGame(req.body)
         await savedGame.save()
         return res.status(200).json({
            success: true,
            savedGame
         })
      } catch (error) {
         next(error)
      }
   }
}