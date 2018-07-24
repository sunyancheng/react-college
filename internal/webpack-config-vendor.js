const path = require('path');
const webpack = require('webpack');
const appRootDir = require('app-root-dir').get();
const factory = require('./webpack-config-factory');
const options = require('./options')

const baseConfig = factory(options);
const vendors = [
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  "react-router-redux",
  "redux",
  "react-redux",
  "redux-thunk",
  "prop-types",
  "helmet",
  "react-helmet",
  "moment",
  "reqwest"
];

const name = 'vendor';
const vendorDir = path.resolve(appRootDir, 'public/vendor');
const config = Object.assign(baseConfig, {
  entry: {
    vendor: vendors
  },
  output: {
    path: vendorDir,
    filename: name + '.dll.js',
    library: name + '_library'
  }
});
config.plugins.unshift(
  new webpack.DllPlugin({
    path: path.join(vendorDir, name + '-manifest.json'),
    name: name + '_library'
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
);

module.exports = config;




