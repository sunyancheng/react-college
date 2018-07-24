import actions from 'exam/actions'
import store from 'exam/store'
import {createCountDown} from 'common/time'

const getDuration = () => {
  return store.getState().exam.duration
}

const setDuration = (duration) => {
  store.dispatch(actions.setDuration({ duration }))
}

const ExamCountUp = createCountDown(setDuration, getDuration)

export default ExamCountUp
export const Clock = new ExamCountUp(1000, 9000, 'up')
