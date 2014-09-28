var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');
// var config = require('config.json');
var events = {
	"push": function(body){
		var pusher = body.pusher.name;
		var amount = body.commits.length;
		var repo = body.repository.name;
		if(amount==20)//github cuts off the commits pushed to 20, so at 20, there could be more
			amount = "20+";
		var verb = amount==1 ? "commit" : "commits";
		//todo - implement pro-pic (not returned in API call, could be done w/ JSON call but might lag :( )
		growl(pusher + " just pushed " + amount + " " + verb + " in the repo " + repo + "!", {title: "Push in " + repo});

	},
	"pull_request": function(body){
		if(action=="labeled" || action=="unlabeled" || action=="synchronize")//ones we don't care about, I hope/think
			return;
		var requester = body.pull_request.user.login;
		var avatar = body.user.avatar_url;
		var repo = body.pull_request.repo.name;
		var num = body.number;
		var action = body.action;

		growl(requester + " just " + action + " pull request #" + num + " in " + repo, {title: "Pull in " + repo, image:avatar});

	},
	"issues": function(body){

	},
	"member": function(body){

	}
};



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/post', function(req, res){
	var event = req.header('X-Github-Event');//name of the event
	//we'll handle...
	/*
		push (push)
		pull request (pull_request)
		issues (issues)
		member addition (member)
		//maybe team addition in a bit
		we'll add a config file too

	*/

	// console.log(req.body);
	// console.log("----");
	// console.log(event);


	if(events[event] !== undefined)
		events[event](req.body);//run the event if it exists



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