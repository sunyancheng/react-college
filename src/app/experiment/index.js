import "babel-polyfill"
import 'common/style'
import React from 'react';
import Helmet from 'react-helmet';
import App from 'common/app'
import { Layout, Main } from 'common/layout'
import Header from 'experiment/component/header'
import { Switch, Route } from 'common/auth-router'

export default function () {
  return (
    <App>
      <Helmet>
        <title>360网络安全学院-实验打榜台</title>
      </Helmet>
      <Layout>
        <Header />
        <Main style={{ display: 'flex' }}>
          <Switch>
            <Route exact path={`/home/:roleId/:cid/:rid`} loadComponent={() => require('./routes/home')} />
            {/* <Redirect to={`/home`} /> */}
          </Switch>
        </Main>
      </Layout>
    </App>
  )
}
