import React from 'react'
import './style.less'
import MobileInfo from 'order/components/mobile/mobile-info'

export default (props) => {
  return <MobileInfo {...props}><div className="declaration">以实际支付结果为准</div></MobileInfo>
}
