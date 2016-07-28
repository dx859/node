const http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');

var mmieConf = getMmieConf();
var static = path.join(__dirname, 'static');
const CACHE_TIME = 60 * 60 * 24 * 365;

/**
 * 响应静态资源请求
 * @param string pathname
 * @param object res
 * @return null
 */
exports.getStaticFile = (pathname, req, res) => {
    var extname = path.extname(pathname);
    extname = extname ? extname.slice(1) : '';
    extname = extname.toLowerCase();
    var realPath = path.join(static, pathname);

    var mmieType = mmieConf[extname] ? mmieConf[extname] : 'text/plain';

    fs.exists(realPath, (exists) => {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write("This request URL " + pathname + " was not found on this server.");
            res.end();
        } else {

            var fileInfo = fs.statSync(realPath);// 同步执行获取静态文件realPath信息
            var lastModified = fileInfo.mtime.toUTCString(); // 获取文件最后更改时间mtime

            // 设置缓存
            if (mmieConf[extname]) {
                var date = new Date();
                date.setTime(date.getTime() + CACHE_TIME * 1000);
                res.setHeader("Expires", date.toUTCString()); // 设置过期时间
                res.setHeader("Cache-Control", "max-age=" + CACHE_TIME); // 设置缓存时长
            }

            // console.log(req.headers['if-modified-since']);
            var modifiedSince = req.headers['if-modified-since'];

            // 判断静态资源文件是否更改
            if (modifiedSince && lastModified == modifiedSince) {
                res.writeHead(304, "Not Modified");
                res.end();
            } else {

                fs.readFile(realPath, "binary", function(err, file) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(err);
                    } else {
                        // 设置缓存信息
                        res.setHeader('Last-Modified', lastModified);
                        res.writeHead(200, { 'Content-Type': mmieType });
                        res.write(file, "binary");
                        res.end();
                    }
                });
            }

        }
    });
};

/**
 * 设置静态文件目录
 * @param  {string} path 静态文件目录路径
 */
exports.setStaticDir = (path) => {
    static = path;
};

//获取MMIE配置信息，读取配置文件
function getMmieConf() {
    var routerMsg = {};
    try {
        var str = fs.readFileSync(path.join(__dirname, 'conf', 'mmie_type.json'), 'utf8');
        routerMsg = JSON.parse(str);
    } catch (e) {
        console.error("JSON parse fails");
    }
    return routerMsg;
}
