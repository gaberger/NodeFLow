// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var util = require('util');
var Binary = require('binary');
var io = require('socket.io');
var EventEmitter = require('events').EventEmitter;
var decode = require('./packetdecode');
var ofl = require('./oflib.js')
 var db = require('riak-js').getClient({
    host: "localhost",
    port: "8098"
});
var ofm = require('./ofmessage.js');

// var ofm = new ofmessage()
function nodecontroller() {
    return new nodecontroller()
}

nodecontroller.prototype = new process.EventEmitter()

 module.exports.startServer = function(io, address, port) {
    this.port = port || "6633"
    this.address = address || "10.8.3.119"
    console.log("   NodeFlow Controller listening on " + address + ':' + port)
    var server = net.createServer(function(socket) {
        socket.on('connect',
        function(client) {
            util.log("Received Connect")
            io.emit('message', 'Connected');
            // ofl.sendOFMessage(socket, ofm.hello)
        })
        socket.on('data',
        function(data) {
            var buf = ofm.unpackHeader(data)
            var OF_TYPE = buf.type

            switch (OF_TYPE) {
            case 0x00:
                // util.log("HELLO");
                // this.emit('hello')
                io.emit('message', 'HELLO');
                ofl.sendOFMessage(socket, ofm.hello)
                ofl.sendOFMessage(socket, ofm.featurerequest)
                break;
            case 0x01:
                util.log("ERROR")
                break;
            case 0x02:
                io.emit('message', 'ECHO_REQUEST');
                ofl.sendOFMessage(socket, ofm.echo)
                break;
            case 0x03:
                io.emit('message', 'ECHO_REPLY');
                break;
            case 0x04:
                util.log("VENDOR");
                break;
            case 0x05:
                io.emit('message', 'FEATURES_REQUEST');
                break;
            case 0x06:
                var buf = ofm.unpackFeaturesReply(data)
                io.emit('message', 'FEATURES_REPLY' + " " + util.inspect(buf, true, null));
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
                var packetIn = ofm.unpackPacketIn(data)
                var pack_buf = ofm.unpackPacketBuffer(data, packetIn.length)
                var ofp = packetIn
                db.save('ofp', ofp.bufferid, {
                    length: ofp.length,
                    inport: ofp.inport,
                    reason: ofp.reason
                })
                // decode.packetDecode(OF_MESSAGE_PACKET)
                io.emit('message', 'PACKET_IN' + " " + util.inspect(packetIn, true, null) + " " + util.inspect(pack_buf, true, null))
                // turn on for cbench testing
                //ofm.flow_mod(socket)
                // io.emit('message', 'FLOW_MOD' )
                break;
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

//  ENUMS
// 	   HELLO               0
//     ERROR               1
//     ECHO_REQUEST        2
//     ECHO_REPLY          3
//     VENDOR              4
//     FEATURES_REQUEST    5
//     FEATURES_REPLY      6
//     GET_CONFIG_REQUEST  7
//     GET_CONFIG_REPLY    8
//     SET_CONFIG          9
//     PACKET_IN           10
//     FLOW_REMOVED        11
//     PORT_STATUS         12
//     PACKET_OUT          13
//     FLOW_MOD            14
//     PORT_MOD            15
//     STATS_REQUEST       16
//     STATS_REPLY         17
//     BARRIER_REQUEST     18
//     BARRIER_REPLY       19
//
