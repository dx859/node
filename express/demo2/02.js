var express = require('express');
var ejs = require('ejs');

var app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('haha', {
        'news': [
            '我是新闻',
            '我也是',
            '哈哈哈哈'
        ]
    });
});

app.listen(3000);
