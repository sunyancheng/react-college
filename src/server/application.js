import React from 'react';
import Helmet from 'react-helmet';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import asyncBootstrapper from 'react-async-bootstrapper'
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from '../app/redux/index'
import ServerHTML from './server-html';
import getApps from './app-provider';
const Module = require('module')

export default function reactApplicationMiddleware(request, response, disableSSR) {
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const mode = process.env.NODE_ENV;
  const appName = request.path.split('/')[1];
  const nonce = response.locals.nonce;
  let modules = []
  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (disableSSR) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      // eslint-disable-next-line no-console
      console.log({
        title: 'Server',
        level: 'info',
        message: `Handling react route without SSR: ${request.url}`,
      });
    }
    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML nonce={nonce} name={appName} />);
    response.status(200).send(`<!DOCTYPE html>${html}`);
    return;
  }

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  // var apps;

  getApps(context => {
    context.fs.readFile(`/${appName}.js`, 'utf-8', async (err, appBundle) => {
      const m = new Module();
      m._compile(appBundle, 'app.js');
      const App = m.exports.default || m.exports;
      if (!App) {
        return response.status(404).send(`页面不存在`);
      }
      const store = createStore(rootReducer, applyMiddleware(thunk))
      // Declare our React application.
      const app = (
        <Provider store={store}>
          <StaticRouter basename={appName} location={request.url} context={reactRouterContext}>
            <App />
          </StaticRouter>
        </Provider>
      );

      // Pass our app into the react-async-component helper so that any async
      // components are resolved for the render.

      asyncBootstrapper(app).then(async () => {
        const appString = renderToString(app);
        // let bundles = []
        // Generate the html response.
        const html = renderToStaticMarkup(
          <ServerHTML
            reactAppString={appString}
            nonce={nonce}
            helmet={Helmet.renderStatic()}
            name={appName}
            mode={mode}
            store={store}
          />,
        );

        // Check if the router context contains a redirect, if so we need to set
        // the specific status and redirect header and end the response.
        if (reactRouterContext.url) {
          response.status(302).setHeader('Location', reactRouterContext.url);
          response.end();
          return;
        }

        response.status(200).send(`<!DOCTYPE html>${html}`);
      })
    });
  });
}
