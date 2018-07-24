import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemTeacherList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemTeacher', baseActions),
  assignCampus ({ teacher_id, campus_ids }) {
    return dispatch => {
      api.systemTeacherAssignCamp({ teacher_id, campus_ids }).then(() => {
        Alert.success('操作成功');
        dispatch(baseActions.hideModal('campus'))
        dispatch(baseActions.getPage())
      })
    }
  },
  assignCourse ({ teacher_id, auth_ids }) {
    return dispatch => {
      api.systemTeacherAssignCourse({ teacher_id, auth_ids }).then(() => {
        Alert.success('操作成功');
        dispatch(baseActions.hideModal('course'))
        dispatch(baseActions.getPage())
      })
    }
  }
}
