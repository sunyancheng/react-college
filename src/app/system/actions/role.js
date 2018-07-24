import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemManageRoleList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemManageRole', baseActions)
}