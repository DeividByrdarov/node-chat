import User from "./models/User"
import { hash, compare } from "bcrypt"
import Message from "./models/Message"
import pubsub from "./config/PubSub"

const HASH_SALT = 10
const MESSAGE_CREATED = "MESSAGE_CREATED"

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
  },
  Mutation: {
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
    register: async (parent, { email, username, password }, ctx) => {
      let user

      try {
        user = await User.create({
          email,
          username,
          password: await hash(password, HASH_SALT),
          color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
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
      const message = await Message.create({ sender, text })
      let messageWithSender = await message.populate("sender").execPopulate()

      messageWithSender.id = messageWithSender._id.toString(),
      messageWithSender.text = messageWithSender.text,
      messageWithSender.sender = messageWithSender.sender,
      messageWithSender.createdAt = new Date(messageWithSender.createdAt).toISOString(),
      messageWithSender.updatedAt = new Date(messageWithSender.updatedAt).toISOString(),

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
