var globals 	= require('../config/global');
var logger  = require('../helpers/logger');

var User    	= require('../models/user');
var Chat    	= require('../models/chat');
var Room    	= require('../models/room');
var RoomUser    = require('../models/room_user');
var RoomChat    = require('../models/room_chat');

module.exports.set = function(app,io) {
	
	
	var chat = 	io.sockets.on('connection',function(socket){
	
		socket.on('group_messages',function(data, callback){
	
			//console.log(data);
			var response = {};
			Room.getRoom(data.roomid,function(err,Room){
				if(err){} 
				else{
					response.room = Room;	
					RoomChat.roomMessages(data.roomid,function(err,messages){
									
						if(err){} 
						else{			
							response.messages = messages;				
						}
						socket.room = data.roomid;
						socket.join(socket.room);
						
						callback({status : true, response : response});
					});
				
				}
			});
		});
		
		
		socket.on('new_group_message',function(data, callback){
				
				
				//console.log(data);
				var message ={};
				message.message     = data.message;
				message.users   	= data.sender;
				message.rooms		= data.room;
				message.date     	= new Date();
				var fullname		= data.fullname;
				RoomChat.addMessage(message,function(err,messages){
							
					if(err){
						logger.error('Error: Chat insert fails, '+err);
					} else{
						
						
						
						socket.to(socket.room).emit('ack_group_message', 'SERVER', {messages: messages,fullname:fullname});
						
						
						/*io.to(room).emit('ack_group_message',{messages: messages,fullname:fullname},function(data){
						
							
						
						}):*/
						
						/*if(globals.onlineSocket[data.username]){
							//console.log(globals.onlineSocket[data.username]);
							globals.onlineSocket[data.username].emit('new_single_message_ack', {
																		messages : messages,
																		sender  : data.sender,
																		receiver: data.receiver
																	},function(data){
										
										
							});
						}*/
						callback({status : true, data : data, messages: messages,fullname:fullname});
							
					}
					
				});
				
				
				
				
									  
		});
	
	});
	
	
	app.post('/api/rooms/create',function(req, res){	
	
		var response 	= {};
		var group 		= req.body;
		var data 		= group.form;
		response.group	= group.form;
		
		var roomData 	= {};
		roomData.name 	= data.name;
		//roomData.user 	= data.user;
		var owner		= data.user;
		roomData.users	= data.user;
		roomData.active	= 1;
		roomData.slug 	= ( typeof data.name !== 'undefined' && data.name ) ? data.name.replace(/ /g,"-") : '';
		roomData.date   = new Date();
		
		//console.log(roomData);
		
		Room.addRoom(roomData,function(err,roomItem){
			if(err){
				
				logger.error('Error: User Insertion, '+err);
				response.success = 0;
				response.err 	 = err;
				
			}else{
				var current = false;
				var memberData = {}
				if(data.roomMembers.indexOf(owner) === -1)
					data.roomMembers.push(owner);
				data.roomMembers.forEach(function(value){
					if(owner === value)	current = true;						  
					memberData.rooms = roomItem._id;
					memberData.users = value;
					memberData.active	= 1;
					memberData.date = new Date();
					
					RoomUser.addMembers(memberData,function(err,members){
						
						if(err){} 
						else{}
												   
					});
					
				});
				
				response.roomItem = roomItem;
				response.success  = 1;
				
				setTimeout(function(){  
					io.sockets.emit('update_rooms_init',{});
				}, 150);
				
				
			}
			
			res.json(response);
			
		});

	});


	app.get('/api/rooms/list',function(req, res){	
									   
									   
		var response 	= {};		
		//RoomUser
		RoomUser.listRoom({},function(err,members){
						
			if(err){} 
			else{
			
				response.members = members;
				
			}
			
			res.json(response);
		});
	});
	
	
	
	app.post('/api/rooms/userlist',function(req, res){	
									   
									   
		var response 	= {};		
		var post 		= req.body;
		//console.log(post.userId);
		
		
		RoomUser.listUserRoom(post.userId,function(err,members){
						
			if(err){} 
			else{
			
				response.groupMembers = members;
				
			}
			
			res.json(response);
		});
		
		
	});
	
	
	
	
	
	app.post('/api/room/getmessages',function(req, res){	
	
		var response 	= {};	
		var post 		= req.body;
		//console.log(post.roomid);
		
		io.sockets.on('connection',function(socket){
			
			//console.log(post.roomid);
			socket.join(post.roomid);		
			
		
		});
		Room.getRoom(post.roomid,function(err,Room){
			if(err){} 
			else{
				response.room = Room;	
				RoomChat.roomMessages(post.roomid,function(err,messages){
								
					if(err){} 
					else{			
						response.messages = messages;				
					}
					
					res.json(response);
				});
			
			}
		});
	
	});

}