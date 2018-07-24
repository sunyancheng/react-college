import { createPageActions } from 'common/page/create-page-actions'
import api from 'admin/api'
import admin from 'admin/actions/admin'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.adminMessageList
})

module.exports = {
  ...baseActions,
  setRead: (item) => {
    return (dispatch, getState) => {
      const list  = getState().page.list.slice()
      list.find(v=>v.notice_id === item.notice_id).show = '0'
      dispatch(baseActions.setPageState({list}))
    }
  },
  setMessageNumber: admin.setMessageNumber
}
