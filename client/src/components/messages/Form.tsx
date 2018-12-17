import * as React from "react"
import { Mutation, MutationFn, OperationVariables } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import Messages from "./Messages"

const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($sender: String!, $text: String!) {
    createMessage(sender: $sender, text: $text)
  }
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
  grid-gap: 5px;
  padding: 10px 5px 0 0;
  width: 100%;
  input, button {
    width: 100%
    height: 50px;
    font-size: 1.5rem;
  }

  input[type="text"] {
    border: 0;
    padding: 0 10px;
    outline: 0;
    border-radius: 4px;
    background: #3498db;
    color: white;
    &::placeholder {
      color: white;
      opacity: 1;
    }

  }

  button {
    border-radius: 6px;
    background: white;
    outline: 0;
  }
  
  @media screen and (max-width: 1024px) {
    & {
      grid-template-columns: 70% 30%;
    }
  }
`

class Form extends React.Component<{
  user: string
  scrollToBottom: Function
}> {
  state = {
    text: "",
  }

  _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  _onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    createMessage: MutationFn<any, OperationVariables>
  ) => {
    e.preventDefault()
    const { text } = this.state

    if (!text) return

    const response = await createMessage({
      variables: {
        sender: this.props.user,
        text,
      },
    })

    if (response) {
      if (response.data.createMessage) {
        this.setState({ text: "" })
        this.props.scrollToBottom()
      }
    }
  }

  render() {
    return (
      <Mutation mutation={CREATE_MESSAGE_MUTATION}>
        {createMessage => (
          <form onSubmit={e => this._onSubmit(e, createMessage)}>
            <Container>
              <input
                autoFocus
                type="text"
                name="text"
                placeholder="Start chatting..."
                value={this.state.text}
                onChange={this._onChange}
              />
              <button type="submit">Send &#9166;</button>
            </Container>
          </form>
        )}
      </Mutation>
    )
  }
}

export default Form
