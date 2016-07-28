var fs = require('fs');
var path = require('path');

var defaultTest = path.join(__dirname, '../test');

// 重命名
fs.rename(path.join(defaultTest, 'danhuang.txt'), path.join(defaultTest, 'hello.txt'), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('rename complete');
});

// 获取文件元信息
fs.stat(path.join(defaultTest, 'hello.txt'), (err, stats) => {
    if (err) console.log(err);
    console.log(stats);
});

// 读取文件数据 fs.realfile(path, [callback])

// 验证文件存在 fs.exists(path, (existBool) => {...})

// 删除文件
fs.unlink(path.join(defaultTest, 'tmp.txt'), (err) => {
    if (err) throw err;
});

// 文件读写
// fs.write(fd, buffer, offset, length, position, [callback]);
// fs.read(fd, buffer, offset, length, position, [callback]);
