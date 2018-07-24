import Base from 'common/base'
import React from 'react'
import NavHeader from 'common/nav-header'
import { LayoutFixedWidth } from 'user/components/layout'
import Message from './message-connect'

export default (class extends Base {
  render() {
    const { menus, platform } = this.props
    return <LayoutFixedWidth><NavHeader platform={platform} extra={<Message />} menus={menus} /></LayoutFixedWidth>
  }
}).connect(state => {
  return {
    menus: state.app.menus
  }
}).withRouter()
