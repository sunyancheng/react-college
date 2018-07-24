import createStore from 'common/create-store'
import reducers from './reducers'
 
const store = createStore(reducers)
export default store

export function isAdmin() {
  return (store.getState().app.userInfo.role || []).includes(8)
}