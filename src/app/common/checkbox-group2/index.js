import React from 'react'
import { Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group
export default class extends React.Component {
  render() {
    const { options, value, onChange, getValue, getLabel, ...rest } = this.props
    return (
      <CheckboxGroup
        options={options.map(i => ({ value: getValue(i), label: getLabel(i) }))}
        value={value}
        onChange={onChange}
        {...rest}
      />
    )
  }
}