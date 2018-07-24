
import React from 'react'
import { Switch, Route } from 'common/auth-router'
import Logo from 'common/logo'
import './style.less'
import { isMobile, isAlipay } from 'order/common'

const updateFontsize = () => document.documentElement.style.fontSize = `${window.innerWidth * (100 / 414)}px`
window.onresize = updateFontsize
updateFontsize()

export default class extends React.Component {
  render() {
    if (!isMobile()) {
      return <div>请用手机浏览器访问本页面</div>
    }
    const { match } = this.props;
    return (
      <div className="mobile-layout mobile-order-wrapper" >
        <div className={`mobile-header ${isAlipay() ? 'blur' : ''}`}><Logo platform="活动下单" /></div>
        <div className={`mobile-content ${isAlipay() ? 'blur' : ''}`}>
          <div className="mobile-order-layout">
            <Switch>
              <Route exact path={`${match.path}/order/:activity`} loadComponent={() => require('./order')} />
              <Route exact path={`${match.path}/pay/:orderId`} loadComponent={() => require('./pay')} />
              <Route exact path={`${match.path}/result/:orderId`} loadComponent={() => require('./result')} />
              <Route exact path={`${match.path}/bank-result`} loadComponent={() => require('./bank-result')} />
            </Switch>
          </div>
        </div>
        {isAlipay() && (
          <div className="mask"><div className="text">请选择<span>【从浏览器中打开】</span></div><div className="arrow"/></div>
        )}
      </div>
    )
  }
}
