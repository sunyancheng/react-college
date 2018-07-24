import React from 'react'
import './style.less'


export default class extends React.Component {
  render() {
    const { config, value, ...rest } = this.props
    const { status, label } = config.find(i => i.value == value) || { label: '未知状态' };
    return !!status ? <span {...rest} className={`status-common ${status}`}>{label}</span> : <span {...rest}>{label}</span>
  }
}
