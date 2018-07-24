import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemExerciseRecordList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemExerciseRecord', baseActions),
  getOneStudentExam: (user_resource_id) => {
    return api.systemExerciseRecordCheck({user_resource_id})
  }
}
