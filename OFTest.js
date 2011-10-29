// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var sys = require('sys');
var util = require('util');

var controller = require("./lib/OFController");
var dataHandler = require("./lib/dataHandler");

//Globals
var port = "6633"


//Domain Class
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


var ctrl1 = controller.create()

 debugger



var startController = function() { 
	debugger
    var self = this;
    var server;

    var socketHandler = function(socket) {

        socket.on('connect',
        function() {
            util.log("Received Connect")
            ctrl1.sendHello(socket)
            setTimeout(function() {
                socket.write("close")
            },
            20000)

        })
    }

    var run = function() {
        server = net.createServer().addListener("socket", socketHandler) 
		server.listen(6633)
//.listen(6633);
  		debugger 
	   
		// console.log("opened server on %j", address);
    }

    run();

}

controller = new startController()

// var server = net.createServer(function(socket) {
//
//     socket.on('connect',
//     function() {
//         util.log("Received Connect")
//         ctrl1.sendHello(socket)
//         setTimeout(function() {
//             socket.write("close")
//         },
//         20000)
//     })
//
//
//     socket.on('data',
//     function(data) {
//         data.copy(OF_MESSAGE.version, 0, 0, 1);
//         data.copy(OF_MESSAGE.type, 0, 1, 2)
//
//         var OF_TYPE = OF_MESSAGE.type[0]
//
//         switch (OF_TYPE) {
//         case 0x00:
//             util.log("HELLO");
//             ctrl1.sendHello(socket)
//             ctrl1.featureRequest(socket)
//             break;
//         }
//     })
// })
//
//  server.listen(port,
// function() {
//     address = server.address();
//     console.log("opened server on %j", address);
// });
//
//
// server.addListener("close",
// function(data) {
//     util.log("Disconnected");
// });
