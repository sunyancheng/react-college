import React from 'react'
import Base from 'common/base'
import Message from 'common/message'

export default (class extends Base {
  render() {
    const {to, ...rest} = this.props
    return <Message onClick={() => this.props.history.push(to)} {...rest} />
  }
}).connect((state) => ({
  messageNum: state.app.messageNum
})).withRouter()
