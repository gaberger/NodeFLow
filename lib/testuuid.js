var uuid = require('node-uuid');
var util = require('util');

self = this
var sessions = []


function obj(a,b,c) {   
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
for (i=1; i<9; i++){
	what[i] =  new obj("XAAAXX", uuid('binary'))   
	for(j=1; j<9; j++){   
		what[i][j] =  new obj("AAAA", uuid('binary'))  	
	}
}

console.dir(what)  
  

util.log("forloop")
for ( x in what){
	console.dir(what[x])
}




