import "babel-polyfill"
import 'common/style'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout, Main } from 'common/layout'
import Header from 'system/components/header'
import Sider from 'common/sider'
import { Switch, Route, setRouterEnterResolver, Redirect } from 'common/auth-router'
import App from 'common/app'
import CampusSelect from 'admin/components/campus-select'
import CampusAuthValidation from 'admin/components/campus-auth-validation'
import CampusChangeReload from 'admin/components/campus-change-reload'
import MessageFetch from './message-connect'
import actions from 'admin/actions/admin'
import store, { isAdmin } from './store'
import throttle from 'lodash/throttle'
import WaitMenusFetched from 'common/wait-menus-fetched'
import 'system/common-used-modules'

const MENUS = [
  { name: '消息通知', url: '/message', icon: 'message' },
  { name: '老师管理', url: '/teacher', icon: 'teacher' },
  {
    name: '班级管理', url: '/class', icon: 'centre', children: [{
      name: '排课', url: '/class/manage/:id'
    }
    ]
  },
  {
    name: '学员管理', url: '/student', icon: 'user', children: [
      { name: '学员报档', url: '/student/create' },
      { name: '修改报档', url: '/student/update/:studentId' }
    ]
  },
  { name: '公告管理', url: '/notice', icon: 'notice', children: [
    { name: '添加公告', url: '/notice/add' },
    { name: '修改公告',url: '/notice/edit/:notice_id' },
    { name: '查看公告', url: '/notice/check/:notice_id' }
  ] },
  {
    name: '问答列表', url: '/answer', icon: 'ask1'
  }
];

const getMessage = throttle(() => store.dispatch(actions.setMessageNumber()), 15000)
setRouterEnterResolver(() => {
  getMessage()
})

export default function System() {
  return (
    <App>
      <Helmet>
        <title>360网络安全学院-教务平台</title>
      </Helmet>
      <WaitMenusFetched getMenus={() => isAdmin() ? MENUS : []}>
        <CampusAuthValidation>
          <Layout>
            <Header extra={<MessageFetch to="/message" />} platform="教务平台" />
            <Main>
              <Main.Sider><Sider header={<CampusSelect />} /></Main.Sider>
              <CampusChangeReload>
                <Main.Content>
                  <Switch>
                    <Route path={`/message`} loadComponent={() => import(/* webpackChunkName: "admin-message" */ './routes/message')} />
                    <Route path={`/teacher`} loadComponent={() => import(/* webpackChunkName: "admin-teacher" */ './routes/teacher')} />
                    <Route path={`/class`} loadComponent={() => import(/* webpackChunkName: "admin-class" */ './routes/class')} />
                    <Route path={`/student`} loadComponent={() => import(/* webpackChunkName: "admin-student" */ './routes/student')} />
                    <Route path={`/notice`} loadComponent={() => import(/* webpackChunkName: "admin-notice" */ './routes/notice')} />
                    <Route path={`/answer`} loadComponent={() => import(/* webpackChunkName: "admin-answer" */ './routes/answer')} />
                    <Redirect to="/message" />
                  </Switch>
                </Main.Content>
              </CampusChangeReload>
            </Main>
          </Layout>
        </CampusAuthValidation>
      </WaitMenusFetched>
    </App>
  )
}
