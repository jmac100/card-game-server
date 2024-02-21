import mongoose from 'mongoose'

const Schema = mongoose.Schema

const statSchema = new Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'User is required']
      },
      game: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Game',
         required: [true, 'Game is required']
      },
      totalPlayed: {
         type: Number,
         required: [true, 'Total played is required']
      },
      totalWon: {
         type: Number,
         required: [true, 'Total played is required']
      }
   },
   { timestamps: true }
)

export default mongoose.model('Stat', statSchema)