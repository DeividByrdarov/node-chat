import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Query } from "react-apollo"

import { Context } from "../Context"
import gql from "graphql-tag"
import Form from "./messages/Form"
import styled from "styled-components"
import Messages from "./messages/Messages"

const GET_MESSAGES_QUERY = gql`
  query getMessages {
    getMessages {
      id
      sender {
        id
        email
        username
        color
      }
      text
      createdAt
    }
  }
`

const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription {
    messageCreated {
      id
      sender {
        id
        email
        username
        color
      }
      text
      createdAt
    }
  }
`

const LogoutButton = styled.button`
  height: 40px;
  width: 100px;
  margin-bottom: 10px;
  outline: 0;
  border: 0;
  background-color: #7ed6df;
  border-radius: 100px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.4) 3px 3px;

  &:active {
    box-shadow: none;
    transform: translateX(3px) translateY(3px);
  }
`

class Home extends React.Component<RouteComponentProps> {
  _logout = () => {
    this.props.history.push("/logout")
  }

  render() {
    return (
      <div>
        <LogoutButton onClick={this._logout}>Logout</LogoutButton>
        <Context.Consumer>
          {({ user }) => {
            if (!user) {
              this.props.history.replace("/login")
            }

            return (
              <Query query={GET_MESSAGES_QUERY}>
                {({
                  loading,
                  error,
                  data: { getMessages },
                  subscribeToMore,
                }) => {
                  if (loading) return <h1>loading...</h1>
                  if (error) return <div>Error: {error}</div>

                  const more = () =>
                    subscribeToMore({
                      document: MESSAGE_CREATED_SUBSCRIPTION,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev
                        const newFeedItem = subscriptionData.data.messageCreated
                        newFeedItem.createdAt = new Date(
                          parseInt(newFeedItem.createdAt)
                        ).toISOString()

                        return Object.assign({}, prev, {
                          getMessages: [...prev.getMessages, newFeedItem],
                        })
                      },
                    })

                  return (
                    <div>
                      <Messages data={getMessages} subscribeToMore={more} />

                      <Form user={user} />
                    </div>
                  )
                }}
              </Query>
            )
          }}
        </Context.Consumer>
      </div>
    )
  }
}

export default Home
