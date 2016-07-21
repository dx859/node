const fs = require('fs');
const url = require('url');
const path = require('path');

var res, req;

// 创建初始化变量函数
exports.init = (response, request) => {
    res = response;
    req = request;
};

// 创建index首页函数
exports.index = (req, res) => {
    // 获取当前image路径
    var readPath = path.join(__dirname, url.parse('index.html').pathname);
    fs.readFile(readPath, 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
};
