import * as React from "react"
import moment from "moment"
import styled from "styled-components"

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

const colorBasedOnBg = (bgColor: string, dark: string, light: string) => {
  const r = parseInt(bgColor.substr(1, 2), 16)
  const g = parseInt(bgColor.substr(3, 2), 16)
  const b = parseInt(bgColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? dark : light
}

class Messages extends React.Component<{
  data: any
  subscribeToMore: Function
}> {
  componentDidMount() {
    this.props.subscribeToMore()
  }

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

  render() {
    return this.props.data.length > 0 ? (
      this.props.data.map(this._renderMessage)
    ) : (
      <h3>No messages</h3>
    )
  }
}

export default Messages
