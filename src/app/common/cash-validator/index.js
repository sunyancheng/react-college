export default (rule, value, callback) => {
  const failed = info => {
    callback(info)
  }
  const success = () => {
    callback()
  }
  if (value <= 0) return failed('请填写正确金额')
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return failed('请保留两位小数')
  return success()
}
