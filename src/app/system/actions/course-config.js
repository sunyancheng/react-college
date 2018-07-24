import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemCourseList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemCourse', baseActions),
  getCourseOpts: () => {
    api.systemCourseGetCourseOpts()
    .then((opts) => {
      return opts
    })
  },
  postCourseAudit: (criteria) => {
    return dispatch => {
      api.systemCourseAudit(criteria).then(() => {
        Alert.success('操作成功')
        dispatch(baseActions.hideModal('review'))
        dispatch(baseActions.getPage())
      })
    }
  }
}
