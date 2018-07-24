const webpack = require('webpack');
const appRootDir = require('app-root-dir').get();
const path = require('path');
const chokidar = require('chokidar');

var devNodeServer, devClientServer;

const isDev = true;

const watcher = chokidar.watch([
  path.resolve(appRootDir, 'internal')
], {
    alwaysStat: true
  });

async function dispose() {
  if (devClientServer) {
    await devClientServer.dispose();
    devClientServer = null;
  }
  if (devNodeServer) {
    await devNodeServer.dispose();
    devNodeServer = null;
  }
}

async function start() {
  await dispose();

  const DevClientServer = require('./dev-client-server');
  const DevNodeServer = require('./dev-node-server');
  const clientConfig = require('./webpack-config/factory-client')({ isDev });
  const serverConfig = require('./webpack-config/factory-server')({ isDev });
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);
  clientCompiler.plugin('done', (stats) => {
    if (!stats.hasErrors() && !devNodeServer) {
      devNodeServer = new DevNodeServer(serverCompiler, clientCompiler)
      
    }
  });
  devClientServer = new DevClientServer(clientCompiler);
}

start();
const fileSizes = {};
watcher.on('ready', () => {
  watcher.on('change', async (path, stats) => {
    if (stats && fileSizes[path] && fileSizes[path] === stats.size) return;
    fileSizes[path] = stats.size;
    console.log('开发环境配置改动，重新启动...');
    await dispose();
    // Make sure our new webpack bundleConfigs aren't in the module cache.
    Object.keys(require.cache).forEach((modulePath) => {
      if (modulePath.indexOf('internal') !== -1) {
        delete require.cache[modulePath];
      }
    });
    start();
  });
});

// If we receive a kill cmd then we will first try to dispose our listeners.
process.on('SIGTERM', async () => {
  await dispose();
  process.exit(0);
});
