import createStore from 'common/create-store'
import reducers from './reducers'

const store = createStore(reducers)
export default store

export function isStudent() {
  return (store.getState().app.userInfo.role || []).includes(2)
}

export const isStudentThen = (api1, api2) => {
  return (...args) => store.getState().app.userInfo.role.includes(2) ? api1(...args) : api2(...args)
}

export const isGraduated = ({ class_student_status }) => {
  return class_student_status === '2'
}

export const isExpire = () => {
  return false
}
