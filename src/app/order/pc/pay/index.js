import React from 'react'
import Helmet from 'react-helmet'
import api from 'order/common/api'
import { Button } from 'common/button'
import { baseURL } from 'common/request/config'
import { isMobile, HAVE_PAY, WAITING_PAY, PHASE_STATE } from 'order/common'
import { renderTimeChinese } from 'common/time'
import './style.less'
import { createCountDown } from 'common/time'
import PayResult from 'order/components/pc/pay-result'
const LayoutContent = ({ children }) => <div className="layout-content">{children}</div>

export default class extends React.Component {
  state = {
    init: false,
    showQrcode: false,
    duration: 0,
    status: WAITING_PAY,
    phase: PHASE_STATE.CHOOSE,
    wxQrcodeDuration: 40,
  }
  async componentWillMount() {
    const payOptions = await this.getPayOptions().catch(() => {
      console.log('error')
      this.setState({ init: true, payOptions: null })
      return null
    })
    if (!payOptions) return
    const res = await api.orderDetail({ order_id: payOptions.order_id })
    if (res.status === HAVE_PAY) {
      this.setState({
        orderDetail: res,
        phase: PHASE_STATE.RESULT,
        status: res.status,
        showQrcode: false,
        selectedPay: {},
      })
    } else {
      const Clock = createCountDown(
        (duration) => this.setState({ duration }),
        () => this.state.duration
      )
      this.clock = new Clock(1000, payOptions.time)
      this.clock.countDown()
      this.setState({ init: true, payOptions })
      const WxClock = createCountDown(
        (wxQrcodeDuration) => this.setState({ wxQrcodeDuration }),
        () => this.state.wxQrcodeDuration
      )
      this.wxClock = new WxClock(1000, this.state.wxQrcodeDuration)
    }
    this.setState({ init: true, payOptions })
  }

  componentWillUnmount() {
    this.clock && this.clock.clearTimer()
    this.wxClock && this.wxClock.clearTimer()
    window.clearTimeout(this.timer)
  }

  getOrderId = () => this.props.match.params.orderId

  getPayOptions() {
    const order_id = this.getOrderId()

    if (!/^[0-9]+$/.test(order_id)) {
      return Promise.reject()
    }
    return api.orderPayOptions({ order_id })
  }

  getQrcode = ({ order_id }) => {
    return api.orderPay({ order_id, bank_code: 'WEIXIN_QRCODE' })
  }

  handleSubmit = (e) => {
    const { payOptions, selectedPay } = this.state
    this.orderStatusPolling({ order_id: payOptions.order_id }) // 轮训开始
    if (!isMobile()) {
      if (selectedPay.type !== 'WEIXIN_QRCODE') this.setState({ phase: PHASE_STATE.BUY }) // 非微信展示phase阶段页面
      if (selectedPay.type === 'WEIXIN_QRCODE') { // 微信展示二维码
        this.getQrcode(payOptions).then((qrcode) => {
          this.setState({
            qrcode,
            showQrcode: true,
            phase: PHASE_STATE.RESULT, // TODO
          }, () => {
            this.wxClock.countDown()
          })
        })
        return e.preventDefault()
      }
    }
  }

  orderStatusPolling = ({ order_id }) => {
    this.timer = setTimeout(() => {
      this.checkOrderStatus(this.timer, order_id)
    }, 2000)
  }

  checkOrderStatus = (timer, order_id) => {
    window.clearTimeout(this.timer)
    api.orderDetail({ order_id }).then(res => {
      this.setState({
        orderDetail: res,
      })
      if (res.status != HAVE_PAY) {
        this.orderStatusPolling({ order_id })
      } else if (res.status == HAVE_PAY) {
        this.setState({
          phase: PHASE_STATE.RESULT,
          status: res.status,
          showQrcode: false // 支付完成关闭遮罩层，展示已支付页面
        })
        this.wxClock.pauseTimer() // wx要停表
      }
    })
  }

  recover = (cb) => {
    this.setState({ phase: PHASE_STATE.CHOOSE, showQrcode: false })
    window.clearTimeout(this.timer)
    cb && cb()
  }

  refreshQrcode = () => {
    this.getQrcode(this.state.payOptions).then((qrcode) => {
      this.setState({
        qrcode,
      }, () => {
        this.wxClock.resetDuration().countDown()
      })
    })
  }

  resetWxClock = () => {
    this.wxClock.resetDuration()
  }

  renderPayResult = () => {
    const { phase } = this.state
    if (phase === PHASE_STATE.BUY || phase === PHASE_STATE.RESULT) return this.renderResult()
    return null
  }

  isOrderInvalid = (duration) => {
    return duration === 0
  }

