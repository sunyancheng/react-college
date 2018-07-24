
const webpackConfigFactory = require('./factory');
const appRootDir = require('app-root-dir').get();
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = function ({ isDev }) {

  const config = webpackConfigFactory(
    {
      entry: {
        server: path.resolve(appRootDir, 'src/server')
      },
      output: {
        path: path.resolve(appRootDir, 'dist/server'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        libraryTarget: 'commonjs2',
        publicPath: '/build/'
      },
      // Ensure that webpack polyfills the following node features for use
      // within any bundles that are targetting node as a runtime. This will be
      // ignored otherwise.
      node: {
        __dirname: true,
        __filename: true
      },
      target: 'node',
      externals: nodeExternals(
        // Some of our node_modules may contain files that depend on our
        // webpack loaders, e.g. CSS or SASS.
        // For these cases please make sure that the file extensions are
        // registered within the following configuration setting.
        {
          whitelist: [
            // We always want the source-map-support included in
            // our node target bundles.
            'source-map-support/register',
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/,
          ]
        }
      ),
      plugins: [new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
      })],
    }, isDev, true /*isNode*/);


  const importPlugin = ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": false }] // `style: true` for less;
  config.module.rules.unshift({
    test: /\.js$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'react',
            'stage-1',
            ['env', { targets: { node: true } }]
          ],
          plugins: isDev ?
            [
              'transform-react-jsx-self',
              'transform-react-jsx-source',
              ["transform-class-properties"],
              importPlugin
            ] :
            ['transform-react-constant-elements', importPlugin]
        }
      },
      { loader: 'eslint-loader' },
    ],
    exclude: path.resolve(appRootDir, 'node_modules'),
    include: path.resolve(appRootDir, 'src')
  }, );
  return config;
}
