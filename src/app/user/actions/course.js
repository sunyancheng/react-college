import { setAppState } from 'common/app/app-actions'
import api from 'common/api'
import { isStudentThen } from 'user/store'

module.exports = {
  getLearnList: () => {
    return dispatch => {
      isStudentThen(api.getStudentListLearn, api.getUserListLearn)()
        .then(list_learn => dispatch(setAppState({ list_learn })))
    }
  }
}
