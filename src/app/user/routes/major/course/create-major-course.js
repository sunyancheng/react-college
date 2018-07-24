import React from 'react'
import Base from 'common/base'
import ContentLayout from './course-content-layout'
import './style.less'
import Icon from 'common/icon'
import Pdf from 'common/pdf-viewer';
import Video from './video'
import { Input } from 'antd'
import actions from 'user/actions/qa'
import { Button } from 'common/button'
import { TEACHER_TITLE, COURSE_LEVEL, STUDENT_TITLE } from 'common/config'
import ExperimentScene from 'common/experiment-scene'
import LevelBar from 'user/components/level-bar'
import Exam from './exam'
import { renderTime } from 'common/time'
import BreadCrumb from 'common/breadcrumb'
import Loading from 'common/loading'
import Alert from 'common/alert'
import defaultAvatar from 'image/photo_teacher@2x.png'

const getUserRole = (role, isTeacher) => {
  return isTeacher ? '4' : role.includes(2) ? '2' : '1'
}

export default ({ getCourseDetail, getCourseQAList, getHandouts, getVideo, getExperiment, getQa, isTeacher = false }) => (
  (class extends Base {
    state = { isInit: false, showToolbar: true, course: { resources: {}, teachers: [] }, activeResource: {}, qaList: [], answer: '' }

    componentWillMount() {
      const log = window.location.hash.slice(1).split('_')
      let hash = log[0]
      let item = log[1] || '0'
      let show = true
      if (hash === '0' || hash === '6') show = false
      if (hash === '0' || hash === '') hash = '1'
      this.setState({ role: getUserRole(this.props.role, isTeacher), showToolbar: show, hash, item })
    }

    componentDidMount() {
      this.dispatch(actions.setLoading(true))
      getCourseDetail({ course_id: this.props.match.params.id }).then(course => {
        this.setState({ course, isInit: true })
        this.getMountResource(course)
        this.dispatch(actions.setLoading(false))
      })
      getCourseQAList({ course_id: this.props.match.params.id, __role: this.state.role }).then(({ list: qaList }) => this.setState({ qaList }))
      if (this.state.hash === '6') {
        document.querySelector('.course-page').scrollTop = 744
      }
    }

    getMountResource = (course) => {
      const getDetail = {
        'handouts': getHandouts,
        'video': getVideo,
        'experiment': getExperiment,
        'exam': () => { }
      }
      const { resources } = course
      const { hash, item } = this.state
      const config = this.resourceTypes.find(r => r.id === hash) || {}
      const type = config.dataField
      const resource_id = ((resources[type] || [])[item] || {}).id
      getDetail[type] && resource_id && Promise.resolve((getDetail[type])({ course_id: course.course_id, resource_id, __role: this.state.role }))
        .then(data => this.setState({ activeResource: { type: config.dataField, url: (data || {}).url, resource_id, topo: (data || {}).network, resource: resources[type][0] } }))
    }

    renderHandout = ({ resource, i, course, config }) => {
      const handleClick = () => {
        getHandouts({ course_id: course.course_id, resource_id: resource.id, __role: this.state.role }).then(data => {
          this.setState({ activeResource: { type: config.dataField, url: data.url, resource_id: resource.id } })
          window.history.replaceState('', '', `#${config.id}_${i}`)
        })
      }
      return <div title={resource.name} className={`${this.isResourceActive(resource.id, config.dataField) ? 'active' : ''}`} key={i} onClick={handleClick}>{`${i + 1}. ${resource.name}`}</div>
    }

    renderVideo = ({ resource, i, course, config }) => {
      const handleClick = () => {
        getVideo({ course_id: course.course_id, resource_id: resource.id, __role: this.state.role }).then(data => {
          this.setState({ activeResource: { type: config.dataField, url: data.url, resource_id: resource.id } })
          window.history.replaceState('', '', `#${config.id}_${i}`)
        })
      }
      return (
        <div title={resource.name} className={`${this.isResourceActive(resource.id, config.dataField) ? 'active' : ''}`}>
          <div className="list-item-right video-duration">{`${renderTime(resource.duration)}`}</div>
          <div className="list-item " key={i} onClick={handleClick}>{`${i + 1}. ${resource.name}`}</div>
        </div>
      )
    }

    renderExperiment = ({ resource, i, course, config }) => {
      const handleClick = () => {
        this.dispatch(actions.setLoading(true))
        getExperiment({ course_id: course.course_id, resource_id: resource.id, __role: this.state.role }).then(data => {
          this.setState({ activeResource: { type: config.dataField, topo: data.network, resource, url: data.url, resource_id: resource.id } })
          window.history.replaceState('', '', `#${config.id}_${i}`)
          this.dispatch(actions.setLoading(false))
        })
      }
      return <div title={resource.name} className={`${this.isResourceActive(resource.id, config.dataField) ? 'active' : ''}`} key={i} onClick={handleClick}>{`${i + 1}. ${resource.name}`}</div>
    }

    renderExam = ({ resource, i, config }) => {
      const handleClick = () => {
        this.setState({ activeResource: { type: config.dataField, resource, resource_id: resource.id } })
        window.history.replaceState('', '', `#${config.id}_${i}`)
      }
      return <div title={resource.name} className={`${this.isResourceActive(resource.id, config.dataField) ? 'active' : ''}`} key={i} onClick={handleClick}>{`${i + 1}. ${resource.name}`}</div>
    }

    renderQA = ({ resource, i, course, config }) => {
      const handleClick = () => {
        getQa({ course_id: course.course_id, resource_id: resource.id, __role: this.state.role }).then(() => {
          this.setState({ activeResource: { type: config.dataField, resource, resource_id: resource.id } })
          window.history.replaceState('', '', `#${config.id}_${i}`)
        })
      }
      return <div title={resource.name} className={`${this.isResourceActive(resource.id, config.dataField) ? 'active' : ''}`} key={i} onClick={handleClick}>{`${i + 1}. ${resource.name}`}</div>
    }

    renderFile = ({ resource, i }) => {
      return (
        <div title={resource.name}>
          <div className="list-item-right"><a href={resource.url}>下载</a></div>
          <div className="list-item" title={resource.name}><a className="title" href={resource.url}>{`${i + 1}. ${resource.name}`}</a></div>
        </div>
      )
    }

    resourceTypes = [
      { id: '1', icon: 'handout', label: '讲义', dataField: 'handouts', render: this.renderHandout },
      { id: '2', icon: 'video2', label: '视频', dataField: 'video', render: this.renderVideo },
      { id: '3', icon: 'experiment', label: '实验', dataField: 'experiment', render: this.renderExperiment },
      { id: '4', icon: 'practice', label: '练习', dataField: 'exam', render: this.renderExam },
      { id: '5', icon: 'file', label: '资料', dataField: 'other', render: this.renderFile },
      { id: '6', icon: 'ask', label: '提问', dataField: 'qa', render: this.renderQA },
    ]
    renderResource() {
      const { type, url, topo, resource } = this.state.activeResource
      const { course, isInit } = this.state
      if (!isInit) return null
      // 有资源选中时
      if (type === 'handouts') {
        return (
          <Pdf
            event={{
              loadstart: () => this.dispatch(actions.setLoading(true)),
              loadCompleted: () => this.dispatch(actions.setLoading(false))
            }} url={url}
          />)
      }
      if (type === 'video') {
        return (
          <ContentLayout>
            <Video event={{
              loadstart: () => { this.dispatch(actions.setLoading(true)) },
              canplay: () => { this.dispatch(actions.setLoading(false)) },
              error: () => {
                this.dispatch(actions.setLoading(false))
                Alert.error('加载错误')
              },
              abort: () => { this.dispatch(actions.setLoading(false)) }
            }} url={`${url[0]}`}
              toolbar
              enableControlBar={{
                list: [{ name: '标清', src: `${url[0]}` }, { name: '高清', src: `${url[1]}` }],
                create() {
                  this.$dom.className = this.$dom.className + ' hover-layer'
                  this.option.width = '4em'
                },
                immediate: true,
                duration: -2,
                repeatTimes: 2,
                event: {
                  click: () => {
                    // this.hideMask()
                    console.log('click');
                  }
                }
              }}
            />
          </ContentLayout>
        )
      }
      if (type === 'experiment') {
        let newTopo = JSON.parse(topo || '{}') || {};
        let { nodes: targetNodes, edges: targetEdges } = newTopo
        return (
          <ContentLayout>
            <Button size="small" style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }} onClick={() => window.open(`/experiment/home/${getUserRole(this.props.userInfo.role, isTeacher)}/${this.props.match.params.id}/${resource.id}`, "_blank")}>点击开始</Button>
            <ExperimentScene
              readOnly
              url={url}
              setTopoNetwork={(network) => this.dispatch(actions.setPageState({ network }))}
              {...{ network: this.props.network, targetNodes, targetEdges }}
              {...this.props}
            />
          </ContentLayout>
        )
      }
      if (type === 'exam') {
        return (
          <ContentLayout>
            <div style={{ height: '100%', backgroundColor: '#FFF' }}>
              <Button size="small" style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }} onClick={() => this.goExam(resource)}>点击开始</Button>
              <Exam resource={resource} />
            </div>
          </ContentLayout>
        )
      }
      // 无资源选中时
      const targetType = this.resourceTypes.find(r => r.id === this.state.hash)
      if (typeof targetType === 'undefined') return <div className="course-page-content">没有该类型资源</div>
      if (targetType.dataField === 'qa' || (course.resources[targetType.dataField] && course.resources[targetType.dataField].length > 0)) {
        return <div className="course-page-content" />
      } else {
        return <div className="course-page-content">该课程没有{targetType.label}</div>
      }
    }

    goExam = (resource) => {
      const { id: cid } = this.props.match.params
      const rid = resource.id
      isTeacher ? window.open(`/exam/home/teacher/${cid}/${rid}`) : window.open(`/exam/home/student/${cid}/${rid}`)
    }

    handleToolbarBtn = (r) => {
      const { showToolbar } = this.state
      if (r.dataField === 'qa') {
        if (isTeacher) return
        document.querySelector('.course-page').scrollTop = 744
        window.history.replaceState('', '', `#${r.id}`)
        if (showToolbar) this.setState({ showToolbar: false, hash: r.id })
        return
      }
      if (this.isResourceDisabled(r)) return
      if (!showToolbar) this.setState({ showToolbar: !showToolbar })
      window.history.replaceState('', '', `#${r.id}`)
      this.setState({ hash: r.id })
    }

    isResourceActive = (id, field) => {
      return this.state.activeResource.resource_id === id && this.state.activeResource.type === field
    }

    isResourceDisabled = (r) => {
      if (r.dataField === 'qa' && !isTeacher) {
        return false
      }
      return !(this.state.course.resources || {})[r.dataField]
    }

    renderQaList = () => {
      const { qaList } = this.state
      return (
        <div className="content">
          {
            this.props.userInfo.role.includes(2) && !isTeacher
            && (
              <div className="list-item">
                <div className="avatar">
                  <img src={this.props.userInfo.avatar} />
                </div>
                <div className="comment">
                  <Input.TextArea placeholder="我来说几句" value={this.state.answer} onChange={e => this.setState({ answer: e.target.value })} />
                  <Button onClick={() => {
                    this.dispatch(actions.addQA({ course_id: this.props.match.params.id, content: this.state.answer }));
                    this.setState({ answer: '' })
                  }}
                  >提问</Button>
                </div>
              </div>
            )
          }
          {
            !!qaList.length
              ? qaList.map((item, i) =>
                <div className="list-item" key={i}>
                  <div className="avatar">
                    <img src={item.avatar} />
                  </div>
                  <div className="comment">
                    <p><span>{item.student}</span><span className="sub">&nbsp;·&nbsp;<span>{(STUDENT_TITLE.find(std => std.value == item.student_type) || {}).label}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{item.ctime}</span></span></p>
                    <p>{item.question}</p>
                  </div>
                  {item.answer &&
                    <div className="comment re-comment">
                      <p><span>{item.teacher}</span><span className="sub">&nbsp;·&nbsp;<span>{(TEACHER_TITLE.find(tea => tea.value == item.teacher_level) || {}).label}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{item.utime}</span></span></p>
                      <p>{item.answer}</p>
                    </div>}
                </div>)
              : <div className="list-item">{!isTeacher ? '还没有内容哦~' : '还没有内容哦~'}</div>
          }
        </div>
      )
    }

    renderMask = () => {
      const { showToolbar } = this.state
      if (!showToolbar) return null
      return this.state.hash !== '2' && <div className={this.state.hash === '2' ? "expand-block-video-mask" : "expand-block-mask"} onClick={this.hideMask} />
    }

    hideMask = () => this.setState({ showToolbar: false })

    render() {
      const { course, showToolbar, activeResource, qaList } = this.state
      const { resources, name, teachers } = course
      const isContentOpen = showToolbar
      const { resourceLoading } = this.props
      return (
        <div className="course-page">
          <div className="course-page-wrapper">
            <div className="course-page-module">
              <div className="course-page-module-header">
                <BreadCrumb /><span className="course-name">{course.name}</span>
              </div>
              <div className="course-page-module-content">
                <div key={activeResource.url || 'none'} className={"course-page-module-content-left" + (isContentOpen ? '' : ' extend')}>
                  {resourceLoading && <div className="loading-wrapper"><Loading pastDelay={resourceLoading} /></div>}
                  {this.renderResource && this.renderResource()}
                </div>
                <div className={`course-page-module-content-right ${isContentOpen ? 'extend' : ''}`}>
                  {isContentOpen &&
                    <div className={`resource-detail`}>
                      <div className="resource-detail-title">{name} <Icon type="arrow-right" onClick={() => this.setState({ showToolbar: false })} /></div>
                      <div className="resource-detail-scroll-container">
                        {[].concat((resources[(this.resourceTypes.find(item => item.id === this.state.hash) || {}).dataField] || [])).map((item, i) =>
                          <div className="resource-detail-label" key={i}>
                            {(this.resourceTypes.find(item => item.id === this.state.hash) || {}).render({ resource: item, i, config: (this.resourceTypes.find(item => item.id === this.state.hash) || {}), course })}
                          </div>
                        )}
                      </div>
                    </div>
                  }
                  <div className="course-toolbar">
                    {this.resourceTypes.map((r, i) =>
                      <div key={i} className={`course-toolbar-btn ${(this.state.hash === r.id) ? ' selected' : ''} ${this.isResourceDisabled(r) ? ' disabled' : ''}`}
                        onClick={() => this.handleToolbarBtn(r)}
                      >
                        <Icon type={r.icon} />
                        <span>{r.label}</span>
                      </div>
                    )}
                  </div>
                </div>
                {showToolbar && this.renderMask()}
              </div>
            </div>
          </div>
          <div className="course-page-info">
            <div>
              <div className="course-page-info-title">
                导师信息
              </div>
              {teachers.map((teacher, i) => (
                <div className="course-page-info-desc" key={i}>
                  <img className="course-page-info-desc-img" src={!!teacher.teacher_pic ? teacher.teacher_pic : defaultAvatar} />
                  <div className="course-page-info-desc-detail">
                    <div className="course-page-info-desc-detail-title">
                      <span className="course-page-info-desc-detail-title-name">{teacher.name}</span>
                      <span className={`course-page-info-desc-detail-title-brand type-${teacher.level}`}><img src={(TEACHER_TITLE.find(item => item.value === teacher.level) || {}).url} /></span>
                    </div>
                    <div className="course-page-info-desc-detail-desc">{teacher.introduction}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="course-page-info-summary">
              <div className="course-page-info-summary-title">
                课程概要
              </div>
              <div className="course-page-info-summary-desc">
                <div className="course-page-info-summary-desc-font">
                  适合人群：{course.suitable}
                </div>
                <div className="course-page-info-summary-desc-font">
                  难度:<LevelBar level={course.level} config={COURSE_LEVEL} />
                </div>
                <div className="course-page-info-summary-desc-font">
                  课程标签： {(course.tags || []).join('、')}
                </div>
              </div>
              <div className="course-page-info-summary-desc-font">
                课程介绍
              </div>
              <div className="course-page-info-summary-desc-font course-page-info-summary-detail">
                {course.description}
              </div>
            </div>
          </div>
          <div className="course-page-forum">
            <div className="course-page-forum-title">

              问答互动 （{qaList.length}）
            </div>
            {
              this.renderQaList()
            }
          </div>
        </div>
      )
    }
  }).connect(state => {
    const { network, resourceLoading } = state.page
    const { userInfo } = state.app
    return {
      role: userInfo.role,
      network,
      userInfo,
      resourceLoading
    }
  })
)

