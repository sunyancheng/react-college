import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
// import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemMajorList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemMajor', baseActions)
}
