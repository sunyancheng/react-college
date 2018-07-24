import Base from 'common/base'
import React from 'react'
import { setAppState } from 'common/app/app-actions'
import NoAuth from 'common/no-auth'
export default (class extends Base {
  getMenuMap(menus, map = {}) {
    if (!menus) return
    menus.forEach(m => {
      if (m.url) map[m.url] = true
      this.getMenuMap(m.children, map)
    })
    return map
  }
  componentDidMount() {
    Promise.resolve(this.props.getMenus()).then(menus => {
      this.dispatch(setAppState({
        menus,
        menuMap: this.getMenuMap(menus)
      }))
    })
  }
  render() {
    const { menus, children } = this.props
    if (!menus) return null
    if (menus.length === 0) return <NoAuth />
    return children
  }
}).connect(state => ({ menus: state.app.menus })).withRouter()
