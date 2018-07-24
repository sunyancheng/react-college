import React from 'react'
import './style.less'
import api from 'order/common/api'
import Helmet from 'react-helmet'
import { HAVE_PAY, WAITING_PAY } from 'order/common'
import { baseURL } from 'common/request/config'
import { createCountDown } from 'common/time'
import { renderTimeChinese } from 'common/time'
import { Button } from 'common/button'
import Icon from 'common/icon'
import Loading from 'order/components/loading'
import { isAlipay, isWeixin } from 'order/common'

export default class extends React.Component {

  state = {
    init: false,
    duration: 0,
    status: WAITING_PAY,
    showConfirm: false,
    loading: true
  }

  componentDidMount() {
    this.getPayOptions().then(payOptions => {
      const Clock = createCountDown(
        (duration) => this.setState({ duration }),
        () => this.state.duration
      )
      this.clock = new Clock(1000, payOptions.time)
      this.clock.countDown()
      this.setState({ init: true, payOptions, loading: false })
    }).catch(() => {
      console.log('error')
      this.setState({ init: true, payOptions: null, loading: false })
    })
  }

  componentWillUnmount() {
    this.clock && this.clock.clearTimer()
    window.clearTimeout(this.timer)
  }

  getPayOptions() {
    const order_id = this.getOrderId()

    if (!/^[0-9]+$/.test(order_id)) {
      return Promise.reject()
    }
    return api.orderPayOptions({ order_id })
  }

  getOrderId = () => this.props.match.params.orderId

  getQrcode = ({ order_id }) => {
    return api.orderPay({ order_id, bank_code: 'WEIXIN_QRCODE' })
  }

  handleSelect = (bank) => {
    this.setState({
      selectedPay: bank
    })
  }

  handleSubmit = () => {
    const { payOptions } = this.state
    this.orderStatusPolling({ order_id: payOptions.order_id }) // 轮训开始
    this.setState({
      showConfirm: true
    })
  }

  cancel = (e) => {
    e.preventDefault()
    window.clearTimeout(this.timer)
    this.setState({
      showConfirm: false
    })
  }

  confirm = (e) => {
    e.preventDefault()
    this.props.history.push(`../result/${this.getOrderId()}`)
  }

  orderStatusPolling = ({ order_id }) => {
    this.timer = setTimeout(() => {
      this.checkOrderStatus(this.timer, order_id)
    }, 2000)
  }

  checkOrderStatus = (timer, order_id) => {
    window.clearTimeout(this.timer)
    api.orderDetail({ order_id }).then(({ status }) => {
      if (status != HAVE_PAY) {
        this.orderStatusPolling({ order_id })
      } else if (status == HAVE_PAY) {
        this.setState({
          status
        })
      }
    })
  }

  render() {
    const { init, payOptions, duration, selectedPay, showConfirm, loading } = this.state
    if (!init) return <Loading loading={loading} />
    const { bank_code_h5 } = payOptions
    return (
      <form
        action={`${baseURL}/misc/order/user/pay/pay`}
        target={`${isWeixin() ? '_self' : '_blank'}`}
        method="get"
        onSubmit={(e) => this.handleSubmit(e)}
      >
        <Helmet><title>360网络安全学院-订单结算</title></Helmet>
        <input onChange={new Function} style={{ display: 'none' }} name="order_id" value={this.getOrderId()} />
        <input onChange={new Function} style={{ display: 'none' }} name="bank_code" value={(selectedPay || { type: '' }).type} />
        <input onChange={new Function} style={{ display: 'none' }} name="wx_type" value={isWeixin() && (selectedPay || { type: '' }).type === 'WAP_WEIXIN' ? 'wx' : ''} />
        <div className="mobile-order">
          <div className="mobile-order-desc">
            <div className="mobile-order-title">选择付款方式</div>
            <div className="mobile-order-info">{duration != 0 ? `请在 ${renderTimeChinese(duration)} 内完成支付` : '订单已失效'}</div>
            <div className="mobile-order-price">应付金额：<span>{payOptions.money}元</span></div>
            <div className="mobile-order-id">订单号：<span>{payOptions.order_id}</span></div>
            <div className="mobile-order-time">订单提交时间：{payOptions.ctime}</div>
          </div>
          <div className="mobile-order__bank-list">
            {bank_code_h5.map((item, i) => {
              return (
                <div className="item" key={i}>
                  {item.list.map((bank, index) => {
                    if (isWeixin() && bank.type === 'WAP_ZFB') {
                      return null
                    }
                    return (
                      <div key={index} className="mobile-bank-item">
                        <Icon type="icon-selected" className={`choosen-btn ${selectedPay === bank ? 'active' : ''}`} />
                        <div onClick={() => this.handleSelect(bank)} key={index} className={`${bank.icon} mobile-bank-item-btn`} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          {!isAlipay() && <Button disabled={!selectedPay || duration == 0} className="mobile-order-button">下一步</Button>}
        </div>
        {showConfirm && !isWeixin() && (
          <div className="confirm-mask-wrapper">
            <div className="confirm-mask">
              <div className="title">支付确认</div>
              <div className="desc">如已完成付款，请点击"已付款"</div>
              <div className="desc">如未完成付款，请点击"取消"并重新去付款</div>
              <div><Button onClick={this.cancel} className="cancel">取消</Button><Button onClick={this.confirm} ghost>已付款</Button></div>
            </div>
          </div>
        )}
        {isAlipay() && (
          <div className="confirm-mask-wrapper">
            <div className="alert">
              请从浏览器打开本页面
            </div>
          </div>
        )}
      </form>
    )
  }
}
