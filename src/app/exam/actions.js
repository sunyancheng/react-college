// import api from 'common/api'
import { SET_EXAM_STATE } from 'exam/store/reducers'

export default {
  startExperiment: (data) => {
    return dispatch => {
      dispatch({ type: SET_EXAM_STATE, data })
    }
  },
  setDuration: (data) => {
    return dispatch => {
      dispatch({type: SET_EXAM_STATE, data})
    }
  }
}
