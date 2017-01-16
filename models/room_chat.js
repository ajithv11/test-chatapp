var mongoose	= require("mongoose");


// Room Schema
var roomChatSchema = mongoose.Schema({
					rooms : {type : mongoose.Schema.Types.ObjectId, ref: 'Room' },
					users : {type : mongoose.Schema.Types.ObjectId, ref: 'User' },
					message : {
								type : String
					},
					date : {type : Date}
						  
});



// This variable can be accessed from outside
var RoomChat = module.exports = mongoose.model(
										   	'RoomChat',//Singular Name of database
											roomChatSchema
										  );



module.exports.roomMessages = function(roomid,callback){	
//console.log("roomid : "+roomid);

RoomChat.find({rooms:roomid})
	  //.where('rooms').equals(roomid)
     .populate('rooms')
	 .populate('users')
	 .sort({ date: -1 })
	 .limit(50)
     .exec(callback);
};


// Create new group chat
module.exports.addMessage = function(message,callback){	
	RoomChat.create(message,callback);	
}
