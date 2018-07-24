import React from 'react'
import Base from 'common/base'

export default (class extends Base {
  render() {
    return (
      React.cloneElement(this.props.children, { key: this.props.campus_id })
    )
  }
}).connect(state => ({ campus_id: state.app.campus_id }))