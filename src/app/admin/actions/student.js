import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import { api, cachedApi } from 'admin/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.adminStudentList
})

module.exports = {
  ...baseActions,
  ...createCRUDActions('userStudent', baseActions, 'getPage', api, cachedApi)
}
