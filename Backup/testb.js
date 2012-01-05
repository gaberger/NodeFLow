// if inst.st[dpid].has_key(srcaddr):
//         dst = inst.st[dpid][srcaddr]   // dst is port
//         if dst[0] != inport:

var MYNAMESPACE = {}
var NS = MYNAMESPACE


NS.A = "foo";


NS.dpid = "00001"
NS.saddr = "0abcde"

NS.btable = []
NS.btable[NS.dpid] = 1


var s = NS.btable[NS.dpid][NS.saddr] = 100


NS.bridge = function(){
	return  {
			dpid: 00001,  table : [{ saddr : "0001", inport : "a"},{saddr : "0002", inport : "a"}]
		}
	}


var addBridge = function(dpid, saddr, inport){
	var self = this
	self.dpid = dpid
	self.saddr = saddr
	self.inport = inport

	
}


var mydict = {
  'a': [3,5,6,43,3,6,3,],
  'b': [87,65,3,45,7,8],
  'c': [34,57,8,9,9,2],
};
for (var key in mydict) {
  console.log(key);
}

function extendObject(origin, add) {
  var keys = Object.keys(add),
      i = keys.length;
  while(i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}




var obj = new addBridge("00001", 'AAA', 'BBB')
all(obj)

extendObject(new addBridge("00001", 'AAA', 'BBB'), new addBridge("00001", 'ZZZ', 'BBZZZB'))



// var coll = 
// coll['00001'] =  new addBridge("00001","ABC","XYZ")
// coll['00002'] =  new addBridge("00001","DEF","LMN")
// coll['00001'] =  new addBridge("00001","ZZZ","XYZ")
// coll['00002'] =  new addBridge("00001","YYY","LMN")




// for (  var i in coll){
// 	console.log(coll[i])
// }




// 	return {
// 		'dpid' : dpid,
		  
// 			table : q
// 			[
// 			{ saddr : saddr, inport : inport},
// 			{ saddr : saddr, inport : inport}
// 			]

	
// }
// }

// function bCollection(collection){
// 	var obj = []
// 	this.Add = function(obj){
// 		push.collection
// 	}
// 	return obj
// }


// function x(a,b,c){
// 	var dpid = {}
// 	dpid.srcaddr = {}
// 	dpid.srcaddr.inport = a

// }






// for (i=00001; i <10; i++){
// 	var b = new bridge("00001", "ABCDE" + i, 1)
// 	var a = buf[b.dpid]
// 	a.push(b)
// }



// for (i in buf){
// 	console.dir(buf[i])
// 		// console.dir(buf[i].table)
// }


// console.dir(bridge.table)
// console.log(bridge)
// for (i in bridge){
// 	// console.log(bridge[i])
// 	// console.log(Object.keys(bridge.table[0]))
// 	for(n in bridge[i]){
// 		if('saddr' in bridge[i][n]){
// 			console.log(bridge[i][n])
// 		}
// 	}
// }
// console.log(bridge.hasOwnProperty("inport"))        



// console.dir("saddr" in buf)
// console.dir("saddr" in b)
// console.dir(buf[0])
// console.dir(Object.keys(buf))


// Array Matrix - Indexed.
Array.matrix = function (m, n, initial){
	var a, i, j, mat = [];
	for (i =0; i <m; i+=1){
			a = [];
		for(j=0; j<n; j+=1){
			a[j] = initial;
		}
		mat[i] = a
	}
	return mat;
}






