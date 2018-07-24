import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';
const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemStudentList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemStudent', baseActions),
  audit(data) {
    return dispatch => {
      api.systemStudentAudit(data).then(() => {
        Alert.success('审核成功');
        dispatch(baseActions.hideModal('audit'));
        dispatch(baseActions['getPage']());
      })
    }
  },
}