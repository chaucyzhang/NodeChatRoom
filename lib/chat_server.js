var socketIO = require("socket.io");
var io;
var guestNumber =1;
var nickNames={};
var nameUsed = [];
var currentRoom={};


exports.listen = function(server){
    io = socketIO.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket){
      guestNumber=assignGuestNumber(socket,guestNumber,nickNames,nameUsed); 
      joinRoom(socket,'lobby');
      handleMessageBroadCasting(socket,nickNames);
      handleNameChangeAttemps(socket,nickNames,nameUsed);
      handleRoomJoining(socket);
      socket.on('rooms',function(){
          socket.emit('rooms',io.sockets.manager.rooms);
      });
      handleClientDisconnection(socket, nickNames, namesUsed); 
    });
};