var env = process.env.APP_ENV;
var baseURL = '';
if (env === 'development') {
  baseURL = 'http://dev.trans.abc.xxx.cn:8360';
} else if (env === 'test') {
  baseURL = 'http://test.trans.abc.xxx.cn:8360';
} else {
  baseURL = 'https://trans.abc.xxx.cn';
  if(location.hostname === 'beta.admin.abc.xxx.cn') {
    baseURL = 'http://beta.trans.abc.xxx.cn';
  }
}
module.exports = {
  baseURL
}
