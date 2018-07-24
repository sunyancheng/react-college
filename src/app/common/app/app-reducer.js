import {
  SET_APP_STATE
} from 'common/action-types'
export default function(state = { userInfo: {}, teacherInfo: {} }, action) {
  switch (action.type) {
    case SET_APP_STATE:
      return { ...state, ...action.state }
    default:
      return state
  }
}
