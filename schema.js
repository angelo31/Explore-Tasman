var pg = require('pg').native
, connectionString = process.env.DATABASE_URL
, client
, query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE tasman_table (userid serial, imgName text, imagedescription text, imageurl text)');

/* 

CREATE TABLE tasman_table (
	user_id serial PRIMARY KEY,
	name text not null,
	imgname text not null,
	img bytea not null,
)

*/

query.on('end', function(result) { 
	console.log(JSON.stringify(result))
	client.end();
});
