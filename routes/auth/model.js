import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const userSchema = new Schema(
   {
      displayname: {
        type: String,
        required: [true, 'Display name is required']
      },
      username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        min: 6
      },
      isAdmin: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
)

userSchema.pre('save', function (next) {
   let member = this
   if (!member.isModified('password')) return next()
 
   bcrypt.genSalt(10, function (err, salt) {
     if (err) return next(err)
 
     bcrypt.hash(member.password, salt, function (err, hash) {
       if (err) return next(err)
 
       member.password = hash
       next()
     })
   })
 })
 
 userSchema.methods.comparePasswords = function (candidatePassword, cb) {
   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
     if (err) return cb(err)
     cb(null, isMatch)
   })
 }

 export default mongoose.model('User', userSchema)