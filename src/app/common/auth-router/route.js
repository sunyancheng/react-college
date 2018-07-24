import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from 'common/loading'
import autoUpdate from './auto-update'
import PropTypes from 'prop-types'

var routerEnterResolver = () => Promise.resolve()

const getComponent = c => (c.__esModule ? c.default : c)

export class AuthRoute extends React.Component {
  static propTypes = {
    loadComponent: PropTypes.func.isRequired
  }

  render() {
    const { loadComponent, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props =>
          React.createElement(Loadable({
            loader: () => autoUpdate().then(() => Promise.resolve(routerEnterResolver(props)))
              .then(() => Promise.resolve(loadComponent(props)).then(getComponent))
              .catch(getComponent),
            loading: Loading,
            render(Componet) {
              return <Componet {...props} />
            }
          }), null)
        }
      />
    )
  }
}

export const setRouterEnterResolver = function (resolver) {
  routerEnterResolver = resolver;
}


