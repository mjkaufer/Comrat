var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/post', function(req, res){
	console.log(req.body);
	res.status(200);
	res.end("Great");
});

app.get('/', function(req, res){
	res.status(200);
	res.end("Hi");
});


var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});