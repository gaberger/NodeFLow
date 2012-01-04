// Example OpenFlow Controller written for Node.js
// Prototype eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var oflib = require('../oflib-node');
var ofp = require('../oflib-node/lib/ofp.js')

var Hook = require('hook.io').Hook;



var NodeFlowServer = exports.NodeFlowServer = function(options) {
        Hook.call(this, options);
        var self = this
        sessions = []

        self.on('hook::ready', function() {
            self.findPort({
                port: self.port
            }, function(err, port) {
                self.port = port
                self._startServer(options.address, options.serverport)

            })
        })

        self.on('*::nodeflow::client::sendPacket', function(obj) {
            self._sendPacket(obj, obj.data.sessionID)
        })
        self.on('*::nodeflow::client::installFlow', function(obj) {
            self._installFlow(obj, obj.data.sessionID)
        })

    }

util.inherits(NodeFlowServer, Hook)

NodeFlowServer.prototype._startServer = function(address, port) {
    var self = this

    var socket = []
    var server = net.createServer()

    server.listen(port, address, function(err, result) {
        util.log("NodeFlow Controller listening on " + address + ':' + port)
        self.emit("nodeflow::server::started", {
            "Config": server.address()
        })
    })

    server.on('connection', function(socket) {
        socket.setNoDelay(noDelay = true)
        var sessionID = socket.remoteAddress + ":" + socket.remotePort
        sessions[sessionID] = new sessionKeeper(socket)
        util.log("Connection from : " + sessionID)
        // self.emit("nodeflow::server::connection", {"sessionID" : sessionID})
        var switchStream = new oflib.Stream();
        var msgs = []

        socket.on('data', function(data) {
            var sessionID = socket.remoteAddress + ":" + socket.remotePort
            var msgs = switchStream.process(data);
            msgs.forEach(function(msg) {
                // var msg = oflib.unpack(data, 0)
                self._processMessage(msg, data, sessionID)
            })
        })

        socket.on('close', function(data) {
            delete sessions[socket.remoteAddress + socket.remotePort]
            util.log("Client Disconnect ")
        })
        socket.on('error', function(data) {
            util.log("Client Error ")

        })
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

    var buf = new Buffer(ofp.sizes.ofp_flow_mod + ofp.sizes.ofp_header);  //fix this.
    buf.fill(0, 0, buf.length)
 
    var pack = oflib.pack(obj.data.packet, buf, 0)
 
    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
    } else {
        util.log("_installFlow : Error packing object")
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

    var buf = new Buffer(oflib.ofp.sizes.ofp_header + oflib.ofp.sizes.ofp_hell0);
    buf.fill(0, 0, buf.length)
    pack = oflib.pack(message, buf, 0)
    if (!('error' in pack)) {
        var socket = sessions[sessionID].sessionSocket
        socket.write(buf)
        self._sendFeatureReq(socket)
    } else {
        util.log("Error packing object")
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
        util.log("Error packing object")
    }
}


NodeFlowServer.prototype._setDPId = function(obj, sessionID) {
    var dpid = obj.message.body.datapath_id
    sessions[sessionID].dpid = dpid
}


NodeFlowServer.prototype._processMessage = function(msg, data, sessionID) {
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
        self.emit('nodeflow::server::OFPT_PACKET_IN', {
            "message": msg.message,
            "sessionID": sessionID,
            "dpid": sessions[sessionID].dpid
        })
        break;
    case 'OFPT_FEATURES_REPLY':
        self._setDPId(msg, sessionID)
        self.emit('nodeflow::server::OFPT_FEATURES_REPLY', {
            "message": msg
        })
        break;
    case 'OFPT_PORT_STATUS':
        self.emit('nodeflow::server::OFPT_PORT_STATUS', {
            "message": msg
        })
        break;
    default:
        util.log("Unknown OF Type : " + type)
        break;
    }
}