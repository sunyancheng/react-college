import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
// import Alert from 'common/alert';

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemNoticeList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemNotice', baseActions),
  getNoticeDetail: ({ notice_id }) => {
    return api.systemNoticeListDetail({ notice_id: notice_id })
  }
}
