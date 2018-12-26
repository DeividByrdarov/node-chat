import User from "./models/User"
import { hash, compare } from "bcrypt"
import Message from "./models/Message"
import pubsub from "./config/PubSub"
import stringHelper from "./helpers/string.helper"

const MESSAGE_CREATED = "MESSAGE_CREATED"

let onlineUsers = []

export default {
  Query: {
    getMessages: async () => {
      const messages = await Message.find({})
        .populate("sender")
        .exec()

      return messages.map(message => ({
        id: message._id.toString(),
        text: message.text,
        sender: message.sender,
        createdAt: new Date(message.createdAt).toISOString(),
        updatedAt: new Date(message.updatedAt).toISOString(),
      }))
    },
    onlineUsers: () => {
      return {
        users: onlineUsers,
        count: onlineUsers.length,
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }, ctx) => {
      const user = await User.findOne({ email })

      if (!user) {
        return {
          ok: false,
          error: [
            {
              field: "*",
              message: "Invalid credentials",
            },
          ],
        }
      }

      if (await compare(password, user.password)) {
        onlineUsers.push(user._id.toString())

        return {
          ok: true,
          user,
        }
      }

      return {
        ok: false,
        error: [
          {
            field: "*",
            message: "Invalid credentials",
          },
        ],
      }
    },

    register: async (parent, { email, username, password }, ctx) => {
      let user

      try {
        user = await User.create({
          email,
          username,
          password,
        })

        onlineUsers.push(user._id.toString())
      } catch (err) {
        let error = []
        Object.keys(err.errors).forEach(field => {
          const message = stringHelper.capitalizeFirstLetter(
            err.errors[field].message
          )
          error.push({ field, message })
        })
        return {
          ok: false,
          error,
        }
      }

      return {
        ok: true,
        user,
      }
    },
    logout: () => {},

    createMessage: async (parent, { sender, text }, ctx) => {
      if (!text) return false
      const message = await Message.create({ sender, text })
      let messageWithSender = await message.populate("sender").execPopulate()
      ;(messageWithSender.id = messageWithSender._id.toString()),
        (messageWithSender.text = messageWithSender.text),
        (messageWithSender.sender = messageWithSender.sender),
        (messageWithSender.createdAt = new Date(
          messageWithSender.createdAt
        ).toISOString()),
        (messageWithSender.updatedAt = new Date(
          messageWithSender.updatedAt
        ).toISOString()),
        pubsub.publish(MESSAGE_CREATED, { messageCreated: messageWithSender })

      return true
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
  },
}
