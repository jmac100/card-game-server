import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cardSchema = new Schema({
   code: {
      type: String
   },
   image: {
      type: String
   },
   images: {
      svg: {
         type: String
      },
      png: {
         type: String
      }
   },
   value: {
      type: String
   },
   suit: {
      type: String
   }
})

const savedGameSchema = new Schema(
   {
      game: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Game',
         required: [true, 'Game is required']
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'User is required']
      },
      playerCards: {
         type: [cardSchema],
         required: [true, 'Player cards are required']
      },
      computerCards: {
         type: [cardSchema],
         required: [true, 'Computer cards are required']
      }
   },
   { timestamps: true }
)

export default mongoose.model('SavedGame', savedGameSchema)
