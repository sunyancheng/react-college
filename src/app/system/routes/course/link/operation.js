import React from 'react'
import PropTypes from 'prop-types'
import { Select2 } from 'common/select'
import { BtnGroup, Btn } from 'common/button-group'

export default class extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    options: PropTypes.array,
    config: PropTypes.object
  }

  getValue() {
    return this.props.value || []
  }

  goUp = (i) => () => {
    const value = this.getValue()
    const temp = value[i - 1]
    value[i - 1] = value[i]
    value[i] = temp
    this.onChange(value)
  }

  goDown = (i) => () => {
    const value = this.getValue()
    const temp = value[i + 1]
    value[i + 1] = value[i]
    value[i] = temp
    this.onChange(value)
  }

  onSelectChange = newSelect => {
    let currentValue = this.getValue()
    const temp = currentValue.slice()
    currentValue.forEach(v => {
      if (!newSelect.includes(v))
        temp.splice(currentValue.indexOf(v), 1)
    })
    currentValue = temp
    newSelect.forEach(v => {
      if (!currentValue.includes(v)) {
        currentValue.push(v)
      }
    })
    this.onChange(currentValue)
  }

  onChange = (value) => {
    this.props.onChange(value.slice())
  }

  delete = (i) => () => {
    const value = this.getValue()
    value.splice(value.indexOf(value[i]), 1)
    this.onChange(value)
  }

  renderRow = (item, index) => {
    if (!item) return null
    return (
      <div className="course-link__panel__row" key={item.value}>
        <span className="course-link__panel__row-label">{index + 1}：{item.label}</span>
        <BtnGroup>
          <Btn disabled={index == 0} onClick={this.goUp(index)}>上移</Btn>
          <Btn disabled={index == this.getValue().length - 1} onClick={this.goDown(index)}>下移</Btn>
          <Btn onClick={this.delete(index)}>删除</Btn>
        </BtnGroup>
      </div>
    )
  }

  render() {
    const { options } = this.props
    const value = this.getValue()
    const optionMap = options.reduce((obj, item) => ({ ...obj, [item.value]: item }), {})
    return (
      <div>
        <Select2 mode="multiple"
          value={value}
          onChange={this.onSelectChange}
          optionLabelProp={'value'}
          options={options} getValue={i => i.value} getLabel={i => i.label}
        />
        <div className="course-link__panel">
          {
            value
              .map(id => optionMap[id])
              .map((item, i) => this.renderRow(item, i))
          }
        </div>
      </div>
    )
  }
}
