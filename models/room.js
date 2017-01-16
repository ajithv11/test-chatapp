var mongoose	= require("mongoose");
var User    	= require('./user');	

	// Room Schema
	var roomSchema = mongoose.Schema({
						name : {
									type : String,
									required : [true, 'Room name is required']
						},
						slug : {
									type : String
						},
						users :{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
						//userid :{type: mongoose.Schema.Types.ObjectId, ref: 'user' },
						active : {
									type : Number
						},
						date : {
									type : Date
						}
							  
	});
	
	
	// This variable can be accessed from outside
	var Room = module.exports = mongoose.model(
												'Room',//Singular Name of database
												roomSchema
											  );





module.exports.addRoom = function(roomData,callback){	
	Room.create(roomData,callback);	
}


module.exports.getRoom = function(rid,callback){	
	Room.findOne({_id:rid},callback);	
}



module.exports.listRoom = function(memData,callback){	
Room.find({'active':1})
     .populate('users')
     .exec(callback);
};