// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var sys = require('sys');
var util = require('util');

//Globals

var port = "6633"
var host = "10.22.238.48"




//OF_MESSAGE
var OF_MESSAGE = {
    version: new Buffer(1),
    // //byte version;   // 1
    type: new Buffer(1),
    //   byte type;      // 1
    length: new Buffer(2),
    //   short length;   // 2
    xid: new Buffer(4)
    //   int xid;      //   4
}

var server = net.createServer(function(h_client) { 
   
    h_client.on('connect',
    function() {
        util.log("Received Connect")
        hello(h_client)
        setTimeout(function() {
            h_client.write("close")
        },
        20000)
    })
    h_client.on('data',
    function(data) {
        data.copy(OF_MESSAGE.version, 0, 0, 1);
        data.copy(OF_MESSAGE.type, 0, 1, 2)

        var OF_TYPE = OF_MESSAGE.type[0]

        switch (OF_TYPE) {
        case 0x00:
            util.log("HELLO");
            hello(h_client)
            feature_request(h_client)
            break;
        case 0x01:
            util.log("ERROR");
            break;
        case 0x02:
            util.log("ECHO_REQUEST");
            echo()
            feature_request()
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
            // util.log("PACKET_IN");
            flow_mod(h_client)
            break;
        default:
            console.log(OF_TYPE)
            debugger
            util.log("UNKNOWN OPCODE: ", OF_TYPE)
            break;
        }
    })
})

 server.listen(port, host);

server.addListener("close",
function(data) {
    sys.puts("Disconnected");
});

//OF_Methods
function echo(h_client) {
    buf_OF_ECHO = [0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_ECHO = new Buffer(buf_OF_ECHO)
    h_client.write(OF_ECHO)
}

function hello(h_client) {
    buf_OF_HELLO = [0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_HELLO = new Buffer(buf_OF_HELLO)
    h_client.write(OF_HELLO)
}

function feature_request(h_client) {
    buf_OF_FEAT_REQ = [0x01, 0x05, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var OF_FEAT_REQ = new Buffer(buf_OF_FEAT_REQ)
    h_client.write(OF_FEAT_REQ)
}

function flow_mod(h_client) {
    buf_OF_FLOW_MOD = [
    0x01, 0x0E, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x1e, 0x7f,
    0xfb, 0x10, 0x62, 0xa3, 0x62, 0xfb, 0x20, 0xc4, 0x2d, 0xdb, 0xff, 0xff, 0x00, 0x00, 0x08, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x02, 0x0a, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x01, 0x1b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x03, 0x00, 0x00]
    var OF_FLOW_MOD = new Buffer(buf_OF_FLOW_MOD)
    h_client.write(OF_FLOW_MOD)

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
