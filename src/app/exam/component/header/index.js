import React from 'react'
import Logo from 'common/logo'
import './style.less';
import Base from 'common/base'
import UserInfo from 'common/user-info'
import { Button } from 'common/button'
import actions from 'exam/actions'
import api from 'common/api'
import { Clock } from 'exam/util'
import { renderTime } from 'common/time'

const getRole = (role) => {
  return role.includes(2) ? 2 : 1
}

export default (class Header extends Base {

  start = () => {
    this.dispatch(
      actions.startExperiment({ start: true, result: undefined }),
    )
    Clock.countUp()
  }

  getFirstExam = () => {
    const { resource_id, course_id } = this.props.ids
    api.getStudentFirstExam({ resource_id, course_id, __role: getRole(this.props.role) })
      .then(({ list, result }) => this.dispatch(actions.setDuration({ duration: 0 }), actions.startExperiment({ start: false, list, result })))
  }

  render() {
    const { start, hasSubmit, done } = this.props
    return (
      <header className="experiment-header">
        <Logo platform="实训平台" />
        <div className="experiment-header-right">
          <div className="experiment-header-right-avatar">
            <UserInfo />
          </div>
          <div className="experiment-header-right-menu">
            <span className="experiment-title">安全入门 · 课程测试</span>
            {done && <Button disabled={start} size="small" ghost onClick={this.getFirstExam}>首次测试成绩</Button>}
            <span className="timer">{renderTime(this.props.duration)}</span>
            <Button disabled={start || hasSubmit} size="small" onClick={this.start}>立即测试</Button>
          </div>
        </div>
      </header>
    )
  }
}).withRouter().connect(state => {
  const { start, hasSubmit, done, ids, duration } = state.exam
  const { role } = state.app.userInfo
  return {
    start,
    hasSubmit,
    done,
    ids,
    role,
    duration
  }
})
