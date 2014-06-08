var express = require('express')
// , bodyParser = require('body-parser')
// ,app = express.createServer(express.logger())
, app = express()
, pg = require('pg').native
, fs = require('fs')
// , connectionString = process.env.DATABASE_URL || "http://intense-harbor-6396.herokuapp.com"
, connectionString = process.env.DATABASE_URL
, port = process.env.PORT || 3000
// , client
// , knox = require('knox')
, crypto = require("crypto")
;

// make express handle JSON and other requests
app.use(express.bodyParser());
// // serve up files from this directory 
app.use(express.static(__dirname));
// // if not able to serve up a static file try and handle as REST invocation
app.use(app.router);

// AWS stuff
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var amazon_url = "http://s3.amazonaws.com/" + S3_BUCKET;

// attempt to connect to database
// client = new pg.Client(connectionString);
// client.connect();

/// Include ImageMagick
// var im = require('imagemagick');

app.get('/', function(req, res) {
	// res.writeHead(200, {'Content-Type': 'text/plain' });
	// res.end(form);
	res.sendFile("index.html")
	// res.send("No.")
})

/// Post files
app.post('/upload', function (req, res) {
	if(!req.body.hasOwnProperty("url")) {
		res.statusCode = 400;
		return res.send("Error 400: Post syntax incorrect.")
	}
/*
	fs.readFile(req.files.image.path, function (err, data) {
		// console.log("data", data)
		// var newData = '\\x' + data;
		// console.log("hex data", data)
		var imageName = req.files.image.name
/*
		/// If there's an error
		if(!imageName){
			console.log("There was an error")
			res.redirect("/");
			res.end();
		}

		else {
			var newPath = __dirname + "/uploads/fullsize/" + imageName;
			var thumbPath = __dirname + "/uploads/thumbs/" + imageName;

			// var newPath = "http://intense-harbor-6396.herokuapp.com/uploads/fullsize/" + imageName;
			// var thumbPath = "http://intense-harbor-6396.herokuapp.com/uploads/thumbs/" + imageName;
		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {

		  	/// write file to uploads/thumbs folder
		  	im.resize({
		  		srcPath: newPath,
		  		dstPath: thumbPath,
		  		width:   200
		  	}, function(err, stdout, stderr){
		  		if (err) throw err;
		  		console.log('resized image to fit within 200x200px');
		  	});

		  	// console.log((JSON.stringify(req.files)))
		  	// res.redirect("/uploads/fullsize/" + imageName);

			// res.redirect("/");
			// res.end();
		  });
		});
/*
	client.query("INSERT INTO tasman_table (imgName, img) VALUES ($1, $2)", 
		[imageName, newData],
		function(err, writeResult) {
			console.log("err", err, "pg writeResult", writeResult)
		});

		  	res.redirect("/uploads/thumbs/" + imageName);
/*
		  	client.query("INSERT INTO tasman_table (imgName, image) VALUES ($1, $2)", 
		  		[imageName, data],
		  		function(err, writeResult) {
		  			console.log("err", err, "pg writeResult", writeResult)
		  		});*/
		// }

var experiation = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();

POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
            "conditions": [
            {"bucket": "exploretasman"},
            ["starts-with", "$key", ""],
            {"acl": "public-read"},                           
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
            ]
          };

    var secret64 = "dG1MRDNQOEl3ZlVic1hxN3Y4NzFldmJaeWplaDE1dkVudk1ZbEZHZw==";
    var secret = new Buffer(secret64, 'base64').toString('ascii');

    var policy = JSON.stringify(POLICY_JSON);

    var policyBase64 = new Buffer(JSON.stringify(POLICY_JSON), 'utf8').toString('base64');

    // policy = eyJleHBpcmF0aW9uIjoiMjAyMC0xMi0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiZXhwbG9yZXRhc21hbiJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCw1MjQyODgwMDBdXX0= 

	var signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');

var imageURL = req.body.url;
console.log("Received url: ", imageURL)
res.send(imageURL)
// res.redirect('/');
	// });
});

app.get("/url", function (req, res) {
	// var imageURL =  "https://exploretasman.s3.amazonaws.com/events/1402229247866-icon.png";
	var inJSON  = {"url": imageURL};
	res.send(inJSON);
})

var awsKey = "AKIAJJUYC4EAIF7D2XDQ";
var secret64 = "dG1MRDNQOEl3ZlVic1hxN3Y4NzFldmJaeWplaDE1dkVudk1ZbEZHZw==";
var secret = new Buffer(secret64, 'base64').toString('ascii');
var bucket = "exploretasman";

function sign(req, res, next) {
 
    var fileName = req.body.fileName,
        expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
 
    var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            ["starts-with", "$key", ""],
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
        ]};

    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
}

app.post('/signing', sign);


app.get("/get", function (req, res, next) {
	client.query('select img from tasman_table limit 1',
		function(err, readResult) {
			console.log("err", err, "pg readResult", readResult);
			fs.writeFile('')
		})
})

app.post('/upload/photos', function (req, res) {

	var serverPath = 'images/' + req.files.userPhoto.name;

	console.log(__dirname + " /public/" + serverPath)

	fs.rename ( 
		req.files.userPhoto.path,
		__dirname + '/public/' + serverPath,
		function (error) {
			if(error) {
				res.send( {
					error: "Something went wrong!"
				})
				return;
			}

			res.send({
				path: serverPath
			});
		}
		);
})

/// Show files
app.get('/uploads/fullsize/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFile( __dirname + "uploads/fullsize/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');
});


app.get('/uploads/thumbs/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFile( __dirname + "/uploads/thumbs/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');
});


/*
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
	client.query('INSERT INTO tasman_table(text) VALUES($1)', [coords]);

  // should send back the location at this point
  console.log("Added!");
  //newCoords.pos = coords.length-1;
  res.json(true);
  res.send(newCoords);
});

app.get('/location/random', function(req, res) {
	var id = Math.floor(Math.random() * coords.length);
	var q = coords[id];
	console.log("Sent!");
	res.send(q);
});


//get user id...
app.get('/user:id', function(req, res) {
	res.send("Hello World")
});

//get photos and save in database...
app.post("/gallery", function(req, res) {


});

//get photos and show in gallery...
app.get("/gallery", function(req, res) {


});

app.get('/get/stats', function(req, res) {

  // client.query('INSERT INTO visits(date) VALUES($1)', [date]);

  query = client.query('SELECT * FROM tasman_table');
  query.on('row', function(result) {
  	console.log(result);

  	if (!result) {
  		return res.send('No data found');
  	} else {
  		res.send('data from database: ' + result);
  	}
  });
});
*/

app.listen(port, function () {
	console.log('Listening on:', port);
});
