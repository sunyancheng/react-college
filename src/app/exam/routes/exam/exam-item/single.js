import React from 'react'
import { Radio } from 'antd'
import Title from './title'
import Base from 'common/base'
const RadioGroup = Radio.Group

const answer_key = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default (class extends Base {

  static defaultProps = {
    start: false
  }

  radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  }

  onChange = (v) => {
    this.props.onChange(v.target.value)
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

  render() {
    const { info, index, start, value, result } = this.props
    const { answer = '', analysis, choices = [] } = info
    return (
      <div>
        <Title info={info} index={index} text="单选题" />
        <RadioGroup onChange={this.onChange} value={value}>
          {
            !result
              ? choices.map((v, i) => (<Radio disabled={!start} style={this.radioStyle} key={i} value={answer_key[i]}>{v}</Radio>))
              : choices.map((v, i) => <div key={i} style={this.genStyle(answer_key[i])}>{answer_key[i]}. {v}</div>)
          }
          {result
            && <div>{this.isCorrect()
              ? <div style={{ color: 'rgb(15, 191, 115)' }}><span>回答正确&nbsp;&nbsp;</span><span>答案解析：&nbsp;{analysis || '略'}</span></div>
              : <div style={{ color: 'red' }}><span>回答错误&nbsp;&nbsp;</span><span>正确答案为：&nbsp;{answer.split('、')}， 答案解析：{analysis || '略。'}</span></div>}
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
    result,
  }
})

