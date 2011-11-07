// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.


var util = require('util');
var events = require('events');
var net = require('net');
var ofm = require('./ofmessage.js');
var ofl = require('./oflib.js')

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
            // io.emit('message', 'Connected');
        })
        socket.on('data',

        function(data) {
            // util.log("DEBUG: ", data)
            var buf = ofm.unpackHeader(data)
            // console.dir(buf)
            var OF_TYPE = buf.type
            switch (OF_TYPE) {
            case 0x00:
                util.log("HELLO");
                ncpointer.emit('HELLO', socket, buf)
                break;
            case 0x01:
                util.log("ERROR")
                break;
            case 0x02:
                ncpointer.emit('ECHO_REQUEST', socket, data);
                // ofl.sendOFMessage(socket, ofm.echo)
                break;
            case 0x03:
                ncpointer.emit('ECHO_REPLY', socket, data);
                break;
            case 0x04:
                util.log("VENDOR");
                break;
            case 0x05:
                ncpointer.emit('FEATURESREQUEST', socket, data);
                break;
            case 0x06:
                ncpointer.emit('FEATURESREPLY', socket, data)
                break;
            case 0x07:
                util.log("7");
                break;
            case 0x08:
                util.log("8");
                break;
            case 0x09:
                util.log("9");
                break;
            case 0xA:
                util.log('PACKET_IN')
                ncpointer.emit('PACKETIN', socket, data)
                break; 
			case 0xE
				util.log('FLOW_MOD')
				ncpointer.emit('FLOWMOD', socket, data)
            default:
                debugger
                util.log("UNKNOWN OPCODE: ", OF_TYPE)
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






