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
      }
      text
      createdAt
    }
  }
`

const Message = styled.div`
  padding: 10px;
  border-bottom: 1px solid black;
`

const HeadMessage = styled.div`
  font-size: 16px;
  small {
    font-size: 12px;
    color: grey;
  }
`

const BodyMessage = styled.div`
  margin-top: 0.5rem;
`

class Home extends React.Component<RouteComponentProps> {
  _pushMessage = async (text: string) => {
    console.log(text)
  }

  _renderMessage = (message: any) => {
    const now = moment()
    const date = moment(message.createdAt)

    const duration = moment.duration(now.diff(date, "hours"))

    return (
      <Message key={message.id}>
        <HeadMessage>
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

  render() {
    return (
      <Context.Consumer>
        {({ user }) => {
          if (!user) {
            this.props.history.replace("/login")
          }

          return (
            <Query query={GET_MESSAGES_QUERY}>
              {({ loading, error, data: { getMessages } }) => {
                if (loading) return <h1>loading...</h1>
                if (error) return <div>Error: {error}</div>

                return (
                  <div>
                    {getMessages.length > 0 ? (
                      getMessages.map(this._renderMessage)
                    ) : (
                      <h3>No messages</h3>
                    )}

                    <Form user={user} pushMessage={this._pushMessage} />
                  </div>
                )
              }}
            </Query>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Home
