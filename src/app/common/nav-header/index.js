import React from 'react'
import Base from 'common/base'
import './style.less';
import { NavLink } from 'react-router-dom';
import Logo from 'common/logo'
import UserInfo from 'common/user-info'

const href = location.protocol + `//${location.hostname.replace('admin.','')}`
export default (class extends Base {
  render() {
    const nav = this.props.menus
    return (
      <header className="user-header">
        <Logo onClick={() => window.open(href)} platform={this.props.platform} />
        <div className="user-header-right">
          <div className="user-header-right-avatar">
            {this.props.extra}
            <UserInfo />
          </div>
          <div className="user-header-right-menu">
            {nav.map((item, key) =>
              <NavLink
                key={key}
                to={item.url}
                activeClassName="user-header-choosen"
              >
                <span className="user-header-item">{item.name}</span>
              </NavLink>
            )}
          </div>
        </div>
      </header>
    )
  }
})
