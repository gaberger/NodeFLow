var controller = require('./lib/nodeflow.js')
 var ofl = require('./lib/oflib.js')
 var ofm = require('./lib/ofmessage.js')
 var decoder = require('./lib/decoder.js')
 var ofc = require('./lib/nodeflow.js')
 var util = require('util');
var events = require('events');

function NodeController() {
    if (false === (this instanceof NodeController)) {
        return new NodeController()
    }
    events.EventEmitter.call(this);
}

util.inherits(NodeController, events.EventEmitter);

NodeController.prototype.startController = function(address, port, io) {
    var appevent = this;
    var node = new controller.NodeFlow()
    node.Start(address, port)

    //Event Listeners
    ofmessage = {}

    node.on('OFPT_HELLO',
    function(socket, data) {
        ofmessage.OFPT_HELLO = true
        appevent.emit('OFPT_HELLO', data)
    })

    node.on('OFPT_ECHO_REQUEST',
    function(socket, data) {
        node.sendMessage(socket, ofm.echo)
        appevent.emit('OFPT_ECHO_REQUEST', data)
    })  
	node.on('OFPT_ECHO_REPLY',
    function(socket, data) {
        appevent.emit('OFPT_ECHO_REPLY', data)
    })

    node.on('OFPT_FEATURES_REPLY',
    function(socket, data) {
        ofmessage.OFPT_FEATURES_REPLY = true
        // var buf = ofm.unpackFeaturesReply(data)
    })

    node.on('OFPT_PORT_STATUS ',
    function(socket, data) {
        ofmessage.got_OFPT_PORT_STATUS = true
        // var buf = ofm.unpackFeaturesReply(data)
    })


    node.on('OFPT_PACKET_IN',
    function(socket, data) {
        var pbuf = decoder.decodeethernet(data.message.data, 0)
		appevent.emit('OFPT_PACKET_IN', data)   
        console.dir(pbuf)
    })


}


module.exports.NodeController = NodeController
