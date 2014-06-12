var pg = require('pg').native
, connectionString = process.env.DATABASE_URL
, client
, query;

client = new pg.Client(connectionString);
client.connect();
// query = client.query('CREATE TABLE tasman_table (userid text, imgName text, imagedescription text, imageurl text)');

client.query('CREATE TABLE tasman_table (userid text, imgName text, imagedescription text, imageurl text)');

// var newTable = 'CREATE TABLE gps (address text, content text, icon text);';
query = client.query('CREATE TABLE gps_table (address text, content text, icon text)'); //create table

/* 
CREATE TABLE tasman_table (
	user_id serial PRIMARY KEY,
	name text not null,
	imgname text not null,
	img bytea not null,
)
*/

query.on('end', function(result) { 
	// console.log(JSON.stringify(result))
	client.end();
});
