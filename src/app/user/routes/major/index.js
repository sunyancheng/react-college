import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./major')} />
    <Route exact path={`${match.path}/course/:id`} loadComponent={() => require('./course')} />
  </Switch>
)
