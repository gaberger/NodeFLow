// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
// Load Libs
var express = require('express')
 var stylus = require('stylus')
 var nib = require('nib')
 var io = require('socket.io')
 var ofc = require('./lib/nodeflow.js')
var ofl = require('./lib/oflib.js') 
var ofm = require('./lib/ofmessage.js')
var decoder = require('./lib/decoder.js')
var util = require('util');

//Event Handlers
var address = '10.8.3.119'
var port = 6633
 
//Initialize Controller

controller = ofc.createServer(address, port) 


//Event Listeners

controller.on('HELLO', function(socket, data) { 
    controller.sendMessage(socket, ofm.hello) 
	controller.sendMessage(socket, ofm.featurerequest)

})  
controller.on('ECHO', function(socket, data) { 
    controller.sendMessage(socket, ofm.echo)

})  
controller.on('FEATUREREPLY', function(socket, data) {
	var buf = ofm.unpackFeaturesReply(data)
	console.log(buf)     
})
        
controller.on('PACKETIN', function(socket, data) { 
    var packetIn = ofm.unpackPacketIn(data)
   	var pack_buf = ofm.unpackPacketBuffer(data, packetIn.length) 
   	var pbuf = decoder.decodeethernet(pack_buf, 0) 
    console.log(packetIn)
    console.log(pbuf) 
                                             
    	
}) 


// //Initialize Express
// var app = express.createServer()
// //Configure Express
//  app.configure(function() {
//     app.use(stylus.middleware({
//         src: __dirname + '/public',
//         compile: compile
//     }))
//     app.use(express.static(__dirname + '/public'));
//     app.set('views', __dirname);
//     app.set('view engine', 'jade');
// 
//     function compile(str, path) {
//         return stylus(str)
//         .set('filename', path)
//         .use(nib());
//     };
// });
// 
// //Routes
// app.get('/',
// function(req, res) {
//     res.render('index', {
//         layout: false
//     });
// });
// 
// app.get('/riak',
// function(req, res) {
//     res.render('db', {
//         layout: false
//     });
// });
// 
// //Listeners
// app.listen(3000,
// function() {
//     var addr = app.address();
//     console.log('   WebServer listening on http://' + addr.address + ':' + addr.port);
// });
// 
//        
//
//
//  io.sockets.on('connection',
// function(socket) {
//     var controllerInstance = server.startServer(socket)
// });
//
