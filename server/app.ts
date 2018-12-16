import * as express from "express"
import { ApolloServer } from "apollo-server-express"

import typeDefs from "./schema"
import resolvers from "./resolvers"

const app = express()
const port = process.env.PORT || 3000

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app })

app.listen(port, () => console.log(`Server listening on port ${port}`))
