


var decode = require('./packetdecode.js');     
var ofm = require('./ofmessage.js')



var buf = new Buffer("0xFF, 0xFF, 0xFF, 0xFF, 0xAA, 0xAA, 0xAA, 0xAA")
// console.log(buf)
decode.packetDecode(buf)
decode.packetDecode1(buf)   
var pk = ofm.unpackHeader(buf) 
console.dir(pk)

