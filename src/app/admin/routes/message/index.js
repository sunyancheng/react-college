import React from 'react'
import { Switch, Route } from 'common/auth-router'

export default ({ match }) => (
  <Switch>
    <Route exact key="list" path={`${match.path}`} loadComponent={() => require('./list')} />
    {/* <Route exact key="edit" path={`${match.path}/detail/:notice_id`} loadComponent={() => require('./detail')} /> */}
  </Switch>
)

