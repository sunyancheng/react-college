import "babel-polyfill"
import React from 'react';
import App from 'common/app'
import { Switch, Route } from 'common/auth-router'

export default function () {
  return (
    <App style={{}}>
      <Switch>
        <Route exact path={`/:r/:c/:s/:u/:role/:role_type`} loadComponent={() => require('./routes/home')} />
      </Switch>
    </App>
  )
}
