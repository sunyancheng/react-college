import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemDeanList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemDean', baseActions),
  assignCampus ({ user_dean_id, campus_ids }) {
    return dispatch => {
      api.systemDeanAssignCamp({ user_dean_id, campus_ids }).then(() => {
        Alert.success('操作成功');
        dispatch(baseActions.hideModal('campus'))
        dispatch(baseActions.getPage())
      })
    }
  }
}
