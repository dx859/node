var dgram = require('dgram');
var client = dgram.createSocket('udp4');

// 创建发送数据 message
var message = new Buffer('hi , node.js is waiting for you');

client.send(message, 0, message.length, 41234, "localhost", (err) => {
    client.close();
});

