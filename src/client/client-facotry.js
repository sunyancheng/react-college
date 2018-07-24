/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd'
import ErrorBoundary from './error-boundary'
export default function (basename, store) {
  if (window.location.pathname === '' || window.location.pathname === '/') {
    window.history.replaceState(null, null, '/' + basename);
  }
  // Get the DOM Element that will host our React application.
  const container = document.querySelector('#app');

  // Does the user's browser support the HTML5 history API?
  // If the user's browser doesn't support the HTML5 history API then we
  // will force full page refreshes on each page change.
  const supportsHistory = 'pushState' in window.history;

  /**
   * Renders the given React Application component.
   */
  return function renderApp(App) {
    // Firstly, define our full application component, wrapping the given
    // component app with a browser based version of react router.
    var app = (
      <Provider store={store}>
        <BrowserRouter basename={basename} forceRefresh={!supportsHistory}>
          <LocaleProvider locale={zhCN}>
            <App />
          </LocaleProvider>
        </BrowserRouter>
      </Provider>
    );
    if (process.env.NODE_ENV === 'production') {
      app = (
        <ErrorBoundary>
          {app}
        </ErrorBoundary>
      )
    }

    render(app, container);
  }
}
