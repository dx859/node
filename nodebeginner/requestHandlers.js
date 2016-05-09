var querystring = require('querystring'),
  fs = require('fs'),
  formidable = require("formidable");

exports.start = function(response) {
  console.log('Request handler "start" was called');

  var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; ' +
    'charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/upload" enctype="multipart/form-data" ' +
    'method="post">' +
    '<input type="file" name="upload" multiple="multiple">' +
    '<input type="submit" value="Upload file" />' +
    '</form>' +
    '</body>' +
    '</html>';

  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(body);
  response.end();
}

exports.upload = function(response, request) {
  console.log('Request handler "upload" was called');

  var form = new formidable.IncomingForm();
  form.uploadDir = '/tmp';
  form.parse(request, function(error, fields, files) {

    fs.rename(files.upload.path, 'E:/tmp/test.png', function(error) {
      if (error) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write(error + '\n');
        response.end();
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write('received image:<br/>');
        response.write('<img src="/show">');
        response.end();
      }
    })

  });

}

exports.show = function(response) {
  console.log('Request handler "show" was called');

  fs.readFile('/tmp/test.png', 'binary', function(error, file) {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write(error + '\n');
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.write(file, 'binary');
      response.end();
    }
  })
}
