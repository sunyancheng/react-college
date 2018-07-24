import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NoMatch from 'common/no-match'

module.exports = class extends React.Component {
  render() {
    const { children } = this.props
    return (
      <Switch>
        {children}
        <Route component={(NoMatch)} />
      </Switch>
    )
  }
}
