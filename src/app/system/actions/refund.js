import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import Alert from 'common/alert'
const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemRefundList
})

export default {
  ...baseActions,
  refundAudit: (value, modalName) => {
    return dispatch => {
      api.systemRefundAudit(value).then(() => {
        Alert.success('添加成功');
        dispatch(baseActions.hideModal(modalName));
        dispatch(baseActions.getPage({ page: '1' }));
      })
    }
  },
  refundAck: (value) => {
    return dispatch => {
      api.systemRefundAck(value).then(() => {
        Alert.success('添加成功');
        dispatch(baseActions.hideModal('confirm'));
        dispatch(baseActions.getPage({ page: '1' }));
      })
    }
  }
}
