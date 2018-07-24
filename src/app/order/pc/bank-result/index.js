import React from 'react'
import './style.less'
import Helmet from 'react-helmet'
import api from 'order/common/api'
import PayResult from 'order/components/pc/pay-result'

export default class extends React.Component {
  state = {
    init: false
  }
  componentWillMount() {
    let { search } = this.props.location
    search = search.slice(1).split('&').map(item => {
      const arr = item.split('=')
      return {
        [arr[0]]: arr[1]
      }
    }).reduce((ret, obj) => {
      return {
        ...ret,
        ...obj
      }
    }, {})
    api.orderGetResult(search).then(data => {
      this.setState({
        data,
        init: true
      })
    })
  }
  render() {
    const { data = {}, init } = this.state
    if (!init) return null
    const { info = {} } = data
    return (
      <div className="layout-content-wrapper order-page">
        <Helmet><title>360网络安全学院-支付结果</title></Helmet>
        <PayResult options={info} title={info.status ? '恭喜，订单支付完成' : '支付状态异常'} />
      </div>
    )
  }
}
