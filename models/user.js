var mongoose	= require("mongoose"),
bcrypt = require('bcrypt-nodejs');

// User Schema
var userSchema = mongoose.Schema({
					first_name : {
								type : String,
								required : [true, 'First name is required']
					},
					last_name : {
								type : String
					},
					username : {
								type : String,
								required : [true, 'Username field is required']
					},
					password : {
								type : String,
								required : [true, 'Password field is required']
					},
					email : {
								type : String,
								required : [true, 'Email field is required'],
								match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
					},
					user_type : {
								type : String
					},
					about : {
								type : String
					}
						  
});

// This variable can be accessed from outside
var User = module.exports = mongoose.model(
										   	'User',//Singular Name of database
											userSchema
										  );





// Create new user
module.exports.addUser = function(user,callback){	
	var salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(user.password, salt);
	User.create(user,callback);	
}

// Check Username or password exists
module.exports.checkUsername = function(params,callback){	
	 User.find({$or:[ {'username':params.username}, {'email':params.email} ]}, callback);	
}


module.exports.loginUser = function(params,callback){	
	User.find({'username':params.login_username}, callback);
}

module.exports.userById = function(params,callback){	
	User.find({ _id: { "$in" : params} }, callback);
}


module.exports.getAll = function({},callback){	
	User.find({}, callback);
}



module.exports.getOnlineUsers = function(params,callback){	

    var arrayUser = [];
	
	if (typeof params !== "undefined") {
		Object.keys(params).forEach(function(key) {
			arrayUser.push(params[key])
		});
	}
	
	User.find({ username: { "$in" : arrayUser} }, null, {sort: {first_name: 1 }}, callback);
	//User.find({ username: { "$in" : arrayUser} }, callback);

}

