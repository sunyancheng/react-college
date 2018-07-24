import React from 'react'
import Base from 'common/base'
import './style.less'

class ContentHeader extends Base {
  render() {
    return (
      <header className="content-header">
        <div className="content-header-title">用户列表</div>
        <div className="content-header-btn">{this.props.buttons}</div>
      </header>
    )
  }
}

export default ContentHeader
