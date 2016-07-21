var fs = require('fs');
var path = require('path');

var defaultTest = path.join(__dirname, 'test');

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
    // console.log(stats);
});
