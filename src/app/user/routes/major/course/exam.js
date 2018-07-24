import React from 'react'
import './exam.less'

export default ({ resource }) => {
  return (
    <div className="course-exam">
      <div className="title">练习名称 :<span>{resource.name}</span></div>
      <div className="desc">题数（道）:<span>{resource.total}</span></div>
      <div className="desc">总分（分）:<span>{resource.score * resource.total}</span></div>
    </div>
  )
}
