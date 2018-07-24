import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import { isStudentThen } from 'user/store'

const baseActions = createPageActions({
  initState: {},
  getListApi: isStudentThen(api.getStudentExperimentList, api.getUserExperimentList)
})

module.exports = {
  ...baseActions
}
