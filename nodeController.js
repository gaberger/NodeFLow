
"use strict";

(function() {

var util = require('util');
var oflib = require('./lib/oflib-node');

// var createAsyncMessage = require('./messages/create-async.js');

var offsets = ofp.offsets.ofp_header;

module.exports = {
          
            "sendFeatureRequest" : function(buffer, offset) {

                            if (buffer.length < offset + ofp.sizes.ofp_header) {
                                return {
                                    "error" : {
                                        "desc" : util.format('message at offset %d is too short (%d).', offset, (buffer.length - offset)),
                                        "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                                    }
                                }
                            }

                            
                            switch (type) {
                                case ofp.ofp_type.OFPT_HELLO: { var unpack = hello.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ERROR: { var unpack = error.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ECHO_REQUEST: { var unpack = echoRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_ECHO_REPLY: { var unpack = echoReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_EXPERIMENTER: { var unpack = experimenter.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FEATURES_REQUEST: { var unpack = featuresRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FEATURES_REPLY: { var unpack = featuresReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_GET_CONFIG_REQUEST: { var unpack = getConfigRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_GET_CONFIG_REPLY: { var unpack = getConfigReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_SET_CONFIG: { var unpack = setConfig.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PACKET_IN: { var unpack = packetIn.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FLOW_REMOVED: { var unpack = flowRemoved.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PORT_STATUS: { var unpack = portStatus.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PACKET_OUT: { var unpack = packetOut.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_FLOW_MOD: { var unpack = flowMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_GROUP_MOD: { var unpack = groupMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_PORT_MOD: { var unpack = portMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_TABLE_MOD: { var unpack = tableMod.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_STATS_REQUEST: { var unpack = statsRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_STATS_REPLY: { var unpack = statsReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_BARRIER_REQUEST: { var unpack = barrierRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_BARRIER_REPLY: { var unpack = barrierReply.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REQUEST: { var unpack = queueGetConfigRequest.unpack(buffer, offset); break; }
                                case ofp.ofp_type.OFPT_QUEUE_GET_CONFIG_REPLY: { var unpack = queueGetConfigReply.unpack(buffer, offset); break; }
                                default: {
                                    return {
                                        "error" : {
                                            "desc" : util.format('message at offset %d has invalid type (%d).', offset, type),
                                            "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_TYPE'
                                        }
                                    }
                                }
                            }

                            if ('error' in unpack) {
                                return unpack;
                            }

                            unpack.message.version = "1.1";
                            unpack.message.header.xid = buffer.readUInt32BE(offset + offsets.xid, true);
                            return unpack;
                    },

            "pack" : function(message, buffer, offset) {
                        if (buffer.length < offset + ofp.sizes.ofp_header) {
                            return {
                                error : { desc : util.format('message at offset %d does not fit the buffer.', offset)}
                            }
                        }

                        switch (message.header.type) {
                            case 'OFPT_HELLO': { var pack = hello.pack(message, buffer, offset); break; }
                            case 'OFPT_ERROR': { var pack = error.pack(message, buffer, offset); break; }
                            case 'OFPT_ECHO_REQUEST': { var pack = echoRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_ECHO_REPLY': { var pack = echoReply.pack(message, buffer, offset); break; }
                            case 'OFPT_EXPERIMENTER': { var pack = experimenter.pack(message, buffer, offset); break; }
                            case 'OFPT_FEATURES_REQUEST': { var pack = featuresRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_FEATURES_REPLY': { var pack = featuresReply.pack(message, buffer, offset); break; }
                            case 'OFPT_GET_CONFIG_REQUEST': { var pack = getConfigRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_GET_CONFIG_REPLY': { var pack = getConfigReply.pack(message, buffer, offset); break; }
                            case 'OFPT_SET_CONFIG': { var pack = setConfig.pack(message, buffer, offset); break; }
                            case 'OFPT_PACKET_IN': { var pack = packetIn.pack(message, buffer, offset); break; }
                            case 'OFPT_FLOW_REMOVED': { var pack = flowRemoved.pack(message, buffer, offset); break; }
                            case 'OFPT_PORT_STATUS': { var pack = portStatus.pack(message, buffer, offset); break; }
                            case 'OFPT_PACKET_OUT': { var pack = packetOut.pack(message, buffer, offset); break; }
                            case 'OFPT_FLOW_MOD': { var pack = flowMod.pack(message, buffer, offset); break; }
                            case 'OFPT_GROUP_MOD': { var pack = groupMod.pack(message, buffer, offset); break; }
                            case 'OFPT_PORT_MOD': { var pack = portMod.pack(message, buffer, offset); break; }
                            case 'OFPT_TABLE_MOD': { var pack = tableMod.pack(message, buffer, offset); break; }
                            case 'OFPT_STATS_REQUEST': { var pack = statsRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_STATS_REPLY': { var pack = statsReply.pack(message, buffer, offset); break; }
                            case 'OFPT_BARRIER_REQUEST': { var pack = barrierRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_BARRIER_REPLY': { var pack = barrierReply.pack(message, buffer, offset); break; }
                            case 'OFPT_QUEUE_GET_CONFIG_REQUEST': { var pack = queueGetConfigRequest.pack(message, buffer, offset); break; }
                            case 'OFPT_QUEUE_GET_CONFIG_REPLY': { var pack = queueGetConfigReply.pack(message, buffer, offset); break; }
                            default: {
                                return {
                                    error : {
                                        desc : util.format('unknown message at %d (%s).', offset, message.header.type)
                                    }
                                }
                            }
                        }

                        if ('error' in pack) {
                            return pack;
                        }

                        buffer.writeUInt8(ofp.OFP_VERSION, offset + offsets.version, true);
                        buffer.writeUInt16BE(pack.offset - offset, offset + offsets.length, true);
                        buffer.writeUInt32BE(message.header.xid, offset + offsets.xid, true);
                        return pack;
            }

}

})();
