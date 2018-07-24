import React from 'react'
import Base from 'common/base'
import './style.less'
import RingChart from 'user/components/ring-chart'
import RadarChart from 'user/components/radar-chart'
import Icon from 'common/icon'
import actions from 'user/actions/board'
import Layout from 'user/components/layout'
import Step from './step'
import TimeTable from './time-table'
import { FormModalStatic } from 'common/page/form-modal'
import api from 'common/api'
import { Button } from 'common/button'
import { isGraduated } from 'user/store'
import debounce from 'lodash/debounce'
import $clamp from 'common/clamp'

export default (class extends Base {
  componentDidMount() {
    this.dispatch(actions.getStudentDashBoard(), actions.getStudentNotice(), actions.getStudentDetail())
  } // 这里会重复get请求接口 待优化

  renderDate() {
    const d = new Date()
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
  }

  jumpTo = (path) => (e) => {
    this.props.history.push(path)
    e.stopPropagation()
  }

  initState = async ({ modalParams }) => {
    const { qa_id } = modalParams
    const model = await api.userQAListDetail({ qa_id })
    return {
      model
    }
  }

  renderClamp = debounce(() => {
    const doms = document.getElementsByClassName('board-profile-text-content')
    for (let i = 0; i < doms.length; i++) {
      $clamp(doms[0], { clamp: 2 })
    }
    return false
  })


  renderQa = () => {
    const { history } = this.props
    const { qas = {}, latest_qa = [] } = this.props.dashboard
    if (qas && qas.total === '0') {
      return (
        <div onClick={() => history.push('/qa')} className="board-block board-column board-hover hover-style">
          <div className="board-column-title">
            互动问答
          </div>
          <div className="qa-content">
            <div className="chart">
              <RingChart size={114} type={'ring'} theme={'blue'} percent={0} strokeWidth={7} />
            </div>
            <div className="desc">还未提问过哦~</div>
          </div>
        </div>
      )
    }
    return (
      <div onClick={() => history.push('/qa')} className="board-block board-column board-hover hover-style">
        <div className="board-column-title">
          互动问答
        </div>
        <div className="qas-wrapper">
          <div className="qas">
            <div className="title">提问（贴）</div>
            <div className="qas-num">{qas && qas.total}</div>
          </div>
          <div className="qas">
            <div className="title">答复（贴）</div>
            <div className="qas-num green">{qas && qas.answered}</div>
          </div>
        </div>
        {!!latest_qa && !!latest_qa[0]
          && (
            <div className="new-qa" onClick={(e) => {
              this.dispatch(actions.showModal('check', { qa_id: latest_qa[0].qa_id }))
              e.stopPropagation()
            }}
            >
              <span>新答复：</span><span className="detail">{latest_qa[0].question}</span>
            </div>
          )}
      </div>
    )
  }

  renderCourses = () => {
    const { dashboard, history } = this.props
    const { courses } = dashboard
    const recommand = (e) => {
      e.stopPropagation()
      history.push(`/major/course/${courses.items[0].course_id}#0`)
    }
    if (courses.is_history == 1) {
      return (
        <div onClick={() => history.push('/course')} className="board-block board-column board-hover hover-style">
          <div className="board-column-title">
            最近学习
        </div>
          <div>
            {!!courses.items.length
              ? <Step jumpTo={this.jumpTo} courses={courses.items} />
              : (<div className="course-detail-null">
                <div className="course-detail-null__title">您还没有进行线上课程学习</div>
              </div>)
            }
          </div>
        </div>)
    }
    return (
      <div onClick={() => history.push('/course')} className="board-block board-column board-hover hover-style">
        <div className="board-column-title">
          最近学习
        </div>
        <div>
          {!!courses.items.length
            ? (<div className="course-detail-null">
              <div className="course-detail-null__title">您还没有进行线上课程学习，推荐看看：</div>
              <div onClick={recommand} className="course-detail-null__course recommand">{courses.items[0].course}<span>{courses.items[0].ctime}</span></div>
              <Button onClick={recommand}>现在去学习</Button>
            </div>)
            : (<div className="course-detail-null">
              <div className="course-detail-null__title">您还没有进行线上课程学习</div>
            </div>)
          }
        </div>
      </div>
    )
  }

  checkFields = [
    {
      field: 'ctime',
      formItemProps: {
        label: '提问时间',
      },
      renderItem: 'static'
    }, {
      field: 'course',
      formItemProps: {
        label: '提问课程',
      },
      renderItem: 'static'
    }, {
      field: 'question',
      formItemProps: {
        label: '问题',
      },
      renderItem: 'static'
    }, {
      field: 'answer',
      formItemProps: {
        label: '回复内容',
      },
      renderItem({ state }) {
        return (<div>{state.model.status === '2' ? '待回复' : state.model.answer}</div>)
      }
    }, {
      field: 'teacher',
      condition({ model }) {
        return model.status !== '2'
      },
      formItemProps: {
        label: '回复人',
      },
      renderItem: 'static'
    }, {
      field: 'utime',
      condition({ model }) {
        return model.status !== '2'
      },
      formItemProps: {
        label: '回复时间',
      },
      renderItem: 'static'
    }
  ]

  renderText = (userInfo) => {
    const { schedule } = userInfo
    if (isGraduated(userInfo)) {
      return '恭喜您已正式结业，开班学习（天）'
    }
    return schedule && schedule.status === '2' ? `距离正式开班还有（天）` : `您已正式开班学习（天）`
  }

  render() {
    const { dashboard, userInfo, history, boardNotice } = this.props
    if (!dashboard) return null
    const { schedule, experiments, timetable, exams } = dashboard
    const avatar = (userInfo.avatar || '').replace('48_48_100', '300_300_100')
    const { name, nickname, signature, major_name, class_name, t3 } = userInfo
    return (
      <Layout scrollable padding>
        <div className="board">
          <div className="board-profile">
            <div className="board-block profile">
              <img className="board-profile-avatar" src={avatar} />
              <div className="board-profile-name">{name}</div>
              <div className="board-profile-desc">昵称: {nickname || '暂无'}</div>
              <div className="board-profile-detail">{major_name}&nbsp;/&nbsp;{class_name}</div>
              <div className="board-profile-brand" />
              <div className="board-profile-text">
                <Icon className="board-profile-text-quotes-left" type="quotes-1" />
                <div ref={this.renderClamp} className="board-profile-text-content">{signature || '天下安全出我辈，4月弹指定江山 容宝宝想想再写'}</div>
                <Icon className="board-profile-text-quotes-right" type="quotes-2" />
              </div>
              <div className="board-profile-title">
                <span className="">助理工程师能力模型</span>
              </div>
              <div className="board-profile-chart">
                <RadarChart radius={115} width={320} data={t3} />
              </div>
            </div>
            <Icon onClick={() => history.push('/config')} className="board-profile-icon" type="practice" />
          </div>
          <div className="board-desc">
            <div className="board-desc-alert">
              <span onClick={this.jumpTo('/message')} className="board-desc-alert-icon" />
              {!!boardNotice[0] ? <div onClick={this.jumpTo('/message')} className="board-desc-alert-detail hover">{boardNotice[0]}</div> : <div className="board-desc-alert-detail">暂时还未收到消息</div>}
            </div>
            <div className="board-row">
              <div onClick={this.jumpTo('/major')} className={`board-block board-column board-hover hover-style ${isGraduated(userInfo) ? 'graduated' : ''}`}>
                <div className="board-column-title">
                  学习进度
                </div>
                <div className="board-column-desc">
                  {this.renderText(userInfo)}
                </div>
                <div className="board-column-number">
                  {schedule && schedule.day}
                </div>
                <div className="board-column-desc">
                  {schedule && schedule.status !== '2' && '江湖称号:' + schedule.user_label}
                  {schedule && (schedule.next_label_day != 0) && (<span>（距离下次升级还有<span className="red">&nbsp;{schedule.next_label_day}&nbsp;</span>天）</span>)}
                </div>
              </div>
              <div onClick={this.jumpTo('/curriculum')} className="board-block board-column board-hover hover-style">
                <div className="board-column-title">
                  今日课表
                </div>
                <div className="date">
                  {this.renderDate()}
                </div>
                <div>{timetable && <TimeTable timetable={timetable} />}</div>
              </div>
            </div>
            <div className="board-row">
              <div onClick={this.jumpTo('/exercise')} className="board-block board-column board-hover hover-style">
                <div className="board-column-title">
                  练习榜单
                </div>
                <div className="board-column-chart board-column-chart-computer">
                  {exams && <RingChart size={114} type={'ring'} theme={'blue'} percent={Number(exams.exam_total) ? Number(exams.exam_done) / Number(exams.exam_total) : 0} strokeWidth={7} />}
                </div>
                <div className="board-column-content">
                  <div className="board-column-desc">
                    总分（分）
                  </div>
                  <div className="board-column-number">
                    {exams && exams.score}
                  </div>
                  <div className="board-column-desc">
                    累计练习 <span>{exams && exams.done_item}</span> 题，
                  </div>
                </div>
                <div className="board-column-content">
                  <div className="board-column-desc">
                    班级排名
                  </div>
                  <div className="board-column-number">
                    {exams.rank <= 30 ? exams.rank : '30+'}
                  </div>
                  <div className="board-column-desc" style={{ textIndent: '-3em' }}>
                    &nbsp;未做 <span>{exams.undo_item}</span> 题
                  </div>
                </div>
              </div>
              <div onClick={this.jumpTo('/experiment')} className="board-block board-column board-hover hover-style">
                <div className="board-column-title">
                  实验进度
                </div>
                <div className="board-column-chart board-column-chart-experiment">
                  <RingChart
                    size={114} type={'ring'} theme={'blue'}
                    percent={Number(experiments && experiments.done || 0) / (Number(experiments && experiments.done || 0) + Number(experiments && experiments.undo || 0))}
                    strokeWidth={7}
                  />
                </div>
                <div className="board-column-content board-column-content-margin">
                  <div className="board-column-desc">
                    已实验（个）
                  </div>
                  <div className="board-column-number">
                    {experiments && experiments.done || 0}
                  </div>
                </div>
                <div className="board-column-content board-column-content-margin">
                  <div className="board-column-desc">
                    待实验（个）
                  </div>
                  <div className="board-column-number board-column-number-black">
                    {experiments && experiments.undo || 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="board-row">
              {this.renderCourses()}
              {this.renderQa()}
            </div>
          </div>
        </div>
        <div className="copyright">Copyright©2018 360TrainingTeam All Rights Reserved. 京ICP证080047号</div>
        <FormModalStatic
          name="check"
          title="查看问题"
          initState={this.initState}
          modelFields={this.checkFields}
          onCancel={() => this.dispatch(actions.hideModal('check'))}
        />
      </Layout>
    )
  }
}).connect(state => {
  const { dashboard, userInfo, boardNotice = [] } = state.app
  return {
    userInfo,
    dashboard,
    boardNotice
  }
}).withRouter()
