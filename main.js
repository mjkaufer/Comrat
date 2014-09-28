var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/post', function(req, res){
	console.log(req.body);

	res.status(200);
	res.end();
});

app.get('/', function(req, res){
	res.status(200);
	res.end("Hi");
});


var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});