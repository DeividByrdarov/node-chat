import * as express from "express"
import { createServer } from "http"
import { ApolloServer } from "apollo-server-express"

import typeDefs from "./schema"
import resolvers from "./resolvers"
import db from "./config/db"

const app = express()
const port = parseInt(process.env.PORT) || 4000
const host = process.env.HOST || "localhost"

db()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(port, host, () => {
  console.log(`Server listening on port ${port}`)
})
