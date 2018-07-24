import { createPageActions } from 'common/page/create-page-actions'
import api from 'common/api'
import Alert from 'common/alert'
const baseActions = createPageActions({
  initState: {},
  getListApi: api.teacherQAList
})

module.exports = {
  ...baseActions,
    addQA(data) {
      return dispatch => {
        api.userCourseQACreate(data).then(() => {
          Alert.success("提问成功");
          dispatch(baseActions['getPage'](data));
        })
      }
    },
    answerQA(data) {
      return dispatch => {
        api.teacherQAAnswer(data).then(() => {
          Alert.success("答疑成功");
          dispatch(baseActions.hideModal('answer'))
          dispatch(baseActions['getPage']());
        })
      }
    }
}
