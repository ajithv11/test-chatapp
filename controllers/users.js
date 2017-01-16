var User    = require('../models/user');
var logger  = require('../helpers/logger');
var bcrypt 	= require('bcrypt-nodejs');
var jwt     = require('jsonwebtoken');
var config  = require('../config/config'); // get our config file
var globals = require('../config/global');


module.exports.set = function(app) {
  	
  	app.set('superSecret', config.secret); 
  
	app.get('/users', function (req, res) {
		res.send('User Page!')
	})
	
	
	
	// Registration Submission Handiling goes here
	app.post('/api/users/add',function(req, res){	
		
		var user 		= req.body;
		var params 		= {};
		var response 	= {};
		params.username = user.username;	
		params.email    = user.email;
		
		
		User.checkUsername(params,function(err,userData){
					
			if(err){
				logger.error('Error: User Find, '+err);
			} else{
				
						if(userData.length === 0){
							
							response.exists = 0;
							// Insert goes here
							user.user_type="user";
							User.addUser(user,function(err,user){
								if(err){
									
									logger.error('Error: User Insertion, '+err);
									response.success = 0;
									response.err = err;
									
								}else{
									response.user = user;
									response.success = 1;
								}
								
								res.json(response);
							});
							
							
						} else{
							//console.log(userData);
							response.exists = 1;
							response.username = userData[0].username;
							response.email = userData[0].email;
							res.json(response);
						}
						
						
				
			}
		});	
		
	});
	// Registration Submission Handiling ends here
	
	
	app.post('/api/users/login',function(req, res){	
  		//console.log(globals);
		
  		var user 		= req.body;
		var response 	= {};
		var onlineObjs =  Object.keys(globals.onlineSocket);
		
		if(onlineObjs.indexOf(user.login_username) >= 0){
				response.success = 0;	
				response.message = 'User already logged in, Please logout to continue.';
				res.json(response);
		} else{
		
			User.loginUser(user,function(err,userData){
				
				//console.log(userData);
				response.data = userData;
				if(userData.length === 0){
					response.success = 0;
					response.message = 'Invalid username or password';	
				}else{
					var password = userData[0].password;
					if(bcrypt.compareSync(user.login_password, password)){
						
						//console.log(userData);
						var token = jwt.sign(userData[0], app.get('superSecret'), {
						  expiresIn: 86400 // expires in seconds
						});
						
						response.data = userData[0];
						response.success = 1;	
						response.token   = token;	
						
						
					}else{
						response.success = 0;	
						response.message = 'Invalid username or password';	
					}				
				}
				res.json(response);
			});	
		}
		
		
  	});
	
	
	app.post('/api/users/authcheck',function(req, res){	
		var response 	= {};
		//console.log(req.body);
		//console.log(req.headers);
		var token = req.body.token || req.query.token || req.headers['x-access-token'];		
		//console.log(token.id);
		
		
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
		  if (err) {
			response.timeout = true;
		  } else {
			response.timeout = false;
			response.data = decoded._doc;
		  }
		  
		  
		  res.json(response);	
		});
		
		
		
										 
	});
	
	
	app.post('/api/users/getall',function(req, res){	
	
		var response 	= {};
		
		User.getAll({},function(err,userData){
		
			if(err){
				logger.error('Error: User Find getAll() : , '+err);
			} else{
				
				response.users = userData;
				res.json(response);				
			
			}
		
		});	
		
	
	});
	
}