import { gql } from "apollo-server-express"

export default gql`
  type User {
    id: ID!
    email: String!
    username: String!
    color: String!
    createdAt: String!
    updatedAt: String!
  }

  type Message {
    id: ID!
    sender: User!
    text: String!
    createdAt: String!
    updatedAt: String!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    error: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    user: User
    error: [Error!]
  }

  type OnlineUsers {
    users: [String!]!
    count: Int!
  }

  type Error {
    field: String!
    message: String!
  }

  type Query {
    getMessages: [Message!]!
    onlineUsers: OnlineUsers!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    register(
      email: String!
      username: String!
      password: String!
    ): RegisterResponse!

    createMessage(sender: String!, text: String!): Boolean!
  }

  type Subscription {
    messageCreated: Message
  }
`
