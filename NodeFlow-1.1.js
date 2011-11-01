// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var sys = require('sys');
var util = require('util');
var Binary = require('binary');
var controller = require("./lib/OFController.js");

function Server(address, port) {
    this.address = address
    this.port = port || 6633
}

Server.prototype.Server = function startServer() {

    var server = net.createServer(function(socket) {

        // listen for packets, decode them, and feed TCP to the tracker
        socket.on('connect',
        function() {
            util.log("Received Connect")
            hello(socket)
            // setTimeout(function() {
            //             socket.write("close")
            //         },
            //         20000)
        })
        socket.on('data',
        function(data) {
            // save buffer
            var OF_MESSAGE_HEADER = Binary.parse(data)
            .word8('Version')
            .word8('type')
            .word16bu('length')
            // .tap(function(vars){
            // 			util.log("in-tap")
            // 		   console.dir(vars)
            // 			})
            .word32bu('xid')
            .vars
            ;


            // var buffer = new Buffer(data.length)
            console.dir(OF_MESSAGE_HEADER)

            // util.log("Data-LENGTH-after= " + data.length)
            // data.copy(OF_MESSAGE.version, 0, 0, 1);
            //      data.copy(OF_MESSAGE.type, 0, 1, 2)
            //
            var OF_TYPE = OF_MESSAGE_HEADER.type

            switch (OF_TYPE) {
            case 0x00:
                util.log("HELLO");
                hello(socket)
                feature_request(socket)
                break;
            case 0x01:
                // util.log("ERROR", OF_MESSAGE.toString('binary', 0, OF_MESSAGE.length));
                util.log("ERROR")
                break;
            case 0x02:
                util.log("ECHO_REQUEST");
                echo(socket)
                feature_request(socket)
                break;
            case 0x03:
                util.log("ECHO_REPLY");
                break;
            case 0x04:
                util.log("VENDOR");
                break;
            case 0x05:
                util.log("FEATURES_REQUEST");
                break;
            case 0x06:
                util.log("FEATURES_REPLY");
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
                util.log("PACKET_IN");
                var OF_MESSAGE_PACKET_IN = Binary.parse(data)
                var OF_MESSAGE_PACKET_IN = Binary.parse(data)
                .skip(8)
                .word32bu('bufferid')
                .word16bu('totalLength')
                .word16bu('inport')
                .buffer('packet', OF_MESSAGE_HEADER.length - OF_MESSAGE_PACKET_IN.totalLength)
                .vars
                ;
                console.dir(OF_MESSAGE_PACKET_IN)
                // var packbuf = new Buffer(OF_MESSAGE_PACKET_IN.buffer.length)
                //             console.log(packbuf)
                //           flow_mod(socket)
                break;
            default:
                console.log(OF_TYPE)
                debugger
                util.log("UNKNOWN OPCODE: ", OF_TYPE)
                break;
            }
        })
        //socket.on
    })
    //socket.on
    //
    server.listen(this.port,
    function() {
        var addr = this.address
        console.log("opened server on %j", addr);


    });
    //
    //
    server.addListener("close",
    function(data) {
        sys.puts("Disconnected");
    });


}

//OF_Methods
function echo(socket) {
    buf_OF_ECHO = [0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_ECHO = new Buffer(buf_OF_ECHO)
    socket.write(OF_ECHO)
    util.log("ECHO_REPLY")
}

function hello(socket) {
    buf_OF_HELLO = [0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_HELLO = new Buffer(buf_OF_HELLO)
    socket.write(OF_HELLO)
}

function feature_request(socket) {
    buf_OF_FEAT_REQ = [0x01, 0x05, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_FEAT_REQ = new Buffer(buf_OF_FEAT_REQ)
    socket.write(OF_FEAT_REQ)
    util.log("SENT_FEATURE_REQUEST")
}

function flow_mod(socket) {
    buf_OF_FLOW_MOD = [
    0x01, 0x0E, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x1e, 0x7f,
    0xfb, 0x10, 0x62, 0xa3, 0x62, 0xfb, 0x20, 0xc4, 0x2d, 0xdb, 0xff, 0xff, 0x00, 0x00, 0x08, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x02, 0x0a, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x01, 0x1b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x03, 0x00, 0x00]
    var OF_FLOW_MOD = new Buffer(buf_OF_FLOW_MOD)
    socket.write(OF_FLOW_MOD)

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
