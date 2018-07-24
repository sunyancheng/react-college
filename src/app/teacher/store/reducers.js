import { combineReducers } from 'redux'
import page from 'common/page/page-reducer'
import app from 'common/app/app-reducer'

export default combineReducers({ app, page })
