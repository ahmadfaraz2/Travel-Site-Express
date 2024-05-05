var http = require("http")
fs = require("fs")


function serveStaticFiles(res, path, contentType, responseCode) {
    if (!responseCode) {
        responseCode = 200;
    }
    // fs.readFile is an asynchronous method for reading files
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("500 - Internal Error");
        }
        else {
            res.writeHead(responseCode, { "Content-Type": contentType });
            res.end(data);
        }
    });
}

http.createServer(function (req, res) {
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch (path) {
        case '':
            serveStaticFiles(res, "/public/home.html", "text/html");
            break;
        case '/about':
            serveStaticFiles(res, "/public/about.html", "text/html");
            break;
        case '/img/logo.jpg':
            serveStaticFiles(res, "/public/img/logo.jpg", "image/jpeg");
            break;
        default:
            serveStaticFiles(res, "/public/nofound.html", "text/html", 404);
            break;
    }
}).listen(3000);








// http.createServer(function (req, res) {
//     var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
//     switch (path) {
//         case '':
//             res.writeHead(200, { "Content-Type": "text/plain" });
//             res.end("Homepage");
//             break;
//         case '/about':
//             res.writeHead(200, { "Content-Type": "text/plain" });
//             res.end("About");
//             break;
//         default:
//             res.writeHead(404, { "Content-Type": "text/plain" });
//             res.end("Not Found");
//             break;
//     }
// }).listen(3000);

console.log("Server started on localhost:3000 press Ctrl-C to terminate...")