var users 	= require('./users.js');
var logger  = require('../helpers/logger');
var globals = require('../config/global');
var User    = require('../models/user');
var Chat    = require('../models/chat');
var Room    	= require('../models/room');

module.exports.set = function(app,io) {
	
	
	
	app.post('/api/chat/getmessages',function(req, res){	
	
		var user 		= req.body;
		var params 		= {};
		var response 	= {};
		params.sender_id 	= user.sender_id;	
		params.receiver_id  = user.receiver_id;
		var userIds		= [];
		userIds.push(user.sender_id);
		userIds.push(user.receiver_id);
		
		User.userById(userIds,function(err,userData){
		
		if(err){
				logger.error('Error: User Find, '+err);
			} else{
				
				
				Object.keys(userData).forEach(function(key) {
					if( userData[key]._id  == user.sender_id){						
						response.sender = userData[key];
					} else if( userData[key]._id  == user.receiver_id){
						response.receiver = userData[key];	
					}
				});
				
				Chat.getMessages(params,function(err,messages){
							
					if(err){
						logger.error('Error: Chat find error : , '+err);
					} else{
						response.messages = messages; 						
					}
					res.json(response);
				});
			}
			
		});
	
	
	});
	
	var chat = 	io.sockets.on('connection',function(socket){
	

		function updateNicknamesLogin(users){
			
			setTimeout(function(){  // wait for previous refresh
				User.getOnlineUsers(users,function(err,userData){
					io.sockets.emit('update_users',userData);	
					updateRooms();
				});
			}, 300);
			
		}
	
		function updateNicknames(users){

			User.getOnlineUsers(users,function(err,userData){
				io.sockets.emit('update_users',userData);	
			});
			
		}
		
		
		function updateRooms(){
		
			/*Room.listRoom({},function(err,roomList){
				io.sockets.emit('update_rooms',roomList);
			});*/
			io.sockets.emit('update_rooms_init',{});
			
			
		}
	
		socket.on('new_user',function(data, callback){
				
				globals.onlineUsers[data] = data;				
				socket.nickname = data;
				//console.log(socket.id);
				globals.onlineSocket[data] = socket;
				globals.onlineSocket[data].socket = socket.id;
				
				callback({status : true, username : data});
				updateNicknamesLogin(globals.onlineUsers);
				
				//console.log(globals);
				
									  
		});
		
		socket.on('logout',function(data, callback){
					
				if(!socket.nickname) return;
				delete globals.onlineUsers[data]
				delete globals.onlineSocket[socket.nickname];
				callback({status : true, username : data});
				updateNicknames(globals.onlineUsers);
				updateRooms();
				
		});
		
		
		socket.on('disconnect',function(data){
							
				if(!socket.nickname) return;
				delete globals.onlineUsers[socket.nickname]
				delete globals.onlineSocket[socket.nickname];
				updateNicknames(globals.onlineUsers);
										
		});		
		
		
		socket.on('new_single_message',function(data, callback){
				
				
				
				var message ={};
				message.message     = data.message;
				message.sender_id   = data.sender;
				message.receiver_id = data.receiver;
				message.date     	= new Date();
				Chat.addMessage(message,function(err,messages){
							
					if(err){
						logger.error('Error: Chat insert fails, '+err);
					} else{
						
						
						if(globals.onlineSocket[data.username]){
							//console.log(globals.onlineSocket[data.username]);
							globals.onlineSocket[data.username].emit('new_single_message_ack', {
																		messages : messages,
																		sender  : data.sender,
																		receiver: data.receiver
																	},function(data){
										
										
							});
						}
						callback({status : true, data : data, messages: messages});
							
					}
					
				});
				
				
				
				
									  
		});
		
		
		
	
	});


	
	
}