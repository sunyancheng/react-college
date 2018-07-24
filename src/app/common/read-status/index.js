import React from 'react'
import Icon from 'common/icon'
import './style.less'

export default ({status}) => {
  return (
  <div className="list-message">
    <Icon type="list-message"/>
    <div className={`${status == 0 ? 'list-message-read':'list-message-unread'}`} />
  </div>)
}
