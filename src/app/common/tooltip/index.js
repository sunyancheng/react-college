import React from 'react'
import './style.less'
export default ({ title, className="" }) => {
  return <div title={title} className={`text-omit ${className}`}>{title}</div>
}
