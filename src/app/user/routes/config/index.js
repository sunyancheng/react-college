import React from 'react';
import './style.less';
import Layout from 'user/components/layout'
import { cachedApi } from 'common/api'
import Base from 'common/base'
import { updateUserDetail } from 'common/app/app-actions'
import { Switch, Route, NavLink, Redirect } from 'common/auth-router'
import subMenus from './menus'

export default (class extends Base {
  componentDidMount() {
    cachedApi.userDashboardInfoDetail().then(detail => this.dispatch(updateUserDetail(detail)))
  }

  render() {
    const { match } = this.props
    return (
      <Layout scrollable padding>
        <div className="user-config-left">
          {subMenus.map(({ name, url, icon }, i) =>
            <NavLink key={i} to={url} className="user-config-menu" activeClassName="user-config-menu-active">
              <i className={icon} />{name}
            </NavLink>
          )}
          <a href="https://i.xxx.cn/profile/chuserpwd" target="i360cn" className="user-config-menu">
            <i className="iconfont icon-accounts" />修改密码
           </a>
        </div>
        <div className="user-config-right">
          <Switch>
            <Route exact path={`${match.path}/info`} loadComponent={() => require('./info')} />
            <Route exact path={`${match.path}/avatar`} loadComponent={() => require('./avatar')} />
            <Redirect exact from={`${match.path}`} to={`${match.path}/info`}/>
          </Switch>
        </div>
      </Layout>
    );
  }
}).connect(state => {
  const model = state.app.userInfo || {}
  return {
    model
  }
})
