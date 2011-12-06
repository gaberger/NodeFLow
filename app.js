// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
// Load Libs
var util = require('util');
var oflib = require('./oflib-node')

//Controller Globals
var address = '10.8.3.119'
var port = 6632
var version = 1

var server = require('./lib/nodeflow-server.js')

var nc = new server.NodeFlow()
 
	nc.Start(address, port)  
	
    		nc.on('OFPT_HELLO', function(socket, msg) { 
				   this.version = msg.message.version
			                    
		      		  var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
					    pack = oflib.pack(msg.message, buf, 0) 
				    	socket.write(buf) 
			    
				
		               	message = {                 
		               	  		  "header" : {"type" : 'OFPT_FEATURES_REQUEST', "xid" : 1},
		   				 	      "version" : this.version,
		   				 	      "body" : {}
		   				  	      };   
               	                        
					   var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
					   pack = oflib.pack(message, buf, 0) 
				       socket.write(buf) 
		          
			})                    


			nc.on('OFPT_ECHO_REQUEST',  function(socket, msg) {  
				msg.message.header.type = 'OFPT_ECHO_REPLY'  
        	    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
			    var pack = oflib.pack(msg.message, buf, 0)   
		        socket.write(buf) 
		    })


			nc.on('OFPT_PACKET_IN',    function(socket, msg) { 
		        var message = {
					    message : {
					        header: {
					            type: 'OFPT_PACKET_OUT',
					            xid: msg.message.header.xid
					        },
					        body: {
					            buffer_id: msg.message.body.buffer_id,
					            in_port: msg.message.body.in_port,
					            actions: [
					            {
					                header: {  type: 'OFPAT_OUTPUT' },
					                body: {    port: 'OFPP_FLOOD'   },
					            }
					            ]
					        },
							version: msg.message.version
					    }
					}
				
	    		var buf = new Buffer(64);  
	    	 	var pack = oflib.pack(message.message, buf, 0)   
			    	if (!('error' in pack)) {     
			 			//trim buffer
						var buf2 = buf.slice(0, pack.offset);
			            socket.write(buf2)
				    }    
	        }) 
			
			nc.on('OFPT_FEATURES_REPLY', function(socket, msg) {
		    })



