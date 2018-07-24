import "babel-polyfill"
import React from 'react'
import { Switch, Route } from 'common/auth-router'
import App from 'common/app'
import './style.less'
 
export default function System() {
  return (
    <App>
      <Switch>
        <Route path="/pc" loadComponent={() => import('./pc')} />
        <Route path="/m" loadComponent={() => import('./m')} />
      </Switch>
    </App>
  )
}
