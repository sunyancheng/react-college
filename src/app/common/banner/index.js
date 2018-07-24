import React from 'react'
import Icon from 'common/icon'
import './style.less'
import Base from 'common/base'

export default (class extends Base {

  goToPay = () => {
    window.open('https://static.meiqia.com/dist/standalone.html?_=t&eid=101057', 'chat', 'height=600,width=800,top=50,left=200,status=yes,toolbar=no,menubar=no,resizable=yes,scrollbars=no,location=no,titlebar=no')
  }

  render() {
    const { theme, slogan } = this.props
    const { nick_name, avatar, } = this.props.userInfo
    return (
      <div className={`banner-wrapper ${theme}`}>
        <div className="banner-left">
          <div className="banner-avatar" style={{ backgroundImage: 'url("' + avatar + '")' }} />
          <div className="banner-desc">
            <div className="banner-desc-name">
              {nick_name} 你好！
            </div>
            <div className="banner-desc-detail">
              {theme === 'register' ? <div className="banner-desc-detail-brand">普通用户</div> : <div className={`banner-desc-detail-brand ${theme}`} />}
            </div>
          </div>
        </div>
        <div className="banner-right">
          <div className={`banner-slogan ${theme}`}>
            <Icon className="banner-slogan-quotes-left" type="quotes-1" />
            <span className="banner-slogan-detail">{slogan}</span>
            <Icon className="banner-slogan-quotes-right" type="quotes-2" />
          </div>
          {theme === 'register' && <div onClick={this.goToPay} className="upgrade"/>}
        </div>
      </div>
    )
  }
}).connect(state => {
  const { userInfo } = state.app
  return {
    userInfo
  }
})