  renderResult = () => {
    const { status, phase, selectedPay, duration, orderDetail = {} } = this.state
    if (status === WAITING_PAY && phase === PHASE_STATE.BUY) {
      return (
        <div className="pay-result">
          <div className="pay-result__confirm">
            <div className="title">请在 <span>{renderTimeChinese(duration)}</span> 小时内完成付款</div>
            <div className="block">
              <div className="block-item">
                <div className="desc">支付成功请点击</div>
                <Button onClick={() => this.setState({ phase: PHASE_STATE.RESULT })} size="small" ghost>完成付款</Button>
              </div>
              <div className="block-item">
                <div className="desc">遇到问题请点击</div>
                <Button onClick={() => this.recover()} size="small">重新付款</Button>
              </div>
            </div>
            <div className="alert">注：重新付款前，请关闭之前的付款页面</div>
            <div className="console">如有疑问或需要帮助，请联系 <span>4000-555-360</span></div>
          </div>
        </div>
      )
    } else if (status === HAVE_PAY && phase === PHASE_STATE.RESULT) {
      return (
        <div className="pay-check pay-check-wrap">
          <div className="layout-content-wrapper">
            <div style={{ zIndex: 3 }}><PayResult options={orderDetail} title="恭喜，订单支付完成" /></div>
          </div>
        </div>
      )
    } else if (selectedPay.type !== 'WEIXIN_QRCODE' && status === WAITING_PAY && phase === PHASE_STATE.RESULT) {
      return (
        <div className="pay-check pay-check-wrap">
          <div className="layout-content-wrapper">
            <div style={{ zIndex: 3 }}><PayResult options={orderDetail} title="等待支付状态" titleStyle={{ color: '#FFA600' }} /></div>
          </div>
        </div>
      )
    }
    return null
  }

  renderBorad = () => {
    const { payOptions, showQrcode, selectedPay, qrcode, duration, wxQrcodeDuration } = this.state
    if (payOptions && !showQrcode) {
      return (
        <div className="pay-form-wrapper">
          <LayoutContent>
            <form
              action={`${baseURL}/misc/order/user/pay/pay`}
              target="_blank"
              method="get"
              onSubmit={this.handleSubmit}
            >
              <input onChange={new Function} style={{ display: 'none' }} name="order_id" value={this.getOrderId()} />
              <input onChange={new Function} style={{ display: 'none' }} name="bank_code" value={(selectedPay || { type: '' }).type} />
              <div className="pay-form-wrapper__right">
                <div className="order-num">订单号：{payOptions.order_id}</div>
                <div className=""><span>应付金额（元）：</span><span className="price">{payOptions.money}</span></div>
              </div>
              <div className="pay-form-wrapper__left">
                <div className="title">请选择支付方式</div>
                <div className="order-info order-title">
                  {!this.isOrderInvalid(duration) ? `请在 ${renderTimeChinese(duration)} 内完成支付` : '该订单已失效'}
                </div>
                <div className="order-info order-time">订单提交时间：{payOptions.ctime}</div>
              </div>
              <div>
                <div className="bank-list">
                  {(isMobile() ? payOptions.bank_code_h5 || [] : payOptions.bank_code || []).map((option, i) =>
                    <div key={i}>
                      <div className="method">{option.title}</div>
                      <div className={`logos ${this.isOrderInvalid(duration) ? 'disabled' : ''}`}>
                        {option.list.map((pay, j) =>
                          <div
                            onClick={() => {
                              if (this.isOrderInvalid(duration)) return
                              this.setState({ selectedPay: pay })
                            }}
                            key={j}
                            className={`${pay.icon} bank-item ${selectedPay === pay ? 'active' : ''}`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="buy"><Button disabled={!selectedPay || duration === 0} >去支付</Button></div>
              </div>
            </form>
          </LayoutContent>
        </div>
      )
    } else if (showQrcode) {
      return (
        <div className="pay-qrcode">
          <LayoutContent>
            <div className="pay-form-wrapper__right">
              <div className="order-num">订单号：{payOptions.order_id}</div>
              <div className=""><span>应付金额（元）：</span><span className="price">{payOptions.money}</span></div>
            </div>
            <div className="pay-form-wrapper__left">
              <div className="title">请用微信扫码支付</div>
              <div className="order-info order-title">请在{renderTimeChinese(duration)}&nbsp;内完成支付</div>
              <div className="order-info order-time">请及时付款，以便订单及时处理</div>
            </div>
            <div className="qrcode">
              <div className="qrcode-sm" />
              <div className="qrcode-wrapper">
                <img width="120" height="120" src={qrcode.img} />
                <div className="wx-brand" />
                <div className="desc">微信扫一扫完成支付</div>
                {wxQrcodeDuration > 0
                  ? <div className="desc">倒计时<span>{wxQrcodeDuration}</span>秒失效</div>
                  : <div className="desc">二维码过期，点击<span className="hover" onClick={this.refreshQrcode}>刷新</span></div>
                }
              </div>
              <div className="qrcode-rest"><span onClick={() => this.recover(this.resetWxClock.bind(this))}>使用其他支付方式付款></span></div>
            </div>
          </LayoutContent>
        </div>)
    }
  }

  render() {
    const { init } = this.state
    if (!init) return null
    return (
      <div className="layout-content-wrapper order-header-warp">
        <Helmet><title>360网络安全学院-订单结算</title></Helmet>
        {this.renderBorad()}
        {this.renderPayResult()}
      </div>
    )
  }
}
