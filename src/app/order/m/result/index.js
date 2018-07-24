import React from 'react'
import { HAVE_PAY } from 'order/common'
import api from 'order/common/api'
import Loading from 'order/components/loading'
import MobilePayResult from 'order/components/mobile/mobile-pay-result'

export default class extends React.Component {

  state = {
    init: false,
    loading: true
  }

  componentDidMount() {
    const order_id = this.getOrderId()
    this.getOrderDetail(order_id).then(orderInfo => {
      this.init(orderInfo, order_id)
    }).catch(() => {
      console.log('error')
      this.setState({
        loading: false,
        init: true
      })
    })
  }

  getOrderId = () => this.props.match.params.orderId

  getOrderDetail = (order_id) => {
    return api.orderDetail({ order_id })
  }

  init = (orderInfo, order_id) => {
    if (!this.state.init) {
      this.setState({
        init: true,
        orderInfo,
        loading: false
      })
    }
    if (orderInfo.status != HAVE_PAY) {
      this.orderStatusPolling({ order_id })
    }
  }

  orderStatusPolling = ({ order_id }) => {
    this.timer = setTimeout(() => {
      this.checkOrderStatus(this.timer, order_id)
    }, 2000)
  }

  checkOrderStatus = (timer, order_id) => {
    window.clearTimeout(this.timer)
    this.getOrderDetail(order_id).then(orderInfo => {
      this.init(orderInfo, order_id)
    }).catch(() => {
      console.log('error')
      this.setState({
        loading: false,
        init: true
      })
    })
  }

  render() {
    const { init, orderInfo, loading } = this.state
    if (!init) return <Loading loading={loading} />
    return <MobilePayResult info={orderInfo} title={orderInfo.status == 3 ? '支付结果获取中...' : '支付成功'} helmet="360网络安全学院-支付结果" />
  }
}
