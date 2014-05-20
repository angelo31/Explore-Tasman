var express = require('express')
// , bodyParser = require('body-parser')
, app = express()
, pg = require('pg').native
, connectionString = process.env.DATABASE_URL
// , start = new Date()
// , port = process.env.PORT
, client;

var coords = [
{ lat: 0, lon: 0 }
]

// make express handle JSON and other requests
app.use(express.bodyParser());
// serve up files from this directory 
app.use(express.static(__dirname));
// if not able to serve up a static file try and handle as REST invocation
app.use(app.router);

//do location stuff
app.post('/location', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('lat') || !req.body.hasOwnProperty('lon')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var newCoords = {
		author : req.body.author,
		text : req.body.text
	};

	coords.push(newCoords);
  // should send back the location at this point
  console.log("Added!");
  newCoords.pos = coords.length-1;
  res.send(newCoords);

});

//get user id...
app.get('/user:id', function(req, res) {
	res.send("Hello World")
});

//get photos and post in gallery
app.post("/gallery", function(req, res) {


});


// use PORT set as an environment variable
var server = app.listen(process.env.PORT, function() {
	console.log('Listening on port %d', server.address().port);
});