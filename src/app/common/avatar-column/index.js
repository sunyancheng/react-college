import React from 'react'
import { Avatar } from 'antd'
export default props => {
  var src = props.src || ''
  if (!src.includes('/dm/')) {
    src = src.replace('.com/', '.com/dm/48_48_/')
  }
  return (
    <span>
      <Avatar
        style={{ margin: '-5px 5px 0 0' }}
        size="small" src={src} icon="user"
      />
      <span>{props.name}</span>
    </span>
  )
}