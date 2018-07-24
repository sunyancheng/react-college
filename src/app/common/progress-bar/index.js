import React from 'react'
import classNames from 'classnames'
import './style.less'

export default ({className="", percentage=0, style={}}) => {
  const progressWith = (parseInt(style.width) || 100) * percentage
  return (
    <div className={classNames("progress-bar", className)} style={style} >
      <div className="progress-bar__current-progress" style={{width: progressWith}} />
    </div>
  )
}
