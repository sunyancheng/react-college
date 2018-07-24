import React from 'react'
import Base from 'common/base'
import './style.less'
import { COURSE_LEVEL } from 'common/config'
import { RESOURCE_TYPE } from 'common/config'
import 'user/routes/major/style.less'
import './style.less'

export default (class extends Base {

  renderNav = (resources, cid, is_public) => {
    const label = (r) => RESOURCE_TYPE.find(rt => rt.id == r).label
    const { status } = this.props.course
    const handleClick = (e, r) => {
      e.stopPropagation()
      if (!!is_public) {
        window.location.href = `/user/course/detail/${cid}#${r}` // 公开课跳的地址
        return
      }
      window.location.href = `/user/major/course/${cid}#${r}`
    }
    return resources.map((r, i) => {
      return status == '1'
        ? (<span key={i} onClick={(e) => handleClick(e, r)} className={`card-content-detail-link`}>{label(r)}</span>)
        : (<span key={i} onClick={(e) => e.stopPropagation()} className={`card-content-detail-link ${this.isCourseInvalid(status)}`}>{label(r)}</span>)
    })
  }
  isCourseInvalid = (status) => {
    return status === "2" ? 'disabled' : ''
  }

  goto = () => {
    const { status } = this.props.course
    if (status === '2') return
    this.props.go()
  }

  render() {
    const { course_pic, level, description, name, teachers, is_public, resources, course_id, status } = this.props.course
    return (
      <div className="timeline-course-wrapper">
        <div onClick={this.goto} className="timeline__content">
          <div className={`course-bg ${this.isCourseInvalid(status)}`} style={{ backgroundImage: `url(${course_pic})` }} />
          <div className="course-detail">
            <div className={`title ${this.isCourseInvalid(status)}`}>
              {name} <span style={{ color: COURSE_LEVEL.find(v => v.value === level) ? COURSE_LEVEL.find(v => v.value === level).color : '' }} className="level">{COURSE_LEVEL.find(v => v.value === level).label}</span><div className="brand">{is_public === '1' ? <span>公开课&nbsp;&nbsp;/</span> : <div className="brand-major" />}</div>
            </div>
            <div className="author-list">{teachers.map((t, i) => <span key={i} className={`author ${this.isCourseInvalid(status)}`}>{t}</span>)}</div>
            <div className="description">{description}</div>
            <div className="card-content-detail timeline-card">
              {this.renderNav(resources, course_id, is_public)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}).withRouter()
