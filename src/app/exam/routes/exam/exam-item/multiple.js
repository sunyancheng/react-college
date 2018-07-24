import React from 'react'
import { Checkbox } from 'antd'
import Title from './title'
import Base from 'common/base'

const answer_key = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default (class extends Base {

  static defaultProps = {
    start: false
  }

  onChange = (v) => {
    this.props.onChange(v.sort())
  }

  isCorrect = () => {
    return this.props.info.is_right || false
  }


  genStyle = (target) => {
    const { info, result } = this.props
    const { answer = '', user_answer } = info
    if (!!result) {
      if ((!user_answer ? '' : user_answer).indexOf(target) > -1) {
        if (answer.indexOf(target) > -1) {
          return { color: 'rgb(15, 191, 115)' }
        } else {
          return { color: 'red' }
        }
      }
    } else {
      return {}
    }

  }

  render() {
    const { info, index, start, result, value } = this.props
    const { choices = [], answer = '', analysis } = info
    return (
      <div>
        <Title info={info} index={index} text="多选题" />
        <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={value}>
          {
            !result
              ? choices.map((v, i) => (<div style={{ marginBottom: '10px' }} key={i}><Checkbox disabled={!start} value={answer_key[i]}>{v}</Checkbox></div>))
              : choices.map((v, i) => <div key={i} style={this.genStyle(answer_key[i])}>{answer_key[i]}. {v}</div>)
          }
          {result
            && <div>{this.isCorrect()
              ? <div style={{ color: 'rgb(15, 191, 115)' }}><span>回答正确&nbsp;&nbsp;</span><span>答案解析：&nbsp;{analysis || '略'}</span></div>
              : <div style={{ color: 'red' }}><span>回答错误&nbsp;&nbsp;</span><span>正确答案为：&nbsp;{answer.split('').join('、')}， 答案解析：{analysis || '略。'}</span></div>}
            </div>
          }
        </Checkbox.Group>
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

