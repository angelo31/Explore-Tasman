var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE visits (date date)');



/* 

CREATE TABLE tasman_table (
	user_id serial PRIMARY KEY,
	name text not null,
	imgname text not null,
	img bytea not null,
)


convert image to base64 before sending to server?
var image = atob(img)

var src =  'data:image/bmp;base64,' + myBase64EncodedData;
var src = 'data:image/bmp;base64,' + btoa(myData);

INSERT into tasman_table(bytea data )...
*/

query.on('end', function(result) { client.end(); });
