import * as React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"

import ContextProvider from "./Context"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Logout from "./components/auth/Logout"

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
