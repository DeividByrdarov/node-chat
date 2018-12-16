import User from "./models/User"
import { hash, compare } from "bcrypt"

const HASH_SALT = 10

export default {
  Query: {
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
  },
}
