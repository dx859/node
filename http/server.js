/*
搭建一个http服务器，用于处理用户发送的http请求
需要使用node提供一个模块http
*/
// 加载一个http模块
var http = require('http')；
// 创建一个http服务对象
var server = http.createServer();

/*
server.listen(port, [hostname],[backlog],[callback])
监听客户端请求，只有当调用listen方法之后，服务器才开始工作
- port
- hostname
- backlog: 等待队列的最大长度
- callback: 调用listen方法成功开启监听以后，会触发一个listening事件，callback作为该事件的执行函数
*/




