var formidable = require('formidable'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    util = require('util');

http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload 
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.uploadDir = "./image"; // 设置文件上传存放地址

        // 执行回调函数的时候，证明表单已经全部接收完毕
        form.parse(req, function(err, fields, files) {
            // 所有文本域，单选框，都在fields存放
            // 所有的文件域，files中存放
            res.writeHead(200, { 'content-type': 'text/plain' });
            res.write('received upload:\n\n');
            res.end(util.inspect({ fields: fields, files: files }));
            // 上传完成后可以通过fs.rename修改文件名
            var ran = parseInt(Math.random() * 89999 + 10000);
            var oldPath = __dirname + '/' + files.upload.path;
            var newPath = __dirname + '/' + 'image/' + Date.now() + '_' + ran + path.extname(files.upload.name);

            console.log(files.upload.path);
            fs.rename(oldPath, newPath, function(err) {
                
            });
        });

        return;
    }

    // show a file upload form 
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
}).listen(80, "127.0.0.1");
