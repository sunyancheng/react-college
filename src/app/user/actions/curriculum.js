import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import moment from 'moment';
const baseActions = createPageActions({
  initState: {
    tdate: moment()
  },
  getListApi: api.userCurriculumList
})

module.exports = {
  ...baseActions,
}
