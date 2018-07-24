import "babel-polyfill"
import 'common/style'
import React from 'react';
import Helmet from 'react-helmet';
import App from 'common/app'
import { Layout, Main } from 'common/layout'
import Header from 'exam/component/header'
import { Switch, Route, setRouterEnterResolver } from 'common/auth-router'

setRouterEnterResolver(function () {
  return Promise.resolve()
})

export default function () {
  return (
    <App style={{ width: '1200px', height: '100%', margin: '0 auto' }}>
      <Helmet>
        <title>360网络安全学院-练习打榜台</title>
      </Helmet>
      <Layout>
        <Header />
        <Main>
          <Switch>
            <Route exact path={`/home/student/:cid/:rid`} loadComponent={() => require('./routes/exam/user-exam')} />
            <Route exact path={`/home/teacher/:cid/:rid`} loadComponent={() => require('./routes/exam/teacher-exam')} />
          </Switch>
        </Main>
      </Layout>
    </App>
  )
}
