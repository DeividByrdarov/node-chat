import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Query } from "react-apollo"

import { Context } from "../Context"
import gql from "graphql-tag"
import Form from "./messages/Form"

const GET_MESSAGES_QUERY = gql`
  query getMessages {
    getMessages {
      id
      sender
      text
      createdAt
    }
  }
`

class Home extends React.Component<RouteComponentProps> {
  _pushMessage = async (text: string) => {
    console.log(text)
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
                    {getMessages.map((message: any) => (
                      <div key={message.id}>
                        <h1>{message.text}</h1>
                      </div>
                    ))}

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
