var express = require("express");

var app = express();

// Setup handlebars view engine
var handlebars = require("express3-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");


app.set("port", process.env.PORT || 3000);

// middleware to server Static Files
app.use(express.static(__dirname + '/public'));


app.get("/", function (req, res) {
    // res.type("text/plain");
    res.render("home");
});



var fortunes = [
    "Conquer your fears or they will conquer you.",
    "River needs springs.",
    "Do not fear what you don't know.",
    "You will have pleasent surprise.",
    "Whenever possible, keep it simple",
]

app.get("/about", function (req, res) {
    // res.type("text/plain");
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
    res.render("about", { fortune: randomFortune });
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