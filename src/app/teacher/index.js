import "babel-polyfill"
import 'common/style'
import React from 'react';
import Helmet from 'react-helmet'
import { Switch, Route, Redirect, setRouterEnterResolver } from 'common/auth-router'
import App from 'common/app'
import { Layout, Main } from 'common/layout'
import Header from 'user/components/header'
import throttle from 'lodash/throttle'
import store, { isTeacher } from './store'
import actions from 'teacher/actions/teacher'
import WaitMenusFetched from 'common/wait-menus-fetched'
import 'user/style.less'

const menus = [
  {
    name: '消息通知',
    url: '/message'
  }, {
    name: '课程备课',
    url: '/course',
    children: [{
      name: '',
      url: '/course/detail/:id'
    }]
  }, {
    name: '授课课表',
    url: '/curriculum'
  },
  {
    name: '授课班级',
    url: '/class'
  },
  {
    name: '学员答疑',
    url: '/qa'
  },
]

const getMessage = throttle(() => store.dispatch(actions.setMessageNumber()), 15000)
setRouterEnterResolver(({ match }) => {
  const { menuMap } = store.getState().app
  const hasAuth = menuMap[match.path]
  if (hasAuth) {
    getMessage()
  }
  return hasAuth || Promise.reject(require('common/no-auth'))
})

export default function () {
  return (
    <App className="user-wrapper">
      <Helmet>
        <title>360网络安全学院-教学平台</title>
      </Helmet>
      <WaitMenusFetched getMenus={() => isTeacher() ? menus : []}>
        <Layout>
          <Header platform="教学平台"/>
          <Main>
            <Switch>
              <Route exact path={`/message`} loadComponent={() => require('./routes/message')} />
              <Route exact path={`/qa`} loadComponent={() => import(/* webpackChunkName: "teacher-qa" */ './routes/qa')} />
              <Route exact path={`/class`} loadComponent={() => import(/* webpackChunkName: "teacher-class" */ './routes/class')} />
              <Route exact path={`/curriculum`} loadComponent={() => import(/* webpackChunkName: "teacher-curriculum" */ './routes/curriculum')} />
              <Route path={`/course`} loadComponent={() => import(/* webpackChunkName: "teacher-course" */ './routes/course')} />
              <Redirect to={`/message`} />
            </Switch>
          </Main>
        </Layout>
      </WaitMenusFetched>
    </App>
  )
}
