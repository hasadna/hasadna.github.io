var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var removeHashKeys = require("./serverUtill").removeHashKeys;
var mime = require("./serverUtill").mime;
var port = process.argv[2] || 8888;
var beautify = require('js-beautify').js_beautify;
function server(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    if (request.method === 'POST') {
        request.on('data', function(chunk) {
            var obj = JSON.parse(chunk.toString());
            removeHashKeys(obj);
            var txt = JSON.stringify(obj);
            var prettyData = beautify(txt, {indent_size: 4});
            var fileContents = "var eKnightsData = "
                    + prettyData
                    + ';\n'
                    + '\n// If we are running from node let be a module.'
                    + '\nif (typeof module !== \'undefined\' && module.exports)'
                    + '\n\tmodule.exports.eKnightsData = eKnightsData;';
            fs.writeFile("../eKnightsData.js", fileContents, function(err) {
                if (err)
                    console.error(err);
                else
                    console.log("file seved!");
            });
        });
        request.on('end', function() {
            // empty 200 OK response for now
            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.write('OK', 'utf-8');
            response.end();
            return;
        });
        return;
    }
    else {
        path.exists(filename, function(exists) {
            if (!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory())
                filename += 'editor.html';
            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type":
                                mime.lookupExtension(path.extname(file))});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }
}

// Copy eKnightsData.js to work with.
fs.createReadStream('../eKnightsData.js').pipe(fs.createWriteStream('eKnightsData.js'));
// Remove eKnightsData.js
function exitHandler(options, err) {
    fs.unlink('eKnightsData.js', function(err) {
        if (err)
            throw err;
        console.log("\nbye!");
        process.exit(1);
    });
}
// On exit call to exitHandler
process.on('SIGINT', exitHandler.bind(null, {exit: true}));


var serv = http.createServer(server);
serv.listen(parseInt(port, 10));
console.log("eKnights editor running at\nhttp://localhost:" + port + "/\n\nCTRL + C to shutdown");

