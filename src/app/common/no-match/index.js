import React from 'react'
import Base from 'common/no-auth/base'

export default class extends React.Component {
  render() {
    return (
      <Base name="no-match" title="~ 亲，此地荒废已久 ~" desc="这是一个无效的URL，请放下你的执着"/>
    )
  }
}
