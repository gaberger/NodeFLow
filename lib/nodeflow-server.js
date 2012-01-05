// Example OpenFlow Controller written for Node.js
// Prototype eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var oflib = require('../oflib-node');
var ofp = require('../oflib-node/lib/ofp.js')
var decode = require('./decoder.js')


var NodeFlowServer = exports.NodeFlowServer = function(options) {
        var self = this
        sessions = []
        l2table = {}

        // self._startServer(options.address, options.serverport)

    }

NodeFlowServer.prototype = new process.EventEmitter();

NodeFlowServer.prototype.start = function(address, port) {
    var self = this

    var socket = []
    var server = net.createServer()

    server.listen(port, address, function(err, result) {
        util.log("NodeFlow Controller listening on " + address + ':' + port)
        self.emit('started', {
            "Config": server.address()
        })
    })


    server.on('connection', function(socket) {
        socket.setNoDelay(noDelay = true)
        var sessionID = socket.remoteAddress + ":" + socket.remotePort
        sessions[sessionID] = new sessionKeeper(socket)
        util.log("Connection from : " + sessionID)
        socket.on('data', function(data) {
            var sessionID = socket.remoteAddress + ":" + socket.remotePort
            var msg = oflib.unpack(data, 0)
            self._processMessage(msg, sessionID)
        })

        socket.on('close', function(data) {
            delete sessions[socket.remoteAddress + socket.remotePort]
            util.log("Client Disconnect ")
        })
        socket.on('error', function(data) {
            util.log("Client Error ")

        })
    })

    self.on('SENDPACKET', function(obj) {
        self._sendPacket(obj, obj.data.sessionID)
    })
    self.on('INSTALLFLOW', function(obj) {
        self._installFlow(obj, obj.data.sessionID)
    })
    self.on('OFPT_PACKET_IN', function(obj) {
        var packet = decode.decodeethernet(obj.message.body.data, 0)
        self._do_l2_learning(obj, packet)
        self._forward_l2_packet(obj, packet)

    })


}

var sessionKeeper = exports.sessionKeeper = function(socket) {
        this.sessionSocket = socket
        this.dpid = []
    }

NodeFlowServer.prototype._sendPacket = function(obj, sessionID) {

    var inbuf = new Buffer(255);
    inbuf.fill(0, 0, inbuf.length)


    var pack = oflib.pack(obj.data.packet, inbuf, 0)

    if (!('error' in pack)) {
        // trim buffer
        var outbuf = inbuf.slice(0, pack.offset);
        socket = sessions[sessionID].sessionSocket
        socket.write(outbuf)
    } else {
        util.log("_sendPacket Error packing object")
    }

}

NodeFlowServer.prototype._installFlow = function(obj, sessionID) {

    var buf = new Buffer(80); //fix this.
    buf.fill(0, 0, buf.length)

    var pack = oflib.pack(obj.data.packet, buf, 0)

    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
    } else {
        util.log("_installFlow : Error packing object " + util.inspect(pack))
    }
}

NodeFlowServer.prototype._sendHello = function(obj, sessionID) {
    var self = this
    var message = {
        "header": {
            "type": 'OFPT_HELLO',
            "xid": obj.message.header.xid
        },
        "version": 0x01,
        "body": {}
    };

    var buf = new Buffer(8);
    buf.fill(0, 0, buf.length)
    pack = oflib.pack(message, buf, 0)
    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
        self._sendFeatureReq(sessionID)
    } else {
        util.log("Error packing object - _sendHello " + util.inspect(pack))
    }

}

NodeFlowServer.prototype._sendEcho = function(obj, sessionID) {
    var self = this
    var message = {
        "header": {
            "type": 'OFPT_ECHO_REPLY',
            "xid": obj.message.header.xid
        },
        "version": 0x01,
        "body": {}
    };

    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
    buf.fill(0, 0, buf.length)
    var pack = oflib.pack(message, buf, 0)
    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
    } else {
        util.log("Error packing object")
    }
}

NodeFlowServer.prototype._sendFeatureReq = function(sessionID) {
    var message = {
        "header": {
            "type": 'OFPT_FEATURES_REQUEST',
            "xid": 1
        },
        "version": 0x01,
        "body": {}
    };

    var buf = new Buffer(oflib.ofp.sizes.ofp_header);
    buf.fill(0, 0, buf.length)
    pack = oflib.pack(message, buf, 0)
    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
    } else {
        util.log("Error packing object : _sendFeatureReq " + pack)

    }
}


NodeFlowServer.prototype._setDPId = function(obj, sessionID) {
    var dpid = obj.message.body.datapath_id
    sessions[sessionID].dpid = dpid
}


NodeFlowServer.prototype._processMessage = function(msg, sessionID) {
    
    var self = this
    //var mcounters = require('./counters.js')
    var type = msg.message.header.type

    switch (type) {
    case 'OFPT_HELLO':
        self._sendHello(msg, sessionID)
        break;
    case 'OFPT_ERROR':
        // self.emit('nodeflow::server::OFPT_ERROR', {"Message" : msg})  
        break;
    case 'OFPT_ECHO_REQUEST':
        self._sendEcho(msg, sessionID)
        break;
    case 'OFPT_PACKET_IN':
        
        self.emit('OFPT_PACKET_IN', {
            "message": msg.message,
            "sessionID": sessionID,
            "dpid": sessions[sessionID].dpid
        })
        break;
    case 'OFPT_FEATURES_REPLY':
        self._setDPId(msg, sessionID)
        // self.emit('nodeflow::server::OFPT_FEATURES_REPLY', {
        //     "message": msg
        // })
        break;
    case 'OFPT_PORT_STATUS':
        // self.emit('nodeflow::server::OFPT_PORT_STATUS', {
        //     "message": msg
        // })
        break;
    default:
        util.log("Unknown OF Type : " + type)
        break;
    }
}


