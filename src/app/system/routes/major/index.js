import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./major')} />
    <Route path={`${match.path}/module/:major_id`} loadComponent={() => require('./module')} />
  </Switch>
)
