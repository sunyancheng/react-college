import React from 'react'
import { Popover } from 'antd';

export default ({ title, children }) => {
  return (
    <Popover content={title}>
      {children}
    </Popover>
  )
}
