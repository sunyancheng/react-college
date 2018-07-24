import { setAppState } from 'common/app/app-actions'
import api, {cachedApi} from 'common/api'

module.exports = {
  setMessageNumber() {
    return dispatch => {
      api.teacherGetNoReadNotice().then(({count}) => dispatch(setAppState({messageNum: count})))
    }
  },
  getTeacherInfo() {
    return dispatch => {
      cachedApi.getTeacherInfo().then(teacherInfo => dispatch(setAppState({teacherInfo})))
    }
  }
}
