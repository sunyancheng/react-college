const MemoryFS = require('memory-fs')
// const path = require('path')
const webpack = require('webpack');

var getApps;

if (['production', 'test'].indexOf(process.env.NODE_ENV) > -1) {
  getApps = function () {
    return Promise.resolve(require('../app/index'));
  }
}

if (process.env.NODE_ENV === 'development') {
  const mfs = new MemoryFS();
  const appWebpackConfig = require('../../internal/webpack-config/factory-app')({ isDev: true });
  const appCompiler = webpack(appWebpackConfig);
  appCompiler.outputFileSystem = mfs

  const context = {
    state: false,
    webpackStats: null,
    callbacks: [],
    watchOffset: 11000,
    watching: null,
    fs: mfs
  };
  function done(stats) {
    if (stats.hasErrors()) return;

    // We are now on valid state
    context.state = true;
    context.webpackStats = stats;

    // Do the stuff in nextTick, because bundle may be invalidated
    // if a change happened while compiling
    process.nextTick(() => {
      // check if still in valid state
      if (!context.state) {
        return;
      }
      // execute callback that are delayed
      const cbs = context.callbacks;
      context.callbacks = [];
      cbs.forEach((cb) => {
        cb(context);
      });
    });
  }

  function invalid(...args) {
    if (context.state) {
      console.info('服务端正在编译');
    }
    // We are now in invalid state
    context.state = false;
    // resolve async
    if (args.length === 2 && typeof args[1] === 'function') {
      const [, callback] = args;
      callback();
    }
  }

  appCompiler.plugin('invalid', invalid);
  appCompiler.plugin('run', invalid);
  appCompiler.plugin('done', stats => {
    // clean up the time offset
    if (context.watchOffset > 0) {
      stats.startTime -= context.watchOffset;
    }
    done(stats);
  });

  appCompiler.plugin('watch-run', (watcher, callback) => {
    // apply a fix for compiler.watch, if watchOffset is greater than 0:
    //   ff0000-ad-tech/wp-plugin-watch-offset
    // offset start-time
    if (context.watchOffset > 0) {
      watcher.startTime += context.watchOffset;
    }
    invalid(watcher, callback);
  });

  const watching = appCompiler.watch({ aggregateTimeout: 200 }, err => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    }
  });
  context.watching = watching;
  getApps = function (callback) {
    if (context.state) {
      return callback(context);
    }
    context.callbacks.push(callback);
  }
}

export default getApps;
