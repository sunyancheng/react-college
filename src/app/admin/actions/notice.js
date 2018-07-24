import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import api from 'admin/api'
import admin from 'admin/actions/admin'

const baseActions = createPageActions({
  initState: { criteria: {} },
  getListApi: api.adminNoticeList
})

module.exports = {
  ...baseActions,
  ...createCRUDActions('systemNotice', baseActions),
  setMessageNumber: admin.setMessageNumber
}
