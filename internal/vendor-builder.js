const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const appRootDir = require('app-root-dir').get();
const { NODE_ENV } = require('./options')
const isDev = NODE_ENV !== 'development'
const config = require('./webpack-config-vendor')

module.exports = function (callback, force) {
  const name = 'vendor';
  const vendorDir = config.output.path;
  const vendorJsonFile = path.join(vendorDir, name + '.json');
  const vendors = config.entry.vendor;

  function compareObj(obj1, obj2) {
    var aProps = Object.getOwnPropertyNames(obj1);
    var bProps = Object.getOwnPropertyNames(obj2);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (obj1[propName] !== obj2[propName]) {
        return false;
      }
    }
    return true;
  }

  function getVersion(packageEach) {
    var packageEach = require(path.join(appRootDir, './node_modules/' + packageEach + '/package.json'));
    return packageEach.version + (!isDev ? '-compress' : '');
  }

  function createVersionTxt() {
    var obj = {};
    for (var index in vendors) {
      obj[vendors[index]] = getVersion(vendors[index]);
    }
    fs.writeFileSync(path.join(vendorJsonFile), JSON.stringify(obj));
  }

  function checkIfNeedRepack() {
    if (!fs.existsSync(vendorDir)) {
      fs.mkdirSync(vendorDir);
    }
    // 检查是否存在 src/vendor/vendor.json 若没有创建vendor.json
    if (force || !fs.existsSync(vendorJsonFile)) {
      return true;
    }
    var obj = {};
    for (var index in vendors) {
      obj[vendors[index]] = getVersion(vendors[index]);
    }
    // 检验新旧版本号是否一致
    var oldObj = JSON.parse(fs.readFileSync(path.join(vendorDir, name + '.json')));
    return !compareObj(obj, oldObj);
  }

  if (checkIfNeedRepack()) {
    // 版本号不一致或者第一次打包
    console.log("repack dll...");
    webpack(config, function (err) {
      if (err) {
        console.error(err);
        throw err;
      }
      console.log('pack success!')
      createVersionTxt();
      callback && callback();
    });
  } else {
    callback && callback();
  }
}
