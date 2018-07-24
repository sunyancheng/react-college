import Base from 'common/base'
import React from 'react'
import { setCampusList } from 'admin/actions/admin'
import api from 'admin/api'
import { isAdmin } from 'admin/store'
export default (class extends Base {
  componentDidMount() {
    if (!isAdmin()) {
      return this.dispatch(setCampusList([]))
    }
    api.adminMyCampusList().then(campusList => {
      this.dispatch(setCampusList(campusList))
    })
  }
  render() {
    const { children, campusList } = this.props
    if (campusList === undefined) return null
    if (campusList && campusList.length === 0) return (<h3>你没有任何中心的权限，请联系管理员配置。</h3>)
    return children
  }
}).connect(state => ({ campusList: state.app.campusList }))