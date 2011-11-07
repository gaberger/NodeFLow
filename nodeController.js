var controller = require('./lib/nodeflow.js') 
var ofl = require('./lib/oflib.js')
var ofm = require('./lib/ofmessage.js')
var decoder = require('./lib/decoder.js') 
var ofc = require('./lib/nodeflow.js')
var util = require('util');

function nodeController() {

    }

module.exports.startController = function(address, port) {  

  console.log(address + ' ' + port)
  controller = ofc.createServer(address, port)


    //Event Listeners
    ofmessage = {}

    controller.on('OFPT_HELLO',
    function(socket, data) {
        ofmessage.OFPT_HELLO = true
    })

    controller.on('OFPT_ECHO_REQUEST',
    function(socket, data) {
        controller.sendMessage(socket, ofm.echo)

    })

    controller.on('OFPT_FEATURES_REPLY',
    function(socket, data) {
        ofmessage.OFPT_FEATURES_REPLY = true
        console.dir(data)
        // var buf = ofm.unpackFeaturesReply(data)
    })

    controller.on('OFPT_PORT_STATUS ',
    function(socket, data) {
        ofmessage.got_OFPT_PORT_STATUS = true
        console.dir(data)
        // var buf = ofm.unpackFeaturesReply(data)
    })


    controller.on('OFPT_PACKET_IN',
    function(socket, data) {
        // var packetIn = ofm.unpackPacketIn(data)
        var pbuf = decoder.decodeethernet(data.buffer, 0)
        console.dir(pbuf)

    })

    
}

