import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemCenterList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemCenter', baseActions),
  editMemo: (data) => {
    return dispatch => {
      api.systemCenterMemoUpdate(data).then(() => {
        Alert.success("修改成功");
        // clearRelatedCache(name);
        dispatch(baseActions.getPage());
      })
    }
  },
  updateCenterMajor: ({campus_id, major_id}) => {
    return dispatch => {
      const majorid = major_id.join(',')
      api.systemCenterAuditUpdate({campus_id, major_ids: majorid})
        .then(() => {
          Alert.success('操作成功')
          dispatch(baseActions.getPage())
          dispatch(baseActions.hideModal('audit'))
        })
    }
  }
}
