const cache = {}

function cachePromise(fn, name) {
  function cachePromise(criteria) {
    if (!name) throw new Error("cachePromise参数错误：未指定名字")
    cache[name] = cache[name] || {}
    var key = '_' + JSON.stringify(criteria)
    if (!cache[name][key]) {
      cache[name][key] = fn(criteria)
    }
    return cache[name][key]
  }
  cachePromise.clear = function () {
    cache[name] = null
  }
  return cachePromise
}

export default function withCache(api) {
  return Object.keys(api).reduce((obj, method) => {
    obj[method] = cachePromise(api[method], method)
    return obj
  }, {})
}