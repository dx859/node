var http = require('http');
//node为了追求极致，它是一个小段一个小段接收的。
//接受了一小段，可能就给别人去服务了。防止一个过大的表单阻塞了整个进程

var server = http.createServer(function(req, res) {
    console.log(req.url, req.method);
    if (req.url == '/dopost' && req.method.toLowerCase() == 'post') {
        var allData = '';
        req.addListener('data', function(chunk) {
            allData += chunk;
        });
        req.addListener('end', function() {
            console.log(allData.toString());
            res.end('success');
        });  
    }
});

server.listen(80, '127.0.0.1');
