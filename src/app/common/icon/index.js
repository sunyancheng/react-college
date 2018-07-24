import React from 'react'

export default (props) => {
  const { className = '', type, ...rest } = props
  return <i className={`iconfont icon-${type} ${className}`} {...rest} />
}

