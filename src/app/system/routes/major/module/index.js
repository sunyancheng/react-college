import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./module')} />
    <Route exact path={`${match.path}/course/:module_id`} loadComponent={() => require('./course')} />
  </Switch>
)
