import * as React from "react"
import moment from "moment"
import { RouteComponentProps } from "react-router"
import { Query } from "react-apollo"

import { Context } from "../Context"
import gql from "graphql-tag"
import Form from "./messages/Form"
import styled from "styled-components"

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

const Message = styled.div<any>`
  padding: 10px;
  background: ${props => props.bgColor};
  border-radius: 4px;
  margin-bottom: 5px;
  color: ${props => colorBasedOnBg(props.bgColor, "black", "white")};
`

const HeadMessage = styled.div<any>`
  font-size: 16px;
  small {
    font-size: 12px;
    color: ${props => colorBasedOnBg(props.bgColor, "#444", "#ccc")};
  }
`

const BodyMessage = styled.div`
  margin-top: 0.5rem;
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

const colorBasedOnBg = (bgColor: string, dark: string, light: string) => {
  const r = parseInt(bgColor.substr(1, 2), 16)
  const g = parseInt(bgColor.substr(3, 2), 16)
  const b = parseInt(bgColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? dark : light
}

class Home extends React.Component<RouteComponentProps> {
  _renderMessage = (message: any) => {
    const now = moment()
    const date = moment(message.createdAt)

    const duration = moment.duration(now.diff(date, "hours"))

    return (
      <Message key={message.id} bgColor={message.sender.color}>
        <HeadMessage bgColor={message.sender.color}>
          {message.sender.username}{" "}
          <small>
            {duration.days() > 0
              ? date.format("YYYY-MM-DD HH:mm")
              : date.fromNow()}
          </small>
        </HeadMessage>
        <BodyMessage>{message.text}</BodyMessage>
      </Message>
    )
  }

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
                      {getMessages.length > 0 ? (
                        getMessages.map(this._renderMessage)
                      ) : (
                        <h3>No messages</h3>
                      )}

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
