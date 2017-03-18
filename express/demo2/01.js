var express = require('express');

var app = express();

app.get('/', (req, res) => {
    res.send('你好');
});

app.get('/teacher/:gonghao', (req, res) => {
    res.send('老师工号：' + req.params.gonghao);
})

app.listen(3000);