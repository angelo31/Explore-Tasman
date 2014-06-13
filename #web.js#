var express = require('express')
// , bodyParser = require('body-parser')
// ,app = express.createServer(express.logger())
, app = express()
, pg = require('pg').native
, fs = require('fs')
// , connectionString = process.env.DATABASE_URL || "http://intense-harbor-6396.herokuapp.com"
, connectionString = process.env.DATABASE_URL
, port = process.env.PORT || 3000
, client
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

// attempt to connect to database
client = new pg.Client(connectionString);
client.connect();

/// Include ImageMagick
// var im = require('imagemagick');

app.get('/', function(req, res) {
	// res.writeHead(200, {'Content-Type': 'text/plain' });
	// res.end(form);
	res.sendFile("index.html")
});

/// Post files
app.post('/upload', function (req, res) {
	if(!req.body.hasOwnProperty("id") || !req.body.hasOwnProperty("imageName") || !req.body.hasOwnProperty("description") || !req.body.hasOwnProperty("url")) {
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

var row1 = {
	id: req.body.id,
	imageName: req.body.imageName,
	description: req.body.description,
	imageURL: req.body.url
};

var id = req.body.id,
	imageName= req.body.imageName,
	description= req.body.description,
	imageURL= req.body.url

console.log("Received info: ", row1);

/*
client.query("INSERT into tasman_table (userid, imgName, imagedescription, imageurl) VALUES($1, $2, $3, $4)",
	[id, imageName, description, imageURL],
	function(err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("row inserted: " + id + " " + imageURL)
		}
	});*/

res.send(row1);
// res.redirect('/');
	// });
});

app.get("/url", function (req, res) {
	var imageURL =  "https://exploretasman.s3.amazonaws.com/events/1402229247866-icon.png";
	var inJSON  = {"url": imageURL};
/*
var query = client.query("SELECT imageurl FROM tasman_table WHERE imagedescription='test d'")

query.on("row", function(result) {
	console.log(result);

	if(!result) {
		return res.send("No data found!");
	}
	else {
		console.log(result)
		var json = {"url": result.imageURL};
		res.send(json);
	}
})*/
	res.send(inJSON);
});


/* testing gps */
app.get("/gps", function (req, res) {
	/*
	var imageURL = "https://exploretasman.s3.amazonaws.com/events/1402248566277-icon.png";
    var content = "<h4>Frenchman Bay</h4><br><img src ='" + imageURL + "'/>";
    var img = "https://s3-us-west-2.amazonaws.com/exploretasman/events/1402371857544-image.jpg";
    var content1 = "<h4>Abel Tasman</h4><br><img src ='" + img + "'/>";
    var diffIcon = "http://maps.google.com/mapfiles/marker_green.png";
    var icon = "https://maps.google.com/mapfiles/kml/shapes/";
	var data = [{
        "address": "-40.9206539,173.0071976",
        "content": content,
        icon: diffIcon
    }, {
        "address": "-40.921829,173.057123",
        "content": content1,
        icon: icon + "schools_maps.png"
    }, {
        "address": "-40.939611,173.061179",
        "content": "Abel Tasman Walkway"
    }, {
        "address": "-40.939611,173.117179",
        "content": "Abel Tasman boat",
        icon: icon + "info-i_maps.png"
    }];
	// res.send(data);

	client.query(INSERT into gps_table (address, content, icon)
VALUES ('-40.9206539,173.0071976', '<h4>Frenchman Bay</h4><br><img src =''https://exploretasman.s3.amazonaws.com/events/1402248566277-icon.png''/>', 'http://maps.google.com/mapfiles/marker_green.png'), 
('-40.921829,173.057123', '<h4>Abel Tasman</h4><br><img src =''https://s3-us-west-2.amazonaws.com/exploretasman/events/1402371857544-image.jpg''/>', 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png'), 
('-40.939611,173.061179', 'Abel Tasman Walkway', 'https://maps.google.com/mapfiles/ms/micons/camera.png'), 
('-40.939611,173.117179', 'Abel Tasman boat', 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png'));
*/

var gpsData = [];
	// var query = client.query("SELECT array_to_json(array_agg(row_to_json(gps_table))) from gps_table;");
	// var query = client.query("SELECT row_to_json(gps_table) from gps_table");
	var query = client.query("SELECT * from gps_table");

	query.on("row", function (result) {
			gpsData.push(result);
	});

	query.on("err", function(err) {
		return res.send("error: ", err);
	})

	query.on("end", function(row, result) {
		return res.send(gpsData);
	})
});

var awsKey = "AKIAJJUYC4EAIF7D2XDQ";
var secret64 = "dG1MRDNQOEl3ZlVic1hxN3Y4NzFldmJaeWplaDE1dkVudk1ZbEZHZw==";
var secret = new Buffer(secret64, 'base64').toString('ascii');
var bucket = "exploretasman";

/*
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
});*/

app.listen(port, function () {
	console.log('Listening on:', port);
});
