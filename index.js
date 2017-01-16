var express		= require("express");
var app			= express();
var server 		= require('http').createServer(app);
var io  		= require('socket.io').listen(server);
var bodyParser	= require("body-parser");
var mongoose	= require("mongoose");

app.set('port', (process.env.PORT || 4001));

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());


app.all('/*', function(request, response, next) {
      response.header("Access-Control-Allow-Origin", "*");
      response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
      if (request.method == 'OPTIONS') {
            response.status(200).end();
      } else {
            next();
      }
});
 

var DBoptions = {user: "root",pass:"root123"};
//mongoose.connect("mongodb://localhost/chatapp",DBoptions,function(err) {
mongoose.connect("mongodb://ds163738.mlab.com:63738/chatapp",DBoptions,function(err) {																  
																  
    if (err){
		console.log( err );
	}
});
var db = mongoose.connection;


var controllers = require('./controllers');
controllers.set(app,io);



//require('./routes')(app, io);
//require('./socket')(app, io);


var listen = server.listen(app.get('port'), function(){
	console.log("Server listening on PORT:"+app.get('port')+" Visit http://localhost:"+app.get('port'));
});
