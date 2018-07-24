const webpack = require('webpack');
const buildVendor = require('./vendor-builder');
const options = require('./options')

// 删除上次编译结果
require('./clean')

function report(err, stats) {
  if (err) {
    return console.error(err);
  }
  console.log(stats.toString({
    colors: true,
    cached: false,
    children: true,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  }));


  // 拷贝nginx
  if (options.env !== 'production') {
    require('directory-copy')({
      src: __dirname + '/internal/nginx', dest: __dirname + '/public/nginx'
    }, function (err) {
      console.log(err || 'done!')
    });
  }
}

buildVendor(function () {
  webpack(require('./webpack-config-app'), report);
})
