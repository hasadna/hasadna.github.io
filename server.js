var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.sendfile('./index.html');
});

app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/dest", express.static(__dirname + "/dest"));
app.listen(3000, function(){
    console.log("Server listening at 127.0.0.1:3000");
});