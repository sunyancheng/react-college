import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import { isStudentThen } from 'user/store'

const baseActions = createPageActions({
  initState: {},
  getListApi: isStudentThen(api.getStudentOrderList, api.getUserOrderList)
})

module.exports = {
  ...baseActions
}
