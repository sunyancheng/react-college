import Base from 'common/base'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from 'common/icon'
import './style.less'
export default (class Sider extends Base {
  state = {}

  componentDidMount() {
    this.toggleGroup(this.props)
  }

  componentWillReceiveProps = (props) => {
    this.toggleGroup(props)
  }

  toggleGroup(props) {
    const { menus, location } = props
    const isParentMenu = (menu) => {
      let splitMenus = menu.url.split('/')
      let splitPaths = location.pathname.split('/')
      return splitMenus.every((m, i) => splitPaths[i] === m)
    }
    const isGroupActive = (menus) => {
      menus = [].concat(menus).filter(v => !!v)
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        // console.log(menu.url, isParentMenu(menu), isGroupActive(menu.children))
        if ((menu.url && isParentMenu(menu) || isGroupActive(menu.children))) {
          return true
        }
      }
      return false
    }
    menus.forEach((group, i) => {
      const scrollToPosition = () => {
        this.refs.me.scrollTop = i * 50
      }
      if (isGroupActive(group)) {
        this.setState({ activeGroup: group.name }, scrollToPosition)
      }
    })
  }

  renderMenus(menus) {
    return menus.map(this.renderMenu.bind(this));
  }

  handleClickGroup(item) {
    if (this.state.activeGroup === item.name) {
      return this.setState({ activeGroup: null });
    }
    const { menus } = this.props;
    this.setState({ activeGroup: item.name }, () => {
      const ref = this.refs.me;
      const menuBottom = menus.indexOf(item) * 50 + 80;
      const childrenHeight = item.children.length * 50
      const contentHeight = ref.clientHeight
      const minScroll = menuBottom + childrenHeight - contentHeight;
      if (minScroll > 0 && ref.scrollTop < minScroll) {
        ref.scrollTop = minScroll;
      }
    });
  }

  renderMenu(item, i) {

    if (item.url) {
      return (
        <NavLink key={i}
          className="admin-sider-menu"
          to={item.url}
          activeClassName={'active-menu'}
        >
          <Icon type={item.icon} />
          {item.name}
        </NavLink>
      )
    }
    const isActive = this.state.activeGroup === item.name;
    const hasChildren = item.children && !!item.children.length
    return (
      <div key={i}>
        <div className="admin-sider-menu" onClick={() => this.handleClickGroup(item)}>
          <Icon type={item.icon} />
          <span>{item.name}</span>
          <Icon type="arrow-down" className={isActive ? ' flip-me' : ''} />
        </div>
        {hasChildren &&
          <div className="admin-sider-group"
            style={{ height: (isActive ? item.children.length * 50 : 0) }}
          >
            {this.renderMenus(item.children)}
          </div>
        }
      </div >
    );
  }

  render() {
    const { menus } = this.props;
    return (
      <div className="admin-sider" ref="me">
        <div className="admin-sider-wrapper">
          {this.props.header}
          {this.renderMenus(menus)}
        </div>
      </div>
    )
  }
}).connect(state => ({ menus: state.app.menus })).withRouter();

