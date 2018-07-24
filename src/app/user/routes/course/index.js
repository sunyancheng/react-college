import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./course')} />
    <Route exact path={`${match.path}/detail/:id`} loadComponent={() => require('user/routes/major/course')} />
  </Switch>
)
