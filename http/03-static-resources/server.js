var http = require('http'),
    fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
    if (!responseCode) responseCode = 200;

    // __dirname will resolve to the directory the executing script resides in
    fs.readFile(__dirname + path, function(err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
        } else {
            res.writeHead(responseCode, {'Content-Type': contentType});
            res.end(data);
        }
    });
}

http.createServer(function(req, res) {

    var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase();

    switch(path) {
        case '':
            serveStaticFile(res, '/public/home.html', 'text/html');
            break;

        case '/about':
            serveStaticFile(res, '/public/about.html', 'text/html');
            break;

        case '/img/logo': 
            serveStaticFile(res, '/public/images/logo.jpg', 'image/jpeg')

        default:
            serveStaticFile(res, '/public/404.html', 'text/html', 404);
            break;
    }

}).listen(3000);


console.log('Server started on localhost:3000');