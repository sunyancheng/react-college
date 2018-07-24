import { setAppState, updateUserDetail } from 'common/app/app-actions'
import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: Promise.resolve(undefined)
})

module.exports = {
  ...baseActions,
  getStudentDashBoard: () => {
    return dispatch => {
      api.userDashboard().then(data => dispatch(setAppState({dashboard: data})))
    }
  },
  getStudentDetail: () => {
    return dispatch => {
      api.userDashboardInfoDetail().then(detail => dispatch(updateUserDetail(detail)))
    }
  },
  getStudentNotice: () => {
    return dispatch => {
      api.userDashboardNotice().then(data => dispatch(setAppState({boardNotice: data})))
    }
  }
}
