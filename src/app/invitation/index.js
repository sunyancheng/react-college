import quc from 'common/app/quc'
import request from 'common/request/simple'

const pathname = window.location.pathname

function renderUserInfo(userInfo) {
  var a =
    `
  <div style="text-align: center; margin: 0 auto">
  <img style="margin: 0 auto; display: block;border-radius: 50%;max-width: 65%;" src="${(userInfo.avatar || '').replace('48_48', '300_300')}"/>
  <div>昵称：${userInfo.nick_name}</div>
  <div>邀请注册成功! </div>'
  </div>
`
  return a
}
function doInvitation() {
  if (!/^\/invitation\/[0-9]+$/.test(pathname)) {
    return Promise.reject()
  }
  const code = window.location.pathname.replace('/invitation/', '')

  return quc.login().then(userInfo => {
    return request('/misc/invitation/user/invitation/invited', { code })
      .then(() => renderUserInfo(userInfo, code))
  })
}

doInvitation().catch(() => '<div>邀请注册失败!</div>').then(info => document.body.innerHTML = info)


