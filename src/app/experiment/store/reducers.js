import { combineReducers } from 'redux'
import app from 'common/app/app-reducer'
import page from 'common/page/page-reducer'
// const initialState = {
//   time_left: 9000
// }
export default combineReducers({
  app,
  page,
  experiment: function(state = { status: 'ready' }, action) {
    switch (action.type) {
      case 'CHANGE_EXPERIMENT_STATUS':
        return { ...state, status: action.data }
      case 'SET_EXPERIMENT_STATE': {
        return { ...state, ...action.data }
      }
      case 'ADD_EXPERIMENT_DURATION':
        return { ...state, time_left: (parseInt(state.time_left) || 0) + (parseInt(action.data) || 0) }
      default:
        return state
    }
  }
})
