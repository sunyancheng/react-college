import React from 'react'
import Base from 'common/base'
import './style.less'
import Logo from 'common/logo'
import UserInfo from 'common/user-info'

const href = location.protocol + `//${location.hostname.replace('admin.','')}`
class Header extends Base {
  static defaultProps = {
    platform: '管理平台'
  }
  render() {
    return (
      <header className="admin-header">
        <Logo onClick={() => window.open(href)} lighter platform={this.props.platform} />
        <UserInfo />
        {this.props.extra}
      </header>
    )
  }
}

export default Header.withRouter()
