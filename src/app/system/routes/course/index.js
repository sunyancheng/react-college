import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./course')} />
    <Route exact path={`${match.path}/link/:course_id`} loadComponent={() => require('./link')} />
  </Switch>
)
