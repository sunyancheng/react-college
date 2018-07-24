import React from 'react'
import { Layout } from 'order/common/layout'
import OrderInfo from 'order/components/pc/order-info'
import { Button } from 'common/button'
import './style.less'

export default ({ titleStyle, title, options }) => {
  return (
    <Layout.Content>
      <OrderInfo titleStyle={titleStyle} title={title} options={options} />
      <div className="pay-check__info">
        <div className="id">订单号：{options.order_id}</div>
        <div className="time">时间：{options.ctime}</div>
        <div className="declaration">以实际支付结果为准</div>
      </div>
      <Button onClick={() => window.location.href = "/user/order"} className="back">返回订单列表</Button>
    </Layout.Content>
  )
}
