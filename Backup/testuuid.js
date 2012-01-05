var uuid = require('node-uuid');
var util = require('util');

self = this
var sessions = []


function obj(a, b, c) {
	this.a = a
	this.b = b
	this.c = c

}


// var t = new obj() 
// t.a = "YYY"
// t.b = "DEF"
// t.id = uuid('binary') 

// var s = new obj("AAA", "XAAAXX", uuid('binary')) 
// sessions.push(t)   
// sessions.push(s)   
// sessions.push(s) 
// 
// console.dir(sessions)  
// sessions.pop()   
// console.dir(sessions)     
var what = new Object()
for (i = 1; i < 9; i++) {
	what[i] = new obj("XAAAXX", uuid('binary'))
	for (j = 1; j < 9; j++) {
		what[i][j] = new obj("AAAA", uuid('binary'))
	}
}

console.dir(what)


// if inst.st[dpid].has_key(srcaddr):
//      dst = inst.st[dpid][srcaddr] 


util.log("forloop")
for (x in what) {
	console.dir(what[x])
}


function dpid(a, b) {

	this.saddr = a
	this.port = b
}


var buf = []

buf['001'] = new dpid(1, "a")
buf['002'] = new dpid(2, "b")
bug['003'] = new dpid("")


// console.dir(Object.getOwnPropertyNames(buf))

for (var p in buf) {
	// console.log(Object.keys(buf[p]))
	console.log("saddr" in buf[p])
}


console.log("saddr" in buf)
// console.log(Object.getOwnPropertyNames(buf['000001']).sort())