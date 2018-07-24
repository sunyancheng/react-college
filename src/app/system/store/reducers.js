import { combineReducers } from 'redux'
import page from 'common/page/page-reducer'
import app from 'common/app/app-reducer'
import topo from './topo-reducers'
export default combineReducers({
  page,
  app,
  topo
})
