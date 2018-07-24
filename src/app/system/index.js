import "babel-polyfill"
import 'common/style'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout, Main } from 'common/layout'
import Header from 'system/components/header'
import Sider from 'common/sider'
import { Switch, Route, setRouterEnterResolver } from 'common/auth-router'
import App from 'common/app'
import MessageFetch from 'system/components/message-connect'
import { api } from 'common/api'
import store, { isSystemAdmin } from './store'
import WaitMenusFetched from 'common/wait-menus-fetched'
import './common-used-modules'

setRouterEnterResolver(({ match, history }) => {
  const { menuMap } = store.getState().app
  if (match.path === '/') {
    let anyPath = (Object.keys(menuMap)[0] || '')
    return history.replace(anyPath)
  }
  const hasAuth = menuMap[match.path]
  return hasAuth || Promise.reject(require('common/no-auth'))
})

export default function System() {
  return (
    <App >
      <Helmet>
        <title>360网络安全学院-管理平台</title>
      </Helmet>
      <WaitMenusFetched getMenus={() => isSystemAdmin() ? api.systemUserMenus() : []}>
        <Layout>
          <Header extra={<MessageFetch to="/notice" />} />
          <Main>
            <Main.Sider><Sider /></Main.Sider>
            <Main.Content>
              <Switch>
                <Route exact path={`/user`} loadComponent={() => import(/* webpackChunkName: "system-user" */ './routes/user')} />
                <Route exact path={`/order`} loadComponent={() => import(/* webpackChunkName: "system-order" */ './routes/order')} />
                <Route exact path={`/center`} loadComponent={() => import(/* webpackChunkName: "system-center" */ './routes/center')} />
                <Route exact path={`/student`} loadComponent={() => import(/* webpackChunkName: "system-student" */ './routes/student')} />
                <Route exact path={`/teacher`} loadComponent={() => import(/* webpackChunkName: "system-teacher" */ './routes/teacher')} />
                <Route exact path={`/administration`} loadComponent={() => import(/* webpackChunkName: "system-administartion" */ './routes/administration')} />
                <Route exact path={`/lecture`} loadComponent={() => import(/* webpackChunkName: "system-lecture" */ './routes/lecture')} />
                <Route exact path={`/video`} loadComponent={() => import(/* webpackChunkName: "system-video" */ './routes/video')} />
                <Route path={`/course`} loadComponent={() => import(/* webpackChunkName: "system-course" */ './routes/course')} />
                <Route exact path={`/college`} loadComponent={() => import(/* webpackChunkName: "system-college" */ './routes/college')} />
                <Route path={`/major`} loadComponent={() => import(/* webpackChunkName: "system-major" */ './routes/major')} />
                <Route path={`/notice`} loadComponent={() => import(/* webpackChunkName: "system-notice" */ './routes/notice')} />
                <Route exact path={`/invitation`} loadComponent={() => import(/* webpackChunkName: "system-invitation" */ './routes/invitation')} />
                <Route exact path={`/qrcode`} loadComponent={() => import(/* webpackChunkName: "system-qrcode" */ './routes/qrcode')} />
                <Route exact path={`/activity`} loadComponent={() => import(/* webpackChunkName: "system-activity" */ './routes/activity')} />
                <Route path={`/experiment`} loadComponent={() => import(/* webpackChunkName: "system-experiment" */ './routes/experiment')} />
                <Route path={`/target`} loadComponent={() => import(/* webpackChunkName: "system-target" */ './routes/target')} />
                <Route exact path={`/exam`} loadComponent={() => import(/* webpackChunkName: "system-exam" */ './routes/exam')} />
                <Route exact path={`/exercise`} loadComponent={() => import(/* webpackChunkName: "system-exercise" */ './routes/exercise')} />
                <Route exact path={`/record`} loadComponent={() => import(/* webpackChunkName: "system-record" */ './routes/record')} />
                <Route exact path={`/answer`} loadComponent={() => import(/* webpackChunkName: "system-answer" */ './routes/answer')} />
                <Route exact path={`/menu`} loadComponent={() => import(/* webpackChunkName: "system-menu" */ './routes/menu')} />
                <Route exact path={`/role`} loadComponent={() => import(/* webpackChunkName: "system-role" */ './routes/role')} />
                <Route exact path={`/admin`} loadComponent={() => import(/* webpackChunkName: "system-admin" */ './routes/admin')} />
                <Route exact path={`/scene`} loadComponent={() => import(/* webpackChunkName: "system-scene" */ './routes/scene')} />
                <Route exact path={`/advertise`} loadComponent={() => import(/* webpackChunkName: "system-advertise" */ './routes/advertise')} />
                <Route exact path={`/buy`} loadComponent={() => import(/* webpackChunkName: "system-buy" */ './routes/buy')} />
                <Route exact path={`/refund`} loadComponent={() => import(/* webpackChunkName: "system-refund" */ './routes/refund')} />
                <Route exact path={`/`} loadComponent={() => <div />} />
              </Switch>
            </Main.Content>
          </Main>
        </Layout>
      </WaitMenusFetched>
    </App>
  )
}
