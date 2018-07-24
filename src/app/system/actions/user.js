import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemUserList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemUser', baseActions),
  editMemo: (data) => {
    return dispatch => {
      api.systemUserMemoUpdate(data).then(() => {
        Alert.success("修改成功");
        // clearRelatedCache(name);
        dispatch(baseActions.getPage());
      })
    }
  },
  freeze: (user_id) => {
    return dispatch => {
      api.systemUserUpdate({ status: 2, user_id })
        .then(() => {
          dispatch(baseActions.getPage())
          Alert.success("冻结成功");
        })
    }
  },
  unfreeze: (user_id) => {
    return dispatch => {
      api.systemUserUpdate({ status: 1, user_id: user_id })
        .then(() => dispatch(baseActions.getPage()))
        Alert.success("解冻成功");
    }
  }

}
