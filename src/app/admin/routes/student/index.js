import React from 'react'
import { Switch, Route, Redirect } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./list')} />
    <Route exact path={`${match.path}/create`} loadComponent={() => require('./create')} />
    <Route exact path={`${match.path}/update/:studentId`} loadComponent={() => require('./update')} />
    <Redirect to={`${match.path}`} />
  </Switch>
)