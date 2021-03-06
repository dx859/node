var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    var postData = '';
    var pathname = url.parse(request.url).pathname;

    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(3000);
  console.log('Server start on port 3000');
}

exports.start = start;