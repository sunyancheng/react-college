import {
  createPageActions
} from 'common/page/create-page-actions'
import {
  api,
  cachedApi
} from 'admin/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {
    criteria: {}
  },
  getListApi: api.adminClassList
})

module.exports = {
  ...baseActions,
  ...createCRUDActions('adminClass', baseActions, 'getPage', api, cachedApi),
  progressUpdate(data) {
    return dispatch => {
      api.adminClassProgressUpdate(data).then(() => {
        Alert.success("进度修改成功");
        dispatch(baseActions.hideModal('progress'));
        dispatch(baseActions['getList']());
      })
    }
  },
}
