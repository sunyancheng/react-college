const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const vendorConfig = require('./webpack-config-vendor')
const appConfig = require('./webpack-config-app')
const vendorBuilder = require('./vendor-builder')

var configs = [vendorConfig, appConfig];
configs.forEach((config, i) => {
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 7330 + i
  }));
});

function report(err, stats) {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
  console.log(stats.toString({
    colors: true,
    cached: false,
    children: true,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  }))
}

// vendorBuilder(function () {
  webpack(appConfig, report);
// }, true);
