import React from 'react'
import { Input } from 'antd'
export default class extends React.Component {
  render() {
    var { type, onChange, ...rest } = this.props
    type = 'file'
    delete rest.value
    return <Input type={type} onChange={e => onChange(e.target.files[0])} {...rest} />
  }
}
