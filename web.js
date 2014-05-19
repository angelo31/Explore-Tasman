var express = require('express')
// , bodyParser = require('body-parser')
, app = express()
// , pg = require('pg').native
// , connectionString = process.env.DATABASE_URL
// , start = new Date()
// , port = process.env.PORT
// , client;

// make express handle JSON and other requests
app.use(express.bodyParser());
// serve up files from this directory 
app.use(express.static(__dirname));
// if not able to serve up a static file try and handle as REST invocation
app.use(app.router);


app.post('/location', function(req, res) {
  res.send("Hello World")
});

// use PORT set as an environment variable
var server = app.listen(process.env.PORT, function() {
    console.log('Listening on port %d', server.address().port);
});