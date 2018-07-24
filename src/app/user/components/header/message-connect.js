import React from 'react'
import Base from 'common/base'
import Message from 'common/message'

export default (class extends Base {
  render() {
    const {messageNum} = this.props
    return <Message onClick={() => this.props.history.push('/message')} className="user-message-wrapper" messageNum={messageNum} />
  }
}).connect((state) => ({
  messageNum: state.app.messageNum
})).withRouter()
