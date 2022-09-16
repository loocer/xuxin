
const http = require('http')
const https = require('https');
const fs = require('fs');
const app = require('express')();
const httpProxy = require('http-proxy');

const privateKey = fs.readFileSync('./6360482_xuxin.love.key');
const certificate = fs.readFileSync('./6360482_xuxin.love.pem');
const credentials = {
  key: privateKey,
  cert: certificate
};
var proxy = httpProxy.createProxyServer();
// 创建 HTTP 与 HTTPS 服务器
app.use(function(req, res, next) {
  if (req.url.slice(-1) === '/') {
    req.url = req.url.slice(0, -1);
  }
  next();
});
const httpsServer = http.createServer(function(req, res){
  console.log(3232323)
  proxy.web(req, res, {
    // 目标地址
    target: 'https://qqaw.oss-cn-zhangjiakou.aliyuncs.com',
    secure: false
  });
});


// httpsServer.request.on((e)=>{
//   console.log(e,'5454545')
// })
// const httpsServer = require('http').Server(app);



// const io = require('socket.io')(http);
// const port = process.env.PORT || 3000;

// io.on('connection', (socket) => {
//   socket.on('chat message', msg => {
//     io.emit('chat message', msg);
//   });
// });
// // var allControl=require('./controller/allControl');

//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});
// // allControl.setAllControl(app);

// //配置服务端口
// var server = app.listen(3000, function () {
// var host = server.address().address;
// var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// })





// // http.listen(port, () => {
// //   console.log(`Socket.IO server running at http://localhost:${port}/`);
// // });

// const http = require('http').Server(app);

const port = 3520;


// io.on('connection', (socket) => {
//   socket.on('chat message', msg => {
//     io.emit('chat message', msg);
//   });
// });


httpsServer.listen(port, function () {
  console.log('HTTPS Server is running on: https://localhost:%s');
});