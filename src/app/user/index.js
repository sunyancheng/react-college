import "babel-polyfill"
import 'common/style'
import React from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, setRouterEnterResolver } from 'common/auth-router'
import App from 'common/app'
import { Layout, Main } from 'common/layout'
import Header from 'user/components/header'
import actions from 'user/actions/message'
import store, { isStudent } from './store'
import throttle from 'lodash/throttle'
import WaitUserDetailFetched from 'user/components/wait-user-detail-fetched'
import WaitMenusFetched from 'common/wait-menus-fetched'
import { isExpire } from 'user/store'
import './style.less'

const getMessage = throttle(() => store.dispatch(actions.setMessageNumber()), 15000)
setRouterEnterResolver(({ match, history }) => {
  getMessage()
  const { userInfo, menuMap } = store.getState().app
  if (match.url === '/') {
    if (isExpire(userInfo)) {
      return history.replace('/major')
    }
    return history.replace(isStudent() ? '/board' : '/course')
  }
  const hasAuth = menuMap[match.path]
  return hasAuth || Promise.reject(require('common/no-auth'))
})

const courseExperiemnt = [
  {
    name: '课程',
    url: '/course',
    children: [{
      name: '',
      url: '/course/detail/:id'
    }]
  }, {
    name: '实验',
    url: '/experiment'
  }
]
const orderMessageConfig = [
  {
    name: '订单',
    url: '/order'
  }, {
    name: '通知',
    url: '/message'
  }, {
    name: '设置',
    url: '/config',
    children: require('./routes/config/menus')
  }
]
const graduatedMenus = [
  {
    name: '专业',
    url: '/major',
    children: [{
      name: '',
      url: '/major/course/:id'
    }]
  },
  ...orderMessageConfig
]
const userMenus = [
  ...courseExperiemnt,
  ...orderMessageConfig
]
const studentMenus = [
  {
    name: '今日指南',
    url: '/board'
  }, {
    name: '专业',
    url: '/major',
    children: [{
      name: '',
      url: '/major/course/:id'
    }]
  }, {
    name: '课表',
    url: '/curriculum'
  },
  ...courseExperiemnt,
  {
    name: '练习',
    url: '/exercise'
  }, {
    name: '问答',
    url: '/qa'
  },
  ...orderMessageConfig
]

const renderMenu = () => {
  const { userInfo } = store.getState().app
  if (isExpire(userInfo)) {
    return graduatedMenus
  }
  return isStudent() ? studentMenus : userMenus
}

export default function () {
  return (
    <App className="user-wrapper">
      <Helmet>
        <title>360网络安全学院-学习平台</title>
      </Helmet>
      <WaitUserDetailFetched>
        <WaitMenusFetched getMenus={() => renderMenu()}>
          <Layout style={{ position: 'relative' }}>
            <Header />
            <Main>
              <Switch>
                <Route exact path={`/message`} loadComponent={() => require('./routes/message')} />
                <Route exact path={`/board`} loadComponent={() => import(/* webpackChunkName: "user-board" */ './routes/board')} />
                <Route exact path={`/order`} loadComponent={() => import(/* webpackChunkName: "user-order" */ './routes/order')} />
                <Route exact path={`/curriculum`} loadComponent={() => import(/* webpackChunkName: "user-curriculumn" */ './routes/curriculum')} />
                <Route path={`/course`} loadComponent={() => import(/* webpackChunkName: "user-course" */ './routes/course')} />
                <Route exact path={`/experiment`} loadComponent={() => import(/* webpackChunkName: "user-experiment" */ './routes/experiment')} />
                <Route path={`/config`} loadComponent={() => import(/* webpackChunkName: "user-config" */ './routes/config')} />
                <Route path={`/major`} loadComponent={() => import(/* webpackChunkName: "user-major" */ './routes/major')} />
                <Route exact path={`/qa`} loadComponent={() => import(/* webpackChunkName: "user-qa" */ './routes/qa')} />
                <Route exact path={`/exercise`} loadComponent={() => import(/* webpackChunkName: "user-exercise" */ './routes/exercise')} />
                <Route exact path="/" loadComponent={() => { }} />
              </Switch>
            </Main>
          </Layout>
        </WaitMenusFetched>
      </WaitUserDetailFetched>
    </App>
  )
}
