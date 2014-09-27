var express = require('express');
var app = express();

app.post('/post', function(req, res){
	console.log(req.body);
});

app.get('/', function(req, res){
	res.status(200);
	res.end("Hi");
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});