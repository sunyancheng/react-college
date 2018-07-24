import React from 'react'
import { isMobile } from 'order/common'

export default (Comp) => {
  return class extends React.Component {
    render() {
      if (!isMobile()) {
        return <div>请用手机访问本页面</div>
      }
      return (
        <Comp />
      )
    }
  }
}
