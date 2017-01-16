var mongoose	= require("mongoose");


// Room Schema
var roomUserSchema = mongoose.Schema({
					rooms : {type : mongoose.Schema.Types.ObjectId, ref: 'Room' },
					users : {type : mongoose.Schema.Types.ObjectId, ref: 'User' },
					active : {type : Number},
					date : {type : Date}
						  
});



// This variable can be accessed from outside
var RoomUser = module.exports = mongoose.model(
										   	'RoomUser',//Singular Name of database
											roomUserSchema
										  );





module.exports.addMembers = function(memData,callback){	
	RoomUser.create(memData,callback);	
}



module.exports.listRoom = function(memData,callback){	
RoomUser.find({})
     .populate('rooms')
	 .populate('users')
     .exec(callback);
};


module.exports.listUserRoom = function(userId,callback){	
RoomUser.find({'users':userId})
     .populate('rooms')
	 .populate('users')
     .exec(callback);
};

