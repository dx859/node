var express = require('express');

var app = express();

app.get('/', (req, res, next) => {
    console.log(1);
    next();
});

app.get('/', (req, res) => {
    console.log(2);
});

app.listen(3000);
