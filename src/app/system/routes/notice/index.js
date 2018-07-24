import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./notice')} />
    <Route exact path={`${match.path}/add`} loadComponent={() => require('./add-or-edit')} />
    <Route exact path={`${match.path}/edit/:notice_id`} loadComponent={() => require('./add-or-edit')} />
    <Route exact path={`${match.path}/view/:notice_id`} loadComponent={() => require('./view')} />
  </Switch>
)
