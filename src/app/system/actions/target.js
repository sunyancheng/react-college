import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemTargetList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemTarget', baseActions),
}
