// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
// Load Libs
var util = require('util');
var oflib = require('./oflib-node')

//Controller Globals
 var address = '10.8.3.119'
var port = 6633
var version = 1

var server = require('./lib/nodeflow-server.js')

 var nc = new server.NodeFlow()
 nc.Start(address, port)

 			nc.on('OFPT_HELLO', function(socket, msg) { 
				   this.version = msg.message.version
			                    
		      		  var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
					    pack = oflib.pack(msg.message, buf, 0) 
				    	socket.write(buf) 
						console.dir(buf)  
				
				
		               	message = {                 
		               	  		  "header" : {"type" : 'OFPT_FEATURES_REQUEST', "xid" : 1},
		   				 	      "version" : this.version,
		   				 	      "body" : {}
		   				  	      };   
               	                        
					    	var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
						    pack = oflib.pack(message, buf, 0) 
					    	socket.write(buf) 
							console.dir(buf)
                  
			})                    


			nc.on('OFPT_ECHO_REQUEST',  function(socket, msg) {  
				msg.message.header.type = 'OFPT_ECHO_REPLY'  
        	    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
			    var pack = oflib.pack(msg.message, buf, 0)   
		        socket.write(buf) 
				console.dir(buf)
			})


			nc.on('OFPT_PACKET_IN',    function(socket, msg) { 
				  console.dir(msg)
				
				
			}) 
			
			nc.on('OFPT_FEATURES_REPLY', function(socket, msg) {
				 console.dir(msg)
			})



