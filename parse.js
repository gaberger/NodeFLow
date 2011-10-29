var buf = new Buffer([ 97, 98, 99, 100, 101, 102, 0 ]);
     


var Binary = require('binary');
var vars = Binary.parse(buf)
	.word8('Version')
	.word8('Type')
	.word16lu('length')
    .word16ls('ab')
    .word32bu('cf')
    .word8('x')
    .vars
;
console.dir(vars);
