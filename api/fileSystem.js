const fs = require('fs');

/**
 * fs.readFile(file[, options], callback)
 */

// fs.readFile('./events.js', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });


/**
 * fs.open(path, flags[, mode], callback)
 * fs.read(fd, buffer, offset, length, position, callback)
 */
fs.open('./util.js', 'r', (err, fd) => {
    if (err) throw err;

    var buf = new Buffer(10);
    fs.read(fd, buf, 0, 10, null, (err, bytesRead, buffer) => {
        if (err) throw err;

        console.log('bytesRead:', bytesRead);
        console.log(buffer);
    });
});