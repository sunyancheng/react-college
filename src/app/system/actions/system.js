import { setAppState } from 'common/app/app-actions'
import api from 'common/api'

module.exports = {
  setMessageNumber() {
    return (dispatch) => {
      api.getMyNoreadNotice().then(({count}) => dispatch(setAppState({messageNum: count})))
    }
  }
}
