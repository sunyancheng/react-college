import {
  createPageActions
} from 'common/page/create-page-actions'
import {
  api,
  cachedApi
} from 'admin/api'
import createCRUDActions from 'common/page/create-crud-actions'

const baseActions = createPageActions({
  initState: {
    criteria: {
    }
  },
  getListApi: api.adminLessonList
})

module.exports = {
  ...baseActions,
  ...createCRUDActions('adminLesson', baseActions, 'getList', api, cachedApi),
}
