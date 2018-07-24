
const webpack = require('webpack');
const webpackConfigFactory = require('./webpack-config-factory');
const appRootDir = require('app-root-dir').get();
const path = require('path');
const outputPath = path.resolve(appRootDir, 'public/client');
const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack')
const fs = require('fs');
const md5 = require('md5');
const options = require('./options');

console.log('运行配置：\n' + Object.keys(options).map(key => `${key}: ${options[key]}`).join('\n'));
const { NODE_ENV, autoUpdate, env } = options;
const isDev = NODE_ENV === 'development';
var vendorFilePath = ''; // '/vendor/vendor.dll.js';
var versionScript = '';
var fundebug = '';
var urlScript = ''
var timestampVersion = Date.now().valueOf();
if (autoUpdate) {
  versionScript = `<script>window.__version__ = "${timestampVersion}";</script>`
  vendorFilePath += '?' + md5(fs.readFileSync(path.resolve(appRootDir, 'public/vendor/vendor.json')));
}
if (NODE_ENV === 'production') {
  fundebug = `<script src="https://js.fundebug.cn/fundebug.1.1.1.min.js" apikey="203ffa25252a5e6b04ebf15abe612bea1b13b9a7d2ea8755838e148d984a26e9"></script>`
}
(function (env) {
  let url
  if (env === 'production') url = 'https://abc.xxx.cn/'
  else url = 'http://test.abc.xxx.cn/'
  urlScript = `<script>function goBack() { window.location.href = '${url}' }</script>`
})(env)
const manifest = require(path.resolve(appRootDir, 'public/vendor/vendor-manifest.json'));
const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'user.html',
    vendor: vendorFilePath,
    versionScript,
    fundebug,
    chunks: ['common', 'app-common', 'user']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'admin.html',
    vendor: vendorFilePath,
    versionScript,
    fundebug,
    chunks: ['common', 'app-common', 'admin']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'system.html',
    vendor: vendorFilePath,
    versionScript,
    fundebug,
    chunks: ['common', 'app-common', 'system']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'experiment.html',
    vendor: vendorFilePath,
    fundebug,
    chunks: ['common', 'app-common', 'experiment'],
    versionScript
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'exam.html',
    vendor: vendorFilePath,
    fundebug,
    chunks: ['common', 'app-common', 'exam'],
    versionScript
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/template.html'),
    filename: 'teacher.html',
    vendor: vendorFilePath,
    fundebug,
    chunks: ['common', 'app-common', 'teacher'],
    versionScript
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/invitation.html'),
    filename: 'invitation.html',
    fundebug,
    versionScript,
    chunks: ['common', 'invitation']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/order.html'),
    filename: 'order.html',
    vendor: vendorFilePath,
    fundebug,
    versionScript,
    chunks: ['common', 'order']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/vnc.html'),
    filename: 'vnc.html',
    fundebug,
    chunks: ['common', 'vnc']
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/ie.html'),
    filename: 'ie.html',
    chunks: []
  }),
  new HtmlWebpackPlugin({
    template: path.join(appRootDir, './src/notallowed.html'),
    filename: 'notallowed.html',
    chunks: [],
    urlScript
  }),
  new AssetsPlugin({ filename: 'assets.json', path: outputPath }),
  false && new webpack.DllReferencePlugin({
    context: appRootDir,
    manifest,
    name: manifest.name
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  new webpack.optimize.CommonsChunkPlugin({ name: 'app-common', chunks: ['user', 'admin', 'system', 'experiment', 'teacher', 'exam'] }),
  new webpack.optimize.CommonsChunkPlugin({ name: 'common', chunks: ['app-common', 'order', 'vnc'] }),
  isDev && new webpack.NoEmitOnErrorsPlugin(),
  isDev && new webpack.NamedModulesPlugin(),
  !isDev && new webpack.HashedModuleIdsPlugin(),
  autoUpdate && new CreateFileWebpack({
    path: path.resolve(appRootDir, 'public'),
    fileName: '__version__',
    content: timestampVersion
  })
].filter(i => !!i);

const clientConfig = Object.assign(webpackConfigFactory(options), {
  entry: {
    user: path.resolve(appRootDir, 'src/client/user'),
    admin: path.resolve(appRootDir, 'src/client/admin'),
    system: path.resolve(appRootDir, 'src/client/system'),
    invitation: path.resolve(appRootDir, 'src/app/invitation'),
    order: path.resolve(appRootDir, 'src/client/order'),
    experiment: path.resolve(appRootDir, 'src/client/experiment'),
    teacher: path.resolve(appRootDir, 'src/client/teacher'),
    exam: path.resolve(appRootDir, 'src/client/exam'),
    vnc: path.resolve(appRootDir, 'src/client/vnc')
  },
  output: {
    path: outputPath,
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: '/client/'
  },
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    port: 8360,
    disableHostCheck: true,
    contentBase: path.join(appRootDir, 'public/'),
    overlay: {
      errors: true
    },
    // noInfo: true,
    hot: false,
    inline: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/user/, to: '/client/user.html' },
        { from: /^\/teacher/, to: '/client/teacher.html' },
        { from: /^\/admin/, to: '/client/admin.html' },
        { from: /^\/system/, to: '/client/system.html' },
        { from: /^\/invitation/, to: '/client/invitation.html' },
        { from: /^\/order/, to: '/client/order.html' },
        { from: /^\/experiment/, to: '/client/experiment.html' },
        { from: /^\/exam/, to: '/client/exam.html' },
        { from: /^\/vnc/, to: '/client/vnc.html' },
        { from: /^\/ie/, to: '/client/ie.html' },
        { from: /^\/notallowed/, to: '/client/notallowed.html' }
      ],
      index: '/client/user.html',
      verbose: false
    }
  }
});
clientConfig.plugins.unshift(...plugins);

const importPlugin = ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": true }] // `style: true` for less;
clientConfig.module.rules.unshift({
  test: /\.js$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          'react',
          'stage-1',
          ['env', { es2015: { modules: false } }]
        ],
        plugins: isDev ?
          [
            // 'react-hot-loader/babel',
            'transform-react-jsx-self',
            'transform-react-jsx-source',
            'transform-class-properties',
            importPlugin
          ] :
          [
            'transform-class-properties',
            importPlugin
          ]
      }
    },
    { loader: 'eslint-loader' },
  ],
  exclude: path.resolve(appRootDir, 'node_modules'),
  include: path.resolve(appRootDir, 'src')
})
module.exports = clientConfig;

