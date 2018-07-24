import React from 'react'
import Base from './base'

export default class extends React.Component {
  render() {
    return (
      <Base name="no-auth" title="~亲，你还没有访问权限哦~" desc="请联系管理员，开通权限！"/>
    )
  }
}