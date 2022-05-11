module.exports = function (server) {
  var io = require('socket.io')(server, {
    cors: {
      origin: ['http://localhost:8080','http://localhost:8081','http://192.168.90.44:8081'],
      transports: ['websocket', 'polling'],
      credentials: true,
    },
    allowEIO3: true
  });
  // 用于存储每个用户的socket，实现私聊的功能
  let arrAllSocket = {}
  // 穿件socket连接
  io.on('connection', (socket) => {
    console.log('连接上了');
    // join函数 用于用户连接
    socket.on('join', function (obj) {
      console.log(obj.username + 'join')
      // 保存每个用户的连接状态 用于私发消息
      arrAllSocket[obj.username] = socket
    })
    // 接收前台发送的消息 函数名为message
    socket.on('message', (data) => {
      console.log(data);
      // 将消息发送回前台（调用前台定义的方法） 函数名为sendMessage
      io.emit('sendMessage', data);
    });
    // 私发消息
    socket.on('sendmsg', function (data) {
      console.log(data);
      // 查询用户连接
      let target = arrAllSocket[data.target]
      if (target) {
        //发送信息至指定的人
        target.emit('recvMessage', data)
      }
    });
    socket.on('sendgroupmsg', function (data) {
      console.log(data);
      // 查询用户连接
      data.target.forEach(function (item) {
        let target = arrAllSocket[item]
        if (target && item!= data.sender) {
          //发送信息至指定的人
          target.emit('recvMessage', data)
        }
      });
    });
    socket.on('disconnection', function (data) {
      console.log(data);
      // 查询用户连接
    })
  })
}