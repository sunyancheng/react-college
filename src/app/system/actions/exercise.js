import { createPageActions } from 'common/page/create-page-actions'
import createCRUDActions from 'common/page/create-crud-actions'
import api from 'common/api'

const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemExerciseList
})

export default {
  ...baseActions,
  ...createCRUDActions('systemExercise', baseActions),
  isIdValid: (ids) => {
    return api.systemExerciseIsIdValid({ids})
      .then(data => {
        const obj = {}
        data.forEach(item => obj[item.exam_pool_id] = item)
        return obj
      })
  }
}
