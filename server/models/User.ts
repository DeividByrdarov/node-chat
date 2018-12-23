import * as mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator"
import { hash } from "bcrypt"

const HASH_SALT = 10

interface IUser extends mongoose.Document {
  id: string
  username: string
  email: string
  color: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required field."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required field."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required field."],
      validate: {
        validator: value => {
          return value.length >= 8 && /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)
        },
        message: props => `Password must be atleast 8 characters and contain one lowercase letter, one uppercase letter and digit`
      }
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

schema.pre("save", async function(next) {
  const user = <IUser>this
  if (!user.isModified("password")) return next()

  await hash(user.password, HASH_SALT)
  next()
})

schema.plugin(uniqueValidator, { message: "User with this {PATH} already exists!" })

const User = mongoose.model<IUser>("User", schema)

export default User
