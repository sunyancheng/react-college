import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.less'

export default class Button extends React.Component {

  static defaultProps = {
    prefixCls: 'cm-btn',
    ghost: false,  //幽灵属性，使按钮背景透明
    type: 'primary',
    size: 'medium'
  };

  static propTypes = {
    type: PropTypes.oneOf(['primary', 'danger']),  // 置按钮类型，可选值为 primary dashed(TODO)
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.any,
    disabled: PropTypes.bool,
    ghost: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium'])
  }

  constructor(props) {
    super(props)
    this.state = {
      clicked: false   // 单击时刻的样式 配合setTimeout --> false  附加样式
      // loading: props.loading // 业务埋点
    }
  }

  handleClick = (e) => {
    if (this.props.disabled) return
    this.setState({clicked: true})   // 触发click过程中的样式
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.setState({ clicked: false }), 500) //_.debounce
    // 重新设定clicked状态
    const onClick = this.props.onClick
    if(onClick) {
      onClick(e)
    }
  }

  componentWillUnmount() {
    if(this.timeout) {
      window.clearTimeout(this.timeout)
    }
  }

  render() {
    const { prefixCls, className="", type, children, disabled, size, ghost, style } = this.props
    const { clicked } = this.state
    const classes = classNames(prefixCls, className, {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-disabled`]: disabled && !ghost,
      [`${prefixCls}-${type}-ghost`]: !disabled && ghost,
      [`${prefixCls}-${type}-disabled-ghost`]: disabled && ghost,
      [`${prefixCls}-${type}-clicked`]: clicked,
      [`${prefixCls}-${size}`]: true
    })
    return (
      <button
        className={classes}
        onClick={this.handleClick}
        disabled={disabled}
        style={style}
      >
        {children}
      </button>
    )
  }
}
