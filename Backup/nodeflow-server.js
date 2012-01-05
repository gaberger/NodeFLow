// Example OpenFlow Controller written for Node.js
// Prototype eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var util = require('util');
var events = require('events');
var net = require('net');
var oflib = require('../oflib-node');
var uuid = require('node-uuid');


//Constructor

function NodeFlow() {
	if (false === (this instanceof NodeFlow)) {
		return new NodeFLow
	}
	events.EventEmitter.call(this);
}

util.inherits(NodeFlow, events.EventEmitter);


NodeFlow.prototype.Start = function(address, port) {
	this.address = address
	this.port = port
	var self = this;
	// var sessionCount = 0
	var socketPair = new Array();

	this.port = port || "6633"
	//   this.address = address || "10.8.3.119"
	util.log("NodeFlow Controller listening on " + address + ':' + port)

	var sessions = [];

	var server = net.createServer(function() {

		server.on('connection', function(socket) {
			var obj = {
				sessionId: uuid('binary'),
				session: socket.remoteAddress + ":" + socket.remotePort
			}
			// var counters = require('./counters.js')  
			util.log("Received Connect from " + obj.session)
			// counters.sessions++;  
			var switchStream = new oflib.Stream();
			var msgs = []

			socket.on('data', function(data) {
				// console.log("DATA@" + socket.remoteAddress + ":" + socket.remotePort , util.inspect(data))  
				var msgs = switchStream.process(data);
				msgs.forEach(function(msg) {
					processMessage(msg, socket, self)
				})
			})

			socket.on('end', function() {
				var pos = sockets.indexOf(socket);
				if (pos > 0) {
					sockets.splice(pos, 1);
				}
			});

			socket.on('close', function(data) {
				util.log("Client Disconnect " + ":" + this.sessionCount)

			})

			socket.on('error', function(data) {
				util.log("Client Error " + util.inspect(data))
			})

		})

	})


	//socket.on
	server.listen(this.port, this.address)

	server.addListener("close", function(data) {
		util.log("Disconnected");
	});


}

module.exports.NodeFlow = NodeFlow

function processMessage(msg, socket, eventer) {
	var self = this
	var id = new Buffer(16);
	uuid('binary', id);
	var mcounters = require('./counters.js')

	var obj = {
		"id": id,
		"message": msg.message
	};


	// console.log("MESSAGE@" + sessionID , util.inspect(msg.message.header))   
	var type = msg.message.header.type
	switch (type) {
	case 'OFPT_HELLO':
		mcounters.OFPT_HELLO++eventer.emit('OFPT_HELLO', socket, obj)
		break;
	case 'OFPT_ERROR':
		mcounters.OFPT_ERROR++eventer.emit('OFPT_ERROR', socket, obj);
		break;
	case 'OFPT_ECHO_REQUEST':
		mcounters.OFPT_ECHO_REQUEST++eventer.emit('OFPT_ECHO_REQUEST', socket, obj);
		break;
	case 'OFPT_PACKET_IN':
		mcounters.OFPT_PACKET_IN++eventer.emit('OFPT_PACKET_IN', socket, obj)

		break;
	case 'OFPT_FEATURES_REPLY':
		mcounters.OFPT_FEATURES_REPLY++eventer.emit('OFPT_FEATURES_REPLY', socket, obj)
		break;
	default:
		debugger
		util.log("UNKNOWN OPCODE: ", msg.type)
		break;
	}
}