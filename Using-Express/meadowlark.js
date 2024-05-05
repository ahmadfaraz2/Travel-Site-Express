var express = require("express");

var app = express();

// Setup handlebars view engine
var handlebars = require("express3-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");


app.set("port", process.env.PORT || 3000);


app.get("/", function (req, res) {
    // res.type("text/plain");
    res.render("home");
});


app.get("/about", function (req, res) {
    // res.type("text/plain");
    res.render("about");
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
    console.log("Express started on http://localhost: " + app.get("port") + "; press Ctrl-C to terminate.");
});