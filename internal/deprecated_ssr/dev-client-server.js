const express = require('express');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const ListenerManager = require('./listener-manager');

module.exports = class {
  constructor(compiler, port = '8888') {
    const app = express();

    this.webpackDevMiddleware = webpackMiddleware(compiler, {
      quiet: true,
      noInfo: true,
      logLevel: 'info',
      stats: {
        colors: true,
        cached: false,
        children: true,
        chunkModules: false,
        chunkOrigins: false,
        modules: false
      },
      headers: {
        'Access-Control-Allow-Origin': `http://localhost:8081`,
      },
      // Ensure that the public path is taken from the compiler webpack config
      // as it will have been created as an absolute path to avoid conflicts
      // with an node servers.
      publicPath: compiler.options.output.publicPath,
    });

    app.use(this.webpackDevMiddleware);
    app.use(webpackHotMiddleware(compiler));

    const listener = app.listen(port);

    this.listenerManager = new ListenerManager(listener, 'client');

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.error(stats.toString());
      }
    });
  }

  async dispose() {
    this.webpackDevMiddleware.close();
    this.listenerManager && await this.listenerManager.dispose();
  }
}
