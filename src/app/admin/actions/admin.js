import { setAppState } from 'common/app/app-actions'
import api from 'admin/api'

module.exports = {
  setCampusId(campus_id) {
    return dispatch => {
      window.localStorage.setItem('campus_id', campus_id)
      dispatch(setAppState({ campus_id }))
      api.adminNoreadNotice({ campus_id }).then(({ count }) => dispatch(setAppState({ messageNum: count })))
    }
  },
  setCampusList(campusList) {
    return dispatch => {
      let campus_id = window.localStorage.getItem('campus_id')
      if (campusList && campusList.length > 0) {
        if (!campus_id || !campusList.find(i => i.campus_id === campus_id)) {
          campus_id = campusList[0].campus_id
          window.localStorage.setItem('campus_id', campus_id)
        }
      }
      dispatch(setAppState({ campus_id, campusList }))
    }
  },
  setMessageNumber() {
    return (dispatch, getState) => {
      const { campus_id } = getState().app
      api.adminNoreadNotice({ campus_id }).then(({ count }) => dispatch(setAppState({ messageNum: count })))
    }
  }
}
