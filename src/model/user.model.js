import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profile_pic: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    }


  },

  {
    timestamps: true
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = bcryptjs.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password)
}



export const User = mongoose.model('User', userSchema)