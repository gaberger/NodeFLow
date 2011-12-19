// Example OpenFlow Controller written for Node.js
// Prototype eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var oflib = require('../oflib-node');
var uuid = require('node-uuid');
var Hook = require('hook.io').Hook;

var NodeFlowServer = exports.NodeFlowServer = function (options) { 
   Hook.call(this, options); 
   var self=this 
   sessions = []   

    self.on('hook::ready', function() {
    	self.findPort({ port: self.port }, 
			function (err, port){
				self.port = port
				self._startServer(options.address, options.serverport)  
    			
			})
	}) 
	
	self.on('*::nodeflow::client::sendPacket', function(obj){  
			    	self._sendPacket(obj.data.message, obj.sessionID)
	})
	

}
	
   util.inherits(NodeFlowServer, Hook)   	
	
NodeFlowServer.prototype._startServer = function(address, port) {   
    var self = this 
    self.port = port 
	self.address = address 
	var socket = []
   		
	    var server = net.createServer()

	    server.listen(port, address, function(err, result){
	   		self.emit("nodeflow::server::started", {"Config" : server.address()})
	    }) 
			
		server.on('connection', function(socket){
				socket.setNoDelay(noDelay=true) 
		    	sessionID = socket.remoteAddress + ":" + socket.remotePort 
				sessions[sessionID] = new sessionKeeper(socket)
				util.log("Connection from : " + sessionID)
				// self.emit("nodeflow::server::connection", {"sessionID" : sessionID})
		   				
		   		var switchStream = new oflib.Stream();
		    	var msgs = []

			        socket.on('data', function(data) {
			        	sessionID = socket.remoteAddress + ":" + socket.remotePort 
			        	var msgs = switchStream.process(data);   
			    		msgs.forEach(function(msg) {
			    			// var msg = oflib.unpack(data, 0)
			    		self._processMessage(msg, data, sessionID) 
						})
					})
		 	}) 
		
		server.on('end', function(){
    		console.log('server disconnected');
  		});
		
	           
	       
	
	// function sessionKeeper(session) {
	// 	this.sessionSocket = session
	// 	this.id = uuid('binary')
	//    }
	//   
	            
}

var sessionKeeper = exports.sessionKeeper = function (socket) { 
	 this.sessionSocket = socket
	 this.dpid = []
}     

NodeFlowServer.prototype._sendPacket = function(obj, sessionID){  
	var inbuf = new Buffer(255);
	inbuf.fill(0, 0, inbuf.length)    
    var pack = oflib.pack(obj, inbuf, 0)
	    	if (! ('error' in pack)) {
			    // trim buffer
			    var outbuf = inbuf.slice(0, pack.offset);
			    socket = sessions[sessionID].sessionSocket
			    socket.write(outbuf)
			}
	         
}

NodeFlowServer.prototype._sendHello = function(obj, socket){
		var self = this  
	 	message = {                 
	   	  		  "header" : {"type" : 'OFPT_HELLO', "xid" : obj.message.header.xid },
	      		  "version" : 0x00,
	      		  "body" : {}
		      };   
                    
	   	var buf = new Buffer(oflib.ofp.sizes.ofp_header);
	 	buf.fill(0, 0, buf.length)  
	   	pack = oflib.pack(message, buf, 0) 
    	socket.write(buf)   

		self._sendFeatureReq(socket)
	
}  

NodeFlowServer.prototype._sendEcho = function(obj, socket) {  
	    var self = this  
	    message = {                 
	   	  		  "header" : {"type" : 'OFPT_ECHO_REPLY', "xid" : obj.message.header.xid },
	      		  "version" : 0x00,
	      		  "body" : {}
		      };
	
	    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
		buf.fill(0, 0, buf.length)
	    var pack = oflib.pack(message, buf, 0) 
	    socket.write(buf)  
} 

NodeFlowServer.prototype._sendFeatureReq = function(socket) {
	     message = {                 
	   	  		  "header" : {"type" : 'OFPT_FEATURES_REQUEST', "xid" : 1},
	      		  "version" : 0x00,
	      		  "body" : {}
		      };   
                       
	   var buf = new Buffer(oflib.ofp.sizes.ofp_header);
	   buf.fill(0, 0, buf.length)   
	   pack = oflib.pack(message, buf, 0) 
       socket.write(buf)
}
  

NodeFlowServer.prototype._setDPId = function(obj, sessionID) { 
	var dpid = obj.message.body.datapath_id
	sessions[sessionID].dpid = dpid
}  



	
NodeFlowServer.prototype._processMessage = function(msg, data, sessionID) { 
		   var self = this
		   var mcounters = require('./counters.js') 
		   // var id = new Buffer(16);
		   // 	       uuid('binary', id); 
		   //      
			// var obj = {
	                // "id" : id,
	                // "message" : msg.message
	 		    // };


				// console.log("MESSAGE@" + sessionID , util.inspect(msg.message.header))   
		        var type = msg.message.header.type  
			    switch (type) {
		                    case 'OFPT_HELLO': 
								mcounters.OFPT_HELLO++
				                // self._sendHello(msg, socket)
				                self._sendHello(msg, sessions[sessionID].sessionSocket)
				                break;
				            case 'OFPT_ERROR':
								mcounters.OFPT_ERROR++ 
				                 // self.emit('nodeflow::server::OFPT_ERROR', {"Message" : msg})  
				   				// self._ErrorHandler(msg, data)
				                break;
				            case 'OFPT_ECHO_REQUEST':
								mcounters.OFPT_ECHO_REQUEST++
							    self._sendEcho(msg, sessions[sessionID].sessionSocket)
				                break;
				            case 'OFPT_PACKET_IN':
				            	mcounters.OFPT_PACKET_IN++
								util.log("SessionID: " +  sessionID + "/" + "Buffer_ID: " + msg.message.body.buffer_id + "DPID: " + sessions[sessionID].dpid)
						        self.emit('nodeflow::server::OFPT_PACKET_IN', {"message" : msg, "sessionID" : sessionID, "dpid" : sessions[sessionID].dpid})
                                break;
							case 'OFPT_FEATURES_REPLY':
								mcounters.OFPT_FEATURES_REPLY++
								self._setDPId(msg, sessionID)
				                self.emit('nodeflow::server::OFPT_FEATURES_REPLY', {"message" : msg})
				               break;
							case 'OFPT_PORT_STATUS':
								self.emit('nodeflow::server::OFPT_PORT_STATUS', {"message" : msg})  
								break;
				            default:
				                debugger
				                self._ErrorHandler(msg, data) 
				                break;               
	    					}
	   }

   


  	
