import React from 'react'
import PropTypes from 'prop-types';
import { Button } from './index'
import Icon from '../icon'
// import classNames from 'classnames';

export default class IconButton extends React.Component {
  static defaultProps = {
    ghost: false,
    disabled: false,
    style: {
      color:'#FFF'
    },
    iconClass: ''
  }

  static propTypes = {
    iconType: PropTypes.string,
    children: PropTypes.any,
    type: PropTypes.oneOf(['primary', 'danger']),  // 置按钮类型，可选值为 primary dashed(TODO)
    onClick: PropTypes.func,
    className: PropTypes.string,
    ghost: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object
  }

  render() {
    const { icon, style, iconClass, ...otherProps } = this.props
    const children = (
      <span className="btn-content">
        {icon && <Icon className={`btn-icon ${iconClass}`} type={icon} style={style} />}
        {this.props.children}
      </span>
    )

    return (
      <Button {...otherProps}>{children}</Button>
    )
  }
}
