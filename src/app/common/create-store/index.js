

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const preloadedState = window.__INITIAL_STATE__
const middleware = [applyMiddleware(thunk)]
if (process.env.NODE_ENV === 'development') {
  window.__REDUX_DEVTOOLS_EXTENSION__ && middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

export default function (reducers) {
  return createStore(reducers, preloadedState, compose(...middleware))
}

