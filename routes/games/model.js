import mongoose from 'mongoose'

const Schema = mongoose.Schema

const gameSchema = new Schema(
   {
      name: {
         type: String,
         required: [true, 'Name is required']
      }
   },
   { timestamps: true }
)

export default mongoose.model('Game', gameSchema)
