const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const staticModule = require('./static_module');

http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;

    if (pathname == '/favicon.ico') {
        return;
    } else if (pathname == '/index' || pathname == '/') {
        goIndex(res);
    } else {
        staticModule.setStaticDir(path.join(__dirname, 'public'));
        staticModule.getStaticFile(pathname, req, res);
    }

}).listen(3000);

console.log('Server running at http://localhost:3000');

function goIndex(res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('this is index page');
}


