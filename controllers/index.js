var users = require('./users.js');
var chat = require('./chat.js');
var room = require('./room.js');

module.exports.set = function(app,io) {
	
   app.get('/', function (req, res) {
	  res.send('Home Page!')
   });
   
   // Importing sub controllers
   users.set(app);
   chat.set(app,io);
   room.set(app,io);

   
}