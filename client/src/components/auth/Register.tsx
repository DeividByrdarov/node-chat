import * as React from "react"
import { Context } from "../../Context"
import { RouteComponentProps } from "react-router"
import { Mutation, MutationFn } from "react-apollo"
import gql from "graphql-tag"
import { OperationVariables } from "apollo-boost"

const REGISTER_MUTATION = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(email: $email, password: $password, username: $username) {
      ok
      user {
        id
      }
      error {
        field
        message
      }
    }
  }
`

class Register extends React.Component<RouteComponentProps> {
  state = {
    username: "",
    email: "",
    password: "",
  }

  _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  _onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    register: MutationFn<any, OperationVariables>,
    updateUser: (id: string) => void
  ) => {
    e.preventDefault()
    const { username, email, password } = this.state

    const result = await register({
      variables: {
        email,
        username,
        password,
      },
    })
    console.log(result)
    if (result) {
      const {
        data: { register },
      } = result
      if (register.ok) {
        updateUser(register.user.id)
        this.props.history.replace("/")
      }
    }
  }

  render() {
    return (
      <Context.Consumer>
        {({ user, updateUser }) => {
          if (user) {
            this.props.history.replace("/")
          }

          return (
            <Mutation mutation={REGISTER_MUTATION}>
              {register => (
                <form onSubmit={e => this._onSubmit(e, register, updateUser)}>
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={this.state.username}
                      onChange={this._onChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={this.state.email}
                      onChange={this._onChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={this.state.password}
                      onChange={this._onChange}
                    />
                  </div>

                  <input type="submit" value="Register" />
                </form>
              )}
            </Mutation>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Register
