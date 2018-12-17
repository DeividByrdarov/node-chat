import { Schema, model, Document } from "mongoose"

interface IMessage extends Document {
  id: string
  sender: string
  text: string
  createdAt: Date | string
  updatedAt: Date | string
}

const schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Message = model<IMessage>("Message", schema)

export default Message
