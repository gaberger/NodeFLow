var Hook = require('hook.io').Hook;   
var util = require('util');
var decode = require('./decoder.js')



var NodeFlowClient = exports.NodeFlowClient = function (options) { 
	var self=this
  
	Hook.call(this, options);
	
    self.on('hook::ready', function() {
    			self._startClient()
	 })
	
}
	
   util.inherits(NodeFlowClient, Hook)    


NodeFlowClient.prototype._startClient = function() { 
	var self=this 
	var bridgetable = []
	
	self.on("nodeflow::server::OFPT_PACKET_IN", function(obj){



		var packet = decode.decodeethernet(obj.message.message.body.data, 0)
		var dlsource = packet.shost
		
		var inport = obj.message.message.body.in_port
		var dpid = obj.dpid
		util.log(dpid + ":" + dlsource)
		
		bridgetable[dpid] = new self._dpmap(dlsource, inport)
		
		var packetOut = self._setOutFloodPacket(obj.message)
		console.dir(bridgetable)
		self.emit("nodeflow::client::sendPacket", {"data": packetOut, "sessionID" : obj.sessionID })
	}) 
	self.on("nodeflow::server::OFPT_FEATURES_REPLY", function(msg){
	   
	})
	
}


NodeFlowClient.prototype._dpmap = function(dlsource, dpid, inport){
	this.dlsource =  dlsource
	this.dpid = dpid
	this.inport = inport
}



NodeFlowClient.prototype._setOutFloodPacket = function(msg)  {
   this.message = msg
	
	return {
            message: {
		        header: {
		            type: 'OFPT_PACKET_OUT',
		            xid: msg.message.header.xid
		        },
		        body: {
		            buffer_id: msg.message.body.buffer_id,
		            in_port: msg.message.body.in_port,
		            actions: [
		            {
		                header: {
		                    type: 'OFPAT_OUTPUT'
		                },
		                body: {
		                    port: 'OFPP_FLOOD'
		                },
		            }
		            ]
		        },
		        version: 0x00
		    }
		}
	

}   
	