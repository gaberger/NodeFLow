// Load Libs
var express = require('express')
 var stylus = require('stylus')
 var nib = require('nib')
 var io = require('socket.io')
 var ofc = require('./lib/nodeflow.js')
 var net = require('net');

//Initialize Express
var app = express.createServer()
 var net = net.createServer()

//Configure Express
 app.configure(function() {
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: compile
    }))
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname);
    app.set('view engine', 'jade');

    function compile(str, path) {
        return stylus(str)
        .set('filename', path)
        .use(nib());
    };
});

//Routes
app.get('/',
function(req, res) {
    res.render('index', {
        layout: false
    });
});

//Listeners
app.listen(3000,
function() {
    var addr = app.address();
    console.log('   app listening on http://' + addr.address + ':' + addr.port);
});



//start controller and socket.io service
var io = io.listen(app)

 var server = new ofc('10.8.3.119', 6633)


 io.sockets.on('connection',
function(socket) {
    var controllerInstance = server.startServer(socket)
});

