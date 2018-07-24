import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'

const baseActions = createPageActions({
  initState: {},
  getListApi: () => {}
})

export default {
  ...baseActions,
  ...createCRUDActions('courseLink', baseActions)
}
