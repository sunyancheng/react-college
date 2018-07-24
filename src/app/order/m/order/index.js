import React from 'react'
import './style.less'
import api from 'order/common/api'
import { Button } from 'common/button'
import Loading from 'order/components/loading'
import MobileOrder from 'order/components/mobile/mobile-order'

export default class extends React.Component {
  state = { init: false, agreement: false, loading: true }
  componentDidMount() {
    this.getActivity().then(activity => {
      this.setState({ init: true, activity, loading: false })
    }).catch(() => {
      this.setState({ init: true, activity: null, loading: false })
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
    const { init, activity, agreement, loading } = this.state
    if (!init) return <Loading loading={loading} />
    return (
      <div className={`mobile-order-wrapper`}>
        {activity && (
          <MobileOrder title="请确认订单信息" info={activity} helmet="360网络安全学院-订单结算" >
            <Button disabled={agreement} className="mobile-order-button" onClick={this.handleSubmit}>确认购买</Button>
          </MobileOrder>)
        }
        {!activity && <div className="order-detail"><p>活动不存在或者已过期！</p></div>}
      </div>
    )
  }
}
