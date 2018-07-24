import React from 'react'
import './style.less'
import MobileOrder from 'order/components/mobile/mobile-order'

export default (props) => {
  const {children, info, ...rest} = props
  return <MobileOrder {...rest} info={info}><div className="id">订单号：{info.order_id}</div>{children}</MobileOrder>
}
