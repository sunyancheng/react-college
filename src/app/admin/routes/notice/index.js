import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact key="list" path={`${match.path}`} loadComponent={() => require('./notice')} />
    <Route exact key="edit" path={`${match.path}/edit/:notice_id`} loadComponent={() => require('./add-or-edit')} />
    <Route exact key="add" path={`${match.path}/add`} loadComponent={() => require('./add-or-edit')} />
    <Route exact key="check" path={`${match.path}/check/:notice_id`} loadComponent={() => require('./check')} />
  </Switch>
)

