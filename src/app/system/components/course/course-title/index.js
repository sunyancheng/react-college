import React from 'react'
import './style.less'
import Icon from 'common/icon'

export default ({title, onClick=()=>{}, number}) => (
    <div className="course__header">
      <div className="course__header-title">{title}&nbsp;({number || 0})</div>
      <div onClick={onClick} className="course__header-btn"><Icon style={{marginRight: 7}} type={'add'} />添加{title}</div>
    </div>
)
