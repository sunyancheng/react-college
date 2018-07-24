import React from 'react'
import Title from './title'
import { Input } from 'antd'
import { Button } from 'common/button'
import Base from 'common/base'

const getUserRole = (role) => {
  return role.includes(2) ? '2' : '1'
}

export default (class extends Base {

  static defaultProps = {
    start: false
  }

  onChange = (v) => {
    this.props.onChange(v.target.value)
  }

  go = (resource_id) => (e) => {
    const { cid: course_id } = this.props.match.params
    window.open(`/experiment/home/${getUserRole(this.props.role)}/${course_id}/${resource_id}`)
    e.preventDefault()
  }

  isCorrect = () => {
    return this.props.info.is_right || false
  }

  render() {
    const { info, index, start, value, result } = this.props
    const { answer = '', analysis, choices = [], user_answer } = info
    return (
      <div>
        <Title info={info} index={index} text="实验题" />
        <Button  disabled={!start} style={{ margin: '0 0 15px 0' }} size="small" onClick={this.go(choices[0])}>点击进入实验场景</Button>
        {
          !result
            ? <Input.TextArea disabled={!start} onChange={this.onChange} value={value} />
            : <div>{user_answer}</div>
        }
        {result
          && <div>{this.isCorrect()
            ? <div style={{ color: 'rgb(15, 191, 115)' }}><span>回答正确&nbsp;&nbsp;</span><span>答案解析：&nbsp;{analysis || '略'}</span></div>
            : <div style={{ color: 'red' }}><span>回答错误&nbsp;&nbsp;</span><span>正确答案为：&nbsp;{answer.split('、')}， 答案解析：{analysis || '略。'}</span></div>}
          </div>
        }
      </div>
    )
  }
}).withRouter().connect(state => {
  const { start, result } = state.exam
  const { role } = state.app.userInfo
  return {
    start,
    result,
    role
  }
})
