import React from 'react'
import Base from 'common/base'
import './style.less'
import api from 'common/api'
import actions from 'exam/actions'
import { Form } from 'antd'
import Single from './exam-item/single'
import Multiple from './exam-item/multiple'
import Judge from './exam-item/judge'
import Qa from './exam-item/qa'
import Experiment from './exam-item/experiment'
import { Button } from 'common/button'
import Alert from 'common/alert'
import {Clock} from 'exam/util'
import {renderTime} from 'common/time'

const calcUsingTime = (current, total) => {
  return Math.abs(current - total)
}

export default ({getRole}) => {
  return Form.create()(class extends Base {
    componentDidMount() {
      window.onbeforeunload = function(){
        return false
      }
      const { rid: resource_id, cid: course_id } = this.props.match.params
      this.dispatch(actions.startExperiment({ ids: { resource_id, course_id } }))
      api.getStudentExamDetail({ resource_id, course_id, __role: getRole(this.props.role) })
        .then(data => this.dispatch(
          actions.startExperiment(data)
        ))
    }

    componentWillUnmount() {
      Clock.clearTimer()
      window.onbeforeunload = null
    }

    handleSubmit = (e) => {
      e.preventDefault()
      const { list } = this.props
      const { rid: resource_id, cid: course_id } = this.props.match.params
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (list.filter(item => item.type === '2').some((item) => values[item.exam_pool_id].length < 2)) {
            Alert.error('多选题选项应大于两个')
            return
          }
          const json_result = Object.keys(values).map(v => ({
            exam_pool_id: v,
            answer: Array.isArray(values[v]) ? values[v].join('') : values[v]
          }))
          const current = Clock.pauseTimer()
          const time = (calcUsingTime(current, Clock.getInitialDuration()))
          api.submitStudentExam({ resource_id, course_id, time, json_result: JSON.stringify(json_result), __role: getRole(this.props.role) })
            .then(({ list, result }) => {
              Alert.info('提交成功')
              this.dispatch(actions.startExperiment({ start: false, hasSubmit: true, list, result }))
            })
            .catch(() => Alert.error('提交失败，请稍后再试'))
        }
      });
    }

    again = () => {
      const { ids, form } = this.props
      const { resource_id, course_id } = ids
      api.getStudentExamDetail({ resource_id, course_id, __role: getRole(this.props.role) })
        .then(data => {
          form.resetFields()
          Clock.resetDuration()
          Clock.countUp()
          this.dispatch(
            actions.startExperiment({ ...data, start: true, result: undefined, hasSubmit: false }),
          )
        })
    }

    clockPolling = (duration) => {
      clearTimeout(this.clockTimer)
      this.clockTimer = setTimeout(() => {
        actions.setDuration(duration)
        if(duration > 0) {
          this.clockPolling(duration - 1)
        }
      }, duration)
    }

    multipleValidator = (rule, value, callback) => {
      const failed = info => {
        callback(info)
      }
      const success = () => {
        callback()
      }
      if (!value) return failed('请填写答案')
      if (value.length === 0) return failed('请填写答案')
      if (value.length < 2) return failed('多选题需选择至少两个选项')
      return success()
    }

    renderSingle = (item, i, form) => <Single index={i} info={item} form={form} />
    renderMultiple = (item, i, form) => <Multiple index={i} info={item} form={form} />
    renderJudge = (item, i, form) => <Judge index={i} info={item} form={form} />
    renderQA = (item, i, form) => <Qa index={i} info={item} form={form} />
    renderExam = (item, i, form) => <Experiment index={i} info={item} form={form} />

    resourceTypes = {
      '1': this.renderSingle,
      '2': this.renderMultiple,
      '3': this.renderJudge,
      '4': this.renderExam,
      '5': this.renderQA
    }

    render() {
      const { list, form, start, hasSubmit, result } = this.props
      const { getFieldDecorator } = form
      return (
        <div className="examnation-wrapper" style={!!result ? {} : {overflow: 'auto'}}>
          <div style={!!result ? { display: 'flex' } : {overflow: 'auto'}} className="examnation-wrapper-form">
            <div style={!!result ? { flex: 1 } : {}} className="examnation-form">
              <Form>
                <div style={{ padding: '30px 100px' }}>
                  {list.map((item, i) => {
                    const { type } = item
                    const decorator = type !== '2'
                      ? { rules: [{ required: true, message: '请填写答案' }] }
                      : { rules: [{ validator: this.multipleValidator }] }
                    return (
                      <Form.Item key={i}>
                        {getFieldDecorator(`${item.exam_pool_id}`, { ...decorator })(
                          this.resourceTypes[type](item, i, form))}
                      </Form.Item>
                    )
                  })}
                </div>
              </Form>
            </div>
            <div className="examnation-result">
              {
                !!result && (
                  <div className="examnation-result-flag">
                    <div className="flag-title">本次测试成绩</div>
                    <div className="flag-score">{result.score}分</div>
                    <div className="flag-result">答对{result.right_total}题，答错{Number(result.total)-Number(result.right_total)}题</div>
                    <div className="flag-time">答题用时</div>
                    <div className="flag-time-detail">({renderTime(result.time)})</div>
                    <div className="flag-slogan">{result.right_total === result.total? '亲，满分继续保持哦~' : '亲，再接再厉哦~'}</div>
                    <Button onClick={this.again}>{result.right_total === result.total ? '再来一次，巩固知识' : '再来一次，挑战满分'}</Button>
                  </div>
                )
              }
            </div>
          </div>
          <div className="examnation-button">
            {!hasSubmit
              ? <Button size="small" disabled={!start} onClick={this.handleSubmit}>提交</Button>
              : <Button disabled={start} size="small" onClick={this.again}>重新测试</Button>
            }
          </div>
        </div>
      )
    }
  }).withRouter().connect(state => {
    const { start, list = [], hasSubmit, ids, result, duration } = state.exam
    const { role } = state.app.userInfo
    return {
      start,
      list,
      hasSubmit,
      ids,
      role,
      result,
      duration
    }
  })
}
