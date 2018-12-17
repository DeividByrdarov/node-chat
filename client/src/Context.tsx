import * as React from "react"

export const Context = React.createContext({
  user: "",
  updateUser: (id: string) => {},
})

class ContextProvider extends React.Component {
  _updateUser = (id: string) => {
    this.setState({
      user: id,
    })

    localStorage.setItem("user", id)
  }

  state = {
    user: localStorage.getItem("user") || "",
    updateUser: this._updateUser,
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default ContextProvider
