var t = require('./testServer.js');
var util = require('util');

s = t.Start()

console.log(util.inspect(s, true, null))
// var a = s.Start() 

// console.log("S" + util.inspect(sess, true, null)) 

s.on('hello', function(data){
	console.log(data)
}) 
                          
console.log(s)

s.testemit("Hello Goodbye")       