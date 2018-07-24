import React from 'react'
import classnames from 'classnames'
import './style.less'

export default class extends React.Component {
  render() {
    const { title, buttons, children, fill } = this.props
    return (
      <div className={classnames('user-page', {
          'user-page-fill': fill
        })}
      >
        <div className="user-page-header">
          <span className="title">{title}</span>
          <div className="buttons">{buttons}</div>
        </div>
        {children}
      </div>
    )
  }
}
