const http = require('http');
const url = require('url');
const querystring = require('querystring');

http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;

    if (pathname === '/favicon.ico') { // 过滤浏览器请求的/favicon.ico
        return;
    }

    var module = pathname.substr(1),
        str = url.parse(req.url).query,
        controller = querystring.parse(str).c, // 获取请求参数c，也就是请求模块的方法
        classObj = '';

    try { // require一个模块，捕获异常
        classObj = require('./' + module);
    } catch (err) { // 异常错误时，打印错误日志
        console.log('chdir: ' + err);
    }

    if (classObj) { // require成功，应用call方法
        // classObj.init(res, req);
        classObj[controller](req, res);
    } else { // 调用不存在模块的时候，返回404错误
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('can not find source');
    }

}).listen(3000);

console.log('Server start on port: 3000');
