var express = require('express');

var app = express();
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);

app.get('/user/:name', function(req, res) {
    var s = '';
    res.set('Content-Type', 'text/plain');
    // for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    // print(s);

    // console.log('route: \n',req.route);
    console.log(req.params.name);

    res.send(s);
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl + C to terminate');
});

function print(str) {
    console.log('----------\n' + str + '----------\n');
}