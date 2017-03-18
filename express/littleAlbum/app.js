var express = require('express');
var router = require('./controller');
var app = express();

// 设置模版引擎
app.set('view engine', 'ejs');

// 路由中间件
app.use(express.static('./public'));

// 首页
app.get('/', router.showIndex);
app.get('/:albumName', router.showAlbum);


app.listen(3000);
