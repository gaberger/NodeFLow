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

 			nc.on('OFPT_HELLO', function(socket, inmessage) {
			    // io.sockets.emit('message', 'HELLO');
			    var outmessage = {
       
			            header: {
			                type: 'OFPT_HELLO',
			                xid: inmessage.message.header.xid
			            },
			            version: inmessage.message.version

       
			    };
  
			    var buf = new Buffer(oflib.ofp.sizes.ofp_header); 
			    pack = oflib.pack(outmessage, buf, 0) 
				console.dir(buf)   
				socket.write(buf)


			})                    


 nc.on('OFPT_ECHO_REQUEST',  function(socket, inmessage) {    
	var outmessage = {

            header: {
                type: 'OFPT_ECHO_REPLY',
                xid: inmessage.message.header.xid
            },
            version: inmessage.message.version


    };

    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
    var pack = oflib.pack(outmessage, buf, 0)
   	console.dir(buf)   
	socket.write(buf)
})

 nc.on('OFPT_PACKET_IN',
function(data) {
    // io.sockets.emit('message', 'PACKET_IN', data);
    })



