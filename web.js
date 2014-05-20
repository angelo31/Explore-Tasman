var express = require('express')
// , bodyParser = require('body-parser')
, app = express()
, pg = require('pg').native
, connectionString = process.env.DATABASE_URL
// , start = new Date()
// , port = process.env.PORT
, client;

var coords = [
{ lat: -42.5667, lon: 32.767 }, 
{ lat: 35.76556, lon: 75.5675 }, 
{ lat: -35.65756, lon: 20.656 }, 
{ lat: 67.356756, lon: 45.896 }, 
{ lat: -50.567, lon:185.3450 }, 
{ lat: 0, lon: 0 }, 
{ lat: -40.930, lon: 173.050 }
]

// make express handle JSON and other requests
app.use(express.bodyParser());
// serve up files from this directory 
app.use(express.static(__dirname));
// if not able to serve up a static file try and handle as REST invocation
app.use(app.router);


app.get("/location", function (req, res) {
	res.send(coords);
});

//do location stuff
app.post('/location', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('lat') || !req.body.hasOwnProperty('lon')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var newCoords = {
		lat : req.body.lat,
		lon : req.body.lon
	};

	coords.push(newCoords);
  // should send back the location at this point
  console.log("Added!");
  //newCoords.pos = coords.length-1;
  res.json(true);
  res.send(newCoords);

});

app.get('/location/random', function(req, res) {
  var id = Math.floor(Math.random() * coords.length);
  var q = coords[id];
  res.send(q);
});


//get user id...
app.get('/user:id', function(req, res) {
	res.send("Hello World")
});

//get photos and post in gallery
app.post("/gallery", function(req, res) {


});


var server = app.listen(3000, function () {
	console.log('Listening on port %d', server.address().port);
});