import React from 'react'
import { Radio } from 'antd'
import Title from './title'
import Base from 'common/base'
const RadioGroup = Radio.Group

export default (class extends Base {

  static defaultProps = {
    start: false
  }

  radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  }

  genStyle = (target) => {
    const { info, result } = this.props
    const { answer = '', user_answer } = info
    if (!!result) {
      if (target === user_answer) {
        if (user_answer === answer) {
          return { color: 'rgb(15, 191, 115)' }
        } else {
          return { color: 'red' }
        }
      }
    } else {
      return {}
    }

  }

  isCorrect = () => {
    return this.props.info.is_right || false
  }

  onChange = (v) => {
    this.props.onChange(v.target.value)
  }

  render() {
    const { info, index, start, result } = this.props
    const { analysis } = info
    return (
      <div>
        <Title info={info} index={index} text="判断题" />
        <RadioGroup onChange={this.onChange} value={this.props.value}>
          {
            !result
              ? ([
                <Radio key="T" disabled={!start} style={this.radioStyle} value={'T'}>正确</Radio>,
                <Radio key="F" disabled={!start} style={this.radioStyle} value={'F'}>错误</Radio>
              ])
              : [
                <div style={this.genStyle('T')} key="T">A. 正确</div>,
                <div style={this.genStyle('F')} key="F">B. 错误</div>
              ]
          }
          {result
            && <div>{this.isCorrect()
              ? <div style={{ color: 'rgb(15, 191, 115)' }}><span>回答正确&nbsp;&nbsp;</span><span>答案解析：&nbsp;{analysis || '略'}</span></div>
              : <div style={{ color: 'red' }}><span>回答错误&nbsp;&nbsp;</span><span>&nbsp;答案解析：{analysis || '略。'}</span></div>}
            </div>
          }
        </RadioGroup>
      </div>
    )
  }
}).connect(state => {
  const { start, result } = state.exam
  return {
    start,
    result
  }
})
