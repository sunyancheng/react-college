import React from 'react'
import Proptypes from 'prop-types'
import './style.less'

export default class extends React.Component {

  static propTypes = {
    value: Proptypes.any,
    onChange: Proptypes.func,
  }

  renderChildren = (children) => {
    return React.cloneElement(children, this.props)
  }

  render() {
    const { style={}, children } = this.props
    return <div className="notice__input-cell" style={style}>{this.renderChildren(children)}</div>
  }
}
