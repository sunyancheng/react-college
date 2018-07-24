import reqwest from 'reqwest'
import { baseURL } from './config'
import Alert from 'common/alert'
import quc from 'common/app/quc'


function notAllowed(url) {
  window.location.href = url
  return null
}

export default (path, data = {}, method = 'get', processData = true, type = "json") => {
  return new Promise((resolve, reject) => {
    reqwest({
      url: baseURL + path,
      method,
      data,
      processData: processData,
      type,
      crossOrigin: true,
      withCredentials: true
    }).then(resp => {
      if (!processData) {
        resp = JSON.parse(resp.response)
      }
      resp.errno = resp.errno / 1
      // 无权限
      if (resp.errno === 404) {
        window.location.href = '/static/unauth/index.html'
        return
      }
      // 重新登录
      if (resp.errno === 403) {
        console.log('403 logout')
        return quc.logout()
      }

      // 电话不存在，补全电话信息重新登录
      if (resp.errno === 405) {
        console.log('405 logout')
        return quc.logout()
      }
      if (resp.errno === 406) {
        return Promise.reject(notAllowed('/notallowed.html'))
      }
      // 手动处理错误信息
      if (resp.errno >= 600 && resp.errno < 700) {
        return reject(resp)
      }
      // 右上角显示错误
      if (resp.errno !== 0) {
        console.log(resp.errmsg)
        Alert.error(resp.errmsg)
        return reject(resp)
      }

      // 正常
      resolve(resp.data)
    }).catch(resp => {
      console.log(resp, path)
      Alert.error('网络连接异常，请检查网络或稍后再试。')
      reject(resp)
    })
  })
}
