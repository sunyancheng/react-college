import { combineReducers } from 'redux'
import app from 'common/app/app-reducer'
import page from 'common/page/page-reducer'

export const SET_EXAM_STATE = "SET_EXAM_STATE"

const initialState = {
  status: false,
  hasSubmit: false,
  done: false,
  list: [],
  duration: 0
}

export default combineReducers({
  app,
  page,
  exam: (state = initialState, action) => {
    switch (action.type) {
      case SET_EXAM_STATE: {
        return { ...state, ...action.data }
      }
      default:
        return state
    }
  }
})
