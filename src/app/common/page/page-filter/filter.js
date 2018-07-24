import React from 'react'
import {
  Input,
  DatePicker,
  Select,
} from 'antd'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker

export const renderInput = (item, providor) => {
  return (
    <Input
      value={providor.props.criteria[item.name]}
      style={{ width: 180 }}
      placeholder={item.placeholder || item.label}
      onChange={(e) => providor.setCrieria({ [item.name]: (e.target.value || '').trim() })}
    />)
}

export const renderDatePicker = (item, providor) => {
  const placeholder = '选择时间'
  return (
    <DatePicker
      value={providor.props.criteria[item.name]}
      placeholder={item.placeholder || placeholder}
      format="YYYY-MM-DD"
      onChange={(value) => providor.setCrieria({ [item.name]: value })}
    />
  )
}

export const renderRangePicker = (item, providor) => {
  const defaultonChange = (values) => providor.setCrieria({
    'start_time': values[0],
    'end_time': values[1]
  })
  return (
    <RangePicker
      value={[providor.props.criteria['start_time'], providor.props.criteria['end_time']]}
      // showTime
      format="YYYY-MM-DD"
      onChange={item.onChange || defaultonChange}
    />
  )
}

export const renderSelect = (item, providor) => {
  const placeholder = '请选择'
  return (
    <Select
      value={providor.props.criteria[item.name]}
      placeholder={item.placeholder || placeholder}
      style={{ width: 180 }}
      onSelect={(value) => providor.setCrieria({ [item.name]: value })}
    >
      {item.options.map((option, i) => (
        <Option value={option.value} key={i}>{option.label}{option.desc}</Option>
      )
      )}
    </Select>
  )
}
