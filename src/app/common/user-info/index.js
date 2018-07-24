import React from 'react'
import Base from 'common/base'
import { Avatar, Menu, Dropdown, Icon } from 'antd'
import './style.less'
import { logout } from 'common/app/app-actions'

export default (class extends Base {

  menus = [
    {
      role: '1', name: '学习平台', href: '/user'
    }, {
      role: '4', name: '教学平台', href: '/teacher'
    }, {
      role: '8', name: '教务平台', href: '/admin'
    }, {
      role: '16', name: '管理平台', href: '/system'
    },
  ]
  getMenus = () => <Menu>
    {
      this.menus
        .filter(menu => (this.props.userInfo.role || []).join(',').indexOf(menu.role) > -1)
        .map((item, key) => <Menu.Item key={key}><a href={item.href}>{item.name}</a></Menu.Item>)
    }
    <Menu.Item><a onClick={() => this.dispatch(logout())}>退出</a></Menu.Item>
  </Menu>


  render() {
    const userInfo = this.props.userInfo
    return (
      <div className="user-info" ref="me">
        <Dropdown overlay={this.getMenus()} trigger={['click']} getPopupContainer={() => this.refs.me}
          placement="bottomRight"
        >
          <span>
            <Avatar size="small" src={userInfo.avatar} icon="user" />
            <span className="nick-name-content">{userInfo.nick_name}</span>
            <Icon type="down" />
          </span>
        </Dropdown>
      </div>
    )
  }
}).connect(state => ({ userInfo: state.app.userInfo }))
