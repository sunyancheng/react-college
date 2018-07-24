import cretaeStore from 'common/create-store'
import reducers from './reducers'

const store = cretaeStore(reducers)
export default store
export function isTeacher() {
  return (store.getState().app.userInfo.role || []).includes(4)
}