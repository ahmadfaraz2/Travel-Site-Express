var express = require("express");
var fortune = require("./lib/fortune.js");
var formidable = require("formidable")

var app = express();

// Setup handlebars view engine
var handlebars = require("express3-handlebars").create({ 
    defaultLayout: "main", 
    helpers : {
        section : function(name, options){
            if (!this._section) this._section = {};
            this._section[name] = options.fn(this);
            return null;
        }
    }
    });
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

app.use(require('body-parser')());

// Chapter 8 Form Processing
app.get('/newsletter', function(req, res){
    // we will learn about CSRF later... for now, we just 
    // provide a dummy value
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF Token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.post('/process', function(req, res){
    if (req.xhr || req.accepts('json, html') === 'json'){
        res.send({success : true});
    }
    else 
    {
        res.redirect(303, '/thank-you');
    }
});

app.get('/contest/vacation-photo', function(req, res){
    var now = new Date();
    res.render('contest/vacation-photo', {
        year : now.getFullYear(),
        month : now.getMonth(),
    });
});


app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if (err) return res.redirect(303, '/error');
        console.log('Received fields:');
        console.log(fields);
        console.log('Received Files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
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



// Chapter 6 Example codes

// Example 6.2 response code other than 200
app.get('/error', function(req, res){
    res.status(500);
    res.render('error');
    // res.status(500).render('error');
});

// Example 6.3 Passing a context to view, including querystring, cookie and session values
app.get('/greeting', function(req, res){
    res.render('about', {
        message : 'Welcome',
        style : req.query.style,
        userid : req.cookies.userid,
        username: req.session.username,
    });
});


// Example 6.4 Rendering a view without a layout

// the following layout does not have layout file, so views/no-layout.handlebars
// must include all necessary HTML
app.get('/no-layout', function(req, res){
    res.render('no-layout', {layout: null});
});

// Example 6.5 Rendering a view with custom layout

// the layout file view/layouts/custom.handlebars will be used
app.get('/custom-layout', function(req, res){
    res.render('custom-layout', {layout: 'custom'});
});

// Example 6.6 Rendering plain text output
app.get('/test', function(req, res){
    res.type('plain/text');
    res.send('This is a test');
});


// Example 6.9 Basic Form Processing

// body-parser middleware must be linked in
app.post('/process-contact', function(req, res){
    console.log('Received contact from ' + req.body.name +
    ' <'+ req.body.email + ' >');
        // save to the database
        return redirect(303, '/thank-you');
});

// Example 6.10

// body-parser middleware must be linked in
app.post('/process-contact', function(req, res){
    console.log('Received contact from ' + req.body.name + 
    ' <' + req.body.email + ' >');
    try {
        // save to database
        return res.xhr ?
        res.render({success : true}):
        res.redirect(303, 'thank-you');
    }
    catch(ex) {
        return res.xhr ?
            res.json({error: 'Database Error'}):
            res.redirect(303, '/database-error');
    }
});


var tours = [
    {id: 0, name: 'Hood River', price: 99.99},
    {id: 1, name: 'Oregon Coast', price: 149.95 },
];

// Example 6.11 Simple GET endpoint returning only JSON
app.get('/api/tours', function(req, res){
    res.json(tours);
});


// Example 6.13 PUT endpoint for updating

// API that updates a tour and returns JSON; params are passed using querystring
app.put('/api/tour/:id', function(req, res){
    var p = tours.some(function(p){return p.id == req.params.id});
    if (p) {
        if (req.query.name){
            p.name = req.query.name;
        }
        if (req.query.price){
            p.price = req.query.price;
        }
        res.json({success: true});
    }
    else {
        res.json({error: 'No such tour exists.'});
    }
});

// Example 6.14 shows a DEL endpoint for deleting

// API that deletes a product
app.delete('/api/tour/:id', function(req, res){
    var i;
    for( i=tours.length-1; i>=0; i--){
        if (tours[i].id == req.params.id) break;
        if ( i>=0 ){
            tours.splice(i, 1);
            res.json({success: true});
        }
        else {
            res.json({error: 'No such tour exists.'});
        }
    }
});

function getWeatherData(){
    return {
        locations : [
            {
                name: 'Poland',
                forecastUrl : 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl : 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather : 'Overcast',
                temp : '54.1 F (12.3 C)'
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ]
    };
}


app.use(function(req, res, next){
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});


// Example 6.7 adding a Error handler

// this should apear AFTER all of your routes
// note that even if you don't need the "next" function, it must be included for Express
// to recognize this as an error handler
app.use(function(err, req, res, next){
    consolo.error(err.stack);
    res.status(500).render('error');
});



// Example 6.8 Adding a 404 handler

// this should appear after all of your routes
// app.use(function(req, res){
//     res.status(404).render('not-found');
// });



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