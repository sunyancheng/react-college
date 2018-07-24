export const deviceType = () => {
  const ua = navigator.userAgent
  const agent = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
  return agent.some(a => ua.indexOf(a) > 0)
}

export const isWeixin = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}

export const isAlipay = () => {
  return navigator.userAgent.match(/Alipay/i)
}

export const isQQ = () => {
  return navigator.userAgent.match(/QQ\//i)
}

export const isMobile = () => {
  return deviceType() || isWeixin() || isAlipay()
}

export const isInsertNavigator = () => {
  return isWeixin() || isAlipay() || isQQ()
}

export const WAITING_PAY = '3'
export const HAVE_PAY = '1'

export const PHASE_STATE = {
  'CHOOSE': 1,
  'BUY': 2,
  'RESULT': 3
}
