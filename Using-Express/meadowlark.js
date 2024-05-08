var express = require("express");
var fortune = require("./lib/fortune.js");

var app = express();

// Setup handlebars view engine
var handlebars = require("express3-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");


app.set("port", process.env.PORT || 3000);

// middleware to server Static Files
app.use(express.static(__dirname + '/public'));

// middleware to detect test=1 in the querystring.
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') != 'production' && req.query.test === '1';
    next();
});


// routes go here
app.get("/", function (req, res) {
    // res.type("text/plain");
    res.render("home");
});


app.get("/about", function (req, res) {
    // res.type("text/plain");
    res.render("about", 
    {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});


app.get('/headers', function(req, res){
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) s += name + ':' + req.headers[name] + '\n';
    res.send(s);
});


app.disable('X-Powered-By');


app.get('/request-object', function(req, res){
    console.log("Route Accessed");
    const paramsData = Object.entries(req.params).map(([key, value]) => ({ key, value }));
    console.log(paramsData);
    const queryData = Object.entries(req.query).map(([key, value]) => ({ key, value }));
    console.log(queryData);
    const routeData = Object.entries(req.route).map(([key, value]) => ({ key, value }));
    console.log(routeData);
    res.render("request-object", {
        params: req.params,
        query: req.query,
        body: req.body,
        route: req.route,
        headers: req.headers,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        xhr: req.xhr,
        protocol: req.protocol,
        acceptedLanguages: req.acceptedLanguages,
    });
});


app.get('tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});


app.get('tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

// custom 404 page
app.use(function (req, res, next) {
    // res.type("text/plain");
    res.status(404);
    res.render("404");
});


// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    // res.type("text/plain");
    res.status(500);
    res.render("500");
});


app.listen(app.get('port'), function () {
    console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});