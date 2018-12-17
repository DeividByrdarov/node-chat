import * as React from "react"
import { RouteComponentProps } from "react-router"
import gql from "graphql-tag"
import { Mutation, MutationFn } from "react-apollo"
import { OperationVariables, FetchResult } from "apollo-boost"
import { Context } from "../../Context"

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

class Login extends React.Component<RouteComponentProps> {
  state = {
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
    loginMutation: MutationFn<any, OperationVariables>,
    login: (id: string) => void
  ) => {
    e.preventDefault()
    const { email, password } = this.state
    const result = await loginMutation({
      variables: {
        email,
        password,
      },
    })

    if (result) {
      if (result.data.login.ok) {
        login(result.data.login.user.id)
        this.props.history.push("/")
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
            <Mutation mutation={LOGIN_MUTATION}>
              {loginMutation => (
                <form
                  onSubmit={e => this._onSubmit(e, loginMutation, updateUser)}
                >
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

                  <input type="submit" value="Login" />
                </form>
              )}
            </Mutation>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Login
