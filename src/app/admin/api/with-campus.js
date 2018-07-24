
import store from 'admin/store'
export default function(api) {
  const apiWithCampus = Object.keys(api).reduce((obj, method) => {
    obj[method] = function (criteria) {
      var { campus_id } = store.getState().app
      return api[method]({ campus_id, ...criteria })
    }
    return obj
  }, {})
  return apiWithCampus
}