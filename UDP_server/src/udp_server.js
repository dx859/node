const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    resizeImage();
});

server.on('listening', () => {
    var address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

function resizeImage(url, width, height, newName, callback) {
    var im = require('imagemagick');
    im.resize({
        srcPath: url,
        dstPath: newName,
        width: width,
        height: height
    }, (err, stdout, stderr) => {
        if (err) {
            callback(-1);
            console.log(err);
        } else {
            console.log(stdout);
            callback(stdout);
        }
    });
}
