import * as React from "react"
import { Context } from "../Context"
import { RouteComponentProps } from "react-router"

class Logout extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Context.Consumer>
        {({ updateUser }) => {
          updateUser("")
          this.props.history.replace("/login")

          return <div />
        }}
      </Context.Consumer>
    )
  }
}

export default Logout
