var clients = {}

var session = function(a, b, c) {
		this.inport = a
		this.outport = b
		this.address = c

	}


clients['000003'] = new Object()
clients['000003']["XXX"] = "01"
clients['000003']["JJJ"] = "02"
clients['000003']["FDD"] = "03"

clients['000002'] = new Object()
clients['000002']["AAA"] = "01"
clients['000002']["BBB"] = "02"
clients['000002']["CCC"] = "03"

// console.dir(clients)
// Object.keys(clients).forEach(function(index){
// 	console.log(clients[index].inport)
// })
var search = function(dpid, address) {

		Object.keys(clients).forEach(function(i) {
			console.log(clients[i])
			if (clients[i].hasOwnProperty('000003')) {
				Object.keys(clients[i]).forEach(function(j) {
					if (j == "XXX") {
						console.log(clients[i][j])
					}
				})
			}
		})
	}

search('000003', "XXX")

// console.log(clients[index].inport)

// Object.keys(clients).forEach(function(id) {
//                                         var client = clients[id];
//                                         if (client.started) {
//                                             client.socket.emit('ofProxySessionUpdate', oflib.JSON.stringify(session));
//                                         }
//                                     });