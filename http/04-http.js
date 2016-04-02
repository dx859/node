var http = require('http');

http.createServer(function(req, res) {
    var buffers = [];
    req.on('data', function(trunk) {
        buffers.push(trunk);

    }).on('end',function() {
        var buffer = Buffer.concat(buffers);
        res.end('hello world');
    });
}).listen(3000);

console.log('Server running at http://localhost:3000');