import { createPageActions } from 'common/page/create-page-actions'
import { setAppState } from 'common/app/app-actions'
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.teacherMessageList
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
  setMessageNumber: () => {
    return dispatch => {
      api.teacherGetNoReadNotice().then(({count}) => dispatch(setAppState({messageNum: count})))
    }
  }
}
