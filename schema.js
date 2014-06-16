var pg = require('pg').native
, connectionString = process.env.DATABASE_URL
, client
, query;

client = new pg.Client(connectionString);
client.connect();

// database table to store userID, title of image, image description, category for image, GPS coordinates of where user uploaded photo, and imageURL of image in bucket
query = client.query('CREATE TABLE tasman_table (userid text, title text, imagedesc text, category text, gps text, imageurl text)');

// query = client.query('CREATE TABLE gps_table (address text, content text, icon text)'); //create table

query.on('end', function(result) { 
	// console.log(JSON.stringify(result))
	client.end();
});
