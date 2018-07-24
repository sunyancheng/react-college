import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.userCourseQAList
})

module.exports = {
  ...baseActions,
  addQA(data) {
    return dispatch => {
      api.userCourseQACreate(data).then(() => {
        Alert.success("提问成功")
        dispatch(baseActions['getList'](data))
      })
    }
  },
  setLoading(status) {
    return dispatch => {
      dispatch(baseActions.setPageState({resourceLoading: status}))
    }
  }
}
