var express = require('express')
 var stylus = require('stylus')
 var nib = require('nib')
 var sio = require('socket.io')

 var util = require('util');




//Initialize Express
var app = express.createServer()
//Configure Express
 app.configure(function() {
    app.use(stylus.middleware({
        src: __dirname + 'webroot/public',
        compile: compile
    }))
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/public/views');
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