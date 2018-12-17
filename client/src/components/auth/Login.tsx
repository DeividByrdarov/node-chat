import * as React from "react"
import { RouteComponentProps } from "react-router"
import gql from "graphql-tag"
import { Mutation, MutationFn } from "react-apollo"
import { OperationVariables, FetchResult } from "apollo-boost"
import { Context } from "../../Context"
import styled from "styled-components"
import { Link } from "react-router-dom"

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

export const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 20px;
  padding: 20px;
  border: 4px solid #8e44ad;
  border-radius: 6px;
  background-color: #9b59b6;
`

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 20px;
  height: 30px;
  color: white;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    outline: 0;
    border: 1px solid white;
    border-radius: 4px;
    padding: 0px 5px;
    font-size: 1rem;
    background-color: #34495e;
    color: white;
  }
`

export const Submit = styled.button`
  height: 30px;
  outline: 0;
  border: 2px solid #27ae60;
  border-radius: 4px;
  background: #2ecc71;
  font-size: 1rem;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.4) 1px 2px;

  &:hover {
    background: #27ae60;
  }

  &:active {
    transform: translateX(1px) translateY(2px);
    box-shadow: none;
  }
`

export const RegisterLink = styled(Link)`
  font-size: 0.8rem;
  text-decoration: none;
  color: white;
  cursor: pointer;
  text-align: end;
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
                <Form
                  onSubmit={e => this._onSubmit(e, loginMutation, updateUser)}
                >
                  <Container>
                    <FormGroup>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this._onChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this._onChange}
                      />
                    </FormGroup>

                    <RegisterLink to="/register">
                      Don't have account? Register!
                    </RegisterLink>

                    <Submit type="submit">Login</Submit>
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

export default Login
