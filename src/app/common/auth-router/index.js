const Switch = require('./switch')
import { Redirect, NavLink, Link } from 'react-router-dom'
const { AuthRoute, setRouterEnterResolver } = require('./route')

module.exports = {
  Switch, Route: AuthRoute, setRouterEnterResolver, Redirect, NavLink, Link
}