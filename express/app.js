var express = require('express');

var app = express();

// This allows us tooverride the port by setting an environment value before you start the server.
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

// 首先，我们要使用一些中间件来检测在查询字符串 test=1
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});


// router
app.get('/', function(req, res) {
    // res.type('text/plain');
    // res.send('Home Page');
    res.render('index', {
        title: 'HOME'
    });
});

// the route for the About page will work for /about, /About, /about/, /about?foo=bar, /about/?foo=bar
app.get('/about', function(req, res) {
    // res.type('text/plain');
    // res.send('About Page');

    res.render('about', {
        title: 'ABOUT',
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});




/*
app.get('/about*',function(req,res){
 // send content....
})
app.get('/about/contact',function(req,res){
 // send content....
})
app.get('/about/directions',function(req,res){
 // send content....
})
// In this example, the /about/contact and /about/directions handlers will never be matched because the first handler uses a wildcard in its path: /about*

 */


// custom 404 page
// app.use is the method by which Express adds middleware
// If we put the 404 handler above the routes, the home page and about page would stop working.
app.use(function(req, res) {
    // While it’s still possible to use res.writeHead and res.end, it isn’t necessary or recommended.

    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl + C to terminate');
});