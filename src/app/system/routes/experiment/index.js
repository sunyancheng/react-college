import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./list')} />
    <Route exact path={`${match.path}/topo/:id`} loadComponent={() => require('./topo')} />
    <Route exact path={`${match.path}/test/:id`} loadComponent={() => require('./test')} />
  </Switch>
)
