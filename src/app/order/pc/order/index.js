
import React from 'react'
import Helmet from 'react-helmet'
import { Button } from 'common/button'
import api from 'order/common/api'
import OrderInfo from 'order/components/pc/order-info'
import { Layout } from 'order/common/layout'
import './style.less'

export default class extends React.Component {
  state = { init: false, agreement: true }
  componentDidMount() {
    this.getActivity().then(activity => {
      this.setState({ init: true, activity })
    }).catch(() => {
      this.setState({ init: true, activity: null })
    })
  }

  getActivityId = () => this.props.match.params.activity

  getActivity() {
    const activity_id = this.getActivityId()

    if (!/^[0-9]+$/.test(activity_id)) {
      return Promise.reject()
    }
    return api.orderActivityDetail({ activity_id })
  }

  handleSubmit = () => {
    const activity_id = this.getActivityId()
    api.orderCreateOrder({ activity_id }).then(
      ([orderId]) => {
        this.props.history.push('../pay/' + orderId)
      }
    ).catch(() => {
      alert('提交订单失败，请稍后再试或联系客服')
    })
  }

  go = () => {
    return false
  }

  render() {
    const { init, activity, agreement } = this.state
    if (!init) return null

    return (
      <div className="layout-content-wrapper order-page">
        <Helmet><title>360网络安全学院-订单结算</title></Helmet>
        <Layout.Content>
          {activity && (
            <OrderInfo title="确认订单信息" options={activity}>
              <div className="extra">
                <Button disabled={!agreement} className="right" onClick={this.handleSubmit}>确认下单</Button>
              </div>
            </OrderInfo>)
          }
          {!activity && <div className="order-detail"><p>活动不存在或者已过期！</p></div>}
        </Layout.Content>
      </div>
    )
  }
}

