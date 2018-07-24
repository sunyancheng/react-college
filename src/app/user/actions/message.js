import { createPageActions } from 'common/page/create-page-actions'
import { setAppState } from 'common/app/app-actions'
import api from 'common/api'
import { isStudentThen } from 'user/store'

const baseActions = createPageActions({
  initState: {},
  getListApi: isStudentThen(api.studentMessageList, api.userMessageList)
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
      isStudentThen(api.studentGetNoReadNotice, api.userGetNoReadNotice)()
        .then(({count}) => dispatch(setAppState({messageNum: count})))
    }
  }
}
