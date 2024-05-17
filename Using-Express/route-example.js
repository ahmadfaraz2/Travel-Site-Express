var express = require('express');

var app = express();


app.use(function(req, res, next){
    console.log('\n\nALWAYS');
    next();
});


app.get('/a', function(req, res){
    console.log('/a: route terminated');
    res.send('a');
});

app.get('/a', function(req, res){
    console.log('/a: Never called')
});

app.get('/b', function(req, res, next){
    console.log('/b: route not terminated');
    next();
});


app.use(function(req, res, next){
    console.log('Sometimes');
    next();
});

app.get('/b', function(req, res, next){
    console.log('/b (part 2): error thrown');
    throw new Error('b failed');
});

app.use('/b', function(err, req, res, next){
    console.log('/b error detected and passed on');
    next(err);
});

app.get('/c', function(err, req){
    console.log('/c:error thrown ');
    throw new Error(' c failed');
});

app.use('/c', function(err, req, res, next){
    console.log('/c Error detetected but no passed away');
    next();
});

app.use(function(err, req, res, next){
    console.log('Unhandled errors detected: ' + err.message);
    res.send('500, - Server Error')
});

app.use(function(res, res){
    console.log('route not handled');
    res.send('404 - not found');
});

app.listen(3000, function(){
    console.log('listening on port 3000');
});