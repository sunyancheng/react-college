import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./list')} />
    <Route exact path={`${match.path}/create`} loadComponent={() => require('./create')} />
    <Route exact path={`${match.path}/edit/:id`} loadComponent={() => require('./edit')} />
  </Switch>
)
