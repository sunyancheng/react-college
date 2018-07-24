import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
// import api from 'common/api'
// import Alert from 'common/alert'
const baseActions = createPageActions({
  initState: {},
})

export default {
  ...baseActions,
  ...createCRUDActions('experimentHome', baseActions),
  changeStatus: (data) => {
    return (dispatch) => {
      dispatch({ type: 'CHANGE_EXPERIMENT_STATUS', data })
    }
  },
  setDuration: (data) => {
    return dispatch => {
      dispatch({type: 'SET_EXPERIMENT_STATE', data})
    }
  },
  addDuration: (data) => {
    return dispatch => {
      dispatch({type: 'ADD_EXPERIMENT_DURATION', data})
    }
  }
  // start: (data) => {
  //   return (dispatch) => {
  //     api.experimentStart(data).then(() =>
  //       Alert.info('实验创建中')
  //     )
  //   }
  // },
}
