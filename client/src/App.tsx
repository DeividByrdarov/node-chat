import * as React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { InMemoryCache } from "apollo-boost"
import { ApolloClient } from "apollo-client"
import { ApolloProvider } from "react-apollo"
import { split } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"

import ContextProvider from "./Context"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Logout from "./components/auth/Logout"

// Create an http link:
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ContextProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/logout" component={Logout} />
            </Switch>
          </Router>
        </ContextProvider>
      </ApolloProvider>
    )
  }
}

export default App
