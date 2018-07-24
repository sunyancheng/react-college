import React from 'react'
import {
  Switch,
  Route,
  Redirect
} from 'common/auth-router'

export default ({match}) => (
  <Switch>
    <Route exact path={`${match.path}`} loadComponent={() => require('./list')}/>
    <Route exact path={`${match.path}/manage/:id`} loadComponent={() => require('./manage')}/>
    <Redirect to={`${match.path}`} />
  </Switch>
)
