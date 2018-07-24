import React from 'react'
import Title from './title'
import { Input } from 'antd'
import Base from 'common/base'

export default (class extends Base {
  static defaultProps = {
    start: false
  }
  onChange = (v) => {
    this.props.onChange(v.target.value)
  }
  render() {
    const { info, index, start } = this.props
    return (
      <div>
        <Title info={info} index={index} text="问答题" />
        <Input.TextArea disabled={!start} onChange={this.onChange} value={this.props.value} />
      </div>
    )
  }
}).connect(state => ({
  start: state.exam.start
}))

