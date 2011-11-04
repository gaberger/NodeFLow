

var util = require('util');
var events = require('events');


var buf = new Buffer("0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF")
// console.log(buf)
// decode.packetDecode(buf)
// decode.packetDecode1(buf) 
// var pk = ofm.unpackHeader(buf) 
// console.dir(pk)

// pcap.dump_bytes(buf,0) 

// console.log(util.inspect(pcap, true, null)) 

 

//Constructor
 function TestEmit() {
    events.EventEmitter.call(this); 
}   
util.inherits(TestEmit, events.EventEmitter);  

module.exports.Start = function(){
	   var s =  new TestEmit()  
	   return s
}

TestEmit.prototype.testemit = function(data) {
	this.emit('hello', data)
}    

module.exports.TestEmit = TestEmit


this.testemit("Hello Hello") 
  

