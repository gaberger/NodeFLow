// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var util = require('util');
var Binary = require('Binary');

function OF_MESSAGE() {
    // function OF_MESSAGE(socket) {
    // this.socket = socket
    return new OF_MESSAGE()
}

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
    return ofm_packet_buffer
}




module.exports.echo = function() {
    var OF_ECHO = [0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00] 
    return new Buffer(OF_ECHO)
}()
//
module.exports.hello = function() {
    var OF_HELLO = [0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]  
	util.log(OF_HELLO)
	return new Buffer(OF_HELLO)
}()
//
module.exports.featurerequest = function() {
    var OF_FEAT_REQ = [0x01, 0x05, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
    return new Buffer(OF_FEAT_REQ)
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
// module.exports = OF_MESSAGE
