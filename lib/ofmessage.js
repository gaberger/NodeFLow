// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var Binary = require('Binary');

module.exports.unpackHeader = function(buffer) {
    var of_message_header = Binary.parse(buffer)
    .word8('Version')
    .word8('type')
    .word16bu('length')
    .word32bu('xid')
    .vars
    ;
    return of_message_header
}

module.exports.unpackFeaturesReply = function(buffer) {
    var ofm_feature_reply = Binary.parse(buffer)
    .buffer('dpid', 6)
    .word32bu('n_buffers')
    .word8('n_tables')
    .word32bu('capabilities')
    .word32bu('actions')
    .vars
    ;
    return ofm_feature_reply
}


module.exports.unpackPacketIn = function(buffer) {
    var ofm_packet_in = Binary.parse(buffer)
    .skip(8)
    .word32bu('bufferid')
    .word16bu('length')
    .word16bu('inport')
    .word8('reason')
    .word8('pad')
    .vars;
    return ofm_packet_in

}

module.exports.unpackPacketBuffer = function(buffer, length) {
    var ofm_packet_buffer = Binary.parse(buffer)
    .skip(18)
    .buffer('packet', length)
    .vars;
    var p = ofm_packet_buffer.packet
    return p
}




module.exports.echo = function() {
    var OF_ECHO = [0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var of_echo_buf = new Buffer(OF_ECHO)
    return of_echo_buf
} ()
//
 module.exports.hello = function() {
    var OF_HELLO = [0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var of_hello_buf = new Buffer(OF_HELLO)
    return of_hello_buf
} ()
//
 module.exports.featurerequest = function() {
    var OF_FEAT_REQ = [0x01, 0x05, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    var of_feat_req_buf = new Buffer(OF_FEAT_REQ)
    return of_feat_req_buf
} ()  

module.exports.packetout = function(){
	var OF_PACKET_OUT = [0x01, 0x0d, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 
						 0x00, 0x00, 0x01, 0xf9, 0x00, 0x01, 0x00 ,0x08  
						 0x00, 0x00, 0x00, 0x08, 0xff, 0xfb, 0x00, 0x00]
	var of_packet_out = new Buffer(OF_PACKET_OUT)
	return of_packet_out  

}()
//
// OF_MESSAGE.prototype.flow_mod = function(socket) {
//     buf_OF_FLOW_MOD = [
//     0x01, 0x0E, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x1e, 0x7f,
//     0xfb, 0x10, 0x62, 0xa3, 0x62, 0xfb, 0x20, 0xc4, 0x2d, 0xdb, 0xff, 0xff, 0x00, 0x00, 0x08, 0x00,
//     0x00, 0x01, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x02, 0x0a, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x01, 0x1b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x03, 0x00, 0x00]
//     var OF_FLOW_MOD = new Buffer(buf_OF_FLOW_MOD)
//     socket.write(OF_FLOW_MOD)
//
// }  

// FLOW_MOD
// 0000   01 0e 00 50 00 00 00 00 00 00 00 00 00 03 de f6
// 0010   e0 32 fa e1 ba 4e 52 8a 66 02 ff ff 00 00 08 06
// 0020   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 0030   00 00 00 00 00 00 00 00 00 00 00 05 00 00 80 00
// 0040   00 00 01 e5 ff ff 00 01 00 00 00 08 00 04 00 00 
//
// module.exports.send_openflow_packet = function(dpid, packet,actions,inport){
// 	
//     // if type(packet) == type(array.array('B')):
//     //     packet = packet.tostring()
//     //
//     // if type(actions) == types.IntType:
//     //     self.ctxt.send_openflow_packet_port(dp_id, packet, actions, inport)
//     // elif type(actions) == types.ListType:
//     //     oactions = self.make_action_array(actions)
//     //     if oactions == None:
//     //         raise Exception('Bad action')
//     //     self.ctxt.send_openflow_packet_acts(dp_id, packet, oactions, inport)
//     // else:
//     //     raise Exception('Bad argument')
//
// }
//
// module.exports.send_openflow_buffer = function(dpid, bufferid, actions, inport){
//
//
// 	// if type(actions) == types.IntType:
// 	//         self.ctxt.send_openflow_buffer_port(dp_id, buffer_id, actions,
// 	//                                             inport)
// 	//     elif type(actions) == types.ListType:
// 	//         oactions = self.make_action_array(actions)
// 	//         if oactions == None:
// 	//             raise Exception('Bad action')
// 	//         self.ctxt.send_openflow_buffer_acts(dp_id, buffer_id, oactions,
// 	//                                             inport)
// 	//     else:
// 	//         raise Exception('Bad argument')
// }
//
//



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
