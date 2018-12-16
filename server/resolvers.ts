import User from "./models/User"
import { hash, compare } from "bcrypt"
import Message from "./models/Message"

const HASH_SALT = 10

export default {
  Query: {
    login: async (parent, { email, password }, ctx) => {
      const user = await User.findOne({ email })

      if (await compare(password, user.password)) {
        return {
          ok: true,
          user,
        }
      }

      return {
        ok: false,
        error: [
          {
            field: "",
            message: "Invalid credentials",
          },
        ],
      }
    },
    getMessages: async () => {
      const messages = await Message.find({})

      return messages.map(message => ({
        id: message._id.toString(),
        sender: message.sender.toString(),
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }))
    },
  },
  Mutation: {
    register: async (parent, { email, username, password }, ctx) => {
      let user

      try {
        user = await User.create({
          email,
          username,
          password: await hash(password, HASH_SALT),
        })
      } catch (err) {
        return {
          ok: false,
          error: [err],
        }
      }

      return {
        ok: true,
        user,
      }
    },
    createMessage: async (parent, { sender, text }, ctx) => {
      await Message.create({ sender, text })

      return true
    },
  },
}
