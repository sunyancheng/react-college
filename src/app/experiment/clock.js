import actions from 'experiment/actions'
import store from 'experiment/store'
import {createCountDown} from 'common/time'
// import { INIT_DURATION } from './config'

const getDuration = () => {
  return store.getState().experiment.time_left
}
const getCountDown = () => {
  return store.getState().experiment.timeForClosing
}
const setDuration = (time_left) => {
  store.dispatch(actions.setDuration({ time_left }))
}
const setCountDown = (timeForClosing) => {
  store.dispatch(actions.setDuration({ timeForClosing }))
}
const OrderCountDown = createCountDown(setDuration, getDuration)
const OrderCountDown2 = createCountDown(setCountDown, getCountDown)

export default OrderCountDown
// export const Clock = new OrderCountDown(1000, 1800)
export const CountDown = new OrderCountDown2(1000, 20)
