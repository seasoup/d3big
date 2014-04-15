var express = require('express');
var app = express();
var http = require( 'http' );
var server = http.createServer( app );

var oneYear = 31557600000;

app.use( "/*", express.bodyParser() );
app.use( "/*", express.compress() );
app.use( app.router );
app.use( express.static('public'), { maxAge: oneYear });

server.listen(3001);
console.log("Now listening on port 3001");
