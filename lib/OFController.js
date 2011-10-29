var events = require('events'); 
var util = require('util');


//Pseudo-Class
var OFController = function() {
    // events.EventEmitter.call(this);
    }

// OFController.prototype = new events.EventEmitter();
OFController.prototype.sendHello = function(socket) {
    if (socket) {
        buf_OF_HELLO = [0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
        var OF_HELLO = new Buffer(buf_OF_HELLO)
        util.log('HELLO')
        socket.write(OF_HELLO)
    }

}

OFController.prototype.handleDataStream = function(socket) {
    if (socket) {
        console.log(socket)
    }

}

OFController.prototype.featureRequest = function(socket) {
    if (socket) {
        buf_OF_FEAT_REQ = [0x01, 0x05, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]
        var OF_FEAT_REQ = new Buffer(buf_OF_FEAT_REQ)
        util.log("FEATURE_REQUEST")
        socket.write(OF_FEAT_REQ)
    }
}

module.exports.create = function() {
    return new OFController();
}



