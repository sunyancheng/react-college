import React from 'react'
import Icon from 'common/icon'
import './style.less'

export default ({ icon, children }) => {
  return (
    <div className={`page-table-video`}>
      <div><Icon className="page-table-video-icon" type={icon} /></div>
      {children}
    </div>)
}
