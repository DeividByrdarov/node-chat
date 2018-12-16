import * as express from "express"
import { ApolloServer } from "apollo-server-express"

import typeDefs from "./schema"
import resolvers from "./resolvers"
import db from "./config/db"

const app = express()
const port = process.env.PORT || 4000

db()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app })

app.listen(port, () => console.log(`Server listening on port ${port}`))
