import Cookies from 'js-cookie'
import request from 'common/request/simple'
// import { baseURL } from 'common/request/config'

/** HULK 登陆鉴权 Cookie */
const QAuthKey = 'Q'

function qucLogout() {
  return new Promise((resolve, reject) => {
    var timestamp = Date.now().valueOf();
    var jsonpCallback = `cb${timestamp}`;
    var instance, timeoutHandle

    function dispose() {
      instance.remove();
      instance = null;
      delete window[jsonpCallback]
      clearTimeout(timeoutHandle)
    }

    timeoutHandle = setTimeout(() => {
      dispose()
      reject()
    }, 5000);


    window[jsonpCallback] = function (result) {
      dispose()
      resolve(result)
    }

    const src = 'pcw_netsec';
    var script = document.createElement('script');
    script.src = `${location.protocol}//login.xxx.cn/?func=${jsonpCallback}&src=${src}&from=${src}&charset=UTF-8&requestScema=https&o=sso&m=logout&_=${timestamp}`
    instance = document.getElementsByTagName('head')[0].appendChild(script);
  });

}

function _redirect(url) {
  var href = url + encodeURIComponent(window.location.href.replace(/\?.+/, ''))
  window.location.href = href
}
/** 用户登录页地址 */
function qucLogin() {
  _redirect(`https://i.xxx.cn/login?destUrl=`)
  return null
}
function qucBindAccount() {
  _redirect('https://i.xxx.cn/security/secmobile?op=bindMobile&destUrl=')
}

function logout() {
  return request('/transfer/login/logout').then(qucLogout).then(qucLogin)
}

function isQucLogin() {
  return !!Cookies.get(QAuthKey)
}

var loginOnce
module.exports = {
  login: () => {
    if (!isQucLogin()) {
      return Promise.reject(qucLogin())
    }
    if (!loginOnce) {
      loginOnce = request('/transfer/login/quc').then(({ errno, userInfo }) => {
        errno = errno / 1
        // 电话不存在
        if (errno === 405) {
          return qucBindAccount()
        }
        if (errno === 403) {
          return logout()
        }
        return userInfo
      })
    }
    return loginOnce
  },
  logout
}

