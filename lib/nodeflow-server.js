// Example OpenFlow Controller written for Node.js
// Prototype eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var ofm = require('./ofmessage.js');
var ofl = require('./oflib.js');
var oflib = require('../oflib-node');
var db = require('riak-js').getClient({
    host: "localhost",
    port: "8098"
});


//Constructor
function NodeFlow() {
    if (false === (this instanceof NodeFlow)) {
        return new NodeFLow
    }
    events.EventEmitter.call(this);    
}

util.inherits(NodeFlow, events.EventEmitter);


NodeFlow.prototype.Start = function(address, port) {
    var eventer = this;
    this.port = port || "6633"
    //   this.address = address || "10.8.3.119"
    util.log("NodeFlow Controller listening on " + address + ':' + port)

    var server = net.createServer(function(socket) {

        socket.on('connect',
        function(client) {
            util.log("Received Connect")
            this.connect = true
        })
        socket.on('data',

        function(data) {
            var mbuf = oflib.unpack(data, 0) 
		    // console.dir(mbuf)
            switch (mbuf.message.header.type) {
         	
            case 'OFPT_HELLO':
                eventer.emit('OFPT_HELLO', socket, mbuf)  
                break;
            case 'OFPT_ERROR':
                console.log(data)
                break;
            case 'OFPT_ECHO_REQUEST':
                eventer.emit('OFPT_ECHO_REQUEST', socket, mbuf);
                break;
            case 'OFPT_PACKET_IN':
                eventer.emit('OFPT_PACKET_IN', socket, mbuf)
                break;
			case 'OFPT_FEATURES_REPLY':
                eventer.emit('OFPT_FEATURES_REPLY', socket, mbuf)
               break;
            default:
                debugger
                util.log("UNKNOWN OPCODE: ", mbuf.type)
                break;
            }
        })
        //socket.on
    })
    server.listen(this.port)
    server.addListener("close",
    function(data) {
        util.log("Disconnected");
    });


}
module.exports.NodeFlow = NodeFlow






