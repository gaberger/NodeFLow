// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
// Load Libs
var express = require('express')
 var stylus = require('stylus')
 var nib = require('nib')
 var sio = require('socket.io')
 var nc = require('./nodeController.js')
 var util = require('util');

//Globals
var address = '10.8.3.119'
var port = 6633


//Initialize Express
var app = express.createServer()
//Configure Express
 app.configure(function() {
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: compile
    }))
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    function compile(str, path) {
        return stylus(str)
        .set('filename', path)
        .use(nib());
    };
});

//Listeners
app.listen(3000,
function() {
    var addr = app.address();
    util.log('WebServer listening on http://' + addr.address + ':' + addr.port);
});


//Routes
app.get('/',
function(req, res) {
    res.render('index', {
        title: 'NodeFlow'
    })
});
app.get('/test',
function(req, res) {
    res.render('test', {
        title: 'test'
    })
});

app.get('/riak',
function(req, res) {
    res.render('db', {
        layout: false
    });
});


var io = sio.listen(app)

// Working
 var controller = new nc.NodeController();

controller.startController(address, port);

controller.on('OFPT_HELLO',
function(data) { 
	 io.sockets.emit('message', 'HELLO');  
})


 controller.on('OFPT_ECHO_REQUEST',
function(data) { 
	 io.sockets.emit('message', 'ECHO'); 
})

 controller.on('OFPT_PACKET_IN',
function(data) {
   io.sockets.emit('user_message', 'PACKET_IN');    
})



