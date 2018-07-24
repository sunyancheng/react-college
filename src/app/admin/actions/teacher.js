import { createPageActions } from 'common/page/create-page-actions'
import api from 'admin/api'

const baseActions = createPageActions({
  initState: { criteria: {} },
  getListApi: api.adminTeacherList
})

module.exports = {
  ...baseActions
}
