import React from 'react'
import Base from 'common/base'
import { Link } from 'react-router-dom'
import './style.less'
export default (class extends Base {
  recursive(menus, breadcrumb = []) {
    if (!menus) return
    const { match } = this.props
    const path = match.path;
    const isParentMenu = (menu)=>{
      let splitMenus = menu.url.split('/')
      let splitPaths = path.split('/')
      return splitMenus.every((m, i)=>splitPaths[i] === m)
    }
    [].concat(menus).forEach(m => {
      if (m.url && isParentMenu(m)) {
        m.to = m.url
        Object.keys(match.params).forEach(name => m.to = m.to.replace(':' + name, match.params[name]))
        breadcrumb.push(m)
      }
      this.recursive(m.children, breadcrumb)
    })
    return breadcrumb
  }
  render() {
    const matchs = this.recursive(this.props.menus)
    return (
      <span>
        {(matchs || []).map((item, i) =>
          i !== (matchs.length - 1) ?
            (<Link key={i} to={item.to} className="breadcrumb-pre">{item.name}</Link>) :
            (<span key={i}>{item.name}</span>)
        )}
      </span>
    )
  }
}).connect(state => ({ menus: state.app.menus })).withRouter()
