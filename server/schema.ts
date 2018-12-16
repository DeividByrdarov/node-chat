import { gql } from "apollo-server-express"

export default gql`
  type User {
    id: ID!
    email: String!
    username: String!
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
    register(
      email: String!
      username: String!
      password: String!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }
`
