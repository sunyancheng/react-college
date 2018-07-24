import React from 'react'
import Base from 'common/base'
import Icon from 'common/icon'
import { NOTICE_TYPE } from 'common/config'
import './style.less'

export default (class MessageViewer extends Base {
  render() {
    const { markdown, showMarkDown, actions } = this.props
    return (
      <div
        style={{ width: showMarkDown ? '800px' : '0' }}
        className={`message-viewer ${showMarkDown ? 'shadow' : ''}`}
      >
        <div className="message-viewer__icon-wrapper">
          <Icon className="message-viewer__close" onClick={() => this.dispatch(actions.setPageState({ showMarkDown: false }))} type="close" />
          {
            !!markdown && (
              <div>
                <div className="message-viewer__markdown"><span className="message-viewer__markdown-title">{markdown.title}</span></div>
                <div className="message-viewer__desc">
                  <span>类型：{NOTICE_TYPE.find(config => config.value == markdown.type).label}</span>
                  <span>发布中心：{markdown.campus_name}</span>
                  <span>发布时间：{markdown.pub_time}</span>
                </div>
              </div>
            )
          }
        </div>
        {!!markdown && <div className="message-viewer__body" dangerouslySetInnerHTML={{ __html: markdown && markdown.content }} />}
      </div>
    )
  }
}).connect(state => {
  const { markdown, showMarkDown } = state.page
  return {
    markdown,
    showMarkDown
  }
})
