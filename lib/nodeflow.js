// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var ofm = require('./ofmessage.js');
var ofl = require('./oflib.js');
var oflib = require('../oflib-node/lib/oflib.js');
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
    this.emit('OFPT_HELLO', null, null)
}

util.inherits(NodeFlow, events.EventEmitter);


NodeFlow.prototype.sendMessage = function(socket, buffer) {
    ofl.sendOFMessage(socket, buffer)

}

NodeFlow.prototype.Start = function(address, port) {
    var eventer = this;
    this.port = port || "6633"
    //   this.address = address || "10.8.3.119"
    util.log("NodeFlow Controller listening on " + address + ':' + port)

    var server = net.createServer(function(socket) {

        socket.on('connect',
        function(client) {
            util.log("Received Connect")
            ofl.sendOFMessage(socket, ofm.hello)

        })
        socket.on('data',

        function(data) {
            // var buf = ofm.unpackHeader(data)
            var mbuf = oflib.unpack(data, 0)

            // db.save('NodeFlow', 'ofmessage', mbuf)
		    // var oftype = mbuf.message.type
            switch (mbuf.message.header.type) { 
			
            case 'OFPT_HELLO':
                eventer.emit('OFPT_HELLO', null, null)
                break;
            case 'OFPT_ERROR':
                console.log(data)
                break;
            case 'OFPT_ECHO_REQUEST':
                eventer.emit('OFPT_ECHO_REQUEST', socket, mbuf);
                break;
            case 'OFPT_ECHO_REPLY':
                eventer.emit('OFPT_ECHO_REPLY', socket, mbuf);
                // ofl.sendOFMessage(socket, ofm.echo)
                break;
            case 'OFPT_FEATURES_REQUEST':
                break;
            case 'OFPT_FEATURES_REPLY':
                // io.emit('OFPT_FEATURES_REPLY', socket, mbuf);
                break;
            case 'OFPT_PACKET_IN':
                 eventer.emit('OFPT_PACKET_IN', socket, mbuf)
                break;
            case 'OFPT_PORT_STATUS':
                // io.emit('OFPT_PORT_STATUS', socket, mbuf)
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






