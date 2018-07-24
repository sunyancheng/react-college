import React from 'react'
import Loading from 'order/components/loading'
import api from 'order/common/api'
import MobilePayResult from 'order/components/mobile/mobile-pay-result'

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
    const { init, data = {}, loading } = this.state
    if (!init) return <Loading loading={loading} />
    const { info={} } = data
    return <MobilePayResult info={info} status={data.status} bankCallback title={data.status ? '支付成功' : '支付状态异常'} helmet="360网络安全学院-支付结果" />
  }
}
