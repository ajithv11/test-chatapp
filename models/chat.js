var mongoose	= require("mongoose");


// Chat Schema
var chatSchema = mongoose.Schema({
					sender_id : {
								type : String
					},
					receiver_id : {
								type : String
					},
					message : {
								type : String
					},
					date : {
								type : Date
					}
						  
});

// This variable can be accessed from outside
var Chat = module.exports = mongoose.model(
										   	'Chat',//Singular Name of database
											chatSchema
										  );

// New message
module.exports.newMessage = function(message,callback){	
	Chat.create(message,callback);	
}

// Get sender and receiver messages
module.exports.getMessages = function(params,callback){	

	 Chat.find({
				  $or: [
					  { $and: [{'sender_id':params.sender_id}, {'receiver_id':params.receiver_id}] },
					  { $and: [{'receiver_id':params.sender_id}, {'sender_id':params.receiver_id}] }
				  ]
			  },
			  null, 
			  {sort: {date: -1 }, limit : 10}, 
			  callback);
}


// Create new single chat
module.exports.addMessage = function(message,callback){	
	Chat.create(message,callback);	
}


/*
module.exports.loginUser = function(params,callback){	
	User.find({'username':params.login_username}, callback);
}


module.exports.getOnlineUsers = function(params,callback){	

    var arrayUser = [];
	
	Object.keys(params).forEach(function(key) {
		arrayUser.push(params[key])
	});
	
	User.find({ username: { "$in" : arrayUser} }, null, {sort: {first_name: 1 }}, callback);
	//User.find({ username: { "$in" : arrayUser} }, callback);

}
*/