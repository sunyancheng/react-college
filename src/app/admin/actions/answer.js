import { createPageActions } from 'common/page/create-page-actions'
import { api } from 'admin/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemDeanAnswerList
})

module.exports = {
  ...baseActions
}
