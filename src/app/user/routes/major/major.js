import React from 'react'
import './style.less'
import api from 'common/api'
import Icon from 'common/icon'
import { Link } from 'react-router-dom'
import Layout from 'user/components/layout'
import classnames from 'classnames'
import { RESOURCE_TYPE } from 'common/config';

function isModuleOpen(m = {}) { return m.valid == 1 }
class Major extends React.Component {
  state = {
    modules: [],
    features: []
  }
  componentDidMount() {
    api.userMajor().then(data => this.setState(data))
  }

  go = (course) => () => {
    if(!!course.valid) {
      this.props.history.push(`/major/course/${course.course_id}#0`)
    }
  }

  renderCourse(mod) {
    const isOpen = isModuleOpen(mod)
    return (
      <div className="card" key={mod.module_id}>
        <div className={`card-head`}>
          <div className={`card-head-banner ${isOpen ? '' : 'card-head-banner-disabled'}`}>
            <div className="card-head-banner-number">共{mod.courses.length}门/{mod.rec_day}天</div>
            <div className="card-head-banner-title">{mod.name}</div>
          </div>
          <div className="card-head-slogan">
            {!!mod.description && <div><Icon className="quotes-left" type="quotes-1" />{mod.description}<Icon className="quotes-right" type="quotes-2" /></div>}
          </div>
        </div>
        <div className={"card-content " + (isOpen ? '' : ' card-content-disabled')}>
          {mod.courses.map((course, index) => (
            <div className={"card-course" + (!!course.valid ? '' : ' card-course-disabled')} key={index}>
              <div onClick={this.go(course)} className="card-content-title">
                {index + 1}.{course.name}
              </div>
              {
                <div className="card-content-detail">
                  {RESOURCE_TYPE.map((r) =>
                    (course.resources || []).includes(r.id) && !!course.valid ?
                      <Link key={r.id} to={`/major/course/${course.course_id}#${r.id}`} className="card-content-detail-link">{r.label}</Link> :
                      <a key={r.id} className="card-content-detail-link link-disabled">{r.label}</a>
                  )}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    )

  }

  render() {
    const { modules, name, major_pic, description, features, valid_day } = this.state
    return (
      <Layout scrollable>
        <div className="major">
          <div className="major-banner">
            <div className="major-banner-left"><img src={major_pic} /></div>
            <div className="major-banner-right">
              <h1>{name}</h1>
              <p>{description}</p>
              <div>
                {features.map((f, i) =>
                  <span key={i} className="feature">{f}</span>
                )}
              </div>
              <div className="valid-date">专业有效期：{valid_day}</div>
            </div>
          </div>
          <div className="major-step">
            <div className="major-step-begin">报名开课</div>
            <div className="major-step-bar">
              <div className="major-step-bar-table">
                <div className="major-step-bar-table-row">
                  {
                    modules.map((m, index) => (
                      <div
                        className={classnames('major-step-bar-item',
                          {
                            "major-step-bar-item-disable": !isModuleOpen(m),
                            "major-step-bar-item-last-enable": isModuleOpen(m) && !isModuleOpen(modules[index + 1]),
                            "major-step-bar-item-last-and-enable": isModuleOpen(m) && (index + 1) === modules.length
                          }
                        )}

                        key={index}
                      >
                        <div className="major-step-bar-item-text">{m.name}</div>
                        <div className={`major-step-bar-item-icon`}>
                          {isModuleOpen(m) ? <img src="/image/icon/course-open.png" /> : <img src="/image/icon/course-block.png" />}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="major-step-medal" />
          </div>
          {modules.map((m, i) =>
            <div key={i}>
              {this.renderCourse(m)}
            </div>
          )}
        </div>
      </Layout>
    )
  }
}

export default Major
