import * as mongoose from "mongoose"

interface IUser extends mongoose.Document {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>("User", schema)

export default User
