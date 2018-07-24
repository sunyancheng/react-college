import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import api from 'common/api'
import Alert from 'common/alert'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemMenuList
})

module.exports = {
  ...baseActions,
  ...createCRUDActions('systemMenu', baseActions, 'getList'),
  moveUp(menu_id) {
    return dispatch => {
      Alert.success('上移成功')
      api.systemMenuUpOrder({ menu_id }).then(() => {
        Alert.info('上移成功')
        dispatch(baseActions.getList())
      })
    }
  },
  moveDown(menu_id) {
    return dispatch => {
      api.systemMenuDownOrder({ menu_id }).then(() => {
        Alert.info('下移成功')
        dispatch(baseActions.getList())
      })
    }
  }

}