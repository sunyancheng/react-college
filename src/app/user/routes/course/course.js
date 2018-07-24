import React from 'react'
import Base from 'common/base'
import Layout from 'user/components/layout'
import actions from 'user/actions/course'
import './style.less'
import Course from './course-item'
import Banner from 'user/components/user-banner'
import CourseEmpty from 'common/course-empty'

export default (class extends Base {

  componentDidMount() {
    this.dispatch(actions.getLearnList())
  }

  goToCourse = (course_id, is_public) => () => {
    if(is_public === '1') {
      window.location.href = `/user/course/detail/${course_id}#2_0`
      return
    }
    window.location.href = `/user/course/detail/${course_id}#0`
  }

  render() {
    const { list_learn } = this.props
    if (!list_learn) return null
    return (
      <Layout scrollable>
        <Banner />
        <div className="timeline-wrapper">
          {
            Object.keys(list_learn).length > 0
              ? (
                Object.keys(list_learn).map((key, index) => {
                  const learn_day = list_learn[key][0].learn_day
                  return (
                    <div className="timeline" key={key}>
                      <div className="timeline__list">
                        {index === 0 && <div className="timeline__list-desc">上次学习到这里了</div>}
                        {
                          (list_learn[key] || []).map((item, i) => {
                            return (
                              <div className="timeline__item" key={i}>
                                <Course go={this.goToCourse(item.course_id, item.is_public)} course={item} />
                              </div>
                            )
                          })}
                      </div>
                      <div className="timeline__icon-wrapper">
                        <div className="timeline__icon" />
                        <div className="timeline__learn-day">
                          <div className="timeline__learn-day-month">{`${learn_day.slice(4, 6)}-${learn_day.slice(6, 8)}`}</div>
                          <div className="timeline__learn-day-year">{`${learn_day.slice(0, 4)}`}</div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )
              : <CourseEmpty />
          }
        </div>
        {Object.keys(list_learn).length > 0 && <div className="no-more">亲，没有更多了</div>}
      </Layout>
    )
  }
}).connect(state => {
  const { list_learn } = state.app
  return {
    list_learn
  }
}).withRouter()
