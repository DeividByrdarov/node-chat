import * as React from "react"
import { Context } from "../../Context"
import { RouteComponentProps } from "react-router"
import { Mutation, MutationFn } from "react-apollo"
import gql from "graphql-tag"
import { OperationVariables } from "apollo-boost"
import styled from "styled-components"
import {
  Form,
  Container,
  FormGroup,
  Submit,
  RegisterLink,
  ErrorMessage,
} from "./Login"

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
    errors: { username: "", email: "", password: "" },
  }

  _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
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

    if (result) {
      const {
        data: { register },
      } = result
      if (register.ok) {
        updateUser(register.user.id)
        this.props.history.replace("/")
      } else {
        const errors: { [name: string]: string } = {}
        register.error.forEach((error: any) => {
          errors[error.field] = error.message
        })
        this.setState({
          errors,
        })
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
                <Form onSubmit={e => this._onSubmit(e, register, updateUser)}>
                  <Container>
                    <div>
                      <FormGroup>
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={this.state.username}
                          onChange={this._onChange}
                          className={`${this.state.errors.username &&
                            "red-field"}`}
                        />
                      </FormGroup>
                      {this.state.errors.username && (
                        <ErrorMessage>
                          {this.state.errors.username}
                        </ErrorMessage>
                      )}
                    </div>
                    <div>
                      <FormGroup>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={this.state.email}
                          onChange={this._onChange}
                          className={`${this.state.errors.email &&
                            "red-field"}`}
                        />
                      </FormGroup>
                      {this.state.errors.email && (
                        <ErrorMessage>{this.state.errors.email}</ErrorMessage>
                      )}
                    </div>
                    <div>
                      <FormGroup>
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={this.state.password}
                          onChange={this._onChange}
                          className={`${this.state.errors.password &&
                            "red-field"}`}
                        />
                      </FormGroup>
                      {this.state.errors.password && (
                        <ErrorMessage>
                          {this.state.errors.password}
                        </ErrorMessage>
                      )}
                    </div>

                    <RegisterLink to="/login">
                      Already have account? Login!
                    </RegisterLink>

                    <Submit type="submit">Register</Submit>
                  </Container>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Register
