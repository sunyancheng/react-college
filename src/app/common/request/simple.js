import reqwest from 'reqwest'
import { baseURL } from 'common/request/config'

module.exports = function (path, data = {}) {
  return new Promise((resolve, reject) => {
    reqwest({
      url: baseURL + path,
      method: 'post',
      type: 'json',
      data,
      crossOrigin: true,
      withCredentials: true
    }).then(resp => {
      resolve({ errno: resp.errno, userInfo: resp.data.userinfo })
    }).catch(resp => {
      console.log(resp, path)
      reject(resp)
    })
  })
}