import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';
// import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemOrderList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemOrder', baseActions),
  validateUser: async (mobile) => {
    const {userInfo} = await api.systemOrderCheckUser({mobile})
    return userInfo
  },
  onlineRefund: (value) => {
    return dispatch => {
      api.systemOrderOnlineRefund(value).then(() => {
        Alert.success('添加成功');
        dispatch(baseActions.hideModal('refund-2'));
        dispatch(baseActions.getPage({ page: '1' }));
      })
    }
  },
  offlineRefund: (value) => {
    return dispatch => {
      api.systemOrderOfflineRefund(value).then(() => {
        Alert.success('添加成功');
        dispatch(baseActions.hideModal('refund-1'));
        dispatch(baseActions.getPage({ page: '1' }));
      })
    }
  }
}
