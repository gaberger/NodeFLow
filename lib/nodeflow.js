// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var ofm = require('./ofmessage.js');
var ofl = require('./oflib.js')
 var oflib = require('../oflib-node/oflib.js')

//Constructor
 function NodeController() {
    events.EventEmitter.call(this);
}

util.inherits(NodeController, events.EventEmitter);
//
module.exports.createServer = function(address, port) {
    var nc = new NodeController()
    nc.Start(address, port)
    return nc
}


NodeController.prototype.sendMessage = function(socket, buffer) {
    ofl.sendOFMessage(socket, buffer)

}

NodeController.prototype.Start = function(address, port) {
    var ncpointer = this
    this.port = port || "6633"
    //   this.address = address || "10.8.3.119"
    util.log("NodeFlow Controller listening on " + address + ':' + port)

    var server = net.createServer(function(socket) {

        socket.on('connect',
        function(client) {
            util.log("Received Connect")
            ofl.sendOFMessage(socket, ofm.hello)
            // io.emit('message', 'Connected');
        })
        socket.on('data',

        function(data) {
            // var buf = ofm.unpackHeader(data)
            // ncpointer.emit('HELLO', socket, mbuf)
            var mbuf = oflib.unpackMessage(data, 0) 
			console.dir(mbuf)
            // var oftype = mbuf.message.type
            switch (mbuf.message.type) {
            case 'OFPT_HELLO':
                ncpointer.emit('OFPT_HELLO', socket, mbuf)
                ncpointer.emit('OFPT_FEATURES_REQUEST', socket, mbuf)
                break;
            case 'OFPT_ERROR':
                console.log(data)
                break;
            case 'OFPT_ECHO_REQUEST':
                ncpointer.emit('OFPT_ECHO_REQUEST', socket, mbuf);
                // ofl.sendOFMessage(socket, ofm.echo)
                break;
            case 'OFPT_FEATURES_REQUEST':
                break;
            case 'OFPT_FEATURES_REPLY':
                ncpointer.emit('OFPT_FEATURES_REPLY', socket, mbuf);
                break;
            case 'OFPT_PACKET_IN':
                ncpointer.emit('OFPT_PACKET_IN', socket, mbuf)
                break;
            case 'OFPT_PORT_STATUS':
                ncpointer.emit('OFPT_PORT_STATUS', socket, mbuf)
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






