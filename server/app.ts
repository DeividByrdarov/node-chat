import * as express from "express"
import { createServer } from "http"
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

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () => {
  console.log(`Server listening on port ${port}`)
})
