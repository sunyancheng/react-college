import { SET_APP_STATE } from 'common/action-types'
import { login, logout } from './quc'

const actions = {
  setAppState(state) {
    return { type: SET_APP_STATE, state }
  },
  login() {
    return dispatch => {
      login().then(userInfo => {
        let { freeze } = userInfo || {}
        dispatch(actions.setAppState(!freeze ? { userInfo, isLogin: true, isFreeze: false } : { isLogin: false, isFreeze: true }))
      }, () => {})
    }
  },
  logout() {
    return logout
  },
  updateUserDetail(detail) {
    return (dispatch, getState) => {
      dispatch(actions.setAppState({ userInfo: { ...getState().app.userInfo, ...detail } }))
    }
  }
}
module.exports = actions
