var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
// var qureystring = require('qureystring');
var method = require('./reqMethod');

var ROOT = './';

// 分析请求方法
http.createServer(function(req, res) {
    req.query = querystring(req);
    req.cookies = parseCookie(req.headers.cookie);
    var id = req.cookies[key];
    if (!id) {
        req.session = generate();
    } else {
        var session = sessions[id];

        if (session) {
            if (session.cookie.expire > (new Date().getTime())) {
                // 更新超时时间
                session.cookie.expire = new Date().getTime() + EXPIRES;
                req.session = session;
            } else {
                // 超时了，删除旧的数据，并重新生成
                delete sessions[id];
                req.session = generate();
            }
        } else {
            // 口令不对
            req.session = generate();
        }
    }
    
    var writeHead = res.writeHead;
    res.writeHead = function() {
        var cookies = res.getHeader('Set-Cookie');
        

        var session = serialize(key, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [session];
        console.log('cookies=>',cookies)
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };

    selectController(req, res);

}).listen(3000);

console.log('Server start at http://localhost:3000');



// 序列化cookie
function serialize(name, val, opt) {
    var pairs = [name + '=' + encodeURI(val)];
    opt = opt || {};

    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.httpOnly) pair.push('HttpOnly');
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
}


// 查询字符串
function querystring(req) {
    return url.parse(req.url, true).query;
}

// 解析cookie
function parseCookie(cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    var list = cookie.split(';');
    for (var i = 0; i < list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
}

// 分析控制器
function selectController(req, res) {
    var pathname = url.parse(req.url).pathname;
    var paths = pathname.split('/');
    var controller = paths[1] || 'index';
    var action = paths[2] || 'index';
    var args = paths.slice(3);

    if (handles[controller] && handles[controller][action]) {

        if (!req.session.isVisit) {
            console.log(req.cookies);
            console.log(req.session);
            req.session.isVisit = true;
            res.writeHead(200);
            res.write('欢迎第一次来到动物园！\n');

        } else {
            console.log(req.cookies);
            console.log(req.session);
            res.writeHead(200);
            res.write('动物园再次欢迎您！\n');
            
        }

        handles[controller][action].apply(null, [req, res].concat(args));
    } else {
        res.writeHead('404');
        res.end('找不到响应的控制器');
    }

    
}

// 控制器
var handles = {
    index: {
        index: function(req, res) {
            res.end('index');
        },

        show: function(req, res) {
            res.end('show');
        }

    },

    login: {
        login: function(req, res) {
            res.writeHead('200');
            res.end('login');
        },
        register: function(req, res) {

            res.end('register');
        }
    }

};


function selectFile(req, res) {
    var pathname = url.parse(req.url).pathname;
    fs.readFile(path.join(ROOT, pathname), function(err, file) {
        if (err) {
            res.writeHead(404);
            res.end('找不到相关文件');
            return;
        }
        res.writeHead(200);
        res.end(file);
    });
}

function selectMethod(req, res) {
    switch (req.method) {
        case 'GET':
            method.get(req, res);
            break;
        case 'POST':
            method.update(req, res);
            break;
        case 'DELETE':
            method.remove(req, res);
            break;
        case 'PUT':
            method.create(req, res);
            break;
        default:
            method.get(req, res);
    }
}


// 生成session
var sessions = {};
var key = 'session_id';
var EXPIRES = 20 * 60 * 1000;

var generate = function() {
    var session = {};

    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
};
