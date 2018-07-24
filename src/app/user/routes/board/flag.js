import React from 'react'

export default ({info}) => {
  return (
    <div>{info.name ? info.name : '此时间段无课程安排'}</div>
  )
}
