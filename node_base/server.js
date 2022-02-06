let socketManner = require('./socketManner')
let Main = require('./main')
// var express=require('express');
// var app =express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const port = process.env.PORT || 3000;

// io.on('connection', (socket) => {
//   socket.on('chat message', msg => {
//     io.emit('chat message', msg);
//   });
// });
// // var allControl=require('./controller/allControl');

// //设置跨域访问
// app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//    res.header("X-Powered-By",' 3.2.1');
//    res.header("Content-Type", "application/json;charset=utf-8");
//    next();
// });
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
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
let main = new Main(io);
    main.createRoom()
socketManner(io)
// io.on('connection', (socket) => {
//   socket.on('chat message', msg => {
//     io.emit('chat message', msg);
//   });
// });

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
