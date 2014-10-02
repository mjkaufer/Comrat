var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var growl = require('growl');
var ngrok = require('ngrok');
var request = require("request");
var fs = require("fs");
var app = express();
var port = process.env.PORT || 3000;
var savePath = "images/";

var header = {
	"User-Agent": "IcoGrab"
}; //universal header


var topModule = module;

while(topModule.parent)
  topModule = topModule.parent;

var appDir = path.dirname(topModule.filename);

function fullPath(username){
	return appDir + "/" +imgPath(username);
}

function mkdir(path) {
	try {
		fs.mkdirSync(path);
	} catch (e) {
		//don't do anything - folder exists.
	}
}

function makeOptions(u) {
	return {
		url: u,
		headers: header
	};
}

function imgPath(username) { //hassle-free way to generate theimgPaths
	return savePath + username + ".jpg"; //.png was breaking for some images
}

function exists(username){
	return fs.existsSync(imgPath(username));
}

function grabIcon(username, force, callback) { //grabs the user's icon from GitHub and saves it in an images folder, if it's not already there - force is a bool whether or not to force overwrite
	force = force || false; //default to no force, meaning won't overwrite images if it exists already - will save time and resources, etc.
	callback = callback || function(){};
	if (!force && fs.existsSync(imgPath(username))) { //if the user doesn't want to force override and the file exists
		console.log("Image " + username + ".jpg exists!")
		callback(username, false);
		return; //stop doing stuff - we don't want to overwrite
	}

	var options = makeOptions("https://api.github.com/users/" + username);

	var callback2 = function(error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			var avatar = body.avatar_url;
			avatar = avatar.substring(0, avatar.indexOf("?")); //gets rid of the stuff at the end, just in case

			var avOptions = makeOptions(avatar);

			request(avOptions, function() {
				console.log("Image " + imgPath(username) + " saved");
				callback(username, true);
			}).pipe(fs.createWriteStream(imgPath(username)));

		}
	};

	request(options, callback2);

}


mkdir(savePath);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var events = {//we'll do a non-force thing to reduce latency and the like
	"push": function(body){
		var pusher = body.pusher.name;
		var amount = body.commits.length;
		var repo = body.repository.name;
		if(amount==20)//github cuts off the commits pushed to 20, so at 20, there could be more
			amount = "20+";
		var verb = amount==1 ? "commit" : "commits";
		//todo - implement pro-pic (not returned in API call, could be done w/ JSON call but might lag :( )
		// grabIcon(pusher, false, function(){
		// 	growl(pusher + " just pushed " + amount + " " + verb + " in the repo " + repo + "!", {title: "Push in " + repo, image:path(pusher)});
		// 	console.log(path(pusher))
		// })
		growl(pusher + " just pushed " + amount + " " + verb + " in the repo " + repo + "!", {title: "Push in " + repo, image:fullPath(pusher)});

	},
	"pull_request": function(body){
		if(action=="labeled" || action=="unlabeled" || action=="synchronize")//ones we don't care about, I hope/think
			return;

		var requester = body.pull_request.user.login;
		var avatar = body.pull_request.user.avatar_url;
		var repo = body.pull_request.repo.name;
		var num = body.number;
		var action = body.action;

		growl(requester + " just " + action + " pull request #" + num + " in " + repo, {title: "Pull in " + repo, image:avatar});

	},
	"issues": function(body){
		if(action=="labeled" || action=="unlabeled")
			return;

		var requester = body.issue.user.login;
		var avatar = body.issue.user.avatar_url;
		var repo = body.repository.name;//funny how it's repository here and repo in the pull_request...
		var num = body.issue.number;
		var action = body.action;

		growl(requester + " just " + action + " issue #" + num + " in " + repo, {title: "Issue in " + repo, image:avatar});

	},
	"member": function(body){
		var added = body.member.login;
		var addedAvatar = body.member.avatar_url;
		var repo = body.repository.name;
		var adder = body.sender.login;

		growl(adder + " just added " + added + " to " + repo, {title: added + " added to " + repo, image:addedAvatar});

	}
};

function displayImage(){

}


app.post('/post', function(req, res){
	var event = req.header('X-Github-Event');//name of the event

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

ngrok.connect(port, function (err, url) {
    console.log("ngrok url");
    console.log(url);
    growl("Your url is " + url, {title: "Ngrok URL generated"});
});

// growl("Test",{image:"./"+path("mjkaufer")});