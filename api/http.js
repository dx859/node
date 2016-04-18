const http = require('http');
const util = require('util');

http.createServer((req, res) => {
    

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
}).listen(3001);

console.log('HTTP Server is listening at port 3001');
