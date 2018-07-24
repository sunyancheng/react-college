import { Switch, Route } from 'common/auth-router'
import Logo from 'common/logo'
import React from 'react'
import { isMobile } from 'order/common'
import './style.less'
export default class extends React.Component {
  render() {
    if (isMobile()) {
      return <div>请用电脑浏览器访问本页面</div>
    }
    const { match } = this.props
    return (
      <div className="layout">
        <div className="layout-fixed-width"><Logo platform="活动下单" /></div>
        <div className="layout-main">
          <div className="order-layout">
            <Switch>
              <Route exact path={`${match.path}/order/:activity`} loadComponent={() => require('./order')} />
              <Route exact path={`${match.path}/pay/:orderId`} loadComponent={() => require('./pay')} />
              <Route exact path={`${match.path}/result`} loadComponent={() => require('./bank-result')} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
