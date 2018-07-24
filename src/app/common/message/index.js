import React from 'react'
import './style.less'
import Icon from 'common/icon'
import classNames from 'classnames'

export default (class extends React.Component {

  static defaultProps = {
    onClick: () => {}
  }

  onClick = () => {
    this.props.onClick()
  }

  render() {
    return (
      <div onClick={this.onClick} className={`${classNames('head-message-wrapper', this.props.className)}`}>
        <Icon style={{ lineHeight: '60px' }} type="head-message-hover" />
        {!!+this.props.messageNum && <span className="head-message-num">{this.props.messageNum}</span> }
      </div>
    )
  }
})
