import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./course-list')} />
    <Route exact path={`${match.path}/detail/:id`} loadComponent={() => require('./course-detail')} />
  </Switch>
)
