// 
// var util = require('util');
// var binary = require('binary');  
// 
// buf = [0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00] 
// 
// var OF_MESSAGE = binary.parse(buf)
// 	.word8('Version')
// 	.word8('Type')
// 	.word16lu('length')
//     .word32lu('xid')
//     .OF_MESSAGE
// ;   
// 
// 
// debugger
// 
// console.dir(OF_MESSAGE)   
//                            

var buf = new Buffer([ 0x01, 0x03, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00 ]);

var Binary = require('binary');
var OF_MESSAGE = Binary.parse(buf)
    .word8('Version')
    .word8('type')
    .word16bu('length')
	.word32bu('xid')
    .vars
;
console.dir(OF_MESSAGE);  
console.log(OF_MESSAGE.type)