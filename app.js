// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
// Load Libs
var util = require('util');
var oflib = require('./oflib-node') 
var events = require('events'); 


var decoder = require('./lib/decoder.js')

//Controller Globals
var address = '10.8.3.119'
var port = 6633
var version = 1

var server = require('./lib/nodeflow-server.js')

var nc = new server.NodeFlow()  
	var self = this
	var buffers = {}
	var dp = []
	var sessions = []
 
	nc.Start(address, port)  
	        
		
    	    nc.on('OFPT_HELLO', function(socket, obj) { 
				   // this.version = msg.message.version 
				   util.log("HELLO :" + obj.id)
		           sendHello(socket, obj.message)
		 		   sendFeatureReq(socket)   
		          
			})                    

        	nc.on('OFPT_ECHO_REQUEST',  function(socket, obj) {  
			       sendEcho(socket, obj.message) 
		    })
        
			nc.on('OFPT_PACKET_IN',    function(socket, obj, counters) { 
				util.log("HELLO :" + util.inspect(obj.id))   
				var buffer_id = obj.message.body.buffer_id
				   
				//batch some packets
				buffers[buffer_id] = obj
			  
				 for (buf in buffers) {
			        var packet = decoder.decodeethernet(buffers[buf].message.body.data)
			        switch (packet.ethertype) {
			        		 case 0x0806:
 				    		        {
		    				            //arp
		    				            //need to trap successive..
		    				            sendOutFloodPacket(socket, buffers[buf])
		    				            break
		    				        }
	    		    	    case 0x0800:
   	        						{
										//ip
 				    				    sendOutFloodPacket(socket, buffers[buf])
 				    				    break
 				                	}
 				     			 }      
				    
				}
		 	})                  
	
	    	nc.on('OFPT_ERROR', function(socket, obj, data){ 
				var error = oflib.unpack(obj.message.body.data, 0) 
				console.dir(obj)
				console.dir(error) 
	     	})
			
			nc.on('OFPT_FEATURES_REPLY', function(socket, obj) { 
				console.dir(obj)
			 //    if (obj.message.body && obj.message.body.datapath_id) {
			 //                var session = sessions[obj.id];
			 //                session.dpid = obj.body.datapath_id; 
			 //    			dp.push(obj.body.datapath_id) 
				// }
				
		    })


     
function sendOutFloodPacket(socket, msg)  { 
       var obj = {
		    message: {
		        header: {
		            type: 'OFPT_PACKET_OUT',
		            xid: msg.message.header.xid
		        },
		        body: {
		            buffer_id: msg.message.body.buffer_id,
		            in_port: msg.message.body.in_port,
		            actions: [
		            {
		                header: {
		                    type: 'OFPAT_OUTPUT'
		                },
		                body: {
		                    port: 'OFPP_FLOOD'
		                },
		            }
		            ]
		        },
		        version: 0x00
		    }
		}
	     		var buf = new Buffer(255);
				var pack = oflib.pack(obj.message, buf, 0)
			    util.log("Buffer_I-PACKET-OUT : " + obj.message.body.buffer_id + ":" + obj.message.header.xid + ":" + socket.remotePort )
				 if (! ('error' in pack)) {
				    // trim buffer
				    var buf2 = buf.slice(0, pack.offset);
				    socket.write(buf2) 
    			}
	} 
	
	
function sendHello(socket, obj) {
		 console.dir(obj)
		 var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
			obj.version = 0x00	
			console.dir(obj)
		    pack = oflib.pack(obj, buf, 0) 
	    	socket.write(buf) 
    }
       

function sendEcho(socket, obj) {
	    obj.header.type = 'OFPT_ECHO_REPLY'  
	    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
	    obj.version = 0x00	
	    var pack = oflib.pack(obj, buf, 0)   
        socket.write(buf)  
}
	                         
	
	
function sendFeatureReq(socket) {
	     message = {                 
	   	  		  "header" : {"type" : 'OFPT_FEATURES_REQUEST', "xid" : 1},
	      		  "version" : 0x00,
	      		  "body" : {}
		      };   
                       
	   var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
	   pack = oflib.pack(message, buf, 0) 
       socket.write(buf)
}
	
	
	
  
