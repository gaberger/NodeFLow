var net = require('net');
var util = require('util'); 


//PseudoClass


var dataHandler = function(){
	
}

dataHandler.prototype.createServer = function(){
	var server = net.createServer(function(socket) {

	    socket.on('connect',
	    function() {
	        util.log("Received Connect")
	        ctrl1.sendHello(socket)
	        setTimeout(function() {
	            socket.write("close")
	        },
	        20000)
	    })

		server.listen("6633",
		function() {
		    address = server.address();
		    console.log("opened server on %j", address);
		});
})
}        


dataHandler.prototype.handleData = function(){
	
}



module.exports.create = function() {
	return new dataHandler()
}