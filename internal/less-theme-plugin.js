
const appRootDir = require('app-root-dir').get();

function PrependContentPreprocessor(options) {
  this.options = options || {};
};
PrependContentPreprocessor.prototype = {
  process: function (css, e) {
    var path = e.imports.rootFilename.replace(appRootDir, '').replace('\\', '\/')

    // 去掉 iconfont，自己在项目中引入
    if (path === '/node_modules/antd/lib/style/index.less') {
      return ``;
      // `@import "~common/style/antd-theme.less";
      // @import "~antd/lib/style/mixins/index";
      // @import "~antd/lib/style/core/base";
      // @import "~antd/lib/style/core/motion";`
    }
    // 去掉antd 默认的主题，替换成项目里面定义的
    if (path.indexOf('/node_modules/antd/lib') >= 0) {
      css = css.replace(/@import.+\/themes\/default(.less){0,1}['"];/, '@import "~common/style/antd-theme.less";')

      if (css.indexOf('/themes/default') > 0) {
        console.error('有antd引用了default的样式，通常有问题，文件路径：', path);
      }
      return css;
    }
    return `@import '~common/style/theme.less';\n${css.replace(`@import '~common/style/theme.less'`, '')}`
  }
};

function LessPluginAutoPrefixer(options) {
  this.options = options;
};

LessPluginAutoPrefixer.prototype = {
  install: function (less, pluginManager) {
    pluginManager.addPreProcessor(new PrependContentPreprocessor(this.options));
  },
  minVersion: [2, 0, 0]
};

module.exports = LessPluginAutoPrefixer;
