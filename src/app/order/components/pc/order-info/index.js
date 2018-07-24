import React from 'react'
import './style.less'

export default ({titleStyle, title, options, children}) => {
  return (
    <div>
      <div className="title" style={titleStyle}>{title}</div>
      <div className="content">
        <div className="icon" style={{ backgroundImage: `url(${options.pic})` }} />
        <div className="detail">
          <div className="detail-title">{options.title}</div>
          <div className="detail-price">订单金额（元）：{options.money}</div>
          <div className="detail-desc">说明：{options.memo}</div>
        </div>
      </div>
      {children}
    </div>
  )
}
