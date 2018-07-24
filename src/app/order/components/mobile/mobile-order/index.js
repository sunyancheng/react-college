import React from 'react'
import './style.less'
import Helmet from 'react-helmet'

export default ({info, title, helmet, bankCallback, status,children}) => {
  return (
    <div className="mobile-info-wrapper">
      <Helmet><title>{helmet}</title></Helmet>
      { !!bankCallback ? <div className={`status ${ status ? '' : 'caution'}`}>{title}</div> : <div className={`status ${info.status == 3 ? 'caution' : ''}`}>{title}</div> }
      <img className="pic" src={info.pic} />
      <div className="title">{info.title}</div>
      <div className="price">实付金额：<span>{info.money}元</span></div>
      <div className="desc">说明：{info.memo}</div>
      <div className="time">时间：{info.ctime}</div>
      {children}
    </div>
  )
}
