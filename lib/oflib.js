var ofm= require('./ofmessage.js');
var util = require('util');


function oflib(){
	
} 

module.exports.sendOFMessage = function(socket, buffer){
    socket.write(buffer)
   }
