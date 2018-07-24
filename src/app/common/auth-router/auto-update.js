window.addEventListener('error', function (e) {
  if (e.target.tagName === 'SCRIPT' && /client\/.+\.js$/.test(e.target.src)) {
    console.info('有新版本上线了呦~');
    window.location.reload(true);
  }
}, true);

var lastCheckTime;
export default function () {
  return new Promise((resolve) => {
    // development env
    if (!window.__version__) {
      return resolve();
    }
    if (!lastCheckTime || (new Date() - lastCheckTime) > 15000) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        lastCheckTime = new Date();
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (xmlHttp.responseText !== window.__version__) {
            // 版本不一致，重新加载
            return window.location.reload(true);
          }
          resolve();
        }
      };
      xmlHttp.open("GET", '/__version__?' + (new Date()).valueOf(), true);
      xmlHttp.send(null);
    } else {
      resolve();
    }
  })
}