/* eslint-disable no-console */

import express from 'express';
import { resolve as pathResolve } from 'path';
import application from './application';
import security from './security';
import errorHandlers from './error-handler';
import Proxy from 'http-proxy-middleware';
const appRootDir = require('app-root-dir').get();

const app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security());
if (process.env.NODE_ENV === 'development') {
  const target = 'http://localhost:8888';
  const logLevel = 'error'
  app.use('/client', Proxy({ target, logLevel }));
  app.use('/__webpack_hmr', Proxy({ target, logLevel }));
}

// Configure static serving of our "public" root http path static files.
// Note: these will be served off the root (i.e. '/') of our application.
app.use(express.static(pathResolve(appRootDir, 'public')));

// The React application middleware.
app.get('*', (req, res) => {
  if (req.url === '/') {
    return res.redirect('/user');
  }
  return application(req, res);
});

// Error Handler middlewares.
app.use(...errorHandlers);

// Create an http listener for our express app.

const listener = app.listen(8081, () =>
  console.log('服务启动，端口号为8081'),
);

// We export the listener as it will be handy for our development hot reloader,
// or for exposing a general extension layer for application customisations.
export default listener;

