const express = require('express')
const path = require('path')
const fs = require('fs')
const appRootDir = require('app-root-dir').get()
const Proxy = require('http-proxy-middleware')

const app = express()
const target = 'http://localhost:8888';
const logLevel = 'error'
app.use('/client', Proxy({ target, logLevel }));
app.use('/__webpack_hmr', Proxy({ target, logLevel }));
app.use(express.static(path.resolve(appRootDir, 'public')));
app.get('*', (req, res) => {
  console.log(fs.readFileSync(path.join(appRootDir, 'public/client/index-user.html'), 'utf8'))
  const html = fs.readFileSync(path.join(appRootDir, 'public/client/index-user.html'), 'utf8')
  res.send(html)
})

app.listen(8082, () => {
  console.log('server listening on 8082')
})