NodeFlowServer.prototype._do_l2_learning = function(obj, packet) {
    self = this

    var dl_src = packet.shost
    var dl_dst = packet.dhost
    var in_port = obj.message.body.in_port
    var dpid = obj.dpid

    if (dl_src == 'ff:ff:ff:ff:ff:ff') {
        return
    }

    if (!l2table.hasOwnProperty(dpid)) {
        l2table[dpid] = new Object() //create object
    }
    if (l2table[dpid].hasOwnProperty(dl_src)) {
        var dst = l2table[dpid][dl_src]
        if (dst != in_port) {
            util.log("MAC has moved from " + dst + " to " + in_port)
        } else {
            return
        }

    } else {
        util.log("learned mac " + dl_src + " port : " + in_port)
        l2table[dpid][dl_src] = in_port

    }
    console.dir(l2table)

};

NodeFlowServer.prototype._forward_l2_packet = function(obj, packet) {

    var dl_dst = packet.dhost
    var dl_src = packet.shost
    var in_port = l2table[obj.dpid][dl_src]
    var dpid = obj.dpid

    if ((dl_dst != 'ff:ff:ff:ff:ff:ff') && l2table[dpid].hasOwnProperty(dl_dst)) {


        var prt = l2table[dpid][dl_dst]
        if (prt == in_port) {
            util.log("*warning* learned port = " + in_port + ", system=nodeFlow")
            obj.packet = self._setOutFloodPacket(obj)
            self.emit("SENDPACKET", {
                "data": obj
            })
        } else {
            out_port = prt
            util.log("Installing flow for destination: " + dl_dst + " source:" + dl_src + " in_port: " + in_port + " out_port: " + out_port + " system=NodeFlow")
            obj.packet = self._setFlowModPacket(obj, packet, in_port, out_port)
            self.emit("INSTALLFLOW", {
                "data": obj
            })

        }

    } else {
        util.log("Flooding Unknown id:" + obj.message.body.buffer_id)
        obj.packet = self._setOutFloodPacket(obj, in_port)
        self.emit("SENDPACKET", {
            "data": obj
        })


    }


}


NodeFlowServer.prototype._setOutFloodPacket = function(obj, in_port) {
    return {

        header: {
            type: 'OFPT_PACKET_OUT',
            xid: obj.message.header.xid
        },
        body: {
            buffer_id: obj.message.body.buffer_id,
            in_port: in_port,
            actions: [{
                header: {
                    type: 'OFPAT_OUTPUT'
                },
                body: {
                    port: 'OFPP_FLOOD'
                },
            }]
        },
        version: 0x01
    }
}


NodeFlowServer.prototype._extractFlow = function(packet) {
    
    var flow = {}

    flow.dl_src = packet.shost
    flow.dl_dst = packet.dhost
    flow.dl_type = packet.ethertype

    if (packet.hasOwnProperty('vlan')) {
        // TODO
        flow.dl_vlan = packet.vlan
        flow.dl_vlan_pcp = packet.priority
    } else {
        flow.dl_vlan = 0xffff
        flow.dl_vlan_pcp = 0
    }

    if (packet.hasOwnProperty('ip')) {
        flow.nw_src = packet.ip.saddr
        flow.nw_dst = packet.ip.daddr
        flow.nw_proto = packet.ip.protocol

        if (packet.ip.hasOwnProperty('udp' || 'tcp')) {
            flow.tp_src = packet.ip.saddr
            flow.tp_dst = packet.ip.daddr
        } else {
            if (packet.ip.hasOwnProperty('icmp')) {
                flow.tp_src = packet.ip.icmp.type
                flow.tp_dst = packet.ip.icmp.code
            } else {
                flow.tp_src = '0.0.0.0'
                flow.tp_dst = '0.0.0.0'
            }
        }
    } else {
        flow.nw_src = '0.0.0.0'
        flow.nw_dst = '0.0.0.0'
        flow.nw_proto = 0
        flow.tp_src = '0.0.0.0'
        flow.tp_dst = '0.0.0.0'


    }
    return flow
}


NodeFlowServer.prototype._setFlowModPacket = function(obj, packet, in_port, out_port) {

    var dl_dst = packet.dhost
    var dl_src = packet.shost

    var flow = self._extractFlow(packet)

    flow.in_port = in_port

    return {

        version: 0x01,
        header: {
            type: 'OFPT_FLOW_MOD',
            xid: obj.message.header.xid
        },
        body: {
            command: 'OFPFC_ADD',
            hard_timeout: 0,
            idle_timeout: 100,
            priority: 0x8000,
            buffer_id: obj.message.body.buffer_id,
            out_port: 'OFPP_NONE',
            flags: ['OFPFF_SEND_FLOW_REM'],
            match: {
                header: {
                    type: 'OFPMT_STANDARD'
                },
                body: {
                    'wildcards': 0,
                    "in_port": flow.in_port,
                    "dl_src": flow.dl_src,
                    'dl_dst': flow.dl_dst,
                    'dl_vlan': flow.dl_vlan,
                    'dl_vlan_pcp': flow.dl_vlan_pcp,
                    'dl_type': flow.dl_type,
                    'nw_proto': flow.nw_proto,
                    'nw_src': flow.nw_src,
                    'nw_dst': flow.nw_dst,
                    'tp_src': flow.tp_src,
                    'tp_dst': flow.tp_dst,
                },
            },
            actions: {
                header: {
                    type: 'OFPAT_OUTPUT'
                },
                body: {
                    port: out_port
                }
            }

        }


    }
}