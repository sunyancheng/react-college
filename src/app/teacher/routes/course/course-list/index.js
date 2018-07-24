import React from 'react'
import Banner from 'teacher/components/teacher-banner'
import Layout from 'user/components/layout'
import './style.less'
import { Row, Col } from 'antd'
import api from 'common/api'
import { COURSE_LEVEL } from 'common/config'
import CourseEmpty from 'common/course-empty'
import debounce from 'lodash/debounce'
import $clamp from 'common/clamp'

export default class extends React.Component {

  state = {
    courses: []
  }

  componentWillMount() {
    api.getPublicCourseList().then(courses => this.setState({ courses }))
  }

  jumpToDetail = (id) => {
    this.props.history.push(`/course/detail/${id}#0`)
  }

  renderClamp = debounce(() => {
    const doms = document.getElementsByClassName('teacher-course-cell__description')
    for (let i = 0; i < doms.length; i++) {
      $clamp(doms[0], { clamp: 3 })
    }
    return false
  })

  renderCourse = () => {
    const { courses } = this.state
    if (courses.length <= 0) {
      return <div style={{ paddingTop: 40, overflow: 'hidden' }} ><CourseEmpty /></div>
    }

    return (
      <Row>
        {courses.map((course, i) => {
          const { course_id, name, pic, level, description, teacher_names = '' } = course
          return (
            <Col span={8} key={i} {...{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }}>
              <div className="teacher-course-cell">
                <div onClick={() => this.jumpToDetail(course_id)} className="teacher-course-cell__course-pic" style={{ backgroundImage: `url(${pic})` }} />
                <div className="teacher-course-cell__text">
                  <div className="teacher-course-cell__course-name"><div title={name}>{name}</div></div>
                  <div className="teacher-course-cell__course-desc">
                    <span className="course-teacher-name">{teacher_names.split(',').map((t, i) => <span key={i}>{t}</span>)}</span>
                    <span className="course-level" style={{ color: COURSE_LEVEL.find(v => v.value === level).color }}>{COURSE_LEVEL.find(v => v.value === level) && COURSE_LEVEL.find(v => v.value === level).label}</span>
                  </div>
                  <div ref={this.renderClamp} className={`teacher-course-cell__description`}>
                    {description}
                  </div>
                </div>
              </div>
            </Col>)
        })}
      </Row>
    )

  }

  render() {
    return (
      <Layout scrollable>
        <Banner />
        <div className="teacher-course-list">
          {this.renderCourse()}
        </div>
      </Layout>
    )
  }
}
