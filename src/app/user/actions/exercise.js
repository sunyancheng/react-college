import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
const baseActions = createPageActions({
  initState: {},
  getListApi: api.getStudentExerciseList
})

module.exports = {
  ...baseActions,
}
