import { gql } from "apollo-server-express"

export default gql`
  type User {
    id: ID!
    email: String!
    username: String!
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

  type Error {
    field: String!
    message: String!
  }

  type Query {
    getMessages: [Message!]!
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
`
